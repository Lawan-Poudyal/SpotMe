def get_embeddings(faces):

    results = []

    for face in faces:
        results.append({
            "bbox": face.bbox.tolist(),
            "embedding": face.embedding.tolist()
        })

    return results