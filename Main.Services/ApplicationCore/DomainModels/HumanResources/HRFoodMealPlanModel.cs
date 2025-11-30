namespace Marina.Services.ApplicationCore.DomainModels.HumanResources
{
    /// <summary>
    /// برنامه غذایی - مدل مربوط به برنامه‌های غذایی سازمان
    /// </summary>
    [Table("HR_FoodMealPlan", Schema = "ZJM")]
    public class HRFoodMealPlanModel
    {
        /// <summary>
        /// شناسه برنامه غذایی
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DisplayName("شناسه برنامه غذایی")]
        [Description("شناسه منحصر به فرد برنامه غذایی")]
        public int FoodMealPlanId { get; set; }

        /// <summary>
        /// شناسه غذا
        /// </summary>
        [Required(ErrorMessage = "شناسه غذا الزامی است")]
        [DisplayName("شناسه غذا")]
        [Description("شناسه غذایی که در این برنامه وجود دارد")]
        public int FoodId { get; set; }

        /// <summary>
        /// شناسه وعده غذایی
        /// </summary>
        [Required(ErrorMessage = "شناسه وعده غذایی الزامی است")]
        [DisplayName("شناسه وعده غذایی")]
        [Description("شناسه وعده غذایی (صبحانه، ناهار، شام)")]
        public int MealId { get; set; }

        /// <summary>
        /// شناسه تقویم
        /// </summary>
        [Required(ErrorMessage = "شناسه تقویم الزامی است")]
        [DisplayName("شناسه تقویم")]
        [Description("شناسه روزی که این برنامه غذایی برای آن تعریف شده است")]
        public int CalendarId { get; set; }
    }
}