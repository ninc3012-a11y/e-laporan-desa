const axios = require('axios');

async function register() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      nik: '1234567890123456',
      nama: 'Test User',
      password: 'password123'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
register();
