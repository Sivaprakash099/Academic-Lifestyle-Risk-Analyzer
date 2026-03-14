import API from './api';

const analyzeRisk = async (lifestyleId) => {
    const response = await API.post('risk/analyze', { lifestyleId });
    return response.data;
};

const getLatestRisk = async () => {
    const response = await API.get('risk/latest');
    return response.data;
};

const riskService = {
    analyzeRisk,
    getLatestRisk,
};

export default riskService;
