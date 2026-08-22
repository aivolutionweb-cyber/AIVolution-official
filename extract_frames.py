import cv2
import os

video_path = "ai.mp4"
output_dir = "src/assets/video_frames"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

vidcap = cv2.VideoCapture(video_path)
success, image = vidcap.read()
count = 1

# We only want the first half of the animation.
# The video shows them separating, then returning. 
# Total frames is unknown, we will extract all, then see how many there are.
while success:
    # Save frame as JPEG file
    cv2.imwrite(f"{output_dir}/frame_{count:04d}.jpg", image)
    success, image = vidcap.read()
    count += 1

print(f"Extracted {count-1} frames.")
