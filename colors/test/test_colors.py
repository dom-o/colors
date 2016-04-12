from math import *
from colors import colors
import numpy

test_data1 = [1, 5, 13]
test_data2 = [12, 9, 52]

def test_xyztolab():
    arr1 = numpy.array(colors.xyztolab(test_data1))
    arr2 = numpy.array([26.735, -74.640, -24.802])
    arr3 = numpy.fabs(arr1 - arr2) < 0.0009
    assert arr3.all()

def test_rgbtoxyz():
    arr1 = numpy.array(colors.rgbtoxyz(test_data1))
    arr2 = numpy.array([0.139, 0.144, 0.401])
    arr3 = numpy.fabs(arr1 - arr2) < 0.0009
    assert arr3.all()

def test_rgbtolab():
    arr1 = numpy.array(colors.rgbtolab(test_data1))
    arr2 = numpy.array([1.301, 0.103, -3.495])
    arr3 = numpy.fabs(arr1 - arr2) < 0.0009
    assert arr3.all()

#Ensure that two identical colors return a delta e (color difference) of 0.
def test_deltae_1994_1():
    assert colors.deltae_1994(test_data1, test_data1) == 0

def test_delate_1994_2():
    assert fabs(colors.deltae_1994(test_data1, test_data2) - 26.653) < 0.0009
