$("#submit0000000001").click(function (event) {
  
    //$("#Tech_Specifications").disableValidation(3);
     
        var rowCount2 = $("#Req_Grid").getNumberRows();
        var emptycheck='';
        for (var i = 1; i <= rowCount2; i++) { 
            if (
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Goods_Code]']").val().length === 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Required_Items]']").val().length === 0  && 
    $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Technical_Specifications]']").val().length=== 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Number]']").val().length=== 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Unit]']").val().length=== 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Date_Required]']").val().length=== 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Current_Balance]']").val().length=== 0 &&
    $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Consumption]']").val().length=== 0 &&
    $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][Goods_Desc]']").val().length=== 0 
                
                ) {
                    emptycheck=true;
                    //$("#Req_Grid-body .pmdynaform-static ").find("div:last").parent().remove();
                }
        }
        var rowCount3 = $("#Req_Grid").getNumberRows(); 
        if(rowCount3 == 1 &&  emptycheck==true){
            alert("لطفا کالا را به لیست اضافه کنید");
              
            $("#submit0000000001").find("button").attr("disabled", true);
      
        }else{
                $("#submit0000000001").find("button").attr("disabled", false);
        }     
        });
    