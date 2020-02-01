import re
import os
path = "..\cards"
text_files = [f for f in os.listdir(path) if f.endswith('.png')]
#print(text_files)

for x in text_files:
  temp = x
  x = str(x)
  x=x.replace(' ','')
  x=x.replace('.png','')
  data = 'import ' + x + ' from ' + " '../assets/cards/" + temp + "'"
  
  print(data)
