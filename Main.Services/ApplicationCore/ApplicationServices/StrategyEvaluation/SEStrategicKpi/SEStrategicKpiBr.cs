using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpi
{
    public class SEStrategicKpiBr : BusinessRule<
                                        SEStrategicKpiKeyViewModel,
                                        SEStrategicKpiViewModel,
                                        SEStrategicKpiFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private readonly SEStrategicKpiBc _businessCore;
        private IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;

        //********************************************************************************************************************
        public SEStrategicKpiBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
            : base(logger, currentCompanyId, currentUserId, dbConnection)
        {
            _logger = logger;
            _dbConnection = dbConnection;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _businessCore = new SEStrategicKpiBc(logger, currentCompanyId, currentUserId, dbConnection);
        }

        //********************************************************************************************************************
        /// <summary>
        /// بررسی پیش‌شرط‌های لازم برای ادامه عملیات افزودن
        /// </summary>
        public override SysResult AddPrecondition(SEStrategicKpiViewModel viewModel)
        {
            try
            {
                var predicate = "StrategicKPINameEN = @StrategicKPINameEN OR StrategicKPINameFA = @StrategicKPINameFA OR KPICode = @KPICode";
                var predicateParameters = new
                {
                    viewModel.StrategicKPINameEN,
                    viewModel.StrategicKPINameFA,
                    viewModel.KPICode
                };

                var result = _businessCore.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Strategic KPI");

                var records = (IEnumerable<SEStrategicKpiResultViewModel>)result.Value;
                if (records.Any())
                {
                    var existing = records.First();
                    return Result.Error(@$"The KPI name/code already exists ('{existing.StrategicKPINameEN}' / '{existing.StrategicKPINameFA}' / '{existing.KPICode}')");
                }

                return base.AddPrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                nameof(AddPrecondition),
                                nameof(SEStrategicKpiBr),
                                $"Exception in {nameof(AddPrecondition)} of {nameof(SEStrategicKpiBr)}",
                                ex);
                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //********************************************************************************************************************
        /// <summary>
        /// بررسی پیش‌شرط‌های لازم برای ادامه عملیات بروزرسانی
        /// </summary>
        public override SysResult UpdatePrecondition(SEStrategicKpiFullViewModel viewModel)
        {
            try
            {
                var predicate = "(StrategicKPINameEN = @StrategicKPINameEN OR StrategicKPINameFA = @StrategicKPINameFA OR KPICode = @KPICode) AND Id <> @Id";
                var predicateParameters = new
                {
                    viewModel.Id,
                    viewModel.StrategicKPINameEN,
                    viewModel.StrategicKPINameFA,
                    viewModel.KPICode
                };

                var result = _businessCore.Select(predicate, predicateParameters);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Strategic KPI");

                var records = (IEnumerable<SEStrategicKpiResultViewModel>)result.Value;
                if (records.Any())
                {
                    var dup = records.First();
                    return Result.Error(@$"A KPI with name/code '{dup.StrategicKPINameEN}' / '{dup.StrategicKPINameFA}' / '{dup.KPICode}' already exists");
                }

                return base.UpdatePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                nameof(UpdatePrecondition),
                                nameof(SEStrategicKpiBr),
                                $"Exception in {nameof(UpdatePrecondition)} of {nameof(SEStrategicKpiBr)}",
                                ex);
                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }
        //********************************************************************************************************************
    }
}
