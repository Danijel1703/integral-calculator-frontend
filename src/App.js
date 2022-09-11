import './App.css';
import 'mathlive';
import React, { useEffect, useState } from 'react';
import CalculatorService from './API/CalculatorService';
import functionPlot from 'function-plot';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [equation, setEquation] = useState('')
  const [resultTrapez, setResultTrapez] = useState('')
  const [resultSimpsons, setResultSimpsons] = useState('')
  const [upperLimit, setUpperLimit] = useState(0)
  const [downLimit, setDownLimit] = useState(0)
  const [subintervals, setSubintervals] = useState(0)
  const [expression, setExpression] = useState(null)

  const formattedEquation = equation.replace('/', '//')
  const methods = ['trapez', 'simpsons']

  useEffect(() => {
    setExpression('')
  }, [])

  const onInputChange = (e) => {
    setEquation(e.target.value, 'original')
  }

  const setResultState = (method, result) => {
    if(method === 'simpsons') {
      setResultSimpsons(result)
    } else {
      setResultTrapez(result)
    }
  }
  
  const onSolveWithAll = async () => {
    const converted = convertToExpression(formattedEquation)
    if(!converted) return;
    if(Number(downLimit) > Number(upperLimit)) {
      return errorHanlder('Donja granica mora biti manja od gornje granice.')
    }
    const response = await CalculatorService.solveWithAll(formattedEquation, downLimit, upperLimit, subintervals)
    methods.forEach(method => {
      if(response[method] && response[method].error) {
        const error = response[method].error
        errorHanlder(error.message)
        if(!error.isCommon) {
          setResultState(method, 0)
        } else {
          methods.map(method => (setResultState(method, 0)))
        }
      } else {
        setResultState(method, response[method])
      }
    })
  }
  const convertToExpression = async () => {
    let response = await CalculatorService.convertToExpression(formattedEquation)
    if(response.error || !isNaN(Number(response))) {
      errorHanlder(response.error)
      return
    }
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
    return response
  }

  const functionGraph = <div id="function--graph" className='graph-container'></div>
  
  const DrawFunctionGraph = () => {
    functionPlot({
      title: 'Funkcija',
      grid: true,
      data: [{
        fn: expression !== ''  ? expression : '0',
      }],
      target: '#function--graph'
    })
  }

  const errorHanlder = (error) => {
      toast.error(error);
  }
  return (
    <React.Fragment>
      <div className="wrapper">
      <script defer src="//unpkg.com/mathlive"></script>
      <div className='main--title'>
        <h1 className='flex--column--center height--full'>Integral kalkulator</h1>
      </div>
      <div className='function--input--box flex--column--center'>
        <p className='text--width--lg'>Unesite funkciju koju želite integrirati:</p>
        <div className='function--input' style={{ position: 'relative' }}>
          <math-field 
            id="formula" 
            style={{ color: 'black', background: 'white', border: '2px solid black' }} 
            onInput={onInputChange} 
            virtual-keyboard-mode='manual'>
            {equation}
          </math-field>
        </div>
      </div>
      <div className='number--inputs flex--column--center'>
        <div className='flex--row--start padding--sml'>
          <div>
            <p>Donja granica:</p>
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
            <p>Broj podintervala:</p>
          <input
            placeholder="100"
            min={1}
            type="number"
            className='input--number'
            onChange={e => setSubintervals(e.target.value)}
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
          <p>Rezultat dobiven Simpsonovom metodom: {resultSimpsons}</p>
        </div>
        <div className='result--trapez'>
          <p>Rezultat dobiven metodom Trapeza: {resultTrapez}</p>
        </div>     
      </div>
        {functionGraph}
        <DrawFunctionGraph />
    </div>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          theme='colored'
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          icon={true} />     
    </React.Fragment>
  );
}

export default App;
