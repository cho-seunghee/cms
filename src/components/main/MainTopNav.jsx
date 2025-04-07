import React from 'react';
import MenuItem from './MenuItem';
import menuData from '../../data/menu.json';
import styles from './MainLayout.module.css';

const MainTopNav = () => {
  return (
    <ul className={styles.navList}>
      {menuData.map((item, index) => (
        <MenuItem key={index} item={item} />
      ))}
    </ul>
  );
};

export default MainTopNav;