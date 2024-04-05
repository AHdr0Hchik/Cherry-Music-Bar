const cartWrapper =  document.querySelector('.cart-wrapper');

document.addEventListener('DOMContentLoaded', () => {
    const cartProductsList = document.querySelector('.cart-wrapper');
    const dir = document.body.id;;

    // Клик по области окна
    window.addEventListener('click', function (event) {
        // Выбор размера пиццы
        if(event.target.dataset.action === 'pizza') {
            const size = event.target;
            const card = event.target.closest('.card');
            const sizeWrapper = event.target.closest('.size-wrapper');
            const itemsControl = sizeWrapper.querySelectorAll('.items__control');

            for(let i = 0; i<itemsControl.length; i++) {
                itemsControl[i].classList.remove('active');
            }
            event.target.classList.add('active');
            card.querySelector('.price__currency').innerText = `${size.getAttribute('data-sb-curent-price')} ₽`
        }


        // Объявляем переменную для счетчика
        let counter;

        // Проверяем клик строго по кнопкам Плюс либо Минус
        if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
            // Находим обертку счетчика
            const counterWrapper = event.target.closest('.counter-wrapper');
            // Находим див с числом счетчика
            counter = counterWrapper.querySelector('[data-counter]');
        }

        // Проверяем является ли элемент по которому был совершен клик кнопкой Плюс
        if (event.target.dataset.action === 'plus') {
            counter.innerText = ++counter.innerText;
        }

        // Проверяем является ли элемент по которому был совершен клик кнопкой Минус
        if (event.target.dataset.action === 'minus') {

            // Проверяем чтобы счетчик был больше 1
            if (parseInt(counter.innerText) > 1) {
                // Изменяем текст в счетчике уменьшая его на 1
                counter.innerText = --counter.innerText;
            } else if (event.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1) {
                // Проверка на товар который находится в корзине
                // Удаляем товар из корзины
                event.target.closest('.cart-item').remove();

                // Отображение статуса корзины Пустая / Полная
                toggleCartStatus();

                // Пересчет общей стоимости товаров в корзине
                calcCartPriceAndDelivery();

            }

        }
        // Обновляем local storage
        updateStorage();
        // Проверяем клик на + или - внутри коризины
        if (event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')) {
            // Пересчет общей стоимости товаров в корзине
            calcCartPriceAndDelivery();
        }

        // Проверяем что клик был совершен по кнопке "Добавить в корзину"
        if (event.target.hasAttribute('data-cart')) {
            // Находим карточку с товаром, внутри котрой был совершен клик
            const card = event.target.closest('.card');
            // Собираем данные с этого товара и записываем их в единый объект productInfo
            let productInfo = {

                id: card.dataset.id,
                imgUrl: card.querySelector('.product-img').getAttribute('src'),
                name: card.querySelector('.item-title').innerText,
                subcategory: card.querySelector('.item-title').id,
                price: card.querySelector('.price__currency').innerText,
                counter: card.querySelector('[data-counter]').innerText,
            };
            if(productInfo.subcategory == 11) {
                productInfo.size = card.querySelector('.active').innerText;
            }


            // Проверять если ли уже такой товар в корзине
            const itemInCart = document.querySelector('.cart-wrapper').querySelector(`[data-size="${productInfo.size}"][data-id="${productInfo.id}"]`);


            // Если товар есть в корзине
            if (itemInCart) {
                const counterElement = itemInCart.querySelector('[data-counter]');
                counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
                updateStorage();
            }
            else {
                // Если товара нет в корзине
                // Собранные данные подставим в шаблон для товара в корзине
                let cartItemHTML;
                if(!productInfo.size) {
                    cartItemHTML =    `<div class="cart-item" data-size="${productInfo.size}" data-id="${productInfo.id}">
                                                <div class="cart-item__top">
                                                    <div class="cart-item__img">
                                                        <img src="${productInfo.imgUrl}" alt="${productInfo.title}">
                                                    </div>
                                                    <div class="cart-item__desc">
                                                        <div class="cart-item__title">${productInfo.name}</div>

                                                        <!-- cart-item__details -->
                                                        <div class="cart-item__details">

                                                            <div class="items items--small counter-wrapper">
                                                                <div class="items__control" data-action="minus">-</div>
                                                                <div class="items__current" data-counter="">${productInfo.counter}</div>
                                                                <div class="items__control" data-action="plus">+</div>
                                                            </div>

                                                            <div class="price">
                                                                <div class="price__currency">${productInfo.price}</div>
                                                            </div>

                                                        </div>
                                                        <!-- // cart-item__details -->

                                                    </div>
                                                </div>
                                            </div>`;
                } else {
                    cartItemHTML =    `<div class="cart-item" data-size="${productInfo.size}" data-id="${productInfo.id}">
                                                <div class="cart-item__top">
                                                    <div class="cart-item__img">
                                                        <img src="${productInfo.imgUrl}" alt="${productInfo.title}">
                                                    </div>
                                                    <div class="cart-item__desc">
                                                        <div class="cart-item__title">${productInfo.name}</div>
                                                        <div class="cart-item__details">${productInfo.size} <span>см</span></div>

                                                        <!-- cart-item__details -->
                                                        <div class="cart-item__details">

                                                            <div class="items items--small counter-wrapper">
                                                                <div class="items__control" data-action="minus">-</div>
                                                                <div class="items__current" data-counter="">${productInfo.counter}</div>
                                                                <div class="items__control" data-action="plus">+</div>
                                                            </div>

                                                            <div class="price">
                                                                <div class="price__currency">${productInfo.price}</div>
                                                            </div>

                                                        </div>
                                                        <!-- // cart-item__details -->

                                                    </div>
                                                </div>
                                            </div>`;
                }
                // Отобразим товар в корзине
                cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
                updateStorage();
            }

            // Сбрасываем счетчик добавленного товара на "1"
            card.querySelector('[data-counter]').innerText = '1';

            // Отображение статуса корзины Пустая / Полная
            toggleCartStatus();

            // Пересчет общей стоимости товаров в корзине
            calcCartPriceAndDelivery();

        }

        // Нажатие на кнопку "Заказать"
        if(event.target.hasAttribute('data-toProcess')) {
            const form = document.querySelector('.form-group');
            const items = cartWrapper.querySelectorAll('.cart-item');
            const itemsData = [];
            // Сбор информации о заказе
            for(let i=0; i<items.length; i++) {
                const itemId = items[i].dataset.id;
                const size = parseInt(items[i].querySelector('.cart-item__details').innerText);
                const item = {
                    id: itemId,
                    name: items[i].querySelector('.cart-item__title').innerText,
                    price: parseInt(items[i].querySelector('.price__currency').innerText.split(' ')[0]),
                    count: parseInt(items[i].querySelector('[data-counter]').innerText),
                }
                if(size) {
                    item.size = size;
                }
                itemsData.push(item);
            }
            console.log(JSON.stringify(itemsData));

            // Отправка данных на сервер
            fetch("/order/toProcess", {
                method: "POST",
                body: JSON.stringify({
                    itemsData: itemsData,
                    address: form.querySelector('#delivery-city').value,
                    numberPhone: form.querySelector('[data-phone]').value
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            localStorage.removeItem('cart-list');
            window.location.replace("/");
        }


    });

    const initialState = () => {
        if (localStorage.getItem('cart-list') !== null) {
            cartProductsList.innerHTML = localStorage.getItem('cart-list');
            toggleCartStatus();
            calcCartPriceAndDelivery();


            document.querySelectorAll('.cart-content__product').forEach(el => {
                let id = el.dataset.id;
                console.log(id)
                document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = true;
            });
        }
    };

    initialState();

    const updateStorage = () => {
        let html = cartProductsList.innerHTML;
        html = html.trim();

        if (html.length) {
            localStorage.setItem('cart-list', html);
        }
        else {
            localStorage.removeItem('cart-list');
        }

    };
});

// Отображение в зависимости от способа доставки
const form = document.querySelector('.form-group');
let city = form.querySelector('#delivery-city');
offToProcess = () => {
    if(city.value===''){
        document.querySelector('[data-toProcess]').classList.add('none');
        //form.querySelector('[data-adress]').classList.add('none');
    } else if(city.value==='self') {
        //form.querySelector('[data-adress]').classList.add('none');
        document.querySelector('[data-toProcess]').classList.remove('none');
    } else {
        document.querySelector('[data-toProcess]').classList.remove('none');
        //form.querySelector('[data-adress]').classList.remove('none');
    }
}
offToProcess();
city.addEventListener('change',function(){
    offToProcess();
    calcCartPriceAndDelivery();
});

// Пересчёт общей стоимости заказа
function calcCartPriceAndDelivery() {
    const form = document.querySelector('.form-group');
    const city = form.querySelector('#delivery-city').value;
    const cartWrapper = document.querySelector('.cart-wrapper');
    const priceElements = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');

    switch (city) {
        case '':
            deliveryCost.innerText = 'Выберите тариф';
            break;
        case 'self':
            deliveryCost.innerText = '0 ₽';
            break;
        case 'Kir':
            deliveryCost.innerText = '200 ₽';
            break;
        case 'Zhd':
            deliveryCost.innerText = '400 ₽';
            break;
        case 'Sch':
            deliveryCost.innerText = '500 ₽';
            break;
        case 'Ena':
            deliveryCost.innerText = '500 ₽';
            break;
        default: deliveryCost.innerText = '0 ₽';
    }
    // Общая стоимость товаров
    let priceTotal = 0;

    // Обходим все блоки с ценами в корзине
    priceElements.forEach(function (item) {
        // Находим количество товара
        const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
        // Добавляем стоимость товара в общую стоимость (кол-во * цену)
        priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });
    if(city.length) {
        priceTotal += parseInt(deliveryCost.innerText);
    }
    // Отображаем цену на странице
    totalPriceEl.innerText = priceTotal;

    // Скрываем / Показываем блок со стоимостью доставки
    if (priceTotal > 0) {
        cartDelivery.classList.remove('none');
    } else {
        cartDelivery.classList.add('none');
    }


    // Указываем стоимость доставки
    /*if (priceTotal >= 600) {
        deliveryCost.classList.add('free');
        deliveryCost.innerText = 'бесплатно';
    } else {
        deliveryCost.classList.remove('free');*/
    /*}

     */
}
