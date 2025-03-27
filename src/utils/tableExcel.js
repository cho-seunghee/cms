import * as XLSX from "xlsx";

/**
 * Tabulator 테이블 데이터를 엑셀 파일로 다운로드하는 함수
 * @param {Object} tableInstance - Tabulator 테이블 인스턴스
 * @param {string} tableStatus - 테이블 상태 ("initializing", "ready", "error")
 * @param {string} [fileName="table_data.xlsx"] - 다운로드 파일 이름
 * @param {string} [sheetName="Sheet1"] - 엑셀 시트 이름
 */
export const handleDownloadExcel = (
  tableInstance,
  tableStatus,
  fileName = "table_data.xlsx",
  sheetName = "Sheet1"
) => {
  if (!tableInstance || tableStatus !== "ready") {
    console.error("Table instance not ready:", tableInstance, tableStatus);
    return;
  }

  try {
    const data = tableInstance.getData(); // Tabulator에서 데이터 가져오기
    if (!data || data.length === 0) {
      console.warn("No data available to download");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data); // 데이터를 워크시트로 변환
    const workbook = XLSX.utils.book_new(); // 새 워크북 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // 워크시트 추가
    XLSX.writeFile(workbook, fileName); // 엑셀 파일 다운로드
  } catch (err) {
    console.error("Excel download failed:", err);
  }
};