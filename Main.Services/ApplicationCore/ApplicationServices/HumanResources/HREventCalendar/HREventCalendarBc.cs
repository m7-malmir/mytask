using Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HRFoodMealPlan;
using Marina.Services.ApplicationCore.DomainModels.HumanResources;
using Marina.Services.Infrastructure.Data.Repositories.HumanResources;
using Marina.ViewModels.HumanResourceViewModels;

namespace Marina.Services.ApplicationCore.ApplicationServices.HumanResources.HREventCalendar;

public class HREventCalendarBc : BusinessCore<HREventCalendarKeyViewModel,
                                            HREventCalendarViewModel,
                                            HREventCalendarFullViewModel,
                                            HREventCalendarBm,
                                            HREventCalendarModel,
                                            HREventCalendarRepository,
                                            HREventCalendarResultViewModel>
{
    private readonly Serilog.ILogger _logger;
    private readonly HREventCalendarRepository _repository;
    private readonly byte _currentCompanyId;
    private readonly string _currentUserId;
    //********************************************************************************************************************
    public HREventCalendarBc(Serilog.ILogger logger, byte currentCompanyId, string currentUserId, IDbConnection? dbConnection)
        : base(logger, currentCompanyId, currentUserId, dbConnection)
    {
        try
        {
            _logger = logger;
            _currentCompanyId = currentCompanyId;
            _currentUserId = currentUserId;

            _repository = new HREventCalendarRepository(logger, dbConnection);
        }
        catch (Exception ex)
        {
            var logId = logger.LogCustom(GeneralEnums.LogType.Error,
                                        "Constructor",
                                        nameof(HREventCalendarBc),
                                        $"Exception in constructor of {nameof(HREventCalendarBc)} Class",
                                        ex);

            var message = $"Exception in constructor of {nameof(HREventCalendarBc)}.\n LogID: {logId}";

            throw new Exception(message, ex);
        }
    }
    //********************************************************************************************************************
    public  SysResult GetAllHREvents()
    {
        try
        {
            StringBuilder query = new();
            query.Append($@" 
                DECLARE @Today NVARCHAR(10) = CONVERT(NVARCHAR(10), GETDATE(), 111);
                DECLARE @TodayShamsi NVARCHAR(10) = dbo.Date_Miladi2Shamsi(@Today);

                SELECT Top 30
	                EventShamsiDate, 
	                EventTitleEN, 
	                EventTitleFA,
                    CAST(SUBSTRING(EventShamsiDate, 9, 2) AS INT) AS EventDayNumber,
                    CASE SUBSTRING(EventShamsiDate, 6, 2)
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
                    END AS EventDateShamsiMonthName,
                    CAST(SUBSTRING(EventShamsiDate, 9, 2) AS NVARCHAR(2)) + N' ' +
                    CASE SUBSTRING(EventShamsiDate, 6, 2)
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
                    END AS EventDateShamsiText
                FROM 
                    ZJM.HR_EventCalendar
                WHERE
                    (SUBSTRING(EventShamsiDate, 6, 2) = SUBSTRING(@TodayShamsi, 6, 2)
                    AND SUBSTRING(EventShamsiDate, 9, 2) >= SUBSTRING(@TodayShamsi, 9, 2)) 
                    OR SUBSTRING(EventShamsiDate, 6, 2) > SUBSTRING(@TodayShamsi, 6, 2)
                ORDER BY SUBSTRING(EventShamsiDate, 6, 5);
            ");

            return _repository.SelectByQuery(query.ToString());
        }
        catch (Exception ex)
        {
            var logId = _logger.LogCustom(GeneralEnums.LogType.Error,
                                       nameof(GetAllHREvents),
                                       nameof(HRFoodMealPlanBc),
                                       $"Exception in {nameof(GetAllHREvents)} Method of {nameof(HREventCalendarBc)}",
                                       ex);

            return Result.Error($"{Messages.CriticalError} {logId}");
        }
    }
    //********************************************************************************************************************
}