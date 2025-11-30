using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEObjective;

public class SEObjectiveBc : BusinessCore<SEObjectiveKeyViewModel,
                                        SEObjectiveViewModel,
                                        SEObjectiveFullViewModel,
                                        SEObjectiveBm,
                                        SEObjectiveModel,
                                        SEObjectiveRepository,
                                        SEObjectiveResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEObjectiveRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    public SEObjectiveBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) 
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEObjectiveRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEObjectiveBc),
                                        $"Exception in constructor of {nameof(SEObjectiveBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEObjectiveBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@" 
                            SELECT SO.Id,
                                   SO.ObjectiveCode,
                                   SO.ObjectiveTitleFA,
                                   SO.ObjectiveTitleEN,
                                   SO.ObjectiveUnitsEnvolve,
	                               SO.FocusAreaId,
                                   SFA.FocusAreaCode,
                                   SFA.FocusAreaTitleFA,
                                   SFA.FocusAreaTitleEN
                            FROM ZJM.SE_Objective AS SO
	                            INNER JOIN ZJM.SE_FocusArea AS SFA
		                            ON SFA.Id = SO.FocusAreaId
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEObjectiveKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@" 
                            SELECT SO.Id,
                                   SO.ObjectiveCode,
                                   SO.ObjectiveTitleFA,
                                   SO.ObjectiveTitleEN,
                                   SO.ObjectiveUnitsEnvolve,
	                               SO.FocusAreaId,
                                   SFA.FocusAreaCode,
                                   SFA.FocusAreaTitleFA,
                                   SFA.FocusAreaTitleEN
                            FROM ZJM.SE_Objective AS SO
	                            INNER JOIN ZJM.SE_FocusArea AS SFA
		                            ON SFA.Id = SO.FocusAreaId WHERE SO.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(SEObjectiveFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            viewModel.FocusAreaId,
            viewModel.ObjectiveCode,
            viewModel.ObjectiveTitleFA,
            viewModel.ObjectiveTitleEN,
            viewModel.ObjectiveUnitsEnvolve

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
    public override SysResult Delete(SEObjectiveKeyViewModel viewModel)
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
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                            SELECT SO.Id,
                                   SO.ObjectiveCode,
                                   SO.ObjectiveTitleFA,
                                   SO.ObjectiveTitleEN,
                                   SO.ObjectiveUnitsEnvolve,
	                               SO.FocusAreaId,
                                   SFA.FocusAreaCode,
                                   SFA.FocusAreaTitleFA,
                                   SFA.FocusAreaTitleEN
                            FROM ZJM.SE_Objective AS SO
	                            INNER JOIN ZJM.SE_FocusArea AS SFA
		                            ON SFA.Id = SO.FocusAreaId
        ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(SEObjectiveBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(SEObjectiveBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
