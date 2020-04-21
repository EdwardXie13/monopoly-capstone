import os

path = '.'
folder =[]
files = []
pokemon = []
names = []
file = open("names.txt", "r")
pokemon = file.readlines()

for x in pokemon:
    x = x.split(',')
    for x in x:
      if x[0] == ' ':
        x = x[1:]
      names.append(x)

for f in os.walk(path):
    folder.append(f[0])
    files.append(f[2])

for x in range (len(folder)):
    if (len(folder[x]) == 5):
      temp = folder[x]
      folder[x] = temp[2:]
      #print(folder[x])

def test(param):
    temp = param.split('.')
    temp = temp[0]
    temp = temp.split('_')
    temp = temp[1] + temp[0]
    return temp

files = files[1:]
folder = folder[1:]
for x, z in zip(files, folder):
  #print(x)
  for y in x:
    if ".\\" in z:
      z = z[2:]
    #print(z)
    if '.gif' in y:
      temp = y
      #print(temp)
      y=y.split('.')
      y=y[0]
      y=y.split('_')
      y=y[1] + y[0]
      data = "import " + y + " from '../../assets/sprites/" + z + "/" + temp + "';"
      #print(data)


for x,y,z in zip(files,folder,names):
  data = "{\n" + \
           "name: ""\"" + z + "\", \n" + \
           "srcDown: " + test(x[0]) + ", \n" + \
           "srcUp: " + test(x[1]) + ", \n" + \
           "srcleft: " + test(x[2]) + ", \n" + \
           "srcRight: " + test(x[3]) + ", \n" + \
           "picked: false \n" + \
           "},"
  #data = "import " + i + " from '../../assets/sprites/" + y + "/" + temp + "'"
  print(data)

