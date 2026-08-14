(function() {
    
    if (document.cookie.indexOf('wqt_disclaimer_agreed=1') !== -1) return;
    if (document.getElementById('wqt-disclaimer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'wqt-disclaimer';
    overlay.style.cssText =
        'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999999;' +
        'display:flex;justify-content:center;align-items:center;font-family:"Microsoft YaHei","PingFang SC",sans-serif;';

    overlay.innerHTML =
        '<div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:480px;width:90%;box-shadow:0 8px 40px rgba(0,0,0,0.3);">' +
        '<h2 style="margin:0 0 16px;font-size:18px;color:#333;">📋 使用须知</h2>' +
        '<div style="font-size:13px;color:#666;line-height:1.8;max-height:300px;overflow-y:auto;margin-bottom:20px;">' +
        '<p>cdut-wqhelper 是一款<strong>学习辅助工具</strong>，仅供成都理工大学在校师生个人学习使用。</p>' +
        '<p>所有课件、音视频内容的著作权归原作者及成都理工大学所有。<strong>本工具仅为格式转换，不改变内容的版权状态。</strong></p>' +
        '<p><strong>使用本扩展即表示您同意：</strong></p>' +
        '<ol style="padding-left:18px;line-height:1.8;">' +
        '<li>下载的课件、笔记等内容<strong>仅限个人学习使用</strong>，不得公开发布、传播或用于商业用途</li>' +
        '<li>不得以任何形式对问渠学堂平台进行<strong>非正常访问</strong>，包括但不限于高频请求、数据抓取、干扰服务等行为</li>' +
        '<li>本工具<strong>不收集、不存储、不上传</strong>任何个人信息或使用数据</li>' +
        '<li>因违反上述条款或不当使用本工具产生的任何后果，<strong>由使用者自行承担</strong></li>' +
        '</ol>' +
        '<p style="color:#999;">本扩展基于 MIT License 开源，代码完全透明，可随时审查。</p>' +
        '</div>' +
        '<div style="display:flex;gap:12px;justify-content:flex-end;">' +
        '<button id="wqt-disagree" style="padding:8px 20px;cursor:pointer;color:#999;' +
        'background:#f5f5f5;border:1px solid #d9d9d9;border-radius:6px;font-size:14px;">不同意</button>' +
        '<button id="wqt-agree" style="padding:8px 24px;cursor:pointer;color:#fff;' +
        'background:#1890ff;border:none;border-radius:6px;font-size:14px;font-weight:bold;">同意并继续</button>' +
        '</div></div>';

    document.body.appendChild(overlay);

    document.getElementById('wqt-agree').onclick = function() {
        
        document.cookie = 'wqt_disclaimer_agreed=1; path=/; domain=.wqxt.cdut.edu.cn; max-age=' + (365 * 24 * 60 * 60);
        overlay.remove();
    };

    document.getElementById('wqt-disagree').onclick = function() {
        overlay.innerHTML =
            '<div style="background:#fff;border-radius:12px;padding:32px;max-width:400px;width:90%;text-align:center;">' +
            '<p style="font-size:16px;color:#666;margin-bottom:20px;">您需要同意使用须知才能使用此扩展。</p>' +
            '<button onclick="location.reload()" style="padding:8px 24px;cursor:pointer;color:#fff;' +
            'background:#1890ff;border:none;border-radius:6px;font-size:14px;">重新查看</button>' +
            '</div>';
    };
})();
