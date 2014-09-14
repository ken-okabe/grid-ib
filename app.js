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
java.classpath.push('./api971');

var API = java.import('com.ib.client.Aapi');
var api = new API();

var GENERICTICKS = "";

var TickType = java.import('com.ib.client.TickType');
var Contract = java.import('com.ib.client.Contract');

var eurusd = new Contract();
eurusd.m_localSymbol = "EUR.USD";
eurusd.m_secType = "CASH";
eurusd.m_currency = "USD";
eurusd.m_exchange = "IDEALPRO";

var usdjpy = new Contract();
usdjpy.m_localSymbol = "USD.JPY";
usdjpy.m_secType = "CASH";
usdjpy.m_currency = "JPY";
usdjpy.m_exchange = "IDEALPRO";

var __twsEvent_nextValidId = __();
var __twsEvent_connectionClosed = __();

var __twsEvent_tickPrice = __();

var __twsconnection = __();
__twsconnection.appear(false);

var __orderID = __();

var __bidEURUSD = __();
var __askEURUSD = __();
var __spreadEURUSD = __();

var __lastTickFXTimeEURUSD = __();

var __bidUSDJPY = __();
var __askUSDJPY = __();
var __spreadUSDJPY = __();

var __lastTickFXTimeUSDJPY = __();

__bidEURUSD.appear(0);
__askEURUSD.appear(0);
__spreadEURUSD.appear(0);

__bidUSDJPY.appear(0);
__askUSDJPY.appear(0);
__spreadUSDJPY.appear(0);


var __protocolEURUSD = {
  //from file
  dt: __(),
  posString: __(), //long short flat
  losscut: __(),
  size: __(),
  LC: __(),

  //calc here
  pos: __()
};

var __twsEURUSD = {
  pos: __(),
  losscut: __()
};

var __protocolUSDJPY = {
  //from file
  dt: __(),
  posString: __(), //long short flat
  losscut: __(),
  size: __(),
  LC: __(),

  //calc here
  pos: __()
};

var __twsUSDJPY = {
  pos: __(),
  losscut: __()
};


