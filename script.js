const transactions=JSON.parse(localStorage.getItem('transactions')) || [];


const formatter=new Intl.NumberFormat("en-IN",{
    style:"currency",
    currency:"INR",
    signDisplay:"always",
}
)
const list=document.getElementById("transactionList");
const form=document.getElementById("transactionForm")
const status=document.getElementById("status");
const balance=document.getElementById("balance");
const income=document.getElementById("income");
const expense=document.getElementById("expense");

form.addEventListener("submit",addTransaction);

function updateTotal(){
    const incomeTotal=transactions.filter((track)=>track.type==='income').reduce((total,track)=>total + track.amount,0);
    const expenseTotal=transactions.filter((track)=>track.type==='expense').reduce((total,track)=>total + track.amount,0);
    const balanceTotal=incomeTotal-expenseTotal;
    balance.textContent=formatter.format(balanceTotal);
    income.textContent=formatter.format(incomeTotal);
    expense.textContent=formatter.format(expenseTotal*-1);
}

function renderList(){
    if(transactions.length===0){
        status.textContent="No transactions";
        return;
    }
    list.innerHTML="";
    transactions.forEach(({id,name,amount,date,type})=>{
        const sign='income'===type? 1:-1;
        const li=document.createElement("li");
        li.innerHTML=`
            <div class="name">
               <h4>${name}</h4>
               <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="amount ${type}">
               <span>${formatter.format(amount*sign)}</span>
            </div>
            <div class="action">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="deleteTransaction(${id})">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>         
        `;
        list.appendChild(li);
    })
}
updateTotal();
saveTheTransaction();
renderList();
function deleteTransaction(id){
    const index=transactions.findIndex((trx)=>trx.id===id);
    transactions.splice(index, 1);
    updateTotal();
    saveTheTransaction();
    renderList();
}
function addTransaction(e){
    e.preventDefault();
    const formData=new FormData(this);
    transactions.push({
        id:transactions.length+1,
        name:formData.get("name"),
        amount:parseFloat(formData.get("amount")),
        date:new Date(formData.get("date")),
        type:'1'===formData.get("type")? 'expense':'income',
    })
    this.reset();
    updateTotal();
    saveTheTransaction();
    renderList();    
}
function saveTheTransaction(){
    transactions.sort((a,b)=>new Date(b.date)-new Date(a.date));
    localStorage.setItem("transactions",JSON.stringify(transactions));
}
