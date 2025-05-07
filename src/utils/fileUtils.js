import axios from 'axios';

// API 클라이언트 (기본 설정)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URL,
  timeout: 10000,
});

// 파일 업로드, 다운로드, 처리와 관련된 유틸리티 함수
const fileUtils = {
  // 1. 파일 업로드 (FormData 사용)
  async uploadFile(file, url = '/upload', config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      throw new Error(`파일 업로드 실패: ${error.message}`);
    }
  },

  // 2. 다중 파일 업로드
  async uploadMultipleFiles(files, url = '/upload/multiple') {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`다중 파일 업로드 실패: ${error.message}`);
    }
  },

  // 3. 파일 다운로드 (Blob으로 처리)
  async downloadFile(url, fileName) {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob', // 파일 다운로드를 위한 설정
      });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'downloaded_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw new Error(`파일 다운로드 실패: ${error.message}`);
    }
  },

  // 4. 파일 크기 포맷팅 (KB, MB 등으로 변환)
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 5. 파일 확장자 추출
  getFileExtension(fileName) {
    return fileName.split('.').pop().toLowerCase();
  },

  // 6. 허용된 파일 형식 체크
  isValidFileType(file, allowedTypes = []) {
    const extension = this.getFileExtension(file.name);
    return allowedTypes.length === 0 || allowedTypes.includes(extension);
  },

  // 7. 파일 미리보기 (이미지용)
  previewImage(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('이미지 파일이 아닙니다.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  },

  // 8. 텍스트 파일 읽기
  readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }
};

export default fileUtils;