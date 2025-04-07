import React from 'react';
import { handleInputChange } from '../../utils/tableEvent';
import styles from './TableSearch.module.css';

const TableSearch = ({ filterFields, filters, setFilters, onDownloadExcel }) => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.formGroupContainer}>
        {filterFields.map((field) => (
          <div key={field.id} className={styles.formGroup}>
            <label htmlFor={field.id}>{field.label}</label>
            {field.type === 'text' ? (
              <input
                id={field.id}
                name={field.id}
                type="text"
                placeholder={field.placeholder}
                value={filters[field.id] || ''}
                onChange={(e) => handleInputChange(e, setFilters)}
                style={{
                  width: field.width || 'auto',
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
                  width: field.width || 'auto',
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
        <button onClick={onDownloadExcel} className={styles.downloadButton}>
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
};

export default TableSearch;