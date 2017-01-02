package com.seoo.util;

import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.util.Enumeration;

public final class GUID{
  private final static char[] digits={//
  /**/'0','1','2','3','4','5','6','7',//
      '8','9','A','B','C','D','E','F',//
      'G','H','I','J','K','L','M','N',//
      'O','P','Q','R','S','T','U','V',//
      'W','X','Y','Z','a','b','c','d',//
      'e','f','g','h','i','j','k','l',//
      'm','n','o','p','q','r','s','t',//
      'u','v','w','x','y','z','+','_'//
  };
  private static volatile SecureRandom numberGenerator=new SecureRandom();
  private static final long netHash=netHash();
  private static final int TIME_LENGTH=7;
  private static final int NETHASH_LENGTH=3;
  // private static final int ROUND_LENGTH=3;
  private static final int RANDOM_LENGTH=6;
  private static final int DEFAULT_RADIO=62;
  private static final int MIN_LENGTH=TIME_LENGTH+NETHASH_LENGTH/* +ROUND_LENGTH */+RANDOM_LENGTH;
  // private static final AtomicLong atomicSeq=new AtomicLong(0);
  private static long lastTime=System.currentTimeMillis();

  /**
   * @param timeLength 时间微秒数占位，通常7位时间微秒数能够使用到未来50年以上；
   * @param netHashLength 网卡MAC地址哈希码占位
   * @param roundLength 循环计数器占位
   * @param randomLength 随机数占位
   * @param radio 输出字符进制
   * @return 指定参数的强序列号
   */
  public static String next(int timeLength,int netHashLength/* ,int roundLength */,int randomLength,int radio){
    if(radio>digits.length) radio=digits.length;
    StringBuilder buffer=new StringBuilder();
    if(randomLength>0){
      byte[] bytes=new byte[randomLength];
      numberGenerator.nextBytes(bytes);
      int balance=0;
      for(int i=0;i<randomLength;i++){
        int v=bytes[i]&0xFF;
        int index=v+balance;
        index%=radio;
        balance=v/radio;
        buffer.append(digits[index]);
      }
    }
    // if(roundLength>0){
    // atomicSeq.compareAndSet(Long.MAX_VALUE,0);
    // long seq=atomicSeq.getAndIncrement();
    // for(int i=0;i<roundLength;i++){
    // buffer.append(digits[(int)(seq%radio)]);
    // seq/=radio;
    // }
    // }
    if(netHashLength>0){
      long hash=netHash;
      for(int i=0;i<netHashLength;i++){
        buffer.append(digits[(int)(hash%radio)]);
        hash/=radio;
      }
    }
    if(timeLength>0){
      long t=System.currentTimeMillis();
      synchronized(GUID.class){
        if(t>lastTime) lastTime=t;
        else t=++lastTime;
      }
      for(int i=0;i<timeLength;i++){
        buffer.append(digits[(int)(t%radio)]);
        t/=radio;
      }
    }
    return buffer.reverse().toString();
  }

  public static String next(int length){
    if(length<MIN_LENGTH) length=MIN_LENGTH;
    int randomLength=length-TIME_LENGTH-NETHASH_LENGTH/*-ROUND_LENGTH*/;
    return next(TIME_LENGTH,NETHASH_LENGTH/* ,ROUND_LENGTH */,randomLength,DEFAULT_RADIO);
  }

  private static long netHash(){
    long hash=0;
    try{
      Enumeration<NetworkInterface> nis=NetworkInterface.getNetworkInterfaces();
      while(nis.hasMoreElements()){
        NetworkInterface ni=nis.nextElement();
        byte[] bytes=ni.getHardwareAddress();
        if(bytes!=null) for(byte b:bytes)
          hash=((hash<<5)+hash+(b&0xFF));
      }
      hash=Math.abs(hash);
    }catch(Exception e){
      hash=Math.abs(numberGenerator.nextLong());
    }
    return hash;
  }
}
