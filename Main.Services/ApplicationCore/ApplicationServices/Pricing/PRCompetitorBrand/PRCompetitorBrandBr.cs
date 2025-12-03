using System.Data;
using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand;
using Marina.ViewModels.PricingViewModels;


namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRCompetitorBrand
{
    public class PRCompetitorBrandBr : BusinessRule<
                                            PRCompetitorBrandKeyViewModel,
                                            PRCompetitorBrandViewModel,
                                            PRCompetitorBrandFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;

        public PRCompetitorBrandBr(
            Serilog.ILogger logger,
            byte currentCompanyId,
            string currentUserId,
            IDbConnection? dbConnection)
            : base(logger, currentCompanyId, currentUserId, dbConnection)
        {
            _logger = logger;
            _dbConnection = dbConnection;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
        }

        //********************************************************************************************************************
        public override SysResult AddPrecondition(PRCompetitorBrandViewModel viewModel)
        {
            try
            {
                var bc = new PRCompetitorBrandBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                var predicate = @"BrandNameEN = @BrandNameEN OR BrandNameFA = @BrandNameFA";

                var predicateParameters = new
                {
                    BrandNameEN = viewModel.BrandNameEN,
                    BrandNameFA = viewModel.BrandNameFA
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Competitor Brand");

                var list = (IEnumerable<PRCompetitorBrandResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"The desired brand name is used in defining the '{ex.BrandNameEN}'/'{ex.BrandNameFA}' competitor brand.");
                }

                return base.AddPrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(AddPrecondition),
                    nameof(PRCompetitorBrandBr),
                    $"Exception in {nameof(AddPrecondition)} of {nameof(PRCompetitorBrandBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        public override SysResult UpdatePrecondition(PRCompetitorBrandFullViewModel viewModel)
        {
            try
            {
                var bc = new PRCompetitorBrandBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                var predicate = @"(BrandNameEN = @BrandNameEN OR BrandNameFA = @BrandNameFA) 
                                  AND Id <> @BrandId";

                var predicateParameters = new
                {
                    BrandId = viewModel.Id,
                    BrandNameEN = viewModel.BrandNameEN,
                    BrandNameFA = viewModel.BrandNameFA
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Competitor Brand");

                var list = (IEnumerable<PRCompetitorBrandResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"The desired brand EN/FA name is used in defining the '{ex.BrandNameEN}'/'{ex.BrandNameFA}' competitor brand.");
                }

                return base.UpdatePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(UpdatePrecondition),
                    nameof(PRCompetitorBrandBr),
                    $"Exception in {nameof(UpdatePrecondition)} of {nameof(PRCompetitorBrandBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        public override SysResult DeletePrecondition(PRCompetitorBrandKeyViewModel viewModel)
        {
            try
            {
                // فعلا FK ندارد → فقط پایه‌ای
                return base.DeletePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(DeletePrecondition),
                    nameof(PRCompetitorBrandBr),
                    $"Exception in {nameof(DeletePrecondition)} of {nameof(PRCompetitorBrandBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }
        //********************************************************************************************************************
    }
}
