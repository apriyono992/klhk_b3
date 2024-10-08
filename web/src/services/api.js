import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = 'https://dummyjson.com';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const axiosInstanceAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})

axiosInstanceAuth.interceptors.request.use(
    (config) => {
        if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstanceAuth.interceptors.response.use(
    (response) => {        
        return response;
    },
    async (error) => {     
        if (error.code === "ERR_NETWORK") {
            const axiosError = new CustomEvent('axiosError', { detail: error.message });
            return window.dispatchEvent(axiosError)
        }
           
        if (error.response.status === 401) {
            try {
                const originalRequest = error.config;
                const rToken = Cookies.get('refreshToken');
                const response = await refreshToken(rToken);
                
                Cookies.set('accessToken', response.accessToken, { expires: 0.5, secure: true, sameSite: 'strict' });
                Cookies.set('refreshToken', response.refreshToken, { expires: 0.5, secure: true, sameSite: 'strict' });

                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                        
                return axiosInstanceAuth(originalRequest);
            } catch (error) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login'
            }
        }
  
        return Promise.reject(error);
    }
);

export async function login(data) {
    return await axiosInstance.post('/auth/login', data).then(res => res).catch(err => err.response)
};

async function refreshToken(refreshToken) {
    return await axiosInstance.post('/auth/refresh', { refreshToken: refreshToken, expiresInMins: 1 }).then(res => res.data)
}

export async function fetchUserLogin(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
}

export async function fetchRecomendation(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
}

export async function fetchRegistration(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
}
