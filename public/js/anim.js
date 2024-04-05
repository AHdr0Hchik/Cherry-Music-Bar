document.addEventListener('click', function (event) {
    if(event.target.hasAttribute('data-anim')) {
        const groupCard = event.target.closest('.col-md-6');
        const frontSide = groupCard.querySelector('.front');
        const backSide = groupCard.querySelector('.back');

        if(frontSide.clientHeight > 50) {
            backSide.style.height = frontSide.clientHeight + 'px';
        }


        if(backSide.classList.contains('none')) {
            setTimeout(() => {
                frontSide.style.transform = 'rotateY(180deg)';
                setTimeout(() => {
                    frontSide.classList.add('none');
                    frontSide.style.transform = 'rotateY(0deg)';
                    backSide.classList.remove('none');
                }, 100);

            }, 100);
        } else {
            setTimeout(() => {
                backSide.style.transform  = 'rotateY(180deg)';
                setTimeout(() => {
                    backSide.classList.add('none');
                    backSide.style.transform  = 'rotateY(0deg)';
                    frontSide.classList.remove('none');
                }, 100);
            }, 100);

        }

    }
});