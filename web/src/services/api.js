import axios from 'axios'
import Cookies from 'js-cookie'
import { LOGIN_PATH } from './routes';

const BASE_URL_DEV = 'https://dummyjson.com';
const BASE_URL = 'http://localhost:3002/api';

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': '123',
    },
})

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
                window.location.href = LOGIN_PATH
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

export async function getListRegistrasi(data) {
    return await axiosInstance.get('/registrasi/search?page=1&limit=10&sortBy=createdAt&sortOrder=desc',).then(res => res.data)
}

export async function getDetailRegistrasi(data) {
    return await axiosInstance.get(`/registrasi/${data}`,).then(res => res.data)
}

export async function updatePerusahaan(id, data) {
    return await axiosInstance.put(`/registrasi/update-perusahaan/${id}`, data).then(res => res.data)
}

export async function simpanSK(data) {
    return await axiosInstance.post(`/registrasi/save`, data).then(res => res.data)
}

export async function submitSK(id) {
    return await axiosInstance.post(`/registrasi/submit-draft-sk/${id}`).then(res => res.data)
}

export async function authStateFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
}

export async function getFetcher(url) {
    return await instance.get(url).then(res => res.data)
}

export async function getSelectFetcher(url) {
    return await instance.get(url).then(res => {
        return res.data.data.map((item) => ({
            value: item.id,
            label: item.nama,
        }))
    })
}

export async function postFetcher(url, data) {
    return await instance.post(url, data).then(res => res.data)
}

export async function putFetcher(url, id, data) {
    return await instance.put(`${url}/${id}`, data).then(res => res.data)
}

export async function putFetcherWithoutId(url, data) {
    return await instance.put(url, data).then(res => res.data)
}

export async function patchFetcher(url, id, data) {
    return await instance.patch(`${url}/${id}`, data).then(res => res.data)
}

export async function deleteFetcher(url, id) {
    return await instance.delete(`${url}/${id}`).then(res => res.data)
}

export async function deleteWithFormFetcher(url, data) {
    return await instance.delete(url, data).then(res => res.data)
}

