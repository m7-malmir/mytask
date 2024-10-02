
$("#Save_Record1").on("click",function(){
    var GoodsUnit=$("#GoodsUnit").find("select[id='form[GoodsUnit]']").val();
    var First_Goods=$("#First_Goods").find("input[id='form[First_Goods_label]']").val(); 

    var arr = [];
    	arr.push({
            'نام کالا:': First_Goods, 
            'توضیحات کالا:':  Goods_Desc,

        });

var myJsonString = JSON.stringify(arr).replace(/[\[\]\{\}]+/g, '');

var rowCount = $("#Req_Grid").getNumberRows();

for (var i = 1; i <= rowCount; i++) {
    if($("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val().length === 0 ){
    $("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val(myJsonString);
    $("#Req_Grid").addRow();
    $("#GoodsNumber_currency").setValue("");
    $("#GoodsUnit").setValue("");
    $("#GoodsDateRequired").setValue("");
    $("#GoodsCurrentBalance_currency").setValue("");
    $("#GoodsConsumption_currency").setValue("");
    }  
  }
});
