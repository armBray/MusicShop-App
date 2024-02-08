import {menuArray} from './data.js'

const footerEl = document.getElementById('footer-total-order')
let orderStatus = [
    {
        id: 0,
        isSelected: false,
        totalSelection: 0,
        total: 0
    },
    {
        id: 1,
        isSelected: false,
        totalSelection: 0,
        total: 0
    },
    {
        id: 2,
        isSelected: false,
        totalSelection: 0,
        total: 0
    },
]

let discount = {
    isApplied: false,
    isShown: false
}

document.addEventListener('click', function(e){
    // console.log('event target: ', e.target);
    
    if (e.target.id === 'card-button'){
        handlePlusBtn(e)
    }

    // console.log(orderStatus);
    if (e.target.id === 'footer-item-remove'){
        handleRemoveBtn(e)
    }

    
    if(!discount.isShown) {
        renderDiscount()
        discount.isShown = true
        console.log('Discount is injected')
    }
    
    const numberItemsOrdered = countOrderItems()
    console.log('numberItemsOrdered: ', numberItemsOrdered);
    numberItemsOrdered > 1 ? discount.isApplied = true : discount.isApplied = false
    const total = totalReducer(orderStatus,discount.isApplied)

    if (discount.isApplied) {
        console.log('Discount is applied')
        document.getElementById('footer-item-discount').remove()
        renderDiscount()
        document.getElementById('footer-item-discount').style.display = 'flex'
        document.getElementById('footer-item-price-discount').textContent = `- $${Math.floor(total*.2)}`
    } else {
        console.log('Discount not applied')
        document.getElementById('footer-item-discount').remove()
        discount.isShown = false
    }

    document.getElementById('footer-total-price').textContent = `$${total}`


    if (e.target.id === 'complete-btn'){
        // console.log('show modal');
        document.getElementById(`home`).classList.add('not-reachable')
        document.getElementById('modal').style.display = 'flex'
    } 

    if (e.target.id === 'payment-btn'){
        e.preventDefault()
        handleValidation() ? handlePayBtn() : null
    } 

    if (e.target.dataset.star) {
        handleRating(e)
    }
})


function handleRating(e){
    const starsEL = document.getElementById('stars-list').getElementsByTagName('img')
    Array.from(starsEL).forEach(function (element) {
        element.setAttribute('src', "./assets/star-empty.svg")
    });
    
    for (let i = 0; i < Number(e.target.dataset.star); i++) {
        document.getElementById(`star-${i+1}`).setAttribute('src', "./assets/star-full.svg")
    }
}

function handleValidation(){
    let validation = [false, false, false]

    const checkedNameInput = document.querySelector('input[type="text"]:required')
    const checkedNumberInput = document.querySelectorAll('input[type="number"]:required')

    if(!checkedNameInput.value){ 
        console.log("Please insert a name");
        checkedNameInput.nextElementSibling.style.display = 'block'
    } else {
        validation[0] = true
        checkedNameInput.nextElementSibling.style.display = 'none'
    }

    if(!checkedNumberInput[0].value) {
        console.log("Please insert the card number");
        checkedNumberInput[0].nextElementSibling.style.display = 'block'
    } else {
        if(checkedNumberInput[0].value.length !== 16) {
            console.log("Please insert 16 card numbers");
            checkedNumberInput[0].nextElementSibling.style.display = 'block'
        }
        else {
            validation[1] = true
            checkedNumberInput[0].nextElementSibling.style.display = 'none'
        }
    }

    if(!checkedNumberInput[1].value) {
        console.log("Please insert the cvv");
        checkedNumberInput[1].nextElementSibling.style.display = 'block'
    } else {
        if(checkedNumberInput[1].value.length !== 3) {
            console.log("Please insert 3 digits");
            checkedNumberInput[1].nextElementSibling.style.display = 'block'
        } else {
            validation[2] = true
            checkedNumberInput[1].nextElementSibling.style.display = 'none'
        }
    }

    return validation[0] && validation[1] && validation[2] ? true : false
}

function handlePayBtn(){
    const name = document.getElementById('form-name').value
    const cardNumber = document.getElementById('form-card-number').value
    const cvv = document.getElementById('form-cvv').value
    
    document.getElementById(`home`).classList.toggle('not-reachable')
    document.getElementById('modal').style.display = 'none'
    document.getElementById('footer-total-order').style.display = 'none'
    
    document.getElementById('home').innerHTML += renderSuccess(name)
}

