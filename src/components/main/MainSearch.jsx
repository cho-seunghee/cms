import React from 'react';
import { handleInputChange, handleKeyUp } from '../../utils/tableEvent';
import styles from './MainSearch.module.css';

const MainSearch = ({ filterFields, filters, setFilters, onSearch, onReset }) => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.formGroupContainer}>
        {filterFields.map((field) => (
          <div key={field.id} className={styles.formGroup}>
            <label htmlFor={field.id}>{field.label}:</label>
            {field.type === 'text' ? (
              <input
                id={field.id}
                name={field.id}
                type="text"
                placeholder={field.placeholder}
                value={filters[field.id] || ''}
                onChange={(e) => handleInputChange(e, setFilters)}
                onKeyUp={(e) => handleKeyUp(e, onSearch)}
                style={{
                  width: field.width || 'auto', // 동적 크기 적용
                  height: field.height || 'auto',
                }}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={filters[field.id] || ''}
                onChange={(e) => handleInputChange(e, setFilters)}
                style={{
                  width: field.width || 'auto', // 동적 크기 적용
                  height: field.height || 'auto',
                }}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={onSearch}>검색</button>
        <button onClick={onReset} className={styles.resetButton}>
          초기화
        </button>
      </div>
    </div>
  );
};

export default MainSearch;