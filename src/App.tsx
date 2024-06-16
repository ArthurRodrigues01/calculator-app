import './App.css'

import { useEffect, useState } from 'react'

function App() {
  const [isCalculatorOff, setIsCalculatorOff] = useState(false);
  const [currentButton, setCurrentButton] = useState({value: '', type: ''});
  const [previousButton, setPreviousButton] = useState({value: '', type: ''});

  useEffect(() => {    
    const buttons = document.querySelectorAll<HTMLDivElement>('.button')

    function getElementPropertyValue(element: HTMLDivElement, property: string) {
      return window.getComputedStyle(element).getPropertyValue(property)
    }
      
    // buttons animation
    for (const button of buttons) {
      const bgColor = getElementPropertyValue(button, 'background-color')
      const borderBottomColor = getElementPropertyValue(button, 'border-bottom-color')

      function buttonFocusHandler() {
        button.style.borderBottomWidth = '0'
        button.style.marginTop = '12px'
        button.style.backgroundColor = borderBottomColor
        button.style.color = '#ddd'
      }
      function buttonBlurHandler() {
        button.style.borderBottomWidth = '0.8rem'
        button.style.marginTop = '0'
        button.style.backgroundColor = bgColor
        button.style.color = '#fff'
      }

      button.addEventListener('mouseleave', buttonBlurHandler)
      button.addEventListener('mouseup', buttonBlurHandler)
      button.addEventListener('mousedown', buttonFocusHandler)
    }
  }, []);

  useEffect(() => {
    const screen = document.querySelector<HTMLDivElement>('.screen')!
    const screenText = document.querySelector<HTMLDivElement>('.screen-text')!

    if (previousButton.value === '=') {
      if (currentButton.type === 'number') {
        screenText.innerText = ''
      }
    }

    if (isCalculatorOff) {
      return
    }

    if (currentButton.type === 'number') {
      const numbers = screenText.innerText.split(/x|-|\+|\//)

      if (numbers[numbers.length - 1].includes('.') && currentButton.value === '.') {
        return
      }

      if (screenText.innerText === '' || previousButton.type === 'number') {
        screenText.innerText += currentButton.value
      } else {
        screenText.innerText += ` ${currentButton.value}`
      }
    } else if (currentButton.type === 'action') {
      switch (currentButton.value) {
        case 'clear': 
          screenText.innerText = ''
          break
        case 'clear-number': 
          const text = [...screenText.innerText]
          for (let i = text.length; i > -1; i--) {
            if (text[i] === '+' || text[i] === '/' || text[i] === 'x' || text[i] === '-') {
              text.splice(i)
              screenText.innerText = text.join('')
              break
            }
            if (i === 0) {
              screenText.innerText = ''
            } 
          }
          break
        case 'off': 
          screenText.innerText = ''
          screen.style.backgroundColor = '#002b00'
          setIsCalculatorOff(true)
          break
        case '=': 
          const numbers = screenText.innerText.split(/x|-|\+|\//).filter(value => value !== ' .')
          const operations = screenText.innerText.match(/x|-|\+|\//g)!
          let result = 0

          for (let i = 0; i < numbers.length; i++) {
            if (i === 0) {
              result = Number(numbers[i])
            } else {
              switch (operations[i - 1]) {
                case '+':
                  result = result + Number(numbers[i])
                  break
                case '-':
                  result = result - Number(numbers[i])
                  break
                case 'x':
                  result = result * Number(numbers[i])
                  break
                case '/':
                  result = result / Number(numbers[i])
                  break
              }
            }
          }

          screenText.innerText = `${result}`
      }
    } else if (currentButton.type === 'operation') {      
      if (previousButton.type === 'operation' && screenText.innerText !== '') {
        const newStr = screenText.innerText.slice(0, screenText.innerText.length - 1) + currentButton.value
        screenText.innerText = newStr
        return 
      }

      if (screenText.innerText !== '') {
        screenText.innerText += ` ${currentButton.value}`
      }
    }

    setPreviousButton(currentButton)
  }, [currentButton])

  return (
    <div className='app-wrapper'>
      <div className='calculator'>
        <div className='screen'>
          <h1 className='screen-text'></h1>
        </div>
        <div className='button action-button off' onClick={() => setCurrentButton({ value: 'off', type: 'action'})}>OFF</div>
        <div className='button action-button clear' onClick={() => setCurrentButton({ value: 'clear', type: 'action'})}>C</div>
        <div className='button action-button clear-number' onClick={() => setCurrentButton({ value: 'clear-number', type: 'action'})}>CE</div>
        <div className='button operator-button division' onClick={() => setCurrentButton({ value: '/', type: 'operation' })}>/</div>
        <div className='button operator-button subtraction' onClick={() => setCurrentButton({ value: '-', type: 'operation' })}>-</div>
        <div className='button operator-button adition' onClick={() => setCurrentButton({ value: '+', type: 'operation' })}>+</div>
        <div className='button operator-button multiplication' onClick={() => setCurrentButton({ value: 'x', type: 'operation' })}>x</div>
        <div className='button' onClick={() => setCurrentButton({ value: '1', type: 'number' })}>1</div>
        <div className='button' onClick={() => setCurrentButton({ value: '2', type: 'number' })}>2</div>
        <div className='button' onClick={() => setCurrentButton({ value: '3', type: 'number' })}>3</div>
        <div className='button' onClick={() => setCurrentButton({ value: '4', type: 'number' })}>4</div>
        <div className='button' onClick={() => setCurrentButton({ value: '5', type: 'number' })}>5</div>
        <div className='button' onClick={() => setCurrentButton({ value: '6', type: 'number' })}>6</div>
        <div className='button' onClick={() => setCurrentButton({ value: '7', type: 'number' })}>7</div>
        <div className='button' onClick={() => setCurrentButton({ value: '8', type: 'number' })}>8</div>
        <div className='button' onClick={() => setCurrentButton({ value: '9', type: 'number' })}>9</div>
        <div className='button' onClick={() => setCurrentButton({ value: '0', type: 'number' })}>0</div>
        <div className='button' onClick={() => setCurrentButton({ value: '.', type: 'number' })}>.</div>
        <div className='button action-button equal' onClick={() => setCurrentButton({ value: '=', type: 'action'})}>=</div>
      </div>
    </div>
  )
}

export default App
