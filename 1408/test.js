$("#submit0000000001").click(function (event) { 
    var rowCount3 = $("#Req_Grid").getNumberRows(); 
       if(rowCount3 >= 1 ){
                var errors='';    
                for (var i = 1; i <= rowCount3-1; i++) {
                    if (
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Goods_Code]']").val().length === 0 ||
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Required_Items]']").val().length === 0  || 
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Unit]']").val().length=== 0 ||
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Date_Required]']").val().length=== 0 ||
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Confirmed_Number_currency]']").val().length=== 0 ||
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Current_Balance]']").val().length=== 0 ||
                        $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Consumption]']").val().length=== 0 
                        
                        ) {
                            errors=1;
                        }
            
                        }
                        if(errors==1){
                            alert("لطفا تعداد تایید شده را وارد نمایید");
                            event.preventDefault();
                        }
            
            }
                
        });





        $("#submit0000000001").click(function (event) { 
            var rowCount3 = $("#Req_Grid").getNumberRows(); 
               if(rowCount3 >= 1 ){
                        var errors='';    
                        for (var i = 1; i <= rowCount3-1; i++) {
                            if (
                                $("#Req_Grid-body input[id='form[Req_Grid][" + i + "][Confirmed_Number_currency]']").val().length=== 0) { errors=1;}
                    
                                }
                                if(errors==1){
                                    alert("لطفا تعداد تایید شده را وارد نمایید");
                                    event.preventDefault();
                                }
                    
                    }
                        
                });