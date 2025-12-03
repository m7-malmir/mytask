using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;
using Marina.Services.ApplicationCore.DomainModels.PricingModels;
using Marina.Services.Infrastructure.Data.Repositories.Pricing;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;

public class PRCompetitorBrandBc : BusinessCore<
                                        PRCompetitorBrandKeyViewModel,
                                        PRCompetitorBrandViewModel,
                                        PRCompetitorBrandFullViewModel,
                                        PRCompetitorBrandBm,
                                        PRCompetitorBrandModel,
                                        PRCompetitorBrandRepository,
                                        PRCompetitorBrandResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly PRCompetitorBrandRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;

    //********************************************************************************************************************
    public PRCompetitorBrandBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new PRCompetitorBrandRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(PRCompetitorBrandBc),
                                        $"Exception in constructor of {nameof(PRCompetitorBrandBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(PRCompetitorBrandBc)}.\n LogID: {logId}";
            throw new Exception(message, ex);
        }
    }

    //********************************************************************************************************************
    public override SysResult SelectDataList(DataListRequestConfig config)
    {
        StringBuilder query = new();

        query.Append(@"
            SELECT 
                CB.Id,
                CB.BrandNameFA,
                CB.BrandNameEN
            FROM ZJM.PR_CompetitorBrand AS CB
        ");

        return SelectByQueryWithConfig(config, query);
    }

    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<PRCompetitorBrandKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;

        if (viewModel == null)
            return Result.Error("Passed KeyViewModel in DataRequestConfig is Null");

        StringBuilder query = new();

        query.Append($@"
            SELECT 
                CB.Id,
                CB.BrandNameFA,
                CB.BrandNameEN
            FROM ZJM.PR_CompetitorBrand AS CB
            WHERE CB.Id = {viewModel.Id}
        ");

        return _repository.SelectByQuery(query.ToString());
    }

    //********************************************************************************************************************
    public override SysResult Update(PRCompetitorBrandFullViewModel viewModel)
    {
        var updateValues = new
        {
            viewModel.BrandNameFA,
            viewModel.BrandNameEN
        };

        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Update(updateValues, predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public override SysResult Delete(PRCompetitorBrandKeyViewModel viewModel)
    {
        var predicate = "Id = @Id";
        var predicateParameters = new { viewModel.Id };

        return _repository.Delete(predicate, predicateParameters);
    }

    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append(@"
                SELECT 
                    CB.Id,
                    CB.BrandNameFA,
                    CB.BrandNameEN
                FROM ZJM.PR_CompetitorBrand AS CB
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        nameof(GetAll),
                                        nameof(PRCompetitorBrandBc),
                                        $"Exception in {nameof(GetAll)} Method of {nameof(PRCompetitorBrandBc)}",
                                        ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}
