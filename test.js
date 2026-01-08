
{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "pageSize": 10,
  "pageIndex": 0,
  "clientApiKey": "",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "id",
      "direction": "Desc"
    }
  ],
  "filterConditions": [],
  "customFilters": {
        "UnitsId": "35",
        "UsedInPlanningId": "9",
  }
}
{
  "currentCompanyId": 1,
  "currentUserId": "1,1,1",
  "pageSize": 10,
  "pageIndex": 0,
  "clientApiKey": "",
  "serviceMethodName": "",
  "sortOrder": [
    {
      "column": "Id",
      "direction": "Desc"
    }
  ],
  "filterConditions": [
  ],
  "customFilters": {
        "UnitIdList": "35",
        "UsedInPlanningId": "9"
  }
}
const requestParams = { ...defaultParams, ...jsonParams };

console.group(" readObjectiveStrategicKPI CALL");
console.log("jsonParams:", JSON.stringify(jsonParams));
console.log("requestParams:", JSON.stringify(requestParams));
console.log("CustomFilters:", requestParams.CustomFilters);
console.groupEnd();


console.group(" LOAD()");
console.log("UnitId:", UnitId, typeof UnitId);
console.log("PlanningId:", PlanningId, typeof PlanningId);
console.trace("LOAD TRACE");
console.groupEnd();


KPICode:""id:4
lowerControlLimit:5
objectiveCode:1
objectiveId:3
objectiveTitleEN:"1"
reportersId:""
strategicKPIId:8
strategicKPINameEN:"TTM \nTime To Market"
threshold:2
unitsId:"34,35"
unitsName:"بازاريابي - برند"
upperControlLimit:3
usedInPlanningId:0
verificationSource:"RA"


