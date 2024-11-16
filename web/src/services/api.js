import axios from 'axios'
import Cookies from 'js-cookie'
import { LOGIN_PATH } from './routes';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

const BASE_URL_DEV = 'https://dummyjson.com';
const BASE_URL = 'http://localhost:3002';

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

export async function login(data) {
    return await axiosInstance.post('/api/auth/login', data).then(res => res).catch(err => err.response)
};

export async function registerUser(data) {
    return await axiosInstance.post('/api/auth/register', data).then(res => res).catch(err => err.response)
};

export async function forgotPassword(data) {
    return await axiosInstance.post('/api/auth/forgotPassword', data).then(res => res).catch(err => err.response)
};

export async function resetPassword(data) {
    return await axiosInstance.post('/api/auth/resetPassword', data).then(res => res).catch(err => err.response)
};

export async function uploadPhoto(data) {
    return await axiosInstance.post('/api/upload/file', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res).catch(err => err.response)
};

async function refreshToken(userId, refreshToken) {
    return await axiosInstanceAuth.post('/api/auth/refreshToken', { userId, refreshToken, expiresInMins: 1 }).then(res => res.data)
}

export async function getListRegistrasi(data) {
    return await axiosInstanceAuth.get('/api/registrasi/search?page=1&limit=10&sortBy=createdAt&sortOrder=desc',).then(res => res.data)
}

export async function getDetailRegistrasi(data) {
    return await axiosInstanceAuth.get(`/api/registrasi/${data}`,).then(res => res.data)
}

export async function updatePerusahaan(id, data) {
    return await axiosInstanceAuth.put(`/api/registrasi/update-perusahaan/${id}`, data).then(res => res.data)
}

export async function simpanSK(data, id) {
    return await axiosInstanceAuth.post(`/api/registrasi/submit-draft-sk/${id}`, data).then(res => res.data)
}

export async function submitSK(id, data) {
    return await axiosInstanceAuth.put(`/api/registrasi/update-status-approval/${id}`, data).then(res => res.data)
}

export async function sendInsw(data) {
    return await axiosInstanceAuth.post(`/api/insw/send`, data).then(res => res.data)
}

export async function exportJsonINSW(data) {
    return await axiosInstanceAuth.post(`/api/insw/export-json`, data).then(res => res.data)
}

export async function getPreviewSK(id) {
    return await axiosInstance.get(`/api/pdf/generateRegistrasiB3/${id}`).then(res => res.data)
}

export async function authStateFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => res.data)
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

export async function getSelectCountryFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => {
        return res.data.map((item) => ({
            value: item.code2,
            label: item.name,
        }))
    })
}

export async function getSelectPejabatFetcher(url) {
    return await axiosInstanceAuth.get(url).then(res => {
        return res.data.data.map((item) => ({
            value: item.id,
            label: item.nama && item.jabatan ? `${item.nama} - ${item.jabatan}`  : item.nama  ? item.nama : null,
        }))
    })
}

export async function postFetcher(url, data) {
    return await axiosInstanceAuth.post(url, data).then(res => res.data)
}

export async function postMultipartFetcher(url, data) {
    return await axiosInstanceAuth.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res)
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

export async function deleteWithFormFetcherTest(url, data) {
    return await axiosInstanceAuth.delete(url, {
        data: data, // Mengirim data sebagai body
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.data);
}


export async function getPdfUrl(url) {
    try {
        const response = await axiosInstanceAuth.get(url, {
            responseType: 'blob', // Important to handle the PDF file correctly
        });

        // Create a URL for the PDF file from the blob
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');

        // Optional: Revoke the object URL after some time to free up memory
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (error) {
        console.error("Failed to open PDF:", error);
        throw new Error('Failed to open PDF');
    }
}

