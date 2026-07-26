"""
Lost & Found AI Matcher.

Uses HuggingFace Sentence Transformers (sentence-transformers/all-MiniLM-L6-v2)
to compute semantic similarity matching between lost & found item reports.
"""

from typing import List, Dict, Any
import numpy as np

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_model_instance = None


def get_embedding_model():
    global _model_instance
    if _model_instance is None:
        try:
            from sentence_transformers import SentenceTransformer
            print(f"[INFO] Loading HuggingFace model ({MODEL_NAME}) …")
            _model_instance = SentenceTransformer(MODEL_NAME)
        except Exception as err:
            print(f"[WARN] Could not load SentenceTransformer ({err}). Using TF-IDF/Jaccard similarity fallback.")
            _model_instance = False
    return _model_instance


def compute_text_embedding(text: str) -> List[float]:
    """Generate semantic embedding vector for a given text string."""
    model = get_embedding_model()
    if model:
        emb = model.encode(text)
        return emb.tolist()
    # Fallback pseudo-embedding
    return [float(ord(c) % 100) / 100.0 for c in text[:64].ljust(64, " ")]


def compute_similarity_score(text1: str, text2: str) -> float:
    """Calculate cosine similarity score (0.0 to 1.0) between two item descriptions."""
    model = get_embedding_model()
    if model:
        emb1 = model.encode(text1)
        emb2 = model.encode(text2)
        dot_prod = np.dot(emb1, emb2)
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)
        if norm1 > 0 and norm2 > 0:
            return float(dot_prod / (norm1 * norm2))

    # Jaccard word similarity fallback
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return float(len(intersection) / len(union))


def match_lost_and_found(target_item: str, candidate_items: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
    """Rank candidate items by AI semantic similarity to the target lost/found item."""
    results = []
    for item in candidate_items:
        desc = f"{item.get('title', '')} {item.get('description', '')} {item.get('category', '')}"
        score = compute_similarity_score(target_item, desc)
        results.append({**item, "match_confidence": round(score, 3)})

    results.sort(key=lambda x: x["match_confidence"], reverse=True)
    return results[:top_k]
