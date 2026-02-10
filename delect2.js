
/// old select
    {
    currentCompanyId: 1,
    currentUserId: "1,1,1",
    "pageSize": 10,
    customMethodName: "",
    clientApiKey: "",
    serviceMethodName: "",
    customFilters: {},
    viewModel: null
}

/// new select
{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "customMethodName": "",
  "pageSize": 10,
  "pageIndex": 0,
  "clientApiKey": "",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "id",
      "direction": "desc"
    }
  ],
  "filterConditions": [
  ],
  "customFilters": {
  }
}










//===================================================================
const FormManager = (() => {
    // ====================== Load Custom JS =======================
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/Web/Scripts/Custom/marinaUtility.js';
    document.head.appendChild(script);

    // ====================== Private methods ======================
	//const MarinaURL = "http://localhost:5113/api/";

    //  parseObjectiveStrategicKPIList
    function parseObjectiveStrategicKPIList(data) {
        let dataArray = getValidDataArray(data);
        const list = dataArray.map(item => ({
            id: item.id ?? 0,
            objectiveId: item.objectiveId ?? 0,
            objectiveCode: item.objectiveCode ?? "",
            objectiveTitleEN: item.objectiveTitleEN ?? "",
            strategicKPIId: item.strategicKPIId ?? 0,
            strategicKPINameEN: item.strategicKPINameEN ?? "",
            unitsId: item.unitsId ?? "",
            kpiCode: item.kpiCode ?? "",
            unitsName: item.unitsName ?? "",
            reportersId: item.reportersId ?? "",
            threshold: item.threshold ?? null,
            upperControlLimit: item.upperControlLimit ?? null,
            lowerControlLimit: item.lowerControlLimit ?? null,
			usedInPlanningId: item.usedInPlanningId ?? "",
            verificationSource: item.verificationSource ?? ""
        }));

        return list;
    }
	// parse SEPlanningUnitKpiList
	function parseSEPlanningUnitKpiList(data) {
	    let dataArray = getValidDataArray3(data);

	    const list = dataArray.map(item => ({
	        id: item.id ?? null,
	        planningUnitKpiProjId: item.planningUnitKpiProjId ?? null,
	        strategicKPINameEN: item.strategicKPINameEN ?? null,
	        monitorPeriodTitleEN: item.monitorPeriodTitleEN ?? null,
	        measurePeriodTitleEN: item.measurePeriodTitleEN ?? null,
	        startDate: item.startDate ?? null,
	        endDate: item.endDate ?? null,
	        actionPlanNeeded: item.actionPlanNeeded ?? false,
	        kpiThreshold: item.kpiThreshold ?? null,
	        kpiAmountAsIs: item.kpiAmountAsIs ?? null,
	        kpiImprovementTargetInPeriod: item.kpiImprovementTargetInPeriod ?? null,
	        description: item.description ?? ""
	    }));

	    return list;
	}

	// ======= parseStrategicKpiMetricUnitList ========
	function parseGTMetricUnit(data) {
	    let dataArray = getValidDataArray2(data);

	    const list = dataArray.map(item => ({
	        id: item.id,
	        metricUnitTitleEN: item.metricUnitTitleEN || ""
	    }));
	    return list;
	}

    // ====== getValidDataArray =======
    function getValidDataArray(data, hasNestedData = false) {
        if (data && data.value && Array.isArray(data.value.data)) {
	        return data.value.data;
	    }
	    console.warn("Invalid API response or no data:", data);
	    return [];
    }
	    // ====== getValidDataArray =======
    function getValidDataArray3(data, hasNestedData = false) {
        if (data && data.value && Array.isArray(data.value.data)) {
	        return data.value.data;
	    }
		if (!data || !data.successed || !data.value) {
            console.warn("Invalid API response (no successed/value):", data);
            return [];
        }

        let arrayToReturn;

        if (hasNestedData || (data.value.data && Array.isArray(data.value.data))) {
            arrayToReturn = data.value.data;
        }
        else if (Array.isArray(data.value)) {
            arrayToReturn = data.value;
        }
        else {
            console.warn("Unexpected data structure:", data.value);
            return [];
        }

        if (!Array.isArray(arrayToReturn)) {
            console.warn("Expected array but got:", arrayToReturn);
            return [];
        }

        return arrayToReturn;
    }
    // ======= getValidDataArray ========
	function getValidDataArray2(data) {
	    if (data && data.value && Array.isArray(data.value.data)) {
	        return data.value.data;
	    }

	    console.warn("Invalid API response or no data:", data);
	    return [];
	}

    // ====== getValidViewModels ======
    function getValidViewModels(requestParams, onError) {
        const items = (requestParams && requestParams.viewModels) ? requestParams.viewModels : [];
        if (!items.length) {
            handleError("deleteKPI", "No valid viewModels were provided for deletion.", onError);
            return [];
        }
        const validItems = [];
        for (let i = 0; i < items.length; i++) {
            const vm = items[i];
            if (vm && typeof vm.id === "number" && vm.id > 0) {
                validItems.push(vm);
            }
        }
        if (!validItems.length) {
            handleError("deleteKPI", "No valid ID found in viewModels", onError);
        }
        return validItems;
    }

    // ======== handleError ==========
    function handleError(methodName, error, onError) {
        const message = `An error occurred. (Method: ${methodName})`;
        console.error("Error:", message);
        console.error("Details:", error);
        if ($.isFunction(onError)) {
            onError({ message, details: error });
        } else {
            console.error(`${message} (No callback onError):`, error);
        }
    }

    // ====================== Public methods ======================
    return {
		//============= Read ObjectiveStrategicKPI  =====================
        readObjectiveStrategicKPI(jsonParams, onSuccess, onError) {

          const apiUrl = `${MarinaURL}StrategyEvaluation/SEObjectiveStrategicKPI/Select`;

          const defaultParams = {
                CurrentCompanyId: 1,
                CurrentUserId: "",
                PageSize: 10,
                PageIndex: 0,
                ClientApiKey: "",
                ServiceMethodName: "",
                SortOrder: [{ Column: "Id", Direction: "DESC" }],
                FilterConditions: [],
                CustomFilters: {}
            };

			// Merge default and custom params
            const requestParams = { ...defaultParams, ...jsonParams };

            $.ajax({
                url: apiUrl,
                type: "GET",
                data: {
					DataListRequestConfig: JSON.stringify(requestParams)
				},
                success: function (data) {
                    if (data && data.successed) {
						const list = parseObjectiveStrategicKPIList(data);
						 if ($.isFunction(onSuccess)) {
                            onSuccess({
								list: list,
								totalCount: data.value.totalCount || 0
							});
                        }
                    }
					else {
                        const errorMessage = data.message || "Failed to get data from API";
                        handleError("readObjectiveStrategicKPI", errorMessage, onError);
                    }
                },
                error: function (xhr, status, error) {
                    handleError("readObjectiveStrategicKPI", error, onError);
                }
            });
		},
		// ============= read PlanningUnitKpi =========
		readPlanningUnitKpi(jsonParams, onSuccess, onError) {
			const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpi/Select`;
			const defaultParams = {
		        CurrentCompanyId: 1,
		        CurrentUserId: "",
		        PageSize: 10,
		        PageIndex: 0,
		        ClientApiKey: "",
		        ServiceMethodName: "",
		        SortOrder: [{ Column: "Id", Direction: "DESC" }],
		        FilterConditions: [],
		        CustomFilters: {}
			};

			const requestParams = { ...defaultParams, ...jsonParams };

			$.ajax({
				url: apiUrl,
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(requestParams),
				success: function (data) {
					if (data && data.successed) {
						const list = parseSEPlanningUnitKpiList(data);
						if ($.isFunction(onSuccess)) {
							onSuccess({
								list: list,
								totalCount: data.value.totalCount || 0
							});
						}
					} else {
						handleError("readPlanningUnitKpi", data.message, onError);
					}
				},
				error: function (xhr, status, error) {
					handleError("readPlanningUnitKpi", error, onError);
				}
			});
		},
		// ========== readGTMetricUnit ==========
        readGTMetricUnit(jsonParams, onSuccess, onError) {
            const apiUrl = `${MarinaURL}GeneralTable/GTMetricUnit/Select`;

			const defaultParams = {
                CurrentCompanyId: 1,
                CurrentUserId: "",
                PageSize: 50,
                PageIndex: 0,
                ClientApiKey: "",
                ServiceMethodName: "",
                SortOrder: [{ Column: "Id", Direction: "ASC" }],
                FilterConditions: [],
                CustomFilters: {}
            };

			// Merge default and custom params
            const requestParams = { ...defaultParams, ...jsonParams };
            $.ajax({
                url: apiUrl,
                type: "GET",
                data: {
					DataListRequestConfig: JSON.stringify(requestParams)
				},
                success: function (data) {

                    if (data && data.successed) {
                        const list = parseGTMetricUnit(data);
                        if ($.isFunction(onSuccess)) {
                            onSuccess({
								list: list,
								totalCount: data.value.totalCount || 0
							});
                        }
                    }
					else {
                        const errorMessage = data.message || "Failed to get data from API";
                        handleError("readGTMetricUnit", errorMessage, onError);
                    }
                },
                error: function (xhr, status, error) {
                    handleError("readGTMetricUnit", error, onError);
                }
            });
        },
        // ==== deletePlanningUnitKpi ====
        deletePlanningUnitKpi(jsonParams, onSuccess, onError) {

            const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpi/Delete`;
            const defaultParams = {
                CurrentCompanyId: 1,
                CurrentUserId: "",
                ClientApiKey: "",
                ServiceMethodName: "",
                CustomParameters: {},
                viewModels: []
            };

            // Merge default and custom params
            const requestParams = { ...defaultParams, ...jsonParams };

            // Validate viewModels and ID
            var validItems = getValidViewModels(requestParams, onError);
            if (!validItems.length) return;

            // ID are numbers
            requestParams.viewModels = validItems.map(function(vm) {
                return { id: Number(vm.id) };
            });

            $.ajax({
                url: apiUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestParams),
                success: function (data) {
                    if (data && data.successed) {
                        if ($.isFunction(onSuccess)) {
                            onSuccess({ message: "Deleted successfully.", data: data.value });
                        }
                    } else {
                        const errorMessage = data.message || "Data deletion failed.";
                        handleError("deleteObjectiveStrategicKPI", errorMessage, onError);
                    }
                },
                error: function (xhr, status, error) {
                    handleError("deleteObjectiveStrategicKPI", `Error in deletion request: ${status} - ${error}`, onError);
                }
            });
        },
		// ==== addPlanningUnitKpi ====
        addPlanningUnitKpi(jsonParams, onSuccess, onError) {
            const apiUrl = `${MarinaURL}Planning/SEPlanningUnitKpi/Add`;
            const defaultParams = {
                currentCompanyId: "",
                currentUserId: "",
                customMethodName: "",
                clientApiKey: "",
                serviceMethodName: "",
                customParameters: {},
                viewModels: []
            };

            const requestParams = { ...defaultParams, ...jsonParams };
               $.ajax({
            url: apiUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestParams),
            success: function (data) {
                if (data && data.successed) {
                    if ($.isFunction(onSuccess)) {
                        onSuccess({ message: "Promotion Goods Details added successfully.", data: data.value });
                    }
                } else {
                    const errorMessage = data.message || "Failed to add objective strategic KPI.";
                    handleError("addPromotionGoodsDetails", errorMessage, onError);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", xhr.responseText);
                handleError("addPromotionGoodsDetails", { status, error, response: xhr.responseText }, onError);
            }
        });
        }
    };

})();
// ========================== pagination ============================

