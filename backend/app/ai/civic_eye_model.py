"""
CivicEye AI — Road Damage Object Detection via HuggingFace YOLO.

Primary model : nsr51324/Road_Damage_Object_Detection  (YOLOv8)
  Classes     : D00 (Longitudinal Crack), D10 (Transverse Crack),
                D20 (Alligator Crack),    D40 (Pothole / other)

Fallback chain:
  1. HuggingFace Road Damage YOLO  (best.pt)
  2. Local generic YOLOv8n          (yolov8n.pt – COCO)
  3. Heuristic engine               (deterministic demo, always succeeds)

The model is loaded in a background thread on first import so FastAPI
startup is never blocked.
"""

from __future__ import annotations

import io
import base64
import threading
from typing import Dict, Any, List, Optional, Tuple

# ──────────────────────────────────────────────────────────────────────────────
# Optional heavy imports — only error at call-time, not at import
# ──────────────────────────────────────────────────────────────────────────────
try:
    from PIL import Image, ImageDraw, ImageFont
    _PIL_OK = True
except ImportError:
    Image = ImageDraw = ImageFont = None  # type: ignore
    _PIL_OK = False

# ──────────────────────────────────────────────────────────────────────────────
# Civic category metadata — internal key → display info & priority
# ──────────────────────────────────────────────────────────────────────────────
CIVIC_CATEGORIES_MAP: Dict[str, Dict[str, str]] = {
    "pothole": {
        "label": "Pothole & Road Damage",
        "category": "Potholes & Road Damage",
        "priority": "high",
    },
    "road_crack": {
        "label": "Road Crack / Surface Damage",
        "category": "Potholes & Road Damage",
        "priority": "medium",
    },
    "alligator_crack": {
        "label": "Alligator / Fatigue Cracking",
        "category": "Potholes & Road Damage",
        "priority": "high",
    },
    "longitudinal_crack": {
        "label": "Longitudinal Road Crack",
        "category": "Potholes & Road Damage",
        "priority": "medium",
    },
    "transverse_crack": {
        "label": "Transverse Road Crack",
        "category": "Potholes & Road Damage",
        "priority": "medium",
    },
    "garbage": {
        "label": "Overflowing Garbage / Waste",
        "category": "Waste & Garbage",
        "priority": "medium",
    },
    "water_leakage": {
        "label": "Water Pipe Leakage / Drainage",
        "category": "Water Leakage & Drainage",
        "priority": "high",
    },
    "damaged_streetlight": {
        "label": "Damaged Streetlight / Electrical Hazard",
        "category": "Streetlight & Electrical",
        "priority": "critical",
    },
    "vandalism": {
        "label": "Vandalism / Facility Damage",
        "category": "Public Facilities",
        "priority": "low",
    },
}

# ──────────────────────────────────────────────────────────────────────────────
# Road Damage model class name → internal civic key
#   Model classes (nsr51324/Road_Damage_Object_Detection):
#     D00 = Longitudinal Crack, D10 = Transverse Crack,
#     D20 = Alligator Crack,   D40 = Pothole / other
# ──────────────────────────────────────────────────────────────────────────────
ROAD_DAMAGE_CLASS_MAP: Dict[str, str] = {
    # Standard codes
    "d00": "longitudinal_crack",
    "d10": "transverse_crack",
    "d20": "alligator_crack",
    "d40": "pothole",
    # Human-readable variants
    "longitudinal crack": "longitudinal_crack",
    "transverse crack":   "transverse_crack",
    "alligator crack":    "alligator_crack",
    "pothole":            "pothole",
    "road damage":        "pothole",
    "crack":              "road_crack",
}

# Confidence threshold — detections below this are ignored
CONFIDENCE_THRESHOLD: float = 0.25

# Box colours per priority (RGB)
PRIORITY_COLOURS: Dict[str, Tuple[int, int, int]] = {
    "critical": (220, 38, 38),   # red
    "high":     (234, 88, 12),   # orange
    "medium":   (202, 138, 4),   # amber
    "low":      (37, 99, 235),   # blue
}


