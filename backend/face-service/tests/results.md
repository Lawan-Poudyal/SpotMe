# Face Verification Evaluation Results

**Command:** `py evaluate_accuracy.py --data eval_dataset --threshold 0.5`

**Model:** InsightFace `buffalo_l` (SCRFD detection + ArcFace recognition, ResNet50 backbone, CPU execution provider)

---

## 1. Dataset Summary

**Reference selfies embedded:** 8 individuals

| Person | Status |
|---|---|
| abhiyan | OK |
| ayush | OK |
| bigya | OK |
| bijan | OK |
| lawan | OK |
| manish | OK |
| sijan | OK |
| subechha | OK |

**Event/group photos processed:** 42 images, face counts and ground-truth labels below.

| Photo | Faces detected | Labeled present |
|---|---|---|
| 1.jpeg | 2 | sijan, bigya, abhiyan |
| 2.jpeg | 2 | sijan, ayush, bigya |
| 3.jpeg | 2 | sijan, abhiyan |
| 4.jpeg | 1 | bigya |
| 5.jpeg | 4 | sijan, ayush, bigya, abhiyan |
| 6.jpeg | 5 | abhiyan, ayush, bigya, lawan, sijan |
| 7.jpeg | 4 | sijan, lawan, bigya, abhiyan |
| 8.jpeg | 4 | sijan, lawan, bigya, abhiyan |
| 9.jpeg | 3 | lawan, sijan, abhiyan |
| 10.jpeg | 4 | lawan, sijan, abhiyan |
| 11.jpeg | 2 | sijan, abhiyan |
| 12.jpeg | 2 | lawan, abhiyan |
| 13.jpeg | 2 | ayush, bigya |
| 14.jpeg | 3 | ayush, bigya, abhiyan |
| 15.jpeg | 4 | lawan, ayush, bigya, abhiyan |
| 16.jpeg | 4 | lawan, ayush, bigya, abhiyan |
| 17.JPG | 5 | lawan, ayush |
| 18.JPG | 5 | lawan, ayush |
| 19.JPG | 5 | lawan, ayush |
| 20.JPG | 5 | lawan, ayush |
| 21.JPG | 5 | lawan, ayush |
| 22.JPG | 5 | manish, bijan |
| 23.JPG | 5 | manish, bijan |
| 24.JPG | 5 | manish, bijan |
| 25.JPG | 3 | lawan, ayush, subechha |
| 26.JPG | 3 | lawan, ayush, subechha |
| 27.JPG | 3 | lawan, ayush, subechha |
| 28.JPG | 3 | lawan, ayush, subechha |
| 29.JPG | 1 | subechha |
| 30.JPG | 1 | subechha |
| 31.JPG | 2 | lawan |
| 32.JPG | 1 | bijan |
| 33.JPG | 1 | manish |
| 34.JPG | 3 | ayush |
| 35.jpg | 1 | lawan |
| 36.jpg | 1 | lawan |
| 37.jpg | 1 | subechha |
| 38.jpg | 1 | sijan |
| 39.jpg | 1 | bigya |
| 40.jpg | 1 | ayush |
| 41.jpg | 1 | lawan |
| 42.jpeg | 1 | abhiyan |

**Total comparisons collected:** 91 genuine pairs, 245 impostor pairs (336 total)

---

## 2. Results at Deployed Threshold (0.5)

| Metric | Value |
|---|---|
| Accuracy | 97.92% |
| Precision | 100.00% |
| Recall | 92.31% |
| F1 score | 96.00% |
| False Acceptance Rate (FAR) | 0.00% |
| False Rejection Rate (FRR) | 7.69% |

**Confusion matrix:** TP = 84, FN = 7, TN = 245, FP = 0

---

## 3. Results at Empirically Best Threshold (0.251)

| Metric | Value |
|---|---|
| Accuracy | 99.11% |
| Precision | 98.89% |
| Recall | 97.80% |
| F1 score | 98.34% |
| False Acceptance Rate (FAR) | 0.41% |
| False Rejection Rate (FRR) | 2.20% |

**Confusion matrix:** TP = 89, FN = 2, TN = 244, FP = 1

---

## 4. ROC Curve

**AUC = 0.9263**

---

## 5. Output Files

- `similarity_distribution.png` — genuine vs. impostor score histogram
- `roc_curve.png` — ROC curve, AUC = 0.9263

---

## 6. Summary

At the deployed threshold (0.5), the system achieves 100% precision and 0% FAR — no impostor pair was ever incorrectly matched — at the cost of missing 7 of 91 genuine matches (7.69% FRR), likely due to pose, lighting, or occlusion in group photos. Lowering the threshold to the empirical optimum (0.251) improves accuracy to 99.11% and recall to 97.80%, at a small cost of 0.41% FAR. The deployed threshold favors precision over recall, appropriate for a photo-distribution context where a false match carries more risk than a missed one.