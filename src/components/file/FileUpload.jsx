import React from 'react';
import axios from 'axios';
import common from '../../utils/common'

const FileUpload = () => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;
      try {
        const res = await axios.post(
          `${common.getServerUrl('file/create?module=notice&filename=')}${file.name}`,
          fileContent,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/octet-stream',
            },
          }
        );
        alert(`File uploaded: ${res.data.id}`);
      } catch {
        alert('Upload failed');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return <input type="file" onChange={handleUpload} />;
};

export default FileUpload;