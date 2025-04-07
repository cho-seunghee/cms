export const commonMixin = {
    data() {
      return {
        loading: false,
        error: null
      };
    },
    methods: {
      async handleApiCall(apiFunction) {
        try {
          this.loading = true;
          this.error = null;
          const response = await apiFunction();
          return response.data;
        } catch (err) {
          this.error = err.message || '오류가 발생했습니다.';
          throw err;
        } finally {
          this.loading = false;
        }
      },
  
      showAlert(message, type = 'success') {
        this.$store.dispatch('alert/show', { message, type });
      }
    }
  };