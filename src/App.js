import './App.css';
import 'mathlive';
import { useEffect, useState } from 'react';
import CalculatorService from './API/CalculatorService';
import functionPlot from 'function-plot';

function App() {
  const [equation, setEquation] = useState('')
  const [resultTrapez, setResultTrapez] = useState('')
  const [resultSimps, setResultSimps] = useState('')
  const [upperLimit, setUpperLimit] = useState(0)   // no need for 'state' use just a variable
  const [downLimit, setDownLimit] = useState(0)   // no need for 'state' use just a variable
  const [accuracy, setAccuracy] = useState(0)   // no need for 'state' use just a variable
  const [expression, setExpression] = useState(null)
  const formattedEquation = equation.replace('/', '//')

  useEffect(() => {
    setExpression('')
  }, [])

  const onInputChange = (e) => {
    setEquation(e.target.value, 'original')
  }
  const onSolveByTrapez = async () => {
    const response = await CalculatorService.solveByTrapez(formattedEquation, downLimit, upperLimit, accuracy)
    setResultTrapez(response)
  }
  const onSolveBySimps = async () => {
    const response = await CalculatorService.solveBySimpsons(formattedEquation, downLimit, upperLimit, accuracy)
    setResultSimps(response)
  }
  const onSolveWithAll = async () => {
    convertToExpression(formattedEquation)
    const response = await CalculatorService.solveWithAll(formattedEquation, downLimit, upperLimit, accuracy)
    setResultSimps(response.simpsons)
    setResultTrapez(response.trapez)
  }
  const convertToExpression = async () => {
    let response = await CalculatorService.convertToExpression(formattedEquation)
    if(response.error || !isNaN(Number(response))) return
    for(const match of response) {
      switch(match) {
        case '·': 
          response = response.replace('·', '*')
          break;
        case '√':
          response = response.replace('√', 'sqrt')
          break;
        default:
          break;
      }
    }
    setExpression(response)
  }

  const functionGraph = <div id="function--graph" className='graph-container'></div>
  
  const DrawFunctionGraph = () => {
    functionPlot({
      title: 'Funkcija',
      grid: true,
      data: [{
        fn: expression !== ''  ? expression : '0'
      }],
      target: '#function--graph'
    })
  }
 
  return (
    <div className="wrapper">
      <script defer src="//unpkg.com/mathlive"></script>
      <div className='main--title'>
        <h1 className='flex--column--center height--full'>Integral kalkulator</h1>
      </div>
      <div className='function--input--box flex--column--center'>
        <p className='text--width--lg'>Unesite funkciju koju želite integrirati:</p>
        <div className='function--input' style={{ position: 'relative' }}>
          <math-field id="formula" style={{ color: 'black', background: 'white', border: '2px solid black' }} onInput={onInputChange} virtual-keyboard-mode='manual'>
            {equation}
          </math-field>
        </div>
      </div>
      <div className='number--inputs flex--column--center'>
        <div className='flex--row--start padding--sml'>
          <div>
            <p>Doljnja granica:</p>
          <input
            placeholder="0"
            min={0}
            type="number"
            className='input--number'
            onChange={e => setDownLimit(e.target.value)}
          />
          </div>
          <div>
            <p>Gornja granica:</p>
          <input
            placeholder="1"
            min={1}
            type="number"
            className='input--number'
            onChange={e => setUpperLimit(e.target.value)}
          />
          </div>
          <div>
            <p>Točnost:</p>
          <input
            placeholder="100"
            min={1}
            type="number"
            className='input--number'
            onChange={e => setAccuracy(e.target.value)}
          />
          </div>

        </div>
      </div>
      <div className='submit--inputs flex--row--center'>
        <input
          value="Izračunaj"
          onClick={onSolveWithAll}
          type="button"
          className='submit--button'
        />
      </div>
      <div className='results'>
        <div className='result--simpsons'>
          <p>Simpson: {resultSimps}</p>
        </div>
        <div className='result--trapez'>
          <p>Trapez: {resultTrapez}</p>
        </div>
      </div>
        {functionGraph}
        <DrawFunctionGraph />
    </div>
  );
}

export default App;
