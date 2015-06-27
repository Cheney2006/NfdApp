package com.nongfadai.android.activity.base;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.nongfadai.android.utils.UrlManager;
import com.yftools.HttpUtil;
import com.yftools.LogUtil;
import com.yftools.exception.HttpException;
import com.yftools.exception.JsonException;
import com.yftools.http.ResponseInfo;
import com.yftools.http.callback.RequestCallBack;
import com.yftools.json.Json;
import com.yftools.util.AndroidUtil;
import com.yftools.util.FileUtil;
import com.yftools.util.StorageUtil;

import java.io.File;
import java.io.IOException;
import java.util.Date;

/**
 * *****************************************
 * Description ：基础类，一些基础的操作（eg:全局广播，信息提示，退出等。）
 * Created by cy on 2015/06/21.
 * *****************************************
 */
public abstract class AbstractActivity extends AppCompatActivity {

    protected Context mContext;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = AbstractActivity.this;
        //注册全局广播
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    public void displayToast(String msg) {
        Toast.makeText(mContext, msg, Toast.LENGTH_SHORT).show();
    }

    /**
     * 版本检测
     */
    protected void checkVersion() {
        //TODO 取下载地址
        // mContext, "正在检查版本信息...",
        HttpUtil.getInstance().send(UrlManager.parseBaseUrl("mobileVersion!version.action"), new RequestCallBack<String>() {
            @Override
            public void onSuccess(ResponseInfo<String> responseInfo) {
                if (responseInfo.result != null) {
                    try {
                        Json json = new Json(responseInfo.result);
                        if (json.getBoolean("success")) {
                            validateVersion(json);
                        } else {
                            displayToast(json.getString("message"));
                        }
                    } catch (JsonException e) {
                        LogUtil.e(e);
                        displayToast("JSON格式解析错误");
                    }
                }
            }

            @Override
            public void onFailure(HttpException error, String msg) {
                LogUtil.d(error);
                displayToast(msg);
            }
        });
    }

    protected void validateVersion(Json data) {
        try {
            int version = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0).versionCode;
            int versionServer = data.getInt("version");
            final String apkPath = data.getString("filePath");
            LogUtil.d("version=" + version + ",versionServer=" + versionServer);
            if (version < versionServer) {
                //downloadConfirm(apkPath);
                //后台下载
                downloadApk(apkPath);
            } else {
                //displayToast("已经为最新版本");
                //最新版本就删除
                if(apkPath.endsWith(".zip")){
                    FileUtil.deleteFile(StorageUtil.getDiskDir(mContext) + "nongfadai.zip");
                }else{
                    FileUtil.deleteFile(StorageUtil.getDiskDir(mContext) + "nongfadai.apk");
                }
            }
        } catch (PackageManager.NameNotFoundException e) {
            displayToast("数据解析失败");
        } catch (IOException e) {
            LogUtil.e(e);
        }
    }

    private void downloadConfirm(final String url) {
//        new JxdAlertDialog(mContext, "提示", "检查到新的版本，是否升级?", "确定", null, "取消") {
//            @Override
//            protected void positive() {
//                downloadApk(ParamManager.parseDownUrl(url));
//            }
//        }.show();
    }

    private void downloadApk(final String url) {
        // 更新软件
        File downloadFile = null;
        if(url.endsWith(".zip")){//WebView缓存
            new File(StorageUtil.getDiskDir(mContext), "nongfadai.zip");
        }else{
            new File(StorageUtil.getDiskDir(mContext), "nongfadai.apk");
        }
        HttpUtil.getInstance().downloadInDialog(mContext, "正在下载", ProgressDialog.STYLE_HORIZONTAL, url, downloadFile.getAbsolutePath(),
                true, // 如果目标文件存在，接着未完成的部分继续下载。服务器不支持RANGE时将从新下载。
                false, // 如果从请求返回信息中获取到文件名，下载完成后自动重命名。
                new RequestCallBack<File>() {
                    @Override
                    public void onSuccess(ResponseInfo<File> responseInfo) {
                        if(url.endsWith(".zip")){
                            try {
                                //TODO 最好放到线程中处理
                                FileUtil.unZipFile(responseInfo.result, StorageUtil.getDiskDir(mContext));
                            } catch (IOException e) {
                                LogUtil.e(e);
                            }
                        }else{
                             AndroidUtil.viewFile(mContext, responseInfo.result);
                            //  displayToast("下载成功");
                        }
                    }

                    @Override
                    public void onFailure(HttpException error, String msg) {
                        displayToast(msg);
                    }
                });
    }
}
