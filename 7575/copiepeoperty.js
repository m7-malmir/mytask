
$("#Save_Record1").on("click",function(){
    var GoodsUnit=$("#GoodsUnit").find("select[id='form[GoodsUnit]']").val();
    var First_Goods=$("#First_Goods").find("input[id='form[First_Goods_label]']").val(); 
    var Goods_Desc=$("#Goods_Description").find("input[id='form[Goods_Description]']").val();
    var GoodsNumber=$("#GoodsNumber_currency").find("input[id='form[GoodsNumber_currency]']").val();
    var GoodsDate=$("#GoodsDateRequired").find("input[id='form[GoodsDateRequired]']").val();
    var CurrentBalance=$("#GoodsCurrentBalance_currency").find("input[id='form[GoodsCurrentBalance_currency]']").val();
    var GoodsConsumption=$("#GoodsConsumption_currency").find("input[id='form[GoodsConsumption_currency]']").val();
    var arr = [];
    	arr.push({
            'نام کالا:': First_Goods, 
            'توضیحات کالا:':  Goods_Desc,
            'تعداد:': GoodsNumber, 
            'واحد سنجش:': GoodsUnit, 
            'تاریخ مورد نیاز:':  GoodsDate,
            'موجودی فعلی': CurrentBalance, 
            'میزان مصرف یکماه گذشته':  GoodsConsumption
        });

var myJsonString = JSON.stringify(arr).replace(/[\[\]\{\}]+/g, '');
});
var rowCount = $("#Req_Grid").getNumberRows();

for (var i = 1; i <= rowCount; i++) {

    if($("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val().length === 0 ){
$("#Req_Grid-body textarea[id='form[Req_Grid]["+i+"][Technical_Specifications]']").val(myJsonString);
    }
        
    }
    $("#Req_Grid").addRow();
    $("#GoodsNumber_currency").setValue("");
    $("#GoodsUnit").setValue("");
    $("#GoodsDateRequired").setValue("");

    $("#GoodsCurrentBalance_currency").setValue("");
    $("#GoodsConsumption_currency").setValue("");
});
