const http = require('http');

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('✅ Server is responding!');
      console.log('Response:', data);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error connecting to server:', err.message);
    process.exit(1);
  });

  req.end();
}, 2000);