function handleRemoveBtn(e){
    const removeNumber = Number(e.target.dataset.removebutton)
    // console.log('removing item: ', removeNumber);
    orderStatus.forEach(status => {
        // console.log('status: ', status);
        if (status.id === removeNumber) {
            orderStatus[removeNumber].totalSelection = 0
            orderStatus[removeNumber].total = 0
            document.getElementById(`footer-item-price-${status.id}`).textContent = `$${0}`
            orderStatus[removeNumber].isSelected = false
            document.getElementById(`footer-item-${removeNumber}`).remove()
        }
    });
}

function handlePlusBtn(e){
    footerEl.style.display = 'flex'
    const plusNumber = Number(e.target.dataset.plusbutton)
    orderStatus[plusNumber].totalSelection++
    orderStatus[plusNumber].total += menuArray[plusNumber].price

    if (!orderStatus[plusNumber].isSelected){
        document.getElementById('footer-items-wrapper').innerHTML += renderOrder(plusNumber)
        orderStatus[plusNumber].isSelected = true
    }
    if (orderStatus[plusNumber].isSelected) {
        renderTotalItem(plusNumber)
    }
    // console.log('adding item: ', plusNumber);
}

function renderTotalItem(itemId){
    menuArray.forEach(element => {
        if (element.id === itemId) {
            document.getElementById(`footer-item-price-${itemId}`).textContent = `$${element.price*orderStatus[element.id].totalSelection}`
        }
    });
}

function countOrderItems (){
    let numberItemsOrdered = 0
    const prova = orderStatus.map(order => {
        order.isSelected ? numberItemsOrdered++ : null
        return order.isSelected
    })
    console.log('isSelected: ', prova)
    console.log('Number of items ordered: ', numberItemsOrdered)
    return numberItemsOrdered
}

function totalReducer(array,discount){
    console.log('Discount: ', discount)
    const total = array.reduce((total,currentItem) => {
        return total + currentItem.total
    },0)
    return discount ? Math.floor(total - total*.2) : total
}

function renderDiscount(){
    document.getElementById('footer-items-wrapper').innerHTML +=
        `
        <div class="footer-item" id="footer-item-discount">
        <h2 class="footer-item-name">Discount 20%</h2>
        <p class="footer-item-price" id="footer-item-price-discount"></p>
        </div>
        `
}

function renderSuccess(name){
    return `<span class="span-success" id="span-success">
        Thanks, ${name}! Your order is on its way!
        <div>
            <p>Rate me!</p>
            <ul id="stars-list">
                <li><img id="star-1" data-star="1" src="./assets/star-empty.svg"></li>
                <li><img id="star-2" data-star="2" src="./assets/star-empty.svg"></li>
                <li><img id="star-3" data-star="3" src="./assets/star-empty.svg"></li>
                <li><img id="star-4" data-star="4" src="./assets/star-empty.svg"></li>
                <li><img id="star-5" data-star="5" src="./assets/star-empty.svg"></li>
            </ul>
        </div>
    </span>`
}


function renderOrder(itemSelected){
    let orderHtml = ''
    menuArray.forEach(element => {
        if (element.id === itemSelected) {
            // console.log('selected item: ', element.id);
            orderHtml += `
            <div class="footer-item" id="footer-item-${element.id}">
                <h2 class="footer-item-name">${element.name}</h2>
                <button class="footer-item-remove" id="footer-item-remove" data-removeButton="${element.id}">remove</button>
                <p class="footer-item-price" id="footer-item-price-${element.id}">$${element.price*orderStatus[element.id].totalSelection}</p>
            </div>
            `
            // console.log(element.price*orderStatus[element.id].totalSelection);
        }
    });
    return orderHtml
}

function getItemsMenuHtml(){
    let itemsHtml = ''
    if(menuArray.length > 0) {
        menuArray.map( (item,index) => {
            itemsHtml += `
                        <div class="card" id="card">
                            <p class="emoji"> ${item.emoji} </p>
                            <div class="card-details">
                                <h1 class="card-title">${item.name}</h1>
                                <p class="card-accessories">${item.accessories}</p>
                                <p class="card-price">$${item.price}</p>
                            </div>
                            <button id="card-button" data-plusButton="${index}">+</button>
                        </div>
                        `
        })
        return itemsHtml
    }
    else {return `<p class="no-items">I'm sorry we are sold out!</p>`}
}

function render(){
    document.getElementById('main').innerHTML = getItemsMenuHtml()
}

render ()