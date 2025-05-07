import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MainHeader from './MainHeader';
import MainTopNav from './MainTopNav';
import MainTopNavLoc from './MainTopNavLoc';
import MainFooter from './MainFooter';
import useStore from '../../store/store';
import { fetchData } from '../../utils/dataUtils';
import common from '../../utils/common';
import api from '../../utils/api.js';
import menuData from '../../data/menu.json';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, clearUser, setMenu, menu } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  const checkTokenValidity = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      clearUser();
      return false;
    }
    return true;
  }, [clearUser]);

  const handleLogoClick = useCallback(async (e) => {
    e.preventDefault();
    const isValid = await checkTokenValidity();
    if (!isValid) {
      navigate('/', { replace: true });
      return;
    }
    navigate('/main');
  }, [navigate, checkTokenValidity]);

  const fetchMenu = useCallback(async () => {
    if (menu) return;
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetchData(
        api,
        common.getServerUrl('auth/menu'),
        { userId: user.empNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.success && response.data && response.data.length > 0) {
        setMenu(response.data);
      } else {
        setMenu(menuData);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      setMenu(menuData);
    }
  }, [menu, setMenu, user.empNo]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    const verifyUser = async () => {
      const isValid = await checkTokenValidity();
      if (!isValid && user) {
        navigate('/', { replace: true });
      }
      setIsChecking(false);
    };
    verifyUser();
  }, [user, navigate, checkTokenValidity]);

  const handleClick = useCallback(async (e) => {
    const isValid = await checkTokenValidity();
    if (!isValid) {
      e.preventDefault();
      navigate('/', { replace: true });
      return;
    }

    if (e.target.classList.contains(styles.scrolly)) {
      const scrollTarget = e.target.getAttribute('data-scroll-target');
      const path = e.target.getAttribute('data-path');

      if (path) {
        e.preventDefault();
        navigate(path);
      }

      if (scrollTarget) {
        const target = document.querySelector(scrollTarget);
        if (target) {
          const navHeight = document.querySelector(`#${styles.nav}`)?.offsetHeight || 0;
          window.scrollTo({
            top: target.offsetTop - navHeight - 5,
            behavior: 'smooth',
          });
        } else {
          console.warn(`Target not found for scrollTarget: ${scrollTarget}`);
        }
      }
    }
  }, [navigate, checkTokenValidity]);

  useEffect(() => {
    const nav = document.querySelector(`#${styles.nav}`);
    const navLogo = document.querySelector(`#${styles.logo}`);
    if (nav) nav.addEventListener('click', handleClick);
    if (navLogo) navLogo.addEventListener('click', handleLogoClick);

    return () => {
      if (nav) nav.removeEventListener('click', handleClick);
      if (navLogo) navLogo.removeEventListener('click', handleLogoClick);
    };
  }, [handleClick, handleLogoClick]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header id="header" className={styles.header}>
        <div className={styles.logo} onClick={handleLogoClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleLogoClick(e)}>
          Logo
        </div>
        <div className={styles.headerNavGroup}>
          <MainHeader />
          <div className={styles.headerNav}>
            <nav className={styles.nav}>
              <MainTopNav />
            </nav>
          </div>
        </div>
      </header>
      <div>
        <MainTopNavLoc />
      </div>
      <section className={styles.main}>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </section>
      <footer id="footer">
        <MainFooter />
      </footer>
    </div>
  );
};

export default MainLayout;