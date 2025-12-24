function load() {
  showLoading();

  // Query params
  let requestCostId = $("#lblCostRequestID").text().trim();
  let params = {
    Where: `CostRequestId = ${requestCostId}`,
  };

  readCostRequest(
    params,
    function (list) {
      if (Array.isArray(list) && list.length > 0) {
        list.forEach(function (row) {
          $("#txtRequestTitle").val(row.CostReuqestTitle);
          $("#txtCostRequestNo").val(row.CostRequestNo);

          // Change size
          $("#tblCostRequestDetails").css({
            //  left: "1189px"
          });
        });

        let params = {
          Where: `RequestCostId = ${requestCostId}`,
        };
        readCostRequestDetail(
          params,
          function (list) {
            if (Array.isArray(list) && list.length > 0) {
              // Sort by ProjectStartDate
              list.sort(function (a, b) {
                let aParts = a.CostDate.split("/");
                let bParts = b.CostDate.split("/");

                let aNum = parseInt(
                  aParts[2] +
                    aParts[0].padStart(2, "0") +
                    aParts[1].padStart(2, "0")
                );
                let bNum = parseInt(
                  bParts[2] +
                    bParts[0].padStart(2, "0") +
                    bParts[1].padStart(2, "0")
                );

                return aNum - bNum;
              });
              if (list.length < 20) {
                let baseList = [...list];

                while (list.length < 20) {
                  baseList.forEach(function (item) {
                    if (list.length < 20) {
                      let cloned = Object.assign({}, item);
                      cloned.__mock = true; // فقط برای دیباگ
                      list.push(cloned);
                    }
                  });
                }
              }
              list.forEach(function (row, index) {
                // Delete the "No data recorded" row if it exists
                element.find("tr.no-data-row").remove();

                // Add row of table
                addRow(row, index);
              });

              // Pagination the table
              pagination(element, rowNumber);

              // Close loading
              closeLoading();
            } else {
              addNoDataRow(element);
              console.warn("No data received.");
            }
          },
          function (error) {
            closeLoading();
            alert(error || "خطایی رخ داده است");
          }
        );
      } else {
        $.alert("شماره درخواست یافت نشد.", "توجه", "rtl");
      }
    },
    function (error) {
      closeLoading();
      alert(error || "خطایی رخ داده است");
    }
  );
}
