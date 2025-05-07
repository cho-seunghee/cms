import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from '../../utils/dataUtils';
import api from '../../utils/api';
import styles from "./Board.module.css";

const Board = ({ canWriteBoard }) => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const maxPageButtons = 10;

  const fetchNotices = useCallback(async () => {
    try {
      const result = await fetchData(api, '/api/notice/list');
      setNotices(result);
      setError(null);
    } catch (e) {
      console.error('Failed to fetch notices:', e);
      try {
        const fallback = await import('../../data/notice.json');
        setNotices(fallback.default || []);
        //setError('Using fallback data due to API unavailability');
      } catch (fallbackError) {
        console.log(fallbackError);
        setNotices([]);
      }
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleNoticeClick = useCallback((notice) => {
    navigate("/main/boardView", { state: { notice } });
  }, [navigate]);

  const handleDelete = useCallback(async (notice) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await fetchData(api, '/api/notice/delete', { id: notice.id });
        setNotices((prev) => prev.filter((n) => n.id !== notice.id));
        navigate('/main');
      } catch (error) {
        console.error('삭제 실패:', error);
        navigate('/main');
      }
    }
  }, [navigate]);

  const totalPages = Math.ceil((notices?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = notices.slice(indexOfFirstItem, indexOfLastItem);

  const halfMaxButtons = Math.floor(maxPageButtons / 2);
  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  return (
    <div className="h-100 p-3 border" style={{ width: "100%" }}>
      {error && <div className="alert alert-warning">{error}</div>}
      <div className="list-group-item d-flex justify-content-between align-items-center">
        <h3 className={`mb-3 fs-5 text-dark ${styles.boardTitle}`}>공지사항</h3>
        {canWriteBoard && (
          <button className={`btn btn-primary mb-3 ${styles.btnReg}`} onClick={() => navigate("/main/boardWrite")}>
            등록
          </button>
        )}
      </div>
      <ul className={`list-group list-group-flush ${styles.contentContainer}`}>
        {currentNotices.length > 0 ? (
          currentNotices.map((notice) => (
            <li key={notice.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span onClick={() => handleNoticeClick(notice)} style={{ cursor: "pointer" }}>
                <span>{notice.id}.</span>
                <span>{notice.title}</span>
              </span>
              <div>
                <span className={`badge bg-primary rounded-pill me-2 ${styles.contentDate}`}>
                  {notice.date || new Date().toLocaleDateString()}
                </span>
                {canWriteBoard && (
                  <>
                    <button
                      className={`btn btn-sm btn-warning me-2 ${styles.btnMod}`}
                      onClick={() => navigate("/main/boardWrite", { state: { notice } })}
                    >
                      변경
                    </button>
                    <button className={`btn btn-sm btn-danger ${styles.btnDel}`} onClick={() => handleDelete(notice)}>
                      삭제
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">공지사항이 없습니다.</li>
        )}
      </ul>

      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-3">
          <ul className={`pagination justify-content-center ${styles.pagination}`}>
            {totalPages > maxPageButtons && (
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className={`page-link ${styles.pageLink}`} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                  &lt;&lt;
                </button>
              </li>
            )}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className={`page-link ${styles.pageLink}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
            </li>
            {pageNumbers.map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <button className={`page-link ${styles.pageLink}`} onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className={`page-link ${styles.pageLink}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </li>
            {totalPages > maxPageButtons && (
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className={`page-link ${styles.pageLink}`} onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
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

export default Board;