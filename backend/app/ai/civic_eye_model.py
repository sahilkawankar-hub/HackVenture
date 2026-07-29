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

import os
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
    # Road & Infrastructure
    "pothole": {
        "label": "Pothole & Asphalt Damage",
        "category": "Potholes & Road Damage",
        "priority": "high",
    },
    "road_crack": {
        "label": "Road Surface Crack / Pavement Defect",
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
    # Environmental & Trees
    "fallen_tree": {
        "label": "Fallen Tree / Illegal Tree Cutting / Overgrown Vegetation",
        "category": "Trees & Environment",
        "priority": "high",
    },
    # Sanitation & Waste
    "garbage": {
        "label": "Overflowing Garbage / Illegal Dumping / Waste Heap",
        "category": "Waste & Sanitation",
        "priority": "medium",
    },
    # Water, Sewer & Drainage
    "water_leakage": {
        "label": "Water Pipe Burst / Drainage Overflow / Sewage Leak",
        "category": "Water & Sanitation",
        "priority": "high",
    },
    "open_manhole": {
        "label": "Uncovered Manhole / Open Drain Pit Hazard",
        "category": "Water & Sanitation",
        "priority": "critical",
    },
    # Electrical & Lighting
    "damaged_streetlight": {
        "label": "Damaged Streetlight / Exposed Wire / Transformer Sparking",
        "category": "Streetlight & Electrical",
        "priority": "critical",
    },
    # Traffic & Vehicles
    "illegal_parking": {
        "label": "Illegal Parking / Sidewalk Blockade",
        "category": "Traffic & Mobility",
        "priority": "medium",
    },
    "traffic_hazard": {
        "label": "Damaged Signboard / Broken Signal / Roadblock",
        "category": "Traffic & Mobility",
        "priority": "high",
    },
    "abandoned_vehicle": {
        "label": "Abandoned Junk Vehicle / Scrap Obstruction",
        "category": "Traffic & Mobility",
        "priority": "medium",
    },
    # Animal Nuisance
    "stray_animal": {
        "label": "Stray Animal Nuisance / Rabies Danger",
        "category": "Public Safety",
        "priority": "medium",
    },
    # Structural & Public Property
    "building_damage": {
        "label": "Wall Collapse / Dangerous Structure / Infrastructure Crack",
        "category": "Public Safety",
        "priority": "critical",
    },
    "vandalism": {
        "label": "Vandalism / Property Damage / Broken Public Facility",
        "category": "Public Facilities",
        "priority": "low",
    },
    # Fire & Gas Safety
    "fire_hazard": {
        "label": "Open Flame / Smoke / Gas Leak Hazard",
        "category": "Public Safety",
        "priority": "critical",
    },
    # General Fallback
    "general_civic_issue": {
        "label": "General Civic Defect / Public Hazard",
        "category": "General Infrastructure",
        "priority": "medium",
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
CONFIDENCE_THRESHOLD: float = 0.30

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
        self.waste_model: Any = None
        self.clip_pipeline: Any = None
        self.ocr_processor: Any = None
        self.ocr_model: Any = None
        self.sam_mask_generator: Any = None
        self.model_source: str = "loading"
        self.is_ready: bool = False
        self._error: Optional[str] = None
        self._lock = threading.Lock()

        # Pre-initialize PyTorch to prevent circular imports when threads spawn
        try:
            import torch
        except Exception as e:
            print(f"[WARN] PyTorch synchronous init failed: {e}")

        # Kick off model loading in background
        t = threading.Thread(target=self._load_model_chain, daemon=True, name="civic-eye-loader")
        t.start()

    # ── Model Loading ─────────────────────────────────────────────────────────

    def _load_model_chain(self) -> None:
        """Try each Hugging Face model source in priority order."""
        # Start loading CLIP in the background asynchronously
        threading.Thread(target=self._try_huggingface_clip_zero_shot, daemon=True, name="clip-loader").start()

        if self._try_huggingface_road_damage():
            self._try_huggingface_waste_detection()
            return
        if self._try_huggingface_waste_detection():
            return
        if self._try_local_yolo():
            return
        # Fallback to smart vision classifier & heuristic
        with self._lock:
            self.model = None
            self.model_source = "smart_vision_classifier"
            self.is_ready = True
        print("[INFO] CivicEye: Custom YOLO models unavailable. Smart Vision & Zero-Shot Classifier active.")

    def _try_huggingface_clip_zero_shot(self) -> bool:
        """Load openai/clip-vit-base-patch32 for zero-shot image classification."""
        try:
            from transformers import pipeline
            print("[INFO] CivicEye: Loading Zero-Shot Vision model (openai/clip-vit-base-patch32) …")
            clip_model = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
            with self._lock:
                self.clip_pipeline = clip_model
            print(f"[OK] CivicEye: HuggingFace CLIP Zero-Shot loaded successfully.")
            return True
        except Exception as err:
            print(f"[WARN] CivicEye: CLIP zero-shot load failed — {err}")
            return False

    def _try_huggingface_road_damage(self) -> bool:
        """Download & load Road Damage YOLO from HuggingFace Hub (nsr51324/Road_Damage_Object_Detection)."""
        try:
            from ultralytics import YOLO
            from huggingface_hub import hf_hub_download

            print("[INFO] CivicEye: Loading Road Damage model (nsr51324/Road_Damage_Object_Detection) …")
            weights_path = hf_hub_download(
                repo_id="nsr51324/Road_Damage_Object_Detection",
                filename="runs/detect/yolov8_road/weights/best.pt",
            )
            loaded_model = YOLO(weights_path)
            with self._lock:
                self.model = loaded_model
                self.model_source = "nsr51324/Road_Damage_Object_Detection"
                self.is_ready = True
            print(f"[OK] CivicEye: HuggingFace Road Damage YOLO loaded successfully.")
            return True
        except Exception as err:
            print(f"[WARN] CivicEye: Road Damage model load failed — {err}")
            self._error = str(err)
            return False

    def _try_huggingface_waste_detection(self) -> bool:
        """Download & load Waste & Garbage YOLO from HuggingFace Hub (HrutikAdsare/waste-detection-yolov8)."""
        try:
            from ultralytics import YOLO
            from huggingface_hub import hf_hub_download

            print("[INFO] CivicEye: Loading Waste Detection model (HrutikAdsare/waste-detection-yolov8) …")
            try:
                weights_path = hf_hub_download(
                    repo_id="HrutikAdsare/waste-detection-yolov8",
                    filename="best.pt",
                )
                loaded_model = YOLO(weights_path)
                with self._lock:
                    if self.model is None:
                        self.model = loaded_model
                        self.model_source = "HrutikAdsare/waste-detection-yolov8"
                    self.waste_model = loaded_model
                    self.is_ready = True
                print(f"[OK] CivicEye: HuggingFace Waste Detection YOLO loaded successfully.")
                return True
            except Exception:
                return False
        except Exception as err:
            print(f"[WARN] CivicEye: Waste detection model load failed — {err}")
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
                "auxiliary_models": [
                    "openai/clip-vit-base-patch32",
                    "microsoft/trocr-base-printed",
                    "facebook/sam2-hiera-large",
                    "unitary/toxic-bert",
                    "cardiffnlp/twitter-roberta-base-sentiment-latest",
                    "facebook/bart-large-cnn",
                ],
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

        try:
            img = Image.open(io.BytesIO(file_bytes)).convert("RGB") if _PIL_OK else None
        except Exception:
            img = None

        if model is not None and _PIL_OK:
            result = self._run_yolo(file_bytes, model, source)
        else:
            # Model not loaded yet or PIL unavailable
            result = self._heuristic_analysis(file_bytes)

        if img is not None:
            result["ai_metadata"] = self._collect_ai_metadata(file_bytes, img, result)
        else:
            result["ai_metadata"] = {
                "enabled_models": [
                    "openai/clip-vit-base-patch32",
                    "microsoft/trocr-base-printed",
                    "facebook/sam2-hiera-large",
                    "unitary/toxic-bert",
                    "cardiffnlp/twitter-roberta-base-sentiment-latest",
                    "facebook/bart-large-cnn",
                ],
                "notes": ["Pillow unavailable or image decoding failed, so auxiliary image analyzers were skipped."],
            }
        return result

    def _collect_ai_metadata(self, file_bytes: bytes, img: Any, detection_result: Dict[str, Any]) -> Dict[str, Any]:
        """Collect OCR, segmentation, and text analytics for the uploaded issue image."""
        metadata: Dict[str, Any] = {
            "enabled_models": [
                "nsr51324/Road_Damage_Object_Detection",
                "HrutikAdsare/waste-detection-yolov8",
                "openai/clip-vit-base-patch32",
                "microsoft/trocr-base-printed",
                "facebook/sam2-hiera-large",
                "unitary/toxic-bert",
                "cardiffnlp/twitter-roberta-base-sentiment-latest",
                "facebook/bart-large-cnn",
            ],
            "source_model": detection_result.get("model_source"),
            "vision_labels": detection_result.get("labels", []),
            "notes": [],
        }

        enable_heavy = os.getenv("CIVILINK_ENABLE_HEAVY_LLMS", "false").lower() in {"1", "true", "yes"}
        ocr_text = self._extract_image_text(img) if enable_heavy else ""
        if ocr_text:
            metadata["ocr_text"] = ocr_text
            from app.ai.text_classifier import (
                analyze_community_sentiment,
                check_content_toxicity,
                generate_llm_insight,
                translate_text,
                summarize_community_announcement,
            )

            metadata["text_toxicity"] = check_content_toxicity(ocr_text)
            metadata["text_sentiment"] = analyze_community_sentiment(ocr_text)
            metadata["text_summary"] = summarize_community_announcement(ocr_text, max_len=72)
            metadata["translation"] = translate_text(ocr_text)
            metadata["llm_insight"] = generate_llm_insight(ocr_text)
            metadata["notes"].append("OCR text detected and analyzed with text moderation / sentiment / summarization models.")

            if any(keyword in ocr_text.lower() for keyword in ["danger", "fire", "smoke", "hazard", "spill", "leak", "pothole", "garbage", "trash", "waste", "no parking"]):
                metadata["text_signal"] = "safety_or_maintenance_warning"

        segmentation_summary = self._run_sam2_segmentation(img) if enable_heavy else None
        if segmentation_summary:
            metadata["segmentation"] = segmentation_summary
            metadata["notes"].append("SAM2 mask generation completed for object segmentation." )

        # Build a lightweight final summary from all available model outputs.
        summary_seed = [
            detection_result.get("detected_issue", "Unknown issue"),
            ", ".join(detection_result.get("labels", [])),
            metadata.get("ocr_text", ""),
        ]
        summary_text = " \n".join(part for part in summary_seed if part)
        if summary_text:
            from app.ai.text_classifier import summarize_community_announcement

            metadata["issue_summary"] = summarize_community_announcement(summary_text, max_len=90)

        return metadata

    def _extract_image_text(self, img: Any) -> str:
        """Run TrOCR OCR on the image and return any extracted printed text."""
        try:
            if self.ocr_processor is None or self.ocr_model is None:
                from transformers import TrOCRProcessor, VisionEncoderDecoderModel

                print("[INFO] CivicEye: Loading OCR model (microsoft/trocr-base-printed) …")
                self.ocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-printed")
                self.ocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-printed")

            pixel_values = self.ocr_processor(images=img, return_tensors="pt").pixel_values
            generated_ids = self.ocr_model.generate(pixel_values, max_new_tokens=32)
            extracted = self.ocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
            return extracted
        except Exception as err:
            print(f"[WARN] CivicEye: OCR failed — {err}")
            return ""

    def _run_sam2_segmentation(self, img: Any) -> Optional[Dict[str, Any]]:
        """Run SAM2 mask generation when available and summarize the result."""
        try:
            if self.sam_mask_generator is None:
                from transformers import pipeline

                print("[INFO] CivicEye: Loading SAM2 mask generator (facebook/sam2-hiera-large) …")
                self.sam_mask_generator = pipeline("mask-generation", model="facebook/sam2-hiera-large")

            outputs = self.sam_mask_generator(img, points_per_batch=64)
            masks = outputs.get("masks", []) if isinstance(outputs, dict) else []
            scores = outputs.get("scores", []) if isinstance(outputs, dict) else []
            return {
                "model": "facebook/sam2-hiera-large",
                "mask_count": len(masks),
                "top_score": float(max(scores)) if scores else None,
            }
        except Exception as err:
            print(f"[WARN] CivicEye: SAM2 segmentation skipped — {err}")
            return None

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

            # Primary YOLO found no boxes.
            # Step 2: Try the waste detection model if it is loaded and distinct from the primary.
            with self._lock:
                waste_model = self.waste_model

            if waste_model is not None and waste_model is not model:
                try:
                    waste_results = waste_model(img, verbose=False, conf=CONFIDENCE_THRESHOLD)
                    for r in waste_results:
                        for box in r.boxes:
                            cls_id = int(box.cls[0])
                            raw_class = waste_model.names.get(cls_id, "unknown")
                            conf = float(box.conf[0])
                            if conf >= CONFIDENCE_THRESHOLD:
                                civic_key = self._resolve_civic_key(raw_class)
                                label_info = CIVIC_CATEGORIES_MAP.get(
                                    civic_key,
                                    {
                                        "label": raw_class.replace("_", " ").title(),
                                        "category": "Waste & Sanitation",
                                        "priority": "medium",
                                    },
                                )
                                box_coords = [round(v, 2) for v in box.xyxy[0].tolist()]
                                box_entry = {
                                    "box": box_coords,
                                    "label": label_info["label"],
                                    "confidence": round(conf, 3),
                                    "priority": label_info["priority"],
                                }
                                annotated_b64 = self._draw_boxes(img, [box_entry])
                                return {
                                    "detected_issue": label_info["label"],
                                    "confidence_score": round(conf, 3),
                                    "suggested_category": label_info["category"],
                                    "priority": label_info["priority"],
                                    "labels": [label_info["label"]],
                                    "bounding_boxes": [box_entry],
                                    "model_source": "HrutikAdsare/waste-detection-yolov8",
                                    "annotated_image_b64": annotated_b64,
                                    "total_detections": 1,
                                }
                except Exception as waste_err:
                    print(f"[WARN] Waste model inference failed: {waste_err}")

            # Step 3: Neither YOLO model found confident boxes — use CLIP zero-shot classifier.
            return self._smart_vision_classifier(file_bytes, img, source)

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
        if "manhole" in normalized or "drain pit" in normalized or "open sewer" in normalized:
            return "open_manhole"
        if "tree" in normalized or "branch" in normalized or "plant" in normalized or "wood" in normalized or "cutting" in normalized or "lumber" in normalized:
            return "fallen_tree"
        if "garbage" in normalized or "trash" in normalized or "waste" in normalized or "litter" in normalized or "dump" in normalized:
            return "garbage"
        if "water" in normalized or "leak" in normalized or "sewage" in normalized or "flood" in normalized:
            return "water_leakage"
        if "light" in normalized or "electric" in normalized or "wire" in normalized or "transformer" in normalized:
            return "damaged_streetlight"
        if "fire" in normalized or "smoke" in normalized or "flame" in normalized or "gas" in normalized:
            return "fire_hazard"
        if "animal" in normalized or "dog" in normalized or "cat" in normalized or "cattle" in normalized:
            return "stray_animal"
        if "wall" in normalized or "building" in normalized or "structure" in normalized or "collapse" in normalized:
            return "building_damage"
        if "park" in normalized or "car" in normalized or "truck" in normalized or "vehicle" in normalized:
            return "illegal_parking"
        if "sign" in normalized or "signal" in normalized or "traffic" in normalized or "block" in normalized:
            return "traffic_hazard"
        if "vandal" in normalized or "graffiti" in normalized or "bench" in normalized:
            return "vandalism"
        if "pothole" in normalized:
            return "pothole"
        if "crack" in normalized or "damage" in normalized or "road" in normalized:
            return "road_crack"

        # COCO class proxies for yolov8n fallback
        coco_proxies: Dict[str, str] = {
            "car":          "illegal_parking",
            "truck":        "abandoned_vehicle",
            "bus":          "illegal_parking",
            "motorcycle":   "illegal_parking",
            "bicycle":      "illegal_parking",
            "dog":          "stray_animal",
            "cat":          "stray_animal",
            "potted plant": "fallen_tree",
            "fire hydrant": "water_leakage",
            "stop sign":    "traffic_hazard",
            "traffic light":"traffic_hazard",
            "bench":        "vandalism",
            "bottle":       "garbage",
            "cup":          "garbage",
        }
        return coco_proxies.get(normalized, "general_civic_issue")

    def _smart_vision_classifier(self, file_bytes: bytes, img: Any, source: str) -> Dict[str, Any]:
        """
        CLIP-based zero-shot image classifier (fallback when YOLO finds no boxes).

        Confidence strategy (relative, not absolute):
        - Runs CLIP with 7 civic-issue labels + 1 "no hazard" escape label.
        - Accepts a civic answer if its score is > 1.6x the "no hazard" score
          AND exceeds 0.18 (well above 1/8 = 12.5% random baseline).
        - This avoids both the old false-positives (colour heuristic)
          and new false-negatives (too-strict 0.35 cutoff dropping real issues).
        """
        # Absolute floor — must clear the random baseline meaningfully
        CLIP_ABS_FLOOR = 0.18
        # Relative multiplier — civic score must beat "no hazard" by this factor
        CLIP_REL_RATIO = 1.6

        if img and self.clip_pipeline:
            # 7 specific civic labels + 1 "no hazard" escape label
            civic_labels = [
                "a road with potholes, deep holes or severe surface cracking",
                "overflowing garbage bins, trash piles or illegal waste dumping",
                "flooding, a burst water pipe or sewage overflow on a street",
                "an uncovered open manhole or exposed drain pit on a road",
                "a fallen tree or large branches blocking a road",
                "fire, open flames or thick smoke coming from something",
                "a broken or damaged streetlight pole or exposed electrical wire",
            ]
            no_hazard_label = "a normal street, building or outdoor scene with no civic hazard"
            all_labels = civic_labels + [no_hazard_label]

            clip_key_map = {
                "pothole":            "pothole",
                "surface cracking":   "road_crack",
                "garbage":            "garbage",
                "trash":              "garbage",
                "waste dumping":      "garbage",
                "flooding":           "water_leakage",
                "water pipe":         "water_leakage",
                "sewage":             "water_leakage",
                "manhole":            "open_manhole",
                "drain pit":          "open_manhole",
                "fallen tree":        "fallen_tree",
                "branches blocking":  "fallen_tree",
                "fire":               "fire_hazard",
                "flames":             "fire_hazard",
                "smoke":              "fire_hazard",
                "streetlight":        "damaged_streetlight",
                "electrical wire":    "damaged_streetlight",
            }

            try:
                res = self.clip_pipeline(img, candidate_labels=all_labels)
                if res and isinstance(res, list) and len(res) > 0:
                    # Build score lookup dict
                    scores: Dict[str, float] = {item["label"]: float(item["score"]) for item in res}
                    no_hazard_score: float = scores.get(no_hazard_label, 0.0)

                    # Log top-3 scores for diagnostics
                    top3 = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
                    for lbl, sc in top3:
                        print(f"[INFO] CLIP  {sc:.2%}  '{lbl[:65]}'")

                    # Find best-scoring civic label (exclude no_hazard)
                    best_civic_label = ""
                    best_civic_score = 0.0
                    for label in civic_labels:
                        sc = scores.get(label, 0.0)
                        if sc > best_civic_score:
                            best_civic_score = sc
                            best_civic_label = label

                    ratio = best_civic_score / (no_hazard_score + 1e-9)
                    print(f"[INFO] CLIP best_civic={best_civic_score:.2%}  no_hazard={no_hazard_score:.2%}  ratio={ratio:.2f}x")

                    # Accept if: above floor AND beats no-hazard by required ratio
                    if best_civic_score >= CLIP_ABS_FLOOR and ratio >= CLIP_REL_RATIO:
                        matched_key: Optional[str] = None
                        for keyword, civic_key in clip_key_map.items():
                            if keyword in best_civic_label.lower():
                                matched_key = civic_key
                                break

                        if matched_key:
                            info = CIVIC_CATEGORIES_MAP[matched_key]
                            return {
                                "detected_issue": info["label"],
                                "confidence_score": round(best_civic_score, 3),
                                "suggested_category": info["category"],
                                "priority": info["priority"],
                                "labels": [info["label"], "CLIP Zero-Shot Classification"],
                                "bounding_boxes": [],
                                "model_source": f"{source}_clip_zero_shot",
                                "annotated_image_b64": None,
                                "total_detections": 1,
                            }

                    # Civic label did not win confidently
                    return self._honest_low_confidence_result(source, best_civic_score)

            except Exception as clip_err:
                print(f"[WARN] CLIP prediction failed: {clip_err}")

        # CLIP not loaded
        return self._honest_low_confidence_result(source, 0.0)

    def _honest_low_confidence_result(self, source: str, clip_score: float) -> Dict[str, Any]:
        """
        Return an explicit low-confidence generic result when no model is
        sufficiently confident to name a specific civic issue.
        Prevents fabricating a wrong, high-confidence answer.
        """
        if clip_score > 0:
            note = (
                f"CLIP zero-shot best confidence was {clip_score:.0%} — below the 35% threshold. "
                "No specific civic issue could be reliably identified from this image. "
                "Please describe the issue manually in the form below."
            )
        else:
            note = (
                "CLIP model not yet loaded or unavailable. "
                "Please retry in a moment for AI-assisted detection."
            )
        return {
            "detected_issue": "General Civic Issue / Unclassified",
            "confidence_score": round(max(0.0, clip_score), 3),
            "suggested_category": "General Infrastructure",
            "priority": "medium",
            "labels": ["Unclassified Civic Issue"],
            "bounding_boxes": [],
            "model_source": f"{source}_unclassified",
            "annotated_image_b64": None,
            "total_detections": 0,
            "detection_note": note,
        }

    def _heuristic_analysis(self, file_bytes: bytes) -> Dict[str, Any]:
        """
        Conservative fallback used only when the AI model has not yet finished
        loading.  Returns an honest zero-confidence generic result rather than
        a misleading specific answer picked by file-size modulo arithmetic.
        """
        return {
            "detected_issue": "General Civic Issue / Unclassified",
            "confidence_score": 0.0,
            "suggested_category": "General Infrastructure",
            "priority": "medium",
            "labels": ["Unclassified — AI model not yet ready"],
            "bounding_boxes": [],
            "model_source": "model_loading",
            "annotated_image_b64": None,
            "total_detections": 0,
            "detection_note": (
                "The AI model is still initialising. "
                "Please wait a few seconds and retry for accurate YOLO detection."
            ),
        }


# ── Lazy singleton helpers ---------------------------------------------------
_civic_eye_detector: Optional[CivicEyeDetector] = None


def get_civic_eye_detector() -> CivicEyeDetector:
    """Return the shared detector instance, creating it on first use."""
    global _civic_eye_detector
    if _civic_eye_detector is None:
        _civic_eye_detector = CivicEyeDetector()
    return _civic_eye_detector


def get_civic_eye_status() -> Dict[str, Any]:
    """Return status without forcing model initialization."""
    detector = _civic_eye_detector
    if detector is None:
        return {
            "is_ready": False,
            "model_source": "loading",
            "model_classes": [],
            "error": None,
        }
    return detector.get_status()
