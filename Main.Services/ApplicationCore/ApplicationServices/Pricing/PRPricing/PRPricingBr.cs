using System.Data;
using Marina.ViewModels.PricingViewModels;
using Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing;

namespace Marina.Services.ApplicationCore.ApplicationServices.Pricing.PRPricing
{
    public class PRPricingBr : BusinessRule<
                                            PRPricingKeyViewModel,
                                            PRPricingViewModel,
                                            PRPricingFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;

        public PRPricingBr(
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
        /// <summary>
        /// بررسی شرایط قبل از افزودن رکورد قیمت‌گذاری
        /// </summary>
        public override SysResult AddPrecondition(PRPricingViewModel viewModel)
        {
            try
            {
                var bc = new PRPricingBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                // جلوگیری از ثبت قیمت گذاری با شماره تکراری
                var predicate = @"PricingNo = @PricingNo";

                var predicateParameters = new
                {
                    PricingNo = viewModel.PricingNo
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding pricing records");

                var list = (IEnumerable<PRPricingResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"Pricing number '{ex.PricingNo}' is already used.");
                }

                return base.AddPrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(AddPrecondition),
                    nameof(PRPricingBr),
                    $"Exception in {nameof(AddPrecondition)} of {nameof(PRPricingBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        /// <summary>
        /// بررسی شرایط قبل از بروزرسانی رکورد قیمت‌گذاری
        /// </summary>
        public override SysResult UpdatePrecondition(PRPricingFullViewModel viewModel)
        {
            try
            {
                var bc = new PRPricingBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);

                var predicate = @"PricingNo = @PricingNo AND Id <> @PricingId";

                var predicateParameters = new
                {
                    PricingId = viewModel.Id,
                    PricingNo = viewModel.PricingNo
                };

                var result = bc.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding pricing records");

                var list = (IEnumerable<PRPricingResultViewModel>)result.Value;

                if (list.Any())
                {
                    var ex = list.First();
                    return Result.Error(@$"Pricing number '{ex.PricingNo}' is already used.");
                }

                return base.UpdatePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(UpdatePrecondition),
                    nameof(PRPricingBr),
                    $"Exception in {nameof(UpdatePrecondition)} of {nameof(PRPricingBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        /// <summary>
        /// بررسی شرایط قبل از حذف رکورد قیمت‌گذاری
        /// </summary>
        public override SysResult DeletePrecondition(PRPricingKeyViewModel viewModel)
        {
            try
            {
                // فعلاً وابستگی خارجی ندارد
                return base.DeletePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(
                    GeneralEnums.LogType.Error,
                    nameof(DeletePrecondition),
                    nameof(PRPricingBr),
                    $"Exception in {nameof(DeletePrecondition)} of {nameof(PRPricingBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }
        //********************************************************************************************************************
    }
}
