 (async function () {

    const POST_URL = "https://fingerprints-api.holatask.com/insertFpMetaData";
    const HEADER_URL = "https://tools.holatask.com/api/getHeaders.php";

    function safe(fn, defVal = "") {
        try {
            const v = fn();
            return v === undefined || v === null ? defVal : v;
        } catch (e) {
            return defVal;
        }
    }

    async function safeAsync(fn, defVal = null) {
        try {
            const v = await fn();
            return v === undefined || v === null ? defVal : v;
        } catch (e) {
            return defVal;
        }
    }

    function getQueryParam(name) {
        return safe(() => {
            const params = new URLSearchParams(window.location.search);
            return params.get(name) || "";
        }, "");
    }

    function getChromeVersion(userAgentMetadata) {

        return safe(() => {

            const list =
                userAgentMetadata &&
                userAgentMetadata.fullVersionList;

            if (Array.isArray(list)) {

                for (const item of list) {

                    const brand =
                        (item.brand || "").toLowerCase();

                    if (
                        brand.includes("chrome") ||
                        brand.includes("chromium")
                    ) {
                        return item.version || "";
                    }
                }

                if (list.length > 0) {
                    return list[0].version || "";
                }
            }

            const ua = navigator.userAgent || "";
            const match = ua.match(/Chrome\/([\d.]+)/i);

            return match ? match[1] : "";

        }, "");
    }

    async function getIpAddress() {

        return await safeAsync(async () => {

            const res = await fetch(
                "https://api.ipify.org?format=json",
                {
                    method: "GET"
                }
            );

            const json = await res.json();

            return json.ip || "";

        }, "");
    }

    function getWebGL() {

        const defaultData = {
            webglRenderer: "",
            webglVendor: "",
            webgpuVendor: "",
            enableWebGLRendererNoise: true,
            webGLRendererNoiseInterval: 1,
            webGLRendererNoiseValue: 
                Math.random().toString(36).substring(2, 10).toUpperCase() + 
                Math.random().toString(36).substring(2, 10).toUpperCase(),
            version: 0
        };

        return safe(() => {

            const canvas =
                document.createElement("canvas");

            const gl =
                canvas.getContext("webgl2") ||
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");

            if (!gl) {
                return defaultData;
            }

            const debugInfo =
                gl.getExtension(
                    "WEBGL_debug_renderer_info"
                );

            let vendor = "";
            let renderer = "";

            if (debugInfo) {

                vendor =
                    gl.getParameter(
                        debugInfo.UNMASKED_VENDOR_WEBGL
                    ) || "";

                renderer =
                    gl.getParameter(
                        debugInfo.UNMASKED_RENDERER_WEBGL
                    ) || "";

            } else {

                vendor =
                    gl.getParameter(gl.VENDOR) || "";

                renderer =
                    gl.getParameter(gl.RENDERER) || "";
            }

            return {
                webglRenderer: renderer,
                webglVendor: vendor,
                webgpuVendor: vendor,

                enableWebGLRendererNoise: true,

                webGLRendererNoiseInterval: 1,

                webGLRendererNoiseValue:
                    "82045722E390FD3F",

                version:
                    typeof WebGL2RenderingContext !==
                        "undefined" &&
                    gl instanceof WebGL2RenderingContext
                        ? 2
                        : 1
            };

        }, defaultData);
    }

    async function getUserAgentMetadata() {

        const defaultData = {
            platformVersion: "",
            model: "",
            platform: "",
            architecture: "",
            bitness: "",
            fullVersionList: []
        };

        return await safeAsync(async () => {

            if (
                !navigator.userAgentData ||
                !navigator.userAgentData
                    .getHighEntropyValues
            ) {
                return defaultData;
            }

            const data =
                await navigator.userAgentData
                    .getHighEntropyValues([
                        "platformVersion",
                        "model",
                        "platform",
                        "architecture",
                        "bitness",
                        "fullVersionList"
                    ]);

            return {

                platformVersion:
                    data.platformVersion || "",

                model:
                    data.model || "",

                platform:
                    data.platform || "",

                architecture:
                    data.architecture || "",

                bitness:
                    data.bitness || "",

                fullVersionList:
                    data.fullVersionList || []
            };

        }, defaultData);
    }

    async function getUserAgentHighEntropyValuesSupport() {

        const keys = [
            "fullVersionList",
            "uaFullVersion",
            "platformVersion",
            "architecture",
            "bitness",
            "model",
            "platform"
        ];
        const result = {};

        for (const key of keys) {

            result[key] = {

                supported: false,

                value: undefined
            };
        }

        return await safeAsync(async () => {

            if (
                !navigator.userAgentData ||
                !navigator.userAgentData
                    .getHighEntropyValues
            ) {
                return result;
            }

            const data =
                await navigator.userAgentData
                    .getHighEntropyValues(keys);

            for (const key of keys) {

                result[key] = {
                
                    supported:
                        Object.prototype
                            .hasOwnProperty
                            .call(data, key),
                
                    valueType:
                        typeof data[key],
                
                    value:
                        data[key]
                };
            }

            return result;

        }, result);
    }

    async function getBattery() {

        const defaultData = {
            charging: "",
            chargingTime: "",
            dischargingTime: "",
            level: ""
        };

        return await safeAsync(async () => {

            if (!navigator.getBattery) {
                return defaultData;
            }

            const b =
                await navigator.getBattery();

            return {

                charging:
                    b.charging,

                chargingTime:
                    isFinite(b.chargingTime)
                        ? String(b.chargingTime)
                        : "",

                dischargingTime:
                    isFinite(b.dischargingTime)
                        ? String(b.dischargingTime)
                        : "",

                level:
                    String(b.level)
            };

        }, defaultData);
    }

    function getConnection() {

        return safe(() => {

            return (
                navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection ||
                {}
            );

        }, {});
    }

    function getMediaQuery() {

        function has(query) {
            return safe(
                () => matchMedia(query).matches,
                false
            );
        }

        return {

            pointer:
                has("(pointer: coarse)")
                    ? "coarse"
                    : has("(pointer: fine)")
                        ? "fine"
                        : "none",

            hover:
                has("(hover: hover)")
                    ? "hover"
                    : "none",

            colorGamut:
                has("(color-gamut: p3)")
                    ? "p3"
                    : has("(color-gamut: srgb)")
                        ? "srgb"
                        : "",

            displayMode:
                has("(display-mode: standalone)")
                    ? "standalone"
                    : has("(display-mode: fullscreen)")
                        ? "fullscreen"
                        : has("(display-mode: minimal-ui)")
                            ? "minimal-ui"
                            : "browser",

            preferredColorScheme:
                has("(prefers-color-scheme: dark)")
                    ? "dark"
                    : "light",

            preferredContrast:
                has("(prefers-contrast: more)")
                    ? "more"
                    : has("(prefers-contrast: less)")
                        ? "less"
                        : "no-preference",

            preferredReducedMotion:
                has(
                    "(prefers-reduced-motion: reduce)"
                )
                    ? "reduce"
                    : "no-preference",

            dynamicRange:
                has("(dynamic-range: high)")
                    ? "high"
                    : "standard"
        };
    }

    async function getEstimate() {

        const defaultData = {
            quota: 0,
            usage: 0
        };

        return await safeAsync(async () => {

            if (
                !navigator.storage ||
                !navigator.storage.estimate
            ) {
                return defaultData;
            }

            const e =
                await navigator.storage.estimate();

            return {
                quota: e.quota || 0,
                usage: e.usage || 0
            };

        }, defaultData);
    }

    async function getInjectHeaders() {

        return await safeAsync(async () => {

            const res = await fetch(
                HEADER_URL,
                {
                    method: "GET",
                    credentials: "omit"
                }
            );

            const json = await res.json();

            return (
                json.injectHeaders ||
                json ||
                {}
            );

        }, {});
    }

    async function collect() {

        const conn =
            getConnection();

        const userAgentMetadata =
            await getUserAgentMetadata();

        const userAgentHighEntropyValues =
            await getUserAgentHighEntropyValuesSupport();

        const fullVersionList =
            userAgentMetadata.fullVersionList || [];

        const cleanUserAgentMetadata = {
            platformVersion:
                userAgentMetadata.platformVersion || "",

            model:
                userAgentMetadata.model || "",

            platform:
                userAgentMetadata.platform || "",

            architecture:
                userAgentMetadata.architecture || "",

            bitness:
                userAgentMetadata.bitness || ""
        };

        return {

            actName:
                getQueryParam("actName"),

            browserInfo:
                safe(() => {
            
                    const ua =
                        navigator.userAgent || "";
            
                    let os = "";
                    let app = "webview";
                    let fullVer = "";
                    let mainVer = "";
            
                    // os
                    if (/Android/i.test(ua)) {
            
                        os = "android";
            
                    } else if (
                        /iPhone|iPad|iPod/i.test(ua)
                    ) {
            
                        os = "ios";
            
                    } else if (/Windows/i.test(ua)) {
            
                        os = "windows";
            
                    } else if (/Mac OS/i.test(ua)) {
            
                        os = "macos";
            
                    } else if (/Linux/i.test(ua)) {
            
                        os = "linux";
                    }
            
                    // app
                    if (
                        /\bFB_IAB\b/i.test(ua) ||
                        /\bFBAV\b/i.test(ua) ||
                        /\bFBAN\b/i.test(ua)
                    ) {
            
                        app = "facebook_new";
            
                    } else if (
                        /\bInstagram\b/i.test(ua) ||
                        /\bIGAN\b/i.test(ua)
                    ) {
            
                        app = "instagram";
            
                    } else if (
                        /\bTikTok\b/i.test(ua) ||
                        /\bBytedanceWebview\b/i.test(ua) ||
                        /\bByteLocale\b/i.test(ua)
                    ) {
            
                        app = "tiktok";
            
                    } else if (
                        
                        /\biPhone\b/i.test(ua) ||
                        /\biPad\b/i.test(ua) ||
                        /\biPod\b/i.test(ua) ||
                        /\bMac OS X\b/i.test(ua)
                    ) {
                    
                        app = "safari";
                    
                    } else if (

                        /Android/i.test(ua) &&
                        /\bChrome\/[\d.]+\b/i.test(ua) &&
                        !/\bVersion\/[\d.]+\b/i.test(ua) &&
                        !/\bwv\b/i.test(ua)
                    
                    ) {
                    
                        app = "chrome_new";
                    
                    } else if (
                        /Android/i.test(ua) && (
                        /\bVersion\/[\d.]+\b/i.test(ua) || /\bwv\b/i.test(ua)
                        )
                    ) {
                    
                        app = "webview";
                    }
            
                    // version
                    let versionMatch = null;
            
                    if (app === "facebook") {
            
                        versionMatch =
                            ua.match(/\bFBAV\/([\d.]+)/i) ||
                            ua.match(/\bChrome\/([\d.]+)/i);
            
                    } else if (
                        app === "instagram"
                    ) {
            
                        versionMatch =
                            ua.match(
                                /\bInstagram\s+([\d.]+)/i
                            ) ||
                            ua.match(
                                /\bChrome\/([\d.]+)/i
                            );
            
                    } else if (
                        app === "tiktok"
                    ) {
            
                        versionMatch =
                            ua.match(
                                /\bTikTok\/([\d.]+)/i
                            ) ||
                            ua.match(
                                /\bChrome\/([\d.]+)/i
                            );
            
                    }else if (
                        app === "safari"
                    ) {
            
                        versionMatch =
                            ua.match(/\bVersion\/([\d.]+)/i) ||
                            ua.match(/iPhone OS ([\d_]+)/i) ||
                            ua.match(/CPU OS ([\d_]+)/i);
                        
                    } else {
            
                        versionMatch =
                            ua.match(
                                /\bChrome\/([\d.]+)/i
                            ) ||
                            ua.match(
                                /\bVersion\/([\d.]+)/i
                            );
                    }
                    
            
                    if (versionMatch) {
            
                        if(app === "safari")
                        {
                            fullVer = versionMatch[1].replace(/_/g, ".");
                            mainVer = fullVer.split(".")[0];
                        }
                        else
                        {
                            fullVer = versionMatch[1] || "";
                            mainVer = fullVer.split(".")[0] || "";
                        }
                        
                    }
            
                    return {
            
                        os: os,
            
                        app: app,
            
                        mainVer: mainVer,
            
                        fullVer: fullVer
                    };
            
                }, {
            
                    os: "",
            
                    app: "",
            
                    mainVer: "",
            
                    fullVer: ""
            }),


            appLocale:
                "en-US",

            acceptLang:
                "en-US",

            webRtcMode:
                "disable",

            audioBuffer: {
                enableAudioBufferNoise: true,
                audioBufferNewNoise: String(Math.floor(10000000 + Math.random() * 90000000))
            },

            canvasContext: {
                enableCanvasContextNoise: true,
                canvasContextNoiseNewValue: String(Math.floor(10000000 + Math.random() * 90000000))
            },

            clientRects: {
                enable: true,
                clientRectsNoiseFactorX: -0.1001,
                clientRectsNoiseFactorY: -0.1001
            },

            timeZone:
                safe(
                    () =>
                        Intl.DateTimeFormat()
                            .resolvedOptions()
                            .timeZone,
                    ""
                ),

            ipAddress:
                await getIpAddress(),

            WebGL:
                getWebGL(),

            navigator: {

                hardwareConcurrency:
                    safe(
                        () =>
                            navigator.hardwareConcurrency,
                        ""
                    ),

                deviceMemory:
                    safe(
                        () =>
                            navigator.deviceMemory,
                        ""
                    ),

                maxTouchPoints:
                    safe(
                        () =>
                            navigator.maxTouchPoints,
                        ""
                    ),

                platform:
                    safe(
                        () =>
                            navigator.platform,
                        ""
                    )
            },

            screen: {

                pixelDepth:
                    safe(
                        () =>
                            screen.pixelDepth,
                        ""
                    ),

                colorDepth:
                    safe(
                        () =>
                            screen.colorDepth,
                        ""
                    ),

                width:
                    safe(
                        () =>
                            screen.width,
                        ""
                    ),

                height:
                    safe(
                        () =>
                            screen.height,
                        ""
                    )
            },

            innerWidth:
                safe(
                    () =>
                        window.innerWidth,
                    ""
                ),

            innerHeight:
                safe(
                    () =>
                        window.innerHeight,
                    ""
                ),

            outerWidth:
                safe(
                    () =>
                        window.outerWidth,
                    ""
                ),

            outerHeight:
                safe(
                    () =>
                        window.outerHeight,
                    ""
                ),

            historyLength:
                safe(
                    () =>
                        history.length,
                    ""
                ),

            chromeVersion:
                getChromeVersion(
                    userAgentMetadata
                ),

            chromeType:
                safe(() => {
            
                    const ua =
                        navigator.userAgent || "";
            
                    const isAndroid =
                        /Android/i.test(ua);
            
                    const isIOS =
                        /iPhone|iPad|iPod/i.test(ua);
            
                    const hasWvFlag =
                        /\bwv\b/i.test(ua);
                        
                    var hasVersion =
                         /\bVersion\/[\d.]+\b/i.test(ua);
            
                    if (isIOS) {
                        return "Mobile Safari";
                    }
            
                    if (
                        isAndroid &&
                        (hasWvFlag || hasVersion)
                    ) {
                        return "Android WebView";
                    }
                    
                    
            
                    return "Google Chrome";
            
                }, "Google Chrome"),

            fullVersionList:
                fullVersionList,

            userAgent:
                safe(
                    () =>
                        navigator.userAgent,
                    ""
                ),

            userAgentMetadata:
                cleanUserAgentMetadata,

            supportedInfo: {

                userAgentData: {

                    supported:
                        !!navigator.userAgentData,

                    getHighEntropyValuesSupported:
                        !!(
                            navigator.userAgentData &&
                            navigator.userAgentData
                                .getHighEntropyValues
                        )
                },

                userAgentHighEntropyValues:
                    userAgentHighEntropyValues
            },

            battery:
                await getBattery(),

            netInfoConstantType:
                safe(
                    () =>
                        conn.type,
                    "cellular"
                ),

            rtt:
                safe(
                    () =>
                        conn.rtt,
                    0
                ),

            availWidth:
                safe(
                    () =>
                        String(
                            screen.availWidth
                        ),
                    ""
                ),

            availHeight:
                safe(
                    () =>
                        String(
                            screen.availHeight
                        ),
                    ""
                ),

            availLeft:
                safe(
                    () =>
                        String(
                            screen.availLeft
                        ),
                    ""
                ),

            availTop:
                safe(
                    () =>
                        String(
                            screen.availTop
                        ),
                    ""
                ),

            mediaQuery:
                getMediaQuery(),

            estimate:
                await getEstimate(),

            devicePixelRatio:
                safe(
                    () =>
                        window.devicePixelRatio,
                    ""
                ),

            effectiveType:
                safe(
                    () =>
                        conn.effectiveType,
                    ""
                ),

            injectHeaders:
                await getInjectHeaders()
        };
    }

    async function postFpData(data) {

        return await safeAsync(async () => {

            const jsonStr =
                JSON.stringify(data);

            const base64Encoded =
                btoa(
                    unescape(
                        encodeURIComponent(
                            jsonStr
                        )
                    )
                );

            const res = await fetch(
                POST_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        "payload=" +
                        encodeURIComponent(
                            base64Encoded
                        )
                }
            );

            const text =
                await res.text();

            return {

                ok:
                    res.ok,

                status:
                    res.status,

                response:
                    text
            };

        }, {
            ok: false,
            status: 0,
            response: ""
        });
    }

    try {

        const fpData =
            await collect();

        console.log(
            "fpData",
            fpData
        );

        const postResult =
            await postFpData(
                fpData
            );

        console.log(
            "postResult",
            postResult
        );

        window.__fpResult =
            fpData;

        window.__fpPostResult =
            postResult;

    } catch (e) {

        console.error(
            "fp error",
            e
        );
    }

})();