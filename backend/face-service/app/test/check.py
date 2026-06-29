import cv2
import json
import os


image_name = "group3.jpg"
current_dir = os.path.dirname(__file__)
image_path = os.path.join(current_dir, image_name)

# Load image
image = cv2.imread(image_path)

# Your JSON data
data = {
    "faces":[
    {
      "bbox": [
        935.8193969726562,
        550.9014282226562,
        1015.88037109375,
        653.2793579101562
      ]
    },
    {
      "bbox": [
        696.475830078125,
        620.493408203125,
        772.1632080078125,
        709.2742309570312
      ]
    },
    {
      "bbox": [
        1129.2708740234375,
        538.0153198242188,
        1203.3126220703125,
        635.54345703125
      ]
    },
    {
      "bbox": [
        256.6690368652344,
        522.3097534179688,
        342.5516052246094,
        622.8236083984375
      ]
    },
    {
      "bbox": [
        482.3923034667969,
        582.68212890625,
        561.7521362304688,
        669.4208984375
      ]
    }
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