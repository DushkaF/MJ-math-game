$(window).on("load", function () {
  $("#firstLook").trigger("click");
});

$(document).ready(function () {
  console.log("Ready");

  $(".navClickable").click(function () {
    return loadNavDiv($(this));
  });

  $(document).on("click", "#signSubmit", function () {
    sendSignUp();
    return false;
  });

  $(document).on("click", "#logSubmit", function () {
    logIn();
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

function logIn() {
  var form = $("form");
  if (!checkInput()) {
    return;
  }
  let loginSimbCheck = checkSimbol($("#login"));
  let passwordSimbCheck = checkSimbol($("#password"), loginSimbCheck);
  if (!loginSimbCheck || !passwordSimbCheck) {
    return;
  }

  var formData = {};
  formData[$("#login").attr("name")] = String($("#login").val());
  formData[$("#password").attr("name")] = String($("#password").val());

  $.post("/logIn", formData, function (data) {
    var statusCode = data["code"];
    if (statusCode == 200) {
      $(".alert").addClass("d-none");
      let viewAlert = "#success";
      loadContentDiv($(viewAlert).attr("href"), "#navContent", false);

      let delay = setTimeout(function () {
        loadNextPage();
      }, 5000);
      $(document).on("click", "#nextButton", function () {
        clearTimeout(delay);
        loadNextPage();
        return false;
      });
      function loadNextPage() {
        loadContentDiv($("#nextPage").attr("href"), "#navContent", true);
      }
    } else if (statusCode == 402) {
      $(".alert").removeClass("d-none");
      $(".alert").text("Нет пользователя с такими данными");
    }
  });
}

function sendSignUp() {
  var form = $("form");
  if (!checkInput()) {
    return;
  }
  let loginSimbCheck = checkSimbol($("#login"));
  let passwordSimbCheck = checkSimbol($("#password"), loginSimbCheck);
  if (!loginSimbCheck || !passwordSimbCheck) {
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
    viewAlert = "#".concat(status);
    console.log(viewAlert);
    loadContentDiv($(viewAlert).attr("href"), "#navContent", false);

    let delay = setTimeout(function () {
      loadNextPage();
    }, 5000);
    $(document).on("click", "#nextButton", function () {
      clearTimeout(delay);
      loadNextPage();
      return false;
    });

    function loadNextPage() {
      loadContentDiv($("#nextPage").attr("href"), "#navContent", true);
    }
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

// проверка на допустимые символы
function checkSimbol(obj, err = true) {
  let myRe = new RegExp("[^a-zA-Z0-9]+");
  let text = obj.val();
  if (!myRe.test(text)) {
    if (err) {
      $(".alert").addClass("d-none");
    }
    obj.removeClass("is-invalid");
    return true;
  } else {
    obj.addClass("is-invalid");
    $(".alert").removeClass("d-none");
    $(".alert").text("Поле содержит недопустимые символы!");
    return false;
  }
}
