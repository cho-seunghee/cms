import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Board.module.css'; // 스타일 재사용

const BoardWrite = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = !!state?.notice;
  const [title, setTitle] = useState(isEdit ? state.notice.title : '');
  const [content, setContent] = useState(isEdit ? state.notice.content : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      id: isEdit ? state.notice.id : Date.now().toString(), // 새 공지일 경우 임시 ID 생성
      title,
      content,
      date: isEdit ? state.notice.date : new Date().toLocaleDateString(),
    };
    console.log(isEdit ? '변경:' : '등록:', newNotice);
    // 실제로는 API 호출로 서버에 저장
    navigate('/'); // 등록/변경 후 메인으로 이동
  };

  return (
    <div className="container mt-5">
      <h2 className={`text-primary text-dark fs-5 mb-4 ${styles.boardTitle} ${styles.boardTitleLine}`}>{isEdit ? '공지 변경' : '공지 등록'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="noticeTitle" className="form-label">
            제목
          </label>
          <input
            id="noticeTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={`btn ${styles.btnReg} me-2`}>
          {isEdit ? '변경' : '등록'}
        </button>
        <button
          type="button"
          className={`btn ${styles.btnCancel}`}
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default BoardWrite;