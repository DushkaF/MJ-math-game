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

$(window).on("load", function () {
  $("#firstLook").trigger("click");
});

$(document).ready(function () {
  console.log("Ready");

  $(".navClickable").click(function () {
    return loadNavDiv($(this));
  });

  $(document).on("click", "#signSubmit", function () {
    console.log("pass");
    sendSignUp();
    return false;
  });
});

function loadNavDiv(doc) {
  loadContentDiv(doc.attr("href"), "#navContent", true, showNewContent());
  function showNewContent() {
    $("#navContent").show("normal");
  }
  return false;
}

function loadContentDiv(href, id, hideFunc, endFunc) {
  var toLoad = href + id;
  if (hideFunc) {
    $(id).hide("fast", loadContent);
  } else {
    loadContent();
  }
  function loadContent() {
    $.get(
      toLoad,
      function (data) {
        $(id).replaceWith(data);
      },
      "",
      endFunc
    );
  }
}

function sendSignUp() {
  var form = $("form");
  if (!checkInput()) {
    return;
  }
  if (!checkPass()) {
    return;
  }
  var formData = {};
  formData[$("#login").attr("name")] = String($("#login").val());
  formData[$("#password").attr("name")] = String($("#password").val());
  $.post("/signUp", formData, function (data) {
    var statusCode = data["code"];
    var status = "";
    if (statusCode == 200) {
      status = "success";
    } else if (statusCode == 405) {
      status = "fail";
    }
    alert(status);
    viewAlert = "#".concat(status);
    loadContentDiv($(viewAlert).attr("href"), "#navContent", false);
  });
}

// Функция проверки полей формы
function checkInput() {
  let err = false;
  $("form")
    .find(".form-control")
    .each(function () {
      if ($(this).val() != "") {
        // Если поле не пустое удаляем класс-указание
        $(this).removeClass("is-invalid");
      } else {
        // Если поле пустое добавляем класс-указание
        $(this).addClass("is-invalid");
        err = true;
      }
    });
  if (err) {
    $(".alert").removeClass("d-none");
    $(".alert").text("Заполните все поля!");
    return false;
  } else {
    $(".alert").addClass("d-none");
    return true;
  }
}

// проверка на совпадение
function checkPass() {
  password = $("#password");
  retPassword = $("#retPassword");
  if (password.val() === retPassword.val()) {
    $(".alert").addClass("d-none");
    retPassword.removeClass("is-invalid");
    return true;
  } else {
    retPassword.addClass("is-invalid");
    $(".alert").removeClass("d-none");
    $(".alert").text("Проверь пароль!");
    return false;
  }
}
