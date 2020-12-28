import getColorCombos, {hex_to_rgb, srgb_to_lab, xyz_to_lab, srgb_to_xyz, deltaE_2000, combinations} from './colors'; 

it('correctly gets pairs', () => {
    var colors=["#003300",
    "#003333",
    "#003399",
    "#000066"];
    console.log(getColorCombos(colors, 6));
    var colors=["#003300",
    "#000066"];
    console.log(getColorCombos(colors, 6));
});

it('correctly calculates combinations', () => {
    expect(combinations([[1,1,1],[2,2,2],[3,3,3]], 2)).toEqual([ [[1,1,1],[2,2,2]], [[1,1,1],[3,3,3]], [[2,2,2],[3,3,3]] ]);
    
    expect(combinations([[1,1,1],[2,2,2],[3,3,3]], 3)).toEqual([[1,1,1],[2,2,2],[3,3,3]]);
    
    expect(combinations([[1,1,1],[2,2,2],[3,3,3]], 4)).toEqual([]);
    
    expect(combinations([[1,1,1],[2,2,2],[3,3,3]], 0)).toEqual([]);
    
    expect(combinations([[1,1,1],[2,2,2],[3,3,3]], -1)).toEqual([]);
    
    expect(combinations([], 0)).toEqual([]);
});

//correct values taken from http://colormine.org/delta-e-calculator/cie2000
//other data from https://github.com/zschuessler/DeltaE/blob/master/tests/main.js
it('correctly calculates delta e 2000', () => {
    expect(deltaE_2000([0,-15,6], [2,1,10])).toBeCloseTo(17.1782);
    expect(deltaE_2000([6,14,-21], [100,20,-9])).toBeCloseTo(92.2140);
    expect(deltaE_2000([53,-2,-119], [76,91,33])).toBeCloseTo(65.5124);
    
    expect(deltaE_2000([50.0000,
        2.6772, -79.7751,
      ], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(2.0425);//1
    expect(deltaE_2000([50.0000,
        3.1571, -77.2803,
      ], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(2.8615);//2
    expect(deltaE_2000([50.0000,
        2.8361, -74.0200,
      ], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(3.4412);//3
    expect(deltaE_2000([50.0000, -1.3802, -84.2814], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(1);//4
    expect(deltaE_2000([50.0000, -1.1848, -84.8006], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(1);//5
    expect(deltaE_2000([50.0000, -0.9009, -85.5211], [50.0000,
        0.0000, -82.7485,
])).toBeCloseTo(1);//6
    expect(deltaE_2000([50.0000,
        0.0000,
        0.0000,
      ], [50.0000, -1.0000,
        2.0000,
])).toBeCloseTo(2.3669);//7
    expect(deltaE_2000([50.0000, -1.0000,
        2.0000,
      ], [50.0000,
        0.0000,
        0.0000,
])).toBeCloseTo(2.3669);//8
    expect(deltaE_2000([50.0000,
        2.4900, -0.0010,
      ], [50.0000, -2.4900,
        0.0009,
])).toBeCloseTo(7.1792);//9
    expect(deltaE_2000([50.0000,
        2.4900, -0.0010,
      ], [50.0000, -2.4900,
        0.0010,
])).toBeCloseTo(7.1792);//10
    expect(deltaE_2000([50.0000,
        2.4900, -0.0010,
      ], [50.0000, -2.4900,
        0.0011,
])).toBeCloseTo(7.2195);//11
    expect(deltaE_2000([50.0000,
        2.4900, -0.0010,
      ], [50.0000, -2.4900,
        0.0012,
])).toBeCloseTo(7.2195);//12
    expect(deltaE_2000([50.0000, -0.0010,
        2.4900,
      ], [50.0000,
        0.0009, -2.4900,
])).toBeCloseTo(4.8045);//13
    expect(deltaE_2000([50.0000, -0.0010,
        2.4900,
      ], [50.0000,
        0.0010, -2.4900,
])).toBeCloseTo(4.8045);//14
    expect(deltaE_2000([50.0000, -0.0010,
        2.4900,
      ], [50.0000,
        0.0011, -2.4900,
])).toBeCloseTo(4.7461);//15
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [50.0000,
        0.0000, -2.5000,
])).toBeCloseTo(4.3065);//16
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [73.0000,
        25.0000, -18.0000,
])).toBeCloseTo(27.1492);//17
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [61.0000, -5.0000,
        29.0000,
])).toBeCloseTo(22.8977);//18
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
], [56.0000, -27.0000, -3.0000])).toBeCloseTo(31.9030);//19
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [58.0000,
        24.0000,
        15.0000,
])).toBeCloseTo(19.4535);//20
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [50.0000,
        3.1736,
        0.5854,
])).toBeCloseTo(1.0000);//21
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [50.0000,
        3.2972,
        0.0000,
])).toBeCloseTo(1);//22
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [50.0000,
        1.8634,
        0.5757,
])).toBeCloseTo(1);//23
    expect(deltaE_2000([50.0000,
        2.5000,
        0.0000,
      ], [50.0000,
        3.2592,
        0.3350,
])).toBeCloseTo(1);//24
    expect(deltaE_2000([60.2574, -34.0099,
        36.2677,
      ], [60.4626, -34.1751,
        39.4387,
])).toBeCloseTo(1.2644);//25
    expect(deltaE_2000([63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864])).toBeCloseTo(1.2630);//26
    expect(deltaE_2000([61.2901,
        3.7196, -5.3901,
      ], [61.4292,
        2.2480, -4.9620,
])).toBeCloseTo(1.8731);//27
    expect(deltaE_2000([35.0831, -44.1164,
        3.7933,
      ], [35.0232, -40.0716,
        1.5901,
])).toBeCloseTo(1.8645);//28
    expect(deltaE_2000([22.7233,
        20.0904, -46.6940,
      ], [23.0331,
        14.9730, -42.5619,
])).toBeCloseTo(2.0373);//29
    expect(deltaE_2000([36.4612,
        47.8580,
        18.3852,
      ], [36.2715,
        50.5065,
        21.2231,
])).toBeCloseTo(1.4146);//30
    expect(deltaE_2000([90.8027, -2.0831,
        1.4410,
      ], [91.1528, -1.6435,
        0.0447,
])).toBeCloseTo(1.4441);//31
    expect(deltaE_2000([90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239])).toBeCloseTo(1.5381);//32
    expect(deltaE_2000([6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286])).toBeCloseTo(0.6377);//33
    expect(deltaE_2000([2.0776,
        0.0795, -1.1350,
], [0.9033, -0.0636, -0.5514])).toBeCloseTo(0.9082);//34

});

