using Marina.Services.ApplicationCore.DomainModels.AttachedFile;
using Marina.ViewModels.AttachedFileViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.AttachedFile;

public class AFAttachedFileBm : BusinessMapper<AFAttachedFileModel, AFAttachedFileViewModel>
{
    private readonly Serilog.ILogger _logger;
    private IDbConnection? _dbConnection;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public AFAttachedFileBm(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        _logger = logger;
        _dbConnection = dbConnection;
        _currentCompanyId = currentCompanyId;
        _currentUserId = currentUserId;
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModel(AFAttachedFileViewModel viewModel)
    {
        try
        {
            var model = new AFAttachedFileModel
            {
                FileId = Guid.NewGuid(),
                DocumentId = viewModel.DocumentId,
                FileSubject = viewModel.FileSubject,
                FileName = viewModel.FileName,
                FileType = viewModel.FileType,
                FileContent = viewModel.FileContent,
                SystemId = viewModel.SystemtId,
                ProccessStatus = viewModel.ProccessStatus,
                Description = viewModel.Description,
                //CreatedDate
                CreatorUserId= int.Parse(_currentUserId.Split(",")[0])
            };

            return Result.Success(Messages.ModelMappedSuccess, model);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
    /// <summary>
    /// تبدیل ویومدل آبجکت به مدل متناظر
    /// </summary>
    /// <param name="viewModel">ویومدل</param>
    /// <returns></returns>
    public override SysResult ToModels(IEnumerable<AFAttachedFileViewModel> viewModel)
    {
        try
        {
            var models = viewModel.Select(item => new AFAttachedFileModel
            {
                FileId = new Guid(),
                DocumentId = item.DocumentId,
                FileSubject = item.FileSubject,
                FileName = item.FileName,
                FileType = item.FileType,
                FileContent = item.FileContent,
                SystemId = item.SystemtId,
                ProccessStatus = item.ProccessStatus,
                Description = item.Description,
                //CreatedDate
                CreatorUserId = int.Parse(_currentUserId)
            }).ToList();

            return Result.Success(Messages.ModelMappedSuccess, models);
        }
        catch (Exception e)
        {
            return Result.ErrorOfException(e);
        }
    }
    //********************************************************************************************************************
}