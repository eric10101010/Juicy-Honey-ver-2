AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 400, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});
//首頁-商品輪播圖
const bannerSwiper = new Swiper(".swiper-container", {
    autoplay: {
        delay: 2000, // 3秒切換一次
        stopOnLastSlide: false,
        disableOnInteraction: true,
    },
    breakpoints: {
        "1028": {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        "767": {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        "375": {
            slidesPerView: 1,
            spaceBetween: 30,
        },
    },
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
//-商品輪播圖
const newsSwiper = new Swiper(".swiper-block", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    breakpoints: {
        "1028": {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        "767": {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        "375": {
            slidesPerView: 1,
            spaceBetween: 0,
        },
    },
    loop: false,
});
//最新消息
const swiper = new Swiper(".mySwiper", {
    autoplay: {
        delay: 3000, // 
        stopOnLastSlide: false,
        disableOnInteraction: true,
    },
});
//漢堡選單點擊
$(document).ready(function(){
	$('.hamburger').click(function(){
		$(this).toggleClass('open');
	});
});
//AJAX 
const productWrap = document.querySelector('.shop-product-list');
const orderWrap = document.querySelector('.orderWrap');
const spentWrap = document.querySelector('.spentWrap');
const deleteWrap = document.querySelector('.cartList');
const qtyWrap = document.querySelector('.qtyWrap');
const deleteAllBtn = document.querySelector('.deleteAllBtn');
//列表元素
const cartList = document.querySelector('.cartList');
const orderInfor = document.querySelector('.orderInfor');
const orderTable = document.querySelector('.orderTable');
const orderCheck = document.querySelector('.orderCheck');
const cartFinal = document.querySelector('.cart-final');
const cartTotal = document.querySelector('.cart-finalprice');
const orderFinal = document.querySelector('.order-cart-final');
const orderPaid = document.querySelector('.order-paid');
//表單元素
const formName = document.querySelector('.form-name');
const formEmail = document.querySelector('.form-email');
const formTel = document.querySelector('.form-tel'); 
const formAddress = document.querySelector('.form-address');
const formPayway = document.querySelector('.form-payWay'); 
const formMessage = document.querySelector('.form-message');

const cartBtn = document.querySelector('.cart-orderbtn');
const productImg = document.querySelector('.product-img');
const productText = document.querySelector('.product-text');

const page = document.querySelector('.pages');
const productSideList = document.querySelector(".shop-side-list");


let cartData = [];
let productData = [];
let orderData = [];
let cartPrice ="";
let orderPrice = "";
let order =[];
let orderID = sessionStorage.getItem('ID');
let productID = sessionStorage.getItem('XD');

// let cartId = [];
let products = [];
let product = [];
let productList = [];

getProduct();
getCartList();
getOrderList();
getProductItem();

//取得商品列表
function getProduct() {
    let api = "https://vue3-course-api.hexschool.io/api/bee666/products/all";
    axios.get(api)
        .then(res => {
        productData = res.data.products;
        renderPage(1);
    }).catch(err => {
        console.log(err);
    });
}
//取得單筆商品
productWrap.addEventListener("click", function (e) {
    e.preventDefault();
    const productID = e.target.getAttribute('data-xd');
    if (productID) {
        self.location.href=`product.html`;
    }
    sessionStorage.setItem('XD', productID);
    console.log(productID);
})
function getProductItem() {
    let api = `https://vue3-course-api.hexschool.io/api/bee666/product/${productID}`;
    axios.get(api)
        .then(res => {
        product = res.data.product;
        //console.log(api);
        console.log(product);
        renderProductItemImg();
        renderProductItemText();
    }).catch(err => {
        console.log(err);
    });
}
function renderProductItemImg() {
    let str = "";
    let item = product;
    str += `<img src="${item.imageUrl}" alt="product">`
    productImg.innerHTML = str;
}
function renderProductItemText() {
    let str = "";
    let item = product;
    str += `
        <li class="product-text-title">
            <h3 class="fw-bold">${item.title}</h3>
        <li>
        <li class="product-text-intro">
            <span>${item.content}</span>
        </li>
        <li class="product-text-price">
            <h5 class="pb-2">原價:NT$${item.origin_price}</h5>
            <h4 class="pb-2">售價: <span class="text-danger fw-bold">NT$${item.price}</span></h4>
            <p>庫存: 目前尚有${item.num}${item.unit}</p>
        </li>`
    productText.innerHTML = str;
}

//取得訂單
function getCartList(){
    const url = "https://vue3-course-api.hexschool.io/api/bee666/cart";
    axios.get(url)
        .then(res =>{
            cartData = res.data.data.carts;
            cartPrice = res.data.data.final_total;
            //console.log(cartData);
            //判斷購物車是否為空
            if (cartData.length == 0) {
                //console.log(cartData);
                let str= "";
                str += `<a href="shop.html">前往購物</a>`;
                cartBtn.innerHTML = str;
            } else {
                let str= "";
                str += `<a href="checkOrder.html">前往結帳</a>`;
                cartBtn.innerHTML = str;
            }
            renderCarts();
            renderFinalPrice();
            renderCartInfor();
    })
    .catch(function(err){
        console.log(err);
    })
}
//加入購物車 按鈕
productWrap.addEventListener("click", function(e) {
    e.preventDefault();
    let addCartClass = e.target.getAttribute('class');
    if(addCartClass !== 'add-btn'){
        console.log('沒點到');
        return;
    };
    let productId = e.target.getAttribute('data-id');
    //console.log(productId);
    let numCheck = 1;
    cartData.forEach(function(item){
        if(item.id === productId){
        numCheck = item.qty += 1;
    }
    })
    const url = "https://vue3-course-api.hexschool.io/api/bee666/cart";
    axios.post(url,{
        data: {
        "product_id": productId,
        "qty": numCheck
        }
    })
    .then(res =>{
        console.log(res.data);
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '成功加入購物車',
            showConfirmButton: false,
            timer: 1500
        });
        getCartList();

    })
    .catch(err =>{
        console.log(err);
    })
});

//渲染購物車
function renderCarts(){
    if (cartData.length == 0) {
        let str= "";
        str += `<div class="cart-empty fw-bold my-4">
                    <h3 class="fs-5 text-danger">目前購物車為空</h3>
                </div>`;
        cartList.innerHTML = str;
    } else {
    let str = "";
    cartData.forEach((item) =>{
        str += `<li class="cart-item border-bottom border-third pb-2">
                    <div class="cart-item-title ms-2 ps-2">
                        <img src="${item.product.imageUrl}" alt="cart-photo">
                        <h3 class="pt-1">${item.product.title}</h3>
                    </div>
                    <div class="cart-item ps-4">
                        <div class="qtyWrap d-inline-block d-flex">
                            <button type="button" item-Id=${item.id} data-num=${item.qty}
                                    class="cart-minusBtn">
                                -
                            </button>
                            <span type="number" id="number"
                                    class="px-2 d-flex justify-content-center align-items-center border border-third">
                                    ${item.qty}
                            </span>
                            <button type="button" item-Id=${item.id} data-num=${item.qty}
                                    class="cart-addBtn">
                                +
                            </button>
                        </div>
                    </div>
                    <div class="cart-item ps-4">
                        <h3>${item.total}</h3>
                    </div>
                    <div class="cart-icon">
                        <a href="#" class="cart-delete bg-danger rounded-circle">
                            <img src="./assets/images/delete.png" alt="delete" data-id=${item.id}>
                        </a>
                    </div>
                </li>
                `;
    });
    cartList.innerHTML = str;
    //判斷購物車是否為空
    if (cartData.length == 0) {
        console.log(cartData);
        let str= "";
        str += `<a href="shop.html">前往購物</a>`;
        cartBtn.innerHTML = str;
    } else {
        let str= "";
        str += `<a href="checkOrder.html">前往結帳</a>`;
        cartBtn.innerHTML = str;
    }
    //console.log(cartData.length);
    }
    $('.cart-addBtn').on('click', function() {
        adjustQty();
    })
    $('.cart-minusBtn').on('click', function() {
        adjustQty();
    })
    function adjustQty () {
        cartList.addEventListener("click", function(e) {
            let itemNum = e.target.getAttribute('data-num');
            let patchId = e.target.getAttribute('item-Id');
            let btnClass = e.target.getAttribute('class');
            if (btnClass == 'cart-addBtn') {
                itemNum++;
                console.log(itemNum);
                console.log(patchId);
                const url = `https://vue3-course-api.hexschool.io/api/bee666/cart/${patchId}`
                axios.put(url,
                    {data: {product_id: patchId,qty: itemNum}}
                )
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data);
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '成功調整購物車數量',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            getCartList();
                        },1600);
                    } else {
                        console.log(res);
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })
            } 
            else if (btnClass == 'cart-minusBtn') {
                itemNum--;
                if( itemNum < 1) {
                    Swal.fire({
                        icon: 'error',
                        title: '已達購物車最低數量',
                    });
                    let minusBtn = document.querySelector(".cart-minusBtn");
                    minusBtn.disabled = true;
                    return;
                }
                const url = `https://vue3-course-api.hexschool.io/api/bee666/cart/${patchId}`
                axios.put(url,
                    {data: {product_id: patchId,qty: itemNum}}
                )
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data);
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '成功調整商品數量',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            getCartList();
                        },1600);
                    } else {
                        console.log(res);
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                })
            }
        })
    }
}
cartList.addEventListener("click", function(e) {
    e.preventDefault();
    const cartID = e.target.getAttribute('data-id');
    console.log(cartID);
    deleteCart(cartID);
})
//刪除單個購物車
function deleteCart(cartID) {
    const url = `https://vue3-course-api.hexschool.io/api/bee666/cart/${cartID}`
    axios.delete(url)
        .then(res => {
            if(res.data.success) {
                getCartList();
            } else {
                console.log(res.data.message);
            }
        })
        .catch(err => {
            console.log(err.message);
        })
}
//刪除全部購物車
deleteAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = `https://vue3-course-api.hexschool.io/api/bee666/carts`
    axios.delete(url)
        .then(res => {
            if(res.data.success) {
                console.log(res.data);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '成功清除全部購物車',
                    showConfirmButton: false,
                    timer: 1500
                });
                getCartList();
            } else {
                console.log(res.data.message);
            }
        })
        .catch(err => {
            console.log(err.message);
        })
});
//渲染訂單資訊
function renderCartInfor(){
    let str = "";
    cartData.forEach(item =>{
        str += `<div class="order-list border-bottom border-third">
                    <li class="order-image ps-lg-3 ps-md-0 ps-0">
                        <img src="${item.product.imageUrl}" alt="cart-photo">
                    </li>
                    <li class="order-title">
                        <h3>${item.product.title}</h3>
                    </li>
                    <li class="order-qty"><h3>${item.qty}</h3></li>
                    <li class="order-price"><h3>${item.total}</h3></li>
                </div>`
    });
    orderInfor.innerHTML = str;
}
//渲染訂單最後價格
function renderFinalPrice(){
    let item = cartPrice;
    let str = "";
    str += `<span class="cart-totalprice">NT$ ${item}</span>`;
    cartFinal.innerHTML = str;
    let word = "";
    word += `<span class="cart-totalprice">NT$ ${item}</span>`;
    cartTotal.innerHTML = word;
}

