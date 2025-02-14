const MAX_DIGITS = 8;

const display = document.querySelector(".display");
const buttonsDiv = document.querySelector(".buttons");
const buttons = [
    {name: 'clear',     symbol: 'AC'},
    {name: 'backspace', symbol: '⌫'},
    {name: 'percent',   symbol: '%'},
    {name: 'divide',    symbol: '÷'},
    {name: 'seven',     symbol: '7'},
    {name: 'eight',     symbol: '8'},
    {name: 'nine',      symbol: '9'},
    {name: 'multiply',  symbol: '×'},
    {name: 'four',      symbol: '4'},
    {name: 'five',      symbol: '5'},
    {name: 'six',       symbol: '6'},
    {name: 'subtract',  symbol: '-'},
    {name: 'one',       symbol: '1'},
    {name: 'two',       symbol: '2'},
    {name: 'three',     symbol: '3'},
    {name: 'add',       symbol: '+'},
    {name: 'zero',      symbol: '0'},
    {name: 'decimal',   symbol: '.'},
    {name: 'evaluate',  symbol: '='},
];

let data = {
    current: 'a',
    operator: 'none',
    numDigits: 1,
    a: 0,
    b: 0,
};

buttons.forEach(button => buttonsDiv.appendChild(createButton(button, data)));

function createButton(buttonData, mathData) {
    const button = document.createElement("button");
    button.className = buttonData.name;
    button.textContent = buttonData.symbol;

    if ('0' <= buttonData.symbol && buttonData.symbol <= '9') {
        button.addEventListener('click', () => enterDigit(mathData, button.textContent));
    } else if (buttonData.symbol === '.') {
        button.addEventListener('click', () => enterDecimalPoint());
    } else if (buttonData.name === 'backspace') {
        button.addEventListener('click', () => deleteDigit(mathData));
    } else if (buttonData.name === 'clear') {
        button.addEventListener('click', () => clearDisplay(mathData));
    } else if (buttonData.name === 'evaluate') {
        button.addEventListener('click', () => evaluteExpression(mathData));
    } else {
        button.addEventListener('click', () => chooseOperator(mathData, button.className));
    }

    return button;
}

function enterDigit(data, digit) {
    if (Number.isNaN(parseFloat(data.a))) {
        data.a = 0;
        display.textContent = '0';
    } else if (data.current === 'operator') {
        data.current = 'b';
        display.textContent = '0';
    }

    if (!display.textContent.includes('.') || display.textContent.includes('e')) {
        data[data.current] *= 10;
        data[data.current] += parseInt(digit);
    } else if (display.textContent.slice(-1) === '.') {
        data[data.current] += parseInt(digit) * 0.1;
    } else {
        const decimalPlace = data.numDigits - display.textContent.split('.')[0].length + 1;
        data[data.current] += parseInt(digit) * (0.1 ** decimalPlace);
    }

    if (display.textContent === '0') {
        display.textContent = digit;
        data.numDigits = 1;
    } else {
        display.textContent += digit;
        data.numDigits += 1;
    }

    if (data.numDigits > MAX_DIGITS) {
        if (data[data.current].toString().includes('.')) {
            const numDecimals = MAX_DIGITS - display.textContent.split('.')[0].length;
            display.textContent = data[data.current].toFixed(numDecimals);
        } else {
            display.textContent = data[data.current].toExponential(3);
        }
    }
}

function enterDecimalPoint() {
    if (Number.isNaN(parseFloat(data.a))) {
        data.a = 0;
        display.textContent = '0';
    } else if (data.current === 'operator') {
        data.current = 'b';
        display.textContent = '0';
        data.numDigits = 1;
    }

    if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

function deleteDigit(data) {
    if (Number.isNaN(parseFloat(data.a))) {
        data.a = 0;
        display.textContent = '0';
    } else if (!data[data.current].toString().includes('.')) {
        data[data.current] = Math.floor(data[data.current] / 10);
    } else if (display.textContent.slice(-1) === '.') {
        data.numDigits += 1;
    } else if (data[data.current] !== 0) {
        const decimalPlace = data.numDigits - display.textContent.split('.')[0].length;
        data[data.current] -= parseInt(data[data.current].toString().slice(data.numDigits, data.numDigits + 1)) * (0.1 ** decimalPlace);
    }

    if (data.numDigits === 1) {
        display.textContent = '0';
    } else {
        data.numDigits -= 1;
        if (data.numDigits > MAX_DIGITS) {
            if (data[data.current].toString().includes('.')) {
                const numDecimals = MAX_DIGITS - display.textContent.split('.')[0].length;
                display.textContent = data[data.current].toFixed(numDecimals);
            } else {
                display.textContent = data[data.current].toExponential(3);
            }
        } else if (data.numDigits === MAX_DIGITS) {
            const numDecimals = MAX_DIGITS - display.textContent.split('.')[0].length;
            display.textContent = data[data.current].toFixed(numDecimals);
        } else {
            display.textContent = display.textContent.slice(0, -1);
        }
    }
}

function clearDisplay(data) {
    display.textContent = '0';
    data.current = 'a';
    data.operator = 'none';
    data.numDigits = 1;
    data.a = 0;
    data.b = 0;
}

function evaluteExpression(data) {
    if (data.current === 'a') {
        return;
    } else if (data.current === 'operator') {
        data.b = data.a;
    }

    data.a = operate(data);
    data.b = 0;
    data.current = 'a';
    data.operator = 'none';
    if (data.a.toString().includes('.')) {
        if (data.a.toString().split('.')[0].length > MAX_DIGITS) {
            display.textContent = data[data.current].toExponential(3);
        } else if (data.a.toString().split('.')[1].length > MAX_DIGITS) {
            const numDecimals = MAX_DIGITS - data.a.toString().split('.')[0].length;
            display.textContent = data[data.current].toFixed(numDecimals);
        }
    } else if (data.a.toString().split('.')[0].length > MAX_DIGITS) {
        display.textContent = data[data.current].toExponential(3);
    } else {
        display.textContent = data.a.toString();
    }
}

function operate(data) {
    switch (data.operator) {
        case 'add':
            return data.a + data.b;
        case 'subtract':
            return data.a - data.b;
        case 'multiply':
            return data.a * data.b;
        case 'divide':
            return (data.b === 0) ? 'Uh-oh...' : data.a / data.b;
        default:
            return 'error: unexpected operator';
    }
}

function chooseOperator(data, operator) {
    if (Number.isNaN(parseFloat(data.a))) {
        return;
    } else if (data.current === 'operator') {
        if (operator === 'percent') {
            divideByHundred(data);
        } else {
            data.operator = operator;
        }
    } else if (data.current === 'a') {
        data.current = 'operator';
        if (operator === 'percent') {
            divideByHundred(data);
        } else {
            data.operator = operator;
        }
    } else if (data.current === 'b') {
        evaluteExpression(data);
        chooseOperator(data, operator);
    }
}

function divideByHundred(data) {
    data.operator = 'divide'
    data.b = 100;
    data.current = 'b';
    evaluteExpression(data);
}

// TODO:
//  - Round decimals to avoid overflow
//  - Mitigate floating point errors