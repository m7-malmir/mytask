
	// ====== getValidDataArray =======
	function getValidDataArray(data) {
	    if (data && data.value && Array.isArray(data.value.data)) {
	        return data.value.data;
	    }

	    console.warn("Invalid API response or no data:", data);
	    return [];
	}
// ===== parseGoodsPriceList =======
	function parseGoodsPriceList(data) {
	    let dataArray = getValidDataArray(data);

	    const list = dataArray.map(item => ({
	        id: item.id,
	        goodsId: item.goodsId,
	        goodsName: item.goodsName,
	        consumerPrice: item.consumerPrice,
	        producerPrice: item.producerPrice,
	        basePrice: item.basePrice
	    }));

	    return list;
	}
    //************************************************* */

        readGoodsPrice(jsonParams, onSuccess, onError) {
            const apiUrl = `${MarinaURL}Inventory/ISGoodsPrice/Select`;

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
                        const list = parseGoodsPriceList(data);
                        if ($.isFunction(onSuccess)) {
                            onSuccess({
								list: list,
								totalCount: data.value.totalCount || 0
							});
                        }
                    }
					else {
                        const errorMessage = data.message || "Failed to get data from API";
                        handleError("readGoodsPrice", errorMessage, onError);
                    }
                },
                error: function (xhr, status, error) {
                    handleError("readGoodsPrice", error, onError);
                }
            });
        }

//*************************************************************************** */
function fillGoodsCombo($combo, placeholderText = "انتخاب کالا") {

    $combo.select2({
        placeholder: placeholderText,
        dir: "rtl",
        minimumInputLength: 0, // صفر یعنی با کلیک هم دیتا بیاد

        ajax: {
            delay: 250,

            transport: function (params, success, failure) {
                const term = params.data.term || "";
                const page = params.data.page || 0; // صفحه مورد درخواست
                let filter = [];

                // فقط موقع سرچ (۳ به بالا سرچ فعال میشه)
                if (term.length >= 3) {
                    filter.push({
                        Column: "GoodsName",
                        Operator: "Contains",
                        Value: term
                    });
                }

                const req = {
                    CurrentCompanyId: 1,
                    CurrentUserId: CurrentUserId,
                    PageSize: 25,
                    PageIndex: page, // پشتیبانی صفحه‌بندی مثل برند
                    SortOrder: [{ Column: "Id", Direction: "ASC" }],
                    FilterConditions: filter
                };

                FormManager.readGoodsPrice(
                    req,
                    function (res) {
                        const list = res.list || [];
                        const mapped = list.map(x => ({
                            id: x.goodsId,
                            goodsId: x.goodsId,
                            text: x.goodsName,
                            goodsName: x.goodsName
                        }));

                        success({
                            results: mapped,
                            pagination: {
                                more: list.length === 25
                            }
                        });
                    },
                    function (err) {
                        failure(err);
                    }
                );
            }
        },

        multiple: false
    });

    // وقتی آیتم انتخاب شد
    $combo.on("select2:select", function (e) {
        const item = e.params.data;
    });
}

$(function () {
    fillGoodsCombo($("#cmbGoodsId"), "انتخاب محصول");
});

///////////////////////////////////////////////////////////


