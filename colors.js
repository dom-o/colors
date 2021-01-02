function getColorCombos(color_list, num_requested, group_size, weights) {
  if(color_list.length < group_size) {
    return null
  }

  //we're not removing duplicates, because we're going to just expect there shouldn't be any
  // //remove duplicate colors
  // color_list = color_list.filter(function(color, index) {
  //     return color_list.indexOf(color) === index;
  // });

  //convert color list from [hex_list_index1, hex_list_index2, ...] to [ { rgb:[r,g,b], lab:[l,a,b] }, { rgb:[r,g,b], lab:[l,a,b] }, ...]
  color_list = color_list.map(a => {
    const rgb = hex_to_rgb(hex_list[a])
    return {
      lab: xyz_to_lab(srgb_to_xyz(rgb)),
      rgb: rgb
    }
  })

  var combo_list
  //can't get length of permutations list directly, since it's a generator, but know that there are n!/(n-k)! length k permutations of n items
  if(num_requested >= factorial(color_list.length) / factorial(color_list.length - group_size)) {
    combo_list = permutations(color_list.length, group_size);
    const arr = []
    for (const combo of combo_list) {
      arr.push(combo.map(x => color_list[x]))
    }
    return arr
  }

  const to_ignore = [[]]
  for(var i=color_list.length-1; i>=color_list.length-group_size; i--) {
    const r = Math.floor(Math.random() * (i+1))
    const t = color_list[i]
    color_list[i] = color_list[r]
    color_list[r] = t
    to_ignore[0].push(i)
  }
  const to_return = [color_list.slice(color_list.length-group_size)]

  while(to_return.length < num_requested) {
    var furthest, furthest_indices, combo, max_deltaE=0

    combo_list = permutations(color_list.length, group_size)
    for(const el of combo_list) {
      if(!to_return_includes_combo(el, to_ignore)) {
        combo = el.map(x => color_list[x])
        var new_deltaE = group_deltaE_2000(to_return[0], combo, weights)
        for(var k=1; k<to_return.length; k++) {
          new_deltaE = Math.min(group_deltaE_2000(to_return[k], combo, weights), new_deltaE);
        }
        if(new_deltaE > max_deltaE) {
          max_deltaE = new_deltaE;
          furthest = combo;
          furthest_indices = el
        }
      }
    }
    to_return.push(furthest);
    to_ignore.push(furthest_indices)
  }
  return to_return
}

function to_return_includes_combo(combo, to_return) {
  var found;
  for(const compare of to_return) {
    if(compare.length === combo.length) {
      found = true
      for(var i=0; i<compare.length; i++) {
        if(compare[i] !== combo[i]) {
          found = false
          break
        }
      }
      if(found) { return true }
    }
  }
  return false
}

function group_deltaE_2000(group1, group2, weights) {
  const summed_weights = weights.reduce((acc,curr) => acc+curr)
  // const lab_group1 = group1.map(color => srgb_to_lab(color))
  // const lab_group2 = group2.map(color => srgb_to_lab(color))
  let avg_deltaE = 0

  // for(let i=0; i<lab_group1.length && i<lab_group2.length; i++) {
  //   avg_deltaE += deltaE_2000(lab_group1[i], lab_group2[i]) * weights[i]
  // }
  for(let i=0; i<group1.length && i<group2.length; i++) {
    avg_deltaE += deltaE_2000(group1[i].lab, group2[i].lab) * weights[i]
  }
  avg_deltaE /= summed_weights

  return avg_deltaE;
}

//taken from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hex_to_rgb(hex) {
    var r,g,b,c;

    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c= hex.substring(1).split('');
        if(c.length === 3) c= [c[0], c[0], c[1], c[1], c[2], c[2]];

        c = '0x'+c.join('');

        r = (c>>16)&255;
        g = (c>>8)&255;
        b = c&255;

        return[r,g,b];
    }
    throw new Error('bad hex: ' + hex);
}

//taken from https://gist.github.com/axelpale/3118596
function combinations(list, chunk_size) {
  var combs, start, sub_combs, i, j;

  if(chunk_size > list.length || chunk_size <= 0) {
      return [];
  }

  if(chunk_size === list.length) {
      return list;
  }

  if(chunk_size === 1) {
      combs = [];
      for(i=0; i<list.length; i++) {
          combs.push(list[i]);
      }
      return combs;
  }

    combs=[];
    for(i=0; i<list.length-chunk_size+1; i++) {
        start = list.slice(i, i+1);
        sub_combs = combinations(list.slice(i+1), chunk_size-1);
        for(j=0; j<sub_combs.length; j++) {
            combs.push(start.concat([sub_combs[j]]));
        }
    }
    return combs;
}

