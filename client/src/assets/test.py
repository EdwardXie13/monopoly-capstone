import re
import os
path = ""
text_files = [f for f in os.listdir(path) if f.endswith('.png')]
print(text_files)

text_files[0] = text_files[0].replace('.png', '.jpg')
print(text_files[0])
#print(text_files)


