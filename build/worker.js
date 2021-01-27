importScripts('data.js')

onmessage = function(event) {
  postMessage({
    type:'combo_list',
    data: getColorCombos(event.data.color_list, event.data.num_requested, event.data.group_size, event.data.weights)
  })
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

  //convert color list from [hex_list_index1, hex_list_index2, ...] to [ { rgb:[r,g,b], lab:[l,a,b] }, { rgb:[r,g,b], lab:[l,a,b] }, ...]
  color_list = color_list.map(a => { return hex_list[a] })

  var combo_list
  var combo_list_length = factorial(color_list.length) / factorial(color_list.length - group_size)
  //can't get length of permutations list directly, since it's a generator, but know that there are n!/(n-k)! length k permutations of n items
  if(num_requested >= combo_list_length) {
    combo_list = permutations(color_list.length, group_size);
    const arr = []
    for (const combo of combo_list) {
      arr.push(combo.map(x => color_list[x]))
    }
    return arr
  }

  const to_ignore = [[]]
  // const to_return = [[]]
  for(var i=color_list.length-1; i>=color_list.length-group_size; i--) {
    const r = Math.floor(Math.random() * (i+1))
    const t = color_list[i]
    color_list[i] = color_list[r]
    color_list[r] = t
    to_ignore[0].push(r)
    // to_return[0].push(r)
  }
  const to_return = [color_list.slice(color_list.length-group_size)]
  while(to_return.length < num_requested) {
    var furthest, furthest_indices, combo, possible, max_deltaE=0
    postMessage({ type: 'progress', data: 100*((to_return.length) / num_requested) })
    combo_list = permutations(color_list.length, group_size)
    for(const el of combo_list) {
      if(!to_return_includes_combo(el, to_ignore)) {
        var new_deltaE = group_deltaE_2000(to_ignore[0], el, weights)
        for(var k=1; k<to_return.length; k++) {
          possible = group_deltaE_2000(to_ignore[k], el, weights)
          new_deltaE = (possible < new_deltaE) ? possible : new_deltaE
        }
        if(new_deltaE > max_deltaE) {
          max_deltaE = new_deltaE;
          furthest = el.map(x => color_list[x]);
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
  let avg_deltaE = 0

  for(let i=0; i<group1.length && i<group2.length; i++) {
    var difference = (color_differences[group1[i]][group2[i]]) ? color_differences[group1[i]][group2[i]] : color_differences[group2[i]][group1[i]]
    avg_deltaE += difference * weights[i]//deltaE_2000(group1[i].lab, group2[i].lab) * weights[i]
  }
  avg_deltaE /= summed_weights

  return avg_deltaE;
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
