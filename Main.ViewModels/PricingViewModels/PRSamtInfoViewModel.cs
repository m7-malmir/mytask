namespace Marina.ViewModels.PricingViewModels;

//********************************************************************************************************************
[Serializable]
/// <summary>
/// this viewmodel used for Delete & Find
/// </summary>
public class PRSamtInfoKeyViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد مورد نظر می‌باشد")]
    public required int Id { get; set; }
}

//********************************************************************************************************************
[Serializable]
/// <summary>
/// Base for Insert & Update shared fields
/// </summary>
public abstract class PRSamtInfoBaseViewModel
{
    [DisplayName("شماره گروه")]
    [Description("شماره گروه برای دسته‌بندی سمت")]
    public int? SamtGroupNo { get; set; }

    [MaxLength(500, ErrorMessage = "تعداد کاراکتر مجاز {0} می‌باشد")]
    [DisplayName("نام گروه سمت")]
    [Description("عنوان گروه سمت")]
    public string? SamtGroupName { get; set; }

    [DisplayName("درصد")]
    [Description("درصد مربوط به گروه سمت")]
    public int? SamtGroupPercent { get; set; }

    [DisplayName("تاریخ ایجاد")]
    [Description("تاریخ ثبت رکورد")]
    public DateTime? CreatedDate { get; set; }

    [DisplayName("شناسه کاربر ایجاد کننده")]
    [Description("شناسه کاربری که این رکورد را ایجاد کرده است")]
    public int? UserCreator { get; set; }
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Insert
/// </summary>
[Serializable]
public class PRSamtInfoViewModel : PRSamtInfoBaseViewModel
{
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Update
/// </summary>
[Serializable]
public class PRSamtInfoFullViewModel : PRSamtInfoBaseViewModel
{
    [Required(ErrorMessage = "شناسه الزامی است")]
    [DisplayName("شناسه")]
    [Description("شناسه یکتا برای رکورد مورد نظر می‌باشد")]
    public required int Id { get; set; }
}

//********************************************************************************************************************
/// <summary>
/// this viewmodel used for Returning data to clients
/// </summary>
[Serializable]
public class PRSamtInfoResultViewModel : PRSamtInfoFullViewModel
{
}
