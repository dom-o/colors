const card_height = 55

// function genColorTable() {
//   const color_table = document.getElementById('color-table')
//
//   let color_table_html = ''
//   for(let i=0; i<hex_list.length; i++) {
//     const color = hex_list[i]
//     color_table_html +=
//       '<label class="card" for="'+i+'" style="background-color:'+color+';">' +
//         '<input id="'+i+'" class="color-check" type="checkbox">' +
//         '<span class="dark">'+color+'</span>' +
//       '</label>'
//   }
//   color_table.innerHTML = color_table_html
// }
// genColorTable()

function switchBackground(to, from) {
  const els = document.getElementsByClassName(from)
  while (els.length>0) {
    els[0].className = to
  }
}
if(document.getElementById('dark').checked && !document.getElementById('light').checked) {
  switchBackground('dark', 'light')
} else {
  switchBackground('light', 'dark')
}

function clearSelectedColors() {
  for (const el of document.getElementsByClassName('color-check')) {
    el.checked = false
  }
}

function changeWeights() {
  const weights_quantity = document.getElementById('group-size').value
  const weights_container = document.getElementById('weights-container')
  weights_container.innerHTML = ""
  for(let i=0; i<weights_quantity; i++) {
    let label = document.createElement('label')
    label.htmlFor = 'contrast'+i
    label.innerHTML = 'Weight for '+['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][i]+' color: '
    label.className = 'weight-label'
    let input = document.createElement('input')
    input.type= 'range'
    input.id= 'contrast'+i
    input.min= 1
    input.max= 100
    input.step= 1
    input.value= 50
    label.appendChild(input)
    weights_container.appendChild(label)
  }
}
window.onload = changeWeights

function calculateWrapper() {
  document.getElementById('combos').innerHTML = '..calculating'
  setTimeout(function() {
    calculate()
  }, 20);
}

function calculate() {
  const on = []
  for (const el of document.getElementsByClassName('color-check')) {
    if (el.checked) {
      on.push(parseInt(el.id, 10))
    }
  }

  const weights_quantity = parseInt(document.getElementById('group-size').value, 10)
  if(on.length < weights_quantity) {
    document.getElementById('combos').innerHTML = 'You want color groups of size ' + weights_quantity + ", but you've picked "+on.length+(on.length!=1 ? ' colors.' : ' color.')+' Pick '+(weights_quantity-on.length)+' more at least.'
    return
  }
  const num_requested = parseInt(document.getElementById('num-requested').value, 10)

  const weights = []

  if (weights_quantity <= 1) {
    weights.push(1)
  } else {
    for(let i=0; i<weights_quantity; i++) {
      weights.push(parseInt(document.getElementById('contrast'+i).value, 10))
    }
  }

  var worker = new Worker("colors.js")
  worker.onmessage = updateColorTable;

  worker.postMessage({
    color_list: on,
    num_requested: num_requested,
    group_size: weights_quantity,
    weights: weights
  })
}

function updateColorTable(event) {
  var combos = event.data
  if(combos) {
    // combos = combos.map(combo => combo.map(color => color.hex))
    const combo_table = document.getElementById('combos')
    let combos_html = '<div class="card-group">'
    for(let i=0; i<combos.length; i++) {
      combos_html += '<div class="card" style="width: 3rem;">'
        for(let j=0; j<combos[i].length; j++) {
          combos_html += '<div class="square" style="background-color:'+combos[i][j].hex+
          '; height:'+ (card_height / combos[i].length) +'px;'+
          '"></div>'
        }
      combos_html += '</div>'
    }
    combos_html += '</div>'
    combo_table.innerHTML = combos_html
  } else {
    document.getElementById('combos').innerHTML = "Something's up. I couldn't find the color groups."
  }
}
