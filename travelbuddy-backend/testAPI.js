const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/flights?source=Mumbai&destination=Delhi',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const flights = JSON.parse(data);
      console.log(`Found ${flights.length} flights from Mumbai to Delhi`);
      if (flights.length > 0) {
        console.log('\nFirst 3 flights:');
        flights.slice(0, 3).forEach((f, i) => {
          console.log(`${i+1}. ${f.airline} ${f.flightNumber}: ₹${f.price} | ${f.departureTime}-${f.arrivalTime} | ${f.stops} stop(s)`);
        });
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => console.error(e));
req.end();
