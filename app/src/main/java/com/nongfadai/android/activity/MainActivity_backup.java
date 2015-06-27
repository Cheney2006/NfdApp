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
import android.widget.TextView;

import com.nongfadai.android.R;
import com.nongfadai.android.activity.base.AbstractActivity;
import com.nongfadai.android.application.NfdApplication;
import com.yftools.LogUtil;

public class MainActivity_backup extends AbstractActivity implements SwipeRefreshLayout.OnRefreshListener {

    public static final int BACK_DELAY_MILLIS = 2000;
    public static final String HTTP_M_NONGFADAI_COM_INDEX_HTML = "http://m.nongfadai.com/index.html";
    public static final String HTTP_M_NONGFADAI_COM_PROJECT_LIST_HTML = "https://m.nongfadai.com/project_list.html?tab=3";
    public static final String HTTP_M_NONGFADAI_COM_USER_ACCOUNT_INDEX_HTML = "https://m.nongfadai.com/user/account/index.html";
    public static final String HTTP_M_NONGFADAI_COM_ABOUNT_US_HTML = "https://m.nongfadai.com/about_us.html";
    public static final String HTTP_M_NONGFADAI_COM_LOGIN_HTML = "https://m.nongfadai.com/user/login.html?_z=/user/account/index.html";
    private long mExitTime;
    private WebView webView;
    private SwipeRefreshLayout mSwipeLayout;
    private View netFailure_ll;
    private View loading_ll;
    private TextView error_tv;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getSupportActionBar().hide();
//        netFailure_ll = findViewById(R.id.netFailure_ll);
//        netFailure_ll.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (NfdApplication.isNetworkAvailable()) {
//                    loading_ll.setVisibility(View.VISIBLE);
//                    showNormal();
//                    //webView.reload();
//                    webView.loadUrl(HTTP_M_NONGFADAI_COM_INDEX_HTML);
//                } else {
//                    displayToast("请先连接网络");
//                }
//            }
//        });
        mSwipeLayout = (SwipeRefreshLayout) findViewById(R.id.swipeRefreshLayout);
        mSwipeLayout.setColorSchemeResources(android.R.color.holo_orange_light,
                android.R.color.holo_red_light,
                android.R.color.holo_blue_bright,
                android.R.color.holo_green_light);
        mSwipeLayout.setOnRefreshListener(this);

        loading_ll = findViewById(R.id.loading_ll);
        //error_tv = (TextView) findViewById(R.id.error_tv);

        webView = (WebView) findViewById(R.id.webView);

        WebSettings webSettings = webView.getSettings();
        webView.getSettings().setJavaScriptEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);// 设置允许访问文件数据
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);

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
                if (newProgress >= 100) {
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
                super.onReceivedError(view, errorCode, description, failingUrl);
                //view.loadUrl("file:///android_asset/m.nongfadai.com/error.html");
                webView.setVisibility(View.GONE);
                //error_tv.setVisibility(View.VISIBLE);
                //TODO 这种方式不起作用
//                mSwipeLayout.setRefreshing(false);
                mSwipeLayout.setVisibility(View.GONE);
                // webView.setVisibility(View.GONE);
                showNetError();
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                mSwipeLayout.setRefreshing(true);
            }

            public void onPageFinished(WebView view, String url) {
                if (loading_ll.getVisibility() == View.VISIBLE) {
                    loading_ll.setVisibility(View.GONE);
                }
                mSwipeLayout.setVisibility(View.VISIBLE);
                showNormal();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }


            @Override
            public void onLoadResource(WebView view, String url) {
                super.onLoadResource(view, url);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return super.shouldInterceptRequest(view, request);
            }
        });
        if (NfdApplication.isNetworkAvailable()) {
            webView.loadUrl(HTTP_M_NONGFADAI_COM_INDEX_HTML);
        } else {
            mSwipeLayout.setVisibility(View.GONE);
            showNetError();
        }
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
        if (loading_ll.getVisibility() == View.VISIBLE) {
            loading_ll.setVisibility(View.GONE);
        }
        netFailure_ll.setVisibility(View.VISIBLE);
    }

    private void showNormal() {
        netFailure_ll.setVisibility(View.GONE);
    }


    @Override
    public void onRefresh() {
        if (NfdApplication.isNetworkAvailable()) {
            mSwipeLayout.setVisibility(View.VISIBLE);
            webView.reload();
            showNormal();
        } else {
            mSwipeLayout.setVisibility(View.GONE);
            mSwipeLayout.setRefreshing(false);
            showNetError();
        }
    }
}
