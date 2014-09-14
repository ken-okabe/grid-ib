//   /cygdrive/c/Program\ Files/Java/jdk1.7.0_67/bin/javac *.java

package com.ib.client;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import java.io.DataOutputStream;
import java.net.Socket;
import java.net.SocketException;


import com.ib.client.CommissionReport;
import com.ib.client.Contract;
import com.ib.client.ContractDetails;
import com.ib.client.EClientSocket;
import com.ib.client.EWrapper;
import com.ib.client.Execution;
import com.ib.client.Order;
import com.ib.client.OrderState;
import com.ib.client.UnderComp;

public class Aapi implements EWrapper {
  EClientSocket m_s = new EClientSocket(this);

  private Socket tcpClient;
  private PrintWriter pw;

  public void Aapi() {
     /* */
     java.lang.System.out.println("Oh! Java");
  }

  public void tcpClientStart()
  {
    try
    {
       tcpClient = new Socket("localhost", 6000);
 DataOutputStream os = new DataOutputStream(tcpClient.getOutputStream());
       pw = new PrintWriter(os);

 String msg = "#tcpClientStart";
 pw.println(msg);
       pw.flush();

    }
    catch(IOException e)
    {}
  }

  public void connect(String hostIP, int hostPort, int clientId)
  {
     m_s.eConnect(hostIP, hostPort, clientId);
  }

  public void disconnect() {
     m_s.eDisconnect();
  }
  //-------------------------
  public void reqMktData(int tickerId, Contract contract, String genericTicklist, boolean snapshot, List<TagValue> mktDataOptions)
  {
    m_s.reqMktData(tickerId, contract, genericTicklist, snapshot, mktDataOptions);
  }

  public void placeOrder(int id, Contract contract, Order order)
  {
    m_s.placeOrder(id, contract, order);
  }

  public void reqAccountUpdates(boolean subscribe, String acctCode)
  {
    m_s.reqAccountUpdates(subscribe, acctCode) ;
  }

  public void cancelOrder(int id)
  {
    m_s.cancelOrder(id);
  }

  public void reqOpenOrders()
  {
    m_s.reqOpenOrders();
  }

  public void reqAutoOpenOrders(boolean bAutoBind)
  {
    m_s.reqAutoOpenOrders(bAutoBind);
  }

  public void reqAllOpenOrders()
  {
    m_s.reqAllOpenOrders();
  }

  @Override public void nextValidId(int orderId) {

           String msg = "#nextValidId"+"@"+orderId;
           pw.println(msg);
           pw.flush();
  }

  @Override public void error(Exception e) {

      String msg  = "#error"+"@exception e(java)";
      pw.println(msg);
      pw.flush();
   }

  @Override public void error(String str) {

      String msg  = "#error"+"@"+str;
      pw.println(msg);
      pw.flush();
   }

  @Override public void error(int id, int errorCode, String errorMsg) {

      String msg  = "#error"+"@"+errorMsg;
      pw.println(msg);
      pw.flush();
   }

  @Override public void connectionClosed() {

      String msg  = "#connectionClosed";
      pw.println(msg);
      pw.flush();
   }



  @Override public void tickPrice(int tickerId, int field, double price, int canAutoExecute) {

//java.lang.System.out.println(tickerId);
/*
java.lang.System.out.println("--Java--");
java.lang.System.out.println(field);
java.lang.System.out.println(price);
java.lang.System.out.println("--------");
*/
  String msg = "#tickPrice"
                +"@"+String.valueOf(tickerId)
                +"@"+String.valueOf(field)
                +"@"+String.valueOf(price);
  pw.println(msg);
  pw.flush();


  }

  @Override public void tickSize(int tickerId, int field, int size) {
  }

  @Override public void tickOptionComputation(int tickerId, int field, double impliedVol, double delta, double optPrice, double pvDividend, double gamma, double vega, double theta, double undPrice) {
  }