function factorial(n) {
  let k = 1
  if(n==0 || n==1) {
    return 1
  } else {
    while(n>0) {
      k *= n
      n--
    }
    return k
  }
}

// https://alistairisrael.wordpress.com/2009/09/22/simple-efficient-pnk-algorithm/
function* permutations(n/**list_length**/, k/**chunk_size**/) {
  // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
  const a = [...Array(n).keys()]
  yield a.slice(0,k)
  const edge = k - 1

  while (true) {
    let j = k
    while(j < n && a[edge] >= a[j]) {
      j++
    }

    var t,u,v
    if(j<n) {
      t = a[edge]
      a[edge] = a[j]
      a[j] = t
    } else {
      u=k
      v=n-1
      while(u<v) { //reverse from k to n-1
        t = a[u]
        a[u] = a[v]
        a[v] = t

        u++
        v--
      }

      let i = edge -1
      while(i >= 0 && a[i] >= a[i+1]) {
        i--
      }

      if (i<0) {
        //done
        return
      }

      j = n-1
      while( j > i && a[i] >= a[j]) {
        j--
      }

      t = a[i]
      a[i] = a[j]
      a[j] = t

      u=i+1
      v=n-1
      while(u<v) { //reverse from i+1 to n-1
        t = a[u]
        a[u] = a[v]
        a[v] = t

        u++
        v--
      }
    }
    yield a.slice(0, k);
  }
}

//http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
//referenced https://github.com/signalwerk/colorlab/blob/master/src/CIEDE2000.js
function deltaE_2000(color1, color2) {
    var l1, a1, b1, l2, a2, b2, lBarPrime, c1, c2, cBar, g, a1Prime, a2Prime, c1Prime, c2Prime, cBarPrime, h1Prime, h1PrimeTerm, h2Prime, h2PrimeTerm, hBarPrime, deltaHPrime, deltaHPrimeTerm, deltaLPrime, deltaCPrime, deltaBigHPrime, sL, sC, sH, t, deltaTheta, rC, rT, kL, kC, kH;

    l1= color1[0];
    a1= color1[1];
    b1= color1[2];
    l2= color2[0];
    a2= color2[1];
    b2= color2[2];


    lBarPrime = (l1+l2) /2;

    //c is the chroma for each color
    c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));

    //average the two chromas
    cBar = (c1 + c2)/2;

    g = 0.5 * (1-Math.sqrt( Math.pow(cBar,7) / (Math.pow(cBar,7) + Math.pow(25,7)) ));

    a1Prime = a1*(1+g);
    a2Prime = a2*(1+g);

    c1Prime = Math.sqrt( Math.pow(a1Prime,2) + Math.pow(b1,2) );
    c2Prime = Math.sqrt( Math.pow(a2Prime,2) + Math.pow(b2,2) );
    cBarPrime = (c1Prime+c2Prime) /2;

    h1PrimeTerm = toDegrees(Math.atan2(b1, a1Prime));
    h1Prime = (h1PrimeTerm >= 0) ? h1PrimeTerm : h1PrimeTerm + 360;

    h2PrimeTerm = toDegrees(Math.atan2(b2, a2Prime));
    h2Prime = (h2PrimeTerm >= 0) ? h2PrimeTerm : h2PrimeTerm + 360;

    hBarPrime = (Math.abs(h1Prime - h2Prime) > 180) ? (h1Prime + h2Prime + 360)/2 : (h1Prime + h2Prime)/2;

    t = 1 - (0.17*Math.cos(toRadians(hBarPrime - 30))) + (0.24*Math.cos(toRadians(2*hBarPrime))) + (0.32*Math.cos(toRadians(3*hBarPrime + 6))) - (0.20*Math.cos(toRadians(4*hBarPrime - 63)));

    //delta for hue
    deltaHPrimeTerm = h2Prime - h1Prime;
    if(Math.abs(deltaHPrimeTerm) <= 180) { deltaHPrime= deltaHPrimeTerm; }
    else if(Math.abs(deltaHPrimeTerm) > 180 && h2Prime <= h1Prime) { deltaHPrime= deltaHPrimeTerm - 360; }
    else { deltaHPrime= deltaHPrimeTerm + 360; }

    //delta for lightness
    deltaLPrime= l2 - l1;
    //delta for chroma
    deltaCPrime= c2Prime - c1Prime;

    deltaBigHPrime= 2 * Math.sqrt(c1Prime*c2Prime) * Math.sin(toRadians(deltaHPrime/2));

    sL= 1 + ((0.015 * Math.pow(lBarPrime-50,2)) / (Math.sqrt(20 + Math.pow(lBarPrime-50,2))));
    sC= 1 + (0.045*cBarPrime);
    sH= 1 + (0.015*cBarPrime*t);

    deltaTheta= 30*Math.exp(-1*Math.pow((hBarPrime-275)/25,2));

    rC= 2 * Math.sqrt( Math.pow(cBarPrime,7) / (Math.pow(cBarPrime,7) + Math.pow(25,7)) );
    rT= -1*rC*Math.sin(toRadians(2*deltaTheta));

    kL= 1;
    kC= 1;
    kH= 1;

    return Math.sqrt( Math.pow(deltaLPrime/(kL*sL),2) + Math.pow(deltaCPrime/(kC*sC),2) + Math.pow(deltaBigHPrime/(kH*sH),2) + (rT*(deltaCPrime/(kC*sC))*(deltaBigHPrime/(kH*sH))));
}