const gridPagination1 = (function () {
	let currentPage = 1;
	let totalRows = 0;
	let totalPages = 1;
	let $table = null;
	let rowsPerPage = 0;
	let $pagination = null;
	let $rowPagination = null;
	let direction = 'rtl';
	function showPage(page) {
		currentPage = page;
		tblMain.load(page - 1);
	}
	function renderButtons() {
		$pagination.empty().show();
		$rowPagination.show();
		const noData = totalRows === 0;
		const singlePageOnly = totalRows <= rowsPerPage;
		const prevDisabled = (currentPage === 1 || noData || singlePageOnly) ? "disabled" : "";
		const nextDisabled = (currentPage === totalPages || noData || singlePageOnly) ? "disabled" : "";
		const prevIcon = direction === 'ltr' ? 'fa-chevron-left' : 'fa-chevron-right';
		const nextIcon = direction === 'ltr' ? 'fa-chevron-right' : 'fa-chevron-left';
		let buttons = [];
		const maxButtons = 3;
		if (totalPages <= maxButtons) {
			for (let i = 1; i <= totalPages; i++) {
				buttons.push(i);
			}
		} else {
			let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
			let endPage = Math.min(totalPages, startPage + maxButtons - 1);
			if (endPage === totalPages) {
				startPage = Math.max(1, totalPages - maxButtons + 1);
			}
			if (startPage > 1) {
				buttons.push(1);
				if (startPage > 2) {
					buttons.push('...');
				}
			}
			for (let i = startPage; i <= endPage; i++) {
				buttons.push(i);
			}
			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					buttons.push('...');
				}
				buttons.push(totalPages);
			}
		}
		if (direction === 'ltr') {
			buttons = buttons.reverse();
		}
		if (direction === 'rtl') {
			$pagination.append(`
				<a href="#" class="prev" ${prevDisabled}>
					<i style="font-family: 'Font Awesome 5 Pro',serif!important;" class="fas ${prevIcon}"></i>
				</a>
			`);
			buttons.forEach(button => {
				if (button === '...') {
					$pagination.append(`<span class="ellipsis">...</span>`);
				} else {
					const activeClass = currentPage === button ? "active" : "";
					const disabledClass = (noData || singlePageOnly) ? "disabled" : "";
					$pagination.append(`
						<a href="#" data-page="${button}" class="${activeClass} ${disabledClass}">${button}</a>
					`);
				}
			});
			$pagination.append(`
				<a href="#" class="next" ${nextDisabled}>
					<i style="font-family: 'Font Awesome 5 Pro',serif!important;" class="fas ${nextIcon}"></i>
				</a>
			`);
		} else {
			$pagination.append(`
				<a href="#" class="next" ${nextDisabled}>
					<i style="font-family: 'Font Awesome 5 Pro',serif!important;" class="fas ${nextIcon}"></i>
				</a>
			`);
			buttons.forEach(button => {
				if (button === '...') {
					$pagination.append(`<span class="ellipsis">...</span>`);
				} else {
					const activeClass = currentPage === button ? "active" : "";
					const disabledClass = (noData || singlePageOnly) ? "disabled" : "";
					$pagination.append(`
						<a href="#" data-page="${button}" class="${activeClass} ${disabledClass}">${button}</a>
					`);
				}
			});
			$pagination.append(`
				<a href="#" class="prev" ${prevDisabled}>
					<i style="font-family: 'Font Awesome 5 Pro',serif!important;" class="fas ${prevIcon}"></i>
				</a>
			`);
		}
	}
	function bindEvents() {
		$pagination.off("click").on("click", "a", function (e) {
			e.preventDefault();
			const $btn = $(this);
			if ($btn.attr("disabled")) return;
			if ($btn.hasClass("prev") && currentPage > 1) {
				showPage(currentPage - 1);
			} else if ($btn.hasClass("next") && currentPage < totalPages) {
				showPage(currentPage + 1);
			} else if ($btn.data("page")) {
				showPage(parseInt($btn.data("page")));
			}
		});
	}
	return function initPagination(element, rowNumber, newTotalCount, dir = 'rtl') {
		$table = element;
		rowsPerPage = rowNumber;
		$pagination = $("#gridPagination1");
		$rowPagination = $("#tscTablePagination1");
		totalRows = newTotalCount || 0;
		totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
		direction = dir;
		if (currentPage > totalPages) currentPage = 1;
		renderButtons();
		bindEvents();
		return function updatePagination(newTotalCount, newPage) {
			totalRows = newTotalCount || 0;
			totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
			if (newPage) currentPage = newPage;
			if (currentPage > totalPages) currentPage = 1;
			renderButtons();
		};
	};
})();


Id	UnitId	UserId	Status	Accountable
32	  34	  2184	  1	        0
