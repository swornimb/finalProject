import requests
import sys
import cv2
import numpy as np
from PIL import Image
import itertools
import urllib
# Open the image
def phashing(imageFile):
    # print(imageFile)

    opener = urllib.request.URLopener()
    opener.addheader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36')
    # urllib.request.urlretrieve(imageFile, "image.jpg")
    filename, headers = opener.retrieve(imageFile, "image.jpg")   

    # req = urllib.request.Request(imageFile, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'})
    # response = urllib.request.urlopen(req)
    # print(response)

    img = cv2.imread("image.jpg")
    # Convert the image to grayscale
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


    # Resize the image to 32x32
    resized_img = cv2.resize(gray_img, (32, 32))

    # Compute the DCT of the resized image
    dct_img = cv2.dct(np.float32(resized_img))

    # Keep the top-left 8x8 pixels of the DCT
    dct_img_trunc = dct_img[:8, :8]

    # Compute the average value of the truncated DCT
    dct_img_avg = np.mean(dct_img_trunc)
    # Compute the hash by setting the values greater than the average to 1, and the others to 0
    img_hash = np.where(dct_img_trunc > dct_img_avg, 1, 0)
    print(list(itertools.chain(*img_hash)))
    return list(itertools.chain(*img_hash))

phashing(sys.argv[1])







