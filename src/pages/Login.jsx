import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../utils/dataUtils';
import common from '../utils/common';
import useStore from '../store/store';
import api from '../utils/api.js';
import styles from './Login.module.css';

const Login = () => {
  const [empNo, setEmpNo] = useState('admin');
  const [empPwd, setEmpPwd] = useState('new1234!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Login attempt:', { empNo, empPwd });
      const response = await fetchData(api, common.getServerUrl('auth/login'), { empNo, empPwd });
      
      if (!response.success) {
        throw new Error(response.errMsg || '아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        if (response.errMsg !== '') {
          setError(response.errMsg);
        } else {
          sessionStorage.setItem('token', response.data.token);

          setUser({
            ...response.data.user,
            expiresAt: response.data.expiresAt * 1000,
          });

          navigate('/main', { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label htmlFor="userid" className={styles.label}>아이디</label>
          <input
            id="userid"
            type="text"
            value={empNo}
            onChange={(e) => setEmpNo(e.target.value)}
            placeholder="아이디를 입력하세요"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <input
            id="password"
            type="password"
            value={empPwd}
            onChange={(e) => setEmpPwd(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Login;