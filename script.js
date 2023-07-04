let btnAddToCart = document.querySelectorAll(".btn-add-to-cart")

let cart = JSON.parse(localStorage.getItem("APP_Shopping_cart")) || [] 

let cartDetail = document.querySelector(".cart-detail")

let cartIcon = document.querySelector(".cart-icon")

let cartIconIndicator = document.querySelector(".cart-icon div")




showCartIcon()

getItems()

async function getItems() {

    let res = await fetch("./items.json")

    let data = await res.json()

    items = data

    btnAddToCart.forEach(btn => {

    btn.addEventListener("click", e => {

        data.forEach(item => {

            if(item.id == e.target.dataset.id) {

                let itemExistInCart = cart.some(cart_item => e.target.dataset.id == cart_item.id)

                if(itemExistInCart) {

                    let thatItem = cart.find(i => e.target.dataset.id == i.id);

                    thatItem.number += 1;

                    localStorage.setItem("APP_Shopping_cart", JSON.stringify(cart))

                    showCartIcon()

                } else {

                    cart.push({

                        id: item.id,

                        name: item.name,

                        category: item.category,

                        priceCents: item.priceCents,

                        imageColor: item.imageColor,

                        number: 1

                    })

                    localStorage.setItem("APP_Shopping_cart", JSON.stringify(cart))

                    showCartIcon()

                }

            }

        })

    })

})

}

cartIcon.addEventListener("click", e => {

    cartIcon.classList.toggle("showCartDetail")

    if(!cartIcon.classList.contains("showCartDetail")) {

        cartDetail.classList.add("invisible")

    } else {

        cartDetail.classList.remove("invisible")

        cartDetail.querySelector("div").classList.remove("invisible")

    }

})




function showCartIcon() {

    if(cart.length != 0) {

        cartIcon.classList.remove("invisible")

        let s = 0;

        cart.forEach(cartItem => {

            s += cartItem.number;

        })

        cartIconIndicator.innerText = ""

        cartIconIndicator.innerText = s

        printCartItem()
    
    } else {
    
        cartIcon.classList.add("invisible")

        cartDetail.querySelector("div").classList.add("invisible")
    
    }

}

function printCartItem() {

    let cartTotal = 0

    let cartDetailUpper = cartDetail.querySelector("div div div:first-child")

    let cartDetailUnder = cartDetail.querySelector(".cartDetailUnder span:last-child")

    cartDetailUpper.innerHTML = ""

    cart.forEach(cartItem => {

        let temp = document.getElementsByTagName("template")[0];

        let clon = temp.content.cloneNode(true).querySelector(".mb-6");   

        clon.dataset.itemId = cartItem.id
        
        let img = clon.querySelector("img")

        let price = clon.querySelector(".item-price")

        let name = clon.querySelector(".item-name")

        let number = clon.querySelector(".item-number")

        img.src = `https://dummyimage.com/210x130/${cartItem.imageColor}/${cartItem.imageColor}`

        price.innerText = `$${((cartItem.priceCents/100)*cartItem.number).toFixed(2)}`

        name.innerText = cartItem.name

        number.innerText = `x${cartItem.number}`

        cartDetailUpper.appendChild(clon)

        cartTotal += (cartItem.priceCents/100) * cartItem.number;

        clon.querySelector("button").addEventListener("click", e => {

            deleteCartItem(e)

        })

    })

    cartDetailUnder.innerText = `$${cartTotal.toFixed(2)}`

}

function deleteCartItem(e) {

    let deletedId = e.target.closest(".mb-6").dataset.itemId

    cart = cart.filter(cartItem => cartItem.id != deletedId)

    localStorage.setItem("APP_Shopping_cart", JSON.stringify(cart))

    showCartIcon()

}