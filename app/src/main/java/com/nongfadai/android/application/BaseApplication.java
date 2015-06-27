package com.nongfadai.android.application;

import android.app.Application;
import android.content.Context;
import android.os.PowerManager;

import com.nongfadai.android.constants.ConfigManager;
import com.yftools.LogUtil;
import com.yftools.datetimestate.DateTimeChangeObserver;
import com.yftools.datetimestate.DateTimeStateReceiver;
import com.yftools.exception.CustomCrashHandler;
import com.yftools.log.PrintToFileLogger;
import com.yftools.netstate.NetChangeObserver;
import com.yftools.netstate.NetWorkUtil;
import com.yftools.netstate.NetworkStateReceiver;
import com.yftools.sdstate.SDChangeObserver;
import com.yftools.sdstate.SDStateReceiver;
import com.yftools.util.StorageUtil;

import java.io.File;

public abstract class BaseApplication extends Application {
    private static final String LOG_PREFIX = "nfd_";
    protected static Context context;
    protected static String packageName;
    protected static NetChangeObserver netChangeObserver;
    protected static SDChangeObserver sdChangeObserver;
    protected static DateTimeChangeObserver dateTimeChangeObserver;
    protected static PowerManager.WakeLock wl;

    protected boolean isLogOutFile = false;

    @Override
    public void onCreate() {
        super.onCreate();
        context = this;
        LogUtil.customTagPrefix = LOG_PREFIX;
        if (isLogOutFile) {
            PrintToFileLogger.setLogFilePath(StorageUtil.getDiskDir(context, "log") + File.separator + LOG_PREFIX);
            LogUtil.addLogger(new PrintToFileLogger());
        }
        LogUtil.setLogLevel(ConfigManager.getInstance(this).getLogLevel());
        packageName = getPackageName();
        //设置异常处理类
        CustomCrashHandler.getInstance().setCustomCrashHandler(this);

        BaseApplication.netChangeObserver = new NetChangeObserver() {
            @Override
            public void onConnect(NetWorkUtil.NetType type) {
                super.onConnect(type);
                LogUtil.d("网络连接开启:" + type);
            }

            @Override
            public void onDisConnect() {
                super.onDisConnect();
                LogUtil.d("网络连接关闭");
            }
        };
        NetworkStateReceiver.registerObserver(BaseApplication.netChangeObserver);
        NetworkStateReceiver.registerNetworkStateReceiver(context);

        BaseApplication.sdChangeObserver = new SDChangeObserver() {
            @Override
            public void onMountSD() {
                super.onMountSD();
                LogUtil.d("sdcard载人成功");
            }

            @Override
            public void onRemoveSD() {
                super.onRemoveSD();
                LogUtil.d("sdcard没有载入");
            }
        };
        SDStateReceiver.registerObserver(BaseApplication.sdChangeObserver);
        SDStateReceiver.registerSDStateReceiver(context);

        BaseApplication.dateTimeChangeObserver = new DateTimeChangeObserver() {
            @Override
            public void onChange() {
                LogUtil.d("日期时间发生改变...");
            }
        };
        DateTimeStateReceiver.registerObserver(BaseApplication.dateTimeChangeObserver);
        DateTimeStateReceiver.registerDateTimeStateReceiver(context);

    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        NetworkStateReceiver.unRegisterNetworkStateReceiver(context);
        SDStateReceiver.unRegisterSDStateReceiver(context);
        DateTimeStateReceiver.unRegisterDateTimeStateReceiver(context);
    }


    /**
     * 获取一个应用上下文
     *
     * @return Context
     */
    public static Context getContext() {
        return context;
    }

    /**
     * 当前网络是否可用
     *
     * @return false为无网络 true为网络可用
     */
    public static Boolean isNetworkAvailable() {
        return NetworkStateReceiver.isNetworkAvailable();
    }

    /**
     * 当前sdcard是否可用
     *
     * @return null为不可用 否则返回sdcard操作目录路径
     */
    public static String getSdcardAvailable() {
        return SDStateReceiver.getSdcardPath();
    }

    public static String getPackName() {
        return BaseApplication.packageName;
    }

    /**
     * 保持Cpu唤醒状态
     */
    public static void setCpuKeepOn() {
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MyTag");
        wl.acquire();
    }

    /**
     * 释放WL
     */
    public static void releaseCpuWL() {
        if (wl != null) {
            wl.release();
            wl = null;
        }
    }
}
