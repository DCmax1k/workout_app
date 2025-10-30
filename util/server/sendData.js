import { DOMAIN } from '../../constants/ServerConstants';

export default async function sendData(path, data) {
    try {
        const response = await fetch(DOMAIN + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();

    } catch(err) {
        console.error(err);
    }
}