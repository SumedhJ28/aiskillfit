import cv2

def validate_video(video_path: str):
    """
    Checks if a face is present in the video to prevent fraud (e.g., pointing camera at wall).
    Returns (is_valid, reason)
    """
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return False, "Could not open video file."

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        frames_checked = 0
        faces_detected = 0
        
        while cap.isOpened() and frames_checked < 30: # Check first 30 frames
            ret, frame = cap.read()
            if not ret:
                break
            
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                faces_detected += 1
                if len(faces) > 1:
                     # Multiple faces detected - might be cheating
                     cap.release()
                     return False, "Multiple faces detected in frame."
            
            frames_checked += 1

        cap.release()

        if faces_detected > 5: # Face seen in at least a few frames
            return True, "Face detected."
        else:
            return False, "No face detected in video."
            
    except Exception as e:
        print(f"Video validation error: {e}")
        return True, "Skipped validation due to error" # Fail open for MVP
