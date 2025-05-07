import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../services/apiClient";
import { fetchDataGet } from "../../utils/dataUtils";
import { createTable } from "../../utils/tableConfig";
import { initialFilters, handleReset } from "../../utils/tableEvent";
import { handleDownloadExcel } from "../../utils/tableExcel"; // 엑셀 다운로드 함수 임포트
import MainSearch from "../../components/main/MainSearch";
import TableSearch from "../../components/table/TableSearch";
import styles from "./TabulatorDirect.module.css";
import common from "../../utils/common";
import "tabulator-tables/dist/css/tabulator.min.css";

const TabulatorDirect = () => {
  // 검색 필터 정의 (MainSearch용)
  const filterFields = [
    { id: "name", label: "이름", type: "text", placeholder: "이름 검색", width: "auto", height: "auto" },
    {
      id: "status",
      label: "상태",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "active", label: "활성" },
        { value: "inactive", label: "비활성" },
      ],
      width: "auto",
      height: "auto",
    },
  ];

  // 테이블 필터 정의 (TableSearch용)
  const filterTableFields = [
    {
      id: "filterSelect",
      label: "",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "name", label: "이름" },
        { value: "age", label: "나이" },
        { value: "status", label: "상태" },
      ],
      width: "auto",
      height: "auto",
    },
    {
      id: "filterText",
      label: "",
      type: "text",
      placeholder: "찾을 내용을 입력하세요",
      width: "auto",
      height: "auto",
    },
  ];

  // 상태 정의
  const [filters, setFilters] = useState(initialFilters(filterFields)); // MainSearch 필터 상태
  const [tableFilters, setTableFilters] = useState(initialFilters(filterTableFields)); // TableSearch 필터 상태
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const [data, setData] = useState([]); // 테이블 데이터
  const [isSearched, setIsSearched] = useState(false); // 검색 여부
  const [tableStatus, setTableStatus] = useState("initializing"); // 테이블 초기화 상태
  const [error, setError] = useState(null); // 에러 메시지
  const tableRef = useRef(null); // 테이블 DOM 참조
  const tableInstance = useRef(null); // Tabulator 인스턴스 참조
  const isInitialRender = useRef(true); // 초기 렌더링 플래그
  const dataUrl = `${common.getClientUrl("data.json")}`; // 데이터 요청 URL

  // 테이블 컬럼 정의
  const cols = [
    { title: "ID", field: "id", width: 80 },
    { title: "이름", field: "name", width: 150 },
    { title: "나이", field: "age", sorter: "number" },
    { title: "상태", field: "status" },
  ];

  // 데이터 로드 함수
  const loadData = async () => {
    setLoading(true); // 로딩 시작
    setIsSearched(true); // 검색 상태 활성화
    setError(null); // 에러 초기화

    try {
      const jsonData = await fetchDataGet(apiClient, dataUrl, filters); // 데이터 요청
      setData(jsonData || []); // 데이터 설정, 없으면 빈 배열
    } catch (err) {
      setData([]); // 에러 시 데이터 초기화
      setError("데이터 로드 실패: " + err.message); // 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 테이블 초기화 useEffect
  useEffect(() => {
    if (!tableRef.current) {
      setError("테이블 컨테이너가 준비되지 않았습니다.");
      return;
    }

    try {
      // 테이블 생성
      tableInstance.current = createTable(tableRef.current, cols, []);
      if (!tableInstance.current) {
        throw new Error("createTable returned undefined or null");
      }
      setTableStatus("ready"); // 테이블 상태를 "ready"로 설정
    } catch (err) {
      setTableStatus("error"); // 실패 시 "error" 상태
      setError("테이블 초기화 실패: " + err.message);
    }

    // 컴포넌트 언마운트 시 테이블 정리
    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy(); // 테이블 인스턴스 파괴
        tableInstance.current = null;
        setTableStatus("initializing"); // 상태 초기화
      }
    };
  }, []);

  // 데이터 업데이트 useEffect
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // 초기 렌더링 스킵
      return;
    }

    if (!tableInstance.current || tableStatus !== "ready" || loading) {
      return; // 테이블 준비 안 됐거나 로딩 중이면 중단
    }

    tableInstance.current.setData(data); // 테이블 데이터 설정

    // 데이터가 없으면 알림 표시
    if (data.length === 0 && !loading) {
      const message = isSearched ? "검색 결과 없음" : "데이터 없음";
      tableInstance.current.alert(message, "info");
    } else {
      tableInstance.current.clearAlert(); // 알림 제거
    }
  }, [data, loading]);

  // 필터 적용 useEffect
  useEffect(() => {
    if (isInitialRender.current || !tableInstance.current || tableStatus !== "ready" || loading) {
      return; // 초기 렌더링이거나 테이블 준비 안 됐으면 중단
    }

    const { filterSelect, filterText } = tableFilters;
    if (filterText && filterSelect) {
      // 선택된 필드에 대해 검색어로 필터링
      tableInstance.current.setFilter(filterSelect, "like", filterText);
    } else if (filterText) {
      if (filterText !== "") {
        // 전체 필드에서 검색어로 필터링 (OR 조건)
        tableInstance.current.setFilter(
          [
            { field: "name", type: "like", value: filterText },
            { field: "age", type: "like", value: filterText },
            { field: "status", type: "like", value: filterText },
          ],
          "or"
        );
      } else {
        tableInstance.current.clearFilter(); // 검색어 없으면 필터 초기화
      }
    } else if (filterSelect) {
      tableInstance.current.clearFilter(); // 선택만 있으면 필터 초기화
    }
  }, [tableFilters.filterSelect, tableFilters.filterText, tableStatus, loading]);

  // 필터 초기화 함수
  const handleResetFilters = () =>
    handleReset(setFilters, initialFilters(filterFields), [
      () => setData([]), // 데이터 초기화
      () => setIsSearched(false), // 검색 상태 초기화
      () => setError(null), // 에러 초기화
      () => {
        if (tableInstance.current && tableStatus === "ready") {
          tableInstance.current.clearAlert(); // 테이블 알림 제거
        }
      },
    ]);

  return (
    <div className={styles.container}>
      {/* MainSearch 컴포넌트: 데이터 검색 및 초기화 */}
      <MainSearch
        filterFields={filterFields}
        filters={filters}
        setFilters={setFilters}
        onSearch={loadData}
        onReset={handleResetFilters}
      />
      {/* TableSearch 컴포넌트: 테이블 필터링 및 엑셀 다운로드 */}
      <TableSearch
        filterFields={filterTableFields}
        filters={tableFilters}
        setFilters={setTableFilters}
        onDownloadExcel={() => handleDownloadExcel(tableInstance.current, tableStatus, "테스트.xlsx")}
      />
      {/* 테이블 래퍼: 상태 메시지 및 테이블 표시 */}
      <div className={styles.tableWrapper}>
        {tableStatus === "initializing" && <div>초기화 중...</div>}
        {loading && <div>로딩 중...</div>}
        {error && <div>{error}</div>}
        <div
          ref={tableRef}
          className={styles.tableSection}
          style={{
            visibility: loading || tableStatus !== "ready" ? "hidden" : "visible", // 로딩 중이거나 준비 안 됐으면 숨김
          }}
        />
      </div>
    </div>
  );
};

export default TabulatorDirect;