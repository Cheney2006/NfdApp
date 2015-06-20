package com.nfd.nfdapp.helper;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.Toast;

public class JavaScriptInterface {

    private Context mContext;
    private WebView webView=null;
    private ImageView imageView=null;

    /** Instantiate the interface and set the context */
    public JavaScriptInterface(Context c) {
        mContext = c;
    }
    public JavaScriptInterface(Context c,WebView webView) {
        mContext = c;
        this.webView=webView;
    }
    public JavaScriptInterface(Context c,WebView webView,ImageView imageView) {
        mContext = c;
        this.webView=webView;
        this.imageView=imageView;
    }
    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
//    	if(webView!=null){
//    		webView.setVisibility(View.VISIBLE);
//    	}
    }
    @JavascriptInterface
    public void showWebView() {
        Toast.makeText(mContext, "showWebView", Toast.LENGTH_SHORT).show();
        //Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    	//if(webView!=null){
    	//	webView.setVisibility(View.VISIBLE);
    	//}
    	Log.d("helloWorld","imageView invisible!!");
    	if(imageView!=null){
    		imageView.clearAnimation();
    		imageView.setVisibility(View.GONE);
    		
            Toast.makeText(mContext, "showWebView", Toast.LENGTH_SHORT).show();

    		Log.d("helloWorld","imageView invisible!!");
    	}
    }
}