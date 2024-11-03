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