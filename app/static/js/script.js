window.onload = function () { // Событие страница загружена
    document.getElementById('D').onclick = function () { Hidden() };
}

function Hidden() {
    document.getElementById('D').style.backgroundColor = '#696969';
    console.log("Click");
    sendRequest();
}

function sendRequest() {
    var request = new XMLHttpRequest();

    request.open('GET', '/request');
    request.send("Hello AJAX");
}