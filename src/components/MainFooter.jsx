// components/MainFooter.jsx
import React from 'react';
import styles from './MainLayout.module.css'; // MainLayout.module.css 재사용

const MainFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <ul className={styles.footerMenu}>
          <li>&copy; 2025 All rights reserved.</li>
        </ul>
      </div>
    </footer>
  );
};

export default MainFooter;