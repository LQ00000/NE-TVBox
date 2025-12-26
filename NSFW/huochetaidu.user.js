// ==UserScript==
// @name         maccms-mxonepro
// @namespace    gmspider
// @version      2025.1.11
// @description  maccms GMSpider for huochetaidu
// @author       Luomo
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/gh/CatVodSpider-GM/SFW-Spiders@main/Spiders-Lib/maccms-1.0.2.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

console.log(JSON.stringify(GM_info));

(function () {
    // 站点专用配置
    const SITE_CONFIG = {
        // 基础URL配置
        urls: {
            home: "https://www.tdgo.shop/",
            category: "https://www.tdgo.shop/vodshow/${tid}-${index0:-}-${index1:-}-${index2:-}-${index3:-}-${index4:-}-${index5:-}-${index6:-}-${pg:-1}-${index8:-}-${index9:-}-${index10:-}.html",
            detail: "https://www.tdgo.shop${id}",
            player: "https://www.tdgo.shop${playUrl}",
            search: "https://www.tdgo.shop/vodsearch/${key}----------${pg:-1}---.html"
        },
        
        // 页面解析配置
        selectors: {
            homeCategory: {
                select: ".navbar-item",
                slice: [1, 6]
            }
        },
        
        // WebView设置（仅在支持的环境中生效）
        webViewSettings: {
            blockNetworkImage: true,
            blockList: [
                "https://hm.baidu.com/*"
            ]
        },
        
        // 播放URL匹配规则
        playUrlMatch: [
            "*://*/*.m3u8*"
        ]
    };

    const GMSpiderArgs = {};
    if (typeof GmSpiderInject !== 'undefined') {
        let args = JSON.parse(GmSpiderInject.GetSpiderArgs());
        GMSpiderArgs.fName = args.shift();
        GMSpiderArgs.fArgs = args;
    } else {
        GMSpiderArgs.fName = "homeContent";
        GMSpiderArgs.fArgs = [true];
    }
    Object.freeze(GMSpiderArgs);

    // 应用WebView设置（如果环境支持）
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.GM_webViewSettings) {
        try {
            unsafeWindow.GM_webViewSettings = SITE_CONFIG.webViewSettings;
        } catch (e) {
            console.warn("无法设置webViewSettings:", e);
        }
    }

    // 也可以存储到GM值供其他脚本访问
    if (typeof GM_setValue !== 'undefined') {
        GM_setValue("huochetaidu_webViewSettings", SITE_CONFIG.webViewSettings);
        GM_setValue("huochetaidu_playUrlMatch", SITE_CONFIG.playUrlMatch);
    }

    const GmSpider = MacCmsGMSpider({
        configPicUserAgent: true,
        homeContent: {
            category: SITE_CONFIG.selectors.homeCategory,
            loadUrl: SITE_CONFIG.urls.home
        },
        categoryContent: {
            loadUrl: SITE_CONFIG.urls.category
        },
        detailContent: {
            loadUrl: SITE_CONFIG.urls.detail
        },
        playerContent: {
            loadUrl: SITE_CONFIG.urls.player
        },
        searchContent: {
            loadUrl: SITE_CONFIG.urls.search
        }
    });

    $(document).ready(function () {
        const result = GmSpider[GMSpiderArgs.fName](...GMSpiderArgs.fArgs);
        console.log(result);
        if (typeof GmSpiderInject !== 'undefined') {
            GmSpiderInject.SetSpiderResult(JSON.stringify(result));
        }
    });
})();
