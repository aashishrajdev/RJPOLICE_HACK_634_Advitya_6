import cv2
import numpy as np
import time
from vonage import Client, Sms

class Camera:
    def __init__(self, params):
        self.cam_id = params["cam_id"]
        self.phone_number = params["phone_number"]
        self.cap = cv2.VideoCapture(self.cam_id)
        self.prev_frame_gray = None
        self.consecutive_displacement_count = 0
        self.blockage_notification_sent = False
        self.start_time_blockage = time.time()

def send_notification(phone_number, message):
    # Replace "YOUR_VONAGE_API_KEY" and "YOUR_VONAGE_API_SECRET" with your actual Vonage API key and secret
    vonage_api_key = "API_KEY"
    vonage_api_secret = "SECRET_KEY"

    # Create Vonage client
    client = Client(key=vonage_api_key, secret=vonage_api_secret)

    # Send SMS notification
    sms = Sms(client)
    response = sms.send_message(
        {
            "from": "Vonage APIs",
            "to": phone_number,
            "text": message,
        }
    )

    if response["messages"][0]["status"] == "0":
        print(f"Message sent successfully to {phone_number}.")
    else:
        print(f"Message failed with error: {response['messages'][0]['error-text']}")

def detect_camera_displacement_and_blockage(cameras):
    while True:
        for camera in cameras:
            ret, next_frame = camera.cap.read()
            if not ret:
                print(f"Error: Unable to read the next frame for Camera {camera.cam_id}.")
                continue

            next_frame_gray = cv2.cvtColor(next_frame, cv2.COLOR_BGR2GRAY)

            # Calculate optical flow using Lucas-Kanade method for camera displacement detection
            if camera.prev_frame_gray is not None:
                prev_pts = cv2.goodFeaturesToTrack(
                    camera.prev_frame_gray, maxCorners=150, qualityLevel=0.3, minDistance=7
                )
                if prev_pts is not None:
                    next_pts, status, err = cv2.calcOpticalFlowPyrLK(
                        camera.prev_frame_gray, next_frame_gray, prev_pts, None, winSize=(15, 15)
                    )

                    displacement_vector = np.mean(next_pts - prev_pts, axis=0)

                    # Check for camera displacement
                    if np.linalg.norm(displacement_vector) > 30.0:
                        roi_center = (next_frame.shape[1] // 2, next_frame.shape[0] // 2)
                        object_detected = any(
                            np.linalg.norm(point - np.array(roi_center)) < 50 for point in next_pts.reshape(-1, 2)
                        )

                        # If no object detected in the ROI, consider it as camera displacement
                        if not object_detected:
                            camera.consecutive_displacement_count += 1
                            if camera.consecutive_displacement_count >= 5:
                                current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                                print(f"Camera {camera.cam_id} Displacement Detected! Timestamp: {current_time}")
                                send_notification(
                                    camera.phone_number,
                                    f"Camera {camera.cam_id} Displacement Detected at {current_time}!",
                                )
                                camera.consecutive_displacement_count = 0
                    else:
                        camera.consecutive_displacement_count = 0

            # Calculate time for camera blockage detection
            elapsed_time_blockage = time.time() - camera.start_time_blockage

            # Blockage detection
            _, frame_blockage = camera.cap.read()
            gray_blockage = cv2.cvtColor(frame_blockage, cv2.COLOR_BGR2GRAY)
            canny_img = cv2.Canny(gray_blockage, 0, 255)
            mask = cv2.adaptiveThreshold(
                gray_blockage, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 3, 3
            )
            and_mask = cv2.bitwise_and(mask, canny_img)

            nonzero_area = cv2.countNonZero(and_mask)
            if nonzero_area < 300:
                if elapsed_time_blockage >= 5 and not camera.blockage_notification_sent:
                    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                    print(
                        f"Camera {camera.cam_id} Blockage Detected! Timestamp: {current_time}"
                    )
                    send_notification(
                        camera.phone_number,
                        f"Camera {camera.cam_id} Blockage Detected at {current_time}!",
                    )
                    camera.blockage_notification_sent = True
            else:
                camera.start_time_blockage = time.time()
                camera.blockage_notification_sent = False

            # Display the video feed for camera displacement detection
            cv2.imshow(f'Camera {camera.cam_id} Displacement Detection', next_frame)

            if cv2.waitKey(1) == ord('q'):
                break

            camera.prev_frame_gray = next_frame_gray

    for camera in cameras:
        camera.cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # Create a dictionary for camera parameters
    camera_params1 = {"cam_id": 0, "phone_number": "1234567890"}
    camera_params2 = {"cam_id": 1, "phone_number": "9876543210"}

    # Create Camera instances using the parameters
    camera1 = Camera(params=camera_params1)
    camera2 = Camera(params=camera_params2)

    # Create a list of cameras
    cameras = [camera1, camera2]

    # Start camera detection
    detect_camera_displacement_and_blockage(cameras)
