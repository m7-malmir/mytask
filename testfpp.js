					FormManager.insertGuestDetail(Guests,
					    function(dataXml) { 
							
								WorkflowService.RunWorkflow("ZJM.FDR.FoodGuestsReservation",
									'<Content><Id>' + pk + '</Id></Content>',
									true,
								
									function(data) {
					
										   $.alert("درخواست شما با موفقیت ارسال شد.", "", "rtl", function() {
											hideLoading();
											closeWindow({ OK: true, Result: null });
										});
									},
									function(err) {
										console.error('مشکلی در شروع فرآیند به وجود آمده:', err); // چاپ خطا در کنسول
										alert('مشکلی در شروع فرآیند به وجود آمده. ' + err);
										hideLoading();
									}
								);
								myHideLoading();
								if ($.isFunction(callback)) {
									callback();
								}
											        $.alert("اطلاعات مهمان با موفقیت ثبت شد.","","rtl",function(){	
									closeWindow({OK:true, Result:null});
						        });
						    },
						    function(error) { // تابع خطا
						        console.log("خطای برگشتی:", error);
						        $.alert("عملیات با خطا مواجه شد: " + (error.message || "خطای ناشناخته"), "", "rtl");
						    }
						);
		            myHideLoading();
		            if ($.isFunction(callback)) {
		                callback();
		            }