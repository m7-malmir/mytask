var $form;
var currentActorId;
var ProcessStatus;
var PersonnelNO;

var DocumentId;
var CurrentUserActorId;
var InboxId;

var selectedId;

$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
		//******************************************************************************************************	
		function init()
		{
			//اگر از جریان فرآیند یا بصورت پاپ آپ از یک فرم دیگر باز شود
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
					DocumentId = dialogArguments["DocumentId"];
					CurrentUserActorId = dialogArguments["WorkItem"]["ActorId"];
					InboxId = dialogArguments["WorkItem"]["InboxId"];
					
					inEditMode = true;
					readData();
				}
			}
			
			$("#btnConfirm").css('display','none');
			$("#btnReject").css('display','none');
			$("#txtLabelDesc2").css('display','none');
			$("#txtDescConfirm").css('display','none');
			$("#searchTable").attr('placeholder', 'جستجو بر اساس پرسنلی');
		    $('#tblLoanList .CHbox').change(function() {
	            // اگر چک باکس فعلی تیک خورده باشد
	           if ($(this).is(':checked')) {
	                // تمام چک باکس‌های دیگر را تیک بردارید
	                $('#tblLoanList .CHbox').not(this).prop('checked', false);
	            }
			 });
			
			build();
			createControls();
			bindEvents();
			
		}
        //******************************************************************************************************
		function build()
		{
			//اگر بخواهیم استیل دهی خاصی داشته باشیم در این متد اعمال می شود
			$("body").css({overflow: "hidden"}).attr({scroll: "no"});
		}
		//****************************************************
		
		function createControls()
		{	
			if(!inEditMode){
				UserService.GetCurrentActor(true,
					function(data){
						hideLoading();
						var xmlActor = $.xmlDOM(data);
						currentActorId = xmlActor.find('actor').attr('pk');
						
						//----------------------------------------------------------------
						// دریافت اطلاعات و نمایش در صفحه
						//----------------------------------------------------------------
						var params = {Where: "ActorId = " + currentActorId};
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									ServiceLocation = dataXml.find("row:first").find(">col[name='mahalkhedmat']").text();
									UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
									UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
									employmentdate = dataXml.find("row:first").find(">col[name='employmentdate']").text();
									Codepersonel = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
									ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
									
									$("#txtFullName").val(fullName);
									$("#txtServiceLoc").val(ServiceLocation);
									$("#txtUnits").val(UnitsName);
									$("#txtPersonnel").val(Codepersonel);
									$("#txtPosition").val(RoleName);
									$("#txtHireDate").val(employmentdate);
									tblMain.refresh();
									
								}
							}, 
							function(error){
								alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
								return;
							}
						);
						//----------------------------------------------------------------
					}, 
					function(error){
						alert('خطایی در سیستم رخ داده است: '+error);
						return;
					}
				);
				
			}else{ //inEditMode
				$("#btnRegister").css('display','none');
				$("#btnConfirm").css('display','block');
				$("#btnReject").css('display','block');
				$("#txtCancleRequestDescription").prop('disabled', true);
				$("#txtDescConfirm").css('display','block');
				$("#txtLabelDesc2").css('display','block');
				
				FormManager.readEntityLoanList({Where: primaryKeyName + " = " + pk },
					function(list)
					{
						$("#txtPersonnel").val(list[0].PersonnelNO);
						$("#txtCancleRequestDescription").val(list[0].CancleRequestDescription);
						tblMain.refresh();
					},
					function(error)
				    {
				        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
				        myHideLoading();
						return;
				    }
				);
				
				
				readFromData({Where: primaryKeyName + " = " + pk},
					function(dataXml)
					{
						CreatorActor_ID = dataXml.find("row:first").find(">col[name='CreatorActor_ID']").text();
						var params = {Where: "ActorId = '" + CreatorActor_ID + "' "};
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									ServiceLocation = dataXml.find("row:first").find(">col[name='mahalkhedmat']").text();
									UnitsName = dataXml.find("row:first").find(">col[name='UnitsName']").text();
									UserName = dataXml.find("row:first").find(">col[name='UserName']").text();
									employmentdate = dataXml.find("row:first").find(">col[name='employmentdate']").text();
									Codepersonel = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
									ServiceLocationId = dataXml.find("row:first").find(">col[name='ServiceLocation_ID']").text();
									
									$("#txtFullName").val(fullName);
									$("#txtServiceLoc").val(ServiceLocation);
									$("#txtUnits").val(UnitsName);
									$("#txtPersonnel").val(Codepersonel);
									$("#txtPosition").val(RoleName);
									$("#txtHireDate").val(employmentdate);
									
								}
							},
							function(error)
						    {
						        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
						        myHideLoading();
								return;
						    }
						);
					}
				);
				}
		}
		
		//******************************************************************************************************
		// تمام ایونت های مربوط به یک المان یا خود فرم در این متد نوشته می شوند
		// مانند ماوس هاور و ...
		function bindEvents()
		{
		}
		//******************************************************************************************************
		function readData()
		{
			//showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					alert(JSON.stringify(data));
					hideLoading();
					$.setFormDataValues(bindingSourceName, dataXml);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
		}
		//******************************************************************************************************
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function getPK()
		{
			return pk;
		}
		//******************************************************************************************************
		// برای دریافت شناسه فرایند بعد از ایجاد و یا در ویرایش استفاده می شود
		// برای دریافت در کد سایر المان ها از ایسن متد استفاده می کنیم
		function isInEditMode()
		{
			return inEditMode;
		}
		//******************************************************************************************************
		function saveData(callback)
		{
			if(inEditMode)
			{
				updateData(callback);
			}
			else
			{
				insertData(callback);
			}
		}
		//******************************************************************************************************
		function insertData(callback)
		{
			 // جلوگیری از ارسال فرم در صورتی که ردیفی انتخاب نشده بود
             var isChecked = $('#tblLoanList .CHbox:checked').length > 0;
   
             if (!isChecked) {
				 alert(JSON.stringify("لطفاً حداقل یک ردیف را انتخاب کنید."));
                 return;
             }else{
				 var row = $('#tblLoanList .CHbox:checked').closest('tr'); // ردیف مربوط به چک باکس
	             var selectedId = row.find('td:eq(2)').text().trim();
			}
			
			if($("#txtCancleRequestDescription").val() == ''){
				alert(JSON.stringify('لطفا توضیحات خود را برای انصراف از وام در بخش توضیحات ثبت کنید'));
				return;
			}else{

				showLoading();
				//کد مورد نظر برای اپدیت ستون مورد نظر در دیتابیس
				var params = {
			        'CancleStatus': 1,
			        'CancleRequestDescription': $("#txtCancleRequestDescription").val()
		    	};
				pk= selectedId;	
				params = $.extend(params, {Where : "Id = "+selectedId});
				
				FormManager.updateEntityLoanRequest(params,
		            function(dataXml) {
						WorkflowService.RunWorkflow("ZJM.LCP.LoanCancelProcess",
					    '<Content><Id>'+pk+'</Id></Content>',
					    true,
					    function(data)
					    {
					        $.alert("درخواست شما با موفقیت ارسال شد.","","rtl",function(){
								hideLoading();
					        	closeWindow({OK:true, Result:null});
							});				
					    }
					    ,function(error)
					    {
					        alert('خطایی در سیستم رخ داده است: '+error);
					        myHideLoading();
							return;
					    }
					);
					myHideLoading();
					if($.isFunction(callback))
					{
						callback();
					}
		            },
		            function(error)
				    {
				        alert('خطایی در سیستم رخ داده است: '+error.erroMessage);
				        myHideLoading();
						return;
				    }
		        );   
			} 
		}
		//******************************************************************************************************
		function updateData(callback)
		{
		}
		//******************************************************************************************************
		function deleteData(callback)
		{
			// اگر بخواهیم خود اینستنس فرایند را حذف کنیم کد فراخوانی حذف از فرم منیجر را اینجا می نویسیم
		}
		//******************************************************************************************************
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
		//******************************************************************************************************
		return {
			init: init,
			getPK: getPK,
			isInEditMode: isInEditMode,
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
	

});