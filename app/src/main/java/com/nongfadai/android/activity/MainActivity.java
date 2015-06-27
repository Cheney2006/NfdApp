package com.nongfadai.android.activity;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.widget.SwipeRefreshLayout;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewStub;
import android.webkit.JsResult;
import android.webkit.WebBackForwardList;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.nongfadai.android.R;
import com.nongfadai.android.activity.base.AbstractActivity;
import com.nongfadai.android.application.NfdApplication;
import com.nongfadai.android.view.ScrollSwipeRefreshLayout;
import com.yftools.LogUtil;
import com.yftools.util.FileUtil;
import com.yftools.util.StorageUtil;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AbstractActivity implements SwipeRefreshLayout.OnRefreshListener {

    public static final int BACK_DELAY_MILLIS = 2000;
    public static final String HTTP_M_NONGFADAI_COM_INDEX_HTML = "http://m.nongfadai.com/index.html";
    public static final String HTTP_M_NONGFADAI_COM_PROJECT_LIST_HTML = "http://m.nongfadai.com/project_list.html?tab=3";
    public static final String HTTP_M_NONGFADAI_COM_USER_ACCOUNT_INDEX_HTML = "https://m.nongfadai.com/user/account/index.html";
    public static final String HTTP_M_NONGFADAI_COM_ABOUNT_US_HTML = "https://m.nongfadai.com/about_us.html";
    public static final String HTTP_M_NONGFADAI_COM_LOGIN_HTML = "https://m.nongfadai.com/user/login.html?_z=/user/account/index.html";
    private long mExitTime;
    private WebView webView;
    private ScrollSwipeRefreshLayout mSwipeLayout;
    private ViewStub viewStub;
    private View networkErrorView;
    private View loading_ll;
    private Map<String, String> cacheMap = new HashMap<>();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getSupportActionBar().hide();
        checkVersion();
        viewStub = (ViewStub) findViewById(R.id.netFailure_layout);
        mSwipeLayout = (ScrollSwipeRefreshLayout) findViewById(R.id.swipeRefreshLayout);
        mSwipeLayout.setColorSchemeResources(android.R.color.holo_orange_light,
                android.R.color.holo_red_light,
                android.R.color.holo_blue_bright,
                android.R.color.holo_green_light);
        mSwipeLayout.setOnRefreshListener(this);

        loading_ll = findViewById(R.id.loading_ll);

        webView = (WebView) findViewById(R.id.webView);

        WebSettings webSettings = webView.getSettings();
        webView.getSettings().setJavaScriptEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);// 设置允许访问文件数据
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        //触摸焦点起作用
        webView.requestFocus();
        webView.getSettings().setLoadsImagesAutomatically(true);// 设置可以自动加载图片
        webView.setHorizontalScrollBarEnabled(false);// 设置水平滚动条
        webView.setVerticalScrollBarEnabled(false);// 设置竖直滚动条

        // 设置可以使用localStorage
        webSettings.setDomStorageEnabled(true);
        // 应用可以有数据库
        webSettings.setDatabaseEnabled(true);
        String dbPath = this.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setGeolocationDatabasePath(dbPath);
        // 应用可以有缓存
        webSettings.setAppCacheEnabled(true);
        String appCacheDir = this.getApplicationContext().getDir("cache", Context.MODE_PRIVATE).getPath();
        webSettings.setAppCachePath(appCacheDir);

        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress == 100) {
                    //隐藏进度条
                    mSwipeLayout.setRefreshing(false);
                } else {
                    if (!mSwipeLayout.isRefreshing())
                        mSwipeLayout.setRefreshing(true);
                }
                super.onProgressChanged(view, newProgress);
            }

            //支持alert弹出
            @Override
            public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
                return super.onJsAlert(view, url, message, result);
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
                return super.onJsConfirm(view, url, message, result);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                //super.onReceivedError(view, errorCode, description, failingUrl);
                LogUtil.d("onReceivedError");
                //只能通过加载自定义错误页面或者加载一个TextView
                view.loadUrl("file:///android_asset/error.html");
                // webView.setVisibility(View.GONE);
                // error_tv.setVisibility(View.VISIBLE);

                //TODO 这种方式不起作用，对于LinearLayout也同样不起作用。
