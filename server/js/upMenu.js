$(window).scroll(function(){
    const $el = $('.upMenu');
    const $el3 = $('#header');
    let heightHeader = parseInt($el3.css( "height" ));
    let heightMenu = $el.css( "height" );

    let isPositionFixed = ($el.css('position') == 'fixed');
    if ($(this).scrollTop() > heightHeader && !isPositionFixed){
        $el.css({'position': 'fixed', 'top': '0px', 'backdropFilter': 'blur(3px)'});
    }
    if ($(this).scrollTop() < heightHeader && isPositionFixed){
        $el.css({'position': 'absolute', 'top': '0px', 'backdropFilter': 'none'});
    }
});