var net = require('net');
var server = net.createServer(function(c)
{ //'connection' listener
  log('3. api.tcpClient connected to this nodeTCPserver');
  c.on('data', function(data)
  {
    //  log(data.toString('utf-8'));

    var dataA0 = data.toString('utf-8').split('#');

    dataA0.map(function(a, i)
    {
      if (i !== 0)
      {


        var dataA = a.split('@');

        if (dataA[0] == 'error')
          log('error:' + dataA[1]);
        if (dataA[0] == 'tcpClientStart')
          log('tcpClientStart');
        if (dataA[0] == 'nextValidId')
          __twsEvent_nextValidId.appear(dataA);
        if (dataA[0] == 'connectionClosed')
          __twsEvent_connectionClosed.appear(null);
        if (dataA[0] == 'tickPrice')
          __twsEvent_tickPrice.appear(dataA);
      }
    });


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
    __twsconnection.appear(false);
    log('tws connectionClosed');

    //   a.TWSposition = 0;

    __bidEURUSD.appear(0);
    __askEURUSD.appear(0);
    __spreadEURUSD.appear(0);

    __bidUSDJPY.appear(0);
    __askUSDJPY.appear(0);
    __spreadUSDJPY.appear(0);
  });

__twsEvent_tickPrice
  .compute(function(x)
  {
    var tickerID = x[1] * 1;
    var field = x[2] * 1;
    var price = x[3] * 1;



    if (price > 0)
    {
      if (tickerID == 10) //eurusd
      {
        if (field == TickType.BID) //bid
          __bidEURUSD.appear(price);
        if (field == TickType.ASK) //ask
          __askEURUSD.appear(price);

        if (__bidEURUSD.val * __askEURUSD.val != 0)
          __spreadEURUSD.appear(Math.round((__askEURUSD.val - __bidEURUSD.val) * 100000) / 10);

        __lastTickFXTimeEURUSD.appear(moment().tz('Europe/London').add(2, 'hours').format('YYYY/MM/DD   HH:mm:ss   '));
      }
      if (tickerID == 20) //usdjpy
      {
        if (field == TickType.BID) //bid
          __bidUSDJPY.appear(price);
        if (field == TickType.ASK) //ask
          __askUSDJPY.appear(price);
        if (__bidUSDJPY.val * __askUSDJPY.val != 0)
          __spreadUSDJPY.appear(Math.round((__askUSDJPY.val - __bidUSDJPY.val) * 1000) / 10);

        __lastTickFXTimeUSDJPY.appear(moment().tz('Europe/London').add(2, 'hours').format('YYYY/MM/DD   HH:mm:ss   '));
      }
    }


  });

var tws_connect = function()
{
  log("4. apiClient connecting to the remote TWS/gateway");

  api.connect(hostIP, hostPort, 0);

};
var tws_reqMktData = function()
{
  log("!!reqMktData");

  var ArrayList = java.import('java.util.ArrayList');
  var list = new ArrayList();

  api.reqMktData(10, eurusd, GENERICTICKS, false, list);
  api.reqMktData(20, usdjpy, GENERICTICKS, false, list);
}
if (!String.prototype.trim)
{
  String.prototype.trim = function()
  {
    return this.toString().replace(/^\s+|\s+$/g, '');
  };
}


String.prototype.replaceAll = function(org, dest)
{  
  return this.split(org).join(dest);
};

var readProtocol = function()
{
  var fs = require('fs');

  (function()
  {
    fs.readFile('R://files/EURUSD.txt', 'utf8', function(err, text)
    {
      var text1 = text.replaceAll('\r', '@').replaceAll('\n', '@');
      //log(text1);
      var text1A = text1.split('@');
      var xx = text1A[1];
      var text2 = text1.replaceAll(xx, '');
      var text2A = text2.split('@@');

      __protocolEURUSD.dt.appear(text2A[0].slice(2));
      __protocolEURUSD.posString.appear(text2A[1]);
      __protocolEURUSD.losscut.appear(text2A[2] * 1);
      __protocolEURUSD.size.appear(text2A[3] * 1);
      __protocolEURUSD.LC.appear(text2A[4] * 1);

      var d;
      if (__protocolEURUSD.posString.val === 'long')
        d = 1;
      if (__protocolEURUSD.posString.val === 'short')
        d = -1;
      if (__protocolEURUSD.posString.val === 'flat')
        d = 0;

      __protocolEURUSD.pos.appear(d * __protocolEURUSD.size.val);

      log(__protocolEURUSD.pos.val);

    });
  })();

  (function()
  {
    fs.readFile('R://files/USDJPY.txt', 'utf8', function(err, text)
    {
      var text1 = text.replaceAll('\r', '@').replaceAll('\n', '@');
      //log(text1);
      var text1A = text1.split('@');
      var xx = text1A[1];
      var text2 = text1.replaceAll(xx, '');
      var text2A = text2.split('@@');

      __protocolUSDJPY.dt.appear(text2A[0].slice(2));
      __protocolUSDJPY.posString.appear(text2A[1]);
      __protocolUSDJPY.losscut.appear(text2A[2] * 1);
      __protocolUSDJPY.size.appear(text2A[3] * 1);
      __protocolUSDJPY.LC.appear(text2A[4] * 1);

      var d;
      if (__protocolUSDJPY.posString.val === 'long')
        d = 1;
      if (__protocolUSDJPY.posString.val === 'short')
        d = -1;
      if (__protocolUSDJPY.posString.val === 'flat')
        d = 0;

      __protocolUSDJPY.pos.appear(d * __protocolUSDJPY.size.val);

      log(__protocolUSDJPY.pos.val);

    });
  })();

};



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

  }, 300);

  __clockTL
    .compute(function(x)
    {


      readProtocol();


      //------------


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

      clog('========================================================');

      clog('Tokyo    ' + tk.format('YYYY/MM/DD   HH:mm:ss   dddd  ') + '(no DST)');
      clog('FX       ' + fx.format('YYYY/MM/DD   HH:mm:ss   ') + dstFX);
      clog('London   ' + ld.format('YYYY/MM/DD   HH:mm:ss   ') + dstLD);
      clog('NewYork  ' + ny.format('YYYY/MM/DD   HH:mm:ss   ') + dstNY);
      clog('--------------------------------------------------------');
      clog('EURUSD  ' + __askEURUSD.val.toFixed(5));
      clog('             ' + __spreadEURUSD.val);
      clog('        ' + __bidEURUSD.val.toFixed(5));
      clog('         ' + __lastTickFXTimeEURUSD.val);
      clog('protocol');
      clog('         ' + __protocolEURUSD.dt.val);
      clog('         ' + __protocolEURUSD.pos.val + ' (' + __protocolEURUSD.posString.val + ' ' + __protocolEURUSD.size.val + ')');
      clog('         ' + __protocolEURUSD.losscut.val);
      clog('');
      clog('--------------------------------------------------------');
      clog('USDJPY  ' + __askUSDJPY.val.toFixed(3));
      clog('             ' + __spreadUSDJPY.val);
      clog('        ' + __bidUSDJPY.val.toFixed(3));
      clog('         ' + __lastTickFXTimeUSDJPY.val);
      clog('protocol');
      clog('         ' + __protocolUSDJPY.dt.val);
      clog('         ' + __protocolUSDJPY.pos.val + ' (' + __protocolUSDJPY.posString.val + ' ' + __protocolUSDJPY.size.val + ')');
      clog('         ' + __protocolUSDJPY.losscut.val);
      clog('');
    });

};


//==================