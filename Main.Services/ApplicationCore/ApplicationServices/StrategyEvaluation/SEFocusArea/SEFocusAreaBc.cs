using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEFocusArea;

public class SEFocusAreaBc : BusinessCore<SEFocusAreaKeyViewModel,
                                        SEFocusAreaViewModel,
                                        SEFocusAreaFullViewModel,
                                        SEFocusAreaBm, 
                                        SEFocusAreaModel, 
                                        SEFocusAreaRepository, 
                                        SEFocusAreaResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEFocusAreaRepository _repository;
    //********************************************************************************************************************
    public SEFocusAreaBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _repository = new SEFocusAreaRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEFocusAreaBc),
                                        $"Exception in constructor of {nameof(SEFocusAreaBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEFocusAreaBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@" 
            SELECT ZJM.SE_FocusArea.Id,
                   ZJM.SE_FocusArea.VisionId,
                   ZJM.SE_Vision.VisionTitleFA,
                   ZJM.SE_Vision.VisionTitleEN,
                   ZJM.SE_FocusArea.FocusAreaCode,
                   ZJM.SE_FocusArea.FocusAreaTitleFA,
                   ZJM.SE_FocusArea.FocusAreaTitleEN
            FROM ZJM.SE_FocusArea
                INNER JOIN ZJM.SE_Vision 
                ON ZJM.SE_FocusArea.VisionId = ZJM.SE_Vision.Id
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEFocusAreaKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null) {
            return Result.Error("Passed KeyViewModel in DataRequestConfig is Null");
        }

        StringBuilder query = new();

        query.Append($@" 
            SELECT ZJM.SE_FocusArea.Id,
                   ZJM.SE_FocusArea.VisionId,
                   ZJM.SE_Vision.VisionTitleFA,
                   ZJM.SE_Vision.VisionTitleEN,
                   ZJM.SE_FocusArea.FocusAreaCode,
                   ZJM.SE_FocusArea.FocusAreaTitleFA,
                   ZJM.SE_FocusArea.FocusAreaTitleEN
            FROM ZJM.SE_FocusArea
                INNER JOIN ZJM.SE_Vision 
                ON ZJM.SE_FocusArea.VisionId = ZJM.SE_Vision.Id
            WHERE ZJM.SE_FocusArea.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public SysResult GetAllByVision(DataRequestConfig<SEFocusAreaViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null)
        {
            return Result.Error("Passed KeyViewModel in DataRequestConfig is Null");
        }

        StringBuilder query = new();

        query.Append($@" 
            SELECT ZJM.SE_FocusArea.Id,
                   ZJM.SE_FocusArea.VisionId,
                   ZJM.SE_Vision.VisionTitleFA,
                   ZJM.SE_Vision.VisionTitleEN,
                   ZJM.SE_FocusArea.FocusAreaCode,
                   ZJM.SE_FocusArea.FocusAreaTitleFA,
                   ZJM.SE_FocusArea.FocusAreaTitleEN
            FROM ZJM.SE_FocusArea
                INNER JOIN ZJM.SE_Vision 
                ON ZJM.SE_FocusArea.VisionId = ZJM.SE_Vision.Id
            WHERE ZJM.SE_FocusArea.VisionId = {viewModel.VisionId}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(SEFocusAreaFullViewModel viewModel)
    {
        var updateValues = new { 
            viewModel.VisionId, 
            viewModel.FocusAreaCode, 
            viewModel.FocusAreaTitleFA, 
            viewModel.FocusAreaTitleEN 
        };

        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        var result = _repository.Update(updateValues, predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
    public override SysResult Delete(SEFocusAreaKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new
        {
            viewModel.Id
        };

        var result = _repository.Delete(predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
}