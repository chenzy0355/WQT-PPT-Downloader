(function() {
    
    
    
    

    
    if (window.__wqt_popup_running) {
        alert('cdut-wqhelper 已运行中。如需重新打开，请先关闭当前窗口。');
        return;
    }
    window.__wqt_popup_running = true;

    
    var urlParams = new URLSearchParams(window.location.search);
    var courseId = urlParams.get('course_id');
    var subId = urlParams.get('sub_id');
    var tenantCode = urlParams.get('tenant_code') || '21';
    var pageUrl = window.location.href;
    var isCoursePage = pageUrl.indexOf('coursedetail') !== -1;
    var isLessonPage = pageUrl.indexOf('livingroom') !== -1 || pageUrl.indexOf('videoroom') !== -1;
    var activeTab = isLessonPage ? 'single' : 'batch';  

    

    
    var backdrop = document.createElement('div');
    backdrop.id = 'wqt-backdrop';
    backdrop.style.cssText =
        'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:999998;' +
        'transition:opacity 0.2s;pointer-events:none;';

    
    var popup = document.createElement('div');
    popup.id = 'wqt-popup';
    popup.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'width:660px;max-width:95vw;max-height:85vh;' +
        'background:#fff;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.25);' +
        'z-index:999999;display:flex;flex-direction:column;' +
        'font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:14px;color:#333;' +
        'overflow:hidden;';

    
    var titleBar = document.createElement('div');
    titleBar.id = 'wqt-titlebar';
    titleBar.style.cssText =
        'padding:12px 18px;background:#1890ff;color:#fff;' +
        'display:flex;justify-content:space-between;align-items:center;' +
        'cursor:move;user-select:none;flex-shrink:0;border-radius:12px 12px 0 0;';
    titleBar.innerHTML =
        '<span style="display:flex;align-items:center;gap:10px;">' +
        '<span style="font-size:16px;font-weight:bold;">📚 cdut-wqhelper</span>' +
        '<a href="https://github.com/chenzy0355/cdut-wqhelper" target="_blank" title="GitHub 项目" ' +
        'style="color:#fff;text-decoration:none;opacity:0.85;font-size:14px;">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align:-2px;">' +
        '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>' +
        '</a>' +
        '<a href="https://gitee.com/chenzy1/cdut-wqhelper" target="_blank" title="Gitee 项目" ' +
        'style="color:#fff;text-decoration:none;opacity:0.85;font-size:12px;">Gitee</a>' +
        '</span>' +
        '<span style="display:flex;gap:6px;">' +
        '<button id="wqt-settings-btn" title="设置" style="width:28px;height:28px;border:none;background:rgba(255,255,255,0.2);color:#fff;border-radius:4px;cursor:pointer;font-size:16px;line-height:1;">⚙</button>' +
        '<button id="wqt-min-btn" title="最小化" style="width:28px;height:28px;border:none;background:rgba(255,255,255,0.2);color:#fff;border-radius:4px;cursor:pointer;font-size:18px;line-height:1;">−</button>' +
        '<button id="wqt-close-btn" title="关闭" style="width:28px;height:28px;border:none;background:rgba(255,255,255,0.2);color:#fff;border-radius:4px;cursor:pointer;font-size:16px;line-height:1;">✕</button>' +
        '</span>';

    
    var tabBar = document.createElement('div');
    tabBar.id = 'wqt-tabbar';
    tabBar.style.cssText =
        'display:flex;border-bottom:2px solid #f0f0f0;flex-shrink:0;padding:0 18px;';

    var batchTabBtn = document.createElement('button');
    batchTabBtn.id = 'wqt-tab-batch';
    batchTabBtn.textContent = '📦 批量下载';
    batchTabBtn.style.cssText =
        'padding:10px 20px;border:none;background:none;font-size:14px;cursor:pointer;' +
        'color:#999;border-bottom:2px solid transparent;margin-bottom:-2px;' +
        'transition:color 0.2s,border-color 0.2s;outline:none;';

    var singleTabBtn = document.createElement('button');
    singleTabBtn.id = 'wqt-tab-single';
    singleTabBtn.textContent = '📄 单节下载';
    singleTabBtn.style.cssText = batchTabBtn.style.cssText;

    tabBar.appendChild(batchTabBtn);
    tabBar.appendChild(singleTabBtn);

    
    var settingsPanel = document.createElement('div');
    settingsPanel.id = 'wqt-settings';
    settingsPanel.style.cssText =
        'display:none;padding:14px 18px;border-bottom:1px solid #f0f0f0;background:#fafafa;flex-shrink:0;';
    settingsPanel.innerHTML =
        '<div style="display:flex;gap:16px;">' +
        
        '<div style="flex:1;min-width:0;">' +
        '<div style="font-weight:bold;margin-bottom:6px;color:#333;font-size:13px;">📥 课件下载方式</div>' +
        '<div style="background:#fff;border:1px solid #f0f0f0;border-radius:6px;padding:8px 10px;">' +
        '<label style="display:flex;align-items:flex-start;padding:4px 0;cursor:pointer;font-size:13px;">' +
        '<input type="radio" name="wqt-single-method" value="silent" style="margin-top:2px;margin-right:6px;">' +
        '<div>🚀 一键提取<span style="font-size:11px;color:#52c41a;"> 推荐</span>' +
        '<div style="font-size:11px;color:#999;margin-top:2px;">直接获取 PPT 原图</div></div></label>' +
        '<label style="display:flex;align-items:flex-start;padding:4px 0;cursor:pointer;font-size:13px;">' +
        '<input type="radio" name="wqt-single-method" value="clicker" style="margin-top:2px;margin-right:6px;">' +
        '<div>🖱 翻页提取' +
        '<div style="font-size:11px;color:#999;margin-top:2px;">从页面缓存提取</div></div></label>' +
        '</div></div>' +
        
        '<div style="flex:1;min-width:0;">' +
        '<div style="font-weight:bold;margin-bottom:6px;color:#333;font-size:13px;">📝 笔记导出</div>' +
        '<div style="background:#fff;border:1px solid #f0f0f0;border-radius:6px;padding:8px 10px;">' +
        '<label style="display:flex;align-items:center;padding:4px 0;cursor:pointer;font-size:13px;">' +
        '<input type="checkbox" id="wqt-notes-voice" style="margin-right:6px;">' +
        '<div>🎤 包含语音识别</div></label>' +
        '</div></div>' +
        '</div>' +
        '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0;' +
        'font-size:12px;color:#999;text-align:center;">' +
        '<div style="margin-bottom:8px;">' +
        '<a href="https://qun.qq.com/universal-share/share?ac=1&authKey=uimlA%2BL1FwMtbHqRkhzDY5F4E2m1M89Ymqd7fyk7%2FjMyXujBhPy3EdSnPeaFIBp%2B&busi_data=eyJncm91cENvZGUiOiIxMDgzNDI1NzYxIiwidG9rZW4iOiJHS24wU0NEYzlrK2hhcllqam1GQlBERU1jZG80REJSUU5zRzhyYkZ6NDNRdnFDZHp6YUIvcFR2dnB3QmZHcmwwIiwidWluIjoiMjM4ODkzMDM4NyJ9&data=QfHaf1AOP4ZCfT-KNwXZcFSrda2rbYJU9WaRHRUt2bqnRvWUmo2LALuf5JrsYb3J5WAz-tBYyjCrFBE8ptAPHA&svctype=4&tempid=h5_group_info" target="_blank" ' +
        'style="color:#1890ff;text-decoration:none;">反馈群</a>' +
        '</div>' +
        '<a href="mailto:chenzy0355@gmail.com?subject=cdut-wqhelper%20%E5%8F%8D%E9%A6%88' +
        '&body=%E9%97%AE%E9%A2%98%E6%8F%8F%E8%BF%B0%EF%BC%9A%0A%0A%E9%A1%B5%E9%9D%A2%E5%9C%B0%E5%9D%80%EF%BC%9A%0A%0A%E5%A4%8D%E7%8E%B0%E6%AD%A5%E9%AA%A4%EF%BC%9A" ' +
        'style="color:#1890ff;text-decoration:none;">问题反馈 · chenzy0355@gmail.com</a></div>';

    
    var savedMethod = localStorage.getItem('wqt_single_method') || 'silent';
    var methodRadios = settingsPanel.querySelectorAll('input[name="wqt-single-method"]');
    for (var mi = 0; mi < methodRadios.length; mi++) {
        if (methodRadios[mi].value === savedMethod) methodRadios[mi].checked = true;
        methodRadios[mi].addEventListener('change', function() {
            localStorage.setItem('wqt_single_method', this.value);
        });
    }

    var voiceCb = settingsPanel.querySelector('#wqt-notes-voice');
    if (voiceCb) {
        voiceCb.checked = localStorage.getItem('wqt_notes_voice') !== 'false';
        voiceCb.addEventListener('change', function() {
            localStorage.setItem('wqt_notes_voice', this.checked ? 'true' : 'false');
        });
    }

    
    var contentArea = document.createElement('div');
    contentArea.id = 'wqt-content';
    contentArea.style.cssText =
        'flex:1;overflow-y:auto;padding:16px 18px;min-height:200px;max-height:55vh;';

    
    var footer = document.createElement('div');
    footer.id = 'wqt-footer';
    footer.style.cssText =
        'padding:10px 18px;border-top:1px solid #f0f0f0;display:flex;gap:10px;' +
        'justify-content:flex-end;align-items:center;flex-shrink:0;flex-wrap:wrap;';

    
    popup.appendChild(titleBar);
    popup.appendChild(tabBar);
    popup.appendChild(settingsPanel);
    popup.appendChild(contentArea);
    popup.appendChild(footer);
    document.body.appendChild(backdrop);
    document.body.appendChild(popup);

    
    var isDragging = false;
    var dragStartX, dragStartY, popupStartX, popupStartY;

    titleBar.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'BUTTON') return;  
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        var rect = popup.getBoundingClientRect();
        popupStartX = rect.left;
        popupStartY = rect.top;
        popup.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - dragStartX;
        var dy = e.clientY - dragStartY;
        popup.style.left = (popupStartX + dx) + 'px';
        popup.style.top = (popupStartY + dy) + 'px';
        popup.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            popup.style.transition = '';
        }
    });

    
    var isMinimized = false;
    var savedHeight;
    var settingsWasVisible = false;

    document.getElementById('wqt-min-btn').addEventListener('click', function() {
        if (isMinimized) {
            
            backdrop.style.display = '';
            popup.style.pointerEvents = '';
            popup.style.width = '660px';
            popup.style.right = '';
            popup.style.top = '50%'; popup.style.left = '50%';
            popup.style.transform = 'translate(-50%,-50%)';
            tabBar.style.display = 'flex';
            if (settingsWasVisible) settingsPanel.style.display = 'block';
            contentArea.style.display = '';
            footer.style.display = 'flex';
            popup.style.height = savedHeight || '';
            popup.style.maxHeight = '85vh';
            popup.style.borderRadius = '12px';
            document.getElementById('wqt-min-btn').textContent = '−';
            isMinimized = false;
        } else {
            
            savedHeight = popup.style.height || popup.offsetHeight + 'px';
            settingsWasVisible = settingsPanel.style.display !== 'none';
            backdrop.style.display = 'none';
            tabBar.style.display = 'none';
            settingsPanel.style.display = 'none';
            contentArea.style.display = 'none';
            footer.style.display = 'none';
            popup.style.width = 'auto';
            popup.style.height = 'auto';
            popup.style.maxHeight = 'none';
            popup.style.top = '8px'; popup.style.left = ''; popup.style.right = '8px';
            popup.style.transform = 'none';
            popup.style.borderRadius = '8px';
            popup.style.pointerEvents = 'auto';
            document.getElementById('wqt-min-btn').textContent = '+';
            isMinimized = true;
        }
    });

    
    function closePopup() {
        window.__wqt_popup_running = false;
        
        if (window.__wqt_single_active) {
            document.removeEventListener('click', clickHandler, true);
            window.__wqt_single_active = false;
        }
        
        window.__wqt_batch_active = false;
        
        if (window.__wqt_auto_timer) {
            clearInterval(window.__wqt_auto_timer);
            window.__wqt_auto_timer = null;
        }
        popup.remove();
        backdrop.remove();
    }

    document.getElementById('wqt-close-btn').addEventListener('click', closePopup);

    
    document.getElementById('wqt-settings-btn').addEventListener('click', function() {
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
        } else {
            settingsPanel.style.display = 'none';
        }
    });

    
    function switchTab(tab) {
        
        if (activeTab === 'single' && tab !== 'single') {
            document.removeEventListener('click', clickHandler, true);
            window.__wqt_single_active = false;
            if (autoClickerTimer) {
                clearInterval(autoClickerTimer);
                autoClickerTimer = null;
            }
            pendingTarget = null;
        }
        activeTab = tab;
        if (tab === 'batch') {
            batchTabBtn.style.color = '#1890ff';
            batchTabBtn.style.borderBottomColor = '#1890ff';
            batchTabBtn.style.fontWeight = 'bold';
            singleTabBtn.style.color = '#999';
            singleTabBtn.style.borderBottomColor = 'transparent';
            singleTabBtn.style.fontWeight = 'normal';
            renderBatchTab();
        } else {
            singleTabBtn.style.color = '#1890ff';
            singleTabBtn.style.borderBottomColor = '#1890ff';
            singleTabBtn.style.fontWeight = 'bold';
            batchTabBtn.style.color = '#999';
            batchTabBtn.style.borderBottomColor = 'transparent';
            batchTabBtn.style.fontWeight = 'normal';
            renderSingleTab();
        }
    }

    batchTabBtn.addEventListener('click', function() { switchTab('batch'); });
    singleTabBtn.addEventListener('click', function() { switchTab('single'); });

    
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function setFooter(html) {
        footer.innerHTML = html;
    }

    // ====================================================================
    //  PDF 直接保存模块
    // ====================================================================

    function getSingleMethodName() {
        return (localStorage.getItem('wqt_single_method') || 'silent') === 'silent' ? '一键提取' : '翻页提取';
    }

    // 从页面提取课程名称
    function extractCourseName() {
        var title = (document.title || '').replace(/[_\-]\s*问渠学堂.*$/, '').trim();
        // 去掉日期模式 "2025-10-13第5-6节" 及其后面的内容，留下课程名
        title = title.replace(/[_\-]\s*\d{4}-\d{2}-\d{2}第\d+-\d+节.*$/, '').trim();
        title = title.replace(/\s*回放\s*$/, '').trim();
        if (title) return title;

        // 尝试从 DOM 中查找面包屑或课程标题
        var crumb = document.querySelector('.course-title, .breadcrumb span:last-child, h1, .title');
        if (crumb) {
            var t = crumb.textContent.trim();
            t = t.replace(/[_\-]\s*问渠学堂.*$/, '').replace(/\s*回放\s*$/, '').trim();
            if (t && t.length < 50) return t;
        }

        return '课件';
    }

    // 生成 PDF 文件名：课程名_课节标题.pdf
    function makePdfFilename(lessonLabel) {
        var course = extractCourseName();
        var label = (lessonLabel || document.title || '课件')
            .replace(/回放\s*/g, '')
            .replace(/[_\-]\s*问渠学堂.*$/, '')
            .trim();
        // 避免课程名重复：如果 label 已经以课程名开头就不重复
        var full;
        if (course && label.indexOf(course) === 0) {
            full = label;
        } else if (course && course !== '课件') {
            full = course + '_' + label;
        } else {
            full = label;
        }
        full = full.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').substring(0, 120);
        return full + '.pdf';
    }

    
    
    
    
    
    
    

    
    
    
    function fetchPptUrlsByApi(subId) {
        return new Promise(function(resolve) {
            var api = '/pptnote/v1/schedule/search-ppt?sub_id=' + subId + '&per_page=999';
            fetch(api, { credentials: 'include' })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    var list = data && data.list ? data.list : [];
                    
                    list.sort(function(a, b) {
                        return (a.created_sec || 0) - (b.created_sec || 0);
                    });
                    var urls = [];
                    for (var i = 0; i < list.length; i++) {
                        try {
                            var content = JSON.parse(list[i].content || '{}');
                            var u = content.pptimgurl;  
                            if (u) urls.push(u);
                        } catch (e) {}
                    }
                    resolve(urls);
                })
                .catch(function(e) {
                    console.warn('[wqxt] search-ppt API 失败，回退 DOM 提取:', e);
                    resolve(null); 
                });
        });
    }

    
    function fetchSubTitle(subId) {
        return new Promise(function(resolve) {
            var courseId = (new URLSearchParams(window.location.search)).get('course_id');
            var api = '/courseapi/v3/multi-search/get-course-detail?course_id=' + courseId;
            fetch(api, { credentials: 'include' })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    var subList = data && data.data ? data.data.sub_list : null;
                    var found = '';
                    
                    (function walk(o) {
                        if (!o || typeof o !== 'object') return;
                        if (Array.isArray(o)) {
                            for (var i = 0; i < o.length; i++) walk(o[i]);
                        } else {
                            if (o.id && String(o.id) === String(subId) && o.sub_title) {
                                found = o.sub_title;
                                return;
                            }
                            for (var k in o) if (o.hasOwnProperty(k)) walk(o[k]);
                        }
                    })(subList);
                    resolve(found);
                })
                .catch(function() { resolve(''); });
        });
    }

    
    
    function imageUrlToDataUrlWithRetry(url, maxRetry) {
        maxRetry = maxRetry || 6;
        return new Promise(function(resolve) {
            var attempt = 0;
            function tryOnce() {
                imageUrlToDataUrl(url).then(function(dataUrl) {
                    if (dataUrl) { resolve(dataUrl); return; }
                    attempt++;
                    if (attempt >= maxRetry) { resolve(null); return; }
                    
                    setTimeout(tryOnce, 1000 * attempt);
                });
            }
            tryOnce();
        });
    }

    
    
    
    
    
    
    function downloadWithProbe(urls, onProgress, mode) {
        
        return new Promise(function(resolve) {
            var result = new Array(urls.length).fill(null);  
            var pendingIdx = [];  
            urls.forEach(function(u, i) { if (u) pendingIdx.push(i); });

            var concurrency = 24;       
            var maxTotalMs = 45000;     
            var startTime = Date.now();
            var round = 0;
            var failCount = {};         

            function runRound() {
                if (pendingIdx.length === 0) { resolve(result); return; }
                if (Date.now() - startTime >= maxTotalMs) { resolve(result); return; }

                var batch = pendingIdx.splice(0, concurrency);
                var done = 0;
                var stillPending = [];

                batch.forEach(function(idx) {
                    var dlPromise = imageUrlToDataUrl(urls[idx]);

                    dlPromise.then(function(data) {
                        if (data) {
                            result[idx] = data;
                        } else {
                            
                            failCount[idx] = (failCount[idx] || 0) + 1;
                            if (failCount[idx] <= 3) {
                                stillPending.push(idx);  
                            }
                        }
                        done++;
                        if (done >= batch.length) {
                            pendingIdx = pendingIdx.concat(stillPending);
                            round++;

                            if (onProgress) {
                                var okCount = result.filter(function(x) { return !!x; }).length;
                                onProgress(okCount, pendingIdx.length);
                            }

                            if (pendingIdx.length === 0 || Date.now() - startTime >= maxTotalMs) {
                                resolve(result);
                                return;
                            }
                            var delay = Math.min(1000 + round * 500, 4000);
                            setTimeout(runRound, delay);
                        }
                    });
                });
            }

            runRound();
        });
    }

    
    
    
    
    
    function imageUrlToDataUrl(url) {
        return new Promise(function(resolve) {
            var settled = false;
            function done(v) { if (!settled) { settled = true; resolve(v); } }

            var timeout = setTimeout(function() { done(null); }, 15000);
            function finish(v) { clearTimeout(timeout); done(v); }

            
            
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                try {
                    if (!img.naturalWidth || !img.naturalHeight) { finish(null); return; }
                    var canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    finish(canvas.toDataURL('image/jpeg', 0.92));
                } catch (e) { finish(null); }
            };
            img.onerror = function() { finish(null); };
            img.src = url;
        });
    }

    
    async function generatePdfBlob(imageUrls, onProgress) {
        if (!window.jspdf) { alert('PDF 库未加载，请刷新页面重试。'); return null; }
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [256, 144] });

        
        var dataUrls = await downloadWithProbe(imageUrls, onProgress, 'dataUrl');

        
        var added = 0;
        for (var i = 0; i < dataUrls.length; i++) {
            if (!dataUrls[i]) continue;  
            if (added > 0) doc.addPage([256, 144], 'landscape');
            doc.addImage(dataUrls[i], 'JPEG', 0, 0, 256, 144);
            added++;
        }

        return doc.output('blob');
    }

    
    function fallbackDownload(pdfBlob, filename) {
        var url = URL.createObjectURL(pdfBlob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
    }

    
    function triggerDownload(pdfBlob, filename) {
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            var resolved = false;

            
            var fallbackTimer = setTimeout(function() {
                if (resolved) return;
                resolved = true;
                fallbackDownload(pdfBlob, filename);
            }, 2000);

            try {
                chrome.runtime.sendMessage({
                    action: 'download-pdf',
                    dataUrl: dataUrl,
                    filename: filename
                }, function(response) {
                    if (resolved) return;
                    clearTimeout(fallbackTimer);
                    resolved = true;

                    if (chrome.runtime.lastError) {
                        
                        fallbackDownload(pdfBlob, filename);
                    } else if (response && response.success) {
                        
                        
                    } else {
                        
                        fallbackDownload(pdfBlob, filename);
                    }
                });
            } catch(e) {
                
                if (!resolved) {
                    clearTimeout(fallbackTimer);
                    resolved = true;
                    fallbackDownload(pdfBlob, filename);
                }
            }
        };
        reader.readAsDataURL(pdfBlob);
    }

    
    function triggerDownloadAsync(pdfBlob, filename) {
        return new Promise(function(resolve) {
            var reader = new FileReader();
            reader.onload = function() {
                var dataUrl = reader.result;
                try {
                    chrome.runtime.sendMessage({
                        action: 'download-pdf',
                        dataUrl: dataUrl,
                        filename: filename
                    }, function(response) {
                        
                        setTimeout(resolve, 1500);
                    });
                } catch(e) {
                    
                    fallbackDownload(pdfBlob, filename);
                    setTimeout(resolve, 2000);
                }
            };
            reader.onerror = function() {
                resolve(); 
            };
            reader.readAsDataURL(pdfBlob);
        });
    }

    
    async function generateAndSavePdf(imageUrls, filename) {
        var total = imageUrls.length;
        setFooter(
            '<span style="flex:1;font-size:13px;color:#faad14;">⏳ 正在下载（共 ' + total + ' 页）...</span>' +
            '<span style="font-size:12px;color:#999;">请稍候</span>'
        );

        var blob = await generatePdfBlob(imageUrls, function(readyCount, pendingCount) {
            var done = total - pendingCount;
            setFooter(
                '<span style="flex:1;font-size:13px;color:#faad14;">⏳ 已下载 ' + done + '/' + total +
                ' 页' + (pendingCount > 0 ? '（' + pendingCount + ' 页等待中…）' : '') + '</span>'
            );
        });

        if (!blob) {
            setFooter('<span style="flex:1;font-size:13px;color:#ff4d4f;">❌ PDF 生成失败</span>');
            return;
        }

        triggerDownload(blob, filename);
        setFooter(
            '<span style="flex:1;font-size:13px;color:#52c41a;">✅ 已下载: ' + escapeHtml(filename) + '</span>'
        );
    }

    
    async function batchGenerateAndSave(allLessons, courseTitle) {
        var validLessons = allLessons.filter(function(l) { return l.pptUrls.length > 0; });
        if (validLessons.length === 0) {
            alert('未提取到任何课件图片。');
            return;
        }

        
        var shouldMerge = (window.__wqt_merge_mode || 'merge') === 'merge';

        if (shouldMerge) {
            
            var allUrls = [];
            for (var i = 0; i < validLessons.length; i++) {
                allUrls = allUrls.concat(validLessons[i].pptUrls);
            }
            var safeName = courseTitle.replace(/[\\/:*?"<>|]/g, '_').substring(0, 80);
            await generateAndSavePdf(allUrls, safeName + '.pdf');
        } else {
            // 逐节保存 — 必须串行等待，否则浏览器会丢弃后续下载
            for (var i = 0; i < validLessons.length; i++) {
                var lesson = validLessons[i];
                var safeName = makePdfFilename(lesson.label).replace(/\.pdf$/, '');
                setFooter(
                    '<span style="flex:1;font-size:13px;color:#faad14;">' +
                    '⏳ [' + (i + 1) + '/' + validLessons.length + '] 正在生成: ' + escapeHtml(safeName) + '</span>'
                );

                var blob = await generatePdfBlob(lesson.pptUrls);
                if (blob) {
                    setFooter(
                        '<span style="flex:1;font-size:13px;color:#faad14;">' +
                        '⏳ [' + (i + 1) + '/' + validLessons.length + '] 正在保存: ' + escapeHtml(safeName) + '</span>'
                    );
                    // 同步等待本次下载完成再继续下一个
                    await triggerDownloadAsync(blob, safeName + '.pdf');
                }
            }
            setFooter(
                '<span style="flex:1;font-size:13px;color:#52c41a;">' +
                '✅ 已下载 ' + validLessons.length + ' 个文件</span>' +
                '<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
                'style="padding:6px 14px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
            );
        }
    }

    
    
    

    
    function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

    
    function extractVisibleText(container) {
        if (!container) return '';
        
        var empty = container.querySelector('.empty-ppt-wrapper, .keywords-empty, [class*="empty"]');
        if (empty) {
            var img = empty.querySelector('img');
            if (img && img.src && img.src.indexOf('base64') !== -1) return ''; 
        }
        
        var text = container.textContent || '';
        return text.replace(/\n{3,}/g, '\n\n').trim();
    }

    
    async function extractNotesFromPage(doc, win) {
        var notes = { summary: {}, voice: '', words: '' };
        var tabs = doc.querySelectorAll('.side_tab .tab_span');

        for (var i = 0; i < tabs.length; i++) {
            var name = tabs[i].textContent.trim();
            var li = tabs[i].closest('li');
            if (!li) continue;

            
            try {
                var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: win });
                li.dispatchEvent(evt);
            } catch(e) {}
            await sleep(2000);

            var wrap = doc.querySelector('.component_wrap');
            if (!wrap) continue;

            
            function getVisibleContent() {
                var children = wrap.children;
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                    var style = child.style.display;
                    var computed = win.getComputedStyle(child).display;
                    if (style !== 'none' && computed !== 'none') return child;
                }
                
                for (var c2 = 0; c2 < children.length; c2++) {
                    if (children[c2].textContent.trim().length > 10) return children[c2];
                }
                return wrap;
            }

            if (name === '智能摘要') {
                
                var subTabs = wrap.querySelectorAll('.title-list span');
                var subNames = ['内容摘要','内容关键字','段落总结','重点回顾'];
                var subKeys  = ['contentSummary','keywords','paragraphSummary','keyReview'];

                for (var s = 0; s < subTabs.length; s++) {
                    
                    var target = null;
                    for (var st = 0; st < subTabs.length; st++) {
                        if (subTabs[st].textContent.trim().indexOf(subNames[s]) !== -1) {
                            target = subTabs[st]; break;
                        }
                    }
                    if (!target) target = subTabs[s];
                    try {
                        var evt2 = new MouseEvent('click', { bubbles: true, cancelable: true, view: win });
                        target.dispatchEvent(evt2);
                    } catch(e) {}
                    await sleep(1000);

                    var scrollWrap = wrap.querySelector('.intelligence-abstract-scrollbar-wrapper');
                    notes.summary[subKeys[s]] = scrollWrap ? extractVisibleText(scrollWrap) : '';
                }
            } else if (name === '语音识别') {
                if (localStorage.getItem('wqt_notes_voice') !== 'false') {
                    notes.voice = extractVisibleText(getVisibleContent());
                }
            } else if (name === '热词云') {
                notes.words = extractVisibleText(getVisibleContent());
            }
        }

        return notes;
    }

    
    function formatNotesAsMarkdown(notes, title) {
        var md = '# ' + (title || '课堂笔记') + '\n\n';

        
        var hasSummary = notes.summary.contentSummary || notes.summary.keywords ||
                         notes.summary.paragraphSummary || notes.summary.keyReview;
        if (hasSummary) {
            md += '## 📝 智能摘要\n\n';
            if (notes.summary.contentSummary) {
                md += '### 内容摘要\n\n' + notes.summary.contentSummary + '\n\n';
            }
            if (notes.summary.keywords) {
                md += '### 内容关键字\n\n' + notes.summary.keywords + '\n\n';
            }
            if (notes.summary.paragraphSummary) {
                md += '### 段落总结\n\n' + notes.summary.paragraphSummary + '\n\n';
            }
            if (notes.summary.keyReview) {
                md += '### 重点回顾\n\n' + notes.summary.keyReview + '\n\n';
            }
        }

        
        if (notes.voice) {
            md += '## 🎤 语音识别\n\n' + notes.voice + '\n\n';
        }

        
        if (notes.words) {
            md += '## ☁️ 热词云\n\n' + notes.words + '\n\n';
        }

        return md;
    }

    
    async function extractAndSaveNotes(doc, win, filename) {
        setFooter(
            '<span style="flex:1;font-size:13px;color:#faad14;">⏳ 正在提取课堂笔记...</span>' +
            '<span style="font-size:12px;color:#999;">请稍候</span>'
        );

        var notes = await extractNotesFromPage(doc || document, win || window);
        var pageTitle = (doc || document).title.replace(/回放\s*/g, '').replace(/[_\-]\s*问渠学堂.*$/, '').trim() || '课堂笔记';
        var md = formatNotesAsMarkdown(notes, pageTitle);

        
        var safeName = makePdfFilename().replace(/\.pdf$/, '') + '_笔记';
        var blob = new Blob(['﻿' + md], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(blob, safeName + '.md');

        setFooter(
            '<span style="flex:1;font-size:13px;color:#52c41a;">✅ 笔记已导出: ' + escapeHtml(safeName) + '.md</span>'
        );
    }

    
    function loadLessonInIframeForNotes(url) {
        return new Promise(function(resolve) {
            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;border:none;visibility:hidden;';
            iframe.src = url;

            var resolved = false;
            var hardTimeout = setTimeout(function() {
                if (!resolved) { resolved = true; resolve({ notes: null }); try { iframe.remove(); } catch(e) {} }
            }, 45000);

            iframe.onload = async function() {
                clearTimeout(hardTimeout);
                if (resolved) return;
                try {
                    var doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!doc || !doc.body || doc.body.innerHTML.trim().length < 100) {
                        resolved = true; resolve({ notes: null });
                        try { iframe.remove(); } catch(e) {}
                        return;
                    }
                    
                    await sleep(5000);
                    if (resolved) return;
                    var notes = await extractNotesFromPage(doc, iframe.contentWindow);
                    resolved = true;
                    resolve({ notes: notes });
                } catch(e) {
                    resolved = true; resolve({ notes: null });
                }
                try { iframe.remove(); } catch(e) {}
            };

            iframe.onerror = function() {
                clearTimeout(hardTimeout);
                if (!resolved) { resolved = true; resolve({ notes: null }); }
            };

            document.body.appendChild(iframe);
        });
    }

    
    
    

    var cachedLessonItems = null;  

    function fetchCourseFromApi() {
        var student = '';
        try {
            var storageKeys = ['account', 'username', 'user', 'loginName', 'student', 'userName', 'login_name'];
            for (var sk = 0; sk < storageKeys.length; sk++) {
                var v = localStorage.getItem(storageKeys[sk]);
                if (v) { student = v; break; }
            }
            if (!student) {
                for (var sk2 = 0; sk2 < storageKeys.length; sk2++) {
                    var v2 = sessionStorage.getItem(storageKeys[sk2]);
                    if (v2) { student = v2; break; }
                }
            }
        } catch(e) {}

        var apiBase = (window.CONFIG && window.CONFIG.YJAPI) || 'https://yjapi.wqxt.cdut.edu.cn';
        var query = '?course_id=' + courseId + '&sub_type=';
        if (student) query += '&student=' + encodeURIComponent(student);

        var urls = [
            apiBase + '/courseapi/v3/multi-search/get-course-detail' + query,
            'https://yjapi.wqxt.cdut.edu.cn/courseapi/v3/multi-search/get-course-detail' + query
        ];

        return (async function() {
            for (var u = 0; u < urls.length; u++) {
                try {
                    var result = await new Promise(function(resolve) {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', urls[u], true);
                        xhr.withCredentials = true;
                        xhr.timeout = 8000;
                        xhr.onload = function() {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try { resolve(JSON.parse(xhr.responseText)); } catch(e) { resolve(null); }
                            } else { resolve(null); }
                        };
                        xhr.onerror = function() { resolve(null); };
                        xhr.ontimeout = function() { resolve(null); };
                        xhr.send();
                    });
                    if (result && result.code === 0 && result.data) {
                        var payload = result.data;
                        
                        function flattenSubs(obj, out) {
                            if (!obj || typeof obj !== 'object') return;
                            if (Array.isArray(obj)) {
                                for (var i = 0; i < obj.length; i++) {
                                    if (obj[i] && typeof obj[i] === 'object') {
                                        
                                        if (obj[i].id && obj[i].sub_title) {
                                            out.push(obj[i]);
                                        } else {
                                            flattenSubs(obj[i], out);
                                        }
                                    }
                                }
                            } else {
                                for (var k in obj) {
                                    if (obj.hasOwnProperty(k)) flattenSubs(obj[k], out);
                                }
                            }
                        }

                        var flat = [];
                        var source = (payload.auto_chapter && payload.origin_sub_list)
                            ? payload.origin_sub_list : payload.sub_list;
                        if (source) flattenSubs(source, flat);

                        
                        var seen = {};
                        var result2 = [];
                        for (var fi = 0; fi < flat.length; fi++) {
                            var e = flat[fi];
                            if (!e.id) continue;
                            if (e.type === 'chapter') continue;
                            if (seen[e.id]) continue;
                            seen[e.id] = true;
                            result2.push(e);
                        }
                        if (result2.length > 0) return result2;
                    }
                } catch(e) {}
            }
            return null;
        })();
    }

    function extractFromVueState() {
        function flattenLiveObj(obj) {
            var items = [];
            function walk(val) {
                if (Array.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        if (val[i] && typeof val[i] === 'object' && val[i].type !== 'chapter') {
                            items.push(val[i]);
                        }
                    }
                } else if (typeof val === 'object' && val !== null) {
                    var keys = Object.keys(val);
                    for (var j = 0; j < keys.length; j++) { walk(val[keys[j]]); }
                }
            }
            walk(obj);
            return items.length > 0 ? items : null;
        }

        var globalKeys = Object.keys(window).filter(function(k) {
            return !k.startsWith('_') && !k.startsWith('on') && typeof window[k] === 'object' && window[k] !== null;
        });
        for (var g = 0; g < globalKeys.length; g++) {
            try {
                var val = window[globalKeys[g]];
                if (!val) continue;
                if (val.state && typeof val.commit === 'function') {
                    var st = val.state;
                    if (st.subList && Array.isArray(st.subList)) {
                        return st.subList.filter(function(e) { return e.type !== 'chapter'; });
                    }
                    if (st.courseLiveObj) { return flattenLiveObj(st.courseLiveObj); }
                    var stateKeys = Object.keys(st);
                    for (var sk = 0; sk < stateKeys.length; sk++) {
                        var sv = st[stateKeys[sk]];
                        if (sv && sv.subList && Array.isArray(sv.subList)) {
                            return sv.subList.filter(function(e) { return e.type !== 'chapter'; });
                        }
                        if (sv && sv.courseLiveObj) { return flattenLiveObj(sv.courseLiveObj); }
                    }
                }
                if (val.subList && Array.isArray(val.subList) && val.subList.length > 0) {
                    return val.subList.filter(function(e) { return e.type !== 'chapter'; });
                }
                if (val.courseLiveObj && typeof val.courseLiveObj === 'object') {
                    return flattenLiveObj(val.courseLiveObj);
                }
            } catch(e) {}
        }

        
        function searchVm(vm) {
            if (!vm || typeof vm !== 'object') return null;
            if (vm.subList && Array.isArray(vm.subList) && vm.subList.length > 0) {
                return vm.subList.filter(function(e) { return e.type !== 'chapter'; });
            }
            if (vm.courseLiveObj && typeof vm.courseLiveObj === 'object') {
                var items = flattenLiveObj(vm.courseLiveObj);
                if (items) return items;
            }
            if (vm.$children && vm.$children.length > 0) {
                for (var k = 0; k < vm.$children.length; k++) {
                    var result = searchVm(vm.$children[k]);
                    if (result) return result;
                }
            }
            return null;
        }

        var allEls = document.querySelectorAll('*');
        for (var i2 = 0; i2 < allEls.length; i2++) {
            var el = allEls[i2];
            if (el.__vue__) {
                var r = searchVm(el.__vue__);
                if (r) return r;
            }
            if (el._vnode && el._vnode.component) {
                var r2 = searchVm(el._vnode.component);
                if (r2) return r2;
            }
        }
        return null;
    }

    function extractFromDom() {
        var lessons = [];
        var replaySpans = document.querySelectorAll('.colorStatus');
        for (var i = 0; i < replaySpans.length; i++) {
            var span = replaySpans[i];
            if (span.textContent.trim() !== '回放') continue;
            var row = span.closest('p') || span.parentElement;
            if (!row) continue;
            var spans = row.querySelectorAll('span');
            var dateText = '', teacherText = '', roomText = '';
            for (var j = 0; j < spans.length; j++) {
                var txt = spans[j].textContent.trim();
                if (/\d{4}-\d{2}-\d{2}第\d+-\d+节/.test(txt)) { dateText = txt; }
                else if (txt && !txt.match(/智播|回放|上次学到|^\d{2}:\d{2}:\d{2}$/)) {
                    if (!teacherText && txt.length <= 4) { teacherText = txt; }
                    else if (txt.indexOf('主校区') !== -1 || txt.indexOf('教') !== -1) { roomText = txt; }
                }
            }
            if (dateText) {
                lessons.push({
                    id: null, sub_title: dateText, lecturer_name: teacherText,
                    room_name: roomText, sub_status: 6, type: 'course_live', _domOnly: true
                });
            }
        }
        if (lessons.length > 0) {
            var vueItems = extractFromVueState();
            if (vueItems && vueItems.length === lessons.length) {
                for (var k = 0; k < lessons.length; k++) {
                    if (vueItems[k]) {
                        lessons[k].id = vueItems[k].id;
                        lessons[k].type = vueItems[k].type || 'course_live';
                        lessons[k]._domOnly = false;
                    }
                }
            }
        }
        return lessons.length > 0 ? lessons : null;
    }

    function getLessonUrl(item) {
        var subId = item.id;
        var params = 'course_id=' + courseId + '&sub_id=' + subId + '&tenant_code=' + tenantCode;
        var type = item.type || 'course_live';
        if (type === 'video') return '/videoroom?' + params;
        return '/livingroom?' + params;
    }

    
    function diagnoseIframe(iframe) {
        try {
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc) return { ok: false, reason: 'blocked', doc: null, detail: 'contentDocument 为 null，可能被 X-Frame-Options 或 CSP 拦截' };
            var body = doc.body;
            if (!body || body.innerHTML.trim().length < 100) {
                return { ok: false, reason: 'loaded', doc: doc, detail: '页面内容极少，可能为空白页或重定向' };
            }
            return { ok: true, reason: 'loaded', doc: doc, detail: '页面已加载' };
        } catch(e) {
            return { ok: false, reason: 'cross-origin', doc: null, detail: '跨域错误: ' + e.message };
        }
    }

    function extractPptFromDoc(doc, win, alreadyTriedClick) {
        var imgs = doc.querySelectorAll('img[data-src*="/ppt/"]');
        var urlSet = {};
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getAttribute('data-src');
            if (src && /\/ppt\/.*\.jpg$/.test(src)) { urlSet[src] = true; }
        }
        var urls = Object.keys(urlSet);

        if (urls.length === 0 && !alreadyTriedClick) {
            var tabSpans = doc.querySelectorAll('.side_tab .tab_span, .side_tab_wrap li span, .side_tab_wrap .tab_span');
            for (var t = 0; t < tabSpans.length; t++) {
                if (tabSpans[t].textContent.trim() === 'PPT') {
                    var clickTarget = tabSpans[t].closest('li') || tabSpans[t];
                    try {
                        var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: win });
                        clickTarget.dispatchEvent(evt);
                    } catch(e) {}
                    break;
                }
            }
            return { urls: [], clickedTab: true };
        }

        if (urls.length === 0) return { urls: [], clickedTab: alreadyTriedClick || false };

        urls.sort(function(a, b) {
            var matchA = a.match(/(\d+)\.jpg$/);
            var matchB = b.match(/(\d+)\.jpg$/);
            var numA = matchA ? parseInt(matchA[1], 10) : 0;
            var numB = matchB ? parseInt(matchB[1], 10) : 0;
            return numA - numB;
        });
        return { urls: urls, clickedTab: alreadyTriedClick || false };
    }

    function loadLessonInIframe(url) {
        return new Promise(function(resolve) {
            var startTime = Date.now();
            var iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;border:none;visibility:hidden;';
            iframe.src = url;

            var resolved = false;
            var clickedPptTab = false;
            var lastStatus = '';

            function done(result, status) {
                if (resolved) return;
                resolved = true;
                clearTimeout(hardTimeout);
                try { iframe.remove(); } catch(e) {}
                resolve({ urls: result, status: status || lastStatus });
            }

            var hardTimeout = setTimeout(function() {
                lastStatus = '超时(30s未加载)';
                done([], lastStatus);
            }, 30000);

            iframe.onload = function() {
                clearTimeout(hardTimeout);
                var renderTimeout = setTimeout(function() {
                    lastStatus = '超时(页面已加载但未找到PPT)';
                    done([], lastStatus);
                }, 20000);

                var diag = diagnoseIframe(iframe);
                if (!diag.ok) {
                    clearTimeout(renderTimeout);
                    lastStatus = 'iframe诊断: ' + diag.detail;
                    done([], lastStatus);
                    return;
                }

                var attempts = 0;
                function pollForPpt() {
                    if (resolved || !window.__wqt_batch_active) {
                        clearTimeout(renderTimeout);
                        if (!resolved) done([], '用户取消');
                        return;
                    }
                    attempts++;
                    var result = extractPptFromDoc(diag.doc, iframe.contentWindow, clickedPptTab);
                    if (result.clickedTab && !clickedPptTab) {
                        clickedPptTab = true;
                        lastStatus = '已点击PPT标签页，等待渲染...';
                        setTimeout(pollForPpt, 1500);
                        return;
                    }
                    if (result.urls.length > 0) {
                        clearTimeout(renderTimeout);
                        lastStatus = '成功提取 ' + result.urls.length + ' 页';
                        done(result.urls, lastStatus);
                        return;
                    }
                    if (Date.now() - startTime > 25000) {
                        clearTimeout(renderTimeout);
                        var bodyLen = diag.doc.body ? diag.doc.body.innerHTML.length : 0;
                        var hasApp = diag.doc.querySelector('#app') || diag.doc.querySelector('[data-v-]');
                        var hasVideo = diag.doc.querySelector('video') || diag.doc.querySelector('.cmcPlayer_container');
                        lastStatus = '未找到PPT(页面' + bodyLen + 'B, ' +
                            (hasApp ? '有Vue' : '无Vue') + ', ' +
                            (hasVideo ? '有播放器' : '无播放器') + ')';
                        done([], lastStatus);
                        return;
                    }
                    setTimeout(pollForPpt, 800);
                }
                setTimeout(pollForPpt, 3000);
            };

            iframe.onerror = function() {
                lastStatus = '网络错误(iframe onerror)';
                done([], lastStatus);
            };

            document.body.appendChild(iframe);
        });
    }

    function buildCombinedPreview(allLessons, courseTitle) {
        var validLessons = allLessons.filter(function(l) { return l.pptUrls.length > 0; });
        if (validLessons.length === 0) {
            alert('未提取到任何课件图片。');
            return;
        }

        var printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('新标签页被浏览器拦截，请在地址栏右侧允许本站点的弹窗后重试！');
            return;
        }

        var totalSlides = 0;
        for (var i = 0; i < validLessons.length; i++) { totalSlides += validLessons[i].pptUrls.length; }

        var html = '<!DOCTYPE html><html><head>' +
            '<meta charset="UTF-8">' +
            '<title>' + escapeHtml(courseTitle) + ' - 全部课件 (' + validLessons.length + '节课, ' + totalSlides + '页)</title>' +
            '<style>' +
            '@page { size: 256mm 144mm; margin: 0; }' +
            '@media print { body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }' +
            '  .lesson-header { display: none !important; } #wqt-print-btn { display: none !important; }' +
            '  .lesson-section { page-break-after: always; } .lesson-section:last-child { page-break-after: auto; } }' +
            'body { margin: 0; padding: 0; background: #2b2b2b; font-family: "Microsoft YaHei", "PingFang SC", sans-serif; }' +
            '.lesson-section { margin-bottom: 0; }' +
            '.lesson-header { background: #1890ff; color: #fff; padding: 12px 24px; font-size: 16px; font-weight: bold;' +
            '  display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }' +
            '.ppt-page { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;' +
            '  margin: 0; padding: 0; background: #000; }' +
            '.ppt-page img { width: 100%; height: 100%; object-fit: contain; display: block; }' +
            '#wqt-print-btn { position: fixed; top: 20px; right: 30px; z-index: 99999; padding: 10px 24px; font-size: 15px;' +
            '  color: #fff; background: #1890ff; border: none; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }' +
            '#wqt-print-btn:hover { background: #40a9ff; }' +
            '</style></head><body>' +
            '<button id="wqt-print-btn" onclick="window.print()">调用系统打印 (' + totalSlides + ' 页 / ' + validLessons.length + ' 节课)</button>';

        for (var li = 0; li < validLessons.length; li++) {
            var lesson = validLessons[li];
            html += '<div class="lesson-section">' +
                '<div class="lesson-header"><span>' + escapeHtml(lesson.label) + '</span>' +
                '<span style="font-weight:normal;font-size:14px;">共 ' + lesson.pptUrls.length + ' 页</span></div>';
            for (var si = 0; si < lesson.pptUrls.length; si++) {
                html += '<div class="ppt-page"><img src="' + escapeHtml(lesson.pptUrls[si]) + '" /></div>';
            }
            html += '</div>';
        }
        html += '</body></html>';

        printWindow.document.write(html);
        printWindow.document.close();
    }

    
    function renderBatchTab() {
        if (!isCoursePage) {
            
            contentArea.innerHTML =
                '<div style="text-align:center;padding:40px 20px;color:#999;">' +
                '<div style="font-size:48px;margin-bottom:16px;">📦</div>' +
                '<p style="font-size:16px;margin-bottom:8px;">批量下载需要在<strong>课程目录页</strong>使用</p>' +
                '<p style="font-size:13px;">当前页面: ' + escapeHtml(pageUrl) + '</p>' +
                '<p style="font-size:13px;">请导航至问渠学堂的课程详情页后重试</p>' +
                (isLessonPage && courseId ?
                    '<a href="/coursedetail?course_id=' + courseId + '&tenant_code=' + tenantCode +
                    '" style="display:inline-block;margin-top:12px;padding:8px 20px;background:#1890ff;' +
                    'color:#fff;text-decoration:none;border-radius:6px;">前往课程目录页</a>' : '') +
                '</div>';
            setFooter('<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
                'style="padding:6px 20px;cursor:pointer;color:#666;background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
            return;
        }

        
        contentArea.innerHTML =
            '<div style="text-align:center;padding:30px;color:#1890ff;">' +
            '<div style="font-size:32px;margin-bottom:8px;">⏳</div>正在加载课程...</div>';
        setFooter('');

        
        loadBatchLessons();
    }

    async function loadBatchLessons() {
        
        contentArea.innerHTML =
            '<div style="text-align:center;padding:30px;color:#1890ff;">⏳ 正在获取课程...</div>';

        var lessonItems = await fetchCourseFromApi();

        if (!lessonItems || lessonItems.length === 0) {
            contentArea.innerHTML =
                '<div style="text-align:center;padding:30px;color:#faad14;">⏳ 正在读取页面数据...</div>';
            lessonItems = extractFromVueState();
        }

        if (!lessonItems || lessonItems.length === 0) {
            contentArea.innerHTML =
                '<div style="text-align:center;padding:30px;color:#faad14;">⏳ 正在读取课程信息...</div>';
            lessonItems = extractFromDom();
        }

        if (!lessonItems || lessonItems.length === 0) {
            contentArea.innerHTML =
                '<div style="text-align:center;padding:40px 20px;color:#ff4d4f;">' +
                '<div style="font-size:32px;margin-bottom:8px;">❌</div>未获取到课程数据<br>' +
                '<span style="font-size:13px;color:#999;">请确认当前是课程详情页（URL 含 coursedetail），刷新后重试</span></div>';
            setFooter('<button id="wqt-batch-retry" style="padding:6px 20px;cursor:pointer;color:#fff;' +
                'background:#1890ff;border:none;border-radius:4px;">重试</button>' +
                '<button id="wqt-batch-close" style="padding:6px 20px;cursor:pointer;color:#666;' +
                'background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
            document.getElementById('wqt-batch-retry').onclick = loadBatchLessons;
            document.getElementById('wqt-batch-close').onclick = closePopup;
            return;
        }

        cachedLessonItems = lessonItems;  

        
        renderLessonList(lessonItems);
    }

    function renderLessonList(lessonItems) {
        var hasIdCount = 0;
        var noIdCount = 0;
        for (var i = 0; i < lessonItems.length; i++) {
            if (lessonItems[i].id) hasIdCount++; else noIdCount++;
        }

        var rows = '';
        for (var r = 0; r < lessonItems.length; r++) {
            var item = lessonItems[r];
            var title = item.sub_title || ('课节 #' + item.id);
            var teacher = item.lecturer_name || '';
            var room = item.room_name || '';
            var subIdDisplay = item.id ? (' [ID:' + item.id + ']') : ' <span style="color:#ff7875;">[缺ID]</span>';

            rows +=
                '<tr style="border-bottom:1px solid #f5f5f5;">' +
                '<td style="padding:6px 8px;"><input type="checkbox" class="wqt-lesson-chk" checked data-index="' + r + '"' +
                (!item.id ? ' disabled title="缺少 sub_id，无法下载"' : '') + '></td>' +
                '<td style="padding:6px 8px;">' + escapeHtml(title) + '<span style="color:#aaa;font-size:11px;">' + subIdDisplay + '</span></td>' +
                '<td style="padding:6px 8px;">' + escapeHtml(teacher) + '</td>' +
                '<td style="padding:6px 8px;font-size:12px;color:#999;">' + escapeHtml(room) + '</td>' +
                '<td style="padding:6px 8px;" class="wqt-status-cell">⏳ 待处理</td>' +
                '</tr>';
        }

        var infoNote = '';
        if (noIdCount > 0) {
            infoNote = '<div style="font-size:12px;color:#faad14;margin-bottom:8px;">⚠️ 有 ' + noIdCount +
                ' 节课无法下载（缺少必要信息）</div>';
        }

        contentArea.innerHTML =
            '<div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">' +
            '<span style="font-weight:bold;">📚 共 ' + lessonItems.length + ' 节课</span>' +
            '<label style="font-size:13px;cursor:pointer;color:#1890ff;">' +
            '<input type="checkbox" id="wqt-select-all" checked style="margin-right:4px;">全选</label>' +
            '</div>' +
            infoNote +
            '<div style="max-height:300px;overflow-y:auto;border:1px solid #f0f0f0;border-radius:6px;">' +
            '<table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">' +
            '<thead><tr style="background:#fafafa;position:sticky;top:0;">' +
            '<th style="padding:6px 8px;width:36px;"></th>' +
            '<th style="padding:6px 8px;">课节</th>' +
            '<th style="padding:6px 8px;">教师</th>' +
            '<th style="padding:6px 8px;">教室</th>' +
            '<th style="padding:6px 8px;width:140px;">状态</th>' +
            '</tr></thead><tbody>' + rows + '</tbody></table></div>';

        
        var downloadableCount = hasIdCount;
        setFooter(
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;">' +
            '<span style="font-size:13px;color:#999;">可选: ' + downloadableCount + ' 节</span>' +
            '<select id="wqt-merge-mode" style="padding:4px 6px;border:1px solid #d9d9d9;border-radius:4px;' +
            'font-size:12px;color:#666;background:#fff;cursor:pointer;">' +
            '<option value="merge">合并PDF</option>' +
            '<option value="separate">分开PDF</option>' +
            '</select>' +
            '<span style="flex:1;"></span>' +
            '<button id="wqt-toggle-all" style="padding:5px 12px;cursor:pointer;color:#666;' +
            'background:#fff;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;">反选</button>' +
            '<button id="wqt-batch-ppt" style="padding:7px 16px;cursor:pointer;color:#fff;' +
            'background:#1890ff;border:none;border-radius:4px;font-size:14px;font-weight:bold;">📄 导出PPT</button>' +
            '<button id="wqt-batch-notes-btn" style="padding:7px 16px;cursor:pointer;color:#fff;' +
            'background:#fa8c16;border:none;border-radius:4px;font-size:14px;font-weight:bold;">📝 导出笔记</button>' +
            '<button id="wqt-cancel-batch" style="padding:5px 12px;cursor:pointer;color:#666;' +
            'background:#fff;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;">关闭</button>' +
            '</div>'
        );

        
        var selectAllCb = document.getElementById('wqt-select-all');
        var checkboxes = document.querySelectorAll('.wqt-lesson-chk');

        selectAllCb.onchange = function() {
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].disabled) checkboxes[i].checked = selectAllCb.checked;
            }
        };

        document.getElementById('wqt-toggle-all').onclick = function() {
            var allChecked = true;
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].disabled && !checkboxes[i].checked) { allChecked = false; break; }
            }
            for (var i = 0; i < checkboxes.length; i++) {
                if (!checkboxes[i].disabled) checkboxes[i].checked = !allChecked;
            }
            selectAllCb.checked = !allChecked;
        };

        
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].onchange = function() {
                var allChecked = true;
                var cbs = document.querySelectorAll('.wqt-lesson-chk');
                for (var j = 0; j < cbs.length; j++) {
                    if (!cbs[j].disabled && !cbs[j].checked) { allChecked = false; break; }
                }
                selectAllCb.checked = allChecked;
            };
        }

        document.getElementById('wqt-cancel-batch').onclick = closePopup;

        document.getElementById('wqt-batch-ppt').onclick = function() {
            batchExportPpt(lessonItems);
        };

        document.getElementById('wqt-batch-notes-btn').onclick = function() {
            batchExportNotes(lessonItems);
        };
    }

    
    function getSelectedLessons(lessonItems) {
        var checkboxes = document.querySelectorAll('.wqt-lesson-chk');
        var selected = [];
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] && checkboxes[i].checked && !checkboxes[i].disabled) {
                var idx = parseInt(checkboxes[i].getAttribute('data-index'), 10);
                selected.push({ item: lessonItems[idx], idx: idx });
            }
        }
        return selected;
    }

    
    async function runParallel(tasks, concurrency, onProgress) {
        var results = new Array(tasks.length);
        var running = 0;
        var cursor = 0;
        var done = 0;

        return new Promise(function(resolve) {
            function next() {
                while (running < concurrency && cursor < tasks.length && window.__wqt_batch_active) {
                    var i = cursor++;
                    running++;
                    tasks[i]().then(function(r) {
                        results[i] = r;
                        done++;
                        if (onProgress) onProgress(done, tasks.length);
                        running--;
                        if (done >= tasks.length || !window.__wqt_batch_active) {
                            resolve(results);
                        } else {
                            next();
                        }
                    });
                }
                if (cursor >= tasks.length && running === 0) resolve(results);
            }
            next();
        });
    }

    
    async function batchExportPpt(lessonItems) {
        var selected = getSelectedLessons(lessonItems);
        if (selected.length === 0) { alert('请至少选择一节课。'); return; }

        var mergeSelect = document.getElementById('wqt-merge-mode');
        window.__wqt_merge_mode = mergeSelect ? mergeSelect.value : 'merge';

        disableBatchButtons();
        window.__wqt_batch_active = true;
        var total = selected.length;

        var tasks = selected.map(function(s) {
            return async function() {
                updateBatchStatus(s.idx, '🔄 加载中...', '#faad14');
                var title = s.item.sub_title || ('课节 #' + s.item.id);
                if (!s.item.id && s.item._domOnly) {
                    updateBatchStatus(s.idx, '⚠️ 缺少ID', '#ff7875');
                    return { label: title, pptUrls: [], _failed: true };
                }
                
                var apiUrls = await fetchPptUrlsByApi(s.item.id);
                var pptUrls = [];
                var failReason = '无';
                if (apiUrls && apiUrls.length > 0) {
                    pptUrls = apiUrls;
                } else {
                    var result = await loadLessonInIframe(getLessonUrl(s.item));
                    pptUrls = result.urls || [];
                    failReason = result.status || '无';
                }
                updateBatchStatus(s.idx, pptUrls.length > 0 ? '✅ ' + pptUrls.length + ' 页' : '❌ ' + failReason,
                    pptUrls.length > 0 ? '#52c41a' : '#ff7875');
                return { label: title + (s.item.lecturer_name ? ' — ' + s.item.lecturer_name : ''), pptUrls: pptUrls };
            };
        });

        var results = await runParallel(tasks, 3, function(done, total) {
            setFooter('<span style="flex:1;font-size:13px;">⏳ 导出PPT: ' + done + '/' + total + ' 节 (最多3节并行)</span>');
        });

        if (!window.__wqt_batch_active) { resetBatchFooter(); return; }

        var validResults = results.filter(function(r) { return r && r.pptUrls && r.pptUrls.length > 0; });
        if (validResults.length === 0) {
            setFooter('<span style="flex:1;font-size:13px;color:#ff4d4f;">❌ 没有找到可下载的课件</span>' +
                '<button onclick="document.getElementById(\'wqt-close-btn\').click()" style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
            window.__wqt_batch_active = false;
            return;
        }
        var courseTitle = (document.title || '问渠学堂导出课件').replace(/[_\-]\s*问渠学堂.*$/, '').trim();
        batchGenerateAndSave(validResults, courseTitle);
        window.__wqt_batch_active = false;
    }

    
    async function batchExportNotes(lessonItems) {
        var selected = getSelectedLessons(lessonItems);
        if (selected.length === 0) { alert('请至少选择一节课。'); return; }

        var valid = selected.filter(function(s) { return s.item.id; });
        if (valid.length === 0) { alert('所选课节无法提取笔记。'); return; }

        disableBatchButtons();
        window.__wqt_batch_active = true;

        var mdParts = new Array(valid.length);

        var tasks = valid.map(function(s) {
            return async function() {
                updateBatchStatus(s.idx, '🔄 提取中...', '#faad14');
                var result = await loadLessonInIframeForNotes(getLessonUrl(s.item));
                var label = s.item.sub_title || ('课节 #' + s.item.id);
                if (result && result.notes) {
                    updateBatchStatus(s.idx, '✅ 已提取', '#52c41a');
                    return { label: label, md: formatNotesAsMarkdown(result.notes, label) };
                } else {
                    updateBatchStatus(s.idx, '⚠️ 无内容', '#ff7875');
                    return null;
                }
            };
        });

        var results = await runParallel(tasks, 2, function(done, total) {
            setFooter('<span style="flex:1;font-size:13px;">⏳ 导出笔记: ' + done + '/' + total + ' 节 (最多2节并行)</span>');
        });

        var successResults = results.filter(function(r) { return r; });
        if (successResults.length === 0) {
            setFooter('<span style="flex:1;font-size:13px;color:#ff4d4f;">❌ 未提取到任何笔记</span>' +
                '<button onclick="document.getElementById(\'wqt-close-btn\').click()" style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
            window.__wqt_batch_active = false;
            return;
        }

        var courseTitle = (document.title || '课程笔记').replace(/[_\-]\s*问渠学堂.*$/, '').trim();
        var allMd = '# ' + courseTitle + '\n\n';
        for (var i = 0; i < valid.length; i++) {
            if (results[i]) allMd += '\n---\n\n' + results[i].md;
        }

        var safeName = courseTitle.replace(/[\\/:*?"<>|]/g, '_').substring(0, 80) + '_全部笔记';
        var blob = new Blob(['﻿' + allMd], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(blob, safeName + '.md');

        setFooter(
            '<span style="flex:1;font-size:13px;color:#52c41a;">✅ 笔记已保存 (' + successResults.length + '/' + valid.length + '节)</span>' +
            '<button onclick="document.getElementById(\'wqt-close-btn\').click()" style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
        );
        window.__wqt_batch_active = false;
    }

    function disableBatchButtons() {
        var btns = footer.querySelectorAll('button');
        for (var b = 0; b < btns.length; b++) {
            if (btns[b].id !== 'wqt-cancel-batch') { btns[b].disabled = true; btns[b].style.opacity = '0.5'; btns[b].style.cursor = 'not-allowed'; }
        }
    }

    function updateBatchStatus(index, text, color) {
        var cells = contentArea.querySelectorAll('.wqt-status-cell');
        if (cells[index]) { cells[index].textContent = text; cells[index].style.color = color; }
    }

    function resetBatchFooter() {
        setFooter('<span style="font-size:13px;color:#999;">已终止</span>' +
            '<button onclick="document.getElementById(\'wqt-close-btn\').click()" style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
    }

    
    
    

    var pendingTarget = null;
    var autoClickerTimer = null;

    
    function extractPptFromCurrentPage(alreadyTriedClick) {
        var imgs = document.querySelectorAll('img[data-src*="/ppt/"]');
        var urlSet = {};
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].getAttribute('data-src');
            if (src && /\/ppt\/.*\.jpg$/.test(src)) { urlSet[src] = true; }
        }
        var urls = Object.keys(urlSet);

        
        if (urls.length === 0 && !alreadyTriedClick) {
            var tabSpans = document.querySelectorAll('.side_tab .tab_span, .side_tab_wrap li span, .side_tab_wrap .tab_span');
            for (var t = 0; t < tabSpans.length; t++) {
                if (tabSpans[t].textContent.trim() === 'PPT') {
                    var clickTarget = tabSpans[t].closest('li') || tabSpans[t];
                    try {
                        var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        clickTarget.dispatchEvent(evt);
                    } catch(e) {}
                    break;
                }
            }
            return { urls: [], clickedTab: true };
        }

        if (urls.length === 0) return { urls: [], clickedTab: alreadyTriedClick || false };

        
        urls.sort(function(a, b) {
            var matchA = a.match(/(\d+)\.jpg$/);
            var matchB = b.match(/(\d+)\.jpg$/);
            var numA = matchA ? parseInt(matchA[1], 10) : 0;
            var numB = matchB ? parseInt(matchB[1], 10) : 0;
            return numA - numB;
        });
        return { urls: urls, clickedTab: alreadyTriedClick || false };
    }

    function getPptUrls() {
        var allResources = window.performance.getEntriesByType('resource').map(function(r) { return r.name; });
        var urls = allResources.filter(function(url) {
            return url.indexOf('/ppt/') !== -1 && /\/(\d+)\.jpg$/.test(url);
        });
        var unique = [];
        var seen = {};
        for (var i = 0; i < urls.length; i++) {
            if (!seen[urls[i]]) { seen[urls[i]] = true; unique.push(urls[i]); }
        }
        return unique;
    }

    function clickHandler(e) {
        
        if (e.target.closest('#wqt-popup') || e.target.closest('#wqt-backdrop')) return;
        if (e.target.id === 'wqt-cancel-single') return;

        e.preventDefault();
        e.stopPropagation();

        if (!pendingTarget) {
            pendingTarget = e.target;
            updateSingleStatus('⚠️ 已锁定目标！请<b>再点击一次</b>同一按钮以确认启动。', '#faad14');
        } else if (pendingTarget === e.target) {
            document.removeEventListener('click', clickHandler, true);
            startAutoClicker(e.target);
        } else {
            pendingTarget = e.target;
            updateSingleStatus('🔄 目标已变更！请<b>再点击一次</b>当前按钮以确认启动。', '#faad14');
        }
    }

    function startAutoClicker(nextBtn) {
        var currentCount = getPptUrls().length;
        var lastCount = currentCount;
        var idleTicks = 0;

        updateSingleStatus('正在后台静默缓存幻灯片，请稍候... (已缓存: ' + currentCount + ' 页)', '#faad14');

        autoClickerTimer = setInterval(function() {
            var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            nextBtn.dispatchEvent(evt);

            currentCount = getPptUrls().length;
            if (currentCount > lastCount) {
                lastCount = currentCount;
                idleTicks = 0;
                updateSingleStatus('正在后台静默缓存幻灯片，请稍候... (已缓存: ' + currentCount + ' 页)', '#faad14');
            } else {
                idleTicks++;
            }

            if (idleTicks >= 20) {
                clearInterval(autoClickerTimer);
                autoClickerTimer = null;
                var urls = getPptUrls();
                updateSingleStatus('✅ 缓存完成！共提取 ' + urls.length + ' 页课件。', '#52c41a');
                setFooter(
                    '<span style="flex:1;font-size:13px;color:#52c41a;">已缓存 ' + urls.length + ' 页</span>' +
                    '<button id="wqt-open-preview" style="padding:6px 20px;cursor:pointer;color:#fff;' +
                    'background:#1890ff;border:none;border-radius:4px;font-weight:bold;">📄 预览并导出</button>' +
                    '<button id="wqt-save-pdf-clicker" style="padding:6px 16px;cursor:pointer;color:#fff;' +
                    'background:#52c41a;border:none;border-radius:4px;font-weight:bold;">💾 直接保存 PDF</button>' +
                    '<button id="wqt-export-notes-clicker" style="padding:6px 16px;cursor:pointer;color:#fff;' +
                    'background:#fa8c16;border:none;border-radius:4px;font-weight:bold;">📝 导出笔记</button>' +
                    '<button id="wqt-single-close" style="padding:6px 14px;cursor:pointer;color:#666;' +
                    'background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
                );
                document.getElementById('wqt-open-preview').onclick = function() {
                    buildPdfPage(urls);
                };
                document.getElementById('wqt-save-pdf-clicker').onclick = function() {
                    generateAndSavePdf(urls, makePdfFilename());
                };
                document.getElementById('wqt-export-notes-clicker').onclick = function() {
                    extractAndSaveNotes(document, window);
                };
                document.getElementById('wqt-single-close').onclick = closePopup;
            }
        }, 150);

        window.__wqt_auto_timer = autoClickerTimer;
    }

    function buildPdfPage(pptUrls) {
        pptUrls.sort(function(a, b) {
            var timeA = parseInt((a.match(/\/(\d+)\.jpg$/) || [0, 0])[1], 10);
            var timeB = parseInt((b.match(/\/(\d+)\.jpg$/) || [0, 0])[1], 10);
            return timeA - timeB;
        });

        if (pptUrls.length === 0) {
            alert('提取异常：未检测到有效幻灯片图像。');
            return;
        }

        var pageTitle = document.title.replace(/回放\s*/g, '').trim() || '问渠学堂导出课件';
        var printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('新标签页被浏览器拦截，请在地址栏右侧允许本站点的弹窗！');
            return;
        }

        
        
        var html = '<!DOCTYPE html><html><head>' +
            '<meta charset="UTF-8"><title>' + escapeHtml(pageTitle) + '</title>' +
            '<style>' +
            '@page { size: 256mm 144mm; margin: 0; }' +
            '@media print { body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }' +
            '  #wqt-print-btn { display: none !important; } }' +
            'body { margin: 0; padding: 0; background: #2b2b2b; font-family: sans-serif; }' +
            '.ppt-page { width: 100vw; height: 100vh; page-break-after: always; display: flex;' +
            '  justify-content: center; align-items: center; margin: 0; padding: 0; }' +
            '.ppt-page img { width: 100%; height: 100%; object-fit: cover; display: block; }' +
            '.ppt-page .placeholder { color: #999; font-size: 20px; }' +
            '#wqt-print-btn { position: fixed; top: 20px; right: 30px; z-index: 99999; padding: 10px 24px;' +
            '  font-size: 15px; color: white; background-color: #1890ff; border: none; border-radius: 4px;' +
            '  cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }' +
            '#wqt-print-btn:hover { background-color: #40a9ff; }' +
            '</style></head><body>' +
            '<button id="wqt-print-btn" onclick="window.print()">调用系统打印 (共 ' + pptUrls.length + ' 页)</button>';

        for (var i = 0; i < pptUrls.length; i++) {
            html += '<div class="ppt-page" id="wqt-page-' + i + '">' +
                '<span class="placeholder">加载中 ' + (i + 1) + '/' + pptUrls.length + '…</span></div>';
        }
        html += '</body></html>';

        printWindow.document.write(html);
        printWindow.document.close();

        
        var completed = 0;
        function fillOne(i) {
            if (i >= pptUrls.length) return;
            imageUrlToDataUrlWithRetry(pptUrls[i]).then(function(dataUrl) {
                var pageEl = printWindow.document.getElementById('wqt-page-' + i);
                if (pageEl && dataUrl) {
                    pageEl.innerHTML = '<img src="' + dataUrl + '" />';
                } else if (pageEl) {
                    pageEl.innerHTML = '<span class="placeholder" style="color:#ff7875;">加载失败 ' + (i + 1) + '</span>';
                }
                completed++;
                fillOne(i + 1);
            });
        }
        fillOne(0);
    }

    function updateSingleStatus(msg, bgColor) {
        var statusEl = document.getElementById('wqt-single-status');
        if (statusEl) {
            statusEl.innerHTML = msg;
            if (bgColor) statusEl.style.background = bgColor;
        }
    }

    
    function renderSingleTab() {
        if (!isLessonPage) {
            
            var html =
                '<div style="text-align:center;padding:40px 20px;color:#999;">' +
                '<div style="font-size:48px;margin-bottom:16px;">📄</div>' +
                '<p style="font-size:16px;margin-bottom:8px;">单节下载需要在<strong>课节播放页</strong>使用</p>' +
                '<p style="font-size:13px;">当前页面: ' + escapeHtml(pageUrl) + '</p>';

            if (isCoursePage && cachedLessonItems && cachedLessonItems.length > 0) {
                html += '<div style="margin-top:20px;text-align:left;max-height:250px;overflow-y:auto;' +
                    'border:1px solid #f0f0f0;border-radius:6px;padding:8px;">' +
                    '<div style="font-weight:bold;margin-bottom:8px;color:#333;">📋 点击课节跳转至播放页：</div>';
                for (var i = 0; i < cachedLessonItems.length; i++) {
                    var item = cachedLessonItems[i];
                    if (!item.id) continue;
                    var href = getLessonUrl(item);
                    var title = item.sub_title || ('课节 #' + item.id);
                    var teacher = item.lecturer_name || '';
                    html += '<a href="' + href + '" target="_blank" style="display:block;padding:6px 8px;' +
                        'color:#1890ff;text-decoration:none;border-bottom:1px solid #f5f5f5;font-size:13px;">' +
                        escapeHtml(title) + (teacher ? ' — ' + escapeHtml(teacher) : '') + '</a>';
                }
                html += '</div>';
            } else {
                html += '<p style="font-size:13px;">请导航至问渠学堂的课节播放页后重试</p>';
            }

            html += '</div>';
            contentArea.innerHTML = html;
            setFooter('<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
                'style="padding:6px 20px;cursor:pointer;color:#666;background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
            return;
        }

        
        var method = localStorage.getItem('wqt_single_method') || 'silent';
        var methodLabel = method === 'silent' ? '🚀 一键提取' : '🖱 翻页提取';
        var voiceOn = localStorage.getItem('wqt_notes_voice') !== 'false';

        contentArea.innerHTML =
            '<div style="text-align:center;padding:20px 0;">' +
            '<div style="font-size:40px;margin-bottom:16px;">📄</div>' +
            '<p style="font-size:16px;margin-bottom:24px;color:#333;">选择导出内容</p>' +
            '<div style="display:flex;gap:16px;justify-content:center;">' +
            '<button id="wqt-single-ppt" style="padding:16px 32px;cursor:pointer;color:#fff;' +
            'background:#1890ff;border:none;border-radius:8px;font-size:18px;font-weight:bold;">' +
            '📄 导出PPT</button>' +
            '<button id="wqt-single-notes" style="padding:16px 32px;cursor:pointer;color:#fff;' +
            'background:#fa8c16;border:none;border-radius:8px;font-size:18px;font-weight:bold;">' +
            '📝 导出笔记</button>' +
            '</div>' +
            '<div style="margin-top:20px;font-size:12px;color:#999;">' +
            'PPT: ' + methodLabel + ' · 笔记: ' + (voiceOn ? '🎤 含语音' : '不含语音') +
            ' · <a href="#" id="wqt-quick-settings" style="color:#1890ff;">更改</a>' +
            '</div></div>';

        setFooter(
            '<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
            'style="padding:6px 14px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
        );

        document.getElementById('wqt-single-ppt').onclick = function() {
            if (method === 'silent') startSilentMode();
            else startClickerMode();
        };
        document.getElementById('wqt-single-notes').onclick = function() {
            
            var currentUrl = window.location.href;
            setFooter('<span style="flex:1;font-size:13px;color:#faad14;">⏳ 正在提取笔记...</span>');
            loadLessonInIframeForNotes(currentUrl).then(function(result) {
                if (result && result.notes) {
                    var pageTitle = document.title.replace(/回放\s*/g, '').replace(/[_\-]\s*问渠学堂.*$/, '').trim() || '课堂笔记';
                    var md = formatNotesAsMarkdown(result.notes, pageTitle);
                    var safeName = makePdfFilename().replace(/\.pdf$/, '') + '_笔记';
                    var blob = new Blob(['﻿' + md], { type: 'text/markdown;charset=utf-8' });
                    triggerDownload(blob, safeName + '.md');
                    setFooter(
                        '<span style="flex:1;font-size:13px;color:#52c41a;">✅ 笔记已保存</span>' +
                        '<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
                        'style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
                    );
                } else {
                    setFooter(
                        '<span style="flex:1;font-size:13px;color:#ff4d4f;">❌ 未提取到笔记</span>' +
                        '<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
                        'style="padding:5px 12px;cursor:pointer;color:#666;background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
                    );
                }
            });
        };
        document.getElementById('wqt-quick-settings').onclick = function(e) {
            e.preventDefault();
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
        };
    }

    
    function startSilentMode() {
        window.__wqt_single_active = false;  
        document.removeEventListener('click', clickHandler, true);
        if (autoClickerTimer) { clearInterval(autoClickerTimer); autoClickerTimer = null; }

        contentArea.innerHTML =
            '<div id="wqt-single-status" style="padding:14px 16px;background:#e6f7ff;border-radius:8px;' +
            'color:#333;font-size:14px;line-height:1.6;margin-bottom:12px;transition:background 0.3s;">' +
            '🚀 正在提取课件...</div>';

        setFooter(
            '<span style="flex:1;font-size:13px;color:#999;">提取中...</span>' +
            '<button id="wqt-cancel-single" style="padding:6px 14px;cursor:pointer;color:#666;' +
            'background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
        );
        document.getElementById('wqt-cancel-single').onclick = closePopup;

        
        var curSubId = subId || (new URLSearchParams(window.location.search)).get('sub_id');
        if (curSubId) {
            fetchPptUrlsByApi(curSubId).then(function(apiUrls) {
                if (apiUrls && apiUrls.length > 0) {
                    
                    finishSilentWithUrls(apiUrls, true);
                } else {
                    
                    updateSingleStatus('⚠️ API 未取到，回退到页面提取...', '#fff7e6');
                    setTimeout(pollSilentLegacy, 500);
                }
            });
        } else {
            
            setTimeout(pollSilentLegacy, 500);
        }

        
        function finishSilentWithUrls(urls, fromApi) {
            updateSingleStatus('✅ 成功提取 <b>' + urls.length + '</b> 页课件！', '#f6ffed');
            contentArea.innerHTML +=
                '<div style="font-size:13px;color:#999;margin-top:8px;padding:0 4px;">' +
                (fromApi
                    ? '已获取全部 PPT 原图。'
                    : '已从页面提取 PPT。') + '</div>';
            setFooter(
                '<span style="flex:1;font-size:13px;color:#52c41a;">已提取 ' + urls.length + ' 页</span>' +
                '<button id="wqt-open-preview" style="padding:6px 20px;cursor:pointer;color:#fff;' +
                'background:#1890ff;border:none;border-radius:4px;font-weight:bold;">📄 预览并导出</button>' +
                '<button id="wqt-save-pdf-silent" style="padding:6px 16px;cursor:pointer;color:#fff;' +
                'background:#52c41a;border:none;border-radius:4px;font-weight:bold;">💾 直接保存 PDF</button>' +
                '<button id="wqt-export-notes-silent" style="padding:6px 16px;cursor:pointer;color:#fff;' +
                'background:#fa8c16;border:none;border-radius:4px;font-weight:bold;">📝 导出笔记</button>' +
                '<button id="wqt-single-close" style="padding:6px 14px;cursor:pointer;color:#666;' +
                'background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
            );
            document.getElementById('wqt-open-preview').onclick = function() {
                buildPdfPage(urls);
            };
            document.getElementById('wqt-save-pdf-silent').onclick = function() {
                
                if (curSubId) {
                    fetchSubTitle(curSubId).then(function(subTitle) {
                        generateAndSavePdf(urls, makePdfFilename(subTitle || undefined));
                    });
                } else {
                    generateAndSavePdf(urls, makePdfFilename());
                }
            };
            document.getElementById('wqt-export-notes-silent').onclick = function() {
                extractAndSaveNotes(document, window);
            };
            document.getElementById('wqt-single-close').onclick = closePopup;
        }

        
        var clickedTab = false;
        var legacyStartTime = Date.now();
        function pollSilentLegacy() {
            var result = extractPptFromCurrentPage(clickedTab);

            if (result.clickedTab && !clickedTab) {
                clickedTab = true;
                updateSingleStatus('🔄 已点击 PPT 标签页，等待渲染...', '#fff7e6');
                setTimeout(pollSilentLegacy, 1500);
                return;
            }

            if (result.urls.length > 0) {
                finishSilentWithUrls(result.urls, false);
                return;
            }

            if (Date.now() - legacyStartTime > 8000) {
                updateSingleStatus('⚠️ 未在页面中找到 PPT 缩略图。<br>可能需要在播放器中打开侧边栏的 PPT 标签页。', '#fff2f0');
                setFooter(
                    '<button id="wqt-switch-clicker2" style="padding:6px 20px;cursor:pointer;color:#fff;' +
                    'background:#faad14;border:none;border-radius:4px;font-weight:bold;">🖱 切换到翻页提取</button>' +
                    '<button id="wqt-retry-silent" style="padding:6px 14px;cursor:pointer;color:#1890ff;' +
                    'background:#fff;border:1px solid #1890ff;border-radius:4px;">重试</button>' +
                    '<button id="wqt-single-close2" style="padding:6px 14px;cursor:pointer;color:#666;' +
                    'background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
                );
                document.getElementById('wqt-switch-clicker2').onclick = function() {
                    localStorage.setItem('wqt_single_method', 'clicker');
                    startClickerMode();
                };
                document.getElementById('wqt-retry-silent').onclick = startSilentMode;
                document.getElementById('wqt-single-close2').onclick = closePopup;
                return;
            }

            setTimeout(pollSilentLegacy, 800);
        }
    }

    
    function startClickerMode() {
        window.__wqt_single_active = true;
        pendingTarget = null;
        if (autoClickerTimer) { clearInterval(autoClickerTimer); autoClickerTimer = null; }

        contentArea.innerHTML =
            '<div id="wqt-single-status" style="padding:14px 16px;background:#e6f7ff;border-radius:8px;' +
            'color:#333;font-size:14px;line-height:1.6;margin-bottom:12px;transition:background 0.3s;">' +
            '🖱 就绪：请找到页面上的<b>「下一页 (>)」</b>按钮并<b>连续点击两次</b>以启动自动翻页缓存。</div>' +
            '<div style="font-size:13px;color:#999;padding:0 4px;">' +
            '<p>• 第一步：点击「下一页」按钮 → 状态变黄，锁定目标</p>' +
            '<p>• 第二步：再次点击同一按钮 → 确认启动，自动翻页开始</p>' +
            '<p>• 自动翻页每 150ms 翻一页，连续 20 次无新图片时判定完成</p>' +
            '<p>• 中途可随时点击下方终止按钮停止</p>' +
            '<p style="margin-top:8px;"><a href="#" id="wqt-switch-silent-link" ' +
            'style="color:#1890ff;text-decoration:none;">切换到一键提取</a></p></div>';

        setFooter(
            '<span style="flex:1;font-size:13px;color:#999;">等待点击确认...</span>' +
            '<button id="wqt-cancel-single" style="padding:6px 14px;cursor:pointer;color:#666;' +
            'background:#fff;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>'
        );

        document.getElementById('wqt-switch-silent-link').onclick = function(e) {
            e.preventDefault();
            localStorage.setItem('wqt_single_method', 'silent');
            startSilentMode();
        };

        document.getElementById('wqt-cancel-single').onclick = function() {
            document.removeEventListener('click', clickHandler, true);
            window.__wqt_single_active = false;
            if (autoClickerTimer) { clearInterval(autoClickerTimer); autoClickerTimer = null; }
            closePopup();
        };

        
        document.addEventListener('click', clickHandler, true);
    }

    
    
    
    
    var isWqxtPage = pageUrl.indexOf('wqxt.cdut.edu.cn') !== -1;
    if (!isWqxtPage) {
        contentArea.innerHTML =
            '<div style="text-align:center;padding:44px 20px;color:#333;">' +
            '<div style="font-size:52px;margin-bottom:16px;">🚀</div>' +
            '<p style="font-size:17px;font-weight:bold;margin-bottom:8px;">当前不在问渠学堂页面</p>' +
            '<p style="font-size:13px;color:#999;margin-bottom:20px;">请先进入问渠学堂，再使用课件下载 / 笔记导出功能</p>' +
            '<a href="https://education.wqxt.cdut.edu.cn/?tenant_code=21" target="_blank" ' +
            'style="display:inline-block;padding:12px 28px;background:#1890ff;color:#fff;' +
            'text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;margin-bottom:12px;">' +
            '进入问渠学堂</a>' +
            '<br>' +
            '<a href="https://classroom.wqxt.cdut.edu.cn/" target="_blank" ' +
            'style="display:inline-block;padding:8px 20px;background:#fff;color:#1890ff;' +
            'text-decoration:none;border:1px solid #1890ff;border-radius:8px;font-size:13px;">' +
            '进入课堂</a>' +
            '</div>';
        setFooter('<button onclick="document.getElementById(\'wqt-close-btn\').click()" ' +
            'style="padding:6px 20px;cursor:pointer;color:#666;background:#f5f5f5;' +
            'border:1px solid #d9d9d9;border-radius:4px;">关闭</button>');
        return;
    }

    switchTab(activeTab);

})();
