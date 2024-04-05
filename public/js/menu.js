function menuToggle() {
    const menu = document.getElementById("grid");
    const buttons = document.getElementById("buttons");
    if(menu.style.display == "flex") {
        menu.style.cssText = 'display: none';
        buttons.style.cssText = 'backdrop-filter: 3px';
    }
    else {
        menu.style.cssText = 'display: flex';
        buttons.style.cssText = 'background-color: black';
    }
}