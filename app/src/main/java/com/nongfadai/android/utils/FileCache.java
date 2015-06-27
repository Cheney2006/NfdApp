package com.nongfadai.android.utils;

import android.content.Context;
import android.text.TextUtils;

import com.yftools.LogUtil;
import com.yftools.util.FileUtil;
import com.yftools.util.StorageUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.ref.ReferenceQueue;
import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Hashtable;

/**
 * 文件内存缓存
 * Created by cy on 2015/6/27.
 */
public class FileCache {

    static private FileCache cache;
    /**
     * 用于cache内容的存储
     */
    private HashMap<String, MySoftRef> hashRefs;
    /**
     * 垃圾Reference的队列（所引用的对象已经被回收，则将该引用存入队列中）
     */
    private ReferenceQueue<InputStream> q;

    /**
     * 继承SoftReference，使得每一个实例都具有可识别的标识。
     */
    private class MySoftRef extends SoftReference<InputStream> {
        private String _key;

        public MySoftRef(InputStream is, ReferenceQueue<InputStream> q, String key) {
            super(is, q);
            _key = key;
        }
    }

    private FileCache() {
        hashRefs = new HashMap<String, MySoftRef>();
        q = new ReferenceQueue<InputStream>();
    }

    /**
     * 取得缓存器实例
     */
    public static FileCache getInstance() {
        if (cache == null) {
            cache = new FileCache();
        }
        return cache;
    }

    /**
     * 以软引用的方式对一个Bitmap对象的实例进行引用并保存该引用
     */
    public void addCacheBitmap(InputStream is, String key) {
        cleanCache(); // 清除垃圾引用
        MySoftRef ref = new MySoftRef(is, q, key);
        hashRefs.put(key, ref);
    }

    /**
     *
     */
    public InputStream getFileStream(String path) throws Exception {
        InputStream is = null;
        // 缓存中是否有该Bitmap实例的软引用，如果有，从软引用中取得。
        if (!TextUtils.isEmpty(path)&&hashRefs.containsKey(path)) {
            LogUtil.d("contrain========"+path);
            MySoftRef ref = (MySoftRef)hashRefs.get(path);
            if(ref!=null){
                is = (InputStream)ref.get();
            }
        }
        return is;
    }

    private void cleanCache() {
        MySoftRef ref = null;
        while ((ref = (MySoftRef) q.poll()) != null) {
            hashRefs.remove(ref._key);
        }
    }

    /**
     * 清除Cache内的全部内容
     */
    public void clearCache() {
        cleanCache();
        hashRefs.clear();
        System.gc();
        System.runFinalization();
    }
}
