package com.nongfadai.android.constants;


import com.nongfadai.android.application.NfdApplication;
import com.yftools.config.PreferenceConfig;

public class SysConfig {

    private PreferenceConfig mPreferenceConfig;
    public static final String KEY_THEME = "theme";

    private SysConfig() {
        mPreferenceConfig = (PreferenceConfig) PreferenceConfig.getPreferenceConfig(NfdApplication.getContext(), "nfd");
    }

    private static class SingletonHolder {
        static final SysConfig INSTANCE = new SysConfig();
    }

    public static SysConfig getInstance() {
        return SingletonHolder.INSTANCE;
    }

//    public void setTheme(int id) {
//        mPreferenceConfig.setInt(KEY_THEME, id);
//    }
//
//    public int getTheme() {
//        return mPreferenceConfig.getInt(KEY_THEME, R.style.AppTheme_Default);
//    }

    /**
     * 显示过引导页的版本号
     */
    public void setShowGuideVersion(int version) {
        mPreferenceConfig.setInt("showGuideVersion", version);
    }

    public int getShowGuideVersion() {
        return mPreferenceConfig.getInt("showGuideVersion", 0);
    }

    /**
     * 用户主键
     */
    public void setUserId(String userId) {
        mPreferenceConfig.setString("userId", userId);
    }

    public String getUserId() {
        return mPreferenceConfig.getString("userId", "");
    }

    /**
     * 用户名
     */
    public void setUsername(String username) {
        mPreferenceConfig.setString("username", username);
    }

    public String getUsername() {
        return mPreferenceConfig.getString("username", "");
    }

    /**
     * 密码
     */
    public void setPassword(String password) {
        mPreferenceConfig.setString("password", password);
    }

    public String getPassword() {
        return mPreferenceConfig.getString("password", "");
    }

    /**
     * 自动登录
     */
    public void setAutoLogin(boolean autoLogin) {
        mPreferenceConfig.setBoolean("autoLogin", autoLogin);
    }

    public boolean getAutoLogin() {
        return mPreferenceConfig.getBoolean("autoLogin", false);
    }

    /**
     * 声音
     */
    public void setVoice(boolean voice) {
        mPreferenceConfig.setBoolean("voice", voice);
    }

    public boolean isVoice() {
        return mPreferenceConfig.getBoolean("voice", Boolean.TRUE);
    }

    /**
     * 振动
     */
    public void setVibration(boolean vibration) {
        mPreferenceConfig.setBoolean("vibration", vibration);
    }

    public boolean isVibration() {
        return mPreferenceConfig.getBoolean("vibration", Boolean.TRUE);
    }


    public void clearData() {
        mPreferenceConfig.clear();
    }
}