{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "customMethodName": "",
  "clientApiKey": "",
  "serviceMethodName": "",
  "customParameters": {
  },
  "viewModels": [
    {
      "planningUnitKpiProjId": 9,
      "objectiveStrategicKPIId": 4,
      "monitorPeriod": 1,
      "measurePeriod": 3,
      "startDate": "2026-01-13",
      "endDate": "2026-01-14",
      "actionPlanNeeded": true,
      "kpiThreshold": "test",
      "kpiAmountAsIs": "test",
      "kpiImprovementTargetInPeriod": "test",
      "description": "test"
    }
  ]
}



 "successed": false,
  "value": "عملیات افزودن با خطا مواجه شد:INSERT INTO ZJM.SE_PlanningUnitKpi (PlanningUnitKpiProjId, ObjectiveStrategicKPIId, MonitorPeriod, MeasurePeriod, StartDate, EndDate, ActionPlanNeeded, KPIThreshold, KPIAmountAsIs, KPIImprovementTargetInPeriod, Description) VALUES (@PlanningUnitKpiProjId, @ObjectiveStrategicKPIId, @MonitorPeriod, @MeasurePeriod, @StartDate, @EndDate, @ActionPlanNeeded, @KPIThreshold, @KPIAmountAsIs, @KPIImprovementTargetInPeriod, @Description) \n1: Implicit distributed transactions have not been enabled. If youre intentionally starting a distributed transaction, set TransactionManager.ImplicitDistributedTransactions to true.()\n   at System.Transactions.DtcProxyShim.DtcProxyShimFactory.ConnectToProxy(String nodeName, Guid resourceManagerIdentifier, Object managedIdentifier, Boolean& nodeNameMatches, Byte[]& whereabouts, ResourceManagerShim& resourceManagerShim)   at System.Transactions.Oletx.DtcTransactionManager.Initialize()   at System.Transactions.Oletx.DtcTransactionManager.get_ProxyShimFactory()   at System.Transactions.TransactionInterop.GetOletxTransactionFromTransmitterPropagationToken(Byte[] propagationToken)   at System.Transactions.TransactionStatePSPEOperation.PSPEPromote(InternalTransaction tx)   at System.Transactions.TransactionStateDelegatedBase.EnterState(InternalTransaction tx)   at System.Transactions.EnlistableStates.Promote(InternalTransaction tx)   at System.Transactions.Transaction.Promote()   at System.Transactions.TransactionInterop.GetExportCookie(Transaction transaction, Byte[] whereabouts)   at Microsoft.Data.SqlClient.SqlInternalConnection.GetTransactionCookie(Transaction transaction, Byte[] whereAbouts)   at Microsoft.Data.SqlClient.SqlInternalConnection.EnlistNonNull(Transaction tx)   at Microsoft.Data.SqlClient.SqlInternalConnection.Enlist(Transaction tx)   at Microsoft.Data.SqlClient.SqlInternalConnectionTds.Activate(Transaction transaction)   at Microsoft.Data.ProviderBase.DbConnectionInternal.ActivateConnection(Transaction transaction)   at Microsoft.Data.ProviderBase.DbConnectionPool.PrepareConnection(DbConnection owningObject, DbConnectionInternal obj, Transaction transaction)   at Microsoft.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, UInt32 waitForMultipleObjectsTimeout, Boolean allowCreate, Boolean onlyOneCheckConnection, DbConnectionOptions userOptions, DbConnectionInternal& connection)   at Microsoft.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal& connection)   at Microsoft.Data.ProviderBase.DbConnectionFactory.TryGetConnection(DbConnection owningConnection, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal oldConnection, DbConnectionInternal& connection)   at Microsoft.Data.ProviderBase.DbConnectionInternal.TryOpenConnectionInternal(DbConnection outerConnection, DbConnectionFactory connectionFactory, TaskCompletionSource`1 retry, DbConnectionOptions userOptions)   at Microsoft.Data.ProviderBase.DbConnectionClosed.TryOpenConnection(DbConnection outerConnection, DbConnectionFactory connectionFactory, TaskCompletionSource`1 retry, DbConnectionOptions userOptions)   at Microsoft.Data.SqlClient.SqlConnection.TryOpen(TaskCompletionSource`1 retry, SqlConnectionOverrides overrides)   at Microsoft.Data.SqlClient.SqlConnection.Open(SqlConnectionOverrides overrides)   at Microsoft.Data.SqlClient.SqlConnection.Open()   at Marina.Helpers.Data.DBConnections.GetSqlConnection(String system) in C:\\Progect\\Marina\\Marina.Helpers\\Data\\DBConnections.cs:line 42   at Marina.Helpers.Base.DapperRepository`2.Add(TModel model) in C:\\Progect\\Marina\\Marina.Helpers\\Base\\DapperRepository.cs:line 219",



  "عملیات افزودن با خطا مواجه شد:INSERT INTO ZJM.SE_PlanningUnitKpi (PlanningUnitKpiProjId, ObjectiveStrategicKPIId, MonitorPeriod, MeasurePeriod, StartDate, EndDate, ActionPlanNeeded, KPIThreshold, KPIAmountAsIs, KPIImprovementTargetInPeriod, Description) VALUES (@PlanningUnitKpiProjId, @ObjectiveStrategicKPIId, @MonitorPeriod, @MeasurePeriod, @StartDate, @EndDate, @ActionPlanNeeded, @KPIThreshold, @KPIAmountAsIs, @KPIImprovementTargetInPeriod, @Description) \n1: Implicit distributed transactions have not been enabled. If youre intentionally starting a distributed transaction, set TransactionManager.ImplicitDistributedTransactions to true.()\n   at System.Transactions.DtcProxyShim.DtcProxyShimFactory.ConnectToProxy(String nodeName, Guid resourceManagerIdentifier, Object managedIdentifier, Boolean& nodeNameMatches, Byte[]& whereabouts, ResourceManagerShim& resourceManagerShim)   at System.Transactions.Oletx.DtcTransactionManager.Initialize()   at System.Transactions.Oletx.DtcTransactionManager.get_ProxyShimFactory..."










      Id
      PlanningUnitKpiProjId
      ObjectiveProjectId
      StartDate
      EndDate
      ProjectThreshold
      ProjectImprovementTargetInPeriod
      Desciption

