using Marina.Services.Infrastructure.Data.Repositories.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREmployeeBirthday;

public class HREmployeeBirthdayBl : BusinessLogicBase<HREmployeeBirthdayKeyViewModel, 
                                                    HREmployeeBirthdayViewModel, 
                                                    HREmployeeBirthdayFullViewModel,
                                                    HREmployeeBirthdayResultViewModel, 
                                                    HREmployeeBirthdayRepository>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HREmployeeBirthdayBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
        : base(logger, currentCompanyId, currentUserId)
    {
        _logger = logger;

        try
        {
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HREmployeeBirthdayBl),
                                        $"Exception in constructor of {nameof(HREmployeeBirthdayBl)} Class");

            var message = $"Exception in constructor of {nameof(HREmployeeBirthdayBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll(DataRequestConfigBase config)
    {
        var businessCore = new HREmployeeBirthdayBc(_logger, _currentCompanyId, _currentUserId, null);
        return businessCore.GetAll();
    }
    //********************************************************************************************************************
}