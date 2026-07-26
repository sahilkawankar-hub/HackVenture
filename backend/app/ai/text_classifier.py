"""
Text classification & NLP utilities using HuggingFace Models:
  - Content Moderation:  unitary/toxic-bert
  - Sentiment Analysis:  cardiffnlp/twitter-roberta-base-sentiment-latest
  - Text Summarization:  facebook/bart-large-cnn
"""

import os
from typing import Dict, Any, Optional

TOXIC_MODEL = "unitary/toxic-bert"
SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
SUMMARIZER_MODEL = "facebook/bart-large-cnn"
WHISPER_MODEL = "openai/whisper-large-v3"
TRANSLATOR_MODEL = "facebook/nllb-200-distilled-600M"
GEMMA_MODEL = "google/gemma-3-4b-it"
QWEN_MODEL = "Qwen/Qwen2.5-7B-Instruct"

ENABLE_HEAVY_LLMS = os.getenv("CIVILINK_ENABLE_HEAVY_LLMS", "false").lower() in {"1", "true", "yes"}

_toxic_pipeline = None
_sentiment_pipeline = None
_summarizer_pipeline = None
_translation_pipeline = None
_audio_pipeline = None
_gemma_pipeline = None
_qwen_pipeline = None


def check_content_toxicity(text: str) -> Dict[str, Any]:
    """Check text for abuse, hate speech, or toxicity using HuggingFace toxic-bert."""
    global _toxic_pipeline
    if _toxic_pipeline is None:
        try:
            from transformers import pipeline
            print(f"[INFO] Loading HuggingFace model ({TOXIC_MODEL}) …")
            _toxic_pipeline = pipeline("text-classification", model=TOXIC_MODEL, return_all_scores=True)
        except Exception as err:
            print(f"[WARN] Toxic-bert load failed ({err}). Using keyword fallback.")
            _toxic_pipeline = False

    if _toxic_pipeline:
        try:
            res = _toxic_pipeline(text[:512])
            scores = res[0] if isinstance(res, list) and res else []
            toxic_score = max((s["score"] for s in scores if s["label"].lower() in ["toxic", "severe_toxic"]), default=0.0)
            return {
                "is_toxic": toxic_score > 0.6,
                "toxicity_score": round(float(toxic_score), 3),
                "model": TOXIC_MODEL,
            }
        except Exception:
            pass

    # Keyword safety fallback
    bad_words = {"hate", "abusive", "threat", "violence", "kill", "harm"}
    found = any(w in text.lower() for w in bad_words)
    return {
        "is_toxic": found,
        "toxicity_score": 0.85 if found else 0.05,
        "model": "keyword_fallback",
    }


