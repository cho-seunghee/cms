import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import common from '../../utils/common';
import styles from './MainLayout.module.css';

const MenuItem = ({ item }) => {
  const [showChildren, setShowChildren] = useState(false);
  const location = useLocation();
  const basename = common.getBaseName();

  const normalizedPath = location.pathname.startsWith(basename)
    ? location.pathname.replace(basename, '')
    : location.pathname;

  const hasValidPath = item.URL && item.URL.trim() !== '';
  const hasChildren = item.children && item.children.length > 0 && item.children.some(child => child.URL || child.children?.length > 0);

  const isCurrent =
    hasValidPath &&
    normalizedPath === item.URL &&
    !(item.URL === '/main' && normalizedPath !== '/main');

  const toggleChildren = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setShowChildren(!showChildren);
    }
  };

  return (
    <li
      className={`${styles.menuItem} ${hasChildren ? styles.menu : ''} ${isCurrent ? styles.current : ''}`}
      onMouseEnter={() => hasChildren && setShowChildren(true)}
      onMouseLeave={() => hasChildren && setShowChildren(false)}
    >
      {hasChildren ? (
        <>
          <a
            href="#"
            className={`${styles.menuLink} ${styles.scrolly}`}
            onClick={toggleChildren}
            data-path={item.URL}
          >
            {item.MENUNM}
          </a>
          <ul className={`${styles.subMenu} ${showChildren ? styles.visible : ''}`}>
            {item.children
              .filter(child => child.URL || (child.children && child.children.length > 0))
              .map((child) => (
                <MenuItem key={child.MENUID} item={child} />
              ))}
          </ul>
        </>
      ) : hasValidPath ? (
        <NavLink
          to={item.URL}
          className={({ isActive }) =>
            `${styles.navLink} ${styles.scrolly} ${isActive ? styles.active : ''}`
          }
          data-path={item.URL}
          end={item.URL === '/main'}
        >
          {item.MENUNM}
        </NavLink>
      ) : (
        <span className={`${styles.menuLink} ${styles.scrolly}`}>
          {item.MENUNM}
        </span>
      )}
    </li>
  );
};

export default MenuItem;