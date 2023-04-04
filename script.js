'use strict'

// Selectors
const form = document.querySelector('main .age-calc')
const inputs = document.querySelectorAll('main .age-calc .inputs .input input')
const outputs = document.querySelectorAll('main .age-calc .results div span:first-child')
const invalidMessageElements = document.querySelectorAll('main .age-calc .inputs .input .invalid-message')
const dateEle = document.querySelector('#date')






// Variables
let validatedInputs = 0
let isCalcDone = true;
let focusedInputIndex = 0
const redColor = '#ff5757'
const date = new Date()
const currentYear = date.getFullYear()
const currentMonth = date.getMonth() + 1
const currentDay = date.getDate()







// Functions
function handleInput(inp) {
  const maximumChar = inp.dataset.max
  const onlyNumbersCondition = /[^0-9]/ig.test(inp.value)
  const maxCharCondition = inp.value.length > maximumChar

  if (onlyNumbersCondition || maxCharCondition) inp.value = inp.value.slice(0, -1)
}



function handleSubmit(e) {
  const inpYear = inputs[0].parentElement.parentElement.querySelector('#year')
  const invalidMessageEle = inpYear.parentElement.querySelector('.invalid-message')
  const inpLabel = inpYear.parentElement.querySelector('label')

  e.preventDefault()
  validatedInputs = 0

  inputs.forEach(input => {
    const dateLimitation = parseInt(input.dataset.limitDate)
    const val = input.value
    const invalidMessageEle = input.parentElement.querySelector('.invalid-message')
    const inpLabel = input.parentElement.querySelector('label')


    if (val > dateLimitation || parseInt(val) === 0) {
      inpLabel.style.color = redColor
      input.style.borderColor = redColor
      invalidMessageEle.textContent = `Must be a valid ${inpLabel.textContent}`
    } else if (val.length === 0) {
      inpLabel.style.color = redColor
      input.style.borderColor = redColor
      invalidMessageEle.textContent = 'This field is required'
    } else {
      inpLabel.style.color = ''
      input.style.borderColor = ''
      invalidMessageEle.textContent = ''
      validatedInputs++
    }
  })


  if (inpYear.value > currentYear) {
    inpLabel.style.color = redColor
    inpYear.style.borderColor = redColor
    invalidMessageEle.textContent = 'Must be in the past'
    validatedInputs--
  }

  if (inpYear.value < 1900) {
    inpLabel.style.color = redColor
    inpYear.style.borderColor = redColor
    invalidMessageEle.textContent = `year 1900-${currentYear} is valid`
    validatedInputs--
  }

  checkValidationDaysOfMonths(parseInt(inputs[0].value), parseInt(inputs[1].value))

  if (validatedInputs === inputs.length) calcAge()
  else outputs.forEach(output => output.textContent = '--')
}



function calcAge() {
  let days = parseInt(inputs[0].value)
  let months = parseInt(inputs[1].value)
  let years = parseInt(inputs[2].value)

  let daysResult;
  let monthsResult;
  let yearsResult;

  let daysFinal = 0
  let monthsFinal = 0
  let yearsFinal = 0


  if (currentDay < days) {
    daysResult = currentDay - days + 31
    months += 1
  } else daysResult = currentDay - days
  if (currentMonth < months) {
    monthsResult = currentMonth - months + 12
    years += 1
  } else monthsResult = currentMonth - months
  if (currentYear < years) yearsResult = currentYear - years + 1
  else yearsResult = currentYear - years


  if (years > currentYear) {
    if (months > currentMonth) {
      invalidAll()
      return
    }
  }


  if (isCalcDone) {
    isCalcDone = false

    let ageCounter = setInterval(() => {
      if (daysFinal !== daysResult) daysFinal++
      if (monthsFinal !== monthsResult) monthsFinal++
      if (yearsFinal !== yearsResult) yearsFinal++

      outputs[2].textContent = daysFinal
      outputs[1].textContent = monthsFinal
      outputs[0].textContent = yearsFinal

      if (daysFinal === daysResult && monthsFinal === monthsResult && yearsFinal === yearsResult) {
        clearInterval(ageCounter)
        isCalcDone = true
      }
    }, 20);
  }
}



function invalidAll() {
  outputs.forEach(output => output.textContent = '--')
  inputs.forEach(inputs => {
    const inpLabel = inputs.parentElement.querySelector('label')
    inputs.style.borderColor = redColor
    inpLabel.style.color = redColor
    validatedInputs--
  })
}



function checkValidationDaysOfMonths(days, months) {
  const firstCondition = months === 4 || months === 6 || months === 9 || months === 11
  const secondCondition = months === 2

  if (firstCondition && days > 30 || secondCondition && days > 28) {
    const invalidMessageEle = inputs[0].parentElement.querySelector('.invalid-message')
    invalidMessageEle.textContent = 'Must be a valid date'
    invalidAll()
  }
}



function showtime() {
  let today = new Date(),
    hours = today.getHours(),
    minutes = today.getMinutes(),
    seconds = today.getSeconds();

  if (hours < 10) hours = "0" + hours;
  else if (minutes < 10) minutes = "0" + minutes;
  else if (seconds < 10) seconds = "0" + seconds;

  document.getElementById("time").textContent =
    hours + ":" + minutes + ":" + seconds;
}
dateEle.textContent = `${currentMonth}/${currentDay}/${currentYear}`








// Events
form.addEventListener('submit', (e) => handleSubmit(e))


inputs.forEach((input, i) => {
  input.addEventListener('input', () => handleInput(input))
  input.addEventListener('click', () => focusedInputIndex = i)
})


window.onload = setInterval(showtime, 500);


document.addEventListener('keydown', function(e) {
  const focusedInput = document.activeElement

  if (focusedInput.id === 'year' && focusedInput.value.length === 0)
    focusedInput.value = '1900'

  if (e.key === 'ArrowUp') focusedInput.value++
  else if (e.key === 'ArrowDown' && focusedInput.value > 0)
    focusedInput.value--

  if (e.key === "ArrowLeft" && focusedInputIndex !== 0) {
    focusedInputIndex--
    inputs[focusedInputIndex].focus()
  }

  if (e.key === "ArrowRight" && focusedInputIndex !== inputs.length - 1) {
    focusedInputIndex++
    inputs[focusedInputIndex].focus()
  }
});

