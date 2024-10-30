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