$(window).on("load", function () {
  console.log("Ready");
  timer();
});

function timer() {
  var _Seconds = (function () {
    let ms = $("#time").text().split(":");
    let sec = parseInt(ms[0]) * 60 + parseInt(ms[1]);
    return sec;
  })();
  var int;
  int = setInterval(function () {
    // запускаем интервал
    if (_Seconds > 0) {
      _Seconds--; // вычитаем 1
      $("#time").text(
        Math.floor(_Seconds / 60).toString() +
          ":" +
          Math.floor((_Seconds % 60) / 10).toString() +
          Math.floor((_Seconds % 60) % 10).toString()
      ); // выводим получившееся значение в блок
    } else {
      clearInterval(int); // очищаем интервал, чтобы он не продолжал работу при _Seconds = 0
      alert("End!");
      location.href = "/";
    }
  }, 100);
}

$(document).ready(function () {
  console.log("Ready");
  $(document).on("click", "#exit", function () {
    location.href = "/";
    return false;
  });
});
