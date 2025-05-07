import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../../utils/dataUtils';
import api from '../../utils/api';
import styles from './Board.module.css';

const BoardView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const notice = state?.notice;

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await fetchData(api, '/api/notice/delete', { id: notice.id });
      } catch (error) {
        console.error('삭제 실패:', error);
      }
      navigate('/main'); // 변경: '/main/board' -> '/main'
    }
  };

  return (
    <div className="container mt-5">
      <h2 className={`text-primary text-dark fs-5 mb-4 ${styles.boardTitle}`}>공지사항 상세</h2>
      <div className="mb-3">
        <label className="form-label">작성일</label>
        <input className="form-control" value={notice?.date || ''} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label">제목</label>
        <input className="form-control" value={notice?.title || ''} readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label">내용</label>
        <textarea className="form-control" rows="5" value={notice?.content || ''} readOnly />
      </div>
      <button className="btn btn-secondary me-2" onClick={() => navigate('/main')}>뒤로 가기</button>
      <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
    </div>
  );
};

export default BoardView;