var cmsGrid;
var cmsGridId = 'cmsGrid';
var cmsRowCountClass = 'searchrowcount';
var cmsColumns;
var cmsTabulator = {};
var cmsExcelHeaders = {};
var cmsExcelFileNm;
var cmsExcelSizeYN = "N";

cmsTabulator.getUrl = function (url, method) {
    var rtnUrl = '';

    if (url.indexOf('.aspx') >= 0) rtnUrl = url.replace(/#/gi, "") + '/' + method;
    else rtnUrl = url.replace(/#/gi, "") + '.aspx/' + method;

    return rtnUrl;
}

cmsTabulator.gridDefault = function (id, layout, movableColumns, pagination) {
    cmsGrid = new Tabulator('#' + id, {
        height: "50vh",
        layout: layout, //fitColumns, fitData, fitDataTable(fitColumns은 컬럼이 적을 경우, fitData는 컬럼이 많을 경우 또는 Frozen컬럼이 있을 경우)
        tooltips: true,
        tooltipsHeader: true,
        placeholder: "No Data Set",
        columnHeaderVertAlign: "middle",
        columns: cmsColumns,
        movableColumns: movableColumns, //true, false (헤더 이동)
        pagination: pagination, //remote, local, null (페이징구분)
        paginationSize: 50,
        paginationButtonCount: 10,
        paginationSizeSelector: [50, 100, 200, 300],

        downloadReady: function (fileContents, blob) {
            if (cmsExcelSizeYN == "Y") {
                /* XLSX content */
                var jsonContent = JSON.parse(fileContents);
                var ws = XLSX.utils.book_new();

                //Starting in the second row to avoid overriding and skipping headers
                jsonContent.unshift(cmsExcelHeaders);

                var filename = 'Data';
                var dataSheet = XLSX.utils.json_to_sheet(jsonContent, { skipHeader: true });

                XLSX.utils.book_append_sheet(ws, dataSheet, filename.replace('/', ''));
                XLSX.writeFile(ws, cmsExcelFileNm + ".xlsx", { bookSST: true, compression: true, bookType: 'xlsx' });

                return null;
            }
            else {
                return blob;
            }
        }
    });
}

ktsTabulator.getDataBind = function (param, url, id, bAsync) {
    if (id != undefined) {
        ktsGridId = id;
    }

    if (bAsync != undefined) {
        bAsync = true;
    }

    $.ajax({
        type: 'post',
        url: url,
        data: param,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //processdata: true,
        //2024.06.11 다중 테이블을 위해 비동기 처리 구분
        async: bAsync,
        success: function (data) {
            var json = data.d;

            ajaxSuccess(json);
        },
        beforeSend: function () {
            $("#updateProgress").css('display', 'block');
        },
        complete: function () {
            $("#updateProgress").css('display', 'none');
        },
        error: function (request, status, error) {
            ajaxFail(request, status, error);
        }
    })
}


var ajaxFail = function (request, status, error) {
    var errmsg = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
    cmsGridAlert(errmsg, 5000);
}

var ajaxSuccess = function (json) {
    var errCd;
    var errMsg;
    var errRedirect;

    $.each(JSON.parse(json), function (idx, item) {
        if (item.SERVICE_ERROR_CD != undefined) errCd = item.SERVICE_ERROR_CD;
        if (item.SERVICE_ERROR_MSG != undefined) errMsg = item.SERVICE_ERROR_MSG;
        if (item.SERVICE_ERROR_REDIRECT != undefined) errRedirect = item.SERVICE_ERROR_REDIRECT;
        //console.log(item.SERVICE_ERROR_CD);
        return false;
    });

    if (errCd == '01') //일반오류
    {
        cmsGridAlert(errMsg);
    }
    else if (errCd == '02') //세션만료
    {
        cmsGridAlert(errMsg);
        location.href = errRedirect;
    }
    else //정상
    {
        cmsGrid.setData(json);
        cmsGridRowCount(cmsGrid.getDataCount());
        cmsGridSearch();
    }
}

var updateFilter = function (fieldEl, typeEl, valueEl) {
    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;
    var filter = filterVal;

    if (filterVal == '') {
        typeEl.selectedIndex = 0;
        valueEl.value = '';
        cmsGrid.clearFilter();
    }
    else {
        cmsGrid.setFilter(filter, typeVal, valueEl.value);
    }
}

var cmsGridRowCount = function (count) {
    var val = '';
    val += '(' + count + ' Rows)';
    $("." + cmsRowCountClass).text(val);
}

var cmsGridSearch = function () {
    $(".table-search").css('display', 'block');
}

var cmsGridAlert = function (msg, timeout) {
    var time = 3000;
    if (timeout != undefined) time = timeout;
    $("#" + cmsGridId).append('<div class="tabulator-alert"><div class="tabulator-alert-msg tabulator-alert-state-msg" role="alert">' + msg + '</div></div>');

    setTimeout(function () {
        $(".tabulator-alert").remove();
    }, time);
}

var cmsGridPopup = function (msg, top, left, timeout) {
    var time = 3000;
    if (timeout != undefined) {
        time = timeout;
    }

    $(".tabulator-popup").remove();
    $("#" + cmsGridId).append('<div class="tabulator-popup tabulator-popup-container" style="top: ' + top + 'px; left: ' + left + 'px;">' + msg + '</div>');

    setTimeout(function () {
        $(".tabulator-popup").remove();
    }, time);
}

