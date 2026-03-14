import API from './api';

const addLifestyle = async (data) => {
    const response = await API.post('lifestyle', data);
    return response.data;
};

const getHistory = async () => {
    const response = await API.get('lifestyle');
    return response.data;
};

const deleteLifestyle = async (id) => {
    const response = await API.delete(`lifestyle/${id}`);
    return response.data;
};

const lifestyleService = {
    addLifestyle,
    getHistory,
    deleteLifestyle,
};

export default lifestyleService;
