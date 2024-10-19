//#region edition fot Technical_Specifications
    
        var rowCount25 = $("#Req_Grid").getNumberRows();
        for (var i = 1; i <= rowCount25; i++) { 

            $("#Req_Grid-body textarea[id='form[Req_Grid][" + i + "][checkbox0000000001]']").on("click", function () {
                alert();
            // var tech =$(this).val();
            // alert(tech);    
            }); 
            //$("#Req_Grid-body .pmdynaform-static ").find("div:last").parent().remove();       
        }

//#endregion edition fot Technical_Specifications
