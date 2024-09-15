
$("#Result").hide();
$("#Sale_Org_Manager").hide();
$("#Sales_Line").hide();
$("#Branch_Name").hide();
$("#Branch_Manager").hide();
$("#Person_List").hide();
$("#Amount_currency").hide();
$("#Register_Count").hide();

$("#Result").setOnchange(function (newVal, oldVal) {
    var rowCount = $("#Person_List").getNumberRows();
 
    if (newVal == "1") {
      $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
      for (var i = 1; i <= rowCount; i++) {
	  $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
      }
        $("#Amount_currency").show();
        $("#Register_Count").show();
    } else if (newVal == "2") {
      $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
      for (var i = 1; i <= rowCount; i++) {
        $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val("");
    }
        $("#Amount_currency").show();
        $("#Register_Count").show();
    }
    else if (newVal == "3") {
     $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
     $("#Person_List-body input[id='form[Person_List][1][Incentive_Amount_currency]']").val("");
     $("#Person_List-body input[id='form[Person_List][1][Fine_Amount_currency]']").val("");
        $("#Amount_currency").hide();
        $("#Register_Count").hide();
    }
});



  $("#Register_Count").on("click",function(){
     var reward=  $("#Result").find("select[id='form[Result]']").val();
     var prz=$("#Amount_currency").find("input[id='form[Amount_currency]']").val(); 
     var rowCount = $("#Person_List").getNumberRows();
   for (var i = 1; i <= rowCount; i++) {
        if(reward==='1'){
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val(prz/2);
        }else if(reward==='2'){
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val(prz/2);
        }else{
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
        }
   }
    });


$("#Center").setOnchange(function (newVal, oldVal) {
    if (newVal == "1") {
        $("#Result").show();
        $("#Sale_Org_Manager").show();
        $("#Sale_Org").show();
        $("#Sale_Org_Manager").enableValidation();
        $("#Sale_Org").enableValidation();
        $("#Person_List").show();
        $("#Branch_Name").hide();
        $("#Branch_Manager").hide();
        $("#Branch_Name").disableValidation();
        $("#Branch_Manager").disableValidation();
    } else if (newVal == "2") {
        $("#Result").show();
        $("#Branch_Name").show();
        $("#Branch_Manager").show();
        $("#Branch_Name").enableValidation();
        $("#Branch_Manager").enableValidation();
        $("#Person_List").show();
        $("#Sale_Org_Manager").hide();
        $("#Sale_Org").hide();
        $("#Sale_Org").disableValidation();
        $("#Sale_Org_Manager").disableValidation();
    }
});

//#endregion

/////////////// getvalu/////////

if($('#Center').getValue() == 1)
  {
    
     
    $("#Result").hide();
    $("#Result").disableValidation();
    $("#Sale_Org_Manager").show();
    $("#Sale_Org_Manager").disableValidation();
    $("#Sale_Org").show();
    $("#Sale_Org").disableValidation();
    $("#Branch_Name").hide();
    $("#Branch_Name").disableValidation();
    $("#Branch_Manager").hide();
    $("#Branch_Manager").disableValidation();
    $("#Person_List").show();
    $("#Person_List").disableValidation();
  }

  else if($('#Center').getValue() == 2) {
    
    
    $("#Result").show();
    $("#Result").enableValidation();
    $("#Sale_Org_Manager").hide();
    $("#Sale_Org_Manager").disableValidation();
    $("#Sale_Org").hide();
    $("#Sale_Org").disableValidation();
    $("#Branch_Name").show();
    $("#Branch_Name").disableValidation();
    $("#Branch_Manager").show();
    $("#Branch_Manager").disableValidation();
    $("#Person_List").show();
    $("#Person_List").disableValidation();

  }
