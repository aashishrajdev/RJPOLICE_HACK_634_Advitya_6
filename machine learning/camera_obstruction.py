import cv2 
import numpy as np

capture=cv2.VideoCapture(0)

while(1):
    iscapture,frame=capture.read()
    if(iscapture==False):
        print("cannot acces cam ")
        break
    
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    canny_img=cv2.Canny(gray,0,255)
    mask=cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY_INV,3,3)
    and_mask=cv2.bitwise_and(mask,canny_img)

    nonzero_area=cv2.countNonZero(and_mask)
    if(nonzero_area<800):
        print("camera blocked")
        frame = cv2.putText(frame, "cam is blocked", (int(20),int(50)), cv2.FONT_HERSHEY_TRIPLEX, 1, (0,0,255), 1, cv2.LINE_AA, False)
    else:
        
        frame = cv2.putText(frame, "cam is not blocked", (int(20),int(50)), cv2.FONT_HERSHEY_TRIPLEX, 1, (0,255,0), 1, cv2.LINE_AA, False)
    
    #cv2.imshow("and_mask",and_mask)
    #cv2.imshow("mask",mask)
    #cv2.imshow("canny_image",canny_img)
    #cv2.imshow("gray",gray)
    cv2.imshow("frame",frame)

    
    
    key=cv2.waitKey(1)
    
    if(key==ord('q')):
        print("terminating the program")
        break

capture.release()
