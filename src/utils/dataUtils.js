// utils/dataUtils.js

/**
 * API를 통해 데이터를 가져오고 클라이언트 측에서 필터링을 수행합니다.
 * @param {Object} api - API 클라이언트 인스턴스 (예: axios)
 * @param {string} url - 데이터를 요청할 엔드포인트 URL
 * @param {Object} [filters={}] - 필터링 조건 (예: { name: 'john', status: 'active' })
 * @returns {Promise<Array|Error>} 필터링된 데이터 배열 또는 오류 객체
 */
export async function fetchData(api, url, filters = {}) {
  try {
    // API를 통해 데이터를 비동기적으로 요청
    const response = await api.get(url, { params: filters });
    
    // 응답 데이터가 배열인지 확인, 아니면 빈 배열로 초기화
    const rawData = Array.isArray(response.data) ? response.data : [];
    console.log('Raw Data:', rawData); // 디버깅용: 서버에서 받은 원시 데이터 출력

    // 클라이언트 측 필터링: 백엔드가 필터링을 지원하지 않을 경우를 대비
    const filteredData = rawData.filter((item) => {
      // name 필터: 대소문자 구분 없이 부분 일치 확인
      const nameMatch = filters.name
        ? String(item.name || '').toLowerCase().includes(filters.name.toLowerCase())
        : true; // 필터가 없으면 항상 true

      // status 필터: 정확한 일치 확인
      const statusMatch = filters.status 
        ? item.status === filters.status 
        : true; // 필터가 없으면 항상 true

      // 두 조건이 모두 만족해야 반환
      return nameMatch && statusMatch;
    });

    // 필터링된 데이터 반환
    return filteredData;
  } catch (error) {
    // 요청 실패 시 오류를 콘솔에 출력하고 오류 객체 반환
    console.error('데이터 가져오기 실패:', error);
    return error;
  }
}