import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../App";
import styles from './MainLayout.module.css';

const MainHeader = () => {
  const [logout, setLogout] = useState(false);
  const context = useContext(UserContext);
  const user = context ? context.user : null;
  const navigate = useNavigate();

  useEffect(() => {
    // 로그아웃 상태에 따라 루트로 이동 (선택적)
    if (logout) {
      navigate('/');
    }
  }, [logout, navigate]);

  const handleLogoutClick = () => {
    setLogout(true); // 로그아웃 상태 변경
    if (context && context.setUser) {
      context.setUser({ username: "", userId: "", ip: "" }); // 사용자 정보 초기화
    }
    navigate('/'); // 루트로 이동
  };

  return (
    <div className={styles.headerTop}>
      <div className={styles.logo}>Logo</div>
      <div className={styles.headerMenu}>
        {user ? (
          <>
            <ul>
              <li>{user.username} 님 안녕하세요.</li>
            </ul>
            <ul>
              <li>ID ({user.userId})</li>
            </ul>
            <ul>
              <li>IP ({user.ip})</li>
            </ul>
            <ul>
              <li onClick={handleLogoutClick} className={styles.logoutLink}>
                로그아웃
              </li>
            </ul>
          </>
        ) : (
          <ul>
            <li>로그인해주세요.</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default MainHeader;