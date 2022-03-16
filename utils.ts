export const calculateAverage = (obj: any, key: string, len: number) => {
    const defaultValue = { chars: 0, count: 0 };
    obj[key] = obj[key] || defaultValue;
    obj[key].chars += len;
    obj[key].count += 1;
};

export const calculateCharLength = (obj: any, key: string, len: number) => {
    obj[key] = obj[key] || 0;
    if (len > obj[key]) obj[key] = len;
};

export const calculateTotal = (obj: any, key: string) => {
    obj[key] = obj[key] || 0;
    obj[key] += 1;
};