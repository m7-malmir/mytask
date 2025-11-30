using Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpi;
using Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEStrategicKpiVariable;
using Marina.ViewModels.GeneralTableViewModels;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.GeneralTable.GTMetricUnit
{
    public class GTMetricUnitBr : BusinessRule<GTMetricUnitKeyViewModel,
                                            GTMetricUnitViewModel,
                                            GTMetricUnitFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;
        //********************************************************************************************************************
        public GTMetricUnitBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) : base(logger, currentCompanyId, currentUserId, dbConnection)
        {
            _logger = logger;
            _dbConnection = dbConnection;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
        }
        //********************************************************************************************************************
        public override SysResult DeletePrecondition(GTMetricUnitKeyViewModel viewModel)
        {
            #region Check Strategic KPI
            var sEStrategicKpiBc = new SEStrategicKpiBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicate = "KPIMetricUnitId = @MetricUnitId";
            var predicateParameters = new
            {
                MetricUnitId = viewModel.Id
            };

            var sEStrategicKpiresult = sEStrategicKpiBc.Select(predicate, predicateParameters);

            if (!sEStrategicKpiresult.Successed)
            {
                return sEStrategicKpiresult;
            }

            if (!sEStrategicKpiresult.Successed) return sEStrategicKpiresult;

            if (sEStrategicKpiresult.Value == null) return Result.Error("Error on finding Startegic KPI");

            var SEStrategicKpiViewModels = (IEnumerable<SEStrategicKpiResultViewModel>)sEStrategicKpiresult.Value;

            if (SEStrategicKpiViewModels.Any())
            {
                return Result.Error(@$"The desired Unit is used in defining the '{SEStrategicKpiViewModels.First().KPICode}' Strategic KPIs");
            }
            #endregion

            #region Check Strategic KPI Variables
            var sEStrategicKpiVariableBc = new SEStrategicKpiVariableBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicate2 = "VariableMetricUnitId = @MetricUnitId";
            var predicateParameters2 = new
            {
                MetricUnitId = viewModel.Id
            };

            var sEStrategicKpiVariableresult = sEStrategicKpiVariableBc.Select(predicate2, predicateParameters2);

            if (!sEStrategicKpiVariableresult.Successed)
            {
                return sEStrategicKpiVariableresult;
            }

            if (!sEStrategicKpiVariableresult.Successed) return sEStrategicKpiVariableresult;

            if (sEStrategicKpiVariableresult.Value == null) return Result.Error("Error on finding Startegic KPI Variable");

            var SEStrategicKpiVariableViewModels = (IEnumerable<SEStrategicKpiVariableResultViewModel>)sEStrategicKpiVariableresult.Value;

            if (SEStrategicKpiVariableViewModels.Any())
            {
                return Result.Error(@$"The desired unit is used in defining the '{SEStrategicKpiVariableViewModels.First().DataPlacementName}' Strategic KPIs Variable");
            }
            #endregion



            return base.DeletePrecondition(viewModel);

        }
        //********************************************************************************************************************

    }
}