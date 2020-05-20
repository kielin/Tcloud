
const WebSocket = require('ws');
const ws = new WebSocket('ws://192.168.11.232:7416/');
 

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});
