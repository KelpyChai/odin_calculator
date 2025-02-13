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
    a: 0.0,
    b: 0.0,
};

buttons.forEach(button => buttonsDiv.appendChild(createButton(button, data)));

function createButton(buttonData, mathData) {
    const button = document.createElement("button");
    button.className = buttonData.name;
    button.textContent = buttonData.symbol;

    if ('0' <= buttonData.symbol && buttonData.symbol <= '9') {
        button.addEventListener('click', () => enterDigit(mathData, button.textContent));
    } else if (buttonData.name === 'backspace') {
        button.addEventListener('click', () => deleteDigit(mathData));
    } else if (buttonData.name === 'clear') {
        button.addEventListener('click', () => clearDisplay(mathData));
    } 

    return button;
}

function enterDigit(data, digit) {
    if (display.innerHTML === '0') {
        display.innerHTML = digit;
    } else {
        display.innerHTML += digit;
    }
    data[data.current] += parseInt(digit);
}

function deleteDigit(data) {
    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
    data[data.current] = Math.floor(data[data.current] / 10);
}

function clearDisplay(data) {
    display.textContent = '0';
    data.current = 'a';
    data.operator = 'none';
    data.a = 0.0;
    data.b = 0.0;
}