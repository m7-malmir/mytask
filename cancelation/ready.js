var $form;
var currentActorId;
var ProcessStatus;
var PersonnelNO;
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
					inEditMode = true;
					readData();
				}
			}
			
			$("#btnConfirm").css('display','none');
			$("#btnReject").css('display','none');
			$("#txtLabelDesc2").css('display','none');
			$("#txtDescConfirm").css('display','none');
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
						var params = {Where: "ActorId = " + currentActorId};
						
						//----------------------------------------------------------------
						// دریافت اطلاعات و نمایش در صفحه
						//----------------------------------------------------------------
						BS_GetUserInfo.Read(params
							, function(data)
							{
								var dataXml = null;
								if($.trim(data) != "")
								{
									dataXml = $.xmlDOM(data);
									fullName = dataXml.find("row:first").find(">col[name='fullName']").text();
									RoleName = dataXml.find("row:first").find(">col[name='RoleName']").text();
									PersonnelNO = dataXml.find("row:first").find(">col[name='Codepersonel']").text();
																
									$("#txtFullName").val(fullName).prop('disabled', true);
									$("#txtPersonnelNO").val(PersonnelNO).prop('disabled', true);
									$("#txtRoleName").val(RoleName).prop('disabled', true);
									tblMain.refresh();
								}
							}
						);
						//----------------------------------------------------------------
					},
					function(err){
						hideLoading();
						$ErrorHandling.Erro(err,"خطا در سرویس getCurrentActor");
					}
				);
			}else{
			/*
			btnConfirm show
			btnReject show
			btnRegister hide
				*/
				
				
				
					
				
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
			showLoading();
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
                 alert("لطفاً حداقل یک ردیف را انتخاب کنید.");
                 event.preventDefault(); // جلوگیری از ارسال فرم
             }else{
					// نمایش عناصر
	             $("#txtLabelDesc1").css('display', 'block');
	             $("#txtCancleRequestDescription").css('display', 'block');
				  var row = $('#tblLoanList .CHbox:checked').closest('tr'); // ردیف مربوط به چک باکس
                  var selectedId = row.find('td:eq(2)').text().trim();
				  //alert(JSON.stringify(id));
			}
			if($("#txtCancleRequestDescription").val() == ''){
				alert(JSON.stringify('لطفا توضیحات خود را برای انصراف از وام ثبت در بخش توضیحات ثبت کنید'));
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
						    ,function(err)
						    {
						        alert('مشکلی در شروع فرآیند به وجود آمده. '+err);
						        hideLoading();
						    }
						);
		                closeWindow({OK:true, Result:true});
						
		            },
		            function(err) {
		                hideLoading();
		                alert(err);
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