/////////////////////
            id: item.id,
			planningUnitKpiCount: item.planningUnitKpiCount,
			planningUnitProjCount: item.planningUnitProjCount,
            createdDateShamsi: item.createdDateShamsi,
            actorIdCreator: item.actorIdCreator,
            actorNameCreator: item.actorNameCreator,
            processStatus: item.processStatus,
            rejectStatus: item.rejectStatus,
            isCancel: item.isCancel,
            isCancelName: item.isCancelName,
            typeId: item.type,
            typeName: item.typeName,
            unitId: item.unitId,
            unitName: item.unitName

            Column: "Type",
            Operator: "EqualTo",
            Value: "Time"

{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "pageSize": 10,
  "pageIndex": 0,
  "clientApiKey": "",
  "CustomMethodName": "SelectDataListPlanning",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "id",
      "direction": "Desc"
    }
  ],
  "filterConditions": [
    {
    }
  ],
  "customFilters": {
      "PlanningUnitKpiProjId": "9"
  }
}





{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "pageSize": 10,
  "pageIndex": 0,
  "clientApiKey": "",
   "CustomMethodName": "SelectDataListPlanning",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "id",
      "direction": "desc"
    }
  ],
  "filterConditions": {},
  "customFilters": {
       "PlanningUnitKpiProjId":9
  }
}







{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "customMethodName": "",
  "clientApiKey": "",
   "CustomMethodName": "SelectDataListPlanning",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "id",
      "direction": "desc"
    }
  ],
  "filterConditions": [
    {

    }
  ],
  "customFilters": {
}
}


////////////
using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEPlanningUnitKpi;

