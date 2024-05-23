const cartWrapper =  document.querySelector('.cart-wrapper');

document.addEventListener('DOMContentLoaded', () => {

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


                // Пересчет общей стоимости товаров в корзине
                calcCartPriceAndDelivery();

            }

        }
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
                name: card.querySelector('.item-title').innerText,
                subcategory: card.querySelector('.item-title').id,
                price: card.querySelector('.price__currency').innerText,
                counter: card.querySelector('[data-counter]').innerText,
            };
            if(card.querySelector('.active')) {
                productInfo.size = card.querySelector('.active').innerText;
            }


            // Проверять если ли уже такой товар в корзине
            const itemInCart = document.querySelector('.cart-wrapper').querySelector(`[data-size="${productInfo.size}"][data-id="${productInfo.id}"]`);


            // Если товар есть в корзине
            if (itemInCart) {
                const counterElement = itemInCart.querySelector('[data-counter]');
                counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
            }
            else {
                // Если товара нет в корзине
                // Собранные данные подставим в шаблон для товара в корзине
                let cartItemHTML;
                cartItemHTML =  `<tr class="cart-item" data-size="${productInfo.size}" data-id="${productInfo.id}">
                                    <td class="cart-item__title" id="${productInfo.size}"><span id="name">${productInfo.name}</span> <span id="size">${productInfo.size || ''}</span></td>
                                    <td>
                                        <div class="items items--small counter-wrapper">
                                            <div class="items__control" data-action="minus">-</div>
                                            <div class="items__current" data-counter="">${productInfo.counter}</div>
                                            <div class="items__control" data-action="plus">+</div>
                                        </div>
                                    </td>
                                    <td class="price"><span class="price__currency">${productInfo.price}</span></td>
                                </tr>`;
                // Отобразим товар в корзине
                cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
            }

            // Сбрасываем счетчик добавленного товара на "1"
            card.querySelector('[data-counter]').innerText = '1';

            // Пересчет общей стоимости товаров в корзине
            calcCartPriceAndDelivery();

        }

        // Нажатие на кнопку "Заказать"
        if(event.target.hasAttribute('data-toprocess')) {
            const items = cartWrapper.querySelectorAll('.cart-item');
            const guests_count = document.querySelector('#guests').value;
            const orderDetails = document.querySelector('.pos').id;
            let itemsData = [];
            let old_itemsData = [];
            // Сбор информации о заказе
            for(let i=0; i<items.length; i++) {
                const itemId = items[i].dataset.id;
                const size = parseInt(items[i].querySelector('.cart-item__title').id);
                const item = {
                    id: itemId,
                    name: items[i].querySelector('.cart-item__title').querySelector('#name').innerText,
                    price: parseInt(items[i].querySelector('.price__currency').innerText.split(' ')[0]),
                    count: parseInt(items[i].querySelector('[data-counter]').innerText),
                }
                if(size) {
                    item.size = size;
                }
                itemsData.push(item);
            }
            const old_items = cartWrapper.querySelectorAll('.old_cart_item');
            
            for(let i=0;i<old_items; i++) {
                const itemId = old_items[i].dataset.id;
                const size = parseInt(old_items[i].querySelector('.cart-item__title').id);
                const old_item = {
                    id: itemId,
                    name: old_items[i].querySelector('.cart-item__title').querySelector('#name').innerText,
                    price: parseInt(old_items[i].querySelector('.price__currency').innerText),
                    count: parseInt(old_items[i].querySelector('[data-counter]').value),
                }
                if(size) {
                    old_item.size = size;
                }
                old_itemsData.push(old_item);
            }

            // Отправка данных на сервер
            fetch("/admin/to_proccess_crm", {
                method: "POST",
                body: JSON.stringify({
                    itemsData: itemsData,
                    old_itemsData: old_itemsData,
                    orderDetails: orderDetails,
                    guests_count: guests_count
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(() => window.location.href='/admin/tables');
            
        }

        if(event.target.hasAttribute('data-toprocess_remove')) {
            const items = cartWrapper.querySelectorAll('.cart-item');
            const orderDetails = document.querySelector('.pos').id;
            let itemsData = [];
            let old_itemsData = [];
            // Сбор информации о заказе
            for(let i=0; i<items.length; i++) {
                const itemId = items[i].dataset.id;
                const size = parseInt(items[i].querySelector('.cart-item__title').id);
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
            const old_items = cartWrapper.querySelectorAll('.old_cart_item');
            
            for(let i=0;i<old_items; i++) {
                const itemId = old_items[i].dataset.id;
                const size = parseInt(old_items[i].querySelector('.cart-item__title').id);
                const old_item = {
                    id: itemId,
                    name: old_items[i].querySelector('.cart-item__title').querySelector('#name').innerText,
                    price: parseInt(old_items[i].querySelector('.price__currency').innerText),
                    count: parseInt(old_items[i].querySelector('[data-counter]').value),
                }
                if(size) {
                    old_item.size = size;
                }
                old_itemsData.push(old_item);
            }

            // Отправка данных на сервер
            fetch("/admin/post_remove_from_table", {
                method: "POST",
                body: JSON.stringify({
                    itemsData: itemsData,
                    old_itemsData: old_itemsData,
                    orderDetails: orderDetails,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            setTimeout(() => {
                window.location.href='/admin/tables';
            }, 50);
            
            
        }


    });
});

// Пересчёт общей стоимости заказа
function calcCartPriceAndDelivery() {
    const cartWrapper = document.querySelector('.cart-wrapper');
    const priceElements = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    
    // Общая стоимость товаров
    let priceTotal = 0;

    // Обходим все блоки с ценами в корзине
    priceElements.forEach(function (item) {
        // Находим количество товара
        const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
        // Добавляем стоимость товара в общую стоимость (кол-во * цену)
        priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });
    // Отображаем цену на странице
    totalPriceEl.innerText = priceTotal;
}
