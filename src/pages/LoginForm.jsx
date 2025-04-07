import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // App에서 정의된 UserContext 임포트
import { fetchData } from '../utils/dataUtils';
import utils from '../utils/utils'
import axios from 'axios';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [userid, setUserid] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // setUser 가져오기

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   if (userid === 'admin' && password === 'password') {
  //     const loginData = {
  //       username: '관리자',
  //       userId: '12345', // 예시 ID
  //       ip: '192.168.1.1', // 예시 IP
  //     };
  //     console.log('Login successful!', loginData);
  //     setUser(loginData); // UserContext에 사용자 정보 저장
  //     navigate('/main'); // 로그인 성공 시 /main으로 이동
  //   } else {
  //     setError('Invalid username or password');
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchData(axios, `${utils.getServerUrl('auth/login')}`, { userid, password });
      if (data instanceof Error || data.error) throw new Error(data.error || data.message || 'Login failed');

      localStorage.setItem('token', data.token);

      // data.user에 ip 속성 추가
      // const userWithIp = {
      //   ...data.user,
      //   ip: utils.getClientIp(), // utils에서 IP 참조
      // };

      setUser(data.user);
      navigate('/main');
    } catch (error) {
      const loginData = {
        username: '관리자2',
        userId: '12345', // 예시 ID
        ip: '192.168.1.1', // 예시 IP
      };
      console.log('Login successful!', loginData);
      setUser(loginData); // UserContext에 사용자 정보 저장
      navigate('/main'); // 로그인 성공 시 /main으로 이동
      setError(error.message); // 백엔드에서 받은 오류 메시지 반영
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
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

export default LoginForm;