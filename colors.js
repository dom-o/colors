function arrCompare(a, b) {
  var i;

  for(i=0; i<a.length && i<b.length;) {
    if (a[i] === b[i]) i++;
    else return a[i]-b[i];
  }

  return 0;
}

function getColorCombos(color_list, num_requested, group_size, weights) {
  if(color_list.length < group_size) {
    return null
  }

  //we're not removing duplicates, because we're going to just expect there shouldn't be any
  // //remove duplicate colors
  // color_list = color_list.filter(function(color, index) {
  //     return color_list.indexOf(color) === index;
  // });

  var combo_list = permutationsNew(color_list.length, group_size);
  const combo_list_length = factorial(color_list.length) / factorial(color_list.length - group_size)
  if(num_requested >= combo_list_length) {
    arr = []
    for (combo of combo_list) {
      arr.push(combo)
    }
    return arr
  }

  const min = Math.ceil(0)
  const max = Math.floor(combo_list_length)
  const rand = Math.floor(Math.random() * (max - min) + min)
  for(var i=0;i<rand;i++) {
    combo_list.next()
  }
  const to_return = [combo_list.next().value.map(x => color_list[x])]
  const to_ignore = [to_return[0]]

  while(to_return.length < num_requested) {
    var furthest, combo
    let max_deltaE=0

    combo_list = permutationsNew(color_list.length, group_size)
    for(el of combo_list) {
      combo = el.map(x => color_list[x])
      if(!to_ignore_includes_combo(combo, to_ignore)) {
        let new_deltaE = group_deltaE_2000(to_return[0], combo, weights)
        for(var k=1; k<to_return.length; k++) {
          new_deltaE = Math.min(group_deltaE_2000(to_return[k], combo, weights), new_deltaE);
        }
        if(new_deltaE > max_deltaE) {
          max_deltaE = new_deltaE;
          furthest = combo;
        }
      }
    }
    to_ignore.push(furthest)
    to_return.push(furthest);
    max_deltaE = 0;
  }
  return to_return
}

