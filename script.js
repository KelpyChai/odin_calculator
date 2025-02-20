const MAX_NUM_DIGITS = 8;

const buttonDiv = document.querySelector(".buttons");
const buttonData = [
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

const numberData = {
    a: 0,
    b: 0,
    result: 0,
    hasDecimal: false,
    numIntegers: 1,
    numDecimals: 0,
    get numDigits() { return this.numIntegers + this.numDecimals; },
    curr: 'a',
    get currNum() { return this[this.curr]; }, // Read-only
    operator: 'none',
};

function displayCurrent(data) {
    const display = document.querySelector(".display");

    if ((!data.hasDecimal && data.numDigits <= MAX_NUM_DIGITS) ||
         (data.hasDecimal && data.numDigits + 1 <= MAX_NUM_DIGITS)) {
        display.textContent = String(data.currNum);
        if (data.hasDecimal) {
            if (!display.textContent.includes('.')) {
                display.textContent += '.';
            } else {
                // Round to account for floating point imprecision
                display.textContent = data.currNum.toFixed(data.numDecimals);
            }
            // If not enough decimal places, pad with zeroes
            while (getNumDecimals(display.textContent) < data.numDecimals) {
                display.textContent += '0';
            }
        }
    } else if (data.numIntegers === MAX_NUM_DIGITS) {
        display.textContent = data.currNum.toFixed(0)
    } else if (data.numIntegers > MAX_NUM_DIGITS) {
        const integralPart = +String(data.currNum).split('.')[0];
        display.textContent = integralPart.toExponential(MAX_NUM_DIGITS - 6);
        const expoArray = display.textContent.split('+');
        if (expoArray[1].length === 1) {
            display.textContent = expoArray[0] + "+0" + expoArray[1];
        }
    } else {
        display.textContent = String(+data.currNum.toFixed(MAX_NUM_DIGITS - data.numIntegers - 1));
        if (!display.textContent.includes('.')) {
            display.textContent += '.';
        }
        while (getNumDecimals(display.textContent) < data.numDecimals && 
               display.textContent.length < MAX_NUM_DIGITS) {
            display.textContent += '0';
        }
    }

    if (display.textContent.slice(-1) === '.' && display.textContent.length === MAX_NUM_DIGITS + 1) {
        display.textContent = display.textContent.slice(0, -1);
    }
}

function getNumDecimals(numberStr) {
    if (typeof numberStr !== "string") numberStr = String(numberStr);
    return numberStr.slice(numberStr.indexOf('.')).length - 1;
}

function enterDigit(data, digit) {
    if (data.curr === "result") {
        clearDisplay(data);
    } else if (data.curr === "operator") {
        data.hasDecimal = false;
        data.numIntegers = 1;
        data.numDecimals = 0;
        data.curr = 'b';
    }

    if (data.currNum === 0 && !data.hasDecimal) {
        data[data.curr] = digit;
    } else if (data.hasDecimal) {
        data[data.curr] += (0.1 ** (data.numDecimals + 1)) * digit;
        data.numDecimals += 1;
    } else {
        data[data.curr] *= 10;
        data[data.curr] += digit;
        data.numIntegers += 1;
    }
}

function enterDecimalPoint(data) {
    if (data.curr === "result") {
        clearDisplay(data);
    } else if (data.curr === "operator") {
        data.numIntegers = 1;
        data.numDecimals = 0;
        data.curr = 'b';
    }
    data.hasDecimal = true;
}

function deleteDigit(data) {
    if (data.curr === "result") {
        clearDisplay(data);
    } else if (data.curr === "operator") {
        return;
    }

    if (data.numDecimals > 0) {
        const multiplier = 10 ** (data.numDecimals - 1);
        data[data.curr] = Math.floor(data.currNum * multiplier) / multiplier;
        data.numDecimals -= 1;
    } else if (data.hasDecimal) {
        data.hasDecimal = false;
    } else if (data.numIntegers === 1) {
        data[data.curr] = 0;
    } else {
        data[data.curr] = Math.floor(data.currNum / 10);
        data.numIntegers -= 1;
    }
}

function clearDisplay(data) {
    data.a = 0;
    data.b = 0;
    data.result = 0;
    data.hasDecimal = false;
    data.numIntegers = 1;
    data.numDecimals = 0;
    data.curr = 'a';
    data.operator = 'none';
}

function evaluateExpression(data) {
    if (data.curr === 'operator') {
        data.b = data.a;
        data.curr = 'b';
    }

    if (data.curr === 'b') {
        data.result = +operate(data).toFixed(0x10);
        data.a = 0;
        data.b = 0;
        data.hasDecimal = (getNumDecimals(data.result) === 0) ? false : true;
        data.numIntegers = String(data.result).split('.')[0].length;
        data.numDecimals = getNumDecimals(data.result);
        data.curr = "result";
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
    if (data.curr === "result") {
        data.a = data.result;
    } else if (data.curr === 'b') {
        evaluateExpression(data);
        displayCurrent(data);
        chooseOperator(data, operator);
        return;
    }

    if (operator === "percent") {
        divideByHundred(data);
    } else {
        data.operator = operator;
        data.curr = "operator";
    }
}

function divideByHundred(data) {
    data.b = 100;
    data.curr = 'b';
    data.operator = "divide";
    evaluateExpression(data);
    displayCurrent(data);
}

function createButton(button, data) {
    const newButton = document.createElement("button");
    newButton.className = button.name;
    newButton.textContent = button.symbol;

    if ('0' <= button.symbol && button.symbol <= '9') {
        newButton.addEventListener("click", () => {
            enterDigit(data, +newButton.textContent);
            displayCurrent(data);
        });
    } else if (button.name === 'decimal') {
        newButton.addEventListener("click", () => {
            enterDecimalPoint(data);
            displayCurrent(data);
        })
    } else if (button.name === "backspace") {
        newButton.addEventListener("click", () => {
            deleteDigit(data);
            displayCurrent(data);
        })
    } else if (button.name === "clear") {
        newButton.addEventListener("click", () => {
            clearDisplay(data);
            displayCurrent(data);
        })
    } else if (button.name === "evaluate") {
        newButton.addEventListener("click", () => {
            evaluateExpression(data);
            displayCurrent(data);
        })
    } else {
        newButton.addEventListener("click", () => {
            chooseOperator(data, button.name);
        })
    }

    return newButton;
}

buttonData.forEach(button => {
    buttonDiv.appendChild(createButton(button, numberData));
});

// To-do: replace toFixed() with more accurate rounding function (consider combining toFixed and Math.round)