using Marina.ViewModels.AttachedFileViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.AttachedFile;

public class AFAttachedFileBl : BusinessLogic<AFAttachedFileKeyViewModel,
                                            AFAttachedFileViewModel,
                                            AFAttachedFileFullViewModel,
                                            AFAttachedFileResultViewModel,
                                            AFAttachedFileBc,
                                            AFAttachedFileBr,
                                            AFAttachedFileBm>
{
    private readonly Serilog.ILogger _logger;

    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public AFAttachedFileBl(Serilog.ILogger logger, byte currentCompanyId, string currentUserId)
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
                                        nameof(AFAttachedFileBl),
                                        $"Exception in constructor of {nameof(AFAttachedFileBl)} Class");

            var message = $"Exception in constructor of {nameof(AFAttachedFileBl)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
}