  @Override public void tickGeneric(int tickerId, int tickType, double value) {
  }

  @Override public void tickString(int tickerId, int tickType, String value) {
  }

  @Override public void tickEFP(int tickerId, int tickType, double basisPoints, String formattedBasisPoints, double impliedFuture, int holdDays, String futureExpiry, double dividendImpact,
      double dividendsToExpiry) {
  }

  @Override public void orderStatus(int orderId, String status, int filled, int remaining, double avgFillPrice, int permId, int parentId, double lastFillPrice, int clientId, String whyHeld) {

  String msg = "#orderStatus"+"@"+String.valueOf(orderId)+"@"+status;
  pw.println(msg);
  pw.flush();

  }

  @Override public void openOrder(int orderId, Contract contract, Order order, OrderState orderState) {


     String msg = "#openOrder"+"@"+String.valueOf(orderId)+"@"+ contract.m_localSymbol;
     pw.println(msg);
     pw.flush();
  }

  @Override public void openOrderEnd() {
  }

  @Override public void updateAccountValue(String key, String value, String currency, String accountName) {
  }

  @Override public void updatePortfolio(Contract contract, int position, double marketPrice, double marketValue, double averageCost, double unrealizedPNL, double realizedPNL, String accountName) {


   String msg = "#updatePortfolio"+"@"+contract.m_localSymbol+"@"+String.valueOf(position) ;
   pw.println(msg);
   pw.flush();
  }

  @Override public void updateAccountTime(String timeStamp) {
  }

  @Override public void accountDownloadEnd(String accountName) {
  }

  @Override public void contractDetails(int reqId, ContractDetails contractDetails) {
  }

  @Override public void bondContractDetails(int reqId, ContractDetails contractDetails) {
  }

  @Override public void contractDetailsEnd(int reqId) {
  }

  @Override public void execDetails(int reqId, Contract contract, Execution execution) {
  }

  @Override public void execDetailsEnd(int reqId) {
  }

  @Override public void updateMktDepth(int tickerId, int position, int operation, int side, double price, int size) {
  }

  @Override public void updateMktDepthL2(int tickerId, int position, String marketMaker, int operation, int side, double price, int size) {
  }

  @Override public void updateNewsBulletin(int msgId, int msgType, String message, String origExchange) {
  }

  @Override public void managedAccounts(String accountsList) {
  }

  @Override public void receiveFA(int faDataType, String xml) {
  }

  @Override public void historicalData(int reqId, String date, double open, double high, double low, double close, int volume, int count, double WAP, boolean hasGaps) {
  }

  @Override public void scannerParameters(String xml) {
  }

  @Override public void scannerData(int reqId, int rank, ContractDetails contractDetails, String distance, String benchmark, String projection, String legsStr) {
  }

  @Override public void scannerDataEnd(int reqId) {
  }

  @Override public void realtimeBar(int reqId, long time, double open, double high, double low, double close, long volume, double wap, int count) {
  }

  @Override public void currentTime(long time) {
  }

  @Override public void fundamentalData(int reqId, String data) {
  }

  @Override public void deltaNeutralValidation(int reqId, UnderComp underComp) {
  }

  @Override public void tickSnapshotEnd(int reqId) {
  }

  @Override public void marketDataType(int reqId, int marketDataType) {
  }

  @Override public void commissionReport(CommissionReport commissionReport) {
  }

  @Override public void position(String account, Contract contract, int pos, double avgCost) {
  }

  @Override public void positionEnd() {
  }

  @Override public void accountSummary(int reqId, String account, String tag, String value, String currency) {
  }

  @Override public void accountSummaryEnd(int reqId) {
  }

  @Override public void verifyMessageAPI( String apiData) {
  }

  @Override public void verifyCompleted( boolean isSuccessful, String errorText){
  }

  @Override public void displayGroupList( int reqId, String groups){
  }

  @Override public void displayGroupUpdated( int reqId, String contractInfo){
  }

}
