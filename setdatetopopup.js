document.getElementById('upload').addEventListener('click', function () {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = async function (e) {
        let file = e.target.files[0];
        if (!file) return;

        let formData = new FormData();
        formData.append('file', file);
        formData.append('FoodTitle', 'Pizza');
        formData.append('FoodStatus', 'Ready');
        formData.append('UserId', '12345');
        formData.append('Token', 'ABC-XYZ');

        // نمایش مقادیر قبل از ارسال
        console.group(' داده‌های ارسالی:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(key, `(File)`, value.name, `${value.size} bytes`);
            } else {
                console.log(key, value);
            }
        }
        console.groupEnd();

        try {
            let res = await fetch('https://tmpfiles.org/api/v1/upload', {
                method: 'POST',
                body: formData
            });
            let data = await res.json();
            console.log('پاسخ سرور:', data);
            if (data?.data?.url) {
                console.log(' لینک دانلود فایل:', data.data.url);
            }
        } catch (err) {
            console.error('خطا در آپلود:', err);
        }
    };
    input.click();
});
