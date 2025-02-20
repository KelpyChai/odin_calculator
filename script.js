const MAX_NUM_DIGITS = 8;

const buttonDiv = document.querySelector(".buttons");
const buttonData = [
    {name: 'clear',     symbol: 'AC'},
    {name: 'backpsace', symbol: '⌫'},
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
    hasDecimal: false,
    numIntegers: 1,
    numDecimals: 0,
    get numDigits() { return this.numIntegers + this.numDecimals; },
    a: 0,
    b: 0,
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
}

function getNumDecimals(numberStr) {
    return numberStr.slice(numberStr.indexOf('.')).length - 1;
}

function enterDigit(data, digit) {
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
    console.log(data.currNum);
    displayCurrent(data);
}

function enterDecimal(data) {
    data.hasDecimal = true;
    console.log(data.currNum);
    displayCurrent(data);
}

function createButton(button, data) {
    const newButton = document.createElement("button");
    newButton.className = button.name;
    newButton.textContent = button.symbol;

    if ('0' <= button.symbol && button.symbol <= '9') {
        newButton.addEventListener('click', () => {
            enterDigit(data, +newButton.textContent);
        });
    } else if (button.symbol === '.') {
        newButton.addEventListener('click', () => {
            enterDecimal(data);
        })
    }

    return newButton;
}

buttonData.forEach(button => {
    buttonDiv.appendChild(createButton(button, numberData));
});

// To-do: replace toFixed() with more accurate rounding function (consider combining toFixed and Math.round)