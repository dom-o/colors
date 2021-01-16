const card_height = 55
var worker

function switchBackground(to) {
  document.body.className = to
}
if(document.getElementById('dark').checked && !document.getElementById('light').checked) {
  switchBackground('dark')
} else {
  switchBackground('light')
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
    label.innerHTML = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][i]+' color: '
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

function cancelCalculation() {
  if(worker) {
    worker.terminate()
    worker = null
    document.getElementById('calculate').disabled = false
    document.getElementById('combos').innerHTML = 'Calculation cancelled.'
  }
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

  document.getElementById('calculate').disabled = true
  const num_requested = parseInt(document.getElementById('num-requested').value, 10)

  const weights = []

  if (weights_quantity <= 1) {
    weights.push(1)
  } else {
    for(let i=0; i<weights_quantity; i++) {
      weights.push(parseInt(document.getElementById('contrast'+i).value, 10))
    }
  }

  worker = new Worker("colors.js")
  worker.onmessage = updateColorTable;

  worker.postMessage({
    color_list: on,
    num_requested: num_requested,
    group_size: weights_quantity,
    weights: weights
  })
}

function updateColorTable(event) {
  var message = event.data
  if(message.type == "combo_list") {
    var combos = message.data
    if(combos) {
      const combo_table = document.getElementById('combos')
      const span_color = (document.getElementById('dark').checked && !document.getElementById('light').checked) ? 'dark' : 'light'
      let combos_html = '<div class="combo-group">'
      for(let i=0; i<combos.length; i++) {
        combos_html += '<div class="card combo-card">'
          for(let j=0; j<combos[i].length; j++) {
            combos_html += '<div class="square combo-square" style="background-color:'+combos[i][j].hex+
            ';"><span class="'+span_color+'">'+combos[i][j].hex+'</span></div>'
          }
        combos_html += '</div>'
      }
      combos_html += '</div>'
      combo_table.innerHTML = combos_html
    } else {
      document.getElementById('combos').innerHTML = "Something's up. I couldn't find the color groups."
    }
    document.getElementById('calculate').disabled = false
  } else if (message.type == "progress") {
    document.getElementById('combos').innerHTML = '..calculating ' + message.data+'%'
  }
}
