package com.nongfadai.android.constants;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作常量
 */
public enum Const {
    SEX_FEMALE("男", 0), SEX_MALE("女", 1);
    // 成员变量
    private String name;
    private Object value;

    // 构造方法
    private Const(String name, Object value) {
        this.name = name;
        this.value = value;
    }

    // 普通方法
    public static String getName(Object value) {
        for (Const c : Const.values()) {
            if (c.getValue().toString().equals(value)) {
                return c.getName();
            }
        }
        return null;
    }

    // 普通方法
    public static String getName(String prefix, Object value) {
        for (Const c : Const.values()) {
            if (c.name().startsWith(prefix) && c.getValue().toString().trim().equals(value.toString().trim())) {
                return c.getName();
            }
        }
        return null;
    }

    public static List<String> getNameList(String prefix) {
        List<String> list = new ArrayList<String>();
        for (Const c : Const.values()) {
            if (c.name().startsWith(prefix)) {
                list.add(c.getName());
            }
        }
        return list;
    }

    public static List<Object> getValueList(String prefix) {
        List<Object> list = new ArrayList<Object>();
        for (Const c : Const.values()) {
            if (c.name().startsWith(prefix)) {
                list.add(c.getValue());
            }
        }
        return list;
    }

    /**
     * 按照前缀取得键值对
     *
     * @param prefix
     * @return
     */
    public static Map<Object, String> getMap(String prefix) {
        HashMap<Object, String> hm = new HashMap<Object, String>();
        for (Const c : Const.values()) {
            // System.out.println("c.name()="+c.name());
            if (c.name().startsWith(prefix)) {
                hm.put(c.getValue(), c.getName());
            }
        }
        return hm;
    }

    // get set_pressed 方法

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // 覆盖方法
    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.name + "_" + this.value;
    }
}
