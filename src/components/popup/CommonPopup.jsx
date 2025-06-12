import React, { useState, useEffect } from "react";
import styles from "./CommonPopup.module.css";

const CommonPopup = ({ show, onHide, onConfirm, title, children, buttons = [] }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleConfirm = async (action) => {
    try {
      const { result, onSuccess } = await action();
      if (result && result.error) {
        setToastMessage(result.error);
        setShowToast(true);
      } else if (result && result.success) {
        setToastMessage(result.success);
        setShowToast(true);
        return { onSuccess }; // Pass callback to useEffect
      }
    } catch (error) {
      setToastMessage("오류가 발생했습니다: " + error.message);
      setShowToast(true);
    }
    return {};
  };

  if (!show) return null;

  // Default buttons if none provided
  const defaultButtons = [
    { label: "취소", className: `${styles.btn} ${styles.btnSecondary} btn btn-secondary`, action: onHide },
    { label: "확인", className: `${styles.btn} ${styles.btnPrimary} btn text-bg-success`, action: onConfirm },
  ];

  // Use provided buttons or fallback to default, limit to 5 buttons
  const activeButtons = buttons.length > 0 ? buttons.slice(0, 5) : defaultButtons;

  return (
    <>
      <div className={styles.overlay} onClick={onHide}></div>
      <div className={`${styles.modal} show d-block`} tabIndex="-1">
        <div className={`${styles.modalDialog} modal-dialog-centered`}>
          <div className={`${styles.modalContent} modal-content`}>
            <div className={`${styles.modalHeader} modal-header`}>
              <h5 className={`${styles.modalTitle} modal-title`}>{title}</h5>
              <button type="button" className={`${styles.btnClose} btn-close`} onClick={onHide}></button>
            </div>
            <div className={`${styles.modalBody} modal-body`}>
              {children}
              {showToast && (
                <div className={`${styles.toast} alert alert-danger`} role="alert">
                  {toastMessage}
                </div>
              )}
            </div>
            <div className={`${styles.modalFooter} modal-footer`}>
              {activeButtons.map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.margin1} ${btn.className}`}
                  onClick={() => handleConfirm(btn.action)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonPopup;