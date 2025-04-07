import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import MainHeader from './MainHeader';
import MainTopNav from './MainTopNav';
import MainFooter from './MainFooter';
import MainHome from './MainHome';
import { fetchData } from '../../utils/dataUtils';
import utils from '../../utils/utils'
import axios from 'axios';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  // const context = useContext(UserContext);
  // const user = context ? context.user : null;

  // if (!user) {
  //   console .log("No user found");
  //  }

  useEffect(() => {
    if (!user) navigate('/');
    else {
      if(!user.username == "관리자2")
      {
        fetchData(axios, `${utils.getServerUrl('permissions/list')}`, { userid: user.userid }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(data => {
          if(!data)
          {
            console.log('No Permissions found');
          }
          
        });  
      }
    }
  }, [user, navigate]);

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
      {location.pathname === '/main' && <MainHome />} {/* /main 경로에서만 MainHome 렌더링 */}
        <Outlet /> {/* 하위 라우트는 MainHome 내부에서 처리 */}
      </section>
      <footer id="footer">
        <MainFooter />
      </footer>
    </div>
  );
};

export default MainLayout;