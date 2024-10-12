
/*function iso7064Mod97_10(iban) {
  var remainder = iban,
      block;

  while (remainder.length > 2){
    block = remainder.slice(0, 9);
    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
  }

  return parseInt(remainder, 10) % 97;
}

function validateIranianSheba(str) {
  var pattern = /IR[0-9]{24}/;
  
  if (str.length !== 26) {
    return false;
  }

  if (!pattern.test(str)) {
    return false;
  }

  var newStr = str.substr(4);
  var d1 = str.charCodeAt(0) - 65 + 10;
  var d2 = str.charCodeAt(1) - 65 + 10;
  newStr += d1.toString() + d2.toString() + str.substr(2, 2);
  
  var remainder = iso7064Mod97_10(newStr);
  if (remainder !== 1) {
    return false;
  }

  return true;
};


$("#button0000000001").click(function () {

  
  var text1 = "لطفا شماره شبا را بدون فاصله مطابق الگو وارد نمایید\n";
  var text2 = "تعداد کاراکتر مجاز : 24\n";
  var text3 = "الگو: IR9999999999999999999999";
  
  
 var rse =  validateIranianSheba($("#Shaba_Number").getValue());
    
  if (rse == true){
    alert('شماره شبا بدرستی وارد شده است');

  }else{
    
    alert(text1+text2+text3);
  
  }
});
*/
//#region conrtol Shaba_Number

const Shaba_Number = document.getElementById("Shaba_Number");

 $('#Shaba_Number').on('paste', function(eve) { 
  setTimeout(function() {
    const that = validateIranianSheba(eve.target.value);

    if (that) {
      $("#Shaba_Number").getControl().css("background-color", "#BEF0CB");
     // $("#Shaba_Number .pmdynaform-field-control").append('<span class="glyphicon glyphicon-ok"></span>');
    } else {
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
      // $("#Shaba_Number .pmdynaform-field-control").append('<span class="glyphicon glyphicon-remove"></span>');
      alert('شماره شبا معتبر نمی باشد');
    }
  }, 2);
  
 });

$("#Shaba_Number").on({
  keypress:function (event) {
    var x = event.target.value;
    var key = event.which || event.keyCode;
      if (!(key >= 48 && key <= 57)) {
        event.preventDefault();
      }
      if (x.length >= 26) {
        event.preventDefault();
      }
  }

});

Shaba_Number.addEventListener("keydown", function (event) {
  var x = event.target.value;

  if (event.key === "Backspace" || event.key === "Delete") {
    if (x.length <= 2) {
      event.preventDefault();
    }
  }
});
////////////////////////////////

 $('#Cost_Grid').hideColumn(3);

 $("#deputy_per").hide();

//////////////////////////////////////

function getNumber(_val) {
  return Number(_val.replace(/[\,]+/g, ""));
}

