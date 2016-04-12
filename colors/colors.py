#All color conversion calculations from easyrgb.com.
from math import sqrt
import numpy



def rgbtolab(rgb):
  return xyztolab(rgbtoxyz(rgb))

#Assumes that each RGB component value is from 0-255.
#Calculations assume 2degree observer angle and D65 illumination.
def rgbtoxyz(rgb):
    r = rgb[0]
    g = rgb[1]
    b = rgb[2]

    r = r/255
    g = g/255
    b = b/255

    if(r > 0.04045):
        r = pow((r+0.055)/1.055, 2.4)
    else:
        r = r/12.92

    if(g > 0.04045):
        g = pow((g+0.055)/1.055, 2.4)
    else:
        g = g/12.92

    if(b > 0.04045):
        b = pow((b+0.055)/1.055, 2.4)
    else:
        b = b/12.92

    r = r * 100
    g = g * 100
    b = b * 100

    xyz = []
    xyz.append(r * 0.4124 + g * 0.3576 + b * 0.1805)
    xyz.append(r * 0.2126 + g * 0.7152 + b * 0.0722)
    xyz.append(r * 0.0193 + g * 0.1192 + b * 0.9505)

    return xyz

#This conversion is from XYZ to CIE-L*ab, not Hunter-Lab.
#Calculations assume 2degree observer angle and D65 illumination.
def xyztolab(xyz):
    xn= 95.047
    yn= 100.000
    zn= 108.883

    x= xyz[0]
    y= xyz[1]
    z= xyz[2]

    x= x/xn
    y= y/yn
    z= z/zn

    if(x > 0.008856):
        x = pow(x, 1/3)
    else:
        x = (7.787 * x) + (16 / 116)

    if(y > 0.008856):
        y = pow(y, 1/3)
    else:
        y = (7.787 * y) + (16 / 116)

    if(z > 0.008856):
        z = pow(z, 1/3)
    else:
        z = (7.787 * z) + (16 / 116)

    lab = []
    lab.append((116 * y) - 16)
    lab.append(500 * (x-y))
    lab.append(200 * (y-z))

    return lab


def deltae_1994(lab1, lab2):
    l1 = lab1[0]
    a1 = lab1[1]
    b1 = lab1[2]

    l2 = lab2[0]
    a2 = lab2[1]
    b2 = lab2[2]

    k2 = 0.015
    k1 = 0.045
    k_h = 1
    k_c = 1
    k_l = 1
    c2 = sqrt(pow(a2, 2) + pow(b2, 2))
    c1 = sqrt(pow(a1, 2) + pow(b1, 2))
    s_h = 1 + (k2 * c1)
    s_c = 1 + (k1 * c1)
    s_l = 1
    d_b = b1 - b2
    d_a = a1 - a2
    d_c = c1 - c2
    d_h = sqrt(pow(d_a, 2) + pow(d_b, 2) - pow(d_c, 2))
    d_l = l1 - l2

    f1 = d_l / (k_l * s_l)
    f2 = d_c / (k_c * s_c)
    f3 = d_h / (k_h * s_h)
    delta_e = sqrt(pow(f1, 2) + pow(f2, 2) + pow(f3, 2))

    return delta_e
