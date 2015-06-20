package com.nfd.nfdapp;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.util.Random;

import org.apache.http.util.EncodingUtils;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import android.webkit.JavascriptInterface;

@SuppressLint({"JavascriptInterface", "SetJavaScriptEnabled"})
public class MainActivity extends Activity {
    private static String LOGTAG = "helloWorld";
    private static Boolean flag = true;
    private ImageView imgView1;

    int i = 0;
    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            String s = String.valueOf(msg.what);
            ImageView tv = (ImageView) findViewById(R.id.imageView1);
            //tv.setText(tv.getText() + "" + s);
            tv.setVisibility(View.GONE);
        }
    };

    Runnable run = new Runnable() {
        @Override
        public void run() {
            Random r = new Random();
            int rnum = r.nextInt((100 - 10) + 1) + 10;
            handler.sendEmptyMessage(rnum);
            handler.postDelayed(run, 5000);
            i++;
            if (i == 5) {
                handler.removeCallbacks(run);
            }
        }
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(LOGTAG, "1create");
        imgView1 = (ImageView) findViewById(R.id.imageView1);
        final WebView webView = (WebView) findViewById(R.id.webView1);
        WebSettings webSettings = webView.getSettings();
        webView.getSettings().setJavaScriptEnabled(true);
        // webview.getSettings().setJavaScriptEnabled(true);// 开启Javascript支持
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);// 设置允许访问文件数据
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.setWebChromeClient(new WebChromeClient());

        webView.getSettings().setLoadsImagesAutomatically(true);// 设置可以自动加载图片
        webView.setHorizontalScrollBarEnabled(false);// 设置水平滚动条
        webView.setVerticalScrollBarEnabled(false);// 设置竖直滚动条

        webView.setWebViewClient(new WebViewClient() {
            public void onPageFinished(WebView view, String url) {
                // webView.setVisibility(View.VISIBLE);
                //imgView1.setVisibility(View.GONE);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                // return super.shouldOverrideUrlLoading(view, url);
                view.loadUrl(url);
                Log.d("helloWorld", "3loaded");
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view,
                                                              String url) {
                Log.i(LOGTAG, "shouldInterceptRequest url=" + url
                        + ";threadInfo" + Thread.currentThread());
                WebResourceResponse response = null;
                if (url.indexOf("/favicon.ico") >= 0) {
                    try {
                        // Toast.makeText(this, "hide imgView",
                        // Toast.LENGTH_SHORT).show();
                        if (MainActivity.flag == true) {
                            handler.post(run);
                        }
                        return null;
                    } catch (Exception ex) {
                        Log.i(LOGTAG, ex.getMessage());
                        return null;
                    }
                }
                String path = url.replace("http://", "");
                String fileExtra = "";
                int p = path.indexOf("?");
                if (p > 0) {
                    path = path.substring(0, p);
                }
                int p2 = path.indexOf("#");
                if (p2 > 0) {
                    path = path.substring(0, p2);
                }
                int p3 = path.lastIndexOf(".");
                if (p3 > 0) {
                    fileExtra = path.substring(p3);
                }
                Log.i(LOGTAG, "res path=" + path);
                Log.i(LOGTAG, "res type=" + fileExtra);
                String mime = "";
                if (fileExtra == "html") {
                    mime = "text/html";
                }
                if (fileExtra == "css") {
                    mime = "text/css";
                }
                if (fileExtra == "js") {
                    mime = "application/javascript";
                }
                if (fileExtra == "jpg") {
                    mime = "image/jpg";
                }
                if (fileExtra == "png") {
                    mime = "image/png";
                }
                if (fileExtra == "ico") {
                    mime = "image/ico";
                }
                // if (fileExtra.contains("logo")) {


                //拉取一个指令 如果该指令  判断系统时间，如果系统时间为xx天，自动丢掉本地缓存的html
                //如果后台通知前端展示
                //数据先用假数据

                if (fileExtra != "html") {
                    try {
                        InputStream localCopy = getAssets().open(path);
                        response = new WebResourceResponse(mime, "UTF-8", localCopy);
                    } catch (IOException e) {
                        e.printStackTrace();

                        //
                        return null;
                    }
                }
                // }
                return response;
            }

        });

        // webView.addJavascriptInterface(new
        // JavaScriptInterface(this,webView,imgView1), "android");
        // webView.addJavascriptInterface(myJavaScriptInterface,
        // "AndroidFunction");
        // webView.addJavascriptInterface(new AndroidToastForJs(this),
        // "JavaScriptInterface");
        webView.loadUrl("http://m.nongfadai.com/index.html");
        Log.d(LOGTAG, "2loadUrl");

        // testFile();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        WebView webView = (WebView) findViewById(R.id.webView1);

        // if (webViewUrl == null) {
        // return super.onKeyDown(keyCode, event);
        // }

        try {
            switch (keyCode) {
                case KeyEvent.KEYCODE_BACK:

                    String currentUrl = webView.getUrl();
                    if (currentUrl.indexOf("www.baidu.com") != -1) {
                        new AlertDialog.Builder(this)
                                // .setIcon(R.drawable.services)
                                // .setTitle(R.string.prompt)
                                // .setMessage(R.string.quit_desc)
                                .setNegativeButton("确认退出",
                                        new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(
                                                    DialogInterface dialog,
                                                    int which) {
                                            }
                                        })
                                .setPositiveButton("取消",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(
                                                    DialogInterface dialog,
                                                    int whichButton) {
                                                finish();//
                                            }
                                        }).show();
                        // return true;
                        return true;
                    } else if (currentUrl.indexOf("list") != -1) {
                        webView.clearHistory();
                        webView.loadUrl("http://www.baidu.com");
                        return true;
                    }
                    if (webView.canGoBack()) {
                        webView.goBack();
                        return true;
                    } else {
                        // if
                        // (webViewUrl.equals(this.getResources().getString(R.string.top_page)))
                        // {
                        // DialogFactory.exitApplicationDialog(this).show();
                        // return false;
                        // }
                        new AlertDialog.Builder(this)
                                // .setIcon(R.drawable.services)
                                // .setTitle(R.string.prompt)
                                // .setMessage(R.string.quit_desc)
                                .setNegativeButton("取消",
                                        new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(
                                                    DialogInterface dialog,
                                                    int which) {
                                            }
                                        })
                                .setPositiveButton("确认退出",
                                        new DialogInterface.OnClickListener() {
                                            public void onClick(
                                                    DialogInterface dialog,
                                                    int whichButton) {
                                                finish();//
                                            }
                                        }).show();
                        return true;
                    }
            }
        } catch (Exception e) {
        }
        return super.onKeyDown(keyCode, event);
    }

    public void testFile() {
        try {
            String a = readFile("a1001");
            Log.d(LOGTAG, "read fileContent:" + a);
            String b = a + "new line";
            writeFile("a1001", b);
            Log.d(LOGTAG, "fileContent b:" + b);
        } catch (Exception e) {
            Log.d(LOGTAG, "ex:" + e);
            try {
                writeFile("a1001", "hello file!");
            } catch (IOException e2) {
                Log.d(LOGTAG, "ex:" + e2);
            }
        }
    }

    // 写数据
    public void writeFile(String fileName, String writestr) throws IOException {
        try {

            FileOutputStream fout = openFileOutput(fileName, MODE_PRIVATE);

            byte[] bytes = writestr.getBytes();

            fout.write(bytes);

            fout.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 读数据
    public String readFile(String fileName) throws IOException {
        String res = "";
        try {
            FileInputStream fin = openFileInput(fileName);
            int length = fin.available();
            byte[] buffer = new byte[length];
            fin.read(buffer);
            res = EncodingUtils.getString(buffer, "UTF-8");
            fin.close();
        } catch (Exception e) {
            e.printStackTrace();
            Log.d(LOGTAG, "ex3:" + e);
        }
        return res;

    }

    public void save(String text) {
        String data = "data to save";
        FileOutputStream out = null;
        BufferedWriter writer = null;
        try {
            out = openFileOutput("a.html", Context.MODE_WORLD_READABLE);
            writer = new BufferedWriter(new OutputStreamWriter(out));
            writer.write(text);

        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        System.exit(0);
        // android.os.Process.killProcess(android.os.Process.myPid());
    }
}
