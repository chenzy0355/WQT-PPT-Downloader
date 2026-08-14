(function() {
    
    
    
    

    if (window.__wqt_mycourses_running) return;
    window.__wqt_mycourses_running = true;

    
    var backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:999998;pointer-events:none;';

    var popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:620px;max-width:95vw;max-height:80vh;background:#fff;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.25);z-index:999999;display:flex;flex-direction:column;font-family:"Microsoft YaHei","PingFang SC",sans-serif;font-size:14px;color:#333;overflow:hidden;';

    var titleBar = document.createElement('div');
    titleBar.style.cssText = 'padding:12px 18px;background:#1890ff;color:#fff;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none;flex-shrink:0;border-radius:12px 12px 0 0;';
    titleBar.innerHTML = '<span style="font-size:16px;font-weight:bold;">📋 我的课程</span>' +
        '<button id="wqt-mc-close" style="width:28px;height:28px;border:none;background:rgba(255,255,255,0.2);color:#fff;border-radius:4px;cursor:pointer;font-size:16px;">✕</button>';

    var content = document.createElement('div');
    content.style.cssText = 'flex:1;overflow-y:auto;padding:14px 18px;min-height:120px;max-height:55vh;';

    var footer = document.createElement('div');
    footer.style.cssText = 'padding:10px 18px;border-top:1px solid #f0f0f0;display:flex;justify-content:flex-end;align-items:center;flex-shrink:0;';

    popup.appendChild(titleBar); popup.appendChild(content); popup.appendChild(footer);
    document.body.appendChild(backdrop); document.body.appendChild(popup);

    
    var isDragging = false, dx0, dy0, px0, py0;
    titleBar.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true; dx0 = e.clientX; dy0 = e.clientY;
        var r = popup.getBoundingClientRect(); px0 = r.left; py0 = r.top;
        popup.style.transition = 'none'; e.preventDefault();
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        popup.style.left = (px0 + e.clientX - dx0) + 'px';
        popup.style.top = (py0 + e.clientY - dy0) + 'px';
        popup.style.transform = 'none';
    });
    document.addEventListener('mouseup', function() { isDragging = false; popup.style.transition = ''; });

    document.getElementById('wqt-mc-close').onclick = function() {
        window.__wqt_mycourses_running = false;
        popup.remove(); backdrop.remove();
    };

    function escapeHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    // v3.4：保存全部课程，用于前端本地搜索过滤
    var allCourses = [];

    // ========== 策略1: DOM 解析（从 .course-item-wrapper / .courseInfo 卡片 + Vue 实例） ==========
    function extractFromCards(doc) {
        var courses = [];
        // 两种卡片：最近学习 (.course-item-wrapper) 和全部课程 (.courseInfo)
        var cards = (doc || document).querySelectorAll('.course-item-wrapper, .courseInfo');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var titleEl = card.querySelector('.course-title');
            var name = titleEl ? titleEl.textContent.trim() : '';
            var courseId = null;

            // 尝试从 Vue 实例多路径提取 course_id
            try {
                var vm = card.__vue__;
                if (vm) {
                    // 直接属性
                    courseId = tryExtractId(vm);
                    // $data
                    if (!courseId && vm.$data) courseId = tryExtractId(vm.$data);
                    // $props
                    if (!courseId && vm.$props) {
                        var propKeys = Object.keys(vm.$props);
                        for (var pk = 0; pk < propKeys.length && !courseId; pk++) {
                            var pv = vm.$props[propKeys[pk]];
                            if (pv && typeof pv === 'object') courseId = tryExtractId(pv);
                            if (typeof pv === 'number') courseId = pv;
                        }
                    }
                    // $parent
                    if (!courseId && vm.$parent) {
                        var pId = tryExtractId(vm.$parent);
                        if (pId) courseId = pId;
                        // $parent.$props 或 $parent 上的列表
                        if (!courseId && vm.$parent.$props) {
                            var ppKeys = Object.keys(vm.$parent.$props);
                            for (var ppk = 0; ppk < ppKeys.length && !courseId; ppk++) {
                                var ppv = vm.$parent.$props[ppKeys[ppk]];
                                if (Array.isArray(ppv) && ppv[i] && typeof ppv[i] === 'object') {
                                    courseId = tryExtractId(ppv[i]);
                                }
                            }
                        }
                    }
                }
                // Vue 3 fallback
                if (!courseId && card._vnode && card._vnode.component) {
                    courseId = tryExtractId(card._vnode.component);
                }
            } catch(e) {}

            if (name) courses.push({ name: name, course_id: courseId });
        }
        return courses;
    }

    function tryExtractId(obj) {
        if (!obj || typeof obj !== 'object') return null;
        // 优先找 course_id
        if (obj.course_id) return obj.course_id;
        if (obj.courseId) return obj.courseId;
        // 找嵌套 item/row/course
        var wrappers = ['item', 'row', 'course', 'data', 'info', 'courseInfo', 'courseData', 'origin'];
        for (var w = 0; w < wrappers.length; w++) {
            var wrap = obj[wrappers[w]];
            if (wrap && typeof wrap === 'object') {
                if (wrap.course_id) return wrap.course_id;
                if (wrap.courseId) return wrap.courseId;
                if (wrap.id) return wrap.id;
            }
        }
        // Vue $props 所有属性
        if (obj.$props) {
            var pKeys = Object.keys(obj.$props);
            for (var pk = 0; pk < pKeys.length; pk++) {
                var pv = obj.$props[pKeys[pk]];
                if (pv && typeof pv === 'object' && (pv.course_id || pv.courseId)) return pv.course_id || pv.courseId;
                if (typeof pv === 'number' && pv > 1000) return pv;  // 可能的 course_id
            }
        }
        // Vue _props (Vue 2 internal)
        if (obj._props) {
            var ppKeys = Object.keys(obj._props);
            for (var ppk = 0; ppk < ppKeys.length; ppk++) {
                var ppv = obj._props[ppKeys[ppk]];
                if (ppv && typeof ppv === 'object' && (ppv.course_id || ppv.courseId)) return ppv.course_id || ppv.courseId;
                if (typeof ppv === 'number' && ppv > 1000) return ppv;
            }
        }
        // 遍历所有可枚举属性（暴力但有效）
        try {
            var ownKeys = Object.keys(obj);
            for (var ok = 0; ok < ownKeys.length; ok++) {
                var ov = obj[ownKeys[ok]];
                if (typeof ov === 'number' && ov > 1000 && ownKeys[ok].toLowerCase().indexOf('id') !== -1) return ov;
                if (ov && typeof ov === 'object' && ov.course_id) return ov.course_id;
            }
        } catch(e) {}
        // 兜底：有课程名时用 id
        if ((obj.course_name || obj.courseName) && obj.id) return obj.id;
        return null;
    }

    // ========== 策略2: 查找所有文档中的课程卡片（含 iframe） ==========
    function findAllCards() {
        // 扫描主文档和所有 iframe
        var docs = [document];
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            try {
                var d = iframes[i].contentDocument || iframes[i].contentWindow.document;
                if (d) docs.push(d);
            } catch(e) {}
        }
        var allCourses = [];
        for (var j = 0; j < docs.length; j++) {
            var courses = extractFromCards(docs[j]);
            for (var k = 0; k < courses.length; k++) { allCourses.push(courses[k]); }
        }
        return allCourses;
    }

    // 从 API 响应对象中递归提取课程数据
    function extractCoursesFromObject(obj) {
        var courses = [];
        var seen = {};
        var visited = new WeakSet ? new WeakSet() : { _fake: true };

        function add(name, id) {
            if (!name || name.length < 2) return;
            var key = name + '|' + (id || '');
            if (!seen[key]) { seen[key] = true; courses.push({ name: name, course_id: id }); }
        }

        function extractId(item) {
            // 暴力查找：尝试所有可能的 ID 字段名
            var idFields = ['course_id', 'courseId', 'id', 'cid', 'class_id', 'classId',
                'source_id', 'sourceId', 'resource_id', 'lesson_id', 'origin_id',
                'plan_id', 'training_id', 'tc_course_id', 'tronclass_id'];
            for (var f = 0; f < idFields.length; f++) {
                var v = item[idFields[f]];
                if (v !== undefined && v !== null && v !== '' && v !== 0 && typeof v !== 'object') {
                    return v;
                }
            }
            // 如果没有任何 ID 字段，看看有没有嵌套的 courseInfo/course/info 对象
            var wrappers = ['courseInfo', 'course', 'info', 'basicInfo', 'detail'];
            for (var w = 0; w < wrappers.length; w++) {
                var wrap = item[wrappers[w]];
                if (wrap && typeof wrap === 'object') {
                    for (var f2 = 0; f2 < idFields.length; f2++) {
                        var v2 = wrap[idFields[f2]];
                        if (v2 !== undefined && v2 !== null && v2 !== '' && v2 !== 0 && typeof v2 !== 'object') {
                            return v2;
                        }
                    }
                }
            }
            return null;
        }

        function extractName(item) {
            var nameFields = ['course_name', 'courseName', 'name', 'title', 'display_name',
                'full_name', 'className', 'course_title', 'coursename'];
            for (var f = 0; f < nameFields.length; f++) {
                var v = item[nameFields[f]];
                if (v && typeof v === 'string' && v.trim().length > 1) {
                    var name = v.trim();
                    // 过滤掉明显不是课程名的：CSS类名、HTML标签、单字符等
                    if (name.indexOf('el-') === 0) continue;      // Element UI 类名
                    if (name.indexOf('_') === 0) continue;         // 内部变量
                    if (/^[a-z]+-[a-z]+/.test(name) && name.length < 20) continue; // kebab-case
                    if (/^[A-Z]/.test(name) && /[a-z]/.test(name) && name.length < 15 && name.indexOf(' ') === -1) continue; // PascalCase
                    return name;
                }
            }
            return '';
        }

        function isCourseLike(item) {
            // 必须有课程特有的字段，不能仅凭 name + id
            var courseFields = ['course_name', 'courseName', 'coursename',
                'study_time', 'studyTime', 'task_count', 'progress',
                'courseware_count', 'lesson_count', 'teacher_name', 'lecturer_name',
                'course_img', 'cover_img', 'course_status', 'sub_status',
                'course_type', 'type', 'room_name', 'learn_time'];
            for (var f = 0; f < courseFields.length; f++) {
                if (item[courseFields[f]] !== undefined && item[courseFields[f]] !== null) return true;
            }
            return false;
        }

        function walk(node, depth) {
            if (depth > 8 || !node || typeof node !== 'object') return;
            if (visited.add) {
                if (visited.has(node)) return;
                try { visited.add(node); } catch(e) { return; }
            }

            // 跳过 CONFIG 对象
            if (node === window.CONFIG) return;

            if (Array.isArray(node) && node.length > 0 && node.length < 500) {
                var first = node[0];
                if (first && typeof first === 'object' && isCourseLike(first)) {
                    for (var i = 0; i < node.length; i++) {
                        if (node[i] && typeof node[i] === 'object' && isCourseLike(node[i])) {
                            add(extractName(node[i]), extractId(node[i]));
                        }
                    }
                    return;
                }
            }

            var keys = Object.keys(node);
            for (var k = 0; k < keys.length; k++) {
                try {
                    var child = node[keys[k]];
                    // 跳过非课程相关的对象
                    if (child === window.CONFIG) continue;
                    if (child && typeof child === 'object') walk(child, depth + 1);
                } catch(e) {}
            }
        }

        walk(obj, 0);
        return courses;
    }

    // ========== 策略3: API（正确端点 + 分页翻页） ==========
    // v3.1：直接用教育门户的真实课程接口 account-profile/course，
    //       该接口分页字段为 page / per-page / total（注意是连字符 per-page）。
    //       循环翻页拉取全部课程（默认每页仅 10 条，需翻到 total 为止）。
    function tryApi(callback) {
        var API = 'https://education.wqxt.cdut.edu.cn/personal/courseapi/vlabpassportapi/v1/account-profile/course';
        var allCourses = [];
        var page = 1;
        var perPage = 100;   // 一次拉 100 条，通常一页就够

        // 直接解析 account-profile/course 的返回结构（字段为大写 Id/Title/Teacher）
        function parseCourseData(data) {
            var result = (data && data.params && data.params.result) || {};
            var list = result.data || [];
            var total = result.total;
            var out = [];
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                var id = c.Id !== undefined ? c.Id : c.id;
                var title = c.Title || c.title || c.Name || '';
                var teacher = c.Teacher || c.teacher || '';
                if (id && title) {
                    out.push({
                        name: title + (teacher ? ' — ' + teacher : ''),
                        course_id: id,
                        title: title,
                        teacher: teacher
                    });
                }
            }
            return { courses: out, total: total };
        }

        function fetchPage(p) {
            var url = API + '?page=' + p + '&per-page=' + perPage;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.withCredentials = true;
            xhr.timeout = 8000;
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        window.__wqt_raw_response = data;
                        var parsed = parseCourseData(data);
                        allCourses = allCourses.concat(parsed.courses);
                        var total = parsed.total;

                        // 判断是否还需翻页
                        var fetchedCount = p * perPage;
                        if (total && fetchedCount < total) {
                            fetchPage(p + 1);
                        } else {
                            callback(allCourses);
                        }
                        return;
                    } catch(e) { console.log('[WQT] API parse error:', e); }
                }
                // 失败回退：尝试通用递归提取
                fallbackRecursive(p);
            };
            xhr.onerror = function() { fallbackRecursive(p); };
            xhr.ontimeout = function() { fallbackRecursive(p); };
            xhr.send();
        }

        function fallbackRecursive(p) {
            // 兜底：用旧的递归提取 + 尝试翻页
            var url = API + '?page=' + p + '&per-page=' + perPage;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.withCredentials = true;
            xhr.timeout = 6000;
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        var courses = extractCoursesFromObject(data);
                        if (courses.length > 0) {
                            allCourses = allCourses.concat(courses);
                        }
                    } catch(e) {}
                }
                callback(allCourses);
            };
            xhr.onerror = function() { callback(allCourses); };
            xhr.ontimeout = function() { callback(allCourses); };
            xhr.send();
        }

        fetchPage(page);
    }

    // ========== 构建 UI ==========
    function buildHtml(courses) {
        var tenant = '21';
        var rows = '';
        for (var i = 0; i < courses.length; i++) {
            var c = courses[i];
            var idDisplay = c.course_id ? ('ID:' + c.course_id) : '未能获取ID';
            var href = c.course_id
                ? 'https://classroom.wqxt.cdut.edu.cn/coursedetail?course_id=' + c.course_id + '&tenant_code=' + tenant
                : '#';
            var btnStyle = c.course_id
                ? 'padding:5px 16px;cursor:pointer;color:#fff;background:#1890ff;border:none;border-radius:4px;font-size:13px;white-space:nowrap;'
                : 'padding:5px 16px;color:#bbb;background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;white-space:nowrap;';
            rows +=
                '<div style="display:flex;align-items:center;padding:9px 12px;border-bottom:1px solid #f5f5f5;gap:12px;">' +
                '<span style="flex:1;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(c.name) + '</span>' +
                '<span style="font-size:11px;color:' + (c.course_id ? '#999' : '#ff7875') + ';white-space:nowrap;">' + idDisplay + '</span>' +
                (c.course_id
                    ? '<a href="' + href + '" target="_blank" style="' + btnStyle + '">进入课程</a>'
                    : '<button disabled style="' + btnStyle + '">缺ID</button>') +
                '</div>';
        }
        return rows || '<div style="text-align:center;padding:30px;color:#999;">未找到课程</div>';
    }

    function showCourses(courses) {
        allCourses = courses;
        var hasId = courses.filter(function(c) { return !!c.course_id; }).length;

        content.innerHTML =
            '<div style="font-weight:bold;margin-bottom:8px;">📚 共 ' + courses.length + ' 门课程</div>' +
            '<div style="margin-bottom:10px;">' +
            '  <input id="wqt-mc-search" type="text" placeholder="搜索课程名称 / 教师 / ID..." ' +
            '    style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #d9d9d9;' +
            '    border-radius:6px;font-size:13px;outline:none;transition:border-color 0.2s;" />' +
            '</div>' +
            '<div id="wqt-mc-list" style="max-height:420px;overflow-y:auto;">' + buildHtml(courses) + '</div>';

        footer.innerHTML =
            '<span style="flex:1;font-size:13px;color:#999;">有效: ' + hasId + '/' + courses.length + '</span>' +
            '<button onclick="document.getElementById(\'wqt-mc-close\').click()" style="padding:6px 16px;cursor:pointer;color:#666;background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>';

        
        var searchInput = document.getElementById('wqt-mc-search');
        var listBox = document.getElementById('wqt-mc-list');
        if (searchInput) {
            searchInput.addEventListener('focus', function() {
                searchInput.style.borderColor = '#1890ff';
                searchInput.style.boxShadow = '0 0 0 2px rgba(24,144,255,0.2)';
            });
            searchInput.addEventListener('blur', function() {
                searchInput.style.borderColor = '#d9d9d9';
                searchInput.style.boxShadow = 'none';
            });
            searchInput.addEventListener('input', function() {
                var kw = searchInput.value.trim().toLowerCase();
                var filtered = allCourses.filter(function(c) {
                    if (!kw) return true;
                    var name = (c.name || '').toLowerCase();
                    var title = (c.title || '').toLowerCase();
                    var teacher = (c.teacher || '').toLowerCase();
                    var id = String(c.course_id || '');
                    return name.indexOf(kw) !== -1 ||
                           title.indexOf(kw) !== -1 ||
                           teacher.indexOf(kw) !== -1 ||
                           id.indexOf(kw) !== -1;
                });
                listBox.innerHTML = buildHtml(filtered);
            });
            
            searchInput.focus();
        }
    }

    
    
    
    
    function main() {
        content.innerHTML = '<div style="text-align:center;padding:30px;color:#1890ff;">⏳ 正在加载课程...</div>';
        footer.innerHTML = '';

        
        setTimeout(function() {
            
            content.innerHTML = '<div style="text-align:center;padding:30px;color:#faad14;">⏳ 正在获取课程...</div>';
            tryApi(function(apiCourses) {
                if (apiCourses.length > 0) {
                    showCourses(apiCourses);
                    return;
                }

                
                content.innerHTML = '<div style="text-align:center;padding:30px;color:#1890ff;">⏳ 正在读取课程...</div>';
                var domCourses = findAllCards();
                if (domCourses.length > 0) {
                    showCourses(domCourses);
                    return;
                }
                    var eduLink = 'https://education.wqxt.cdut.edu.cn/?tenant_code=21';
                    content.innerHTML =
                        '<div style="text-align:center;padding:30px 20px;color:#666;">' +
                        '<div style="font-size:40px;margin-bottom:12px;">📋</div>' +
                        '<p style="font-size:15px;margin-bottom:16px;">当前页面未找到课程数据</p>' +
                        '<p style="font-size:13px;color:#999;margin-bottom:20px;">' +
                        '首页不直接显示课程列表</p>' +
                        '<a href="' + eduLink + '" target="_blank" style="display:block;margin:8px auto;padding:10px 20px;' +
                        'background:#1890ff;color:#fff;text-decoration:none;border-radius:6px;width:200px;">' +
                        '📚 进入我的学习</a></div>';
                footer.innerHTML =
                    '<button onclick="document.getElementById(\'wqt-mc-close\').click()" ' +
                    'style="padding:6px 16px;cursor:pointer;color:#666;background:#f5f5f5;border:1px solid #d9d9d9;border-radius:4px;">关闭</button>';
            });
        }, 1000);
    }

    
    window.__wqt_inspect = function() {
        var card = document.querySelector('.course-item-wrapper');
        if (!card) { console.log('未找到 .course-item-wrapper'); return; }
        var vm = card.__vue__;
        if (!vm) { console.log('card 上没有 __vue__'); return; }
        console.log('=== card.__vue__ 所有属性 ===');
        var keys = [];
        for (var k in vm) {
            try {
                var v = vm[k];
                var t = typeof v;
                if (t === 'object' && v !== null) keys.push(k + ': ' + t + ' {' + Object.keys(v).slice(0, 5).join(',') + '...}');
                else keys.push(k + ': ' + t + ' = ' + String(v).substring(0, 80));
            } catch(e) { keys.push(k + ': <error>'); }
        }
        console.log(keys.join('\n'));
        if (vm.$props) { console.log('$props keys:', Object.keys(vm.$props)); console.log('$props:', vm.$props); }
        if (vm.$data) { console.log('$data keys:', Object.keys(vm.$data)); }
        if (vm._props) { console.log('_props keys:', Object.keys(vm._props)); console.log('_props:', vm._props); }
        if (vm.$options && vm.$options.propsData) { console.log('propsData:', vm.$options.propsData); }
        console.log('=== raw response ===');
        console.log(window.__wqt_raw_response);
    };

    main();
})();