//建立訂單
function createOrder() {
    const form = {user:{},message:""};
    form.user.name = formName.value.trim();
    form.user.email = formEmail.value.trim();
    form.user.tel = formTel.value.trim();
    form.user.address = formAddress.value.trim();
    form.user.payWay = formPayway.value;
    form.message = formMessage.value;
    const url = "https://vue3-course-api.hexschool.io/api/bee666/order";
    const order = form;
    axios.post(url,  { data: order })
        .then((res) => {
            if (res.data.success) {
                console.log(res.data);
                orderID = res.data.orderId;
                sessionStorage.setItem('ID',`${res.data.orderId}`);
                self.location.href=`payOrder.html`;
                getCartList();
                //getOrderList();
            } else {
                console.log(res.data);
            }
        })
        .catch(err => {
            console.log(err)
        })
};
//取得單筆創建的訂單
function getOrderList() {
    const url = `https://vue3-course-api.hexschool.io/api/bee666/order/${orderID}`;
    axios.get(url)
        .then(res => {
            if (res.data.success) {
                products = [];
                order = res.data.order;
                orderData = res.data.order;
                orderPrice = res.data.order.total;
                //console.log(res.data.order.products);
                //console.log(orderData.message);
                Object.entries(order.products).forEach(item => {
                    products.push(item)
                });
                //console.log(products);
                renderOrders();
                renderOrderCheck();
                renderOrderPrice();
                renderOrderPaid();
            }
            else {
                console.log('error');
                console.log(res.data.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

//渲染訂單資訊
function renderOrders() {
    let str = "";
    let item = orderData;
    let timestamp = parseInt(`${item.create_at}`*1000);
    let date = new Date(timestamp);
    let newDate = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/${date.getHours()}:${date.getMinutes()}`;
    //console.log(newDate);
    //console.log(date.toString() + "<br />");
    if (orderData.message == undefined) {
        str += `
        <tr class="order-infor-item d-flex justify-content-between">
            <th>訂單編號:</th>
            <td>${item.id}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>訂單日期:</th>
            <td>${newDate}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人姓名:</th>
            <td>${item.user.name}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人信箱:</th>
            <td>${item.user.email}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人電話:</th>
            <td>${item.user.tel}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人地址:</th>
            <td>${item.user.address}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>運送方式:</th>
            <td>${item.user.payWay}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>備註:</th>
            <td class="text-gary">無填寫</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>總金額:</th>
            <td class="fw-bold">${item.total}</td>
        </tr>`;
    } else {
        str += `
        <tr class="order-infor-item d-flex justify-content-between">
            <th>訂單編號:</th>
            <td>${item.id}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>訂單日期:</th>
            <td>${newDate}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人姓名:</th>
            <td>${item.user.name}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人信箱:</th>
            <td>${item.user.email}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人電話:</th>
            <td>${item.user.tel}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>收件人地址:</th>
            <td>${item.user.address}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>運送方式:</th>
            <td>${item.user.payWay}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>備註:</th>
            <td>${item.message}</td>
        </tr>
        <tr class="order-infor-item d-flex justify-content-between">
            <th>總金額:</th>
            <td class="fw-bold">${item.total}</td>
        </tr>`
    }

    orderTable.innerHTML = str;
};

//渲染訂單付款狀態
function renderOrderPaid(){
    let str = "";
    //console.log(orderData.is_paid);
    if(orderData.is_paid == true) {
        str +=  `<tr class="order-infor-item d-flex justify-content-between pb-4">
                    <th>付款狀態:</th>
                    <td class="text-success d-flex align-items-center">
                        <p class="pe-2">付款成功</p>
                        <img src="./assets/images/check-circle.png" alt="icon" class="bg-success rounded-circle">
                    </td>
                </tr>`
    } else {
        str +=` <tr class="order-infor-item d-flex justify-content-between pb-4">
                    <th>付款狀態:</th>
                    <td class="text-danger d-flex align-items-center">
                        <p class="pe-2">尚未付款</p>
                        <img src="./assets/images/close-circle-outline.png" alt="icon" class="bg-danger rounded-circle">
                    </td>
                </tr>`
    }
    orderPaid.innerHTML = str;
}
//渲染訂單頁最後價格
function renderOrderPrice(){
    let str = "";
    let item = orderPrice;
    str += `<span class="cart-totalprice">NT$ ${item}</span>`;
    orderFinal.innerHTML = str;
}
//渲染訂單資訊
function renderOrderCheck() {
    let str = "";
    products.forEach(item => {
        str += `<ul class="d-flex justify-content-around align-items-center border-bottom border-third">
                    <li class="order-image w-25 ps-3">
                        <img src="${item[1].product.imageUrl}" alt="order-photo">
                    </li>
                    <li class="w-25 text-center">${item[1].product.title}</li>
                    <li class="w-25 text-center ps-2">${item[1].qty}</li>
                    <li class="w-25 text-center ps-2">${item[1].total}</li>
                </ul>`;
    })
    orderCheck.innerHTML = str;
};
//付款
function payOrder() {
    const url = `https://vue3-course-api.hexschool.io/api/bee666/pay/${orderID}`;
    axios.post(url)
    .then(res => {
        console.log(res);
        getOrderList();
    })
    .catch(err => {
        console.log(err)
    })
};
//付款 按鈕
spentWrap.addEventListener("click", (e) => {
    e.preventDefault();
    let payClass = e.target.getAttribute('class');
    if(payClass !== "payBtn") {
        console.log("沒點到");
        return;
    } else {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '付款成功',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => {
            self.location.href=`checkoutOrder.html`;
        },1500);
        payOrder();
        console.log("付款成功");
    }
});
//表單驗證 
const input = document.querySelectorAll('input[name]');
const constraints = {
    "姓名": {
    presence: {
        message: "欄位 必填!"
    }
    },
    "電話": {
    presence: {
        message: "欄位 必填!"
    },
    length: {
        onlyInteger: true,
        minimum: 8,
        greaterThanOrEqualTo: 8,
        lessThanOrEqualTo: 10,
        message: "必須符合10字數"
    }
    },
    "Email": {
    presence: {
        message: "欄位 必填!"
    },
        email: {
        message: "錯誤格式"
    }
    },
    "寄送地址": {
    presence: {
        message: "欄位 必填!"
    }
    },
    "付款方式": {
    presence: {
        message: "欄位 必填!"
    }
    },
    }
    input.forEach(function(item){
        item.addEventListener('change',function(){
            item.nextElementSibling.textContent='';
            const errors = validate(orderInfoForm,constraints);
            if(errors){
                Object.keys(errors).forEach(function(keys){
                    document.querySelector(`[data-message=${keys}]kjashjhafkj`).textContent = errors[keys];
                });
            }
        })
    })
//表單送出
const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click',function(e){
    e.preventDefault();
        if(cartData.length == 0){
        alert('請加入購物車');
        return;
        }
        const errors = validate(orderInfoForm,constraints);
        if(errors){
        Object.keys(errors).forEach(function(keys){
        document.querySelector(`[data-message=${keys}]`).textContent = errors[keys];
        });
    }else{
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '訂單成立',
            showConfirmButton: false,
            timer: 1500
        });
        createOrder();
    }
})
// 整體分頁功能
function renderPage(nowPage){
    let dataPerPage = 8;
    let totalPages = Math.ceil(productData.length/dataPerPage);
    let minData = dataPerPage*nowPage - dataPerPage + 1;  
    let maxData = dataPerPage*nowPage;
    //console.log('minData', minData, 'maxData', maxData);
    // 頁數資訊
    let pageInfo = {
        totalPages,                     // 總頁數
        nowPage,                        // 當前頁數
        isFirst: nowPage == 1,          // 是否為第一頁
        isLast: nowPage == totalPages,  // 是否為最後一頁
    }
    // 取出當前頁數的資料
    let currentData = [];
        productData.forEach((item, index) => {
        if(index+1 >= minData && index+1 <= maxData){
            currentData.push(item);
            //console.log(currentData);
        }
    })
//商品渲染
function renderData(productData) {
    let str ="";
    productData.forEach(item =>{
    str += `<li class="shop-product-item mb-4">
                <a href="product.html" class="shop-product-img">
                    <img src="${item.imageUrl}" alt="photo" data-xd="${item.id}">
                </a>
                <div class="shop-product-text">
                    <h3>${item.title}</h3>
                </div>
                <div class="shop-product-price d-flex justify-content-around px-3 pt-1 pb-3">
                    <h3>NT$${item.price}</h3>
                    <a href="#" class="add-btn" id="addCardBtn" data-id="${item.id}">
                        <img src="./assets/images/cart.png" alt="cart">加入購物車
                    </a>
                </div>
            </li>`;
    })
    productWrap.innerHTML = str;
}
renderData(currentData);
renderPageBtn(pageInfo);
}
productSideList.addEventListener("click", (e) => {
    let catelogValue = e.target.getAttribute('value');
    if ( catelogValue == "全部商品") {
        renderPage(1);
        // 點選按鈕切換頁面
        page.addEventListener('click', function(e){
            e.preventDefault;
            console.log('click',e.target.nodeName);
            if(e.target.nodeName != 'A'){
            return;
            }
            let clickPage = e.target.dataset.page;
            console.log(clickPage);
            renderPage(clickPage);
        })
        return;
    } else {
        let selectNum = document.querySelectorAll(".shop-product-item");
        renderSelect(1);
        page.addEventListener('click', function(e){
            e.preventDefault;
            console.log('clickJOJO',e.target.nodeName);
            if(e.target.nodeName != 'A'){
            return;
            }
            let clickPage = e.target.dataset.page;
            console.log(clickPage);
            renderSelect(clickPage);
        })
        function renderSelect(nowPage){
            let dataPerPage = 8;
            let totalPages = Math.ceil(selectNum.length/dataPerPage);
            let minData = dataPerPage*nowPage - dataPerPage + 1;  
            let maxData = dataPerPage*nowPage;
            //console.log('minData', minData, 'maxData', maxData);
            // 頁數資訊
            let pageInfo = {
                totalPages,                     // 總頁數
                nowPage,                        // 當前頁數
                isFirst: nowPage == 1,          // 是否為第一頁
                isLast: nowPage == totalPages,  // 是否為最後一頁
            }
            // 取出當前頁數的資料
            let currentData = [];
                productData.forEach((item, index) => {
                if(index+1 >= minData && index+1 <= maxData){
                    currentData.push(item);
                    ///console.log(currentData);
                }
            })
        //商品渲染
        function renderSeclectData() {
            let str = '';
            productData.forEach(function(item){
                if(catelogValue == item.category){
                    console.log(catelogValue);
                    str += `<li class="shop-product-item mb-4">
                                <a href="product.html" class="shop-product-img">
                                    <img src="${item.imageUrl}" alt="photo" data-xd="${item.id}">
                                </a>
                            <div class="shop-product-text">
                                <h3>${item.title}</h3>
                            </div>
                            <div class="shop-product-price d-flex justify-content-around px-3 pt-1 pb-3">
                                <h3>NT$${item.price}</h3>
                                <a href="#" class="add-btn" id="addCardBtn" data-id="${item.id}">
                                    <img src="./assets/images/cart.png" alt="cart">加入購物車
                                </a>
                            </div>
                            </li>`;
                }
                productWrap.innerHTML = str;
            })
        }
        renderSeclectData(currentData);
        renderPageBtn(pageInfo);
        }
    }
});

