namespace Marina.Services.ApplicationCore.DomainModels.StrategyEvaluationModels;

[Table("SE_Unit",Schema = "ZJM")]
public class SEUnitModel
{
    /// <summary>
    /// شناسه
    /// </summary>
    [Key]
    [DisplayName("شناسه")]
    [IgnoreColumn]
    public int Id { get; set; } = 0;

    /// <summary>
    /// شناسه واحد
    /// </summary>
    [Required]
    [DisplayName("شناسه واحد")]
    public required int UnitId { get; set; }

    /// <summary>
    /// عنوان انگلیسی ویژن
    /// </summary>
    [Required]
    [DisplayName("شناسه کاربری")]
    public required int UserId { get; set; }

    /// <summary>
    /// وضعیت
    /// </summary>
    [Required]
    [DisplayName("وضعیت")]
    public required bool Status { get; set; }
}