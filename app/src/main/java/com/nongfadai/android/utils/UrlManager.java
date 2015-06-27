package com.nongfadai.android.utils;


import com.nongfadai.android.application.NfdApplication;
import com.nongfadai.android.constants.ConfigManager;
import com.nongfadai.android.constants.SysConfig;
import com.yftools.http.RequestParams;

/**
 * *****************************************
 * Description ：常量类
 * Created by cy on 2015/3/3.
 * *****************************************
 */
public class UrlManager {

    public static String parseBaseUrl(String path) {
        String urlStr = ConfigManager.getInstance(NfdApplication.getContext()).getWebUrl();
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (urlStr.endsWith("/")) {
            urlStr = urlStr + path;
        } else {
            urlStr = urlStr + "/" + path;
        }
        return urlStr;
    }

    public static RequestParams setDefaultParams() {
        RequestParams params = new RequestParams();
        params.addBodyParameter("userId", SysConfig.getInstance().getUsername());
        params.addBodyParameter("password", SysConfig.getInstance().getPassword());
        return params;
    }
}
