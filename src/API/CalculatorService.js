import axios from "axios";
const baseUrl = 'http://localhost:5000'

class CalculatorService {
    async solveByTrapez(equation, downLimit, upperLimit, accuracy) {
        const response = await axios.post(baseUrl + '/solve-trapez', {equation, downLimit, upperLimit, accuracy})
        return response.data
    }

    async solveBySimpsons(equation, downLimit, upperLimit, accuracy) {
        const response = await axios.post(baseUrl + '/solve-simps', {equation, downLimit, upperLimit, accuracy})
        return response.data
    }

    async solveWithAll(equation, downLimit, upperLimit, accuracy) {
        const response = await axios.post(baseUrl + '/solve-with-all', {equation, downLimit, upperLimit, accuracy})
        return response.data
    }

    async convertToExpression(equation) {
        const response = await axios.post(baseUrl + '/convert-expression', {equation})
        return response.data
    }
}

export default new CalculatorService();