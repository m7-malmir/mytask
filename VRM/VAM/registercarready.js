var $form;
var currentActorId;
var isGetForm = 0;
var ServiceLocationId;
var RequestType;
var WithRole;
var PersonnelNO;
var html_;
var is_printed = 0;
var CarId; 



$(function() {
    $form = (function() {
        var pk,
            inEditMode = false,
            primaryKeyName = "Id",
            bindingSourceName = "BS_InsertCar",
			updateFromData = FormManager.updateEntity,
            readFromData = FormManager.readEntity,
            insertFromData = FormManager.insertEntity;
        // دریافت CarId از dialogArguments
        if (typeof dialogArguments !== "undefined" && "CarId" in dialogArguments) {
            CarId = dialogArguments.CarId; // مقداردهی CarId از پارامترهای فرم دیگر
			inEditMode = true;
        }else{
			
			jQuery('#TextBoxControl2,#TextBoxControl1,#CarNo').on('input',function () {     
			  this.value = this.value.replace(/[^0-9\.]/g,'');
			});
			$('#TextBoxControl2,#CarNo').attr("placeholder", "99");
			$('#TextBoxControl1').attr("placeholder", "999");
		}
    	
        function init() {
            if (typeof dialogArguments !== "undefined") {
            }
            build();
            createControls();
            bindEvents();
        }

        function build() {
            $("body").css({ overflow: "hidden" }).attr({ scroll: "no" });
            $("#Form1").css({ top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px" });
        }

        function createControls() {
            Server.GetCurrentDate("dddd d MMMM yyyy", 'fa', true,
                function(data) {
                    $("#LabelControl12").text(data);
                },
                function(error) {
                    $ErrorHandling.Error(error, " خطا در تاریخ جاری سیستم");
                });

            if (!inEditMode) {
               // $("#PanelControl2").hide();

                UserService.GetCurrentActor(true,
                    function(data) {
                        hideLoading();
                        var xmlActor = $.xmlDOM(data);
                        currentActorId = xmlActor.find('actor').attr('pk');
                        var params = { Where: "Id = '" + CarId + "'" }; // استفاده از CarId
                        //alert(JSON.stringify(CarId));
                        BS_InsertCar.Read(params, function(data) {
                            var dataXml = null;
                            if ($.trim(data) != "") {
                                dataXml = $.xmlDOM(data);

                                // خواندن اطلاعات خودرو
                                CarName = dataXml.find("row:first").find(">col[name='CarName']").text();
                                ModelYear = dataXml.find("row:first").find(">col[name='ModelYear']").text();
                                Color = dataXml.find("row:first").find(">col[name='Color']").text();
                                SS = dataXml.find("row:first").find(">col[name='SS']").text();
                                CarNO = dataXml.find("row:first").find(">col[name='CarNO']").text();
                                Status = dataXml.find("row:first").find(">col[name='Status']").text();

                                if (ServiceLocationId == "2") {
                                    $("#ButtonControl13").show();
                                }
                                $("#CarName").val(CarName);
                                $("#CarModel").val(ModelYear);
                                $("#CarColor").val(Color);
                                $("#CarSS").val(SS);
                                $("#CarNo").val(CarNO);
                                $("#txtPosition").val(Status);
                                $("#CarSS").prop('disabled', false);
                            }
                        });
                    },
                    function(err) {
                        hideLoading();
                        $ErrorHandling.Error(err, "خطا در سرویس getCurrentActor");
                    }
                );
            } else {
                // کد مربوط به حالت ویرایش
                readData();
            }
        }

        function bindEvents() {
            $("#saveButton").click(function() { // فرض بر این است که دکمه ذخیره با id "saveButton" مشخص شده است
                saveData();
            });
        }

        function readData() {
            showLoading();
			//alert(JSON.stringify({ Where: primaryKeyName + " = " + CarId}));
            readFromData({ Where: primaryKeyName + " = " + CarId },
                function(dataXml) {
                    hideLoading();
                    $.setFormDataValues(bindingSourceName, dataXml);
                },
                function(err) {
                    hideLoading();
                    alert(err);
                }
            );
        }

        function getPK() {
            return pk;
        }

        function isInEditMode() {
            return inEditMode;
        }
        function saveData() {
            validateForm(
                function() {
                    if (inEditMode) {
						updateData();
                    } else {
                        insertData();
                    }
                },
                function() {
                    $.alert("لطفا موارد اجباری را پر کنید", "", "rtl",
                        function() { }
                    );
                }
            );
        }

        function insertData() {
            showLoading();
            var params = $.getFormDataValues(bindingSourceName);
            if (params.status == 'فعال') {
                params.Status = 1;
            } else {
                params.Status = 0;
            }
            insertFromData(params,
                function(dataXml) {
                    pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
                    closeWindow({ OK: true, Result: pk });
                },
                function(err) {
                    hideLoading();
                    alert(err);
                }
            );
        }
		function updateData(callback) {
		    showLoading();
			var params = {};
			params = $.extend(params, { Where: primaryKeyName + " = " + CarId });
			
			//todo
			
		}

        function deleteData(callback) {
            // کد مربوط به حذف داده‌ها
        }

        function validateForm(onSuccess, onError) {
            try {
                $("[role]").validateData(true);
                if ($.isFunction(onSuccess)) {
                    onSuccess();
                }
            } catch (e) {
                if ($.isFunction(onError)) {
                    onError();
                }
            }
        }

        return {
            init: init,
            getPK: getPK,
            isInEditMode: isInEditMode,
            saveData: saveData,
            deleteData: deleteData
        };
    }());
    $form.init();
});