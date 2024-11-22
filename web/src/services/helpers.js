import Cookies from 'js-cookie'
import i18nIsoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import idLocale from 'i18n-iso-countries/langs/id.json'; // Indonesian locale
import { jwtDecode } from 'jwt-decode';

// Register English locale
i18nIsoCountries.registerLocale(enLocale);

export const isResponseErrorObject = (response) => typeof response === 'object' && response !== null && !Array.isArray(response);

export const dirtyInput = (dirtyFields, data) => Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
}, {});

export function formattedDate(date) {
    const initDate = new Date(date);
    const format = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(initDate);
    return format
}

export function calculateNoticationProcessingDays(statusHistory) {
    if (!statusHistory || statusHistory.length === 0) {
      return 0; // Tidak ada data
    }
  
    // Urutkan statusHistory berdasarkan tanggal perubahan (jika belum diurutkan)
    statusHistory.sort((a, b) => new Date(a.tanggalPerubahan) - new Date(b.tanggalPerubahan));
  
    // Ambil tanggal awal
    const startDate = new Date(statusHistory[0].tanggalPerubahan);
  
    let endDate = null;
    console.log(startDate)
  
    // Cari tanggal akhir (status Selesai atau Dibatalkan)
    for (let i = 0; i < statusHistory.length; i++) {
      const status = statusHistory[i];
      if (status.newStatus === "Selesai" || status.newStatus === "Dibatalkan") {
        endDate = new Date(status.tanggalPerubahan);
        break;
      }
    }
  
    // Jika tidak ada status Selesai atau Dibatalkan, gunakan tanggal hari ini
    if (!endDate) {
      endDate = new Date(); // Menggunakan tanggal hari ini
    }
  
    // Normalisasi tanggal ke tengah malam (menghindari perhitungan waktu parsial)
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    console.log(startDay,endDay);
    // Hitung selisih hari
    const processingDays = Math.floor((endDay - startDay) / (1000 * 60 * 60 * 24));

  
    return processingDays;
  }

export function diffForHuman(datePast, dateCurrent) {
    const current = new Date(dateCurrent);
    const past = new Date(datePast);
    const diffMs = current - past; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) return `${diffSeconds} detik`;
    if (diffMinutes < 60) return `${diffMinutes} menit `;
    if (diffHours < 24) return `${diffHours} jam `;
    if (diffDays < 7) return `${diffDays} hari`;
    if (diffWeeks < 4) return `${diffWeeks} minggu `;
    if (diffMonths < 12) return `${diffMonths} bulan `;

    return `${diffYears} tahun`;
}

export const getCountryName = (countryCode, locale = "en", options = {}) => {
  try {
    let country =  i18nIsoCountries.getName(countryCode, locale, options);
    console.log(country)
    return country;
  } catch (error) {
    console.error(`Error fetching country name for ${countryCode}:`, error);
    return null;
  }
};

export const formDataWithParsedLocation = (data) => ({
    ...data,
    ...(data.asalMuat && {
        asalMuat: data.asalMuat.map((item) => ({
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
        })),
    }),
    ...(data.tujuanBongkar && {
        tujuanBongkar: data.tujuanBongkar.map((item) => ({
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
        })),
    }),
});

export function getRoles() {
    const getRole = Cookies.get('roles')
    return getRole
}

export function removeSlug(slug) {
    var words = slug.split('-');

    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
}

// export async function isSessionExpired() {
//     const aToken = Cookies.get('accessToken')
//     const rToken = Cookies.get('refreshToken');
//     const sessionExpired = Cookies.get('sessionExpired');

//     const sessionExpireDate = new Date(sessionExpired * 1).toISOString();
//     const currentDate = new Date().toISOString();

//     const expired = currentDate >= sessionExpireDate;

//     if (expired === true) {
//         try {
//             const decode = jwtDecode(aToken)
//             const response = await refreshToken(decode.userId, rToken);

//             Cookies.set('accessToken', response.accessToken, { expires: 1, secure: true, sameSite: 'strict' });
//             Cookies.set('refreshToken', response.refreshToken, { expires: 1, secure: true, sameSite: 'strict' });
//             Cookies.set('sessionExpired', response.sessionExpired, { expires: 1, secure: true, sameSite: 'strict' });
//         } catch (error) {

//         }
//     }

//     return currentDate >= sessionExpireDate;
// };
