'use strict';

const generateId = () => `id${Math.round(Math.random() * 1e8).toString(16)}`;

const totalBalance = document.querySelector('.total__balance');
const totalMoneyIncome = document.querySelector('.total__money-income');
const totalMoneyExpenses = document.querySelector('.total__money-expenses');
const historyList = document.querySelector('.history__list');
const form = document.querySelector('#form');
const operationName = document.querySelector('.operation__name');
const operationAmount = document.querySelector('.operation__amount');

let dbOperation = [];

if (localStorage.getItem('calc')){
    dbOperation = JSON.parse(localStorage.getItem('calc'));
}

const renderOperation = (operation) => {

    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';

    const listItem = document.createElement('li');

    listItem.classList.add('history__item');
    listItem.classList.add(className);

    listItem.innerHTML = `
        ${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history__delete" data-id="${operation.id}">X</button>
    `;

    historyList.append(listItem);

};

const updateBalance = () => {

    const sum = (result, item) => result + item.amount;

    const resultExpenses = dbOperation.filter(item => item.amount < 0).reduce(sum, 0);
    const resultIncome = dbOperation.filter(item => item.amount > 0).reduce(sum, 0);

    totalBalance.textContent = resultIncome + resultExpenses;
    totalMoneyIncome.textContent = resultIncome;
    totalMoneyExpenses.textContent = resultExpenses;
};
const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
};


const addOperation = event => {
    event.preventDefault();

    const operationNameValue = operationName.value.trim(),
        operationAmountValue = operationAmount.value.trim();

    operationAmount.style.borderColor = '';
    operationName.style.borderColor = '';

    if (operationNameValue && operationAmountValue) {
        dbOperation.push({
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
        });
        init();
        operationName.value = '';
        operationAmount.value = '';
    } else {
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
        if (!operationNameValue) operationName.style.borderColor = 'red';
    }
};


const deleteOpertaion = (event) => {
    if (event.target.classList.contains('history__delete')) {
        dbOperation = dbOperation.filter(operation => operation.id !== event.target.dataset.id);
        init();
    }
};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOpertaion);


init();