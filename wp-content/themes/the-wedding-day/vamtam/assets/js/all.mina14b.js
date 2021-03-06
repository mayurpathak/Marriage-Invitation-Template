! function() {
    "use strict";
    var a = window.VAMTAM = window.VAMTAM || {};
    a.debounce = function(a, b, c) {
        var d;
        return function() {
            var e = this,
                f = arguments,
                g = function() { d = null, c || a.apply(e, f) },
                h = c && !d;
            clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
        }
    }, a.offset = function(a) {
        var b = a.getBoundingClientRect(),
            c = window.pageXOffset || document.documentElement.scrollLeft,
            d = window.pageYOffset || document.documentElement.scrollTop;
        return { top: b.top + d, left: b.left + c }
    }, a.scroll_handlers = [], a.latestKnownScrollY = 0;
    var b = !1;
    a.addScrollHandler = function(b) { requestAnimationFrame(function() { b.init(), a.scroll_handlers.push(b), b.measure(a.latestKnownScrollY), b.mutate(a.latestKnownScrollY) }) }, a.onScroll = function() {
        a.latestKnownScrollY = window.pageYOffset, b || (b = !0, requestAnimationFrame(function() {
            var c;
            for (c = 0; c < a.scroll_handlers.length; c++) a.scroll_handlers[c].measure(a.latestKnownScrollY);
            for (c = 0; c < a.scroll_handlers.length; c++) a.scroll_handlers[c].mutate(a.latestKnownScrollY);
            b = !1
        }))
    }, window.addEventListener("scroll", a.onScroll, { passive: !0 }), a.load_script = function(a, b) {
        var c = document.createElement("script");
        c.type = "text/javascript", c.async = !0, c.src = a, b && (c.onload = b), document.getElementsByTagName("script")[0].before(c)
    }
}(),
function(a) {
    "use strict";
    a.fn.gMap = function(b, c) {
        var d, e;
        if (!(window.google && google.maps || window.google_maps_api_loading)) {
            d = this, e = arguments;
            var f = "callback_" + Math.random().toString().replace(".", "");
            window.google_maps_api_loading = f, window[f] = function() { a.fn.gMap.apply(d, e), a(window).trigger("google-maps-async-loading"), window[f] = null; try { delete window[f] } catch (b) {} };
            var g = window.VAMTAM_FRONT && window.VAMTAM_FRONT.gmap_api_key ? "&key=" + VAMTAM_FRONT.gmap_api_key : "";
            return a.getScript(location.protocol + "//maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=" + f + g), this
        }
        if ((!window.google || !google.maps) && window.google_maps_api_loading) return d = this, e = arguments, a(window).bind("google-maps-async-loading", function() { a.fn.gMap.apply(d, e) }), this;
        switch (b) {
            case "addMarker":
                return a(this).trigger("gMap.addMarker", [c.latitude, c.longitude, c.content, c.icon, c.popup]);
            case "centerAt":
                return a(this).trigger("gMap.centerAt", [c.latitude, c.longitude, c.zoom])
        }
        var h = a.extend({}, a.fn.gMap.defaults, b);
        return this.each(function() {
            var b = new google.maps.Map(this),
                c = new google.maps.Geocoder;
            h.address ? c.geocode({ address: h.address }, function(a) { a && a.length && b.setCenter(a[0].geometry.location) }) : h.latitude && h.longitude ? b.setCenter(new google.maps.LatLng(h.latitude, h.longitude)) : a.isArray(h.markers) && h.markers.length > 0 ? h.markers[0].address ? c.geocode({ address: h.markers[0].address }, function(a) { a && a.length > 0 && b.setCenter(a[0].geometry.location) }) : b.setCenter(new google.maps.LatLng(h.markers[0].latitude, h.markers[0].longitude)) : b.setCenter(new google.maps.LatLng(34.885931, 9.84375)), b.setZoom(h.zoom), b.setMapTypeId(google.maps.MapTypeId[h.maptype]);
            var d = { scrollwheel: h.scrollwheel, disableDoubleClickZoom: !h.doubleclickzoom };
            h.controls === !1 ? a.extend(d, { disableDefaultUI: !0 }) : 0 !== h.controls.length && a.extend(d, h.controls, { disableDefaultUI: !0 }), b.setOptions(a.extend(d, h.custom));
            var e = new google.maps.Marker,
                f = new google.maps.MarkerImage(h.icon.image);
            if (f.size = new google.maps.Size(h.icon.iconsize[0], h.icon.iconsize[1]), f.anchor = new google.maps.Point(h.icon.iconanchor[0], h.icon.iconanchor[1]), e.setIcon(f), h.icon.shadow) {
                var g = new google.maps.MarkerImage(h.icon.shadow);
                g.size = new google.maps.Size(h.icon.shadowsize[0], h.icon.shadowsize[1]), g.anchor = new google.maps.Point(h.icon.shadowanchor[0], h.icon.shadowanchor[1]), e.setShadow(g)
            }
            a(this).bind("gMap.centerAt", function(a, c, d, e) { e && b.setZoom(e), b.panTo(new google.maps.LatLng(parseFloat(c), parseFloat(d))) });
            var i;
            a(this).bind("gMap.addMarker", function(a, c, d, j, k, l) {
                var m = new google.maps.LatLng(parseFloat(c), parseFloat(d)),
                    n = new google.maps.Marker({ position: m });
                if (k ? (f = new google.maps.MarkerImage(k.image), f.size = new google.maps.Size(k.iconsize[0], k.iconsize[1]), f.anchor = new google.maps.Point(k.iconanchor[0], k.iconanchor[1]), n.setIcon(f), k.shadow && (g = new google.maps.MarkerImage(k.shadow), g.size = new google.maps.Size(k.shadowsize[0], k.shadowsize[1]), g.anchor = new google.maps.Point(k.shadowanchor[0], k.shadowanchor[1]), e.setShadow(g))) : (n.setIcon(e.getIcon()), n.setShadow(e.getShadow())), j) {
                    "_latlng" === j && (j = c + ", " + d);
                    var o = new google.maps.InfoWindow({ content: h.html_prepend + j + h.html_append });
                    google.maps.event.addListener(n, "click", function() { i && i.close(), o.open(b, n), i = o }), l && o.open(b, n)
                }
                n.setMap(b)
            });
            for (var j = function(b, c) { return function(d) { d && d.length > 0 && a(c).trigger("gMap.addMarker", [d[0].geometry.location.lat(), d[0].geometry.location.lng(), b.html, b.icon, b.popup]) } }, k = 0; k < h.markers.length; k++) {
                var l = h.markers[k];
                if (l.address) {
                    "_address" === l.html && (l.html = l.address);
                    var m = this;
                    c.geocode({ address: l.address }, j(l, m))
                } else a(this).trigger("gMap.addMarker", [l.latitude, l.longitude, l.html, l.icon, l.popup])
            }
        })
    }, a.fn.gMap.defaults = { address: "", latitude: 0, longitude: 0, zoom: 1, markers: [], controls: [], scrollwheel: !1, doubleclickzoom: !0, maptype: "ROADMAP", html_prepend: '<div class="gmap_marker">', html_append: "</div>", icon: { image: "https://www.google.com/mapfiles/marker.png", shadow: "https://www.google.com/mapfiles/shadow50.png", iconsize: [20, 34], shadowsize: [37, 34], iconanchor: [9, 34], shadowanchor: [6, 34] } }
}(jQuery),
function(a) {
    "use strict";
    var b, c, d, e, f, g, h, i = "Close",
        j = "BeforeClose",
        k = "AfterClose",
        l = "BeforeAppend",
        m = "MarkupParse",
        n = "Open",
        o = "Change",
        p = "mfp",
        q = "." + p,
        r = "mfp-ready",
        s = "mfp-removing",
        t = "mfp-prevent-close",
        u = function() {},
        v = !!window.jQuery,
        w = a(window),
        x = function(a, c) { b.ev.on(p + a + q, c) },
        y = function(b, c, d, e) { var f = document.createElement("div"); return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f },
        z = function(c, d) { b.ev.triggerHandler(p + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d])) },
        A = function() {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        },
        B = function(c) { return c === h && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), h = c), b.currTemplate.closeBtn },
        C = function() { a.magnificPopup.instance || (b = new u, b.init(), a.magnificPopup.instance = b) },
        D = function(c) {
            if (!a(c).hasClass(t)) {
                var d = b.st.closeOnContentClick,
                    e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) { if (d) return !0 } else if (e && a.contains(document, c)) return !0;
                return !1
            }
        },
        E = function() {
            var a = document.createElement("p").style,
                b = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== a.transition) return !0;
            for (; b.length;)
                if (b.pop() + "Transition" in a) return !0;
            return !1
        };
    u.prototype = {
        constructor: u,
        init: function() {
            var c = navigator.appVersion;
            b.isIE7 = -1 !== c.indexOf("MSIE 7."), b.isIE8 = -1 !== c.indexOf("MSIE 8."), b.isLowIE = b.isIE7 || b.isIE8, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = E(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document.body), e = a(document), b.popupsCache = {}
        },
        open: function(c) {
            var d;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var f, h = c.items;
                for (d = 0; d < h.length; d++)
                    if (f = h[d], f.parsed && (f = f.el[0]), f === c.el[0]) { b.index = d; break }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], g = "", b.ev = c.mainEl && c.mainEl.length ? c.mainEl.eq(0) : e, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = y("bg").on("click" + q, function() { b.close() }), b.wrap = y("wrap").attr("tabindex", -1).on("click" + q, function(a) { D(a.target) && b.close() }), b.container = y("container", b.wrap)), b.contentContainer = y("content"), b.st.preloader && (b.preloader = y("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (d = 0; d < i.length; d++) {
                var j = i[d];
                j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
            }
            z("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (x(m, function(a, b, c, d) { c.close_replaceWith = B(d.type) }), g += " mfp-close-btn-in") : b.wrap.append(B())), b.st.alignTop && (g += " mfp-align-top"), b.wrap.css(b.fixedContentPos ? { overflow: b.st.overflowY, overflowX: "hidden", overflowY: b.st.overflowY } : { top: w.scrollTop(), position: "absolute" }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({ height: e.height(), position: "absolute" }), b.st.enableEscapeKey && e.on("keyup" + q, function(a) { 27 === a.keyCode && b.close() }), w.on("resize" + q, function() { b.updateSize() }), b.st.closeOnContentClick || (g += " mfp-auto-cursor"), g && b.wrap.addClass(g);
            var k = b.wH = w.height(),
                l = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (l.paddingRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : l.overflow = "hidden");
            var p = b.st.mainClass;
            b.isIE7 && (p += " mfp-ie7"), p && b._addClassToMFP(p), b.updateItemHTML(), z("BuildControls"), a("html").css(l), b.bgOverlay.add(b.wrap).prependTo(document.body), b._lastFocusedEl = document.activeElement, setTimeout(function() { b.content ? (b._addClassToMFP(r), A()) : b.bgOverlay.addClass(r), e.on("focusin" + q, function(c) { return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (A(), !1) }) }, 16), b.isOpen = !0, b.updateSize(k), z(n)
        },
        close: function() { b.isOpen && (z(j), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(s), setTimeout(function() { b._close() }, b.st.removalDelay)) : b._close()) },
        _close: function() {
            z(i);
            var c = s + " " + r + " ";
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                var d = { paddingRight: "" };
                b.isIE7 ? a("body, html").css("overflow", "") : d.overflow = "", a("html").css(d)
            }
            e.off("keyup" + q + " focusin" + q), b.ev.off(q), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, z(k)
        },
        updateSize: function(a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth,
                    d = window.innerHeight * c;
                b.wrap.css("height", d), b.wH = d
            } else b.wH = a || w.height();
            b.fixedContentPos || b.wrap.css("height", b.wH), z("Resize")
        },
        updateItemHTML: function() {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (z("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                var e = b.st[d] ? b.st[d].markup : !1;
                z("FirstMarkupParse", e), b.currTemplate[d] = e ? a(e) : !0
            }
            f && f !== c.type && b.container.removeClass("mfp-" + f + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, z(o, c), f = c.type, b.container.prepend(b.contentContainer), z("AfterChange")
        },
        appendContent: function(a, c) { b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(B()) : b.content = a : b.content = "", z(l), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content) },
        parseEl: function(c) {
            var d = b.items[c],
                e = d.type;
            if (d = d.tagName ? { el: a(d) } : { data: d, src: d.src }, d.el) {
                for (var f = b.types, g = 0; g < f.length; g++)
                    if (d.el.hasClass("mfp-" + f[g])) { e = f[g]; break }
                d.src = d.el.attr("data-mfp-src"), d.src || (d.src = d.el.attr("href"))
            }
            return d.type = e || b.st.type || "inline", d.index = c, d.parsed = !0, b.items[c] = d, z("ElementParse", d), b.items[c]
        },
        addGroup: function(a, c) {
            var d = function(d) { d.mfpEl = this, b._openClick(d, a, c) };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
        },
        _openClick: function(c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || 2 !== c.which && !c.ctrlKey && !c.metaKey) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) { if (!g.call(b)) return !0 } else if (w.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
            }
        },
        updateStatus: function(a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                var e = { status: a, text: d };
                z("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function(a) { a.stopImmediatePropagation() }), b.container.addClass("mfp-s-" + a), c = a
            }
        },
        _addClassToMFP: function(a) { b.bgOverlay.addClass(a), b.wrap.addClass(a) },
        _removeClassFromMFP: function(a) { this.bgOverlay.removeClass(a), b.wrap.removeClass(a) },
        _hasScrollBar: function(a) { return (b.isIE7 ? e.height() : document.body.scrollHeight) > (a || w.height()) },
        _parseMarkup: function(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), z(m, [b, c, d]), a.each(c, function(a, c) { if (void 0 === c || c === !1) return !0; if (e = a.split("_"), e.length > 1) { var d = b.find(q + "-" + e[0]); if (d.length > 0) { var f = e[1]; "replaceWith" === f ? d[0] !== c[0] && d.replaceWith(c) : "img" === f ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c) } } else b.find(q + "-" + a).html(c) })
        },
        _getScrollbarSize: function() {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.id = "mfp-sbm", a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    }, a.magnificPopup = { instance: null, proto: u.prototype, modules: [], open: function(a, b) { return C(), a || (a = {}), a.isObj = !0, a.index = b || 0, this.instance.open(a) }, close: function() { return a.magnificPopup.instance.close() }, registerModule: function(b, c) { c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b) }, defaults: { disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0, modal: !1, alignTop: !1, removalDelay: 0, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>', tClose: "Close (Esc)", tLoading: "Loading..." } }, a.fn.magnificPopup = function(c) {
        C();
        var d = a(this);
        if ("string" == typeof c)
            if ("open" === c) {
                var e, f = v ? d.data("magnificPopup") : d[0].magnificPopup,
                    g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({ mfpEl: e }, d, f)
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        else v ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d
    };
    var F, G, H, I = "inline",
        J = function() { H && (G.after(H.addClass(F)).detach(), H = null) };
    a.magnificPopup.registerModule(I, {
        options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" },
        proto: {
            initInline: function() { b.types.push(I), x(i + "." + I, function() { J() }) },
            getInline: function(c, d) {
                if (J(), c.src) {
                    var e = b.st.inline,
                        f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (G || (F = e.hiddenClass, G = y(F), F = "mfp-" + F), H = f.after(G).detach().removeClass(F)), b.updateStatus("ready")
                    } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                    return c.inlineElement = f, f
                }
                return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
            }
        }
    });
    var K, L = "ajax",
        M = function() { K && d.removeClass(K) };
    a.magnificPopup.registerModule(L, {
        options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' },
        proto: {
            initAjax: function() { b.types.push(L), K = b.st.ajax.cursor, x(i + "." + L, function() { M(), b.req && b.req.abort() }) },
            getAjax: function(c) {
                K && d.addClass(K), b.updateStatus("loading");
                var e = a.extend({
                    url: c.src,
                    success: function(d, e, f) {
                        var g = { data: d, xhr: f };
                        z("ParseAjax", g), b.appendContent(a(g.data), L), c.finished = !0, M(), A(), setTimeout(function() { b.wrap.addClass(r) }, 16), b.updateStatus("ready"), z("AjaxContentAdded")
                    },
                    error: function() { M(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src)) }
                }, b.st.ajax.settings);
                return b.req = a.ajax(e), ""
            }
        }
    });
    var N, O = function(c) { if (c.data && void 0 !== c.data.title) return c.data.title; var d = b.st.image.titleSrc; if (d) { if (a.isFunction(d)) return d.call(b, c); if (c.el) return c.el.attr(d) || "" } return "" };
    a.magnificPopup.registerModule("image", {
        options: { markup: '<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>', cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.' },
        proto: {
            initImage: function() {
                var a = b.st.image,
                    c = ".image";
                b.types.push("image"), x(n + c, function() { "image" === b.currItem.type && a.cursor && d.addClass(a.cursor) }), x(i + c, function() { a.cursor && d.removeClass(a.cursor), w.off("resize" + q) }), x("Resize" + c, b.resizeImage), b.isLowIE && x("AfterChange", b.resizeImage)
            },
            resizeImage: function() {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                }
            },
            _onImageHasSize: function(a) { a.img && (a.hasSize = !0, N && clearInterval(N), a.isCheckingImgSize = !1, z("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1)) },
            findImageSize: function(a) {
                var c = 0,
                    d = a.img[0],
                    e = function(f) { N && clearInterval(N), N = setInterval(function() { return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(N), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500))) }, f) };
                e(1)
            },
            getImage: function(c, d) {
                var e = 0,
                    f = function() { c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, z("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g())) },
                    g = function() { c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0) },
                    h = b.st.image,
                    i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img", c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), c.img[0].naturalWidth > 0 && (c.hasSize = !0)
                }
                return b._parseMarkup(d, { title: O(c), img_replaceWith: c.img }, c), b.resizeImage(), c.hasSize ? (N && clearInterval(N), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
            }
        }
    });
    var P, Q = function() { return void 0 === P && (P = void 0 !== document.createElement("p").style.MozTransform), P };
    a.magnificPopup.registerModule("zoom", {
        options: { enabled: !1, easing: "ease-in-out", duration: 300, opener: function(a) { return a.is("img") ? a : a.find("img") } },
        proto: {
            initZoom: function() {
                var a = b.st.zoom,
                    c = ".zoom";
                if (a.enabled && b.supportsTransition) {
                    var d, e, f = a.duration,
                        g = function(b) {
                            var c = b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                d = "all " + a.duration / 1e3 + "s " + a.easing,
                                e = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" },
                                f = "transition";
                            return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, c.css(e), c
                        },
                        h = function() { b.content.css("visibility", "visible") };
                    x("BuildControls" + c, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(d), b.content.css("visibility", "hidden"), image = b._getItemToZoom(), !image) return void h();
                            e = g(image), e.css(b._getOffset()), b.wrap.append(e), d = setTimeout(function() { e.css(b._getOffset(!0)), d = setTimeout(function() { h(), setTimeout(function() { e.remove(), image = e = null, z("ZoomAnimationEnded") }, 16) }, f) }, 16)
                        }
                    }), x(j + c, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(d), b.st.removalDelay = f, !image) {
                                if (image = b._getItemToZoom(), !image) return;
                                e = g(image)
                            }
                            e.css(b._getOffset(!0)), b.wrap.append(e), b.content.css("visibility", "hidden"), setTimeout(function() { e.css(b._getOffset()) }, 16)
                        }
                    }), x(i + c, function() { b._allowZoom() && (h(), e && e.remove()) })
                }
            },
            _allowZoom: function() { return "image" === b.currItem.type },
            _getItemToZoom: function() { return b.currItem.hasSize ? b.currItem.img : !1 },
            _getOffset: function(c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(),
                    f = parseInt(d.css("padding-top"), 10),
                    g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = { width: d.width(), height: (v ? d.innerHeight() : d[0].offsetHeight) - g - f };
                return Q() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
            }
        }
    });
    var R = "iframe",
        S = "//about:blank",
        T = function(a) {
            if (b.currTemplate[R]) {
                var c = b.currTemplate[R].find("iframe");
                c.length && (a || (c[0].src = S), b.isIE8 && c.css("display", a ? "block" : "none"))
            }
        };
    a.magnificPopup.registerModule(R, {
        options: { markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: { youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" }, vimeo: { index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1" }, gmaps: { index: "//maps.google.", src: "%id%&output=embed" } } },
        proto: {
            initIframe: function() { b.types.push(R), x("BeforeChange", function(a, b, c) { b !== c && (b === R ? T() : c === R && T(!0)) }), x(i + "." + R, function() { T() }) },
            getIframe: function(c, d) {
                var e = c.src,
                    f = b.st.iframe;
                a.each(f.patterns, function() { return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0 });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
            }
        }
    });
    var U = function(a) { var c = b.items.length; return a > c - 1 ? a - c : 0 > a ? c + a : a },
        V = function(a, b, c) { return a.replace("%curr%", b + 1).replace("%total%", c) };
    a.magnificPopup.registerModule("gallery", {
        options: { enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)", tCounter: "%curr% of %total%" },
        proto: {
            initGallery: function() {
                var c = b.st.gallery,
                    d = ".mfp-gallery",
                    f = Boolean(a.fn.mfpFastClick);
                return b.direction = !0, c && c.enabled ? (g += " mfp-gallery", x(n + d, function() { c.navigateByImgClick && b.wrap.on("click" + d, ".mfp-img", function() { return b.items.length > 1 ? (b.next(), !1) : void 0 }), e.on("keydown" + d, function(a) { 37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next() }) }), x("UpdateStatus" + d, function(a, c) { c.text && (c.text = V(c.text, b.currItem.index, b.items.length)) }), x(m + d, function(a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? V(c.tCounter, f.index, g) : ""
                }), x("BuildControls" + d, function() {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace("%title%", c.tPrev).replace("%dir%", "left")).addClass(t),
                            g = b.arrowRight = a(d.replace("%title%", c.tNext).replace("%dir%", "right")).addClass(t),
                            h = f ? "mfpFastClick" : "click";
                        e[h](function() { b.prev() }), g[h](function() { b.next() }), b.isIE7 && (y("b", e[0], !1, !0), y("a", e[0], !1, !0), y("b", g[0], !1, !0), y("a", g[0], !1, !0)), b.container.append(e.add(g))
                    }
                }), x(o + d, function() { b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function() { b.preloadNearbyImages(), b._preloadTimeout = null }, 16) }), void x(i + d, function() { e.off(d), b.wrap.off("click" + d), b.arrowLeft && f && b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(), b.arrowRight = b.arrowLeft = null })) : !1
            },
            next: function() { b.direction = !0, b.index = U(b.index + 1), b.updateItemHTML() },
            prev: function() { b.direction = !1, b.index = U(b.index - 1), b.updateItemHTML() },
            goTo: function(a) { b.direction = a >= b.index, b.index = a, b.updateItemHTML() },
            preloadNearbyImages: function() {
                var a, c = b.st.gallery.preload,
                    d = Math.min(c[0], b.items.length),
                    e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
            },
            _preloadItem: function(c) {
                if (c = U(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), z("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function() { d.hasSize = !0 }).on("error.mfploader", function() { d.hasSize = !0, d.loadError = !0, z("LazyLoadError", d) }).attr("src", d.src)), d.preloaded = !0
                }
            }
        }
    });
    var W = "retina";
    a.magnificPopup.registerModule(W, {
            options: { replaceSrc: function(a) { return a.src.replace(/\.\w+$/, function(a) { return "@2x" + a }) }, ratio: 1 },
            proto: {
                initRetina: function() {
                    if (window.devicePixelRatio > 1) {
                        var a = b.st.retina,
                            c = a.ratio;
                        c = isNaN(c) ? c() : c, c > 1 && (x("ImageHasSize." + W, function(a, b) { b.img.css({ "max-width": b.img[0].naturalWidth / c, width: "100%" }) }), x("ElementParse." + W, function(b, d) { d.src = a.replaceSrc(d, c) }))
                    }
                }
            }
        }),
        function() {
            var b = 1e3,
                c = "ontouchstart" in window,
                d = function() { w.off("touchmove" + f + " touchend" + f) },
                e = "mfpFastClick",
                f = "." + e;
            a.fn.mfpFastClick = function(e) {
                return a(this).each(function() {
                    var g, h = a(this);
                    if (c) {
                        var i, j, k, l, m, n;
                        h.on("touchstart" + f, function(a) { l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, w.on("touchmove" + f, function(a) { m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0], (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) && (l = !0, d()) }).on("touchend" + f, function(a) { d(), l || n > 1 || (g = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function() { g = !1 }, b), e()) }) })
                    }
                    h.on("click" + f, function() { g || e() })
                })
            }, a.fn.destroyMfpFastClick = function() { a(this).off("touchstart" + f + " click" + f), c && w.off("touchmove" + f + " touchend" + f) }
        }()
}(window.jQuery || window.Zepto),
function(a, b, c) {
    ! function(a, b) { "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", b) : "object" == typeof module && module.exports ? module.exports = b() : a.EvEmitter = b() }(this, function() {
        function a() {}
        var b = a.prototype;
        return b.on = function(a, b) {
            if (a && b) {
                var c = this._events = this._events || {},
                    d = c[a] = c[a] || [];
                return -1 == d.indexOf(b) && d.push(b), this
            }
        }, b.once = function(a, b) {
            if (a && b) {
                this.on(a, b);
                var c = this._onceEvents = this._onceEvents || {},
                    d = c[a] = c[a] || [];
                return d[b] = !0, this
            }
        }, b.off = function(a, b) { var c = this._events && this._events[a]; if (c && c.length) { var d = c.indexOf(b); return -1 != d && c.splice(d, 1), this } }, b.emitEvent = function(a, b) {
            var c = this._events && this._events[a];
            if (c && c.length) {
                var d = 0,
                    e = c[d];
                b = b || [];
                for (var f = this._onceEvents && this._onceEvents[a]; e;) {
                    var g = f && f[e];
                    g && (this.off(a, e), delete f[e]), e.apply(this, b), d += g ? 0 : 1, e = c[d]
                }
                return this
            }
        }, a
    }),
    function(a, b) { "use strict"; "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(c) { return b(a, c) }) : "object" == typeof module && module.exports ? module.exports = b(a, require("ev-emitter")) : a.imagesLoaded = b(a, a.EvEmitter) }(a, function(a, b) {
        function d(a, b) { for (var c in b) a[c] = b[c]; return a }

        function e(a) {
            var b = [];
            if (Array.isArray(a)) b = a;
            else if ("number" == typeof a.length)
                for (var c = 0; c < a.length; c++) b.push(a[c]);
            else b.push(a);
            return b
        }

        function f(a, b, c) { return this instanceof f ? ("string" == typeof a && (a = document.querySelectorAll(a)), this.elements = e(a), this.options = d({}, this.options), "function" == typeof b ? c = b : d(this.options, b), c && this.on("always", c), this.getImages(), i && (this.jqDeferred = new i.Deferred), void setTimeout(function() { this.check() }.bind(this))) : new f(a, b, c) }

        function g(a) { this.img = a }

        function h(a, b) { this.url = a, this.element = b, this.img = new Image }
        var i = a.jQuery,
            j = a.console;
        f.prototype = Object.create(b.prototype), f.prototype.options = {}, f.prototype.getImages = function() { this.images = [], this.elements.forEach(this.addElementImages, this) }, f.prototype.addElementImages = function(a) {
            "IMG" == a.nodeName && this.addImage(a), this.options.background === !0 && this.addElementBackgroundImages(a);
            var b = a.nodeType;
            if (b && k[b]) {
                for (var c = a.querySelectorAll("img"), d = 0; d < c.length; d++) {
                    var e = c[d];
                    this.addImage(e)
                }
                if ("string" == typeof this.options.background) {
                    var f = a.querySelectorAll(this.options.background);
                    for (d = 0; d < f.length; d++) {
                        var g = f[d];
                        this.addElementBackgroundImages(g)
                    }
                }
            }
        };
        var k = { 1: !0, 9: !0, 11: !0 };
        return f.prototype.addElementBackgroundImages = function(a) {
            var b = getComputedStyle(a);
            if (b)
                for (var c = /url\((['"])?(.*?)\1\)/gi, d = c.exec(b.backgroundImage); null !== d;) {
                    var e = d && d[2];
                    e && this.addBackground(e, a), d = c.exec(b.backgroundImage)
                }
        }, f.prototype.addImage = function(a) {
            var b = new g(a);
            this.images.push(b)
        }, f.prototype.addBackground = function(a, b) {
            var c = new h(a, b);
            this.images.push(c)
        }, f.prototype.check = function() {
            function a(a, c, d) { setTimeout(function() { b.progress(a, c, d) }) }
            var b = this;
            return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(b) { b.once("progress", a), b.check() }) : void this.complete()
        }, f.prototype.progress = function(a, b, c) { this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emitEvent("progress", [this, a, b]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && j && j.log("progress: " + c, a, b) }, f.prototype.complete = function() {
            var a = this.hasAnyBroken ? "fail" : "done";
            if (this.isComplete = !0, this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
                var b = this.hasAnyBroken ? "reject" : "resolve";
                this.jqDeferred[b](this)
            }
        }, g.prototype = Object.create(b.prototype), g.prototype.check = function() { var a = this.getIsImageComplete(); return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src)) }, g.prototype.getIsImageComplete = function() { return this.img.complete && this.img.naturalWidth !== c }, g.prototype.confirm = function(a, b) { this.isLoaded = a, this.emitEvent("progress", [this, this.img, b]) }, g.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a)
        }, g.prototype.onload = function() { this.confirm(!0, "onload"), this.unbindEvents() }, g.prototype.onerror = function() { this.confirm(!1, "onerror"), this.unbindEvents() }, g.prototype.unbindEvents = function() { this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, h.prototype = Object.create(g.prototype), h.prototype.check = function() {
            this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
            var a = this.getIsImageComplete();
            a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
        }, h.prototype.unbindEvents = function() { this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, h.prototype.confirm = function(a, b) { this.isLoaded = a, this.emitEvent("progress", [this, this.element, b]) }, f.makeJQueryPlugin = function(b) { b = b || a.jQuery, b && (i = b, i.fn.imagesLoaded = function(a, b) { var c = new f(this, a, b); return c.jqDeferred.promise(i(this)) }) }, f.makeJQueryPlugin(), f
    })
}(window, jQuery),
function() {
    "use strict";
    ! function(a) {
        var b, c, d = a.event;
        b = d.special.smartresize = {
            setup: function() { a(this).on("resize", b.handler) },
            teardown: function() { a(this).off("resize", b.handler) },
            handler: function(a, e) {
                var f = this,
                    g = arguments,
                    h = function() { a.type = "smartresize", d.dispatch.apply(f, g) };
                c && clearTimeout(c), e ? h() : c = setTimeout(h, b.threshold)
            },
            threshold: 150
        }, a.fn.smartresize = function(a) { return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"]) }
    }(jQuery)
}(window, jQuery),
function() {
    "use strict";
    window.VAMTAM = window.VAMTAM || {}, window.VAMTAM.Constants = window.VAMTAM.Constants || {}, window.VAMTAM.MEDIA = window.VAMTAM.MEDIA || { layout: {} }, jQuery.fn.originalAnimate = jQuery.fn.originalAnimate || jQuery.fn.animate, jQuery.fn.originalStop = jQuery.fn.originalStop || jQuery.fn.stop,
        function(a) {
            function b(a, b, c, d) { return function() { a--, (0 === a && d || 1 > a && !d) && b.call(c || {}) } }
            window.VAMTAM.reduce_column_count = function(b) {
                if (!a("body").hasClass("responsive-layout")) return b;
                var c = a(window).width();
                return 768 > c ? 1 : c >= 768 && 1024 >= c ? Math.min(b, 2) : c > 1024 && 1280 > c ? Math.min(b, 3) : b
            }, a.getCssPropertyName = function d(b) {
                d.cache || (d.cache = {});
                var c = String(b).replace(/\-(\w)/g, function(a, b) { return b.toUpperCase() });
                if (!(c in d.cache)) {
                    var e, f, g = a("<i/>")[0].style,
                        h = "",
                        i = ["Moz", "Webkit", "O", "Khtml", "Ms", "ms"];
                    if (void 0 !== g[b]) h = b;
                    else if (void 0 !== g[c]) h = c;
                    else
                        for (e = 0; e < i.length; e++)
                            if (f = i[e] + c.charAt(0).toUpperCase() + c.substr(1), void 0 !== g[f]) { h = f; break }
                    d.cache[c] = h
                }
                return d.cache[c]
            };
            var c = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", msTransition: "MSTransitionEnd", transition: "transitionend" };
            window.VAMTAM.Constants.vendor = { transition: a.getCssPropertyName("transition"), transitionProperty: a.getCssPropertyName("transition-property"), transform: a.getCssPropertyName("transform"), transformOrigin: a.getCssPropertyName("transform-origin"), transitionDuration: a.getCssPropertyName("transitionDuration"), transitionDelay: a.getCssPropertyName("transitionDelay"), transitionTimingFunction: a.getCssPropertyName("transitionTimingFunction"), transitionEndEvent: c[Modernizr.prefixed("transition")] }, window.VAMTAM.Constants.Esing = { bounce: "cubic-bezier(0.0, 0.35, .5, 1.3)", linear: "linear", swing: "ease-in-out", easeInQuad: "cubic-bezier(0.550,  0.085, 0.680, 0.530)", easeInCubic: "cubic-bezier(0.550,  0.055, 0.675, 0.190)", easeInQuart: "cubic-bezier(0.895,  0.030, 0.685, 0.220)", easeInQuint: "cubic-bezier(0.755,  0.050, 0.855, 0.060)", easeInSine: "cubic-bezier(0.470,  0.000, 0.745, 0.715)", easeInExpo: "cubic-bezier(0.950,  0.050, 0.795, 0.035)", easeInCirc: "cubic-bezier(0.600,  0.040, 0.980, 0.335)", easeInBack: "cubic-bezier(0.600, -0.280, 0.735, 0.045)", easeOutQuad: "cubic-bezier(0.250,  0.460, 0.450, 0.940)", easeOutCubic: "cubic-bezier(0.215,  0.610, 0.355, 1.000)", easeOutQuart: "cubic-bezier(0.165,  0.840, 0.440, 1.000)", easeOutQuint: "cubic-bezier(0.230,  1.000, 0.320, 1.000)", easeOutSine: "cubic-bezier(0.390,  0.575, 0.565, 1.000)", easeOutExpo: "cubic-bezier(0.190,  1.000, 0.220, 1.000)", easeOutCirc: "cubic-bezier(0.075,  0.820, 0.165, 1.000)", easeOutBack: "cubic-bezier(0.175,  0.885, 0.320, 1.275)", easeInOutQuad: "cubic-bezier(0.455,  0.030, 0.515, 0.955)", easeInOutCubic: "cubic-bezier(0.645,  0.045, 0.355, 1.000)", easeInOutQuart: "cubic-bezier(0.770,  0.000, 0.175, 1.000)", easeInOutQuint: "cubic-bezier(0.860,  0.000, 0.070, 1.000)", easeInOutSine: "cubic-bezier(0.445,  0.050, 0.550, 0.950)", easeInOutExpo: "cubic-bezier(1.000,  0.000, 0.000, 1.000)", easeInOutCirc: "cubic-bezier(0.785,  0.135, 0.150, 0.860)", easeInOutBack: "cubic-bezier(0.680, -0.550, 0.265, 1.550)" }, window.VAMTAM.Constants.Events = { touchstart: "ontouchstart" in document.documentElement ? "touchstart" : "mousedown", mousemove: "ontouchmove" in document.documentElement ? "touchmove" : "mousemove", mouseup: "ontouchend" in document.documentElement ? "touchend" : "mouseup" }, a.camelCase2dashes = function(a) { return a.replace(/[A-Z]/g, function(a) { return "-" + a.toLowerCase() }) }, a.createCountingCallback = b, a.fn.setTransition = function(b, c, d, e, f) {
                    return this.unsetTransition().each(function(g, h) {
                        var i = a(h),
                            j = { cssOld: {}, cssNew: {}, cssFrom: {}, props: b, timer: 0, callback: f, easing: d && d in window.VAMTAM.Constants.Esing ? d : "swing", duration: c || 0 === c ? c : 600, delay: e };
                        i.data("transitionMetadata", j);
                        var k, l, m, n = [],
                            o = a("<div/>");
                        for (var p in b) l = i.css(p), m = b[p], o.css(p, m), o.css(p) !== l ? (j.cssFrom[p] = l, n.push(a.camelCase2dashes(p))) : k = !0;
                        return o = null, (n = n.join(", ")) ? void(window.VAMTAM.Constants.vendor.transition ? (j.cssOld[window.VAMTAM.Constants.vendor.transition] = h.style[window.VAMTAM.Constants.vendor.transition], j.cssOld[window.VAMTAM.Constants.vendor.transitionProperty] = h.style[window.VAMTAM.Constants.vendor.transitionProperty], j.cssOld[window.VAMTAM.Constants.vendor.transitionDelay] = h.style[window.VAMTAM.Constants.vendor.transitionDelay], j.cssOld[window.VAMTAM.Constants.vendor.transitionDuration] = h.style[window.VAMTAM.Constants.vendor.transitionDuration], j.cssOld[window.VAMTAM.Constants.vendor.transitionTimingFunction] = h.style[window.VAMTAM.Constants.vendor.transitionTimingFunction], j.cssNew[window.VAMTAM.Constants.vendor.transition] = "", j.cssNew[window.VAMTAM.Constants.vendor.transitionProperty] = n, j.cssNew[window.VAMTAM.Constants.vendor.transitionDelay] = (e || 0) + "ms", j.cssNew[window.VAMTAM.Constants.vendor.transitionDuration] = j.duration + "ms", j.cssNew[window.VAMTAM.Constants.vendor.transitionTimingFunction] = window.VAMTAM.Constants.Esing[j.easing], j.onTransitionEnd = function(c) { c.target === h && c.propertyName && (b.hasOwnProperty(c.propertyName) || b.hasOwnProperty(a.camelCase(c.propertyName))) && i.unsetTransition(1, 1) }, this.addEventListener(window.VAMTAM.Constants.vendor.transitionEndEvent, j.onTransitionEnd, !1), i.css(j.cssFrom).css(j.cssNew), j.timer = setTimeout(function() { i.unsetTransition(1, 1) }, j.duration + (e || 0)), i.css(b)) : i.delay(e || 0).originalAnimate(b, { duration: j.duration, easing: j.easing, complete: f, queue: !0 })) : void(k && a.isFunction(f) && i.delay(e || 0).queue(function() { f.call(h), i.dequeue() }))
                    })
                }, a.fn.unsetTransition = function(b, c) {
                    return this.each(function(d, e) {
                        var f = a(e),
                            g = f.data("transitionMetadata");
                        if (window.VAMTAM.Constants.vendor.transition || f.originalStop(1, b && c), g) {
                            if (window.VAMTAM.Constants.vendor.transition)
                                if (g.timer && clearTimeout(g.timer), e.removeEventListener(window.VAMTAM.Constants.vendor.transitionEndEvent, g.onTransitionEnd, !1), b) f.css(g.cssOld).css(g.props), c && a.isFunction(g.callback) && g.callback.call(e);
                                else {
                                    var h = {};
                                    for (var i in g.props) h[i] = f.css(i);
                                    f.css(window.VAMTAM.Constants.vendor.transition, "none").css(h).css(g.cssOld)
                                }
                            g = null, f.removeData("transitionMetadata")
                        }
                    })
                }, a.fn.undoTransition = function(b) {
                    return this.each(function(c, d) {
                        var e = a(d),
                            f = e.data("transitionMetadata");
                        f && (e.unsetTransition(), b ? e.setTransition(f.cssFrom, f.duration, f.easing, f.delay) : e.css(f.cssFrom), f = null)
                    })
                }, a.fn.wpvAddClass = function(c, d, e, f, g) {
                    var h = b(this.length, g || a.noop, this);
                    return this.delay(f || 0).queue(function() {
                        if (window.VAMTAM.Constants.vendor.transition) {
                            var b = {};
                            b[window.VAMTAM.Constants.vendor.transition] = "", b[window.VAMTAM.Constants.vendor.transitionProperty] = "all", b[window.VAMTAM.Constants.vendor.transitionDelay] = (f || 0) + "ms", b[window.VAMTAM.Constants.vendor.transitionDuration] = (d || 0) + "ms", b[window.VAMTAM.Constants.vendor.transitionTimingFunction] = window.VAMTAM.Constants.Esing[e], a(this).css(b).addClass(c)
                        } else a(this).addClass(c, d, e, h)
                    }), this.dequeue()
                }, a.fn.wpvRemoveClass = function(c, d, e, f, g) {
                    var h = b(this.length, g || a.noop, this);
                    return this.delay(f || 0).queue(function() {
                        if (window.VAMTAM.Constants.vendor.transition) {
                            var b = {};
                            b[window.VAMTAM.Constants.vendor.transition] = "", b[window.VAMTAM.Constants.vendor.transitionProperty] = "all", b[window.VAMTAM.Constants.vendor.transitionDelay] = (f || 0) + "ms", b[window.VAMTAM.Constants.vendor.transitionDuration] = (d || 0) + "ms", b[window.VAMTAM.Constants.vendor.transitionTimingFunction] = window.VAMTAM.Constants.Esing[e], a(this).css(b).removeClass(c)
                        } else a(this).removeClass(c, d, e, h)
                    }), this.dequeue()
                },
                function() {
                    function b(a) {
                        function d() { f ? c[e] = setTimeout(d, 500) : (i = a() ? h.minDelay : Math.min(i + h.step, h.maxDelay), c[e] = setTimeout(d, i)) }
                        if (!(this instanceof b)) return new b(a);
                        var e, f, g = 0,
                            h = this,
                            i = this.minDelay;
                        do e = "pool-" + g++; while (e in c);
                        this.start = function() { c[e] = setTimeout(d, 0) }, this.stop = function() { clearTimeout(c[e]) }, this.pause = function() { f = !0 }, this.resume = function() { f = !1 }
                    }
                    var c = {};
                    b.prototype = { minDelay: 0, maxDelay: 500, step: 5 }, a.AdaptivePool = b
                }(),
                function() {
                    function b(b) {
                        var c = d[b].elem,
                            e = c.offsetWidth,
                            f = c.offsetHeight,
                            g = 0;
                        return e !== d[b].lastWidth && (d[b].lastWidth = e, g = 1), f !== d[b].lastHeight && (d[b].lastHeight = f, g = 1), g ? (a(c).trigger("elementResize", { width: e, height: f }), !0) : !1
                    }
                    var c = 0,
                        d = {};
                    a.fn.watchResize = function(e, f) {
                        return this.each(function() {
                            var e = a(this).data("resizewatch");
                            if (e && d.hasOwnProperty(e)) d[e].handlers++;
                            else {
                                e = "elem_" + c++;
                                var g = 0,
                                    h = function() { var a = !1; return g || (g = 1, a = b(e), g = 0), a },
                                    i = a.AdaptivePool(h);
                                a.extend(i, f), d[e] = { elem: this, lastWidth: this.offsetWidth, lastHeight: this.offsetHeight, handlers: 1, pool: i }, a(this).data("resizewatch", e), d[e].pool.start()
                            }
                        }).bind("elementResize", e)
                    }, a.fn.unwatchResize = function(b) {
                        return this.each(function() {
                            var c = a(this).data("resizewatch");
                            c && (d.hasOwnProperty("key") && (d[c].pool.stop(), --d[c].handlers <= 0 && (delete d[c], a(this).removeData("resizewatch"))), a(this).unbind("elementResize", b))
                        })
                    }, a.fn.pauseResizeWatcher = function() {
                        return this.each(function() {
                            var b = a(this).data("resizewatch");
                            b && d.hasOwnProperty("key") && d[b].pool.pause()
                        })
                    }, a.fn.resumeResizeWatcher = function() {
                        return this.each(function() {
                            var b = a(this).data("resizewatch");
                            b && d.hasOwnProperty("key") && d[b].pool.resume()
                        })
                    }
                }(jQuery), a.fn.nativeSize = function(b) {
                    var c = this[0],
                        d = { width: 0, height: 0 };
                    if (c) {
                        var e, f;
                        b && (e = c.style.width, f = c.style.height, a(c).css({ width: "auto", height: "auto" })), d.width = c.naturalWidth || c.width || a(c).width(), d.height = c.naturalHeight || c.height || a(c).height(), b && a(c).css({ width: e, height: f })
                    }
                    return d
                }, a.fn.toFixedWidth = function() { return this.each(function() { a(this).css("width", a(this).width()) }) }, a.jsPath = function(a, b, c) {
                    for (var d, e = a, f = b.replace(/\[['"]?([^\]]+)['"]?\]/g, ".$1").split("."), g = f.length, h = [], i = 0; g > i; i++) {
                        if (h[i] = d = f[i], i === g - 1) return arguments.length < 3 ? e[d] : void 0 === c ? e.hasOwnProperty(d) ? (delete e[d], !0) : !1 : e[d] !== c ? (e[d] = c, !0) : !1;
                        if (!e.hasOwnProperty(d)) {
                            if (2 === arguments.length) return void 0;
                            e[d] = isNaN(parseFloat(d)) || "" + parseFloat(d) != "" + d ? {} : []
                        }
                        e = e[d]
                    }
                },
                function() {
                    a.fn.thumbnail = function(b) {
                        var c = a.getCssPropertyName("background-size"),
                            d = a.extend({ classNames: "bg-thumbnail", resizing: "cover", url: "about:blank", callback: a.noop, autoConfig: !1 }, b);
                        return this.each(function(b, e) { var f, g = a("<div/>").addClass(d.classNames).appendTo(e); return d.url && "about:blank" !== d.url ? (d.autoConfig && g.css({ width: "100%", height: "100%", display: "inline-block", top: 0, left: 0, position: "relative", margin: 0, padding: 0, zIndex: 1, overflow: "hidden" }), void(c ? (f = new Image, f.onload = function() { g.css("backgroundImage", "url('" + this.src + "')").setBgSize(d.resizing), d.callback() }, f.src = d.url) : (f = a("<img />").appendTo(g), d.autoConfig && f.css({ display: "block", position: "absolute", width: "auto", height: "auto", zIndex: 2 }), f.bind("load", function() { f = this, setTimeout(function() { a(f).show().objectFit(d.resizing, g) }, 0), d.callback() }).attr("src", d.url)))) : void d.callback() })
                    }
                }(), a.fn.objectFit = function(b, c) {
                    return this.each(function(d, e) {
                        var f = a(e);
                        if ("auto" === b || "none" === b || "crop" === b) return f.css({ top: "50%", left: "50%", width: "auto", height: "auto", maxWidth: "none", maxHeight: "none" }).css({ marginLeft: -f.width() / 2, marginTop: -f.height() / 2 }), !1;
                        if ("crop-top" === b) return f.css({ top: 0, left: "50%", width: "auto", height: "auto", maxWidth: "none", maxHeight: "none" }).css({ marginLeft: -f.width() / 2, marginTop: 0 }), !1;
                        if ("fill" === b || "stretch" === b) return f.css({ width: "100%", height: "100%", top: 0, left: 0, marginLeft: 0, marginTop: 0 }), !1;
                        var g = { width: c.width(), height: c.height() };
                        if (!g.width || !g.height) return void setTimeout(function() { a(e).objectFit(b, c) }, 1e3);
                        e.parentNode.parentNode.resizeWatchAttached || (e.parentNode.parentNode.resizeWatchAttached = 1, a(e.parentNode.parentNode).watchResize(function() { a(e).objectFit(b, c) }, { minDelay: 20, maxDelay: 500, step: 25 }));
                        var h, i, j = f.nativeSize(!0);
                        return "contain" === b || "fit" === b ? (i = j.height * (g.width / j.width), h = g.width, i > g.height && (h = j.width * (g.height / j.height), i = g.height), f.css({ top: "50%", left: "50%", width: h, height: i, marginLeft: -h / 2, marginTop: -i / 2 }), !1) : "cover" === b ? (h = g.width, i = j.height * (g.width / j.width), i < g.height && (h = j.width * (g.height / j.height), i = g.height), f.css({ maxWidth: "none", maxHeight: "none", top: "50%", left: "50%", width: h, height: i, marginLeft: -h / 2, marginTop: -(i / 2) }), !1) : "cover-top" === b || "cover-bottom" === b ? (i = j.height * (g.width / j.width), h = g.width, i < g.height && (h = j.width * (g.height / j.height), i = g.height), f.css({ maxWidth: "none", maxHeight: "none", top: "cover-top" === b ? 0 : "auto", bottom: "cover-top" === b ? "auto" : 0, left: "50%", width: h, height: i, marginLeft: -h / 2, marginTop: 0, marginBottom: 0 }), !1) : void 0
                    }), this
                }, a.fn.setBgSize = function(b) {
                    var c = a.getCssPropertyName("background-size");
                    if (c) switch (b) {
                        case "contain":
                        case "cover":
                            this.css(c, b).css("backgroundPosition", "50% 50%");
                            break;
                        case "fit":
                            this.css(c, "contain").css("backgroundPosition", "50% 50%");
                            break;
                        case "cover-top":
                            this.css(c, "cover").css("backgroundPosition", "50% 0%");
                            break;
                        case "cover-bottom":
                            this.css(c, "cover").css("backgroundPosition", "50% 100%");
                            break;
                        case "fill":
                            this.css(c, "100% 100%").css("backgroundPosition", "0% 0%");
                            break;
                        case "crop-top":
                            this.css(c, "auto").css("backgroundPosition", "50% 0%");
                            break;
                        case "none":
                        case "auto":
                        case "crop":
                        default:
                            this.css(c, "auto").css("backgroundPosition", "50% 50%")
                    }
                    return this
                }, a.fn.touchwipe = function(b) {
                    var c = { min_move_x: 20, min_move_y: 20, wipeLeft: function() {}, wipeRight: function() {}, wipeUp: function() {}, wipeDown: function() {}, preventDefaultEvents: !0, canUseEvent: function() { return !0 } };
                    return b && a.extend(c, b), this.each(function(b, d) {
                        function e() { a(d).unbind("touchmove", f), h = null, j = !1 }

                        function f(a) {
                            if (c.preventDefaultEvents && a.preventDefault(), j) {
                                var b = a.originalEvent.touches ? a.originalEvent.touches[0].pageX : a.pageX,
                                    f = a.originalEvent.touches ? a.originalEvent.touches[0].pageY : a.pageY,
                                    g = h - b,
                                    k = i - f;
                                Math.abs(g) >= c.min_move_x ? (e(), g > 0 ? c.wipeLeft.call(d, a) : c.wipeRight.call(d, a)) : Math.abs(k) >= c.min_move_y && (e(), k > 0 ? c.wipeDown.call(d, a) : c.wipeUp.call(d, a))
                            }
                        }

                        function g(b) {
                            if (!c.canUseEvent(b)) return !0;
                            if (b.originalEvent.touches) {
                                if (b.originalEvent.touches.length > 1) return !0;
                                h = b.originalEvent.touches[0].pageX, i = b.originalEvent.touches[0].pageY
                            } else h = b.pageX, i = b.pageY;
                            j = !0, a(d).bind("touchmove", f), c.preventDefaultEvents && b.preventDefault(), b.stopPropagation()
                        }
                        var h, i, j = !1;
                        a(d).bind("touchstart", g)
                    }), this
                }
        }(jQuery)
}(),
function(a) {
    "use strict";

    function b(a, b) { return h.call(a) === "[object " + b + "]" }

    function c() { window.console && console.log && a.each(arguments, function(a, b) { console.log(b) }) }

    function d(a, b) { return a = parseInt(a, 10), isNaN(a) && (a = void 0 === b ? 0 : b), a }

    function e(a, b, c, d) { return "next" === d ? 1 : "prev" === d ? -1 : a === c - 1 && 0 === b ? 1 : 0 === a && b === c - 1 ? -1 : b > a ? 1 : -1 }

    function f() { return screen.width < 600 || screen.height < 800 }

    function g(b, c) {
        function e(b) {
            if (b || k._loaded) {
                var c = !1;
                for (var d in k._resizeHandlers) c = !0, k._resizeHandlers[d](k);
                c && k._loaded && (a(k.element).height(k._getDisplayHeight()), k.resizing(k.options.resizing))
            }
        }
        this.__INST_ID = "Slider_" + l++, this._path = [0], this._fxId = null, this._fxUID = null, this._timer = null, this.options = {}, this._listeners = {}, this._resizeHandlers = {}, this.element = a(c).addClass("vamtam-slider loading").css("visibility", "hidden")[0], this.slides = [], this._slideshowController = { start: 0, end: 0, pos: 0 }, this.option(a.extend({}, g.defaults, b));
        var f = this;
        this.options.pauseOnHover && a(this.element).mouseover(function() { f.pause() }).mouseleave(function() { f.resume() });
        var h = d(this.options.initialHeight),
            i = this.options.height;
        a.isFunction(i) && (i = i()), i = d(i), h && h !== i ? a(this.element).css("height", Math.abs(d(h, d(i, 100)))) : a(this.element).css("height", this._getDisplayHeight());
        var j, k = this;
        a(window).bind("resize." + this.__INST_ID, function() {
            var b = a(k.element).width();
            b && b !== j && (j = b, e())
        });
        var m;
        this.filter = function(b, c) {
            if (!f._fxId) throw "No effect has been set yet, so I can't filter the slides now";
            if (!a.isFunction(g.Effects[f._fxId].uninit)) throw "The current effect must have 'uninit' method to be compatible with the filter functionality";
            m || (m = f.slides), this.showLoadingMask(function() {
                var d = [];
                f.foreachSlide(function(a, c, e) { c.element = null, e || b(c) === !1 || d.push(c) }, m), a.VamtamSlider.Effects[f._fxId].uninit(f), a(".slide-wrapper", f.element).remove(), f.slides = d, f._path = [0], f._loaded = !1, f._initAllSlides(function() { a.VamtamSlider.Effects[f._fxId].init(f), setTimeout(function() { f.pos(c || 0), f._loaded = !0, f.hideLoadingMask() }, 0) })
            })
        }, this._load()
    }
    var h = Object.prototype.toString,
        i = a.getCssPropertyName("background-size"),
        j = function() { var a = 1; return function() { return "uid_" + a++ } }(),
        k = { Android: function() { return /Android/i.test(navigator.userAgent) }, BlackBerry: function() { return /BlackBerry/i.test(navigator.userAgent) }, iPhone: function() { return /iPhone/i.test(navigator.userAgent) }, iPad: function() { return /iPad/i.test(navigator.userAgent) }, iPod: function() { return /iPod/i.test(navigator.userAgent) }, iOS: function() { return this.iPhone() || this.iPad() || this.iPod() }, Opera: function() { return /Opera Mini/i.test(navigator.userAgent) }, Windows: function() { return /IEMobile/i.test(navigator.userAgent) }, Fennec: function() { return /Fennec/i.test(navigator.userAgent) }, any: function() { return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows() || this.Fennec() } },
        l = 1;
    g.defaults = { pauseTime: 8e3, animationTime: 2e3, pauseOnHover: !0, autostart: !0, easing: "swing", effect: "fade", useKeyboard: !0, autoFocus: !1, pager: "auto", resizing: "cover", initialHeight: null, minHeight: 100, height: 300, maintainAspectRatio: !1, maxWidth: null, loadingMask: !0, captionContainer: null, captionQueue: !0, captionFxEasing: "swing", captionFxDelay: 0, initialIndex: 0, complexSlidesDuration: 3e3, forceNestedAnimationTimes: !1, disableOnMobiles: !1 }, g.create = function(b, c, d) {
        var e = "vamtamSlider";
        a.fn[b] = function(f) {
            var h = "string" == typeof f,
                i = Array.prototype.slice.call(arguments, 1),
                j = this;
            if (h && /\b_/.test(f)) return j;
            if (h) this.each(function() { var c = a(this).data(e); if (!c) throw "cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'"; var d = a.jsPath(c, f); if (!a.isFunction(d)) throw "no such method '" + f + "' for " + b + " widget instance"; var g = d.apply(c, i); return g !== c && void 0 !== g ? (j = g, !1) : void 0 });
            else {
                var k = a.extend(!0, {}, d || g.defaults, f);
                this.each(function() {
                    var b = a(this).data(e);
                    b ? b.option(k) : a(this).data(e, new c(k, this))
                })
            }
            return j
        }
    }, g.prototype = {
        on: function(a, b) { a = String(a).toLowerCase(), _listeners[a] || (_listeners[a] = []), _listeners[a].push(b) },
        _notify: function(b, c) {
            b = String(b).toLowerCase();
            var d = this;
            a.each(_listeners[b] || [], function(b, e) { return e.apply(d, a.makeArray(c)) })
        },
        option: function(b, c) { if (null === b) return this.options; if (a.isPlainObject(b)) { for (var d in b) this.option(d, b[d]); return this } if (b && "string" == typeof b) { var e; return void 0 === c ? (e = "_getOption_" + b, a.isFunction(this[e]) ? this[e]() : a.jsPath(this.options, b)) : (e = "_setOption_" + b, a.isFunction(this[e]) ? this[e](c) : a.jsPath(this.options, b, c), this) } },
        _setOption_loadingMask: function(b) { b && "string" == typeof b ? this._loadingMask = a(b).addClass("vamtam-slider-loading-mask") : b ? this._loadingMask || (this._loadingMask = a('<div class="vamtam-slider-loading-mask" />').appendTo(this.element)) : this._loadingMask = null },
        _setWindowSizeDependentOption: function(b, c) {
            if (a.isFunction(c)) {
                var d = this;
                this._resizeHandlers[b] = function() { d.options[b] = c(d) }, d.options[b] = c(d)
            } else this.options[b] = c, b in this._resizeHandlers && delete this._resizeHandlers[b]
        },
        _setOption_maintainAspectRatio: function(a) { this._setWindowSizeDependentOption("maintainAspectRatio", a) },
        _setOption_height: function(a) { this._setWindowSizeDependentOption("height", a) },
        _setOption_captionContainer: function(b) { b && "string" == typeof b ? this._captionContainer = a(b) : b ? this._captionContainer || (this._captionContainer = a('<div class="vamtam-slider-caption-container" />').appendTo(this.element)) : this._captionContainer = null },
        _getIsHtmlOnly: function() { var b = !0; return a.each(this.slides, function(a, c) { return "html" !== c.type ? (b = !1, !1) : void 0 }), b },
        _getCaptionContainer: function() { return this._captionContainer || this._setOption_captionContainer(!0), this._captionContainer },
        _initAllSlides: function(a) {
            function b() {++d >= c && a() }
            var c = this.countSlides(),
                d = 0,
                e = this;
            this.foreachSlide(function(a, c) { e._initSlide(c, b) })
        },
        _initSlide: function(b, c, d) {
            function e() {
                if (a.isArray(b.captions) && b.captions.length) {
                    var d = a('<div class="captions-wrapper"/>').appendTo(f._getCaptionContainer());
                    a(b.wrapper).data("captionsWrapper", d[0]), a.each(b.captions, function(b, c) {
                        var e = a('<div class="caption n' + (b + 1) + '"/>');
                        e.html(c.html), c.style && e.css(c.style), e.appendTo(d)
                    })
                }
                c()
            }
            var f = this;
            switch (b.type) {
                case "img":
                case "image":
                    this._initImageSlide(b, e, d);
                    break;
                case "html":
                    this._initHtmlSlide(b, e, d);
                    break;
                case "gallery":
                    this._initGallerySlide(b, e, d);
                    break;
                default:
                    e()
            }
        },
        _initImageSlide: function(b, d, e) {
            if (b.element) return void d();
            var f = this;
            if (b.wrapper = a('<div class="slide-wrapper" />').appendTo(e || f.element), i) {
                b.element = a('<div class="slide type-bg-image"/>').appendTo(b.wrapper)[0];
                var g = new Image;
                if (g.onload = function() { b.element.style.backgroundImage = "url('" + this.src + "')", a(b.element).setBgSize(f.options.resizing), setTimeout(function() { g = null }, 10), d() }, "RetinaImagePath" in window && window.devicePixelRatio > 1) {
                    var h = new RetinaImagePath(b.url);
                    h.check_2x_variant(function(a) { g.src = a ? h.at_2x_path : b.url })
                } else g.src = b.url
            } else b.element = a('<img class="slide type-image" />').appendTo(b.wrapper)[0], a(b.element).bind("load", function() { a(this).objectFit(f.options.resizing, a(e || f.element)), d() }).attr("src", b.url);
            b.style && a(b.element).css(b.style), b.href && a(b.wrapper).css({ cursor: "pointer" }).click(function(d) {
                if (d.isDefaultPrevented()) return !1;
                if (!a(this).is(".active")) return !1;
                var e = String(b.hrefTarget || "self").replace(/^_/, "");
                if ("blank" === e || "new" === e) window.open(b.href);
                else try { window[e].location = b.href } catch (f) { c(f) }
            })
        },
        _initHtmlSlide: function(b, c, d) { b.element || (b.wrapper = a('<div class="slide-wrapper" />').appendTo(d || this.element), b.element = a('<div class="slide type-html"/>').appendTo(b.wrapper).html(b.html)[0], b.style && a(b.element).css(b.style)), c() },
        _initGallerySlide: function(b, c) {
            b.element && c();
            var d = b.children.length,
                e = 0,
                f = function() {++e >= d && c() };
            b.wrapper = a('<div class="slide-wrapper" />').appendTo(this.element);
            for (var g = 0; d > g; g++) this._initSlide(b.children[g], f, b.wrapper)
        },
        _getDisplayHeight: function() {
            var b = this.options.height,
                c = String(b).toLowerCase(),
                d = 0,
                e = /^(min|max|avg|auto|0)$/.test(String(b).toLowerCase()),
                f = a.isFunction(b);
            if (f && (b = b(this)), e) {
                b = "max" === c || "auto" === c || "0" === c ? 0 : 1 / 0;
                var g = a(this.element).parent();
                g.css("minHeight", this.element.scrollHeight), this.element.style.height = "auto", a(".slide", this.element).each(function(e, f) { var g = f.scrollHeight; return a(f).is(".type-bg-image") && (g = 2 / 3 * f.scrollWidth), "auto" !== c && "0" !== c || !a(f).is(".active .slide") ? void("max" === c || "auto" === c || "0" === c ? b = Math.max(b, g) : "min" === c ? b = Math.min(b, g) : "avg" === c && (d += g)) : (b = g, !1) })
            }
            return "avg" === c && (b = d / this.slides.length), this._initialWidth || (this._initialWidth = a(this.element).width(), this._isHtmlOnly = this._getIsHtmlOnly()), this.options.maintainAspectRatio && !f && (b *= a(this.element).width() / (this.options.maxWidth || this._initialWidth)), this.options.minHeight && (b = Math.max(this.options.minHeight, b)), this.options.maxHeight && (b = Math.min(this.options.maxHeight, b)), "auto" === c && (b = Math.max(this.element.scrollHeight, b)), b
        },
        showLoadingMask: function(b) { this._loadingMask && a(this._loadingMask).length ? a(this._loadingMask).show().setTransition({ opacity: 1 }, 200, "swing", 0, b) : (b || a.noop)() },
        hideLoadingMask: function(b, c) { this._loadingMask && a(this._loadingMask).length ? a(this._loadingMask).setTransition({ opacity: 0 }, a(this.element).is(".slider-shortcode-wrapper .vamtam-slider") ? 2 : 1e3, "swing", c || 0, function() { a(this).hide(), (b || a.noop)() }) : (b || a.noop)() },
        _disable: function() { a(this.element).parent().addClass("slider-disabled") },
        _load: function() {
            if (this.options.disableOnMobiles) { if (f()) return this._disable(); if (k.any() && !k.iPad()) return this._disable() }
            var b = this,
                c = b.options.resizing,
                d = "header-slider" === this.element.id ? 1500 : 200,
                e = a(this.element);
            b.resizing("none"), e.css({ opacity: 0, visibility: "visible" }), this._initAllSlides(function() {
                e.find(".slide-wrapper").css("display", "none"), e.pauseResizeWatcher(), e.trigger("beforeExpand", [b]), e.setTransition({ height: Math.round(b._getDisplayHeight()) }, d, "swing", 0, function() {
                    b.fx(b.options.effect);
                    for (var d in b) 0 === d.indexOf("_init_") && a.isFunction(b[d]) && b[d]();
                    e.bind("slideComplete", function() { "auto" === b.options.height && e.height(b._getDisplayHeight()) }), b.pos(b.options.initialIndex || 0, function() {
                        e.trigger("sliderStarted", [b]), b.pause(), "none" !== c && b.resizing(c), e.watchResize(function() { b.options.maintainAspectRatio && e.height(b._getDisplayHeight()), b.resizing(b.options.resizing) }), e.resumeResizeWatcher(), e.trigger("elementResize", { width: e.width(), height: e.height() }), e.setTransition({ opacity: 1 }, 800, "easeInQuad", 200, function() {
                            e.trigger("afterExpand", [b]), b.hideLoadingMask(a.noop, 200), b._loaded = !0, e.removeClass("loading animated").addClass("loaded"), e.attr("tabindex", "-1"), b.options.autoFocus && "ontouchstart" in document.documentElement && setTimeout(function() { e.trigger("focus") }, 500), b.resume();
                            var c = "right" === b.options.autostart ? 1 : "left" === b.options.autostart ? -1 : 0;
                            0 !== c && b.start(c), e.trigger("sliderReady", [b])
                        })
                    })
                })
            })
        },
        _setOption_slides: function(b) {
            var d = a.extend([], b),
                e = d.length;
            return e ? void(this.slides = d) : void c("Slider: Action canceled - the slider has no slides.")
        },
        resizing: function(b) {
            if (!b) return this.options.resizing;
            var c = this;
            return this.foreachSlide(function(d, e) {
                if (e.element) switch (e.type) {
                    case "img":
                    case "image":
                        i ? a(e.element).setBgSize(b) : a(e.element).objectFit(b, a(c.element));
                        break;
                    case "html":
                        break;
                    case "video":
                }
            }), this.options.resizing = b, this
        },
        fx: function(d) { return d ? (b(d, "String") && g.Effects[d] || (c("Invalid effect '" + d + "' specified. Using 'fade' instead."), d = "fade"), d === this._fxId ? this : (this._fxId && (a(this.element).removeClass("effect-" + this._fxId), a.isFunction(g.Effects[this._fxId].uninit) && g.Effects[this._fxId].uninit(this)), a(this.element).addClass("effect-" + d), a.isFunction(g.Effects[d].init) && g.Effects[d].init(this), this._fxId = d, this)) : this._fxId },
        countSlides: function() { var a = 0; return this.foreachSlide(function() { a++ }), a },
        foreachSlide: function(b, c) {
            function d(c, e) { a.each(c, function(a, c) { b.call(c, a, c, e), c.children && d(c.children, c) }) }
            d(c || this.slides)
        },
        _getCurrentSlide: function() { for (var a = 0, b = this.slides[this._path[a]]; ++a < this._path.length;) b = b.children[a]; return b },
        _getCurrentSlideSet: function() { for (var a = this.slides, b = 0; b < this._path.length && a[this._path[b]].children;) a = a[this._path[b]].children, b++; return a },
        _canGoIn: function() { return !!(this._getCurrentSlide().children || "").length },
        _canGoOut: function() { return this._path.length > 1 },
        _goIn: function() { this._path.push(0) },
        _goOut: function() { this._path.pop() },
        _position: function() { return this._path[this._path.length - 1] },
        pos: function(b, c) {
            var d = this._position();
            if (!b && 0 !== b) return d;
            var f, h = this.slides.length;
            switch (b) {
                case "first":
                    f = 0;
                    break;
                case "last":
                    f = h - 1;
                    break;
                case "prev":
                    f = this._position() - 1, 0 > f && (f = h - 1);
                    break;
                case "next":
                    f = this._position() + 1, f >= h && (f = 0);
                    break;
                default:
                    if (f = parseInt(b, 10), isNaN(f) || 0 > f || f >= h) throw "Invalid goto argument"
            }
            if (!(d === f && this._loaded || a(this.element).is(".animated"))) {
                var i = g.Effects[this.fx()],
                    k = this.options.animationTime,
                    l = 0,
                    m = this,
                    n = function() { return function() { 2 !== ++l && m._loaded || (setTimeout(function() { a(m.element).removeClass("animated").trigger("slideComplete") }, 100), (c || a.noop)()) } }(f);
                this._fxUID = j();
                var o = { fxUID: this._fxUID, slider: this, newIndex: f, oldIndex: d, callback: n, toShow: a(this.slides[f].wrapper).addClass("active"), toHide: a(), direction: e(d, f, this.slides.length, b), duration: this._loaded ? k : 1, easing: this.options.easing };
                this._loaded && (o.toHide = a(this.slides[d].wrapper).removeClass("active")), m._path[m._path.length - 1] = f, a(this.element).trigger("slidePositionChange", [f, d, o.direction]), a(this.element).addClass("animated"), a(this.element).trigger("beforeRun"), i.run(o), this.resizing(this.resizing()), a(this.element).trigger("afterRun"), a.isFunction(i.changeCaptions) ? i.changeCaptions(o) : this._changeCaptions(o)
            }
        },
        _changeCaptions: function(b) {
            var c = b.toHide.data("captionsWrapper"),
                d = b.toShow.data("captionsWrapper"),
                e = this.options.captionFxTime,
                f = this.options.captionFxDelay || 0,
                g = this.options.captionFxEasing,
                h = !!this.options.captionQueue,
                i = a(this.element);
            i.queue("captions", []), a(c).find(".caption").each(function(b, c) {
                i.queue("captions", function() {
                    function b() {++d > 1 && h && i.dequeue("captions") }
                    var d = 0;
                    a(c).stop(1, 0).delay(f || 0).animate({ opacity: 0 }, { duration: e, easing: g, queue: !1, complete: b }), a(c).wpvRemoveClass("visible", e, g, f, b), h || i.dequeue("captions")
                })
            }), i.queue("captions", function() { a(c).stop(1, 0).wpvRemoveClass("visible", Math.ceil(e / 4), "linear", 0), a(d).stop(1, 0).wpvAddClass("visible", Math.ceil(e / 4), "linear", 0), a(c).animate({ opacity: 0 }, { duration: Math.ceil(e / 4), easing: "linear", queue: !1 }), a(d).animate({ opacity: 1 }, { duration: Math.ceil(e / 4), easing: "linear", queue: !1 }), i.dequeue("captions") }), a(d).find(".caption").each(function(b, c) { i.queue("captions", function() { a(c).stop(1, 0).delay(f || 0).animate({ opacity: 1 }, { duration: e, easing: g, queue: !1 }), a(c).wpvAddClass("visible", e, g, f, function() { h && i.dequeue("captions") }), h || i.dequeue("captions") }) }), i.queue("captions", b.callback || a.noop), i.dequeue("captions")
        },
        start: function(b) {
            function c(f) {
                var g = +new Date,
                    h = g - e,
                    i = f._slideshowController;
                if (e = g, !i.isPaused && !i.isWaiting) {
                    if (!i.remainingTime) return i.remainingTime = f.options.pauseTime, i.pos = 0, c(f);
                    i.remainingTime -= h, i.pos = f.options.pauseTime - i.remainingTime, i.remainingTime <= 0 && (i.isWaiting = 1, setTimeout(function() { f.pos(-1 === b ? "prev" : "next", function() { i.remainingTime = f.options.pauseTime, i.isWaiting = 0 }) }, d))
                }
                i.lastPos !== i.pos && (i.lastPos = i.pos, a(f.element).trigger("progress", Math.floor(i.pos / f.options.pauseTime * 100))), f._timer = setTimeout(function() { c(f) }, d)
            }
            var d = 200,
                e = +new Date;
            null === this._timer && (c(this), a(this.element).trigger("start", b))
        },
        stop: function() { this._timer && (clearTimeout(this._timer), this._timer = null, this._slideshowController.isWaiting = 0, this._slideshowController.isPaused = 0, this._slideshowController.remainingTime = 0, this._slideshowController.pos = 0, a(this.element).trigger("progress", 0).trigger("stop")) },
        pause: function() { this._timer && (this._slideshowController.isPaused = 1, a(this.element).trigger("pause")) },
        resume: function() { this._timer && (this._slideshowController.isPaused = 0, a(this.element).trigger("resume")) }
    }, g.prototype._init_keyboardNavigation = function() {
        if (this.options.useKeyboard) {
            var b = this;
            a(this.element).bind("keydown.vslider", function(a) {
                switch (a.keyCode) {
                    case 39:
                        b.pos("next"), a.preventDefault();
                        break;
                    case 37:
                        b.pos("prev"), a.preventDefault()
                }
            })
        }
    }, g.prototype._init_pager = function() {
        if (this.options.pager) {
            for (var b = a('<ul class="slider-pager"/>'), c = this.slides.length, d = this, e = function() { var a = b.find("> li").index(this); return a !== d.pos() && d.pos(b.find("> li").index(this)), !1 }, f = 0; c > f; f++) a("<li/>").appendTo(b).mousedown(e);
            a(this.element).bind("slidePositionChange.vslider", function(a, c) { b.find("li.active").removeClass("active").end().find("li:eq(" + c + ")").addClass("active") }), b.appendTo(a("auto" === this.options.pager ? this.element : this.options.pager))
        }
    }, g.prototype._init_prevNextButtons = function() {
        var b = this,
            c = this.options.nextButton ? a(this.options.nextButton) : a('<div class="slider-btn-next"/>').appendTo(this.element);
        c.mousedown(function() { return b.onNextButtonAction(), !1 });
        var d = this.options.prevButton ? a(this.options.prevButton) : a('<div class="slider-btn-prev"/>').appendTo(this.element);
        d.mousedown(function() { return b.onPrevButtonAction(), !1 })
    }, g.prototype.onNextButtonAction = function() { this.pos("next") }, g.prototype.onPrevButtonAction = function() { this.pos("prev") }, g.Effects = {}, g.CaptionEffects = {}, g.CaptionEffects.fadeCaptions = function(b) {
        var c = b.toHide.data("captionsWrapper"),
            d = b.toShow.data("captionsWrapper"),
            e = a(c).find(".caption"),
            f = a(d).find(".caption"),
            g = e.length,
            h = f.length,
            i = b.slider.options.captionFxTime || b.duration,
            j = b.slider.options.captionFxDelay || 0,
            k = b.slider.options.captionFxEasing,
            l = !!b.slider.options.captionQueue,
            m = a(b.slider.element),
            n = Math.ceil(i / 4);
        m.queue("captions", []), m.queue("captions", function(b) {
            if (g)
                if (l) e.each(function(c, d) { setTimeout(function() { a(d).stop(1, 0).animate({ opacity: 0, avoidCSSTransitions: !0 }, n, k, function() { a(this).css("display", "none"), c >= g - 1 && b() }) }, (j || n / g) * c) });
                else {
                    var c = 0;
                    e.delay(j || 0).stop(1, 0).animate({ opacity: 0, avoidCSSTransitions: !0 }, n, k, function() { a(this).css("display", "none"), ++c >= g && b() })
                }
            else setTimeout(b, n)
        }), m.queue("captions", function(b) {
            var e = a.createCountingCallback(2, b);
            c ? a(c).stop(1, 0).animate({ opacity: 0, avoidCSSTransitions: !0 }, d ? 2 * n : n, "linear", function() { a(this).css("display", "none"), e() }) : setTimeout(e, n),
                d ? a(d).stop(1, 0).css("display", "block").delay(c ? 0 : n).animate({ opacity: 1, avoidCSSTransitions: !0 }, c ? 2 * n : n, "linear", e) : setTimeout(e, n)
        }), m.queue("captions", function(b) {
            if (h)
                if (l) f.each(function(c, d) { setTimeout(function() { a(d).stop(1, 0).css("display", "block").animate({ opacity: 1, avoidCSSTransitions: !0 }, n, k, function() { c >= h - 1 && b() }) }, (j || n / h) * c) });
                else {
                    var c = 0;
                    f.css({ opacity: 0, display: "block" }).animate({ opacity: 1, avoidCSSTransitions: !0 }, i, k, function() {++c === h && b() })
                }
            else setTimeout(b, n)
        }), m.queue("captions", b.callback || a.noop), m.dequeue("captions")
    }, g.Effects.fade = {
        init: function(b) {
            var c = Math.max(b.pos(), 0);
            a("> .slide-wrapper", b.element).each(function(b) { a(this).css({ zIndex: b === c ? 2 : 1, opacity: b === c ? 1 : 0, display: b === c ? "block" : "none" }) })
        },
        run: function(a) { a.toHide.stop(1, 1).animate({ opacity: 0 }, a.duration, a.easing), a.toShow.stop(1, 1).css({ opacity: 0, zIndex: 2, display: "block" }).animate({ opacity: 1 }, a.duration, a.easing, function() { a.toHide.stop(1, 1).css({ zIndex: 1, display: "none" }), a.callback() }) },
        changeCaptions: g.CaptionEffects.fadeCaptions
    }, g.Effects.slide = {
        init: function(b) {
            var c = Math.max(b.pos(), 0);
            a("> .slide-wrapper", b.element).each(function(b) { a(this).css({ zIndex: b === c ? 2 : 1, opacity: b === c ? 1 : 0, display: b === c ? "block" : "none" }) })
        },
        run: function(b) {
            b.toShow.stop(1, 0).css({ opacity: .9, display: "block" });
            var c = b.toShow.width() * b.direction,
                d = a.createCountingCallback(2, b.callback);
            b.toShow.css({ left: c, zIndex: 2 }).animate({ left: 0, opacity: 1, avoidTransforms: !Modernizr.csstransforms3d }, b.duration, b.easing, d), b.toHide.length && b.toHide[0] !== b.toShow[0] ? b.toHide.stop(1, 0).css({ left: 0, opacity: 1, zIndex: 1 }).animate({ opacity: 0, left: -c, avoidTransforms: !Modernizr.csstransforms3d }, b.duration, b.easing, function() { a(this).css({ display: "none", opacity: 1 }), d() }) : d()
        },
        changeCaptions: g.CaptionEffects.fadeCaptions
    }, g.create("vamtamSlider", g, g.defaults), a.VamtamSlider = g
}(jQuery),
function(a) {
    "use strict";

    function b(a, b, c) {
        b = b || g, c = c || 0;
        var d = b[0] === window,
            e = d ? { top: 0, left: 0 } : b.offset(),
            f = e.top + (d ? b.scrollTop() : 0),
            h = e.left + (d ? b.scrollLeft() : 0),
            i = h + b.width(),
            j = f + b.height(),
            k = a.offset(),
            l = a.width(),
            m = a.height();
        return f - c <= k.top + m && j + c >= k.top && h - c <= k.left + l && i + c >= k.left
    }

    function c(a, b, c) { a.css("opacity", 0).attr("src", b).removeClass("loading").addClass("loaded").trigger("jailStartAnimation"), a.originalAnimate({ opacity: 1 }, { duration: c.speed, easing: "linear", queue: !1, complete: function() { c.resizeImages && this.originalCssHeight && (this.style.height = this.originalCssHeight, delete this.originalCssHeight), a.trigger("jailComplete"), c.callbackAfterEachImage && c.callbackAfterEachImage.call(this, a, c), c.images && c.callback && !c.callback.called && f(c.images) && (c.callback.called = !0, c.callback()) } }) }

    function d(d) {
        a("img.lazy[data-href]").each(function(e, f) {
            var h = a(f),
                i = a.extend({ timeout: 10, effect: !1, speed: 400, selector: null, offset: 0, event: "scroll", callback: jQuery.noop, callbackAfterEachImage: jQuery.noop, placeholder: !1, resizeImages: !0, container: g }, h.data("jailOptions") || {});
            if (!(d && "scroll" !== d && "resize" !== d && "orientationchange" !== d && i.event !== d || i.event && /scroll|resize|orientationchange/i.test(i.event) && !b(h, i.container) || h.is(".loading"))) {
                h.addClass("loading");
                var j = new Image,
                    k = f.getAttribute("data-href");
                f.removeAttribute("data-href"), j.onload = function() { c(h, k, i) }, j.src = k
            }
        })
    }

    function e(a) {
        var b = parseInt(a.getAttribute("width"), 10),
            c = parseInt(a.getAttribute("height"), 10);
        if (!isNaN(b) && isNaN(c)) {
            a.originalCssHeight = a.style.height || "";
            var d = a.offsetWidth / b;
            a.style.height = Math.floor(c * d) + "px"
        }
    }

    function f(b) { var c = !0; return b.each(function() { return a(this).hasClass("loaded") ? void 0 : (c = !1, !1) }), c }
    var g = a(window);
    a.fn.asynchImageLoader = a.fn.jail = function(b) { var c = a.extend({}, b || {}, { images: this }); return this.data("jailOptions", c), c.resizeImages !== !1 && this.each(function() { e(this) }), c.event || d(), this }, g.bind("scroll resize load orientationchange", function(a) { d(a.type) }), a(function() { setTimeout(function() { d() }, 1e3) })
}(jQuery),
function(a) {
    "use strict";

    function b() { j && window.clearTimeout(j), j = setTimeout(function() { c.trigger("delayedResize") }, 150) }
    var c = a(window),
        d = a("html"),
        e = a("body").hasClass("responsive-layout"),
        f = [{ min: 0, max: 479, className: "layout-smallest" }, { min: 480, max: 958, className: "layout-small" }, { min: 959, max: 1 / 0, className: "layout-max" }, { min: 959, max: 1280, className: "layout-max-low" }, { min: 0, max: 958, className: "layout-below-max" }];
    if (e) {
        var g, h, i = f.length;
        c.bind("resize.sizeClass load.sizeClass", function() {
            var a = [],
                b = [],
                d = {};
            for (h = 0; i > h; h++) {
                var e = "(min-width: " + f[h].min + "px)";
                f[h].max !== 1 / 0 && (e += " and (max-width: " + f[h].max + "px)"), window.matchMedia(e).matches ? (a.push(f[h].className), d[f[h].className] = !0) : (b.push(f[h].className), d[f[h].className] = !1)
            }
            window.VAMTAM.MEDIA.layout = d, a = a.join(" "), b = b.join(" "), g !== a && (g = a, c.trigger("switchlayout"))
        })
    } else d.removeClass("layout-smallest layout-small layout-below-max").addClass("layout-max"), window.VAMTAM.MEDIA.layout = { "layout-max": !0 };
    var j;
    c.bind("resize", b), window.VAMTAM.MEDIA.is_mobile = function() {
        var a = !1;
        return function(b) {
            (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = !0)
        }(navigator.userAgent || navigator.vendor || window.opera), a
    }
}(jQuery),
function(a) {
    "use strict";
    a(function() {
        var b = a("img.lazy").not(".portfolios.sortable img, .portfolios.isotope img, .portfolios.scroll-x img, :animated, .wpv-wrapper img");
        b.length && b.addClass("jail-started").jail({ speed: 800 });
        var c = a(".wpv-wrapper img.lazy");
        c.length && c.addClass("jail-started").jail({ speed: 1400, event: "load" })
    })
}(jQuery),
function(a, b) {
    "use strict";
    a(function() {
        a(".wpv-overlay-search-trigger").click(function(b) {
            b.preventDefault(), a.magnificPopup.open({
                type: "inline",
                items: { src: "#wpv-overlay-search" },
                closeOnBgClick: !1,
                callbacks: {
                    open: function() {
                        var a = this;
                        setTimeout(function() { a.content.find("form").removeAttr("novalidate"), a.content.find('[name="s"]').focus() }, 100)
                    }
                }
            })
        });
        var c = function(b) {
                var c = "";
                a("body").hasClass("cbox-share-googleplus") && (c += '<div><div class="g-plusone" data-size="medium"></div> <script type="text/javascript">(function() {	var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;	po.src = "https://apis.google.com/js/plusone.js";	var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);})();</script></div>'), a("body").hasClass("cbox-share-facebook") && (c += '<div><iframe src="//www.facebook.com/plugins/like.php?href=' + window.location.href + '&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:auto; height:21px;" allowTransparency="true"></iframe></div>'), a("body").hasClass("cbox-share-twitter") && (c += '<div><iframe allowtransparency="true" frameborder="0" scrolling="no" src="//platform.twitter.com/widgets/tweet_button.html" style="width:auto; height:20px;"></iframe></div>'), a("body").hasClass("cbox-share-pinterest") && (c += '<div><a href="http://pinterest.com/pin/create/button/" class="pin-it-button" count-layout="horizontal"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a></div>');
                var d = b.el && b.el.attr("title") || "";
                return '<div id="lightbox-share">' + c + '</div><div id="lightbox-text-title">' + d + "</div>"
            },
            d = function(a) { return "true" === a.attr("data-iframe") ? "iframe" : a.attr("href").match(/^#/) ? "inline" : "image" },
            e = a("body").hasClass("woocommerce-page") ? ", div.product div.images a.zoom" : "";
        a(".vamtam-lightbox" + e, this).not(".no-lightbox, .size-thumbnail, .cboxElement").each(function() {
            var e = this,
                f = a(this),
                g = a('[rel="' + f.attr("rel") + '"]').filter(".vamtam-lightbox, a.zoom"),
                h = g.length,
                i = [],
                j = a.inArray(f, g);
            h ? a(g).each(function(b) { this === e && (j = b), i.push({ src: a(this).attr("href"), type: d(a(this)) }) }) : (i.push({ src: f.attr("href"), type: d(f) }), j = 0), f.magnificPopup({ items: i, midClick: !0, preload: [1, 2], index: j, iframe: { patterns: { youtube: { id: function(a) { var b = a.match(/youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([a-zA-Z0-9-_]+)/); return b[1] ? b[1] : a } }, vimeo: { id: function(a) { var b = a.match(/vimeo\.com\/(?:.*#|.*videos?\/)?([0-9]+)/); return b[1] ? b[1] : a } }, dailymotion: { index: "dailymotion.com", id: function(a) { var c = a.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/); return null !== c ? c[4] !== b ? c[4] : c[2] : null } } } }, image: { titleSrc: c }, gallery: { enabled: h }, callbacks: { open: function() { a(window).resize() } } })
        })
    })
}(jQuery),
function(a) {
    "use strict";
    a(function() {
        "tabs" in a.fn && a(".wpv-tabs", this).each(function() {
            a(this).tabs({
                activate: function(b, c) {
                    var d = c.newTab.context.hash,
                        e = a(d);
                    e.attr("id", ""), window.location.hash = d, e.attr("id", d.replace("#", ""))
                },
                heightStyle: "content"
            })
        }), "accordion" in a.fn && a(".accordion", this).accordion({ heightStyle: "content" }).each(function() { "true" === a(this).attr("data-collapsible") && a(this).accordion("option", "collapsible", !0).accordion("option", "active", !1) })
    })
}(jQuery),
function() {
    "use strict";
    var a = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
    a && window.document.addEventListener("orientationchange", function() {
        var a = document.querySelector('meta[name="viewport"]');
        a && (a.content.match(/width=device-width/) && (a.content = a.content.replace(/width=[^,]+/, "width=1")), a.content = a.content.replace(/width=[^,]+/, "width=" + window.innerWidth))
    }, !1)
}(),
function(a, b) {
    "use strict";
    a(function() {
        if (a(".menu-item").has(">.sub-menu").addClass("has-submenu"), Modernizr.touch, !0) {
            var c;
            a(".fixed-header-box .menu-item-has-children > a").bind("touchend", function(a) { this.had_touchend = a.timeStamp }).bind("click", function(a) { return a.timeStamp - (this.had_touchend || 0) > 1e3 ? !0 : (c !== this && (a.preventDefault(), c = this), void a.stopPropagation()) }), a(window).bind("click.sub-menu-double-tap", function() { c = b })
        }
        a("#main-menu").find(".menu").fadeIn(500)
    })
}(jQuery),
function(a) {
    "use strict";
    a(function() {
        var b, c, d, e = a(window),
            f = a("body"),
            g = a(".fixed-header-box"),
            h = a("#header-middle"),
            i = a("#main-content"),
            j = g.find(".second-row"),
            k = f.hasClass("admin-bar") ? 28 : 0,
            l = /MSIE (\d+)/.exec(navigator.userAgent),
            m = !1,
            n = function() { return f.hasClass("sticky-header") && !(l && 8 === parseInt(l[1], 10)) && !window.VAMTAM.MEDIA.is_mobile() && !window.VAMTAM.MEDIA.layout["layout-below-max"] && g.length && j.length },
            o = function() { return a("#header-slider-container").length && 0 === a(".wpv-grid.parallax-bg").length },
            p = function() { n() && (b = g.clone().html("").css({ "z-index": 0, visibility: "hidden", height: g.outerHeight() }).insertAfter(g), g.css({ position: "fixed", top: g.offset().top, left: g.offset().left, width: g.outerWidth(), "-webkit-transform": "translateZ(0)" }), o() ? (c = h.clone().html("").css({ "z-index": 0, visibility: "hidden", height: h.outerHeight() }).insertAfter(h), h.css({ position: "fixed", top: h.offset().top, left: h.offset().left, width: h.outerWidth(), "z-index": 0 })) : c = null, d = setInterval(r, 41), m = !0, e.scroll()) },
            q = function() { b && b.remove(), g.removeClass("static-absolute fixed").css({ position: "", top: "", left: "", width: "", "-webkit-transform": "" }), c && (c.remove(), h.css({ position: "", top: "", left: "", width: "", "z-index": 0 })), clearInterval(d), m = !1 },
            r = function() {
                if (m) {
                    var a = e.scrollTop(),
                        c = g.outerHeight(),
                        d = j.height(),
                        f = i.offset().top - k;
                    a + c >= f ? f >= a + d ? g.css({ position: "absolute", top: f - c, left: 0 }).addClass("static-absolute").removeClass("fixed second-stage-active") : g.css({ position: "fixed", top: k + d - c, left: b.offset().left, width: g.outerWidth() }).addClass("second-stage-active") : g.removeClass("static-absolute second-stage-active").css({ position: "fixed", top: b.offset().top, left: b.offset().left, width: b.outerWidth() }), g.hasClass("fixed") || g.hasClass("static-absolute") || g.hasClass("second-stage-active") || g.css({ position: "fixed", top: b.offset().top, left: b.offset().left, width: g.outerWidth() }).addClass("fixed")
                }
            };
        e.bind("scroll touchmove", r).smartresize(function() { q(), p() }), p()
    })
}(jQuery),
function(a) {
    "use strict";
    var b = a(window),
        c = .2,
        d = .7,
        e = 0,
        f = /MSIE (\d+)/.exec(navigator.userAgent),
        g = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
    b.resize(function() { e = b.height(), f && 8 === parseInt(f[1], 10) || g || window.VAMTAM.MEDIA.layout["layout-below-max"] ? a(".wpv-grid.animated-active").removeClass("animated-active").addClass("animated-suspended") : a(".wpv-grid.animated-suspended").removeClass("animated-suspended").addClass("animated-active") }).resize(), b.bind("scroll touchmove load", function() {
        var e = b.height(),
            f = a(window).scrollTop() + e,
            h = d * e;
        a(".row > .animated-active:not(.animation-ended)").each(function() {
            var b = Math.max(100, Math.min(h, c * a(this).outerHeight())),
                d = a(this).hasClass("animation-zoom-in") ? a(this).height() / 2 : 0;
            return f - b > a(this).offset().top - d || g ? void a(this).addClass("animation-ended") : !1
        })
    }).scroll()
}(jQuery),
function(a) {
    "use strict";
    var b = a(window),
        c = b.height(),
        d = /MSIE (\d+)/.exec(navigator.userAgent);
    b.bind("resize", function() { c = b.height(), !Modernizr.csscalc || d && 8 === parseInt(d[1], 10) || window.VAMTAM.MEDIA.is_mobile() || window.VAMTAM.MEDIA.layout["layout-below-max"] ? a(".wpv-grid.parallax-bg").removeClass("parallax-bg").addClass("parallax-bg-suspended") : a(".wpv-grid.parallax-bg-suspended").removeClass("parallax-bg-suspended").addClass("parallax-bg") });
    var e = function(a, b, d, e, f, g) {
        var h = "";
        switch (a) {
            case "fixed":
                h = Math.round((e - d) * f) + "px";
                break;
            case "to-centre":
                h = "calc(50% - " + Math.round((d + g / 2 - e - c / 2) * f) + "px)"
        }
        return b + " " + h
    };
    b.bind("scroll touchmove load", function() {
        var d = b.scrollTop(),
            f = d + c;
        a(".wpv-grid.parallax-bg").each(function() {
            var b = a(this).offset().top,
                c = a(this).outerHeight();
            if (!(d > b + c || b > f)) {
                var g = a(".wpv-parallax-bg-img", this);
                if (g.length) {
                    var h = g.css("background-position").split(/\s+/);
                    if (!(h.length < 2)) {
                        var i = a(this).data("parallax-method"),
                            j = a(this).data("parallax-inertia"),
                            k = { "background-position": e(i, h[0], b, d, j, c) };
                        g.css(k)
                    }
                }
            }
        })
    });
    var f = "position image color size attachment repeat".split(" ");
    a(function() {
        a(".wpv-grid.parallax-bg:not(.parallax-loaded)").each(function() {
            var b = a(this),
                c = {};
            a.each(f, function(a, d) { c["background-" + d] = b.css("background-" + d) }), b.addClass("parallax-loaded").wrapInner(function() { return a("<div></div>").addClass("wpv-parallax-bg-content") }).prepend(function() { var b = a("<div></div>").addClass("wpv-parallax-bg-img").css(c); return b }).css("background", "")
        }), b.scroll()
    })
}(jQuery),
function() {
    "use strict";
    window.VAMTAM = window.VAMTAM || {},
        function(a) {
            var b = a(window);
            if (a(function() {
                    if (top !== window && /vamtam\.com/.test(document.location.href)) {
                        var c = 0;
                        setInterval(function() { a(window).width() !== c && (a(window).resize(), setTimeout(function() { a(window).resize() }, 100), setTimeout(function() { a(window).resize() }, 200), setTimeout(function() { a(window).resize() }, 300), setTimeout(function() { a(window).resize() }, 500), c = a(window).width()) }, 200)
                    }
                    if (a("body").is(".responsive-layout") && b.triggerHandler("resize.sizeClass"), function() {
                            function c(a) {
                                if (a) {
                                    var b = document.createTextNode(" "),
                                        c = a.style.display;
                                    a.appendChild(b), a.style.display = "none", setTimeout(function() { a.style.display = c, b.parentNode.removeChild(b) }, 20)
                                }
                            }
                            b.bind("wpv-ajax-content-loaded", function() { a(".page-content[data-respond] > div").each(function() { c(this) }) })
                        }(), a("body").is(".pagination-infinite-scrolling")) {
                        var d = 0;
                        a(window).bind("resize scroll", function(b) {
                            var c = a(".lm-btn"),
                                e = b.timeStamp || (new Date).getTime();
                            e - d > 500 && 1 === c.css("opacity") && a(window).scrollTop() + a(window).height() >= c.offset().top && (d = e, c.click())
                        })
                    }
                    if (a("html").is(".placeholder") && a(".label-to-placeholder label[for]").each(function() { a("#" + a(this).prop("for")).attr("placeholder", a(this).text()), a(this).hide() }), b.bind("resize.vamtam-video load.video", function() { a(".portfolio_image_wrapper,					.boxed-layout .media-inner,					.boxed-layout .loop-wrapper.news .thumbnail,					.boxed-layout .portfolio_image .thumbnail,					.boxed-layout .wpv-video-frame").find("iframe, object, embed, video").each(function() { var b = a(this); "0" === b.prop("width") && "0" === b.prop("height") ? b.css({ width: "100%" }).css({ height: 9 * b.width() / 16 }) : b.css({ height: b.prop("height") * b.width() / b.prop("width") }), b.trigger("vamtam-video-resized") }), setTimeout(function() { a(".mejs-time-rail").css("width", "-=1px") }, 100) }).triggerHandler("resize.vamtam-video"), a(document).on("mouseover focus click", ".animated.flash, .animated.wiggle", function() { a(this).removeClass("animated") }), a.isArray(window.wpvBgSlides)) {
                        var e = a("body");
                        e.fastSlider({}, wpvBgSlides), a(window).bind("keydown", function(a) {
                            switch (a.keyCode || a.which) {
                                case 37:
                                    e.data("fastSlider") && e.data("fastSlider").prev();
                                    break;
                                case 38:
                                    e.data("fastSlider") && e.data("fastSlider").goToPrevGalleryItem();
                                    break;
                                case 39:
                                    e.data("fastSlider") && e.data("fastSlider").next();
                                    break;
                                case 40:
                                    e.data("fastSlider") && e.data("fastSlider").goToNextGalleryItem()
                            }
                        })
                    }
                    var f = 250;
                    a(".shortcode-tooltip").hover(function() {
                        var b = a(this).find(".tooltip").fadeIn(f).animate({ bottom: 25 }, f);
                        b.css({ marginLeft: -b.width() / 2 })
                    }, function() { a(this).find(".tooltip").animate({ bottom: 35 }, f).fadeOut(f) }), a(".sitemap li:not(:has(.children))").addClass("single"), a(window).bind("resize scroll", function() { a("#scroll-to-top").toggleClass("visible", window.pageYOffset > 0) }), a("#scroll-to-top").click(function() { a("html,body").animate({ scrollTop: 0 }, 300) }), a(document).on("click", ".wpv-animated-page-scroll[href], .wpv-animated-page-scroll [href]", function(b) {
                        var c = a("#" + a(this).prop("href").split("#")[1]);
                        c.length && (b.preventDefault(), a("html,body").animate({ scrollTop: c.offset().top - 100 }))
                    })
                }), a("#footer-sidebars .row").each(function() { a(this).find("aside").matchHeight() }), a(window).resize(function() {
                    a("#footer-sidebars .widget_footer_map:only-child").each(function() {
                        var b = a(this).find(".footer-map-trigger");
                        b.css({ height: "", "line-height": "" });
                        var c = a(this).height(),
                            d = a(this).parent().height(),
                            e = b.height();
                        if (d > c) {
                            var f = e + d - c;
                            b.css({ height: f, "line-height": f + "px" })
                        }
                    })
                }).resize(), !Modernizr.lastchild) {
                a("p:empty").hide(), a("*:last-child").addClass("last last-child");
                var c = a(".main-header .logo");
                if (c.length) {
                    var d = c.find("> img");
                    1 === d.length && c.width(d[0].offsetWidth)
                }
            }
            a("#feedback.slideout").click(function(b) { a(this).parent().toggleClass("expanded"), b.preventDefault() }), a(".row:has(> div.has-background)").each(function(b, c) {
                var d = a(c),
                    e = d.find("> div");
                e.length > 1 && (d.addClass("has-nomargin-column"), e.matchHeight())
            }), a(".row:has(.linkarea)").each(function() { a(this).find(".linkarea").matchHeight({ method: "height" }) }), a(".vamtam-slider").not(".scroll-x .vamtam-slider").touchwipe({ preventDefaultEvents: !1, canUseEvent: function(b) { return a(b.target).is(".slide, .slide *") }, wipeLeft: function(b) { b.preventDefault(), a(this).closest(".vamtam-slider").vamtamSlider("pos", "next") }, wipeRight: function(b) { b.preventDefault(), a(this).closest(".vamtam-slider").vamtamSlider("pos", "prev") } }), a(".fast-slider").touchwipe({ canUseEvent: function(b) { return a(b.target).is("#page") }, wipeLeft: function() { a(this).data("fastSlider") && a(this).data("fastSlider").prev() }, wipeRight: function() { a(this).data("fastSlider") && a(this).data("fastSlider").next() }, wipeDown: function() { a(this).data("fastSlider") && a(this).data("fastSlider").goToPrevGalleryItem() }, wipeUp: function() { a(this).data("fastSlider") && a(this).data("fastSlider").goToNextGalleryItem() } }), a("body").on("mouseenter", ".linkarea[data-hoverclass]", function() { a(this).addClass(this.getAttribute("data-hoverclass")) }).on("mouseleave", ".linkarea[data-hoverclass]", function() { a(this).removeClass(this.getAttribute("data-hoverclass")) }).on("mousedown", ".linkarea[data-activeclass]", function() { a(this).addClass(this.getAttribute("data-activeclass")) }).on("mouseup", ".linkarea[data-activeclass]", function() { a(this).removeClass(this.getAttribute("data-activeclass")) }).on("click", ".linkarea[data-href]", function(a) { if (a.isDefaultPrevented()) return !1; var b = this.getAttribute("data-href"); if (b) { a.preventDefault(), a.stopImmediatePropagation(); try { var c = String(this.getAttribute("data-target") || "self").replace(/^_/, ""); "blank" === c || "new" === c ? window.open(b) : window[c].location = b } catch (d) {} } }), b.triggerHandler("resize.sizeClass"), a(window).bind("load", function() { setTimeout(function() { a(window).trigger("resize") }, 1) })
        }(jQuery)
}(),
function(a) {
    "use strict";
    a(function() {
        var b = "cubeportfolio" in a.fn,
            c = !1,
            d = a(window),
            e = function(a) {
                requestAnimationFrame(function() {
                    var b = a.find(".cbp-wrapper"),
                        c = a.find(".cbp-wrapper-outer");
                    b.width() <= c.width() ? a.addClass("vamtam-cube-narrow") : a.removeClass("vamtam-cube-narrow")
                })
            },
            f = function() {
                a(".vamtam-cubeportfolio[data-options]:not(.vamtam-cube-loaded)").filter(":visible").each(function() {
                    var b = a(this),
                        c = b.data("options");
                    "singlePageCallback" in c || (c.singlePageDelegate = null), c.singlePageCallback = h[c.singlePageCallback] || null, b.on("initComplete.cbp", function() { "slider" === c.layoutMode && (e(b), d.on("resize.vamtamcube", function() { e(b) })) }), b.addClass("vamtam-cube-loaded").cubeportfolio(c), b.on("vamtam-video-resized", "iframe, object, embed, video", function() { b.data("cubeportfolio").layoutAndAdjustment() }), this.addEventListener("vamtamlazyloaded", function() { b.data("cubeportfolio").layoutAndAdjustment() })
                })
            },
            g = function() {
                if (document.getElementsByClassName("vamtam-cubeportfolio").length)
                    if (b) f();
                    else if (!c) {
                    c = !0;
                    var d = document.createElement("script");
                    d.type = "text/javascript", d.async = !0, d.src = VAMTAM_FRONT.cube_path, d.onload = function() { b = "cubeportfolio" in a.fn, f() }, document.getElementsByTagName("script")[0].before(d)
                }
            },
            h = {
                portfolio: function(b) {
                    var c = this;
                    a.ajax({ url: b, type: "GET", dataType: "html" }).done(function(b) { c.updateSinglePage(b), g(), a(document).trigger("vamtam-single-page-project-loaded") }).fail(function() { c.updateSinglePage("AJAX Error! Please refresh the page!") })
                }
            };
        a(document).on("vamtam-attempt-cube-load", g), g(), window.addEventListener("resize", window.VAMTAM.debounce(g, 100), !1), window.addEventListener("load", function() { a(".cbp").each(function() { try { this.data("cubeportfolio").layoutAndAdjustment() } catch (a) {} }) }, !1)
    })
}(jQuery),
function(a) {
    "use strict";
    var b = function() {
            var b = a(this);
            if (!(b.closest(".animated-active:not(.animation-ended)").length > 0 || b.data("closed-at") && +new Date - b.data("closed-at") < 300)) {
                var c = b.clone();
                setTimeout(function() {
                    var d = window.VAMTAM.MEDIA.layout["layout-below-max"] ? b.width() : b.parent().width();
                    if (c.css({ width: d, position: "absolute", left: b.parent().position().left + parseFloat(b.parent().css("padding-left"), 10), top: b.parent().position().top, zIndex: 1e10 }).addClass("transitionable"), b.attr("id") || b.attr("id", "hover-id-" + Math.round(1e8 * Math.random())), c.attr("id") || c.attr("id", "hover-clone-id-" + Math.round(1e8 * Math.random())), 0 !== a("#" + b.attr("id") + ":hover").length) {
                        b.css({ visibility: "hidden" }), c.appendTo(b.closest(".row")).addClass("state-hover"), c.find(".shrinking .icon").transit({ "font-size": Math.min(100, d - 15) }, 200, "easeOutQuad");
                        var e = c.find(".services-content").slideDown({ duration: 200, easing: "easeOutQuad" }),
                            f = setInterval(function() { Modernizr.touch || 0 !== a("#" + c.attr("id") + ":hover").length || (clearInterval(f), c.trigger("mouseleave")) }, 500),
                            g = function() { a(this).hasClass("state-hover") && (c.removeClass("state-hover"), c.find(".shrinking .icon").transit({ "font-size": 60 }, 500, "easeOutQuad"), e.slideUp({ duration: 500, easing: "easeOutQuad", complete: function() { c.remove(), b.css({ visibility: "visible" }).data("closed-at", +new Date) } })) };
                        Modernizr.touch || c.unbind("mouseleave.shrinking").bind("mouseleave.shrinking", g)
                    }
                }, 20)
            }
        },
        c = a(".services:has(.shrinking)");
    Modernizr.touch || c.unbind("mouseenter.shrinking").bind("mouseenter.shrinking", b);
    var d = function() {
        a(".services:not(.transitionable) .shrinking").each(function() {
            var b = a(this).width();
            a(this).height(b), a(this).find(".icon").css({ "line-height": b + "px" }), a(this).closest(".services").prev().css({ width: b })
        })
    };
    a(window).bind("resize", d), d()
}(jQuery),
function(a) {
    "use strict";
    var b = function(a) { "console" in window && console.error(a) };
    window.VAMTAM.expandable = function(b, c) {
        b = a(b);
        var d = this,
            e = b.find(">.open"),
            f = b.find(">.closed");
        d.doOpen = function() {
            requestAnimationFrame(function() {
                var a = window.VAMTAM.MEDIA.layout["layout-below-max"] ? Math.max(c.duration, 400) : c.duration,
                    d = e.outerHeight();
                d || (e.css({ height: "auto" }), d = e.outerHeight(), e.css({ height: 0 })), a = Math.max(a, d / 200 * a), f.queue(f.queue().slice(0, 1)), e.queue(e.queue().slice(0, 1)), b.addClass("state-hover"), requestAnimationFrame(function() { f.transition({ y: -d }, a, c.easing, function() { b.removeClass("state-closed").addClass("state-open") }), e.transition({ y: -d, scaleY: 1 }, a, c.easing) })
            })
        }, d.doClose = function() {
            requestAnimationFrame(function() {
                var a = window.VAMTAM.MEDIA.layout["layout-below-max"] ? Math.max(c.duration, 400) : c.duration,
                    d = e.outerHeight();
                d || (e.css({ height: "auto" }), d = e.outerHeight(), e.css({ height: 0 })), a = Math.max(a, d / 200 * a), f.queue(f.queue().slice(0, 1)), e.queue(e.queue().slice(0, 1)), b.removeClass("state-hover"), requestAnimationFrame(function() { f.transition({ y: 0 }, a, c.easing, function() { b.removeClass("state-open").addClass("state-closed") }), e.transition({ y: 0, scaleY: 0 }, a, c.easing) })
            })
        }, d.init = function() { b.addClass("state-closed"), b.addClass("expandable-animation-3d"), Modernizr.touch || (b.bind("mouseenter.expandable", d.doOpen).bind("mouseleave.expandable", d.doClose), b.find("a").bind("click", function(a) { b.hasClass("state-closed") && a.preventDefault() })) };
        var g = { duration: 250, easing: "linear" };
        c = a.extend({}, g, c), this.init()
    }, a.fn.wpv_expandable = function(c, d) {
        if ("string" == typeof c) {
            var e = Array.prototype.slice.call(arguments, 1);
            this.each(function() { var d = a.data(this, "wpv_expandable"); return d ? a.isFunction(d[c]) && "_" !== c.charAt(0) ? void window.VAMTAM.expandable[c].apply(d, e) : void b("no such method '" + c + "' for expandable instance") : void b("cannot call methods on expandable prior to initialization; attempted to call method '" + c + "'") })
        } else this.each(function() {
            var b = a.data(this, "wpv_expandable");
            b ? (b.option(c), b._init(d)) : a.data(this, "wpv_expandable", new window.VAMTAM.expandable(this, c, d))
        });
        return this
    }, a(".services.has-more").wpv_expandable(), a(".services.has-more > .closed").matchHeight()
}(jQuery),
function(a) {
    "use strict";
    a(function() {
        var b = a("#header-slider-container.layerslider").find(".layerslider-fixed-wrapper"),
            c = b.find(">div:first");
        if (c.length) {
            var d = !1,
                e = 0,
                f = function() { return c.height() > 0 || e++ > 5 ? void b.height("auto") : void(d = setTimeout(f, 500)) };
            d = setTimeout(f, 0)
        }
    })
}(jQuery),
function(a, b) {
    "use strict";
    var c = function() { a(function() { this.init() }.bind(this)) };
    c.prototype.init = function() { this.wrappers = a(".portfolios"), a(".page-content, .page-content > .row:first-child > .wpv-grid:first-child").find(" > .portfolios:first-child > .portfolio-filters").appendTo(a(".page-header-content")), this.wrappers.on("mouseenter", ".vamtam-project", this.mouseenter.bind(this)), this.wrappers.on("mouseleave", ".vamtam-project", this.mouseleave.bind(this)), this.wrappers.on("touchstart", ".vamtam-project", this.touchstart.bind(this)), this.wrappers.on("touchmove", ".vamtam-project", this.touchmove.bind(this)), this.wrappers.on("touchend", ".vamtam-project", this.touchend.bind(this)), document.body.addEventListener("touchstart", function(a) { for (var b = a.target.closest(".vamtam-project"), c = document.querySelectorAll(".vamtam-project.state-open"), d = 0; d < c.length; d++) c[d] !== b && this.doClose(c[d]) }.bind(this)) }, c.prototype.mouseenter = function(a) { this.doOpen(a.target.closest(".vamtam-project")) }, c.prototype.mouseleave = function(a) { this.doClose(a.target.closest(".vamtam-project")) }, c.prototype.touchstart = function(a) {
        var c = a.target.closest(".vamtam-project");
        c.classList.contains("state-closed") && !b.MEDIA.layout["layout-below-max"] && (c.vamtamMaybeOpen = !0)
    }, c.prototype.touchend = function(a) {
        var b = a.target.closest(".vamtam-project");
        b.vamtamMaybeOpen && (b.vamtamMaybeOpen = !1, this.doOpen(b), a.preventDefault())
    }, c.prototype.touchmove = function(a) { a.target.closest(".vamtam-project").vamtamMaybeOpen = !1 }, c.prototype.doOpen = function(a) { a.classList.contains("state-open") || requestAnimationFrame(function() { a.classList.add("state-open"), a.classList.remove("state-closed") }) }, c.prototype.doClose = function(a) { a.classList.contains("state-closed") || requestAnimationFrame(function() { a.classList.add("state-closed"), a.classList.remove("state-open") }) }, new c
}(jQuery, window.VAMTAM),
function(a) {
    "use strict";
    a(function() {
        var b = {},
            c = function(c) {
                "undefined" != typeof window._wpmejsSettings && (b = a.extend(!0, {}, window._wpmejsSettings)), b.classPrefix = "mejs-", b.success = b.success || function(a) {
                    var b, c;
                    a.rendererName && -1 !== a.rendererName.indexOf("flash") && (b = a.attributes.autoplay && "false" !== a.attributes.autoplay, c = a.attributes.loop && "false" !== a.attributes.loop, b && a.addEventListener("canplay", function() { a.play() }, !1), c && a.addEventListener("ended", function() { a.play() }, !1))
                }, "mediaelementplayer" in a.fn && a(".wp-audio-shortcode, .wp-video-shortcode", c).not(".mejs-container").filter(function() { return !a(this).parent().hasClass("mejs-mediaelement") }).mediaelementplayer(b)
            };
        if (a("body").is(".pagination-infinite-scrolling")) {
            var d = 0;
            a(window).bind("resize scroll", function(b) {
                var c = a(".lm-btn"),
                    e = b.timeStamp || (new Date).getTime();
                e - d > 500 && 1 === parseFloat(c.css("opacity"), 10) && a(window).scrollTop() + a(window).height() >= c.offset().top && (d = e, c.click())
            })
        }
        a("body").on("click.pagination", ".load-more", function(b) {
            b.preventDefault(), b.stopPropagation();
            var d = a(this),
                e = d.prev(),
                f = d.find("a");
            return d.hasClass("loading") ? !1 : (d.addClass("loading").find("> *").animate({ opacity: 0 }), void a.post(VAMTAM_FRONT.ajaxurl, { action: "vamtam-load-more", query: f.data("query"), other_vars: f.data("other-vars") }, function(b) {
                var f = a(b.content);
                c(f);
                var g = e.find(".cbp-item:not( .cbp-item-off )").length;
                e.cubeportfolio("appendItems", f, function() {
                    if (g === e.find(".cbp-item:not( .cbp-item-off )").length) {
                        var c = a("<p />").addClass("vamtam-load-more-warning").text(e.data("hidden-by-filters"));
                        c.insertAfter(d), a("body").one("click", function() { c.remove() })
                    }
                    d.replaceWith(b.button), d.removeClass("loading").find("> *").animate({ opacity: 1 }), a(window).triggerHandler("resize.vamtam-video")
                })
            }))
        })
    })
}(jQuery),
function(a) {
    "use strict";
    a(function() {
        a(".wpv-countdown").each(function() {
            var b = a(".wpvc-days .value", this),
                c = a(".wpvc-hours .value", this),
                d = a(".wpvc-minutes .value", this),
                e = a(".wpvc-seconds .value", this),
                f = parseInt(a(this).data("until"), 10),
                g = a(this).data("done"),
                h = a(this),
                i = function() {
                    var i = Math.round(+new Date / 1e3);
                    if (i >= f && "" !== g) return clearInterval(j), void h.html(a("<span />").addClass("wpvc-done wpvc-block").html(a("<span />").addClass("value").text(g)));
                    var k = Math.abs(f - i);

                    e.text(k % 60), k = Math.floor(k / 60), d.text(k % 60), k = Math.floor(k / 60), c.text(k % 24), k = Math.floor(k / 24), b.text(k)
                },
                j = setInterval(i, 1e3)
        })
    })
}(jQuery);