public class SEPlanningUnitKpiBc : BusinessCore<SEPlanningUnitKpiKeyViewModel,
                                                SEPlanningUnitKpiBaseViewModel,
                                                SEPlanningUnitKpiFullViewModel,
                                                SEPlanningUnitKpiBm,
                                                SEPlanningUnitKpiModel,
                                                SEPlanningUnitKpiRepository,
                                                SEPlanningUnitKpiResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEPlanningUnitKpiRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //*******************************************************************************************************************
    public SEPlanningUnitKpiBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEPlanningUnitKpiRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(
                GeneralEnums.LogType.Error,
                "Constructor",
                nameof(SEPlanningUnitKpiBc),
                $"Exception in constructor of {nameof(SEPlanningUnitKpiBc)} Class",
                ex);

            var message =
                $"Exception in constructor of {nameof(SEPlanningUnitKpiBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        if (config.CustomFilters == null)
            return Result.Error("Costum Filters is not defined");

        var planningId = config.CustomFilters.Get<int>("UsedInPlanningId");
        var unitIdList = config.CustomFilters.Get<int>("UnitIdList");

        StringBuilder query = new();

        query.Append($@"
            SELECT SOSK.Id,
                   SOSK.ObjectiveId,
                   SO.ObjectiveCode,
                   SO.ObjectiveTitleEN,
                   SOSK.StrategicKPIId,
                   SSK.KPICode,
                   SSK.StrategicKPINameEN,
                   SOSK.UnitsId,
                   (
                       SELECT STRING_AGG(U.Name, ' - ')
                       FROM Bpms_Core.Office.Units AS U
                       WHERE U.Id IN
                             (
                                 SELECT * FROM STRING_SPLIT(SOSK.UnitsId, ',') AS SS
                             )
                   ) UnitsName,
                   SOSK.ReportersId,
                   SOSK.Threshold,
                   SOSK.UpperControlLimit,
                   SOSK.LowerControlLimit,
                   SOSK.VerificationSource,
                   SOSK.UsedInPlanningId
            FROM ZJM.SE_ObjectiveStrategicKPI AS SOSK
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.StrategicKPIId
                INNER JOIN ZJM.SE_Objective AS SO
                    ON SO.Id = SOSK.ObjectiveId
            WHERE EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(SOSK.UnitsId, ',') AS UnitIdList
                WHERE UnitIdList.value = {unitIdList}
            ) AND (SOSK.UsedInPlanningId = {planningId} OR SOSK.UsedInPlanningId IS NULL)

        ");

        return SelectByQueryWithConfig(config, query);
    }
    //*******************************************************************************************************************
    public SysResult SelectDataListPlanning(DataListRequestConfig config)
    {
        if (config.CustomFilters == null)
            return Result.Error("Costum Filters is not defined");

        var planningId = config.CustomFilters.Get<int>("PlanningUnitKpiProjId");

        StringBuilder query = new();

        query.Append($@"
           SELECT SPUK.Id,
                   SPUK.PlanningUnitKpiProjId,
                   SSK.StrategicKPINameEN,
                   SSK.StrategicKPINameFA,
                   SPUK.MonitorPeriod,
                   GMU.MetricUnitTitleEN MonitorPeriodTitleEN,
                   GMU.MetricUnitTitleFA MonitorPeriodTitleFA,
                   SPUK.MeasurePeriod,
                   GMU2.MetricUnitTitleEN MeasurePeriodTitleEN,
                   GMU2.MetricUnitTitleFA MeasurePeriodTitleFA,
                   SPUK.StartDate,
                   SPUK.EndDate,
                   SPUK.ActionPlanNeeded,
                   SPUK.KPIThreshold,
                   SPUK.KPIAmountAsIs,
                   SPUK.KPIImprovementTargetInPeriod,
                   SPUK.Description
            FROM ZJM.SE_PlanningUnitKpi AS SPUK
                INNER JOIN ZJM.SE_ObjectiveStrategicKPI AS SOSK
                    ON SOSK.Id = SPUK.ObjectiveStrategicKPIId
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.StrategicKPIId
                INNER JOIN ZJM.GT_MetricUnit AS GMU
                    ON SPUK.MonitorPeriod = GMU.Id
                INNER JOIN ZJM.GT_MetricUnit AS GMU2
                    ON SPUK.MeasurePeriod = GMU2.Id
            where SPUK.PlanningUnitKpiProjId = {planningId}
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //*******************************************************************************************************************
    public override SysResult Find(DataRequestConfigBase config)
    {
        var viewModel = config.GetViewModel<SEPlanningUnitKpiBaseViewModel>;

        if (config.CustomFilters == null)
            return Result.Error("Costum Filters is not defined");

        var planningId = config.CustomFilters.Get<int>("UsedInPlanningId");
        var unitIdList = config.CustomFilters.Get<int>("UnitIdList");

        StringBuilder query = new();

        query.Append($@"
            SELECT SOSK.Id,
                   SOSK.ObjectiveId,
                   SO.ObjectiveCode,
                   SO.ObjectiveTitleEN,
                   SOSK.StrategicKPIId,
                   SSK.KPICode,
                   SSK.StrategicKPINameEN,
                   SOSK.UnitsId,
                   (
                       SELECT STRING_AGG(U.Name, ' - ')
                       FROM Bpms_Core.Office.Units AS U
                       WHERE U.Id IN
                             (
                                 SELECT * FROM STRING_SPLIT(SOSK.UnitsId, ',') AS SS
                             )
                   ) UnitsName,
                   SOSK.ReportersId,
                   SOSK.Threshold,
                   SOSK.UpperControlLimit,
                   SOSK.LowerControlLimit,
                   SOSK.VerificationSource,
                   SOSK.UsedInPlanningId
            FROM ZJM.SE_ObjectiveStrategicKPI AS SOSK
                INNER JOIN ZJM.SE_StrategicKPI AS SSK
                    ON SSK.Id = SOSK.StrategicKPIId
                INNER JOIN ZJM.SE_Objective AS SO
                    ON SO.Id = SOSK.ObjectiveId
            WHERE EXISTS
            (
                SELECT 1
                FROM STRING_SPLIT(SOSK.UnitsId, ',') AS UnitIdList
                WHERE UnitIdList.value = {unitIdList}
            ) AND (SOSK.UsedInPlanningId = {planningId} OR SOSK.UsedInPlanningId IS NULL)
        ");
        return _repository.SelectByQuery(query.ToString());
    }
    //*******************************************************************************************************************
    public override SysResult Delete(SEPlanningUnitKpiKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        return _repository.Delete(predicate, predicateParameters);
    }
    //*******************************************************************************************************************
}
