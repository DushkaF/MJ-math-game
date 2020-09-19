$(window).on("load", function () {
  showContentByURL();
});

$(document).ready(function () {
  console.log("Ready");
  checkCookies();

  $(document).on("click", "#toWaitRoom", function () {
    console.log("go to wait");
    goToWaitRoom();
    return false;
  });
  setInterval(function () {
    checkWaitRoom();
  }, 5000);

  $(document).on("click", ".navClickable", function () {
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

  $(document).on("click", "#exit", function () {
    profileExit();
    return false;
  });

  $(document).on("click", ".to-user", function () {
    setLocation("/user/" + $.cookie("login"));
    showContentByURL();
    return false;
  });

  $(document).on("click", ".to-main", function () {
    setLocation("/");
    return false;
  });

  $(window).bind("hashchange", function () {
    console.log("change");
  });

  window.onhashchange = function () {
    var what_to_do = document.location.href;
    console.log(what_to_do);
  };
});

function checkWaitRoom() {
  $.get("/waitRoomCount", function (data) {
    let img = $("#MJ-label");
    if (
      data["count"] > 0 &&
      (window.lastStateRoom <= 0 || window.lastStateRoom == undefined)
    ) {
      img.attr("src", img.attr("src-is-any"));
    } else if (data["count"] <= 0 && window.lastStateRoom > 0) {
      img.attr("src", img.attr("src-is-empty"));
    }
    window.lastStateRoom = data["count"];
  });
}

function goToWaitRoom() {
  $.get("/isToken", function (data) {
    if (data["code"] == 200) {
      location.href = "/waitRoom";
    }
  });
}

function loadNavDiv(doc) {
  loadContentDiv(doc.attr("href"), "#navContent", true, function () {
    $("#navContent").show("normal");
  });
  return false;
}

function loadContentDiv(href, id, hideFunc, endFunc) {
  var toLoad = href;
  if (hideFunc) {
    $(id).hide("fast", loadContent);
  } else {
    loadContent();
  }
  function loadContent() {
    $.ajax({
      url: toLoad,
      success: function (data) {
        $(id).replaceWith(data);
        endFunc();
      },
      async: false,
    });
  }
}

function profileExit() {
  $.get("/exit", function (data) {
    $("#icon").addClass("d-none");
    $("#authorisation").removeClass("d-none");
    $.removeCookie("login");
  });
}

function checkCookies() {
  let login = $.cookie("login");
  var checkedServerToken = false;
  $.ajax({
    url: "/isToken",
    success: function (data) {
      // не забываем узнать наличие ключа от сервера
      checkedServerToken = data["code"] == 200;
      console.log(checkedServerToken);
    },
    async: false,
  });
  console.log(checkedServerToken);
  if (login != null && checkedServerToken) {
    $("#icon").removeClass("d-none");
    $("#icon-initials").text(function () {
      return login[0].toUpperCase();
    });
    $("#icon-name").text(login);
    $("#authorisation").addClass("d-none");
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
  let login = String($("#login").val());
  formData[$("#login").attr("name")] = login;
  formData[$("#password").attr("name")] = String($("#password").val());

  $.post("/logIn", formData, function (data) {
    var statusCode = data["code"];
    if (statusCode == 200) {
      // cookie
      $.cookie("login", login, { expires: 1, path: "/" });
      checkCookies();

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
  if ($("#login").val().length <= 16) {
    $(".alert").addClass("d-none");
    $("#login").removeClass("is-invalid");
  } else {
    $("#login").addClass("is-invalid");
    $(".alert").removeClass("d-none");
    $(".alert").text("Логин слишком длинный!");
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

//изменение url
function setLocation(curLoc) {
  try {
    history.pushState(null, null, curLoc);
    return;
  } catch (e) {}
  location.hash = curLoc;
}

function showContentByURL() {
  var url = document.location.pathname.substring(1).split("/");
  console.log("url ", url);
  switch (url[0]) {
    case "user":
      showUserContent();
      break;
    case "":
      $("#firstLook").trigger("click");
    default:
      break;
  }
}

function showUserContent() {
  loadContentDiv($(".to-user").attr("href"), "#navContent", true, function () {
    showNewContent();
    loadUserInfo();
  });
  function showNewContent() {
    $("#navContent").show("normal");
  }
}

function loadUserInfo() {
  var url = document.location.pathname.substring(1).split("/");
  var sendData = { username: url[1] };
  $.post("/getUser", sendData, function (data) {
    var statusCode = data["code"];
    if (statusCode == 200) {
      $("#user-bio").replaceWith(data["bio"]);
      $("#rank").replaceWith(data["rank"]);
      $("#user-icon-initials").text(function () {
        return data["username"][0].toUpperCase();
      });
      $("#user-icon-name").text(data["username"]);
    }
  });
}
