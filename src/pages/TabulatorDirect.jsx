import React, { useState, useEffect, useRef } from "react";
import apiClient from "../services/apiClient";
import { fetchData } from "../utils/dataUtils";
import { createTable } from "../utils/tableConfig";
import { initialFilters, handleReset } from "../utils/tableEvent";
import { handleDownloadExcel } from "../utils/tableExcel"; // 새로 생성한 함수 임포트
import MainSearch from "../components/MainSearch";
import TableSearch from "../components/TableSearch";
import styles from "./TabulatorDirect.module.css";
import "tabulator-tables/dist/css/tabulator.min.css";

const TabulatorDirect = () => {
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

  const [filters, setFilters] = useState(initialFilters(filterFields));
  const [tableFilters, setTableFilters] = useState(initialFilters(filterTableFields));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [tableStatus, setTableStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const isInitialRender = useRef(true);
  const dataUrl = "/data.json";

  const cols = [
    { title: "ID", field: "id", width: 80 },
    { title: "이름", field: "name", width: 150 },
    { title: "나이", field: "age", sorter: "number" },
    { title: "상태", field: "status" },
  ];

  const loadData = async () => {
    setLoading(true);
    setIsSearched(true);
    setError(null);

    try {
      const jsonData = await fetchData(apiClient, dataUrl, filters);
      setData(jsonData || []);
    } catch (err) {
      setData([]);
      setError("데이터 로드 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tableRef.current) {
      console.error("tableRef.current is not initialized");
      setError("테이블 컨테이너가 준비되지 않았습니다.");
      return;
    }

    try {
      tableInstance.current = createTable(tableRef.current, cols, []);
      if (!tableInstance.current) {
        throw new Error("createTable returned undefined or null");
      }
      console.log("Table initialized:", tableInstance.current);
      setTableStatus("ready");
    } catch (err) {
      console.error("Error creating table:", err);
      setTableStatus("error");
      setError("테이블 초기화 실패: " + err.message);
    }

    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
        tableInstance.current = null;
        setTableStatus("initializing");
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!tableInstance.current || tableStatus !== "ready" || loading) {
      return;
    }

    tableInstance.current.setData(data);

    if (data.length === 0 && !loading) {
      const message = isSearched ? "검색 결과 없음" : "데이터 없음";
      tableInstance.current.alert(message, "info");
    } else {
      tableInstance.current.clearAlert();
    }
  }, [data, loading]);

  useEffect(() => {
    if (isInitialRender.current || !tableInstance.current || tableStatus !== "ready" || loading) {
      return;
    }

    const { filterSelect, filterText } = tableFilters;
    if (filterText && filterSelect) {
      tableInstance.current.setFilter(filterSelect, "like", filterText);
    } else if (filterText) {
      if (filterText !== "") {
        tableInstance.current.setFilter(
          [
            { field: "name", type: "like", value: filterText },
            { field: "age", type: "like", value: filterText },
            { field: "status", type: "like", value: filterText },
          ],
          "or"
        );
      } else {
        tableInstance.current.clearFilter();
      }
    } else if (filterSelect) {
      tableInstance.current.clearFilter();
    }
  }, [tableFilters.filterSelect, tableFilters.filterText, tableStatus, loading]);

  const handleResetFilters = () =>
    handleReset(setFilters, initialFilters(filterFields), [
      () => setData([]),
      () => setIsSearched(false),
      () => setError(null),
      () => {
        if (tableInstance.current && tableStatus === "ready") {
          tableInstance.current.clearAlert();
        }
      },
    ]);

  return (
    <div className={styles.container}>
      <MainSearch
        filterFields={filterFields}
        filters={filters}
        setFilters={setFilters}
        onSearch={loadData}
        onReset={handleResetFilters}
      />
      <TableSearch
        filterFields={filterTableFields}
        filters={tableFilters}
        setFilters={setTableFilters}
        onDownloadExcel={() => handleDownloadExcel(tableInstance.current, tableStatus, "테스트.xlsx")}
      />
      <div className={styles.tableWrapper}>
        {tableStatus === "initializing" && <div>초기화 중...</div>}
        {loading && <div>로딩 중...</div>}
        {error && <div>{error}</div>}
        <div
          ref={tableRef}
          className={styles.tableSection}
          style={{
            visibility: loading || tableStatus !== "ready" ? "hidden" : "visible",
          }}
        />
      </div>
    </div>
  );
};

export default TabulatorDirect;