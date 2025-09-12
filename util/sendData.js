const server = 'http://192.168.8.195:3012';
// const server = 'https://pumped.digitalcaldwell.com';

async function sendData(path, data) {
    try {
        const response = await fetch(server+path, {
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

export default sendData;