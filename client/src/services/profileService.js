import API from './api';

const getProfile = async () => {
    const response = await API.get('profile');
    return response.data;
};

const updateProfile = async (data) => {
    const response = await API.post('profile', data);
    return response.data;
};

const profileService = {
    getProfile,
    updateProfile,
};

export default profileService;
