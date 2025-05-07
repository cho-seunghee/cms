import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { fetchData } from "../../utils/dataUtils";
import common from "../../utils/common";
import useStore from '../../store/store';
import { hasPermission } from '../../utils/authUtils';
import ErrorMsgPopup from "../../components/popup/ErrorMsgPopup";
import CommonPopup from "../../components/popup/CommonPopup";
import menuAuthData from '../../data/MenuAuthInfo.json';
import styles from './MenuAuthInfo.module.css';

const MenuAuthInfo = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [authFields, setAuthFields] = useState([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newMenu, setNewMenu] = useState({
    MENUNM: "",
    UPPERMENUID: "",
  });
  const [addedMenuIds, setAddedMenuIds] = useState(new Set());

  useEffect(() => {
    if (!user || !hasPermission(user.auth, 'menuAuth')) {
      navigate('/');
      return;
    }
    fetchMenuAuthData();
  }, [user, navigate]);

  const calculateMenuLevel = (row, data, visited = new Set()) => {
    if (!row.UPPERMENUID) return 1;
    if (visited.has(row.MENUID)) return 1;
    visited.add(row.MENUID);
    const parent = data.find(item => item.MENUID === row.UPPERMENUID);
    if (!parent) return 1;
    return calculateMenuLevel(parent, data, visited) + 1;
  };

  const fetchMenuAuthData = async () => {
    const params = { rptCd: "OPERAUTHGROUPMENU", param1: "F" };
    try {
      const response = await fetchData(
        axios,
        `${common.getServerUrl("mapview/oper/menuauthinfo/list")}`,
        params,
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );

      if (!response.success) {
        setErrorMessage(response.message || "메뉴 권한 데이터를 가져오는 중 오류가 발생했습니다.");
        setShowErrorPopup(true);
        const leveledFallbackData = menuAuthData.map(row => ({
          ...row,
          MENULEVEL: calculateMenuLevel(row, menuAuthData)
        }));
        setData(leveledFallbackData);
        setInitialData(leveledFallbackData);
        setAddedMenuIds(new Set());
        const fallbackAuthNames = menuAuthData.length > 0 && Array.isArray(menuAuthData[0].children)
          ? menuAuthData[0].children.map(child => child.AUTHNM)
          : [];
        setAuthFields(fallbackAuthNames);
        return;
      }

      const responseData = Array.isArray(response.data) ? response.data : menuAuthData;
      const authNames = responseData.length > 0 && Array.isArray(responseData[0].children)
        ? responseData[0].children.map(child => child.AUTHNM)
        : menuAuthData.length > 0 && Array.isArray(menuAuthData[0].children)
          ? menuAuthData[0].children.map(child => child.AUTHNM)
          : [];

      const leveledData = responseData.map(row => ({
        ...row,
        MENULEVEL: calculateMenuLevel(row, responseData)
      }));

      const isConsistent = responseData.every(row =>
        Array.isArray(row.children) &&
        row.children.map(child => child.AUTHNM).join(',') === authNames.join(',')
      );
      if (!isConsistent) {
        console.warn('Warning: Inconsistent AUTHNM order across menu items');
      }

      setErrorMessage("");
      setShowErrorPopup(false);
      setData(leveledData);
      setInitialData(leveledData);
      setAddedMenuIds(new Set());
      setAuthFields(authNames);
    } catch (error) {
      console.error("메뉴 권한 데이터 조회 실패:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response received'
      });
      setErrorMessage(error.response?.data?.message || "메뉴 권한 데이터를 가져오는 중 오류가 발생했습니다.");
      setShowErrorPopup(true);
      const leveledFallbackData = menuAuthData.map(row => ({
        ...row,
        MENULEVEL: calculateMenuLevel(row, menuAuthData)
      }));
      setData(leveledFallbackData);
      setInitialData(leveledFallbackData);
      setAddedMenuIds(new Set());
      const fallbackAuthNames = menuAuthData.length > 0 && Array.isArray(menuAuthData[0].children)
        ? menuAuthData[0].children.map(child => child.AUTHNM)
        : [];
      setAuthFields(fallbackAuthNames);
    }
  };

  const formatMenuName = (menuName, level) => {
    if (level === 1) return menuName;
    return `${"  ".repeat(level - 2)}└${menuName}`;
  };

  const getAuthYn = (menu, authName) => {
    const auth = menu.children.find(child => child.AUTHNM === authName);
    return auth ? auth.AUTHYN : "N";
  };

  const updateAuthYn = (menu, authName, value) => {
    return {
      ...menu,
      children: menu.children.map(child =>
        child.AUTHNM === authName ? { ...child, AUTHYN: value } : child
      )
    };
  };

  const handleRadioChange = (menuId, authName, value) => {
    setData(
      data.map((row) =>
        row.MENUID === menuId ? updateAuthYn(row, authName, value) : row
      )
    );
  };

  const handleSelectAll = (authName, checked) => {
    setData(
      data.map((row) => updateAuthYn(row, authName, checked ? "Y" : "N"))
    );
  };

  const handleReset = () => {
    fetchMenuAuthData();
  };

  const handleAddClick = () => {
    setNewMenu({
      MENUNM: "",
      UPPERMENUID: "",
    });
    setShowAddPopup(true);
  };

  const handleAddConfirm = () => {
    if (!newMenu.MENUNM.trim()) {
      return { error: "메뉴 이름을 입력해주세요." };
    }

    const newMenuId = `MENU${String(data.length + 1).padStart(4, '0')}`;
    const newRow = {
      MENUID: newMenuId,
      MENUNM: newMenu.MENUNM,
      MENULEVEL: newMenu.UPPERMENUID
        ? calculateMenuLevel({ UPPERMENUID: newMenu.UPPERMENUID, MENUID: newMenuId }, data)
        : 1,
      UPPERMENUID: newMenu.UPPERMENUID,
      MENUORDER: data.length + 1,
      children: authFields.map((authName, index) => ({
        AUTHID: `AUTH${String(index + 1).padStart(4, '0')}`,
        AUTHNM: authName,
        AUTHYN: "N",
        children: []
      }))
    };

    let updatedData = [...data];
    if (newMenu.UPPERMENUID) {
      const parentIndex = data.findIndex(row => row.MENUID === newMenu.UPPERMENUID);
      if (parentIndex !== -1) {
        updatedData.splice(parentIndex + 1, 0, newRow);
      } else {
        updatedData.push(newRow);
      }
    } else {
      updatedData.push(newRow);
    }

    setData(updatedData);
    setAddedMenuIds(new Set([...addedMenuIds, newMenuId]));
    setShowAddPopup(false);
    setNewMenu({ MENUNM: "", UPPERMENUID: "" });
  };

  const handleAddCancel = () => {
    setShowAddPopup(false);
    setNewMenu({ MENUNM: "", UPPERMENUID: "" });
  };

  const handleDelete = (menuId) => {
    if (!addedMenuIds.has(menuId)) return;
    setData(data.filter(row => row.MENUID !== menuId));
    setAddedMenuIds(new Set([...addedMenuIds].filter(id => id !== menuId)));
  };

  const handleSave = async () => {
    const changedData = data.filter((row) => {
      const initialRow = initialData.find(r => r.MENUID === row.MENUID);
      if (!initialRow) return true;
      return JSON.stringify(row) !== JSON.stringify(initialRow);
    });

    if (changedData.length === 0) {
      alert("변경된 데이터가 없습니다.");
      return;
    }

    console.log(changedData);

    try {
      await fetchData(
        axios,
        `${common.getServerUrl("mapview/oper/menuauthinfo/save")}`,
        { data: changedData },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      setInitialData([...data]);
      setAddedMenuIds(new Set());
      alert("저장되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      setErrorMessage("저장 중 오류가 발생했습니다.");
      setShowErrorPopup(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="container mt-4">
      <h1 className={`mb-4 ${styles.heading}`}>메뉴 권한</h1>

      <ErrorMsgPopup show={showErrorPopup} onHide={handleCloseErrorPopup} message={errorMessage} />

      <div className="btn-group-custom d-flex justify-content-end gap-2 mb-3">
        <button className="btn btn-outline-primary" onClick={handleReset}>초기화</button>
        <button className="btn btn-outline-primary" onClick={handleAddClick}>추가</button>
        <button className="btn btn-outline-primary" onClick={handleSave}>저장</button>
      </div>

      <CommonPopup
        show={showAddPopup}
        onHide={handleAddCancel}
        onConfirm={handleAddConfirm}
        title="새 메뉴 추가"
      >
        <div className="mb-3">
          <label htmlFor="menuName" className="form-label">메뉴 이름</label>
          <input
            type="text"
            className="form-control"
            id="menuName"
            value={newMenu.MENUNM}
            onChange={(e) => setNewMenu({ ...newMenu, MENUNM: e.target.value })}
            placeholder="메뉴 이름을 입력하세요"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="upperMenuId" className="form-label">상위 메뉴</label>
          <select
            className="form-select"
            id="upperMenuId"
            value={newMenu.UPPERMENUID}
            onChange={(e) => setNewMenu({ ...newMenu, UPPERMENUID: e.target.value })}
          >
            <option value="">없음 (1레벨)</option>
            {data.map((row) => (
              <option key={row.MENUID} value={row.MENUID}>
                {formatMenuName(row.MENUNM, row.MENULEVEL)}
              </option>
            ))}
          </select>
        </div>
      </CommonPopup>

      <div className={`table-responsive ${styles.tableResponsive}`}>
        <table className={`table table-bordered ${styles.table}`}>
          <thead className={styles.stickyTop}>
            <tr>
              <th className={`${styles.textCenter} ${styles.stickyColumn}`}>목차관리</th>
              {authFields.map((authName) => (
                <th key={authName} className={styles.textCenter}>
                  {authName}
                  <div className="form-check d-flex justify-content-center mt-1">
                    <input
                      type="checkbox"
                      className={styles.formCheckInput}
                      onChange={(e) => handleSelectAll(authName, e.target.checked)}
                      checked={Array.isArray(data) && data.length > 0 && data.every((row) => getAuthYn(row, authName) === "Y")}
                      disabled={!Array.isArray(data) || data.length === 0}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row) => (
                <tr key={row.MENUID}>
                  <td className={`${styles.textLeft} ${styles.stickyColumn} ${addedMenuIds.has(row.MENUID) ? styles.addedRow : ''}`}>
                    <div className={styles.menuContainer}>
                      <span>{formatMenuName(row.MENUNM, row.MENULEVEL)}</span>
                      {addedMenuIds.has(row.MENUID) && (
                        <button
                          className={`btn btn-sm btn-danger ${styles.deleteButton}`}
                          onClick={() => handleDelete(row.MENUID)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </td>
                  {authFields.map((authName) => (
                    <td
                      key={authName}
                      className={`${styles.textCenter} ${addedMenuIds.has(row.MENUID) ? styles.addedRow : ''}`}
                    >
                      <div className="d-flex justify-content-center gap-2">
                        <div className={`form-check form-check-inline ${styles.formCheckInline}`}>
                          <input
                            type="radio"
                            className={styles.formCheckInput}
                            name={`${authName}-${row.MENUID}`}
                            value="Y"
                            checked={getAuthYn(row, authName) === "Y"}
                            onChange={() => handleRadioChange(row.MENUID, authName, "Y")}
                          />
                          <label className="form-check-label">Y</label>
                        </div>
                        <div className={`form-check form-check-inline ${styles.formCheckInline}`}>
                          <input
                            type="radio"
                            className={styles.formCheckInput}
                            name={`${authName}-${row.MENUID}`}
                            value="N"
                            checked={getAuthYn(row, authName) === "N"}
                            onChange={() => handleRadioChange(row.MENUID, authName, "N")}
                          />
                          <label className="form-check-label">N</label>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={authFields.length + 1} className={styles.textCenter}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuAuthInfo;