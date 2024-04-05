$(window).scroll(function(){
    const $el = $('.upMenu');
    const $el3 = $('#header');
    const $el4 = $('.empty');
    let heightHeader = parseInt($el3.css( "height" ));
    let heightMenu = $el.css( "height" );
    $el4.css({'height': heightMenu});
    let isPositionFixed = ($el.css('position') == 'fixed');
    if ($(this).scrollTop() > heightHeader && !isPositionFixed){
        $el.css({'position': 'fixed', 'top': '0', 'backdropFilter': 'blur(3px)'});
    }
    if ($(this).scrollTop() < heightHeader && isPositionFixed){
        $el.css({'position': 'relative', 'backdropFilter': 'none'});
    }
});

function showPopup() {
    var popup = document.getElementById("popup");
    if(!popup.firstChild.innerText) {
        return false;
    }
    popup.classList.remove("hide");
    setTimeout(function() {
        popup.classList.add("hide");
    }, 2000); // Измените значение на количество миллисекунд, через которое окно должно исчезнуть (здесь 2000 = 2 секунды)
}