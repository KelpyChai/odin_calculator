const buttonsDiv = document.querySelector(".buttons");
const buttons = [
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

let data = {
    current: 'a',
    operator: 'none',
    a: 0,
    b: 0,
};

buttons.forEach(button => buttonsDiv.appendChild(createButton(button, data)));

function createButton(buttonData, mathData) {
    const button = document.createElement("button");
    button.className = buttonData.name;
    button.textContent = buttonData.symbol;
    return button;
}