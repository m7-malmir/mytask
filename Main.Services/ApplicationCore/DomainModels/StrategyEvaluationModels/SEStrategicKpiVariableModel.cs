namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_StrategicKPIVariable", Schema = "ZJM")]
public class SEStrategicKpiVariableModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; }

    /// <summary>
    /// نام فارسی
    /// </summary>
    [DisplayName("نام فارسی")]
    [MaxLength(150, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? VariableNameFA { get; set; }

    /// <summary>
    /// نام انگلیسی
    /// </summary>
    [DisplayName("نام انگلیسی")]
    [MaxLength(150, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? VariableNameEN { get; set; }

    /// <summary>
    /// واحد متریک
    /// </summary>
    [DisplayName("واحد متریک")]
    public int? VariableMetricUnitId { get; set; }

    /// <summary>
    /// نام محل جمع آوری اطلاعات
    /// </summary>
    [DisplayName("نام محل جمع آوری اطلاعات")]
    [MaxLength(250, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? DataPlacementName { get; set; }

    /// <summary>
    /// آدرس محل جمع آوری اطلاعات
    /// </summary>
    [DisplayName("آدرس محل جمع آوری اطلاعات")]
    [MaxLength(500, ErrorMessage = "تعداد مجاز کارکتر {0}")]
    public string? DataPlacementPath { get; set; }

    /// <summary>
    /// از نوع وب سرویس می باشد
    /// </summary>
    [DisplayName("از نوع وب سرویس می باشد")]
    public int? IsAPI { get; set; }
}