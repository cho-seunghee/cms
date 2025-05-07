// src/utils/dataUtils.js
// import axios from 'axios';

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
    const response = await api.post(url, filters, config);
    return response.data;
  } catch (error) {
    console.error('데이터 가져오기 실패:', error.message, error.response?.data);
    throw error;
  }
}

/**
 * API를 통해 데이터를 가져오고 클라이언트 측에서 필터링을 수행합니다. (GET 방식)
 * @param {Object} api - API 클라이언트 인스턴스 (예: axios)
 * @param {string} url - 데이터를 요청할 엔드포인트 URL
 * @param {Object} [filters={}] - 쿼리 파라미터로 보낼 필터링 조건
 * @param {Object} [config={}] - 추가 axios 설정 (예: headers)
 * @returns {Promise<any|Error>} 응답 데이터 (배열 또는 객체) 또는 오류 객체
 */
export async function fetchDataGet(api, url, filters = {}, config = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
    const response = await api.get(fullUrl, config);
    return response.data;
  } catch (error) {
    console.error('데이터 가져오기 실패 (GET):', error.message, error.response?.data);
    throw error;
  }
}