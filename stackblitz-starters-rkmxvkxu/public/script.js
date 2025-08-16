// script.js تشخیصی — قرار بده و صفحه رو رفرش کن
$(document).ready(function() {
  console.log("DOM آماده شد");
  $("#run").on("click", function() {
    console.log("دکمه فشار داده شد");

    // لاگ محلی
    $("#result").text("در حال ارسال درخواست... (چک کن network و console)");

    // درخواست تست به مسیر /ping (اگر سرور نداری این هم 404 خواهد بود ولی در Network ثبت می‌شود)
    axios.post("/ping", { test: "ping" })
      .then(function(resp) {
        console.log("پاسخ /ping:", resp);
        $("#result").text("پاسخ: " + JSON.stringify(resp.data));
      })
      .catch(function(err) {
        console.error("خطا در فراخوانی /ping:", err);
        $("#result").text("خطا در /ping — کنسول و network را چک کن. " + (err && err.message));
      });
  });
});
