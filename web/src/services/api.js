import axios from 'axios'
import Cookies from 'js-cookie'
import { LOGIN_PATH } from './routes';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

const BASE_URL = 'http://localhost:3002';

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
            return toast.error('Jaringan tidak tersedia');
        }
           
        if (error.response.status === 401) {
            try {
                const originalRequest = error.config;
                const aToken = Cookies.get('accessToken')
                const rToken = Cookies.get('refreshToken');
                const decode = jwtDecode(aToken)
                const response = await refreshToken(decode.userId, rToken);
                
                Cookies.set('accessToken', response.accessToken, { expires: 0.5, secure: true, sameSite: 'strict' });
                Cookies.set('refreshToken', response.refreshToken, { expires: 0.5, secure: true, sameSite: 'strict' });
                Cookies.set('sessionExpired', response.sessionExpired, { expires: 0.5, secure: true, sameSite: 'strict' });

                originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                        
                return axiosInstanceAuth(originalRequest);
            } catch (error) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('sessionExpired');
                window.location.href = LOGIN_PATH
            }
        }
  
        return Promise.reject(error);
    }
);

export async function uploadPhoto(data) {
    return await axiosInstanceAuth.post('api/upload/file', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res).catch(err => err.response)
};

async function refreshToken(userId, refreshToken) {
    return await axiosInstanceAuth.post('/api/auth/refreshToken', { userId, refreshToken, expiresInMins: 1 }).then(res => res.data)
}

export async function getListRegistrasi(data) {
    return await axiosInstanceAuth.get('/registrasi/search?page=1&limit=10&sortBy=createdAt&sortOrder=desc',).then(res => res.data)
}

export async function getDetailRegistrasi(data) {
    return await axiosInstanceAuth.get(`/registrasi/${data}`,).then(res => res.data)
}

export async function updatePerusahaan(id, data) {
    return await axiosInstanceAuth.put(`/registrasi/update-perusahaan/${id}`, data).then(res => res.data)
}

export async function simpanSK(data) {
    return await axiosInstanceAuth.post(`/registrasi/save`, data).then(res => res.data)
}

export async function submitSK(id) {
    return await axiosInstanceAuth.post(`/registrasi/submit-draft-sk/${id}`).then(res => res.data)
}

export async function getFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
}

export async function getSelectFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => {
        return res.data.data.map((item) => ({
            value: item.id,
            label: item.name ? item.name : item.namaDagang ? item.namaDagang : item.nama ? item.nama : null,
        }))
    })
}

export async function postFetcher(url, data) {
    return await axiosInstanceAuth.post(url, data).then(res => res.data)
}

export async function putFetcher(url, id, data) {
    return await axiosInstanceAuth.put(`${url}/${id}`, data).then(res => res.data)
}

export async function putFetcherWithoutId(url, data) {
    return await axiosInstanceAuth.put(url, data).then(res => res.data)
}

export async function patchFetcher(url, id, data) {
    return await axiosInstanceAuth.patch(`${url}/${id}`, data).then(res => res.data)
}

export async function patchFetcherWithoutId(url, data) {
    return await axiosInstanceAuth.patch(url, data).then(res => res.data)
}

export async function deleteFetcher(url, id) {
    return await axiosInstanceAuth.delete(`${url}/${id}`).then(res => res.data)
}

export async function deleteWithFormFetcher(url, data) {
    return await axiosInstanceAuth.delete(url, data).then(res => res.data)
}

