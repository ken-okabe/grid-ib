/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach, WebSocket */

'use strict';
var clog = function(msg)
{
  console.log(msg);
};
var log = function(msg)
{
  console.log('core:', msg);
};


log('0. IB-TWS app.js started');

var _ = require('spacetime').lazy();
var __ = require('spacetime').timeline();

var moment = require('moment-timezone');


var hostIP = 'localhost';
var hostPort = 7496;



var java = require('java');
java.classpath.push('./api97201');

var API = java.import('com.ib.client.Aapi');
var api = new API();

var GENERICTICKS = "100";

var Contract = java.import('com.ib.client.Contract');
var eurusd = new Contract();
eurusd.m_localSymbol = "EUR.USD";
eurusd.m_secType = "CASH";
eurusd.m_currency = "USD";
eurusd.m_exchange = "IDEALPRO";



var __twsEvent_nextValidId = __();
var __twsEvent_connectionClosed = __();

var __twsEvent_tickPrice = __();

var __twsconnection = __();
__twsconnection.appear(false);

var __orderID = __();

var net = require('net');
var server = net.createServer(function(c)
{ //'connection' listener
  log('3. api.tcpClient connected to this nodeTCPserver');
  c.on('data', function(data)
  {
    var dataA = data.toString('utf-8').split('@');

    if (dataA[0] == 'error')
      log('error:' + dataA[1]);
    if (dataA[0] == 'tcpClientStart')
      log('tcpClientStart');
    if (dataA[0] == 'nextValidId')
      __twsEvent_nextValidId.appear(dataA);
    if (dataA[0] == 'connectionClosed')
      __twsEvent_connectionClosed.appear(null);
    if (dataA[0] == 'tickPrice')
      __twsEvent_tickPrice(dataA);



    /*
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


__twsEvent_nextValidId
  .compute(function(x)
  {
    log(x[1] * 1);
    __orderID.appear(x[1] * 1);

    if (__twsconnection.val == false)
    {
      __twsconnection.appear(true);
      log("tws connected");
      tws_reqMktData();
      //  tws.reqPosition();


      //tws.initClearOrder();
    }

  });

__twsEvent_connectionClosed
  .compute(function(x)
  {
    log('connectionClosed');
  });

__twsEvent_tickPrice
  .compute(function(x)
  {
    log('tickPrice');

    var tickerID = x[1] * 1;
    var field = x[2] * 1;
    var price = x[3] * 1;

    log(tickerID);
    log(field);
    log(price);
  });

var tws_connect = function()
{
  log("4. apiClient connecting to the remote TWS/gateway");

  api.connect(hostIP, hostPort, 0);

};
var tws_reqMktData = function()
{
  log("!!reqMktData");

  api.reqMktData(10, eurusd, GENERICTICKS, false, 0);
}







server.listen(6000, function()
{ //'listening' listener

  log('1. nodeTCPserver listening port:6000');
  log('2. api.tcpClientStart()');
  api.tcpClientStart();

  setTimeout(tws_connect, 500);

  start();
  //var timer_logic = require('./timer_logic');
  //var tmr = setInterval(timer_logic, 500);

});



var start = function()
{
  var __clockTL = __();

  var interval = setInterval(function()
  {
    __clockTL.appear(null);

  }, 30000);

  __clockTL
    .compute(function(x)
    {
      var tk = moment().tz('Asia/Tokyo');
      var fx = moment().tz('Europe/London').add(2, 'hours');
      var ld = moment().tz('Europe/London');
      var ny = moment().tz('America/New_York');

      var dstTK;
      var dstFX;
      var dstLD;
      var dstNY;

      if (tk.isDST())
      {
        dstTK = '(DayLight Saving Time)';
      }
      else
      {
        dstTK = '';
      }

      if (fx.isDST())
      {
        dstFX = '(DayLight Saving Time)';
      }
      else
      {
        dstFX = '';
      }

      if (ld.isDST())
      {
        dstLD = '(DayLight Saving Time)';
      }
      else
      {
        dstLD = '';
      }

      if (ny.isDST())
      {
        dstNY = '(DayLight Saving Time)';
      }
      else
      {
        dstNY = '';
      }


      clog('Tokyo    ' + tk.format('YYYY/MM/DD  HH:mm:ss   ') + dstTK);
      clog('FX       ' + fx.format('YYYY/MM/DD  HH:mm:ss   ') + dstFX);
      clog('London   ' + ld.format('YYYY/MM/DD  HH:mm:ss   ') + dstLD);
      clog('NewYork  ' + ny.format('YYYY/MM/DD  HH:mm:ss   ') + dstNY);

      clog(__clockTL.val);

    });

};


//==================