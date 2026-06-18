const http = require('http');

function testRoute(route, expectedMsg) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`${expectedMsg}: ${json.length} flights`);
          if (json.length > 0) {
            console.log('  Sample:', json[0].airline, json[0].source, '→', json[0].destination, '₹' + json[0].price);
          }
        } catch (e) {
          console.log(`${expectedMsg}:`, data.substring(0, 200));
        }
        resolve();
      });
    }).on('error', (err) => {
      console.log(`${expectedMsg}: ERROR - ${err.message}`);
      resolve();
    });
  });
}

console.log('Testing backend API flight counts...\n');
testRoute('/api/flights?source=Mumbai&destination=Delhi', 'Mumbai→Delhi')
  .then(() => testRoute('/api/flights?source=Delhi&destination=Mumbai', 'Delhi→Mumbai'))
  .then(() => testRoute('/api/flights?source=Bangalore&destination=Goa', 'Bangalore→Goa'))
  .then(() => testRoute('/api/flights?source=Mumbai', 'Mumbai (any dest)'))
  .then(() => testRoute('/api/flights', 'All flights'))
  .then(() => testRoute('/api/flights/random', 'Random (showcase)'))
  .then(() => console.log('\n✅ Tests complete'));
