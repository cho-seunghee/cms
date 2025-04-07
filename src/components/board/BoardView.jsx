import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Board.module.css';

const BoardView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const notice = state?.notice || { title: '제목 없음', content: '내용 없음', date: new Date().toLocaleDateString() };
  const isAdmin = state?.isAdmin || false;
  
  const handleEdit = () => {
    navigate('/board/write', { state: { notice } });
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      console.log(`삭제: ${notice.id}`);
      // 실제로는 API 호출로 삭제
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className={`text-primary text-dark fs-5 mb-4 ${styles.boardTitle} ${styles.boardTitleLine}`}>공지사항 상세</h2>
      <div className="mb-3">
        <label htmlFor="noticeDate" className="form-label">
          작성일
        </label>
        <input
          id="noticeDate"
          className="form-control"
          value={notice.date}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label htmlFor="noticeTitle" className="form-label">
          제목
        </label>
        <input
          id="noticeTitle"
          className="form-control"
          value={notice.title}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label htmlFor="noticeContent" className="form-label">
          내용
        </label>
        <textarea
          id="noticeContent"
          className="form-control"
          rows="5"
          value={notice.content}
          readOnly
        />
      </div>
      <div className="mt-3">
        <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
          뒤로 가기
        </button>
        {isAdmin && (
          <>
            <button className={`btn ${styles.btnMod} me-2`} onClick={handleEdit}>
              변경
            </button>
            <button className={`btn ${styles.btnDel}`} onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardView;