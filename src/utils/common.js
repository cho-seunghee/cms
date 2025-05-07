export default {
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  formatNumber(num) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
  },

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  },

  getBaseName() {
    const baseName = import.meta.env.VITE_BASE_NAME ? `/${import.meta.env.VITE_BASE_NAME}` : '/';
    return baseName;
  },

  getClientUrl(arg) {
    const baseUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173/cms';
    return `${baseUrl.replace(/\/$/, '')}/${arg.replace(/^\//, '')}`;
  },

  getServerUrl(arg) {
    const baseUrl = import.meta.env.VITE_SERVER_API_URL || 'http://localhost:8080/api';
    return `${baseUrl.replace(/\/$/, '')}/${arg.replace(/^\//, '')}`;
  },

  getClientIp() {
    return '192.168.1.1';
  },
};