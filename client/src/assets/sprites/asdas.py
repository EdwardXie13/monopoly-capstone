import os

path = '.'
files = []
for f in os.walk(path):
    files.append(f[2])

for x in files:
  for y in x:
    if '.gif' in y:
      temp =y
      #print(temp)
      y=y.split('.')
      y=y[0]
      y=y.split('_')
      y=y[1] + y[0]
      data = "import " + y + " from '../assets/sprites/" + temp + "'"
      print(data)
