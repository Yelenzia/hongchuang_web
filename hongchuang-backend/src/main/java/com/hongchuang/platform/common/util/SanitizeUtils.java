package com.hongchuang.platform.common.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public final class SanitizeUtils {

    private static final Safelist SAFE_LIST = Safelist.relaxed();

    private SanitizeUtils() {
    }

    public static String cleanHtml(String content) {
        if (content == null) {
            return null;
        }
        return Jsoup.clean(content, SAFE_LIST);
    }

    public static String cleanText(String content) {
        if (content == null) {
            return null;
        }
        return Jsoup.clean(content, Safelist.none());
    }
}
