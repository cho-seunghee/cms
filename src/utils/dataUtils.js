/**
 * API를 통해 데이터를 가져오고 클라이언트 측에서 필터링을 수행합니다.
 * @param {Object} api - API 클라이언트 인스턴스 (예: axios)
 * @param {string} url - 데이터를 요청할 엔드포인트 URL
 * @param {Object} [filters={}] - 필터링 조건 (예: { name: 'john', status: 'active' })
 * @param {Object} [config={}] - 추가 axios 설정 (예: headers)
 * @returns {Promise<any|Error>} 응답 데이터 (배열 또는 객체) 또는 오류 객체
 */
export async function fetchData(api, url, filters = {}, config = {}) {
  try {
    // API를 통해 데이터를 비동기적으로 요청 (POST 방식)
    const response = await api.post(url, filters, config);

    // 응답 데이터가 배열인지 확인
    if (Array.isArray(response.data)) {
      const rawData = response.data;

      // 클라이언트 측 필터링: 배열일 경우에만 적용
      const filteredData = rawData.filter((item) => {
        const nameMatch = filters.name
          ? String(item.name || '').toLowerCase().includes(filters.name.toLowerCase())
          : true;
        const statusMatch = filters.status
          ? item.status === filters.status
          : true;
        return nameMatch && statusMatch;
      });
      return filteredData;
    } else {
      // 배열이 아닌 경우 (객체 등) 그대로 반환
      return response.data;
    }
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
    return error;
  }
}