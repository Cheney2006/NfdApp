package com.nfd.nfdapp.activity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.nfd.nfdapp.R;
import com.nfd.nfdapp.activity.base.AbstractActivity;

public class WelcomeActivity extends AbstractActivity {

    private static final long DELAY_MILLS = 3000;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcom);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                startActivity(new Intent(mContext, MainActivity.class));
                finish();
            }
        }, DELAY_MILLS);
    }


}
