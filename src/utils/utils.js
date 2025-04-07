export default {
    // 날짜 포맷팅
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
  
    // 숫자 3자리 콤마
    formatNumber(num) {
      return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
    },
  
    // 객체 깊은 복사
    deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  
    // 빈 값 체크
    isEmpty(value) {
      return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      );
    },

    getClientUrl(arg){
      let url = import.meta.env.VITE_CLIENT_URL || window.location.origin;
      url += `/${arg}`;
      return url;
    },

    getServerUrl(arg){
      let url = import.meta.env.VITE_SERVER_API_URL || window.location.origin;
      url += `/${arg}`;
      return url;
    },
    
    getClientIp() {
      // 임시로 고정 IP 반환 (실제로는 백엔드 API 호출 필요)
      return '192.168.1.1';
    }
  };
