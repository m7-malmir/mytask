var observer = new MutationObserver(function(mutations) {
	if ($("#ComboBoxControl2 option[value='" + res + "']").length > 0) {
		$("#ComboBoxControl2").val(res).trigger('change');
		observer.disconnect(); // دیگه نیاز نداریم، متوقفش کن
	}
});

observer.observe(document.getElementById("ComboBoxControl2"), {
	childList: true,
	subtree: true
});