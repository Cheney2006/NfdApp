package com.nfd.nfdapp.activity.base;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.widget.Toast;

/**
 * *****************************************
 * Description ：基础类，一些基础的操作（eg:全局广播，信息提示，退出等。）
 * Created by cy on 2015/06/21.
 * *****************************************
 */
public abstract class AbstractActivity extends Activity {

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
}
