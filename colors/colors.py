import numpy
import sys
import itertools
from colormath.color_objects import LabColor, sRGBColor
from colormath.color_diff import delta_e_cie2000
from colormath.color_conversions import convert_color


tail_weight = 30
main_weight = 70

def get_color_combos(color_list, num_requested):
    to_return = []
    pair_list = permutations(color_list, 2)
    possible_palettes = combinations(pair_list, num_requested)
    for palette in possible_palettes:
        palette_pairs = combinations(palette)
        for pair in pallete_pairs:
            palette_deltae += delta_e_cie2000(pair[0], pair[1])
        palette_deltae /= palette_pairs.len()
        if(palette_deltae > max_deltae)
            max_deltae = palette_deltae
            to_return = palette
    return to_return

def avg_delta_e_2000(main1, tail1, main2, tail2):
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