function toRadians(degrees) {
    return degrees * Math.PI/180;
}

function toDegrees(radians) {
    return radians * 180/Math.PI;
}

function srgb_to_lab(rgb) {
    return xyz_to_lab(srgb_to_xyz(rgb));
}

//https://en.wikipedia.org/wiki/Lab_color_space#Forward_transformation
function xyz_to_lab(xyz) {
    var l,a,b,x,y,z;
    x= xyz[0];
    y= xyz[1];
    z= xyz[2];

    // xn= 95.047;
    // yn= 100.000
    // zn= 108.883;
    // l = 116*f(y/yn) - 16;
    // a = 500*(f(x/xn) - f(y/yn))
    // b = 200*(f(y/yn) - f(z/zn))
    // l = 116*f(y/100.000) - 16;
    // a = 500*(f(x/95.047) - f(y/100.000))
    // b = 200*(f(y/100.000) - f(z/108.883))

    // return [l,a,b]
    return [
      116*f(y/100.000) - 16,
      500*(f(x/95.047) - f(y/100.000)),
      200*(f(y/100.000) - f(z/108.883))
    ];
}

function f (t) {
    // var del=6/29;
    // return (t > Math.pow(del, 3)) ? Math.cbrt(t) : t/(3*Math.pow(del,2)) + (4/29);
    return (t > Math.pow(6/29, 3)) ? Math.cbrt(t) : t/(3*Math.pow(6/29,2)) + (4/29);
}

//https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
function srgb_to_xyz(rgb) {
    var x,y,z, r,g,b;
    r= rgb[0] / 255;
    g= rgb[1] / 255;
    b= rgb[2] / 255;

    r= (r > 0.04045) ? Math.pow((r+0.055)/(0.055+1), 2.4) : r/12.92;
    g= (g > 0.04045) ? Math.pow((g+0.055)/(0.055+1), 2.4) : g/12.92;
    b= (b > 0.04045) ? Math.pow((b+0.055)/(0.055+1), 2.4) : b/12.92;

    // x = (0.4124*r + 0.3576*g + 0.1805*b);
    // y = (0.2126*r + 0.7152*g + 0.0722*b);
    // z = (0.0193*r + 0.1192*g + 0.9505*b);

    return [
      (0.4124*r + 0.3576*g + 0.1805*b)*100,
      (0.2126*r + 0.7152*g + 0.0722*b)*100,
      (0.0193*r + 0.1192*g + 0.9505*b)*100
    ]
}

function linear_rgb(c) {
    // var a= 0.055;
    // c = (c > 0.04045) ? Math.pow((c+a)/(a+1), 2.4) : c/12.92;
    return (c > 0.04045) ? Math.pow((c+0.055)/(0.055+1), 2.4) : c/12.92;

    // return c;
}