it('correctly calculates 100 deltaE', () => {
    expect(deltaE_2000([100, 0.005, -0.010], [0.0, 0.0, 0.0])).toBeCloseTo(100);
});

it('correctly calculates 0 deltaE', () => {
    expect(deltaE_2000([42,-1,100], [42,-1,100])).toEqual(0);
    expect(deltaE_2000([0.0, 0.0, 0.0], [0.0, 0.0, 0.0])).toEqual(0);
    expect(deltaE_2000([99.5, 0.005, -0.010], [99.5, 0.005, -0.010])).toEqual(0);
});

function toBeCloseToArr(expected, received) {
    for(var i = 0; i<expected.length; i++) {
        expect(received[i]).toBeCloseTo(expected[i]);
    }
}

it('correctly converts colors from srgb to lab', () => {
    //'correct' results from http://colormine.org/color-converter
    var expected, received;
    
    expected = [0,0,0];
    received = srgb_to_lab([0,0,0]);
    toBeCloseToArr(expected, received);
    
    expected = [100, 0.0052604999583039, -0.0104081845252679];
    received = srgb_to_lab([255,255,255]);
    toBeCloseToArr(expected, received);
    
    expected = [88.2775635175897, -81.3238944649962, 83.8409310894534];
    received = srgb_to_lab([65,255,0]);
    toBeCloseToArr(expected, received);
    
    expected = [42.7415672293148, -1.82346927470034, 47.4030517460498];
    received = srgb_to_lab([118,100,9]);
    toBeCloseToArr(expected, received);
});

it('correctly converts colors from srgb to xyz', () => {
    //'correct' results from http://colormine.org/color-converter
    var expected, received;
    
    received = srgb_to_xyz([0,0,0]);
    expected = [0,0,0];
    toBeCloseToArr(expected, received);
    
    
    received = srgb_to_xyz([255,255,255]);
    expected = [95.05, 100, 108.9];
    toBeCloseToArr(expected, received);
    
    received = srgb_to_xyz([65,255,0]);
    expected = [37.939973083236, 72.6438173557128, 12.0220210487547];
    toBeCloseToArr(expected, received);
    
    received = srgb_to_xyz([118,100,9]);
    expected = [12.0776928437205, 12.9856179209005, 2.128356300272];
    toBeCloseToArr(expected, received);
});

it('correctly converts colors from xyz to lab', () => {
    //'correct' results from http://colormine.org/color-converter
    var expected, received;
    
    received = xyz_to_lab([0,0,0]);
    expected = [0,0,0];
    toBeCloseToArr(expected, received);
    
    received = xyz_to_lab([95.05, 100, 108.9]);
    expected = [100, 0.0052604999583039, -0.0104081845252679];
    toBeCloseToArr(expected, received);
    
    received = xyz_to_lab([37.939973083236, 72.6438173557128, 12.0220210487547]);
    expected = [88.2775635175897, -81.3238944649962, 83.8409310894534];
    toBeCloseToArr(expected, received);
    
    received = xyz_to_lab([12.0776928437205, 12.9856179209005, 2.128356300272]);
    expected = [42.7415672293148, -1.82346927470034, 47.4030517460498];
    toBeCloseToArr(expected, received);    
});

it('correctly converts colors from hex to rgb', () => {    
    expect(hex_to_rgb('#fbafff')).toEqual([251,175,255]);
    expect(hex_to_rgb('#123456')).toEqual([18,52,86]);
    expect(hex_to_rgb('#FF0000')).toEqual([255,0,0]);
    expect(hex_to_rgb('#f00')).toEqual([255,0,0]);
    expect(hex_to_rgb('#000')).toEqual([0,0,0]);
    expect(() => {hex_to_rgb('#f000');}).toThrow();
    expect(() => {hex_to_rgb('#r1tr');}).toThrow();
    expect(() => {hex_to_rgb('rtr');}).toThrow();
    expect(() => {hex_to_rgb('123456');}).toThrow();
});
