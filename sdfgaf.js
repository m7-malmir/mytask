// ساخت یک input مخفی برای انتخاب فایل
var hiddenFileInput = document.createElement('input');
hiddenFileInput.type = 'file';
hiddenFileInput.style.display = 'none';
hiddenFileInput.accept = 'image/*';
document.body.appendChild(hiddenFileInput);

// رویداد انتخاب فایل
hiddenFileInput.addEventListener('change', function () {
    var file = hiddenFileInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
        var fileBase64 = e.target.result;


        var params = {
            'FoodTitle': document.getElementById("txtFoodTitle").value,
            'FoodStatus': document.getElementById("cmbFoodStatus").value,
            'FileBase64': fileBase64,
            'FileName': file.name,
            'FileType': file.type
        };

        console.log("پارامترها:", params);


        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(data => {
            console.log("پاسخ سرور:", data);
            alert("آپلود فایل و ارسال پارامترها موفقیت‌آمیز بود");
        })
        .catch(err => {
            console.error("خطا:", err);
            alert("خطا در ارسال: " + err.message);
        });
    };
    reader.readAsDataURL(file);
});


document.getElementById('upload').addEventListener('click', function () {
    hiddenFileInput.click();
});
