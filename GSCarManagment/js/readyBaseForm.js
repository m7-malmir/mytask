var $form;
var currentActorId;
var isGetForm = 0;
var ServiceLocationId;
var html_;
var ProcessStatus;
var GuranteeType;
var PersonnelNO;
$(function(){
	$form = (function()
	{
		var pk,
			inEditMode = false,
			primaryKeyName = "Id",
			bindingSourceName = "BS_MainData",
			readFromData = FormManager.readEntity,
			updateFromData = FormManager.updateEntity,
            insertFromData = FormManager.insertEntity;
		$('#txtsearch').attr("placeholder", "جستجو در پلاک خودرو")
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

		function createControls()
		{
			Server.GetCurrentDate("dddd d MMMM yyyy", 'fa', true,
			    function(data) {
					$("#LabelControl12").text(data);
			    },
			    function(error) {
			        $ErrorHandling.Error(error, " خطا در تاریخ جاری سیستم");
			});
			var now = new Date();
			
			refreshTable();
			UserService.GetCurrentActor(true,
				function(data){
					hideLoading();
					var xmlActor = $.xmlDOM(data);
					currentActorId = xmlActor.find('actor').attr('pk');
					
					var params = {Where: "ActorId = '" + currentActorId + "' AND EnabledRole = 1"};
					BS_GetUsers.Read(params
						, function(data)
						{
							var dataXml = null;
							dataXml = $.xmlDOM(data);
							if($.trim(data) != "")
							{
								PersonnelNO = dataXml.find("row:first").find(">col[name='UserName']").text();
							}
						}, function(err){
							alert(JSON.stringify("خطا در دریافت اطلاعات درخواست! لطفا با پشتیبان سامانه تماس بگیرید."));
						}
					);
					
					
				}
			);
		}

		function bindEvents()
		{
			/*randomFileId = Math.floor(Math.random() * (1000000000)) - 2000000;
			firstRandomId = randomFileId;*/
		}

		function readData()
		{
			showLoading();
			readFromData({Where: primaryKeyName + " = " + pk},
				function(dataXml)
				{
					
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
						updateData(callback);
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
		/*	showLoading();
			var params = $.getFormDataValues(bindingSourceName);
			params.CreatorActor_ID = currentActorId;
			params.LoanAmount = rcommafy($("#txtLoanAmount").val());
			params.LoanInstallments = rcommafy($("#txtLoanInstallments").val());
			params.PersonnelNO = $("#txtPersonnel").val();
			params.MonthlyTotalCommitmentRatio = null;
			insertFromData(params,
				function(dataXml)
				{
					pk = dataXml.find("row:first").find(">col[name='" + primaryKeyName + "']").text();
					inEditMode = true;
					WorkflowService.RunWorkflow("ZJM.SDS.CDS.CertificateOfDeductionFromSalary",
					    '<Content><Id>'+pk+'</Id><OOF>'+ServiceLocationId+'</OOF></Content>',
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
					myHideLoading();
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
			*/
		}

		function updateData(callback)
		{
			showLoading();
			var params = {};
			params.MonthlyTotalCommitmentAmount = $("#TextBoxControl2").val();
			params.MonthlyTotalCommitmentRatio = $("#TextBoxControl1").val();
			params = $.extend(params, {Where : primaryKeyName + " = " + pk});
			updateFromData(params,
				function(data)
				{
					Office.Inbox.setResponse(dialogArguments.WorkItem,1, ""
					    , function(data)
					    { 
					        closeWindow({OK:true, Result:null});
					    }, function(err){ throw Error(err); }
					);
				},
				function(err)
				{
					hideLoading();
					alert(err);
				}
			);
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
			validateForm: validateForm,
			saveData: saveData
		};
	}());
	$form.init();
});