import numpy
import sys
from math import factorial
from itertools import permutations, combinations
from colormath.color_objects import LabColor, sRGBColor
from colormath.color_diff import delta_e_cie2000
from colormath.color_conversions import convert_color


TAIL_WEIGHT = 50
MAIN_WEIGHT = 50

def get_color_combos(color_list, num_requested):
    if len(color_list) < 2:
        return null

    to_return = []
    #palette_deltae = 0
    max_delta_e = -1
    furthest = -1
    
	#get every possible pair of colors
    pair_list = sorted(list(combinations(color_list, 2)))
    
    if num_requested >= len(pair_list):
        return pair_list
    
    pair = pair_list.pop()
    to_return = [pair]
        
    for j in range(0, num_requested):
        last = to_return[len(to_return)-1]
        for i in range(0, len(pair_list)):
            compare = pair_list[i]
            delta_e = pair_delta_e_2000(last[0], last[1], compare[0], compare[1], MAIN_WEIGHT, TAIL_WEIGHT)
            
            if delta_e > max_delta_e:
                max_delta_e = delta_e
                furthest = compare
        pair_list.remove(furthest)
        to_return.append(furthest)
        max_delta_e = 0
    print(avg_delta_e_2000(to_return))

	#get every possible combination of pairs
    #possible_palettes = combinations(pair_list, num_requested)
    #poss_pal_len = factorial(p_list_len) / factorial(num_requested) / factorial(p_list_len-num_requested)
    #for palette in possible_palettes:
	#	#for every group of pairs, test every pair against each other and get the delta e between pairs
    #    palette_pairs = combinations(palette, 2)
    #    for pair in palette_pairs:
        #    palette_deltae += pair_delta_e_2000(pair[0][0], pair[0][1], pair[1][0], pair[1][1], MAIN_WEIGHT, TAIL_WEIGHT)
    #    palette_deltae /= pal_pair_len
	#	 if the average delta e between pairs is the highest yet, set this palette to return
    #    if(palette_deltae > max_deltae):
    #        max_deltae = palette_deltae
    #        to_return = palette
    return to_return
    
def avg_delta_e_2000(color_list):
    delta_e = 0
    pairs = list(combinations(color_list, 2))
    for pair in pairs:
        delta_e += pair_delta_e_2000(pair[0][0], pair[0][1], pair[1][0], pair[1][1], MAIN_WEIGHT, TAIL_WEIGHT)
    delta_e /= len(pairs)
    return delta_e
    
def delta_e_2000(main1, main2):
    return pair_delta_e_2000(main1, [0,0,0], main2, [0,0,0], 100, 0)
    
def pair_delta_e_2000(main1, tail1, main2, tail2, main_weight, tail_weight):
    rgb_main1 = sRGBColor(main1[0], main1[1], main1[2])
    rgb_main2 = sRGBColor(main2[0], main2[1], main2[2])
    rgb_tail1 = sRGBColor(tail1[0], tail1[1], tail1[2])
    rgb_tail2 = sRGBColor(tail2[0], tail2[1], tail2[2])

    lab_main1 = convert_color(rgb_main1, LabColor)
    lab_main2 = convert_color(rgb_main2, LabColor)
    lab_tail1 = convert_color(rgb_tail1, LabColor)
    lab_tail2 = convert_color(rgb_tail2, LabColor)

    main_deltae = delta_e_cie2000(lab_main1, lab_main2)
    tail_deltae = delta_e_cie2000(lab_tail1, lab_tail2)
    pair_deltae = numpy.array([main_deltae,  tail_deltae])
    return numpy.average(pair_deltae, weights=[main_weight, tail_weight])
