$(document).ready(function () {
  $("*").on("mouseenter", function () {
    let row_count = $("#Req_Info").getNumberRows();
  for (i = 0; i <= row_count; i++) {
      $("#Req_Info-body input[id='form[Req_Info]["+i+"][Personal_Code]']").attr("oninput","duplicates()");
	}
   });
 });

 function duplicates() {
  let myarray = [];
  let row_count = $("#Req_Info").getNumberRows();
  for (var i = 1; i < row_count+1; i++) {
         myarray[i] =$("#Req_Info-body input[id='form[Req_Info]["+i+"][Personal_Code]']").val(); 
  }
   for (var i = 0; i < myarray.length; i++) {
      let flag = false;
      for (var j = 0; j < myarray.length; j++) {
          if (i == j || myarray[i] == "" || myarray[j] == "")
              continue;
          if (myarray[i] == myarray[j]) {
            flag = true;
            
           $("#Req_Info-body input[id='form[Req_Info]["+i+"][Personal_Code]']").css("background-color", "#FF6969").css('color', '#fff');
           $('#2350769046631e7642f2052017561385').find(" #submit0000000001").css( "display", "none" );
      //   $("#Req_Info button").prop("disabled","true");
     	//   $("#Err_PNL").show();
    
    }
     
     
  }
     
     if (flag == false) {
       
    //   $("#Req_Info button").prop("disabled","false");
         $("#Req_Info-body input[id='form[Req_Info]["+i+"][Personal_Code]']").css("background-color", "#fff").css('color', '#000'); 
         $('#2350769046631e7642f2052017561385').find(" #submit0000000001").css( "display", "block" );
     //  $('#2350769046631e7642f2052017561385 #form[submit0000000001]').prop("disabled","false").css("background-color", "#FF6969");
	 //	 $("#Err_PNL").hide();
     }
  }
   
}