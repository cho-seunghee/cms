import React, { useState, useEffect, useRef } from "react";
import MainSearch from "../main/MainSearch";
import { createTable } from '../../utils/tableConfig';
import { errorMsgPopup } from '../../utils/errorMsgPopup';
import styled from 'styled-components';
import styles from "./OrgSearchPopup.module.css";
import useStore from '../../store/store';
import { fetchJsonData } from '../../utils/dataUtils';
import { convertOrgInfoToHierarchy } from '../../utils/hierarchyJsonUtils';
import orgInfo from '../../data/orgInfo.json';

const TableWrapper = styled.div`
  .tabulator-header .tabulator-col {
    min-height: 20px;
    line-height: 12px;
  }

  .tabulator-row {
    line-height: 12px;
  }
`;

const getMonthOptions = () => {
  const currentMonth = new Date().toISOString().slice(0, 7).replace('-', '');
  return [{ value: currentMonth, label: currentMonth, disabled: true }];
};

const OrgSearchPopup = ({ onClose, onConfirm }) => {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const [filters, setFilters] = useState({ searchField: "ORG", mdate: new Date().toISOString().slice(0, 7).replace('-', ''), searchText: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableStatus, setTableStatus] = useState("initializing");
  const [hasSearched, setHasSearched] = useState(false);

  const searchConfig = {
    areas: [
      { type: "search", fields: [
        { id: "mdate", type: "select", row: 1, label: "월", labelVisible: true, options: getMonthOptions(), width: "100px", height: "30px", backgroundColor: "#ffffff", color: "#000000", enabled: true },
      ]},
      { type: "buttons", fields: [
        { id: "searchBtn", type: "button", row: 1, label: "검색", eventType: "search", width: "80px", height: "30px", backgroundColor: "#00c4b4", color: "#ffffff", enabled: true },
      ]},
    ],
  };

  useEffect(() => {
    setIsOpen(true);
    const initializeTable = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!tableRef.current) {
        console.warn("테이블 컨테이너가 준비되지 않았습니다.");
        return;
      }
      try {
        tableInstance.current = createTable(tableRef.current, [
        { headerHozAlign: "center", hozAlign: "left", title: "조직명", field: "ORGNM", sorter: "string", width: 200, frozen: true, responsive:0},
        { 
          frozen: true, 
          headerHozAlign: "center", 
          hozAlign: "center", 
          title: "작업", 
          field: "select", 
          width: 80, 
          formatter: (cell) => {
            const rowData = cell.getRow().getData();
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";
            div.style.gap = "5px";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = rowData.select === "Y";
            checkbox.onclick = (e) => {
              e.stopPropagation();
              const updates = tableInstance.current.getData().map((row) => ({
                seq: row.seq,
                select: row.seq === rowData.seq ? (row.select === "Y" ? "N" : "Y") : "N",
              }));
              try {
                tableInstance.current.updateData(updates).catch((err) => {
                  console.error("updateData failed:", err, updates);
                });
              } catch (err) {
                console.error("updateData error:", err, updates);
              }
            };
            const span = document.createElement("span");
            span.innerText = "선택";
            span.style.cursor = "pointer";
            span.onclick = (e) => {
              e.stopPropagation();
              const updates = tableInstance.current.getData().map((row) => ({
                seq: row.seq,
                select: row.seq === rowData.seq ? (row.select === "Y" ? "N" : "Y") : "N",
              }));
              try {
                tableInstance.current.updateData(updates).catch((err) => {
                  console.error("updateData failed:", err, updates);
                });
              } catch (err) {
                console.error("updateData error:", err, updates);
              }
            };
            div.appendChild(checkbox);
            div.appendChild(span);
            return div;
          }
        },
        { headerHozAlign: "center", hozAlign: "center", title: "순번", field: "seq", sorter: "number", width: 60, editable: false, formatter: (cell) => { const rowData = cell.getRow().getData(); return rowData.seq || ''; } },
        { headerHozAlign: "center", hozAlign: "center", title: "조직코드", field: "ORGCD", sorter: "string", width: 100 },
        { headerHozAlign: "center", hozAlign: "center", title: "상위조직코드", field: "UPPERORGCD", sorter: "string", width: 120},
        { headerHozAlign: "center", hozAlign: "center", title: "조직레벨", field: "ORGLEVEL", sorter: "number", width: 80, responsive:4 },
        { headerHozAlign: "center", hozAlign: "center", title: "월", field: "MDATE", sorter: "string", width: 80, visible:false },
        { headerHozAlign: "center", hozAlign: "center", title: "사원번호", field: "EMPNO", sorter: "string", width: 100, visible:false },
        { headerHozAlign: "center", hozAlign: "center", title: "이름", field: "EMPNM", sorter: "string", width: 80, visible:false },
        { headerHozAlign: "center", hozAlign: "center", title: "소속조직코드", field: "OWN_ORGCD", sorter: "string", width: 120, visible:false },
        { headerHozAlign: "center", hozAlign: "left", title: "소속조직", field: "OWN_ORGNM", sorter: "string", width: 120, visible:false },
      ], [], { 
        height: '40vh', headerHozAlign: "center", headerFilter: true, layout: 'fitColumns', index: "seq",
        dataTree: true,
        dataTreeStartExpanded: true
      });
        if (!tableInstance.current) throw new Error("createTable returned undefined or null");

        tableInstance.current.on("rowClick", (e, row) => {
        const rowData = row.getData();
        const updates = tableInstance.current.getData().map((row) => ({
          seq: row.seq,
          select: row.seq === rowData.seq ? (row.select === "Y" ? "N" : "Y") : "N",
        }));
        try {
          tableInstance.current.updateData(updates).catch((err) => {
            console.error("updateData failed:", err, updates);
          });
        } catch (err) {
          console.error("updateData error:", err, updates);
        }
      });

        setTableStatus("ready");
      } catch (err) {
        setTableStatus("error");
        console.error("Table initialization failed:", err.message);
      }
    };
    initializeTable();
    return () => {
      if (tableInstance.current) {
        tableInstance.current.destroy();
        tableInstance.current = null;
        setTableStatus("initializing");
      }
    };
  }, []);

  useEffect(() => {
    if (tableInstance.current && tableStatus === "ready" && !loading) {
      tableInstance.current.setData(data);
      if (hasSearched && data.length === 0) {
        tableInstance.current.alert("검색 결과 없음", "info");
      } else {
        tableInstance.current.clearAlert();
      }
    }
  }, [data, tableStatus, loading, hasSearched]);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const params = {
        pGUBUN: filters.searchField || "",
        pMDATE: filters.mdate || "",
        pSEARCH: user?.empNo || "",
        pDEBUG: "F"
      };

      const hierarchicalData = convertOrgInfoToHierarchy(orgInfo);

      // First attempt: Filter by Mdate and EMPNO
      let filteredData = await fetchJsonData(hierarchicalData, {
        MDATE: params.pMDATE,
        EMPNO: params.pSEARCH
      });

      // If no results, fall back to filtering by Mdate only
      if (filteredData.length === 0) {
        filteredData = await fetchJsonData(hierarchicalData, {
          MDATE: params.pMDATE
        });
      }

      // Assign seq to all nodes, including children
      let seqCounter = 1;
      const assignSeq = (nodes) => {
        return nodes.map((item) => {
          const newItem = { ...item, seq: seqCounter++, select: "N" };
          if (item._children && Array.isArray(item._children)) {
            newItem._children = assignSeq(item._children);
          }
          return newItem;
        });
      };

      const dataWithSeq = assignSeq(filteredData);

      setData(dataWithSeq);
    } catch (err) {
      errorMsgPopup(err.message || "데이터를 가져오는 중 오류가 발생했습니다.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicEvent = (eventType) => {
    if (eventType === "search") handleSearch();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      const selectedData = data.find((row) => row.select === "Y") || null;
      onConfirm(selectedData ? [selectedData] : []);
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <div className={styles.header}>
          <h3>조직 검색</h3>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
        <div className={styles.searchSection}>
          <MainSearch config={searchConfig} filters={filters} setFilters={setFilters} onEvent={handleDynamicEvent} />
        </div>
        <TableWrapper>
          {tableStatus === "initializing" && <div className={styles.loading}>초기화 중...</div>}
          {loading && <div className={styles.loading}>로딩 중...</div>}
          <div
            ref={tableRef}
            className={styles.tableSection}
            style={{ visibility: loading || tableStatus !== "ready" ? "hidden" : "visible" }}
          />
        </TableWrapper>
        <div className={styles.buttonContainer}>
          <button className={`${styles.btn} ${styles.btnSecondary} btn btn-secondary`} onClick={handleClose}>
            닫기
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary} btn text-bg-success`} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgSearchPopup;