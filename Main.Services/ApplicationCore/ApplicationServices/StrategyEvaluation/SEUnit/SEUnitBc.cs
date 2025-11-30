using Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;
using Marina.Services.Infrastructure.Data.Repositories.StrategyEvaluation;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEUnit;

public class SEUnitBc : BusinessCore<SEUnitKeyViewModel,
                                        SEUnitViewModel,
                                        SEUnitFullViewModel,
                                        SEUnitBm,
                                        SEUnitModel,
                                        SEUnitRepository,
                                        SEUnitResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly SEUnitRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    public SEUnitBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) 
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new SEUnitRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(SEUnitBc),
                                        $"Exception in constructor of {nameof(SEUnitBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(SEUnitBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //*******************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append($@" 
            SELECT 
                SU.Id,
                SU.UnitId,
                SU.UserId,
                SU.Status,

                CASE 
                    WHEN SU.Status = 1 THEN 'active'
                    WHEN SU.Status = 0 THEN 'deactive'
                    ELSE 'unknown'
                END AS StatusTitle,

                U.FirstName AS FirstName,
                U.LastName AS LastName,
                U.UserName AS UserName,
                UN.Name AS UnitName

            FROM ZJM.SE_Unit AS SU
            LEFT JOIN Bpms_Core.Office.Users AS U
                ON U.Id = SU.UserId
            LEFT JOIN Bpms_Core.Office.Units AS UN
                ON UN.Id = SU.UnitId
        ");

        return SelectByQueryWithConfig(config, query);
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<SEUnitKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();

        query.Append($@"
            SELECT 
                SU.Id,
                SU.UnitId,
                SU.UserId,
                SU.Status,

                CASE 
                    WHEN SU.Status = 1 THEN 'active'
                    WHEN SU.Status = 0 THEN 'deactive'
                    ELSE 'unknown'
                END AS StatusTitle,

                U.FirstName AS FirstName,
                U.LastName AS LastName,
                U.UserName AS UserName,
                UN.Name AS UnitName

            FROM ZJM.SE_Unit AS SU
            LEFT JOIN Bpms_Core.Office.Users AS U
                ON U.Id = SU.UserId
            LEFT JOIN Bpms_Core.Office.Units AS UN
                ON UN.Id = SU.UnitId
            WHERE SU.Id = {viewModel.Id}
        ");


        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************
    public override SysResult Update(SEUnitFullViewModel viewModel)
    {
        var updateValues = new
        {
            //viewModel.Id,
            viewModel.UnitId,
            viewModel.UserId,
            viewModel.Status
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
    public override SysResult Delete(SEUnitKeyViewModel viewModel)
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
                SELECT 
                    SU.Id,
                    SU.UnitId,
                    SU.UserId,
                    SU.Status,

                    CASE 
                        WHEN SU.Status = 1 THEN 'active'
                        WHEN SU.Status = 0 THEN 'deactive'
                        ELSE 'unknown'
                    END AS StatusTitle,

                    U.FirstName AS FirstName,
                    U.LastName AS LastName,
                    U.UserName AS UserName,

                    UN.Name AS UnitName

                FROM ZJM.SE_Unit AS SU
                LEFT JOIN Bpms_Core.Office.Users AS U
                    ON U.Id = SU.UserId
                LEFT JOIN Bpms_Core.Office.Units AS UN
                    ON UN.Id = SU.UnitId
        ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(SEUnitBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(SEUnitBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
