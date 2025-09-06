var $form;
var randomFileId = 0;
var currentActorId;
var SC = 0;
var inEditMode2 = 0;
var firstRandomId;
var requirements_list = [];
var caterings_list = [];
var place_list = [];
var OfficeResponsibleId;
var amount = 0;
var HID = '';
var next_person_role_id = 30;
var next_person_type = 1;
var AccountNo = '';
var Bank = '';
var PersonnelNO_ = '';
var resDate;
var resDate2;
var maxDayForRequest;
$(function(){
    $form = (function()
    {
        var pk,
            inEditMode = false,
            primaryKeyName = "Id",
            bindingSourceName = "BS_MainData",
            insertFromData = FormManager.insertEntity;
			readFromData = FormManager.readEntity;
            readGtSettings = FormManager.readSetting;

        function init()
        {
            if(typeof dialogArguments !== "undefined")
            {
                if(primaryKeyName in dialogArguments)
                {
                    pk = dialogArguments[primaryKeyName];
                    inEditMode = true;
                    readData();
                }
                if("FormParams" in dialogArguments)
                {
                    pk = dialogArguments.FormParams;
                    inEditMode = true;
                    readData();
                }
            }
            build();
            createControls();
            bindEvents();
        }

        function build()
        {
            $("body").css({overflow: "hidden"}).attr({scroll: "no"});
            $("#Form1").css({top: "0", left: "0", width: $(document).width() + "px", height: $(document).height() + "px"});
        }
		let pendingCalls = 0;


        function createControls() {
			
            var params = {
                WHERE: `ProjectName LIKE '%AssistanceApplicationProcess%' AND [Parameter] LIKE '%maxDayForRequest%'`
            };

            readGtSettings(params,
                function(list)
                {
                    maxDayForRequest = list[0].Value

                    var dateStr = new Date();

                    // Get gregorian
                    const [m, d, y] = String(dateStr).toString().split('/').map(n => parseInt(n, 10));
                    // Get gregorian
                    const [jy, jm, jd] = convertGregorianToJalali(y, m, d).split('/').map(n => parseInt(n, 10));

                    var now = new Date();
                    aa = getShamsiDate(now);
                    resDate2 = aa;
                    //resDate2 = "2024-09-22 07:04:00"; //resDate[0] + '-' + resDate[1] + '-' + resDate[2] + " 23:59:00";
                    //if(0/*resDate2.length > 10*/){
                    // 0 close 1 open
                    if(jd <= maxDayForRequest){
                        UserService.GetCurrentActor(true,
                            function(data){
                                hideLoading();
                                var xmlActor = $.xmlDOM(data);
                                currentActorId = xmlActor.find('actor').attr('pk');
                                var params = {Where: "ActorId = " + currentActorId};
                                BS_GetUserInfo.Read(params
                                    , function(data)
                                    {
                                        var dataXml = null;
                                        if($.trim(data) != "")
                                        {
                                            dataXml = $.xmlDOM(data);
                                            UserId = dataXml.find("row:first").find(">col[name='UserId']").text();
                                            fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
                                            RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
                                            UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
                                            UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
                                            RoleId = dataXml.find("row:first").find(">col[name='RoleId']").text();
                                            PersonnelNO_ = UserName;

                                            $("#txtFullName").val(fullName);
                                            $("#txtPersonnel").val(UserName);
                                            $("#txtUnits").val(UnitsName);
                                            $("#TextBoxControl2").val(RoleName);

                                            var params2 = {Where: "Id = " + UserId};
                                            BS_Users.Read(params2
                                                , function(data2)
                                                {
                                                    var dataXml2 = null;
                                                    if($.trim(data2) != "")
                                                    {
                                                        dataXml2 = $.xmlDOM(data2);
                                                        Mobile = dataXml2.find("row:first").find(">col[name='Mobile']").text();
                                                        $("#TextBoxControl3").val(Mobile);
                                                    }
                                                }
                                            );
											
                                            var params4 = {PersonnelNo: PersonnelNO_};
                                            FormManager.RequestCount(params4,
                                                function(res, isManager)
                                                {
                                                    if(res == 1000){
														showLoading();
                                                        $.alert("شما در این ماه درخواست باز دارید.","","rtl",function(){
                                                            hideLoading();
                                                            closeWindow({OK:true, Result:null});
                                                        });
                                                    }else{
                                                        if(res > 3){
                                                            if(isManager == 1){
                                                                if(res == 4){
                                                                    next_person_type = 2;
                                                                }else{
                                                                    $.alert("به دلیل عبور از سقف مجاز درخواست، امکان ثبت درخواست برای شما وجود ندارد","","rtl",function(){
                                                                        hideLoading();
                                                                        closeWindow({OK:true, Result:null});
                                                                    });
                                                                }
                                                            }else if(res < 5){
                                                                next_person_type = 1;
                                                            }else{
                                                                if(res == 5){
                                                                    next_person_type = 2;
                                                                }else{
                                                                    $.alert("به دلیل عبور از سقف مجاز درخواست، امکان ثبت درخواست برای شما وجود ندارد","","rtl",function(){
                                                                        hideLoading();
                                                                        closeWindow({OK:true, Result:null});
                                                                    });
                                                                }
                                                            }
                                                        }else{
                                                            next_person_type = 1;
                                                        }
                                                    }
                                                }
                                            );
											
                                            var params3 = {'PersonnelNo': UserName};
                                            FormManager.findAccount(params3,
                                                function(res)
                                                {
                                                    if(res == "" || res.length <= 5){
                                                        $.alert("خطا در دریافت شماره حساب. لطفا با پشتیبان سامانه تماس بگیرید. کد 201","","rtl",function(){
                                                            hideLoading();
                                                            closeWindow({OK:true, Result:null});
                                                        });
                                                    }else{
                                                        $("#TextBoxControl1").val(res);
                                                        AccountNo = res.split(',')[0];
                                                        Bank = res.split(',')[1];
														hideLoading();
                                                    }
                                                },
                                                function(err)
                                                {
                                                    $.alert("خطا در دریافت شماره حساب. لطفا با پشتیبان سامانه تماس بگیرید. کد 202","","rtl",function(){
                                                        hideLoading();
                                                        closeWindow({OK:true, Result:null});
                                                    });
                                                }
                                            );
											
                                        }
										
                                        if($.isFunction(onSuccess))
                                        {
                                            onSuccess(dataXml);
                                        }
                                    }
								
                                );
                            },
                            function(err){
                                hideLoading();
                                $ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
                            }
                        );
                    }else if (resDate2.length > 10){
                        $.alert("بازه مجاز درخواست اول تا یازدهم هر ماه بجز فروردین و اسفند است.","","rtl",function(){
                            hideLoading();
                            closeWindow({OK:true, Result:null});
                        });
                    }else{
                        $.alert("مشکل در اجرای فرآیند. لطفا با پشتیبان سیستم تماس بگیرید.","","rtl",function(){
                            hideLoading();
                            closeWindow({OK:true, Result:null});
                        });
                    }
                },
                function(error)
                {
                    alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
                    return;
                }
              );
        }

        function getPK()
        {
            return pk;
        }

        function isInEditMode()
        {
            return inEditMode;
        }

        function saveData(callback)
        {
            validateForm(
                function()
                {
                    if(inEditMode)
                    {
                        //updateData(callback);
                    }
                    else
                    {
                        insertData(callback);
                    }
                },
                function()
                {
                    $.alert("لطفا موارد اجباری را تکمیل نمایید.", "", "rtl",
                        function()
                        {}
                    );
                }
            );
        }

        function insertData(callback)
        {
			//خواندن کل درخواستهای ثبت شده کاربر جاری و چک کردن درخواست مساعده ماه جاری
			var userName = $("#txtPersonnel").val();
			readFromData({ where: "PersonnelNO = '" + userName + "'" }, function(dataXml) {
			    var hasRecordInRange = false;
			
			    //تاریخ امروز جلالی با تابع 
			    var [nowJYear, nowJMonth, nowJDay] = miladi_be_shamsi(
			        new Date().getFullYear(),
			        new Date().getMonth() + 1,
			        new Date().getDate());
				
			   	 $(dataXml).find("row").each(function(index) {
			        var createdDateStr = $(this).find("col[name='CreatedDate']").text().trim();
			        if (!createdDateStr) return;
			        // جداکردن تاریخ از ساعت
			        var [mStr, dStr, yStr] = createdDateStr.split(' ')[0].split('/'); 
			        var gMonth = Number(mStr), gDay = Number(dStr), gYear = Number(yStr);
			
			        // تبدیل مستقیم میلادی به شمسی
			        var [jYear, jMonth, jDay] = miladi_be_shamsi(gYear, gMonth, gDay);
			        if (jYear === nowJYear && jMonth === nowJMonth && jDay >= 1 && jDay <= 11) {
			            hasRecordInRange = true;
			        }
			    	});
		
			    if (hasRecordInRange) {
		            $.alert("شما در این ماه درخواست باز دارید.","","rtl",function(){
		                closeWindow({OK:true, Result:null});
		            });
			        return false;
			    } else {
		        
				//------------------------------------------------------------------------------
				//------ اگر درماه جاری درخواستی برای کاربر جاری ثبت نشده بود، ثبت شود ---------
				//------------------------------------------------------------------------------
				    showLoading();
		            var params = $.getFormDataValues(bindingSourceName);
		            params.CreatorActor_ID = currentActorId;
		            params.PersonnelNO = $("#txtPersonnel").val();
		            params.SuggestedAmount = rcommafy($("#TextBoxControl4").val());
		            params.AccountNO = AccountNo;
		            params.ConfirmedAccountNO = AccountNo;
		            params.Bank = Bank;
		            params.ConfirmedBank = Bank;
		            insertFromData(params,
		                function(dataXml)
		                {
		                    pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
		                    randomFileId = pk;
		                    var result = "<data><" + primaryKeyName + ">" + pk + "</" + primaryKeyName + "></data>";
		                    inEditMode = true;
		                	   
							WorkflowService.RunWorkflow("ZJM.AAP.AssistanceApplicationProcess",
		                        '<Content><Id>'+pk+'</Id><nextPersonType>'+next_person_type+'</nextPersonType></Content>',
		                        true,
		                        function(data)
		                        {
		                            $.alert("درخواست شما با موفقیت ارسال شد.","","rtl",function(){
		                                hideLoading();
		                                closeWindow({OK:true, Result:null});
		                            });
		                        }
		                        ,function(err)
		                        {
		                            alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
		                            hideLoading();
		                        }
		                    );
		                    hideLoading();
		                    if($.isFunction(callback))
		                    {
		                        callback();
		                    }
		                },
		                function(err)
		                {
		                    hideLoading();
		                    alert(err);
		                }
		            );
				//------------------------------------------------------------------------------
			    }
			});
        }

        function updateData(callback)
        {
            //showLoading();
        }

        function deleteData(callback)
        {
            showLoading();
        }

        function validateForm(onSuccess, onError)
        {
            try
            {
                $("[role]").validateData(true);
                if($.isFunction(onSuccess))
                {
                    onSuccess();
                }
            }
            catch(e)
            {
                if($.isFunction(onError))
                {
                    onError();
                }
            }
        }

        return {
            init: init,
            getPK: getPK,
            isInEditMode: isInEditMode,
            saveData: saveData
        };
    }());
    $form.init();
});