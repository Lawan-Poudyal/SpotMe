import cv2
import json
import os


image_name = "group2.jpg"
current_dir = os.path.dirname(__file__)
image_path = os.path.join(current_dir, image_name)

# Load image
image = cv2.imread(image_path)

# Your JSON data
data = {
    "faces": [
    {
      "bbox": [
    462.3528137207031,
    577.2416381835938,
    564.993408203125,
    694.9868774414062
  ]
    }
    # {
    #   "bbox": [
    #     2120.61376953125,
    #     1345.7647705078125,
    #     2349.822265625,
    #     1604.72314453125
    #   ]
    # },
    # {
    #   "bbox": [
    #     4691.4384765625,
    #     1183.822021484375,
    #     4986.56298828125,
    #     1516.2239990234375
    #   ]
    # },
    # {
    #   "bbox": [
    #     751.42724609375,
    #     1166.4173583984375,
    #     1058.7579345703125,
    #     1514.015380859375
    #   ]
    # },
    # {
    #   "bbox": [
    #     3887.337158203125,
    #     1395.783203125,
    #     4134.962890625,
    #     1669.64453125
    #   ]
    # },
    # {
    #   "bbox": [
    #     1511.3365478515625,
    #     1389.704345703125,
    #     1724.6856689453125,
    #     1686.146728515625
    #   ]
    # },
    # {
    #   "bbox": [
    #     3231.7880859375,
    #     1416.66748046875,
    #     3461.748779296875,
    #     1673.4234619140625
    #   ]
    # }
  ]
}

# Draw bounding boxes
for i, face in enumerate(data["faces"]):
    x1, y1, x2, y2 = map(int, face["bbox"])

    cv2.rectangle(
        image,
        (x1, y1),
        (x2, y2),
        (0, 0, 255),  # green
        4
    )

    cv2.putText(
        image,
        str(i + 1),
        (x1, y1 - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )
output_path = os.path.join(current_dir, "output-" + image_name )
cv2.imwrite(output_path, image)