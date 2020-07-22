/*window.onload = function() { // Событие страница загружена
    document.getElementById('D').onclick = function() { Hidden() };
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
}*/

$(document).ready(function () {
  console.log("Ready");

  $(".navClickable").click(function () {
    return loadNavDiv($(this));
  });
});

function loadNavDiv(doc) {
  var toLoad = doc.attr("href") + "#navContent";
  console.log(toLoad);
  $("#navContent").hide("fast", loadContent);
  function loadContent() {
    $.get(
      toLoad,
      function (data) {
        $("#navContent").replaceWith(data);
      },
      "",
      showNewContent()
    );
  }
  function showNewContent() {
    $("#navContent").show("normal");
  }
  return false;
}

$(window).on("load", function () {
  $("#firstLook").trigger("click");
});
