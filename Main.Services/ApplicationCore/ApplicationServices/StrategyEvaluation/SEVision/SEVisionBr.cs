using Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEFocusArea;
using Marina.ViewModels.StrategyEvaluationViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.StrategyEvaluation.SEVision
{
    public class SEVisionBr : BusinessRule<SEVisionKeyViewModel,
                                            SEVisionViewModel,
                                            SEVisionFullViewModel>
    {
        private readonly Serilog.ILogger _logger;
        private IDbConnection? _dbConnection;
        private readonly byte _currentCompanyId;
        private readonly string _currentUserId;
        public SEVisionBr(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection) : base(logger, currentCompanyId, currentUserId, dbConnection)
        {
            _logger = logger;
            _dbConnection = dbConnection;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

        }
        //********************************************************************************************************************
        public override SysResult AddPrecondition(SEVisionViewModel viewModel)
        {
            #region VisionTitleEN
            var sEVisionBc = new SEVisionBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicate = "VisionTitleEN = @VisionTitleEN or VisionTitleFA = @VisionTitleFA";
            var predicateParameters = new
            {
                VisionTitleEN = viewModel.VisionTitleEN,
                VisionTitleFA = viewModel.VisionTitleFA
            };

            var result = sEVisionBc.Select(predicate, predicateParameters);

            if (!result.Successed)
            {
                return result;
            }

            if (!result.Successed) return result;

            if (result.Value == null) return Result.Error("Error on finding Vision");

            var vIsionResultViewModels = (IEnumerable<SEVisionResultViewModel>)result.Value;

            if (vIsionResultViewModels.Any())
            {
                return Result.Error(@$"The desired vision EN/FA name is used in defining the '{vIsionResultViewModels.First().VisionTitleEN}'/'{vIsionResultViewModels.First().VisionTitleFA}' Vision");
            }
            #endregion

            return base.AddPrecondition(viewModel);
        }
        //********************************************************************************************************************
        public override SysResult UpdatePrecondition(SEVisionFullViewModel viewModel)
        {
            #region VisionTitleEN
            var sEVisionBc = new SEVisionBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicate = "VisionTitleEN = @VisionTitleEN and Id <> @VisionId";
            var predicateParameters = new
            {
                VisionId = viewModel.Id,
                VisionTitleEN = viewModel.VisionTitleEN
            };

            var result = sEVisionBc.Select(predicate, predicateParameters);

            if (!result.Successed)
            {
                return result;
            }

            if (!result.Successed) return result;

            if (result.Value == null) return Result.Error("Error on finding Vision");

            var vIsionResultViewModels = (IEnumerable<SEVisionResultViewModel>)result.Value;

            if (vIsionResultViewModels.Any())
            {
                return Result.Error(@$"The desired vision is used in defining the '{vIsionResultViewModels.First().VisionTitleEN}' Vision");
            }
            #endregion

            #region VisionTitleFA
            var sEVisionBcFA = new SEVisionBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicateFA = "VisionTitleFA = @VisionTitleFA and Id <> @VisionId";
            var predicateParametersFA = new
            {
                VisionId = viewModel.Id,
                VisionTitleFA = viewModel.VisionTitleFA
            };

            var resultFA = sEVisionBc.Select(predicateFA, predicateParametersFA);

            if (!resultFA.Successed)
            {
                return resultFA;
            }

            if (!resultFA.Successed) return resultFA;

            if (resultFA.Value == null) return Result.Error("Error on finding Vision");

            var vIsionResultViewModelsFA = (IEnumerable<SEVisionResultViewModel>)result.Value;

            if (vIsionResultViewModelsFA.Any())
            {
                return Result.Error(@$"The desired vision is used in defining the '{vIsionResultViewModelsFA.First().VisionTitleFA}' Vision");
            }
            #endregion
            return base.UpdatePrecondition(viewModel);
        }
        //********************************************************************************************************************
        public override SysResult DeletePrecondition(SEVisionKeyViewModel viewModel)
        {
            var bc = new SEFocusAreaBc(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var predicate = "VisionId = @VisionId";
            var predicateParameters = new
            {
                VisionId = viewModel.Id
            };

            var result = bc.Select(predicate, predicateParameters);

            if (!result.Successed)
            {
                return result;
            }

            if (result.Value == null) return Result.Error("Error on finding Vision");

            var focusAreaResultViewModels = (IEnumerable<SEFocusAreaResultViewModel>)result.Value;

            if (focusAreaResultViewModels.Any())
            {
                return Result.Error(@$"The desired vision is used in defining the '{focusAreaResultViewModels.First().FocusAreaCode}' focus area");
            }

            return base.DeletePrecondition(viewModel);
        }
        //********************************************************************************************************************
    }
}