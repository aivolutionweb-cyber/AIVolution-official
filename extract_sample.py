import cv2
import os

video_path = "ai.mov"
output_dir = "temp_frames"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

vidcap = cv2.VideoCapture(video_path)
total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = vidcap.get(cv2.CAP_PROP_FPS)

print(f"Total frames: {total_frames}, FPS: {fps}")

if total_frames > 0:
    step = max(1, total_frames // 6)
    
    for i in range(6):
        frame_id = i * step
        vidcap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
        success, image = vidcap.read()
        if success:
            cv2.imwrite(f"{output_dir}/sample_frame_{i}.jpg", image)
            print(f"Extracted frame {i}")
