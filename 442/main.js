$('.btn-uploadfile').text('انتخاب کنید');

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




function iso7064Mod97_10(iban) {
  var remainder = iban,
    block;

  while (remainder.length > 2) {
    block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
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
}

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
/*
     $("#25723266666b720a9825034042976581 .pmdynaform-field").find("span").click(function() {
  alert();
});                                                                                         
*/

//#region check person shaba number

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
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "17") {
      $("#Banks_List").setValue(30); /// ملی
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "19") {
      $("#Banks_List").setValue(20); /// صادرات
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "15") {
      $("#Banks_List").setValue(16); /// سپه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "18") {
      $("#Banks_List").setValue(8); /// تجارت
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "16") {
      $("#Banks_List").setValue(26); /// کشاورزی
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "14") {
      $("#Banks_List").setValue(28); /// مسکن
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "21") {
      $("#Banks_List").setValue(32); /// پست بانک
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "20") {
      $("#Banks_List").setValue(10); /// توسعه صادرات
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "57") {
      $("#Banks_List").setValue(7); /// پاسارگاد
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "54") {
      $("#Banks_List").setValue(6); /// پارسیان
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "55") {
      $("#Banks_List").setValue(1); /// اقتصاد نوین
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "13") {
      $("#Banks_List").setValue(14); /// رفاه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "61") {
      $("#Banks_List").setValue(19); /// شهر
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "51") {
      $("#Banks_List").setValue(9); /// توسعه تعاون
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "62") {
      $("#Banks_List").setValue(5); /// آینده
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "58") {
      $("#Banks_List").setValue(17); /// سرمایه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "56") {
      $("#Banks_List").setValue(15); /// سامان
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "59") {
      $("#Banks_List").setValue(18); /// سینا
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "11") {
      $("#Banks_List").setValue(21); /// صنعت و معدن
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "53") {
      $("#Banks_List").setValue(25); /// کارآفرین
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "78") {
      $("#Banks_List").setValue(12); /// خاورمیانه
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
    } else if (x == "70") {
      $("#Banks_List").setValue(22); /// رسالت
      $("#Banks_List").getControl().css("background-color", "#BEF0CB");
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
      $("#446075439665c5bd51c88b8071255988 #submit0000000002").find("button").prop("disabled", false);
       
    } else {
      
      $("#Shaba_Number").getControl().css("background-color", "#FFF");
      is_val_person = false;
      $("#446075439665c5bd51c88b8071255988 #submit0000000002").find("button").prop("disabled", true);
      
    }
  });
});

//#endregion