function to_ignore_includes_combo(combo, to_ignore) {
  var found;
  for(compare of to_ignore) {
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
  const lab_group1 = group1.map(color => srgb_to_lab(color))
  const lab_group2 = group2.map(color => srgb_to_lab(color))
  let avg_deltaE = 0

  for(let i=0; i<lab_group1.length && i<lab_group2.length; i++) {
    avg_deltaE += deltaE_2000(lab_group1[i], lab_group2[i]) * weights[i]
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
    var sqrt, sin, pow, atan2, cos, abs, exp, l1, a1, b1, l2, a2, b2, lBarPrime, c1, c2, cBar, g, a1Prime, a2Prime, c1Prime, c2Prime, cBarPrime, h1Prime, h1PrimeTerm, h2Prime, h2PrimeTerm, hBarPrime, deltaHPrime, deltaHPrimeTerm, deltaLPrime, deltaCPrime, deltaBigHPrime, sL, sC, sH, t, deltaTheta, rC, rT, kL, kC, kH;

    sqrt = Math.sqrt;
    sin = Math.sin;
    pow = Math.pow;
    atan2 = Math.atan2;
    cos = Math.cos;
    abs = Math.abs;
    exp = Math.exp;
    l1= color1[0];
    a1= color1[1];
    b1= color1[2];
    l2= color2[0];
    a2= color2[1];
    b2= color2[2];


    lBarPrime = (l1+l2) /2;

    //c is the chroma for each color
    c1 = sqrt(pow(a1, 2) + pow(b1, 2));
    c2 = sqrt(pow(a2, 2) + pow(b2, 2));

    //average the two chromas
    cBar = (c1 + c2)/2;

    g = 0.5 * (1-sqrt( pow(cBar,7) / (pow(cBar,7) + pow(25,7)) ));

    a1Prime = a1*(1+g);
    a2Prime = a2*(1+g);

    c1Prime = sqrt( pow(a1Prime,2) + pow(b1,2) );
    c2Prime = sqrt( pow(a2Prime,2) + pow(b2,2) );
    cBarPrime = (c1Prime+c2Prime) /2;

    h1PrimeTerm = toDegrees(atan2(b1, a1Prime));
    h1Prime = (h1PrimeTerm >= 0) ? h1PrimeTerm : h1PrimeTerm + 360;

    h2PrimeTerm = toDegrees(atan2(b2, a2Prime));
    h2Prime = (h2PrimeTerm >= 0) ? h2PrimeTerm : h2PrimeTerm + 360;

    hBarPrime = (abs(h1Prime - h2Prime) > 180) ? (h1Prime + h2Prime + 360)/2 : (h1Prime + h2Prime)/2;

    t = 1 - (0.17*cos(toRadians(hBarPrime - 30))) + (0.24*cos(toRadians(2*hBarPrime))) + (0.32*cos(toRadians(3*hBarPrime + 6))) - (0.20*cos(toRadians(4*hBarPrime - 63)));

    //delta for hue
    deltaHPrimeTerm = h2Prime - h1Prime;
    if(abs(deltaHPrimeTerm) <= 180) { deltaHPrime= deltaHPrimeTerm; }
    else if(abs(deltaHPrimeTerm) > 180 && h2Prime <= h1Prime) { deltaHPrime= deltaHPrimeTerm - 360; }
    else { deltaHPrime= deltaHPrimeTerm + 360; }

    //delta for lightness
    deltaLPrime= l2 - l1;
    //delta for chroma
    deltaCPrime= c2Prime - c1Prime;

    deltaBigHPrime= 2 * sqrt(c1Prime*c2Prime) * sin(toRadians(deltaHPrime/2));

    sL= 1 + ((0.015 * pow(lBarPrime-50,2)) / (sqrt(20 + pow(lBarPrime-50,2))));
    sC= 1 + (0.045*cBarPrime);
    sH= 1 + (0.015*cBarPrime*t);

    deltaTheta= 30*exp(-1*pow((hBarPrime-275)/25,2));

    rC= 2 * sqrt( pow(cBarPrime,7) / (pow(cBarPrime,7) + pow(25,7)) );
    rT= -1*rC*sin(toRadians(2*deltaTheta));

    kL= 1;
    kC= 1;
    kH= 1;


    return sqrt( pow(deltaLPrime/(kL*sL),2) + pow(deltaCPrime/(kC*sC),2) + pow(deltaBigHPrime/(kH*sH),2) + (rT*(deltaCPrime/(kC*sC))*(deltaBigHPrime/(kH*sH))));
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
    var l,a,b, xn,yn,zn, x,y,z;
    x= xyz[0];
    y= xyz[1];
    z= xyz[2];

    xn= 95.047;
    yn= 100.000
    zn= 108.883;

    l = 116*f(y/yn) - 16;
    a = 500*(f(x/xn) - f(y/yn))
    b = 200*(f(y/yn) - f(z/zn))

    return [l,a,b];
}

function f (t) {
    var del=6/29;
    return (t > Math.pow(del, 3)) ? Math.cbrt(t) : t/(3*Math.pow(del,2)) + (4/29);
}

//https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
function srgb_to_xyz(rgb) {
    var x,y,z, r,g,b;
    r= rgb[0] / 255;
    g= rgb[1] / 255;
    b= rgb[2] / 255;

    r= linear_rgb(r);
    g= linear_rgb(g);
    b= linear_rgb(b);

    x = (0.4124*r + 0.3576*g + 0.1805*b);
    y = (0.2126*r + 0.7152*g + 0.0722*b);
    z = (0.0193*r + 0.1192*g + 0.9505*b);

    return [x*100,y*100,z*100];
}

function linear_rgb(c) {
    var a= 0.055;

    c = (c > 0.04045) ? Math.pow((c+a)/(a+1), 2.4) : c/12.92;

    return c;
}