def analyze_community_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment (positive, neutral, negative) using RoBERTa sentiment model."""
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        try:
            from transformers import pipeline
            print(f"[INFO] Loading HuggingFace model ({SENTIMENT_MODEL}) …")
            _sentiment_pipeline = pipeline("sentiment-analysis", model=SENTIMENT_MODEL)
        except Exception as err:
            print(f"[WARN] RoBERTa sentiment load failed ({err}). Using fallback.")
            _sentiment_pipeline = False

    if _sentiment_pipeline:
        try:
            res = _sentiment_pipeline(text[:512])
            label = res[0]["label"].lower() if res else "neutral"
            score = res[0]["score"] if res else 0.8
            return {
                "sentiment": "positive" if "pos" in label else "negative" if "neg" in label else "neutral",
                "score": round(float(score), 3),
                "model": SENTIMENT_MODEL,
            }
        except Exception:
            pass

    return {
        "sentiment": "neutral",
        "score": 0.75,
        "model": "fallback",
    }


def summarize_community_announcement(text: str, max_len: int = 80) -> str:
    """Summarize long announcements using HuggingFace BART-large-CNN."""
    if len(text.split()) < 25:
        return text

    global _summarizer_pipeline
    if _summarizer_pipeline is None:
        try:
            from transformers import pipeline
            print(f"[INFO] Loading HuggingFace model ({SUMMARIZER_MODEL}) …")
            _summarizer_pipeline = pipeline("summarization", model=SUMMARIZER_MODEL)
        except Exception as err:
            print(f"[WARN] BART summarizer load failed ({err}). Using fallback.")
            _summarizer_pipeline = False

    if _summarizer_pipeline:
        try:
            res = _summarizer_pipeline(text[:1024], max_length=max_len, min_length=15, do_sample=False)
            if res and isinstance(res, list):
                return res[0]["summary_text"]
        except Exception:
            pass

    # Simple extractive fallback
    sentences = text.split(".")
    return ". ".join(sentences[:2]).strip() + "."


def translate_text(text: str, source_lang: str = "eng_Latn", target_lang: str = "eng_Latn") -> Dict[str, Any]:
    """Translate text using NLLB when heavy LLMs are enabled; otherwise return the input unchanged."""
    if not text.strip() or source_lang == target_lang or not ENABLE_HEAVY_LLMS:
        return {
            "translated_text": text,
            "model": "fallback" if not ENABLE_HEAVY_LLMS else TRANSLATOR_MODEL,
        }

    global _translation_pipeline
    if _translation_pipeline is None:
        try:
            from transformers import pipeline

            print(f"[INFO] Loading HuggingFace model ({TRANSLATOR_MODEL}) …")
            _translation_pipeline = pipeline("translation", model=TRANSLATOR_MODEL)
        except Exception as err:
            print(f"[WARN] NLLB translation load failed ({err}). Using fallback.")
            _translation_pipeline = False

    if _translation_pipeline:
        try:
            res = _translation_pipeline(text[:1024])
            if res and isinstance(res, list):
                return {
                    "translated_text": res[0].get("translation_text", text),
                    "model": TRANSLATOR_MODEL,
                }
        except Exception:
            pass

    return {
        "translated_text": text,
        "model": "fallback",
    }


def generate_llm_insight(text: str, preferred_model: str = GEMMA_MODEL) -> Dict[str, Any]:
    """Generate a brief issue insight with a large instruction model when enabled; otherwise fall back to BART."""
    if not text.strip():
        return {"insight": "", "model": "none"}

    if ENABLE_HEAVY_LLMS:
        for model_name in (preferred_model, QWEN_MODEL):
            try:
                global _gemma_pipeline, _qwen_pipeline
                cache_attr = "_gemma_pipeline" if model_name == GEMMA_MODEL else "_qwen_pipeline"
                cached = globals()[cache_attr]
                if cached is None:
                    from transformers import pipeline

                    print(f"[INFO] Loading HuggingFace model ({model_name}) …")
                    cached = pipeline("text-generation", model=model_name)
                    globals()[cache_attr] = cached
                if cached:
                    prompt = (
                        "Summarize this civic issue image in one short actionable sentence: "
                        f"{text[:1024]}"
                    )
                    res = cached(prompt, max_new_tokens=96, do_sample=False)
                    if res and isinstance(res, list):
                        generated = res[0].get("generated_text", "")
                        return {"insight": generated.strip(), "model": model_name}
            except Exception as err:
                print(f"[WARN] LLM insight load failed ({model_name}): {err}")

    return {
        "insight": summarize_community_announcement(text, max_len=72),
        "model": SUMMARIZER_MODEL,
    }


def transcribe_audio(audio_path: str) -> Dict[str, Any]:
    """Transcribe an audio file path with Whisper when heavy LLMs are enabled."""
    if not ENABLE_HEAVY_LLMS:
        return {"text": "", "model": "disabled"}

    global _audio_pipeline
    if _audio_pipeline is None:
        try:
            from transformers import pipeline

            print(f"[INFO] Loading HuggingFace model ({WHISPER_MODEL}) …")
            _audio_pipeline = pipeline("automatic-speech-recognition", model=WHISPER_MODEL)
        except Exception as err:
            print(f"[WARN] Whisper load failed ({err}). Using fallback.")
            _audio_pipeline = False

    if _audio_pipeline:
        try:
            res = _audio_pipeline(audio_path)
            if isinstance(res, dict):
                return {"text": res.get("text", ""), "model": WHISPER_MODEL}
        except Exception as err:
            print(f"[WARN] Whisper transcription failed ({err}).")

    return {"text": "", "model": "fallback"}
