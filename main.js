/**
// TODO: add error messages to form; if any formulas return like a empty array tell the user why before it happens
**/

const color_table = document.getElementById('color-table')
const card_height = 55

let color_table_html = '<div class="card-group">'
for(let i=0; i<color_list.length; i++) {
  color = color_list[i]
  color_table_html +=
    '<label class="card" id="'+i+'" >' +
      '<div class="square" style="background-color:'+color+';">' +
        '<input id="check'+i+'" class="color-check" type="checkbox">'+ //onclick="toggleCard('+i+')">' +
        '<span class="light">'+color+'</span>' +
      '</div>' +
    '</label>'
}
color_table_html+='</div>'
color_table.innerHTML = color_table_html

function switchBackground(to, from) {
  els = document.getElementsByClassName(from)
  while (els.length>0) {
    els[0].className = to
  }
}
if(document.getElementById('dark').checked && !document.getElementById('light').checked) {
  switchBackground('dark', 'light')
} else {
  switchBackground('light', 'dark')
}

// let on = []
// function toggleCard(key) {
//   if (document.getElementById('check'+key).checked && !on.includes(key)) {
//     on.push(key)
//   }
//   if (!document.getElementById('check'+key).checked && on.includes(key)) {
//     on.splice(on.indexOf(key), 1)
//   }
// }

function changeWeights() {
  const weights_quantity = document.getElementById('group-size').value
  const weights_container = document.getElementById('weights-container')
  weights_container.innerHTML = ""
  for(let i=0; i<weights_quantity; i++) {
    let label = document.createElement('label')
    label.for = 'contrast-i'
    label.innerHTML = 'Weight for the '+(i+1)+'st color in each group'
    label.className = 'weight-slider'
    let input = document.createElement('input')
    input.type= 'range'
    input.id= 'contrast-'+i
    input.min= 1
    input.max= 100
    input.step= 1
    input.value= 50
    label.appendChild(input)
    weights_container.appendChild(label)
    // weights_html += ('<input class="weight-slider" type="range" id="contrast-'+i+'" min="1" max="100" step="1" value="50" />')
  }
  // document.getElementById('weights-container').innerHTML = weights_html
}
changeWeights()

function calculateWrapper() {
  document.getElementById('combos').innerHTML = '..calculating'
  setTimeout(function() {
    calculate()
  }, 20);
}

function calculate() {
  const on = []
  for (el of document.getElementsByClassName('color-check')) {
    if (el.checked) {
      on.push(parseInt(el.id.slice(5), 10))
    }
  }

  const weights_quantity = parseInt(document.getElementById('group-size').value, 10)
  if(on.length < weights_quantity) {
    document.getElementById('combos').innerHTML = 'You want color groups of size ' + weights_quantity + ", but you've picked "+on.length+(on.length>1 ? ' colors.' : ' color.')+' Pick '+(weights_quantity-on.length)+' more.'
    return
  }
  const rgb = on.map(a => color_list[a]).map(hex_to_rgb)
  const num_requested = parseInt(document.getElementById('num-requested').value, 10)

  const weights = []

  if (weights_quantity <= 1) {
    weights.push(1)
  } else {
    for(let i=0; i<weights_quantity; i++) {
      weights.push(parseInt(document.getElementById('contrast-'+i).value, 10))
    }
  }

  const combos = getColorCombos(rgb, num_requested, weights_quantity, weights)
  updateColorTable(combos)
}

function updateColorTable(combos, err_string) {
  if(combos) {
    combos = combos.map(combo => combo.map(color => 'rgb('+color.join(',')+')'))
    const combo_table = document.getElementById('combos')
    let combos_html = '<div class="card-group">'
    for(let i=0; i<combos.length; i++) {
      combos_html += '<div class="card" style="width: 3rem;">'
        for(let j=0; j<combos[i].length; j++) {
          combos_html += '<div class="square" style="background-color:'+combos[i][j]+
          '; height:'+ (card_height / combos[i].length) +'px;'+
          '"></div>'
        }
      combos_html += '</div>'
    }
    combos_html += '</div>'
    combo_table.innerHTML = combos_html
  } else {
    document.getElementById('combos').innerHTML = err_string ? err_string : "Something's up. I couldn't find the color groups."
  }
}
