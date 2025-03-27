import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import MainHeader from './MainHeader';
import MainTopNav from './MainTopNav';
import MainFooter from './MainFooter';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const context = useContext(UserContext);
  const user = context ? context.user : null;
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.target.classList.contains(styles.scrolly)) {
        const scrollTarget = e.target.getAttribute('data-scroll-target');
        const path = e.target.getAttribute('data-path');

        if (path) {
          e.preventDefault();
          navigate(path);
          console.log('Navigated to:', path);
        }

        if (scrollTarget) {
          const target = document.querySelector(scrollTarget);
          if (target) {
            const navHeight = document.querySelector(`#${styles.nav}`)?.offsetHeight || 0;
            window.scrollTo({
              top: target.offsetTop - navHeight - 5,
              behavior: 'smooth',
            });
            console.log('Scrolled to:', scrollTarget);
          } else {
            console.warn(`Target not found for scrollTarget: ${scrollTarget}`);
          }
        }
      }
    };

    const nav = document.querySelector(`#${styles.nav}`);
    if (nav) {
      nav.addEventListener('click', handleScroll);
    }

    return () => {
      if (nav) {
        nav.removeEventListener('click', handleScroll);
      }
    };
  }, [navigate]);

  console.log('UserContext in MainLayout:', context); // 컨텍스트 값 확인

  return (
    <div className={styles.main}>
      <header id="header">
        <MainHeader />
        <div className={styles.headerNav}>
          <nav className={styles.nav}>
            <MainTopNav />
          </nav>
        </div>
      </header>
      <section className={styles.main}>
        <Outlet />
      </section>
      <footer id="footer">
        <MainFooter />
      </footer>
    </div>
  );
};

export default MainLayout;