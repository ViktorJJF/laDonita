import axios from 'axios';

export default {
  salesReport(query) {
    return axios.get('/api/reports/total-sales', { params: query });
  },
};
