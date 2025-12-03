using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo;
using Marina.ViewModels.PricingViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRSamtInfo
{
    public class PRSamtInfoBr : BusinessRule<
                                    PRSamtInfoKeyViewModel,
                                    PRSamtInfoViewModel,
                                    PRSamtInfoFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private readonly IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;

        public PRSamtInfoBr(
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
        public override SysResult AddPrecondition(PRSamtInfoViewModel viewModel)
        {
            try
            {
                var bc = new PRSamtInfoBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                var predicate = @"SamtGroupNo = @SamtGroupNo OR SamtGroupName = @SamtGroupName";

                var predicateParameters = new
                {
                    SamtGroupNo = viewModel.SamtGroupNo,
                    SamtGroupName = viewModel.SamtGroupName
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding SamtInfo records");

                var list = (IEnumerable<PRSamtInfoResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"The desired SamtGroupNo/Name is already used in '{ex.SamtGroupNo}' / '{ex.SamtGroupName}'.");
                }

                return base.AddPrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(AddPrecondition),
                    nameof(PRSamtInfoBr),
                    $"Exception in {nameof(AddPrecondition)} of {nameof(PRSamtInfoBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        public override SysResult UpdatePrecondition(PRSamtInfoFullViewModel viewModel)
        {
            try
            {
                var bc = new PRSamtInfoBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                var predicate = @"(SamtGroupNo = @SamtGroupNo OR SamtGroupName = @SamtGroupName)
                                  AND Id <> @Id";

                var predicateParameters = new
                {
                    Id = viewModel.Id,
                    SamtGroupNo = viewModel.SamtGroupNo,
                    SamtGroupName = viewModel.SamtGroupName
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding SamtInfo records");

                var list = (IEnumerable<PRSamtInfoResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"The desired SamtGroupNo/Name is already used in '{ex.SamtGroupNo}' / '{ex.SamtGroupName}'.");
                }

                return base.UpdatePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(UpdatePrecondition),
                    nameof(PRSamtInfoBr),
                    $"Exception in {nameof(UpdatePrecondition)} of {nameof(PRSamtInfoBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        public override SysResult DeletePrecondition(PRSamtInfoKeyViewModel viewModel)
        {
            try
            {
                // فعلاً FK تعریف نشده → حذف ساده
                return base.DeletePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(DeletePrecondition),
                    nameof(PRSamtInfoBr),
                    $"Exception in {nameof(DeletePrecondition)} of {nameof(PRSamtInfoBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }
        //********************************************************************************************************************
    }
}
