namespace Marina.Services.ApplicationCore.DomainModels.Distribution.DSBaranheModels;

public class DistributionOrderModel
{
    public long PlateNo { get; set; }
    public int SenderStreetId { get; set; }
    public string SenderName { get; set; }
    public string SenderNationalCode { get; set; }
    public int WeightId { get; set; }
    public int PackingId { get; set; }
    public int PackageCount { get; set; }
    public int SenderRegionId { get; set; }
    public int SenderPeronalityId { get; set; }
    public int StartTimeId { get; set; }
    public int EndTimeId { get; set; }
    public string DriverNationalCode { get; set; }
    public int GoodTypeId { get; set; }
    public string SenderMobile { get; set; }
    public string SenderPhone { get; set; }
    public string SenderAddress { get; set; }
    public string SenderPostalCode { get; set; }
    public double SenderLocationLat { get; set; }
    public double SenderLocationLong { get; set; }
    public string DriverPhoneNumber { get; set; }
    public string RequestedByUserName { get; set; }
    public string RequestedByMobileNumber { get; set; }
    public int WeighbridgeTrackingCode { get; set; }
    public List<DistributionOrderReciverModel> DistributionOrderRecivers { get; set; }
}
