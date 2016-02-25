def rgbtolab(rgb):
  return xyztolab(rgbtoxyz(rgb))

def rgbtoxyz(rgb):
  pass

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

    if(x > pow(6/29, 3)):
        x = pow(x, 1/3)
    else:
        x = ((1/3 * pow(29/6, 2)) * x) + (4/29)

    if(y > pow(6/29, 3)):
        y = pow(y, 1/3)
    else:
        y = ((1/3 * pow(29/6, 2)) * y) + (4/29)

    if(z > pow(6/29, 3)):
        z = pow(z, 1/3)
    else:
        z = ((1/3 * pow(29/6, 2)) * z) + (4/29)

    lab[0]= 116 * y - 16
    lab[1]= 500 * (x-y)
    lab[2]= 200 * (y-z)

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
