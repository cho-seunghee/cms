import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataGet } from '../../utils/dataUtils';
import common from '../../utils/common';
import useStore from '../../store/store';
import api from '../../utils/api.js';
import styles from './MainLayout.module.css';

const MainHeader = () => {
    const [logout, setLogout] = useState(false);
    const [timeDisplay, setTimeDisplay] = useState('00:00');
    const { user, setUser, clearUser, clearMenu } = useStore();
    const navigate = useNavigate();

    const calculateTimeDisplay = (expiresAt) => {
        const now = new Date().getTime();
        const timeLeft = expiresAt - now;
        if (timeLeft <= 0) {
            return '00:00';
        }
        const minutes = Math.floor(timeLeft / 1000 / 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const checkTokenValidity = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const response = await fetchDataGet(
                api,
                common.getServerUrl('auth/live'),
                { extend: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.success) {
                sessionStorage.setItem('token', response.data.token);
                setUser({
                    ...user,
                    expiresAt: response.data.expiresAt * 1000,
                });
            } else {
                throw new Error(response.errMsg || 'Token validation failed');
            }
        } catch (error) {
            console.error('Token validation failed:', error.message);
            handleLogout();
        }
    };

    const handleExtend = async () => {
        await checkTokenValidity();
    };

    const handleLogout = () => {
        setLogout(true);
        sessionStorage.removeItem('token');
        clearUser();
        if (clearMenu) {
            clearMenu();
        } else {
            console.error('clearMenu is undefined');
        }
        navigate('/', { replace: true });
    };

    useEffect(() => {
        if (logout) {
            navigate('/', { replace: true });
        }
    }, [logout, navigate]);

    useEffect(() => {
        if (!user || !user.expiresAt) {
            checkTokenValidity();
            return;
        }

        setTimeDisplay(calculateTimeDisplay(user.expiresAt));

        const updateTime = () => {
            const now = new Date().getTime();
            const timeLeft = user.expiresAt - now;
            if (timeLeft <= 0) {
                handleLogout();
                return;
            }
            setTimeDisplay(calculateTimeDisplay(user.expiresAt));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, [user]);

    return (
        <div className={styles.headerTop}>
            <div className={styles.headerMenu}>
                {user && user.empNm ? (
                    <>
                        <ul>
                            <li>{user.empNm} 님 안녕하세요.</li>
                        </ul>
                        <ul>
                            <li className={styles.time}>{timeDisplay}</li>
                        </ul>
                        <ul>
                            <li onClick={handleExtend} className={styles.extendLink}>
                                연장
                            </li>
                        </ul>
                        <ul>
                            <li onClick={handleLogout} className={styles.logoutLink}>
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