
$("#Result").hide();
$("#Sale_Org_Manager").hide();
$("#Sales_Line").hide();
$("#Branch_Name").hide();
$("#Branch_Manager").hide();
$("#Person_List").hide();
$("#Amount_currency").hide();


$("#Result").setOnchange(function (newVal, oldVal) {
    var rowCount = $("#Person_List").getNumberRows();
    if (newVal == "1") {
      $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
      for (var i = 1; i <= rowCount; i++) {
	  $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
      }
        $("#Amount_currency").show();
     
    } else if (newVal == "2") {
      $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
      for (var i = 1; i <= rowCount; i++) {
        $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val("");
    }
        $("#Amount_currency").show();

    }
    else if (newVal == "3") {
     $("#Amount_currency").find("input[id='form[Amount_currency]']").val("");
     $("#Person_List-body input[id='form[Person_List][1][Incentive_Amount_currency]']").val("");
     $("#Person_List-body input[id='form[Person_List][1][Fine_Amount_currency]']").val("");
        $("#Amount_currency").hide();

    }
});


$("#Center").setOnchange(function (newVal, oldVal) {
    if (newVal == "1") {

        $("#Result").show();
        $("#Sale_Org_Manager").show();
        $("#Sale_Org").show();
        $("#Branch_Name").hide();
        $("#Branch_Manager").hide();
        $("#Person_List").show();
    } else if (newVal == "2") {

        $("#Result").show();
        $("#Sale_Org_Manager").hide();
        $("#Sale_Org").hide();
        $("#Branch_Name").show();
        $("#Branch_Manager").show();
        $("#Person_List").show();
    }
});

//#endregion

  $("#Amount_currency").on("input",function(){
     var reward=  $("#Result").find("select[id='form[Result]']").val();
     var prz=$("#Amount_currency").find("input[id='form[Amount_currency]']").val()/2; 
     var rowCount = $("#Person_List").getNumberRows();
   for (var i = 1; i <= rowCount; i++) {
        if(reward==='1'){
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val(prz);
        }else if(reward==='2'){
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val(prz);
        }else{
            $("#Person_List-body input[id='form[Person_List]["+i+"][Incentive_Amount_currency_currency]']").val("");
            $("#Person_List-body input[id='form[Person_List]["+i+"][Fine_Amount_currency]']").val("");
        }
   }
    });
