
var date = end - start;
var time = endhh - starthh;

if(date == 0){
    if((time > 0 && time <= 200)) {
      $('#Origin_Guard_Desc').disableValidation();
    }else{
         $('#Origin_Guard_Desc').enableValidation();
        alert('توضیحات را وارد نمایید');  
    }
}else if(date == 1){
  if (time+2400 > 40 && time+2400 <= 200 ) {
       $('#Origin_Guard_Desc').disableValidation();
    }else{
       $('#Origin_Guard_Desc').enableValidation();
       alert('توضیحات را وارد نمایید'); 
    }
}else if(date==70 || date==71){
  if (time+2400 > 40 && time+2400 <= 200 ) {
       $('#Origin_Guard_Desc').disableValidation();
    }else{
       $('#Origin_Guard_Desc').enableValidation();
       alert('توضیحات را وارد نمایید'); 
    }     
}else{
       alert('توضیحات را وارد نمایید'); 
       $('#Origin_Guard_Desc').enableValidation();
  }