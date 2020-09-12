const tableBody = document.getElementById('table-body')
const btnSemd = document.getElementById('btn_send')
const optionsMethodPetition = document.getElementById('header-methods')
const response = document.getElementById('response')
const urlSend = document.getElementById('header-url')

const btnParams = document.getElementById('btn-params')
const btnBody = document.getElementById('btn-body')

let loading = document.getElementById('loading')

let methodPetition = 'GET'
let body = {}

let activateParamsRequest = false
let activateBodyRequest = true

function addRowTableBody(e) {
  const rowsTable = this.children
  const td = e.target.parentNode
  const tr = td.parentNode
  if (tr == rowsTable[rowsTable.length - 1]) {
    tableBody.appendChild(createRowTableBody())
  }
}

function selectMethodPetition(e) {
  const index = e.target.selectedIndex
  methodPetition = e.target.options[index].value
}

function createRowTableBody() {
  const tr = document.createElement('tr')
  const tdKey = document.createElement('td')
  const tdValue = document.createElement('td')
  const tdDescription = document.createElement('td')
  const inputTextKey = document.createElement('input')
  const inputTextValue = document.createElement('input')
  const inputTextDescription = document.createElement('input')

  inputTextKey.setAttribute('placeholder', 'Key')
  inputTextValue.setAttribute('placeholder', 'Value')
  inputTextDescription.setAttribute('placeholder', 'Description')

  inputTextKey.setAttribute('type', 'text')
  inputTextValue.setAttribute('type', 'text')
  inputTextDescription.setAttribute('type', 'text')

  tdKey.appendChild(inputTextKey)
  tdValue.appendChild(inputTextValue)
  tdDescription.appendChild(inputTextDescription)

  tr.appendChild(tdKey)
  tr.appendChild(tdValue)
  tr.appendChild(tdDescription)
  return tr
}

function sendPetition() {
  response.innerHTML = ''
  loading.classList.add('activate')
  fetch(urlSend.value, {
    method: methodPetition,
    body: validateBody(),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: '*/*',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      loading.classList.remove('activate')
      let str = JSON.stringify(data, null, 4)
      response.innerHTML = `<pre>${syntaxHighlight(str)}</pre>`
    })
}

function validateBody() {
  if (activateBodyRequest) {
    return Object.entries(body).length === 0 ? null : JSON.stringify(body)
  }
  return null
}

function createBodySend() {
  body = {}
  Array.from(tableBody.children).forEach((tr) => {
    let trArray = Array.from(tr.children)
    if (trArray[0].firstChild.value != '') {
      body = {
        ...body,
        [trArray[0].firstChild.value]: trArray[1].firstChild.value,
      }
    }
  })
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    },
  )
}

function createParamsURL() {
  if (activateParamsRequest) {
    let url = urlSend.value.split('?')[0] + '?'

    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        url += `${key}=${body[key]}&`
      }
    }
    urlSend.value = url
  }
}

function activateTypeBody(e) {
  activateParamsRequest = false
  activateBodyRequest = false

  btnParams.classList.toggle('active')
  btnBody.classList.toggle('active')

  if (e.target.id == 'btn-params') {

    activateParamsRequest = true
    createParamsURL()
  } else {
    activateBodyRequest = true
    createBodySend()
    urlSend.value = urlSend.value.split('?')[0]
  }
}

//ADD EVENTS

tableBody.addEventListener('keypress', addRowTableBody)
tableBody.addEventListener('keyup', createBodySend)
tableBody.addEventListener('keyup', createParamsURL)
optionsMethodPetition.addEventListener('change', selectMethodPetition)
btnSemd.addEventListener('click', sendPetition)

btnParams.addEventListener('click', activateTypeBody)
btnBody.addEventListener('click', activateTypeBody)
