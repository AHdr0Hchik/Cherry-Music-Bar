function myFunction() {
    var menu = document.getElementById("grid");
    if(menu.style.display == "flex") {
        menu.style.cssText = 'display: none';
    }
    else {
        menu.style.cssText = 'display: flex';
    }
}