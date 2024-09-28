

$("#button0000000001").on('click',function () {
 
    var link=$("input[id='form[E_Estekhdam_AD_Address]']").val();

    $("a[id='form[E_Estekhdam_Link]']").attr("href", link); 
  
  	alert('اطلاعات با موفقیت ذخیره شد، لطفا قبل از ارسال فرم لینک را چک نمایید.');
});


