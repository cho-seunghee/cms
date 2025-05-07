import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { fetchData } from "../../utils/dataUtils";
import common from "../../utils/common";
import useStore from '../../store/store';
import { hasPermission } from '../../utils/authUtils';
import ErrorMsgPopup from "../../components/popup/ErrorMsgPopup";

const PermissionManager = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [newPerm, setNewPerm] = useState({ userid: "", menucd: "", menunm: "", menuaccess: "read" });
  const [filterType, setFilterType] = useState("userid");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const itemsPerPage = 5;
  const maxPageButtons = 10;

  useEffect(() => {
    if (!user || !hasPermission(user.auth, 'permissions')) {
      navigate('/');
    } else if (Object.keys(user).length > 0) {
      fetchPermissions();
    }
  }, [user]);

  const fetchPermissions = async () => {
    const filters = filterValue ? { [filterType]: filterValue } : {};
    const response = await fetchData(axios, `${common.getServerUrl("permissions/list")}`, filters, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });

    if (response && response.ERRCD === "01") {
      setErrorMessage(response.ERRMSG || "An error occurred while fetching permissions.");
      setShowErrorPopup(true);
      setPermissions([]);
      setCurrentPage(1);
      return;
    }

    setErrorMessage("");
    setShowErrorPopup(false);
    setPermissions(response || []);
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    await fetchData(axios, `${common.getServerUrl("permissions/create")}`, newPerm, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    setNewPerm({ userid: "", menucd: "", menunm: "", menuaccess: "read" });
    fetchPermissions();
  };

  const handleUpdate = async (id, updatedPerm) => {
    await fetchData(
      axios,
      `${common.getServerUrl("permissions/update")}/${id}`,
      { id, ...updatedPerm },
      {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }
    );
    fetchPermissions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const response = await fetchData(
        axios,
        `${common.getServerUrl("permissions/delete")}/${id}`,
        { id },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      if (response.message === "Permission not found") {
        console.log("Already deleted or not found");
      }
      fetchPermissions();
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const totalPages = Math.ceil(permissions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPermissions = permissions.slice(indexOfFirstItem, indexOfLastItem);

  const halfMaxButtons = Math.floor(maxPageButtons / 2);
  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-dark fs-5 mb-4" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", borderBottom: "1px solid #e9e9e9" }}>
        Permission Manager
      </h2>

      <ErrorMsgPopup show={showErrorPopup} onHide={handleCloseErrorPopup} message={errorMessage} />

      <div className="card p-4 mb-4" style={{ borderRadius: "6px", border: "1px solid #dee2e6" }}>
        <h5 className="mb-3">조회 조건</h5>
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="userid">User ID</option>
              <option value="menucd">Menu Code</option>
              <option value="menunm">Menu Name</option>
            </select>
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${filterType === "userid" ? "User ID" : filterType === "menucd" ? "Menu Code" : "Menu Name"}`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ backgroundColor: "#547574", borderColor: "#547574", color: "#fff" }}
              onClick={fetchPermissions}
            >
              조회
            </button>
          </div>
        </div>
      </div>

      {user && hasPermission(user.auth, 'permissions') && (
        <div className="card p-4 mb-4" style={{ borderRadius: "6px", border: "1px solid #dee2e6" }}>
          <div className="row g-3">
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                value={newPerm.userid}
                onChange={(e) => setNewPerm({ ...newPerm, userid: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Menu Code"
                value={newPerm.menucd}
                onChange={(e) => setNewPerm({ ...newPerm, menucd: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Menu Name"
                value={newPerm.menunm}
                onChange={(e) => setNewPerm({ ...newPerm, menunm: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={newPerm.menuaccess}
                onChange={(e) => setNewPerm({ ...newPerm, menuaccess: e.target.value })}
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn w-100"
                style={{ backgroundColor: "#547574", borderColor: "#547574", color: "#fff" }}
                onClick={handleCreate}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ borderRadius: "6px", border: "1px solid #dee2e6" }}>
        <table className="table table-bordered table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">User ID</th>
              <th className="text-center">Menu Code</th>
              <th className="text-center">Menu Name</th>
              <th className="text-center">Access</th>
              {user && hasPermission(user.auth, 'permissions') && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentPermissions.map((perm) => (
              <tr key={perm.id}>
                <td className="text-center">{perm.id}</td>
                <td className="text-center">{perm.userid}</td>
                <td className="text-center">{perm.menucd}</td>
                <td>{perm.menunm}</td>
                <td className="text-center">{perm.menuaccess}</td>
                {user && hasPermission(user.auth, 'permissions') && (
                  <td className="text-center">
                    <button
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: "#62673a", borderColor: "#62673a", color: "#fff" }}
                      onClick={() => handleUpdate(perm.id, { ...perm, menuaccess: perm.menuaccess === "read" ? "write" : "read" })}
                    >
                      Toggle
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "rgb(228, 50, 50)", borderColor: "rgb(228, 50, 50)", color: "#fff" }}
                      onClick={() => handleDelete(perm.id)}
                    >
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-3">
          <ul className="pagination justify-content-center" style={{ "--bs-pagination-font-size": "0.7rem" }}>
            {totalPages > maxPageButtons && (
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  style={{ borderRadius: "20px" }}
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  &lt;&lt;
                </button>
              </li>
            )}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                style={{ borderRadius: "20px" }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
            </li>
            {pageNumbers.map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <button
                  className="page-link"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: currentPage === page ? "#0eaba7" : "#f9f9f9",
                    color: currentPage === page ? "#f9f9f9" : "#000",
                  }}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                style={{ borderRadius: "20px" }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </li>
            {totalPages > maxPageButtons && (
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  style={{ borderRadius: "20px" }}
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &gt;&gt;
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default PermissionManager;