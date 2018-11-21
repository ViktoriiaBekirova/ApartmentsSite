// вывод карточек товара
let app = {
    counter: 0,
    step: 12,
    items: [],
    appElement: document.querySelector('.main-content__container'),
    itemElement: document.querySelector('.card'),
    moreButton: document.querySelector('.show-more')
}

function getItems () {
    console.log('Получаем items')

    return $.ajax({
        url: 'app/data.json',
        complete: function (response) {
            app.items = response.responseJSON
        }
    })
}

function setItemsInContent () {
    console.log('Вставляем items на страницу')
    console.log('Все items:', app.items)

    // let range = [app.counter, app.counter + app.step]
    let range = [app.counter, app.counter + app.step]
    console.log('Диапазон:', range)

    for (let i = range[0]; i < range[1]; i++) {
        if (!app.items[i]) {
            hideButton()
            break
        }

        let el = $(app.itemElement).clone()
        let item = app.items[i]

        el.find('#img-card').attr("src",item.image_main)
        el.find('#img-star').attr("src",item.image_star);
        el.find('.card__header').text(item.card_header);
        el.find('.card__options_finish > p').text(item.card__options_finish);
        el.find('.card__options_area > p').text(item.card__options_area);
        el.find('.card__options_floor > p').text(item.card__options_floor);
        el.find('.card__price').text(item.card__price);
        el.find('.card__button').text(item.card__button);
        el.find('.card__button').addClass(item.card__button_class);
        el.find('.card__sale_price').text(item.card__sale_price);
        el.find('.card__sale_text').text(item.card__sale_text);

        $(".results").text('Найдено ' + app.items.length + ' квартир')
        el.removeAttr('hidden')

        el.appendTo(app.appElement)
        // изменяем шаг
        app.step = 20
        // удаление карточек sale если они пустые
        $(function() {
            $(".card__sale_text").each(function(ind, elem){
                if ($(elem).html().length === 0 ) {
                    $(elem).remove()
                }
            });
            $(".card__sale_price").each(function(ind, elem){
                if ($(elem).html().length === 0 ) {
                    $(elem).remove()
                }
            });
        });
    }
    app.counter += app.step

}

function hideButton () {
    $(app.moreButton).hide()
}

function addListeners () {

    app.moreButton.addEventListener('click', function (e) {
        e.preventDefault()
        setItemsInContent()
    })

}

function init () {
    console.log('JS инициализирован')

    getItems()
        .then(function () {
            setItemsInContent()
        })

    addListeners()
}

document.addEventListener("DOMContentLoaded", init);


//раскрытие/закрытие меню
$(function () {
    let header = $('.menu-header')
        closeButton = $('.menu-close')
        menuLink = $('.menu__link')
        $message = $('.menu');
    header.click(function (e) {
        if ($message.css('display') !== 'block') {
            closeButton.addClass('scale-close')
            $message.slideDown(500);

            let yourClick = true;
            $(document).bind('click.myEvent', function (e) {
                if (!yourClick && $(e.target).closest($message).length === 0) {
                    $message.slideUp(500);
                    setTimeout(function () {
                        closeButton.removeClass('scale-close')
                    }, 200)
                    $(document).unbind('click.myEvent');
                }
                yourClick = false;
            });
        }
        menuLink.click(function(){
            $(document).unbind('click.myEvent');
            $($message).slideUp(500);
            setTimeout(function () {
                closeButton.removeClass('scale-close')
            }, 200)
        });
        closeButton.click(function(){
            $(document).unbind('click.myEvent');
            $($message).slideUp(500)
            setTimeout(function () {
                closeButton.removeClass('scale-close')
            }, 200)
        });
        e.preventDefault();
    });
});

// сортировка переключение
$(function () {
    $('.sorting__content_price').on('click',function(){
        $(".sorting__content_choice").toggleClass('open')
    })
})

$(function () {
    $('.sorting__content_room').on('click',function(){
        $(".sorting__content_choice-close").toggleClass('close')
    })
})


// сортировка по цене убывание/возрастание
$(function sortPrice (){
    document.querySelector('.sorting__content_price').addEventListener("click", function () {
        let elements = document.querySelectorAll('.card');
        element = Array.prototype.slice.call(elements)
        const sorted = element.sort(function (a, b) {
            const priceElA = a.querySelector(".card__price");
            const priceElB = b.querySelector(".card__price");
            const getPrice = function(el) {
                return parseInt(el.innerHTML.replace(/ /g, ""))
            };
            if (document.querySelector('.sorting__content_choice').classList.contains('open')) {
                return getPrice(priceElB) - getPrice(priceElA);
            }
            else {
                return getPrice(priceElA) - getPrice(priceElB);
            }

        });
        const resultEl = document.querySelector(".main-content__container");
        resultEl.innerHTML = null;
        sorted.forEach(function (el) {
            return resultEl.appendChild(el)
        })
    });
})


// сортировка по площади комнат убывание/возрастание
$(function sortRoom () {
    document.querySelector('.sorting__content_room').addEventListener("click", function()  {
       let elements = document.querySelectorAll('.card');
        element = Array.prototype.slice.call(elements)
        const sorted = element.sort(function (a, b) {
            const roomElA = a.querySelector(".card__options_area p");
            const roomElB = b.querySelector(".card__options_area p");
            const getRoom = function(el) {
                return parseInt(el.innerHTML.replace(/ /g, ""))
            };
            if (document.querySelector('.sorting__content_choice-close').classList.contains('close')) {
                return getRoom(roomElB) - getRoom(roomElA);
            }
            else {
                return getRoom(roomElA) - getRoom(roomElB);
            }
        });
        const resultEl = document.querySelector(".main-content__container");
        resultEl.innerHTML = null;
        sorted.forEach(function (el) {
            return resultEl.appendChild(el)
        })
    });
})

// плавное поднятие страницы наверх
$(function () {
    $('.go-top').on('click', function () {
        $("html, body").animate({scrollTop: 0}, 600);
        return false;
    });
});

// скрытие, появление кнопки наверх
$(document).ready(function() {
    let $window = $(window).on('scroll', function() {
        let top = $window.scrollTop();

        if ( top > 400 ) {
            $(".go-top").addClass('active');
        }
        if ( top < 400 ) {
            $(".go-top").removeClass('active');
        }
    });
});

// валидация формы email
function validateEmail(email) {
    let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

function validate() {
    let valid = $("#valid")
        email = $("#feedback-email")
        emailVal = $("#feedback-email").val();

    valid.text("");
    if (validateEmail(emailVal)) {
        email.css({'border':'none'});
        valid.text("email введен верно").css("color","#ffffff");
        setTimeout(function () {
            email.val("")
            valid.text("")
        },2000)
    } else {
        valid.text("email введен не верно").css("color","#ff0000");
        email.css({'border':'1px solid #ff0000'});
        setTimeout(function () {
            valid.text("")
        },3000)

        email.keyup(function(){
            valid.empty();
            valid.text("");
            email.css({'border':'none'});
        });
    }
    if (emailVal === '') {
        valid.text("поле не должно быть пустым").css("color","#ff0000");
        email.css({'border':'1px solid #ff0000'});
        setTimeout(function () {
            valid.text("")
            email.css({'border':'none'});
        },3000)
    }
    return false;
}
$(".feedback-submit").bind("click", validate);

