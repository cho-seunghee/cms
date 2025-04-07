import React from 'react';
import axios from 'axios';
import utils from '../../utils/utils'

const ExcelUpload = () => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('excel', file);
    try {
      const res = await axios.post(`${utils.getServerUrl('auth/login/excel/upload')}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(res.data.message);
    } catch {
      alert('Upload failed');
    }
  };

  return <input type="file" accept=".xlsx" onChange={handleUpload} />;
};

export default ExcelUpload;