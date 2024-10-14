<?php
require_once "";
$Code = @@Processid;
$ReferenceCode = @@Reference_NO;
$RequstPersonName_ = @@RequstPersonName;

if ($Code == $ReferenceCode)
{
$Query="
SELECT
  IFNULL(pprr.COMPANYID,36) AS CompanyId,
  pprg.UNIT AS Unit,
  CONCAT(pprr.APP_NUMBER, '-', pprg.ROW) AS InqueryNumber,
  IFNULL(pprr.WAREHOUSE_NAME_LABEL,pprr.STOCK_NAME_LABEL) AS StockName,
  pprr.REQ_NAME_PER_LABEL  AS RequstPersonName,
  pprg.REQUIRED_ITEMS AS Name,
  REPLACE(pprg.Confirmed_Number,',','') AS NUMBER,
  null AS Brand,
  pprg.TECHNICAL_SPECIFICATIONS AS DescriptionFani,
  pprg.DATE_REQUIRED AS RequiredDate,
  pprr.MANAGER_BUSINESS_DESC AS Descriptionkarshenas
FROM pmt_purchase_reques_report pprr
  INNER JOIN pmt_purchase_reques_grid pprg
    ON pprr.APP_UID = pprg.APP_UID
	AND LENGTH(LTRIM(RTRIM(pprg.REQUIRED_ITEMS))) > 0
    AND pprg.APP_NUMBER = ".$Code;	
}
else
{
$Query="
SELECT
  IFNULL(pprr.COMPANYID,36) AS CompanyId,
  pprg.Unit AS Unit,
  CONCAT(pprr.APP_NUMBER, '-', pprg.ROW) AS InqueryNumber,
  IFNULL(pprr.WAREHOUSE_NAME_LABEL,pprr.STOCK_NAME_LABEL) AS StockName,
  IFNULL((SELECT
      Q.RequstPersonName
    FROM (SELECT
        CONCAT(R.REQ_NAME_LABEL, R.REQ_POSITION_LABEL) AS RequstPersonName
      FROM pmt_request_product_from_warehouse AS R
      WHERE R.APP_NUMBER =  ".$ReferenceCode."
      UNION
      SELECT
        CONCAT(R.REQ_NAME_LABEL) AS RequstPersonName
      FROM pmt_request_parts_for_branches_and_projects_report_table AS R
      WHERE R.APP_NUMBER = ".$ReferenceCode."
      ) AS Q
    LIMIT 1),pprr.REQ_NAME_PER) AS RequstPersonName,
  pprg.REQUIRED_ITEMS AS Name,
  REPLACE(pprg.CONFIRMED_NUMBER, ',', '') AS NUMBER,
  NULL AS Brand,
  pprg.TECHNICAL_SPECIFICATIONS AS DescriptionFani,
  pprg.DATE_REQUIRED AS RequiredDate,
  pprr.MANAGER_BUSINESS_DESC AS Descriptionkarshenas
FROM pmt_purchase_reques_report pprr
  INNER JOIN pmt_purchase_reques_grid pprg
    ON pprr.APP_UID = pprg.APP_UID
    AND LENGTH(LTRIM(RTRIM(pprg.REQUIRED_ITEMS))) > 0
    AND pprg.APP_NUMBER = ".$Code;
}

	 //echo var_dump($Query);
     //die();

$QueryResult = executeQuery($Query);


if (COUNT($QueryResult) > 0) {
	
	$data = array();
	for ($i = 1; $i <= COUNT($QueryResult); $i++) {
		
		$field = array(
        "CompanyId" => (int)$QueryResult[$i]['CompanyId'],
        "Unit" => (int)$QueryResult[$i]['Unit'],
        "InqueryNumber" => $QueryResult[$i]['InqueryNumber'],
		"Storehouse" => $QueryResult[$i]['StockName'],
		"Petitioner" => $QueryResult[$i]['RequstPersonName'],
        "Name" => $QueryResult[$i]['Name'],
        "Number" => (int)$QueryResult[$i]['NUMBER'],
        "Brand" => $QueryResult[$i]['Brand'],
        "DescriptionFani" => $QueryResult[$i]['DescriptionFani'],
		"RequiredDate" => $QueryResult[$i]['RequiredDate'],
		"Descriptionkarshenas" => $QueryResult[$i]['Descriptionkarshenas']
    );
		
		$data[] = $field;				
}
	
	$json = json_encode($data);
	
	 echo var_dump($json);
    die();
		
	$header = array(
        "Authorization: Bearer access-token",
        'Content-Type: application/json',
        'Content-Length: ' . strlen($json)
    );

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => 'http://5.160.71.146:1985/api/faragostar',
        CURLOPT_HTTPHEADER => $header,
        CURLOPT_POSTFIELDS => $json ,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => 'UTF-8',
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
			
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36(KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    ]);
    
    $cl = curl_exec($ch);
    $result = json_decode(curl_exec($ch), true);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

	$rslt =array_values($result);

	
	
	@@Response = $result["success"];
	@@status = $statusCode;
	
	@@repeat = $rslt[2];
	
    if (@@Response == true && @@repeat == true ){	
	  @@isSent = 1;
	}
	

	echo '<pre>';
	var_export($rslt[2]);
	echo '<pre>';

  /*
	  echo '<pre>';
	  var_export($rslt[1][0]);
	  echo '<pre>';
    die();	
  */

}
