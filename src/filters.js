export function handlePrice(price) {
    return ((price || 0) * 0.01).toFixed(2);
}

export function stringify(obj) {
    return JSON.stringify(obj);
}