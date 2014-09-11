/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach, WebSocket */

'use strict';

var log = function(msg)
{
  console.log('core:', msg);
};


log('0. IB-TWS app.js started');


var wsUrl = 'ws://fxwin201410.cloudapp.net:5000';

var hostIP = 'fxwin201410.cloudapp.net';
var hostPort = 7496;

var java = require('java');
java.classpath.push('./api97201');

var API = java.import('com.ib.client.Aapi');
var api = new API();





var net = require('net');
var server = net.createServer(function(c)
{ //'connection' listener
  log('3. api.tcpClient connected to this nodeTCPserver');
  c.on('data', function(data)
  {
    /*
    var data1 = dattoString('utf-8');
    var dataA = data1.split('@');
    var msg0 = dataA[0];

    if (msg0 == 'error')
      log('error:' + dataA[1]);
    if (msg0 == 'tcpClientStart')
      log('tcpClientStart');
    if (msg0 == 'nextValidId')
      twsEvent.nextValidId(dataA[1] * 1);
    if (msg0 == 'connectionClosed')
      twsEvent.connectionClosed();
    if (msg0 == 'tickPrice')
    {
      twsEvent.tickPrice(dataA[1] * 1, dataA[2] * 1, dataA[3] * 1);
    }
    if (msg0 == 'updatePortfolio')
      twsEvent.updatePortfolio(dataA[1], dataA[2] * 1);
    if (msg0 == 'openOrder')
      twsEvent.openOrder(dataA[1] * 1, dataA[2]);
    if (msg0 == 'orderStatus')
      twsEvent.orderStatus(dataA[1] * 1, dataA[2]);

      */
  });
  c.on('end', function()
  {
    log('api.tcpClient disconnected');
  });
});



var connect = function()
{
  log("4. apiClient connecting to the remote TWS/gateway");

  api.connect(hostIP, hostPort, 0);
};

server.listen(6000, function()
{ //'listening' listener

  process.on('SIGTERM', function(err)
  {
    log('Caught exception: ' + err);
    server.close();

  });

  log('1. nodeTCPserver listening port:6000');
  log('2. api.tcpClientStart()');
  api.tcpClientStart();

  setTimeout(connect, 500);

  //var timer_logic = require('./timer_logic');
  //var tmr = setInterval(timer_logic, 500);

});






//==================








var WebSocketNode = require('ws');
var ws = new WebSocketNode(wsUrl);

var WebSocketStream = require('stream-websocket');
var c = new WebSocketStream(ws);

var rpc = require('rpc-streamx');
var d = rpc();

c
  .pipe(d)
  .pipe(c)
  .on('close', function()
  {
    console.log('c close');
  })
  .on('error', function()
  {
    console.log('c error');
  })
  .on('finish', function()
  {
    console.log('c finish');
  });

/*
d
  .rpc('hello1',
    'EURUSD',
    function(err, msg)
    {
      if (err !== null) console.log('file read error!');
      console.log(msg);

      //    c.end();
    });
*/