// 渲染分頁按鈕
function renderPageBtn(pageInfo){
    let str = "";
    let totalPages = pageInfo.totalPages;
    //console.log(totalPages);
    if(pageInfo.isFirst){
        str += `
        <li class="page-item disabled">
            <a class="page-link" href="#">
                ◀
            </a>
        </li>
        `;
    }else{
        str += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" data-page="${Number(pageInfo.nowPage) - 1}">
                ◀
            </a>
        </li>
        `;
    }
    // 第 2 ~
    for(let i=1; i<=totalPages; i++){
        if(Number(pageInfo.nowPage) == i){
        str += `
            <li class="page-item active" aria-current="page">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
        }else{
        str += `
            <li class="page-item" aria-current="page">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
        }
    }

    // 是不是最後一頁
    if(pageInfo.isLast){
        str += `
        <li class="page-item disabled">
            <a class="page-link" href="#">
                ▶
            </a>
        </li>
        `;
    }else{
        str += `
        <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfo.nowPage) + 1}">
                ▶   
            </a>
        </li>
        `;
    }
    page.innerHTML = str;
}
page.addEventListener('click', function(e){
    e.preventDefault;
    console.log('click',e.target.nodeName);
    if(e.target.nodeName != 'A'){
    return;
    }
    let clickPage = e.target.dataset.page;
    console.log(clickPage);
    renderPage(clickPage);
})







