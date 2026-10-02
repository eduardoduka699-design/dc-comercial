const fetch = require('node-fetch');

async function getToken() {
  const url = 'https://chat.legendaryhub.com.br/api/v1/auth/token';
  const clientId = 'wtk_live_d1917583fe1d5a7f3022b32dc97efebc';
  const clientSecret = 'wks_2a2d1807c8663e63ebfd4151395f27ed864bc478';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret
      })
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

getToken();
