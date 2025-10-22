$item.find(".download-link").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation(); // جلوگیری از رسیدن رویداد به المنت والد
    if (!file.FileContent) {
        console.warn("هیچ محتوای فایل وجود ندارد");
        return;
    }
    downloadBase64(file.FileContent, file.FileSubject, file.FileType);
});

#gbxDocuments{
	overflow: auto;
	}