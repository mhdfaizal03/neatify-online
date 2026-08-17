const http = require('http');

const data = JSON.stringify({
  username: 'admin',
  password: 'neatify2026'
});

const req = http.request({
  hostname: 'localhost',
  port: 3005,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const json = JSON.parse(body);
    console.log("Token:", json.token ? "success" : json);
    if (!json.token) return;

    const patchData = JSON.stringify({ name: "WheelArmor Gel", price: 599, stock: 20 });
    const patchReq = http.request({
      hostname: 'localhost',
      port: 3005,
      path: '/api/products/4',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + json.token,
        'Content-Length': patchData.length
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
         console.log("PATCH Response:", res2.statusCode, body2);
      });
    });
    patchReq.write(patchData);
    patchReq.end();
  });
});
req.write(data);
req.end();
