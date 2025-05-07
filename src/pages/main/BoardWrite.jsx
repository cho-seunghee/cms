import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../../utils/dataUtils';
import api from '../../utils/api';
import styles from './Board.module.css';

const BoardWrite = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = !!state?.notice;

  const [title, setTitle] = useState(state?.notice?.title || '');
  const [content, setContent] = useState(state?.notice?.content || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: isEdit ? state.notice.id : undefined,
      title,
      content,
      date: isEdit ? state.notice.date : new Date().toLocaleDateString(),
    };

    try {
      await fetchData(api, isEdit ? '/api/notice/modify' : '/api/notice/write', payload);
      navigate('/main'); // 변경: '/main/board' -> '/main'
    } catch (error) {
      console.error('등록/수정 실패:', error);
      navigate('/main'); // 변경: '/main/board' -> '/main'
    }
  };

  return (
    <div className="container mt-5">
      <h2 className={`text-primary text-dark fs-5 mb-4 ${styles.boardTitle}`}>{isEdit ? '공지 변경' : '공지 등록'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">제목</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">내용</label>
          <textarea className="form-control" rows="5" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary me-2">{isEdit ? '변경' : '등록'}</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/main')}>취소</button>
      </form>
    </div>
  );
};

export default BoardWrite;