import React from "react";
import styles from "./ErrorMsgPopup.module.css";

const ErrorMsgPopup = ({ show, onHide, message }) => {
  if (!show) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className={styles.overlay} onClick={onHide}></div>

      {/* 모달 */}
      <div className={`${styles.modal} show d-block`} tabIndex="-1">
        <div className={`${styles.modalDialog} modal-dialog-centered`}>
          <div className={`${styles.modalContent} modal-content`}>
            <div className={`${styles.modalHeader} modal-header`}>
              <h5 className={`${styles.modalTitle} modal-title`}>오류</h5>
              <button type="button" className={`${styles.btnClose} btn-close`} onClick={onHide}></button>
            </div>
            <div className={`${styles.modalBody} modal-body`}>
              <p>{message || "알 수 없는 오류가 발생했습니다."}</p>
            </div>
            <div className={`${styles.modalFooter} modal-footer`}>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary} btn btn-secondary`} onClick={onHide}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorMsgPopup;