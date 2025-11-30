using Marina.Services.ApplicationCore.DomainModels.AttachedFile;
using Marina.Services.Infrastructure.Data.Repositories.AttachedFile;
using Marina.ViewModels.AttachedFileViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.AttachedFile;

public class AFAttachedFileBc : BusinessCore<AFAttachedFileKeyViewModel, AFAttachedFileViewModel, AFAttachedFileFullViewModel, AFAttachedFileBm, AFAttachedFileModel, AFAttachedFileRepository, AFAttachedFileResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly AFAttachedFileRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    private readonly IDbConnection? _dbConnection;
    //********************************************************************************************************************
    public AFAttachedFileBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;
            _dbConnection = dbConnection;

            _repository = new AFAttachedFileRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(AFAttachedFileBc),
                                        $"Exception in constructor of {nameof(AFAttachedFileBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(AFAttachedFileBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public override SysResult Add(AFAttachedFileViewModel viewModel)
    {
        try
        {
            //--------------------------------------
            //  Call Method Of Mapper
            //--------------------------------------
            var businessMapper = new AFAttachedFileBm(_logger, _currentCompanyId, _currentUserId, _dbConnection);
            var toModelResult= businessMapper.ToModel(viewModel);

            if (!toModelResult.Successed)
                return toModelResult;

            var model=(AFAttachedFileModel)toModelResult.Value;
            //--------------------------------------


            //--------------------------------------
            //  Call Method Of Repository
            //--------------------------------------
            var result= _repository.Add(model);
            result.Value = model.FileId;

            return result;
            //--------------------------------------
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(Add),
                                       "BusinessCore",
                                       $"Exception in Add(TViewModel viewModel) Method of BusinessCore Class",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
    public override SysResult Find(DataRequestConfig<AFAttachedFileKeyViewModel> dataRequestConfig)
    {
        var viewModel = dataRequestConfig.ViewModel;
        StringBuilder query = new();
        query.Append($@" SELECT  
                Office.AttachedFile.FileId, 
                Office.AttachedFile.DocumentID, 
                Office.AttachedFile.FileSubject, 
                Office.AttachedFile.FileName, 
                Office.AttachedFile.FileType, 
                Office.AttachedFile.FileContent
            FROM Office.AttachedFile
            Where
                FileId = '{viewModel.FileId}'
        ");

        return _repository.SelectByQuery(query.ToString());
    }
    //********************************************************************************************************************

    public override SysResult Delete(AFAttachedFileKeyViewModel viewModel)
    {
        var predicate = @"FileId = @FileId";

        var predicateParameters = new
        {
            viewModel.FileId
        };

        var result = _repository.Delete(predicate, predicateParameters);

        return result;
    }
    //********************************************************************************************************************
}