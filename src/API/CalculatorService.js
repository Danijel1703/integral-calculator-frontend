import axios from "axios";
const baseUrl = 'http://danijel.pythonanywhere.com'

class CalculatorService {
    async solveWithAll(equation, downLimit, upperLimit, subintervals) {
        const response = await axios.post(baseUrl + '/solve-with-all', {equation, downLimit, upperLimit, subintervals})
        return response.data
    }

    async convertToExpression(equation) {
        const response = await axios.post(baseUrl + '/convert-expression', {equation})
        return response.data
    }
}

export default new CalculatorService();