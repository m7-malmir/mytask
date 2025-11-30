using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEVision;

public class SEVisionBc : BusinessCore<SEVisionKeyViewModel,
                                        SEVisionViewModel,
                                        SEVisionFullViewModel,
                                        SEVisionBm,
                                        SEVisionModel,
                                        SEVisionRepository,
                                        SEVisionResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEVisionRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    public SEVisionBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) 
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEVisionRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEVisionBc),
                                        $"Exception in constructor of {nameof(SEVisionBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEVisionBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@" 
            SELECT SV.Id,
                   SV.VisionTitleFA,
                   SV.VisionTitleEN,
                   SV.VisionDescription 
            FROM ZJM.SE_Vision AS SV
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEVisionKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@" 
                        SELECT SV.Id,
                               SV.VisionTitleFA,
                               SV.VisionTitleEN,
                               SV.VisionDescription FROM ZJM.SE_Vision AS SV
                        WHERE SV.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(SEVisionFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            viewModel.VisionTitleFA,
            viewModel.VisionTitleEN,
            viewModel.VisionDescription
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
    public override SysResult Delete(SEVisionKeyViewModel viewModel)
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
    public SysResult Update2(SEVisionFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            //viewModel.VisionTitleFA,
            viewModel.VisionTitleEN,
            //viewModel.VisionDescription
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
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
            SELECT SV.Id,
                   SV.VisionTitleFA,
                   SV.VisionTitleEN,
                   SV.VisionDescription 
            FROM ZJM.SE_Vision AS SV
        ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(SEVisionBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(SEVisionBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
