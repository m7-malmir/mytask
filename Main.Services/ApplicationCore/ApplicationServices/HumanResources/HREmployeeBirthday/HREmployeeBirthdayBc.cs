using Marina.Services.Infrastructure.Data.Repositories.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREmployeeBirthday;

public class HREmployeeBirthdayBc : BusinessCoreBase<HREmployeeBirthdayRepository, HREmployeeBirthdayViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly HREmployeeBirthdayRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HREmployeeBirthdayBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new HREmployeeBirthdayRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HREmployeeBirthdayBc),
                                        $"Exception in constructor of {nameof(HREmployeeBirthdayBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(HREmployeeBirthdayBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public SysResult GetAll()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                DECLARE @Today NVARCHAR(10) = CONVERT(NVARCHAR(10), GETDATE(), 111);
                DECLARE @TodayShamsi NVARCHAR(10) = dbo.Date_Miladi2Shamsi(@Today);

                SELECT Top 30
                    e.PersonnelNO,
                    e.FirstName,
                    e.LastName,
                    e.Gender,
                    e.CompanyId,
                    c.CompanyName,
                    c.CompanyLatinName,
                    e.Birthday,
                    CAST(SUBSTRING(e.Birthday, 9, 2) AS INT) AS BirthDayNumber,
                    CASE SUBSTRING(e.Birthday, 6, 2)
                        WHEN '01' THEN N'فروردین'
                        WHEN '02' THEN N'اردیبهشت'
                        WHEN '03' THEN N'خرداد'
                        WHEN '04' THEN N'تیر'
                        WHEN '05' THEN N'مرداد'
                        WHEN '06' THEN N'شهریور'
                        WHEN '07' THEN N'مهر'
                        WHEN '08' THEN N'آبان'
                        WHEN '09' THEN N'آذر'
                        WHEN '10' THEN N'دی'
                        WHEN '11' THEN N'بهمن'
                        WHEN '12' THEN N'اسفند'
                    END AS PersianMonthName,
                    CAST(SUBSTRING(e.Birthday, 9, 2) AS NVARCHAR(2)) + N' ' +
                    CASE SUBSTRING(e.Birthday, 6, 2)
                        WHEN '01' THEN N'فروردین'
                        WHEN '02' THEN N'اردیبهشت'
                        WHEN '03' THEN N'خرداد'
                        WHEN '04' THEN N'تیر'
                        WHEN '05' THEN N'مرداد'
                        WHEN '06' THEN N'شهریور'
                        WHEN '07' THEN N'مهر'
                        WHEN '08' THEN N'آبان'
                        WHEN '09' THEN N'آذر'
                        WHEN '10' THEN N'دی'
                        WHEN '11' THEN N'بهمن'
                        WHEN '12' THEN N'اسفند'
                    END AS PersianBirthText
                FROM 
                    ZJM.HR_Employee e
                    INNER JOIN ZJM.GT_Company c ON e.CompanyId = c.CompanyId
                WHERE
                    e.LeaveDateMiladi IS NULL
                    AND (SUBSTRING(e.Birthday, 6, 2) = SUBSTRING(@TodayShamsi, 6, 2)
                    AND SUBSTRING(e.Birthday, 9, 2) >= SUBSTRING(@TodayShamsi, 9, 2)) 
	                OR SUBSTRING(e.Birthday, 6, 2) > SUBSTRING(@TodayShamsi, 6, 2)
                ORDER BY SUBSTRING(e.Birthday, 6, 5);
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAll),
                                       nameof(HREmployeeBirthdayBc),
                                       $"Exception in {nameof(GetAll)} Method of {nameof(HREmployeeBirthdayBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}