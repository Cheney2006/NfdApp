package com.nfd.nfdapp.application;


import com.nfd.nfdapp.constants.ConfigManager;
import com.yftools.LogUtil;
import com.yftools.util.AndroidUtil;

public class NfdApplication extends BaseApplication {


    @Override
    public void onCreate() {
        //这里可以通过配置文件来设置是否启用输入日志到文件
        isLogOutFile = ConfigManager.getInstance(this).isLogOutFile();
        super.onCreate();
        LogUtil.d("屏幕宽度：" + AndroidUtil.getDisplayWidth(this) + "\n屏幕高度：" + AndroidUtil.getDisplayHeight(this) + "\n手机dpi：" + AndroidUtil.getDensity(this));

    }


    @Override
    public void onTerminate() {
        super.onTerminate();
    }


}
