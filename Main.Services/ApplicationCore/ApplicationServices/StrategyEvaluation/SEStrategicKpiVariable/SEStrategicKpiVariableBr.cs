using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpiVariable
{
    public class SEStrategicKpiVariableBr: BusinessRule<SEStrategicKpiVariableKeyViewModel,
                                                        SEStrategicKpiVariableViewModel,
                                                        SEStrategicKpiVariableFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private readonly SEStrategicKpiVariableBc _businessCore;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;
        private readonly IDbConnection? _dbConnection;

        //************************************************************************************************************
        public SEStrategicKpiVariableBr(
            Serilog.ILogger logger,
            byte currentCompanyId,
            string currentUserId,
            IDbConnection? dbConnection)
            : base(logger, currentCompanyId, currentUserId, dbConnection)
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _dbConnection = dbConnection;

            _businessCore = new SEStrategicKpiVariableBc(logger, currentCompanyId, currentUserId, dbConnection);
        }

        //************************************************************************************************************
        /// <summary>
        /// بررسی پیش‌شرط‌های لازم برای درج رکورد جدید KPI Variable
        /// </summary>
        public override SysResult AddPrecondition(SEStrategicKpiVariableViewModel viewModel)
        {
            try
            {
                var predicate = @"
                    VariableNameEN = @VariableNameEN 
                    OR VariableNameFA = @VariableNameFA 
                    OR DataPlacementPath = @DataPlacementPath";

                var predicateParams = new
                {
                    viewModel.VariableNameEN,
                    viewModel.VariableNameFA,
                    viewModel.DataPlacementPath
                };

                var result = _businessCore.Select(predicate, predicateParams);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Strategic KPI Variable");

                var records = (IEnumerable<SEStrategicKpiVariableResultViewModel>)result.Value;

                if (records.Any())
                {
                    var exVar = records.First();
                    return Result.Error(@$"Duplicate KPI Variable with name '{exVar.VariableNameEN}/{exVar.VariableNameFA}' or path '{exVar.DataPlacementPath}' already exists.");
                }

                return base.AddPrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                    nameof(AddPrecondition),
                    nameof(SEStrategicKpiVariableBr),
                    $"Exception in {nameof(AddPrecondition)} of {nameof(SEStrategicKpiVariableBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //************************************************************************************************************
        /// <summary>
        /// بررسی پیش‌شرط‌های لازم برای بروزرسانی رکورد موجود KPI Variable
        /// </summary>
        public override SysResult UpdatePrecondition(SEStrategicKpiVariableFullViewModel viewModel)
        {
            try
            {
                var predicate = @"
                    (VariableNameEN = @VariableNameEN 
                    OR VariableNameFA = @VariableNameFA 
                    OR DataPlacementPath = @DataPlacementPath)
                    AND Id <> @Id";

                var predicateParams = new
                {
                    viewModel.Id,
                    viewModel.VariableNameEN,
                    viewModel.VariableNameFA,
                    viewModel.DataPlacementPath
                };

                var result = _businessCore.Select(predicate, predicateParams);

                if (!result.Successed)
                    return result;

                if (result.Value == null)
                    return Result.Error("Error on finding Strategic KPI Variable");

                var records = (IEnumerable<SEStrategicKpiVariableResultViewModel>)result.Value;

                if (records.Any())
                {
                    var exist = records.First();
                    return Result.Error(@$"A KPI Variable with name '{exist.VariableNameEN}/{exist.VariableNameFA}' or path '{exist.DataPlacementPath}' already exists.");
                }

                return base.UpdatePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                    nameof(UpdatePrecondition),
                    nameof(SEStrategicKpiVariableBr),
                    $"Exception in {nameof(UpdatePrecondition)} of {nameof(SEStrategicKpiVariableBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //************************************************************************************************************
        /// <summary>
        /// بررسی پیش‌شرط‌های لازم برای حذف رکورد KPI Variable
        /// </summary>
        public override SysResult DeletePrecondition(SEStrategicKpiVariableKeyViewModel viewModel)
        {
            try
            {
                // در آینده در صورتی که Variable در KPIها استفاده شود، بررسی وابستگی را اضافه کن.
                return base.DeletePrecondition(viewModel);
            }
            catch (Exception ex)
            {
                var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                    nameof(DeletePrecondition),
                    nameof(SEStrategicKpiVariableBr),
                    $"Exception in {nameof(DeletePrecondition)} of {nameof(SEStrategicKpiVariableBr)}",
                    ex);

                return Result.Error($"{Messages.CriticalError} {logId}");
            }
        }

        //************************************************************************************************************
    }
}