//                mSwipeLayout.setRefreshing(false);
//                mSwipeLayout.setVisibility(View.GONE);
//                webView.setVisibility(View.GONE);
//                showNetError();
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                // mSwipeLayout.setRefreshing(true);
            }

            public void onPageFinished(WebView view, String url) {
                //  mSwipeLayout.setVisibility(View.VISIBLE);
                if (loading_ll.getVisibility() == View.VISIBLE) {
                    loading_ll.setVisibility(View.GONE);
                }
                showNormal();
            }

            //拦截url加载,除资源请求的url
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                LogUtil.d("shouldOverrideUrlLoading url=" + url);
                if (NfdApplication.isNetworkAvailable()) {
                    view.loadUrl(url);
                } else {
                    //mSwipeLayout.setVisibility(View.GONE);
                    showNetError();
                }
                return true;
            }

            /**
             * 拦截所有url请求 非UI纯种
             * @param view
             * @param url
             * @return
             */
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                LogUtil.d("shouldInterceptRequest url=" + url + ";threadInfo" + Thread.currentThread());
                WebResourceResponse response = null;
                String path = url.replace("http://", "").replace("https://", "");
                String mime = "";
                if (url.contains(".html")) {
                    mime = "text/html";
                    path = path.substring(0, path.indexOf(".html") + 5);
                } else if (url.contains(".css")) {
                    mime = "text/css";
                    path = path.substring(0, path.indexOf(".css") + 4);
                } else if (url.contains(".js")) {
                    mime = "application/javascript";
                    path = path.substring(0, path.indexOf(".js") + 3);
                } else if (url.contains(".jpg")) {
                    mime = "image/jpg";
                    path = path.substring(0, path.indexOf(".jpg") + 4);
                } else if (url.contains(".png")) {
                    mime = "image/png";
                    path = path.substring(0, path.indexOf(".png") + 4);
                } else if (url.contains(".gif")) {
                    mime = "image/gif";
                    path = path.substring(0, path.indexOf(".gif") + 4);
                } else if (url.contains(".ico")) {
                    mime = "image/ico";
                    path = path.substring(0, path.indexOf(".ico") + 4);
                }
                LogUtil.d("res path=" + path);
                //拉取一个指令 如果该指令  判断系统时间，如果系统时间为xx天，自动丢掉本地缓存的html
                //如果后台通知前端展示
                //数据先用假数据
                InputStream is = null;
                try {
                    //先从内存中取
                    // 如果没有软引用，或者从软引用中得到的实例是null，重新构建一个实例，并保存对这个新建实例的软引用
                    //TODO 缓存时将报销
                    //is = FileCache.getInstance().getFileStream(path);
                    is = new ByteArrayInputStream(cacheMap.get(path).getBytes());
                    if (is == null) {
                        //先从sd卡取
                        String sdFilePath = StorageUtil.getDiskDir(mContext) + FileUtil.getFileSeparator() + path;
                        File file = new File(sdFilePath);
                        if (file.exists()) {//从sd卡中取
                            is = new FileInputStream(file);
                        } else {//从asset中取
                            LogUtil.d("assets path=" + path);
                            //is = getResources().getAssets().open(path);
                            is = getClass().getResourceAsStream("/assets/" + path);
                        }
                        if (is != null) {
                            // FileCache.getInstance().addCacheBitmap(is, path);
                            cacheMap.put(path, inputStream2String(is));
                        }
                    }
                    if (is != null) {//&&is.available()>0
                        response = new WebResourceResponse(mime, "UTF-8", is);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                } finally {
                    //TODO 流不能关闭
//                    if (is != null) {
//                        try {
//                            is.close();
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
//                    }
                }
                return response;
            }

            @Override
            public void onLoadResource(WebView view, String url) {
                super.onLoadResource(view, url);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                //  LogUtil.d("shouldInterceptRequest url=" + view.getUrl());
                return super.shouldInterceptRequest(view, request);
            }
        });
        if (NfdApplication.isNetworkAvailable()) {
            webView.loadUrl(HTTP_M_NONGFADAI_COM_INDEX_HTML);
        } else {
            //mSwipeLayout.setVisibility(View.GONE);
            showNetError();
        }
    }

    public String inputStream2String(InputStream is) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int i = -1;
        while ((i = is.read()) != -1) {
            baos.write(i);
        }
        return baos.toString();
    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //判断是否可以返回操作
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            //获取历史列表
            WebBackForwardList mWebBackForwardList = webView.copyBackForwardList();
            String topUrl = HTTP_M_NONGFADAI_COM_INDEX_HTML;
            if (mWebBackForwardList != null && mWebBackForwardList.getSize() > 0) {
                topUrl = mWebBackForwardList.getItemAtIndex(mWebBackForwardList.getSize() - 1).getUrl();
            }
            LogUtil.d("topUrl=" + topUrl);
            //判断当前历史列表是否最顶端,其实canGoBack已经判断过
            if (webView.canGoBack() && !topUrl.equals(HTTP_M_NONGFADAI_COM_INDEX_HTML) && !topUrl.equals(HTTP_M_NONGFADAI_COM_PROJECT_LIST_HTML)
                    && !topUrl.equals(HTTP_M_NONGFADAI_COM_USER_ACCOUNT_INDEX_HTML) && !topUrl.equals(HTTP_M_NONGFADAI_COM_ABOUNT_US_HTML)
                    && !topUrl.equals(HTTP_M_NONGFADAI_COM_LOGIN_HTML)) {
                //执行跳转逻辑
                webView.goBack();
            } else {
                if ((System.currentTimeMillis() - mExitTime) > BACK_DELAY_MILLIS) {
                    displayToast("再按一次返回桌面");
                    mExitTime = System.currentTimeMillis();
                } else {
                    moveTaskToBack(false);
                }
            }

        }
        return true;
    }

    private void showNetError() {
        // not repeated infalte
        loading_ll.setVisibility(View.GONE);
        if (networkErrorView != null) {
            networkErrorView.setVisibility(View.VISIBLE);
            return;
        }
        networkErrorView = viewStub.inflate();
//        viewStub.setVisibility(View.VISIBLE);   // ViewStub被展开后的布局所替换
//        networkErrorView = findViewById(R.id.netFailure_layout); // 获取展开后的布局
        View netFailure_ll = networkErrorView.findViewById(R.id.online_error_btn_retry);
        netFailure_ll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (NfdApplication.isNetworkAvailable()) {
                    loading_ll.setVisibility(View.VISIBLE);
                    showNormal();
                    //webView.reload();
                    webView.loadUrl(HTTP_M_NONGFADAI_COM_INDEX_HTML);
                } else {
                    displayToast("请先连接网络");
                }
            }
        });
    }

    private void showNormal() {
        if (networkErrorView != null) {
            networkErrorView.setVisibility(View.GONE);
        }
    }


    @Override
    public void onRefresh() {
        if (NfdApplication.isNetworkAvailable()) {
            // mSwipeLayout.setVisibility(View.VISIBLE);
            webView.reload();
            showNormal();
        } else {
            //mSwipeLayout.setVisibility(View.GONE);
            mSwipeLayout.setRefreshing(false);
            showNetError();
        }
    }
}
