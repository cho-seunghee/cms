import React from 'react';

function Button({ onClick, children, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} style={{ padding: '10px 20px', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

export default Button;