function sepratorNumber(_val) {
  return _val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function removePoint(_val) {
  return _val.toString().replace(/\./g, '');
}

////////////////////بررسی شخص پست//////////////////


$("#button0000000001").click(function () {
  var text1 = "لطفا شماره شبا را بدون فاصله مطابق الگو وارد نمایید\n";
  var text2 = "تعداد کاراکتر مجاز : 24\n";
  var text3 = "الگو: IR9999999999999999999999";

  var rse = validateIranianSheba($("#Shaba_Number").getValue());

  if (rse == true) {
    alert("شماره شبا بدرستی وارد شده است");
  } else {
    alert(text1 + text2 + text3);
  }
  
});
 ///////////////////////////////
  
//Enter
var io = "";
var is_val_person = "";

var num = document.getElementById("Shaba_Number");
num.addEventListener("input", function (eve) {
  var y = eve.target.value;

  if (y.length >= 7) {
    var x = y.slice(5, 7);

    if (x == "12") {
      $("#Banks_List").setValue(29); /// ملت
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "17") {
      $("#Banks_List").setValue(30); /// ملی
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "60") {
      $("#Banks_List").setValue(23); /// مهر ایران
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "19") {
      $("#Banks_List").setValue(20); /// صادرات
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "15") {
      $("#Banks_List").setValue(16); /// سپه
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "18") {
      $("#Banks_List").setValue(8); /// تجارت
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "16") {
      $("#Banks_List").setValue(26); /// کشاورزی
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "14") {
      $("#Banks_List").setValue(28); /// مسکن
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "21") {
      $("#Banks_List").setValue(32); /// پست بانک
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "20") {
      $("#Banks_List").setValue(10); /// توسعه صادرات
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "57") {
      $("#Banks_List").setValue(7); /// پاسارگاد
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "54") {
      $("#Banks_List").setValue(6); /// پارسیان
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "55") {
      $("#Banks_List").setValue(1); /// اقتصاد نوین
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "13") {
      $("#Banks_List").setValue(14); /// رفاه
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "61") {
      $("#Banks_List").setValue(19); /// شهر
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "51") {
      $("#Banks_List").setValue(9); /// توسعه تعاون
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "62") {
      $("#Banks_List").setValue(5); /// آینده
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "58") {
      $("#Banks_List").setValue(17); /// سرمایه
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "56") {
      $("#Banks_List").setValue(15); /// سامان
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "59") {
      $("#Banks_List").setValue(18); /// سینا
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "11") {
      $("#Banks_List").setValue(21); /// صنعت و معدن
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "53") {
      $("#Banks_List").setValue(25); /// کارآفرین
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "78") {
      $("#Banks_List").setValue(12); /// خاورمیانه
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "70") {
      $("#Banks_List").setValue(22); /// رسالت
      // $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else {
      $("#Banks_List").setValue("");
      $("#Banks_List").getControl().css("background-color", "#FFF");
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
    }
  } else {
    $("#Banks_List").setValue("");
    $("#Banks_List").getControl().css("background-color", "#FFF");
    $("#Shaba_Number").getControl().css("background-color", "#FFF");
  }

  const inputField = document.getElementById("Shaba_Number");
  inputField.addEventListener("input", function (event) {
    var x = event.target.value;
    var rse = validateIranianSheba(x);
    if (rse) {
      $("#Shaba_Number").getControl().css("background-color", "#BEF0CB");
      is_val_person = true;
      $("#774505615655deb9204e8c6069325942 #submit0000000001")
        .find("button")
        .prop("disabled", false);
    } else {
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
      is_val_person = false;
      $("#774505615655deb9204e8c6069325942 #submit0000000001")
        .find("button")
        .prop("disabled", true);
    }
    //  console.log(is_val_person);
  });
});


 /*
///////////تائید کننده////////////////
  var x = 1;
  var y = 1;
  var z = 1;
 
  if ($("#Reviewer_Per").getValue() == $("#Reviewer_Per").getText()) {

    $("#Reviewer_Per").css("color", "red");
    x = 0;

  } else {

    $("#Reviewer_Per").css("color", " #555151");
    x = 1;
  }
  //////مدیر واحد - تصویب کننده/////////////

  if ($("#Unit_Manager_Per").getValue() == $("#Unit_Manager_Per").getText()) {

    $("#Unit_Manager_Per").css("color", "red");
    y = 0;

  } else {

    $("#Unit_Manager_Per").css("color", " #555151");

    y = 1;
  }
//////////درخواست کننده/////////////
  
  
  if ($("#Applicant").getValue() == $("#Applicant").getText()) {

    $("#Applicant").css("color", "red");
   z = 0;

  } else {

    $("#Applicant").css("color", " #555151");

    z = 1;
  }



  if (x == 0 || y == 0 ||z == 0) {
    alert('لطفا نام شخص را به درستی انتخاب نمایید ');
    return false;
  }


////////////////////


///////////////جمع ستونی//////

$("#774505615655deb9204e8c6069325942").click(function() { 
 

  
  var rowCount = $("#Cost_Grid").getNumberRows();
  var total1 = 0;
  var currency1= 0;
 
  var total2 = 0;
  var currency2= 0;
 
  for (var i = 1;i <= rowCount;i++) {
    
    currency1 = getNumber($("#Cost_Grid").getValue(i, '2'));
    currency2 = getNumber($("#Cost_Grid").getValue(i, '3'));
                           
    total1 += currency1;
    total2 += currency2;
   }

  var sum_currency1 =sepratorNumber(total1);
  var sum_currency2 =sepratorNumber(total2);
  
  $('#Requested_Total').setValue(sum_currency1);
  $('#Confirmed_Total').setValue(sum_currency2);

  });

  $("#Cost_Grid").click(function() {
  

    
    var rowCount = $("#Cost_Grid").getNumberRows();
    var total1 = 0;
    var currency1= 0;
   
    var total2 = 0;
    var currency2= 0;
   
    for (var i = 1;i <= rowCount;i++) {
      
      currency1 = getNumber($("#Cost_Grid").getValue(i, '2'));
      currency2 = getNumber($("#Cost_Grid").getValue(i, '3'));
                             
      total1 += currency1;
      total2 += currency2;
     }
  
    var sum_currency1 =sepratorNumber(total1);
    var sum_currency2 =sepratorNumber(total2);
    
    $('#Requested_Total').setValue(sum_currency1);
    $('#Confirmed_Total').setValue(sum_currency2);
    
   
  
    });

///////////////////////////



$("#submit0000000001").click(function() { 

  var rowCount = $("#Cost_Grid").getNumberRows();
  var total1 = 0;
  var currency1= 0;
 
  var total2 = 0;
  var currency2= 0;
 
  for (var i = 1;i <= rowCount;i++) {
    
    currency1 = getNumber($("#Cost_Grid").getValue(i, '2'));
    currency2 = getNumber($("#Cost_Grid").getValue(i, '3'));
                           
    total1 += currency1;
    total2 += currency2;
   }

  var sum_currency1 =sepratorNumber(total1);
  var sum_currency2 =sepratorNumber(total2);
  
  $('#Requested_Total').setValue(sum_currency1);
  $('#Confirmed_Total').setValue(sum_currency2);

  });
*/

  ///////////////////////////////////////
////////////////////////////
