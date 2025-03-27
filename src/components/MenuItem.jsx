import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MenuItem = ({ item }) => {
  const [showChildren, setShowChildren] = useState(false);
  const location = useLocation();

  const isCurrent =
    item.path &&
    location.pathname === item.path &&
    !(item.path === '/main' && location.pathname !== '/main');

  return (
    <li
      className={`${styles.menuItem} ${item.children ? styles.menu : ''} ${
        isCurrent ? styles.current : ''
      }`}
      onMouseEnter={() => setShowChildren(true)}
      onMouseLeave={() => setShowChildren(false)}
    >
      {item.children ? (
        <>
          <a
            href={item.scrollTarget || '#'}
            className={`${styles.menuLink} ${styles.scrolly}`}
            data-scroll-target={item.scrollTarget}
            data-path={item.path}
          >
            {item.name}
          </a>
          <ul className={`${styles.subMenu} ${showChildren ? styles.visible : ''}`}>
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} />
            ))}
          </ul>
        </>
      ) : (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `${styles.navLink} ${styles.scrolly} ${
              isActive ? styles.active : ''
            }`
          }
          data-scroll-target={item.scrollTarget}
          data-path={item.path}
          end={item.path === '/main'}
        >
          {item.name}
        </NavLink>
      )}
    </li>
  );
};

export default MenuItem;