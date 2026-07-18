const form = document.getElementById("transactionForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const type = document.getElementById("type");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const themeBtn = document.getElementById("themeBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

renderTransactions();

form.addEventListener("submit", function(e){

    e.preventDefault();

    const transaction = {
        id: editId || Date.now(),
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value,
        type: type.value
    };

    if(editId){

        transactions = transactions.map(item =>
            item.id === editId ? transaction : item
        );

        editId = null;

    }else{

        transactions.push(transaction);

    }

    saveData();

    form.reset();

});

function renderTransactions(){

    transactionList.innerHTML="";

    let totalIncome=0;
    let totalExpense=0;

    let keyword = search.value.toLowerCase();
    let selected = filter.value;

    let filtered = transactions.filter(item=>{

        let matchSearch = item.title.toLowerCase().includes(keyword);

        let matchCategory = selected==="all" || item.category===selected;

        return matchSearch && matchCategory;

    });

    filtered.forEach(item=>{

        const li=document.createElement("li");

        li.className=`transaction ${item.type}`;

        li.innerHTML=`

        <div class="left">

        <h3>${item.title}</h3>

        <small>${item.category} | ${item.date}</small>

        </div>

        <div class="right">

        <span class="amount">

        ${item.type==="income" ? "+" : "-"} ₹${item.amount}

        </span>

        <button class="edit">

        <i class="fa-solid fa-pen"></i>

        </button>

        <button class="delete">

        <i class="fa-solid fa-trash"></i>

        </button>

        </div>

        `;

        li.querySelector(".delete").addEventListener("click",()=>{

            transactions = transactions.filter(t=>t.id!==item.id);

            saveData();

        });

        li.querySelector(".edit").addEventListener("click",()=>{

            title.value=item.title;
            amount.value=item.amount;
            category.value=item.category;
            date.value=item.date;
            type.value=item.type;

            editId=item.id;

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        });

        transactionList.appendChild(li);

    });

    transactions.forEach(item=>{

        if(item.type==="income")
            totalIncome += item.amount;
        else
            totalExpense += item.amount;

    });

    income.textContent=`₹${totalIncome}`;

    expense.textContent=`₹${totalExpense}`;

    balance.textContent=`₹${totalIncome-totalExpense}`;

}

function saveData(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    renderTransactions();

}

search.addEventListener("keyup",renderTransactions);

filter.addEventListener("change",renderTransactions);

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }else{

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

});