# ──────────────────────────────────────────────────────────────────────────────
class CivicEyeDetector:
    """
    Civic issue detector using HuggingFace Road Damage YOLO model.

    Model load order:
      1. HuggingFace  nsr51324/Road_Damage_Object_Detection  (best.pt)
      2. Local generic YOLOv8n (COCO)
      3. Heuristic deterministic engine

    Loading happens in a background daemon thread so FastAPI startup
    is not blocked.  `is_ready` is False until loading completes.
    """

    def __init__(self) -> None:
        self.model: Any = None
        self.model_source: str = "loading"
        self.is_ready: bool = False
        self._error: Optional[str] = None
        self._lock = threading.Lock()

        # Kick off model loading in background
        t = threading.Thread(target=self._load_model_chain, daemon=True, name="civic-eye-loader")
        t.start()

    # ── Model Loading ─────────────────────────────────────────────────────────

    def _load_model_chain(self) -> None:
        """Try each model source in priority order."""
        if self._try_huggingface():
            return
        if self._try_local_yolo():
            return
        # Both failed — use heuristic
        with self._lock:
            self.model = None
            self.model_source = "heuristic"
            self.is_ready = True
        print("[INFO] CivicEye: All YOLO models unavailable. Falling back to heuristic engine.")

    def _try_huggingface(self) -> bool:
        """Download & load Road Damage YOLO from HuggingFace Hub."""
        try:
            from ultralytics import YOLO
            from huggingface_hub import hf_hub_download

            print("[INFO] CivicEye: Downloading Road Damage model from HuggingFace Hub …")
            weights_path = hf_hub_download(
                repo_id="nsr51324/Road_Damage_Object_Detection",
                filename="runs/detect/yolov8_road/weights/best.pt",
            )
            loaded_model = YOLO(weights_path)
            with self._lock:
                self.model = loaded_model
                self.model_source = "huggingface_road_damage"
                self.is_ready = True
            print(
                f"[OK] CivicEye: HuggingFace Road Damage YOLO loaded — "
                f"classes: {list(loaded_model.names.values())}"
            )
            return True
        except Exception as err:
            print(f"[WARN] CivicEye: HuggingFace load failed — {err}")
            self._error = str(err)
            return False

    def _try_local_yolo(self) -> bool:
        """Load the generic YOLOv8n COCO model as a fallback."""
        try:
            from ultralytics import YOLO

            loaded_model = YOLO("yolov8n.pt")
            with self._lock:
                self.model = loaded_model
                self.model_source = "yolov8n_coco"
                self.is_ready = True
            print("[OK] CivicEye: Fallback YOLOv8n (COCO) model loaded.")
            return True
        except Exception as err:
            print(f"[WARN] CivicEye: YOLOv8n fallback load failed — {err}")
            return False

    # ── Public API ────────────────────────────────────────────────────────────

    def get_status(self) -> Dict[str, Any]:
        """Return the current loader / model status."""
        with self._lock:
            return {
                "is_ready": self.is_ready,
                "model_source": self.model_source,
                "model_classes": (
                    list(self.model.names.values()) if self.model else []
                ),
                "error": self._error,
            }

    def analyze_image(self, file_bytes: bytes) -> Dict[str, Any]:
        """
        Run object detection on image bytes.

        Returns:
            {
                detected_issue      : str,
                confidence_score    : float,   # 0.0 – 1.0
                suggested_category  : str,
                priority            : str,     # low|medium|high|critical
                labels              : List[str],
                bounding_boxes      : List[Dict],
                model_source        : str,
                annotated_image_b64 : Optional[str],  # base-64 JPEG of annotated image
            }
        """
        with self._lock:
            model = self.model
            source = self.model_source

        if model is not None and _PIL_OK:
            return self._run_yolo(file_bytes, model, source)

        # Model not loaded yet or PIL unavailable
        return self._heuristic_analysis(file_bytes)

    # ── Internal Helpers ──────────────────────────────────────────────────────

    def _run_yolo(self, file_bytes: bytes, model: Any, source: str) -> Dict[str, Any]:
        """Run YOLO inference and return structured result with annotated image."""
        try:
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            results = model(img, verbose=False, conf=CONFIDENCE_THRESHOLD)

            boxes_data: List[Dict[str, Any]] = []
            detected_keys: List[str] = []
            max_conf = 0.0

            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    raw_class = model.names.get(cls_id, "unknown")
                    conf = float(box.conf[0])

                    if conf < CONFIDENCE_THRESHOLD:
                        continue

                    if conf > max_conf:
                        max_conf = conf

                    civic_key = self._resolve_civic_key(raw_class)
                    label_info = CIVIC_CATEGORIES_MAP.get(
                        civic_key,
                        {
                            "label": raw_class.replace("_", " ").title(),
                            "category": "Road Damage",
                            "priority": "medium",
                        },
                    )
                    detected_keys.append(civic_key)
                    xyxy = box.xyxy[0].tolist()
                    boxes_data.append(
                        {
                            "box": [round(v, 2) for v in xyxy],
                            "label": label_info["label"],
                            "confidence": round(conf, 3),
                            "priority": label_info["priority"],
                        }
                    )

            if detected_keys:
                # Primary issue = first (highest-score) detection
                primary_key = detected_keys[0]
                primary_info = CIVIC_CATEGORIES_MAP.get(
                    primary_key,
                    {
                        "label": primary_key.replace("_", " ").title(),
                        "category": "Potholes & Road Damage",
                        "priority": "high",
                    },
                )
                unique_labels = list(
                    {
                        CIVIC_CATEGORIES_MAP.get(k, {}).get("label", k)
                        for k in detected_keys
                    }
                )
                annotated_b64 = self._draw_boxes(img, boxes_data)
                return {
                    "detected_issue": primary_info["label"],
                    "confidence_score": round(max_conf, 3),
                    "suggested_category": primary_info["category"],
                    "priority": primary_info["priority"],
                    "labels": unique_labels,
                    "bounding_boxes": boxes_data,
                    "model_source": source,
                    "annotated_image_b64": annotated_b64,
                    "total_detections": len(boxes_data),
                }

            # Model ran but found nothing
            return {
                "detected_issue": "No Road Damage Detected",
                "confidence_score": 0.0,
                "suggested_category": "Potholes & Road Damage",
                "priority": "low",
                "labels": [],
                "bounding_boxes": [],
                "model_source": source,
                "annotated_image_b64": None,
                "total_detections": 0,
            }

        except Exception as exc:
            print(f"[WARN] CivicEye: YOLO inference error — {exc}. Using heuristic fallback.")
            return self._heuristic_analysis(file_bytes)

    def _draw_boxes(self, img: Any, boxes_data: List[Dict[str, Any]]) -> Optional[str]:
        """
        Draw bounding boxes + labels on a copy of the PIL image.
        Returns the annotated image as a base-64 encoded JPEG string,
        or None if drawing fails.
        """
        try:
            annotated = img.copy()
            draw = ImageDraw.Draw(annotated)

            # Try to get a decent font; fall back to default if unavailable
            try:
                font = ImageFont.truetype("arial.ttf", size=14)
                font_small = ImageFont.truetype("arial.ttf", size=11)
            except Exception:
                font = ImageFont.load_default()
                font_small = font

            for item in boxes_data:
                x1, y1, x2, y2 = item["box"]
                colour = PRIORITY_COLOURS.get(item.get("priority", "medium"), (202, 138, 4))
                label_text = f"{item['label']} {item['confidence']:.0%}"

                # Box outline (3 px thick)
                for offset in range(3):
                    draw.rectangle(
                        [x1 - offset, y1 - offset, x2 + offset, y2 + offset],
                        outline=colour,
                    )

                # Label background
                try:
                    bbox = font.getbbox(label_text)
                    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                except Exception:
                    tw, th = len(label_text) * 7, 14

                label_y = max(0, y1 - th - 6)
                draw.rectangle([x1, label_y, x1 + tw + 8, label_y + th + 6], fill=colour)
                draw.text((x1 + 4, label_y + 2), label_text, fill=(255, 255, 255), font=font)

            # Encode to JPEG base64
            buf = io.BytesIO()
            annotated.save(buf, format="JPEG", quality=85)
            return base64.b64encode(buf.getvalue()).decode("utf-8")

        except Exception as draw_err:
            print(f"[WARN] CivicEye: box drawing error — {draw_err}")
            return None

    def _resolve_civic_key(self, raw_class: str) -> str:
        """
        Map a raw model class name to an internal civic category key.
        Handles Road Damage codes (D00/D10/D20/D40) and COCO names.
        """
        normalized = raw_class.strip().lower()

        if normalized in ROAD_DAMAGE_CLASS_MAP:
            return ROAD_DAMAGE_CLASS_MAP[normalized]

        if "pothole" in normalized:
            return "pothole"
        if "alligator" in normalized or "fatigue" in normalized:
            return "alligator_crack"
        if "longitudinal" in normalized:
            return "longitudinal_crack"
        if "transverse" in normalized:
            return "transverse_crack"
        if "crack" in normalized or "damage" in normalized or "road" in normalized:
            return "road_crack"
        if "garbage" in normalized or "trash" in normalized or "waste" in normalized:
            return "garbage"
        if "water" in normalized or "leak" in normalized or "drain" in normalized:
            return "water_leakage"
        if "light" in normalized or "electric" in normalized:
            return "damaged_streetlight"

        # COCO class proxies for yolov8n fallback
        coco_proxies: Dict[str, str] = {
            "car":          "pothole",
            "truck":        "pothole",
            "fire hydrant": "water_leakage",
            "stop sign":    "damaged_streetlight",
        }
        return coco_proxies.get(normalized, "road_crack")

    def _heuristic_analysis(self, file_bytes: bytes) -> Dict[str, Any]:
        """
        Deterministic heuristic engine — used when YOLO is unavailable.
        Produces realistic demo output based on image file size so results
        are consistent for the same input.
        """
        content_len = len(file_bytes)
        keys = list(CIVIC_CATEGORIES_MAP.keys())
        selected_key = keys[content_len % len(keys)]
        info = CIVIC_CATEGORIES_MAP[selected_key]

        # Confidence in range 0.72 – 0.93 (lower than real model to distinguish)
        seed_val = (content_len * 31) % 22
        confidence = round(0.72 + (seed_val * 0.01), 2)

        return {
            "detected_issue": info["label"],
            "confidence_score": confidence,
            "suggested_category": info["category"],
            "priority": info["priority"],
            "labels": [info["label"], "Civic Infrastructure Defect"],
            "bounding_boxes": [
                {
                    "box": [120.5, 80.2, 450.0, 390.8],
                    "label": info["label"],
                    "confidence": confidence,
                    "priority": info["priority"],
                }
            ],
            "model_source": "heuristic",
            "annotated_image_b64": None,
            "total_detections": 1,
        }


# ── Global singleton — model loads in background thread on import ──────────────
civic_eye_detector = CivicEyeDetector()
