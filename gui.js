(function() {
  if (document.getElementById('__custom_gui_root__')) return;

  // Global variables & tools registry
  window.__spoofFocus = window.__spoofFocus === true;
  window.__spoofFs = window.__spoofFs === true;
  window.__spoofRClick = window.__spoofRClick === true;
  window.__btAdSkipEnabled = window.__btAdSkipEnabled !== false;

  const host = document.createElement('div');
  host.id = '__custom_gui_root__';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      --bg: #18181b; --surface: #27272a; --border: #3f3f46;
      --text: #f4f4f5; --text-muted: #a1a1aa; --primary: #3b82f6;
      --danger: #ef4444; --success: #22c55e;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px; color: var(--text); z-index: 2147483647; position: fixed;
    }
    :host([data-theme="light"]) {
      --bg: #ffffff; --surface: #f4f4f5; --border: #e4e4e7;
      --text: #18181b; --text-muted: #71717a;
    }
    .window {
      position: fixed; top: 80px; left: 80px; width: 440px; height: 520px;
      min-width: 320px; min-height: 260px; background: var(--bg);
      border: 1px solid var(--border); border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); display: flex;
      flex-direction: column; overflow: hidden; user-select: none;
    }
    .titlebar {
      height: 44px; background: var(--surface); border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 10px; cursor: grab;
    }
    .icon-btn {
      width: 30px; height: 30px; border-radius: 6px; border: none;
      background: transparent; color: var(--text); cursor: pointer;
    }
    .icon-btn:hover { background: var(--border); }
    .content-area { flex: 1; position: relative; overflow: hidden; display: flex; }
    .drawer {
      position: absolute; top: 0; left: 0; bottom: 0; width: 170px;
      background: var(--surface); border-right: 1px solid var(--border);
      transform: translateX(-100%); transition: transform 0.25s ease;
      display: flex; flex-direction: column; padding: 8px 0; z-index: 10;
      overflow-y: auto;
    }
    .drawer.open { transform: translateX(0); }
    .nav-item {
      padding: 9px 14px; background: none; border: none; color: var(--text);
      text-align: left; cursor: pointer; font-size: 13px;
    }
    .nav-item:hover { background: var(--border); }
    .nav-item.active { background: var(--primary); color: #fff; font-weight: bold; }
    .page-container { flex: 1; padding: 16px; overflow-y: auto; }
    .page { display: none; }
    .page.active { display: block; }
    .tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .tool-btn {
      padding: 10px; background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); cursor: pointer; font-weight: 500;
      text-align: center; transition: border-color 0.15s;
    }
    .tool-btn:hover { border-color: var(--primary); }
    .resizer {
      position: absolute; bottom: 0; right: 0; width: 16px; height: 16px;
      cursor: nwse-resize; display: flex; align-items: flex-end; justify-content: flex-end;
      padding: 2px;
    }
    .resizer::before, .resizer::after {
      content: ""; position: absolute; background: var(--text-muted);
    }
    .resizer::before { width: 10px; height: 1.5px; right: 0; bottom: 0; transform: rotate(-45deg); transform-origin: bottom right; }
    .resizer::after { width: 5px; height: 1.5px; right: 0; bottom: 4px; transform: rotate(-45deg); transform-origin: bottom right; }
    .modal {
      position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: none;
      align-items: center; justify-content: center; z-index: 20;
    }
    .modal.open { display: flex; }
    .modal-box {
      background: var(--surface); border: 1px solid var(--border);
      padding: 16px; border-radius: 8px; text-align: center; width: 260px;
    }
    .modal-btns { display: flex; gap: 6px; justify-content: center; margin-top: 12px; }
    .btn { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-danger { background: var(--danger); color: #fff; }
    .btn-secondary { background: var(--border); color: var(--text); }
  `;
  shadow.appendChild(style);

  const win = document.createElement('div');
  win.className = 'window';
  win.innerHTML = `
    <div class="titlebar" id="tb">
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="icon-btn" id="menuBtn">☰</button>
        <span style="font-weight:600;font-size:13px;">TT-ZERTZ Master GUI</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button class="icon-btn" id="themeBtn">🌙</button>
        <button class="icon-btn" id="closeBtn">×</button>
      </div>
    </div>
    <div class="content-area">
      <nav class="drawer" id="drawer">
        <button class="nav-item active" data-page="p-hub">Tools Hub</button>
        <button class="nav-item" data-page="p-spoof">Spoof GUI</button>
        <button class="nav-item" data-page="p-bt">BetterTube</button>
        <button class="nav-item" data-page="p-te">TabEditor</button>
      </nav>
      <div class="page-container">
        <!-- Tools Hub Page -->
        <section class="page active" id="p-hub">
          <h3 style="margin-top:0;">Available Utilities</h3>
          <div class="tool-grid">
            <button class="tool-btn" id="run-autoclicker">🖱️ Autoclicker</button>
            <button class="tool-btn" id="run-flooder">📜 History Flooder</button>
            <button class="tool-btn" id="run-invert">🔄 Invert Page</button>
            <button class="tool-btn" id="run-spotify">🎵 Spotify Web Enhancer</button>
            <button class="tool-btn" id="run-painty">🎨 Paint On Page</button>
            <button class="tool-btn" id="run-ai">🤖 Floating Notepad</button>
            <button class="tool-btn" id="run-kbm">⌨️ KBM Visualizer</button>
            <button class="tool-btn" id="run-controller">🎮 Gamepad Status</button>
          </div>
        </section>

        <!-- Spoofs -->
        <section class="page" id="p-spoof">
          <h3 style="margin-top:0;">Spoofs</h3>
          <label style="display:block;margin-bottom:8px;"><input type="checkbox" id="chkFocus" ${window.__spoofFocus ? 'checked' : ''}> Always Active Tab</label>
          <label style="display:block;margin-bottom:8px;"><input type="checkbox" id="chkFs" ${window.__spoofFs ? 'checked' : ''}> Fullscreen Spoof</label>
          <label style="display:block;"><input type="checkbox" id="chkRClick" ${window.__spoofRClick ? 'checked' : ''}> Force Right-Click</label>
        </section>

        <!-- BetterTube -->
        <section class="page" id="p-bt">
          <h3 style="margin-top:0;">BetterTube</h3>
          <button class="btn btn-primary" id="bt-toggle-adskip" style="width:100%;">
            ⚡ Smart Ad-Skipper: ${window.__btAdSkipEnabled ? 'ON' : 'OFF'}
          </button>
        </section>

        <!-- TabEditor -->
        <section class="page" id="p-te">
          <h3 style="margin-top:0;">TabEditor</h3>
          <label style="display:block;margin-bottom:8px;"><input type="checkbox" id="te-edit"> Edit Text</label>
          <label style="display:block;"><input type="checkbox" id="te-popups"> Block Popups</label>
        </section>
      </div>
    </div>
    <div class="resizer" id="resize"></div>
    <div class="modal" id="modal">
      <div class="modal-box">
        <div><b>Save changes before closing?</b></div>
        <div class="modal-btns">
          <button class="btn btn-primary" id="mYes">YES</button>
          <button class="btn btn-danger" id="mNo">NO</button>
          <button class="btn btn-secondary" id="mCancel">CANCEL</button>
        </div>
      </div>
    </div>
  `;
  shadow.appendChild(win);

  // --- Utility Button Handlers ---
  let clickerActive = false;
  let clickInterval = null;
  let targetElem = null;

  shadow.getElementById('run-autoclicker').onclick = () => {
    if (clickerActive) {
      clearInterval(clickInterval);
      clickerActive = false;
      alert('Autoclicker stopped.');
      return;
    }
    const cps = prompt('Enter clicks per second (1-100):', '20');
    const delay = Math.max(10, Math.floor(1000 / (parseInt(cps, 10) || 20)));
    alert('Click anywhere on the webpage to target an element.');

    const setTarget = (e) => {
      e.preventDefault();
      targetElem = e.target;
      window.removeEventListener('click', setTarget, true);
      clickInterval = setInterval(() => {
        if (targetElem) {
          targetElem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          targetElem.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          targetElem.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      }, delay);
      clickerActive = true;
      alert('Autoclicker running! Click the GUI button again to stop.');
    };
    window.addEventListener('click', setTarget, true);
  };

  shadow.getElementById('run-flooder').onclick = () => {
    const count = parseInt(prompt('How many history states to push?', '50'), 10) || 50;
    for (let i = 0; i < count; i++) {
      window.history.pushState({}, '', window.location.href + '#flood_' + i);
    }
    alert(`Pushed ${count} entries to browser history.`);
  };

  shadow.getElementById('run-invert').onclick = () => {
    document.documentElement.style.filter = document.documentElement.style.filter ? '' : 'invert(1) hue-rotate(180deg)';
  };

  shadow.getElementById('run-spotify').onclick = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.playbackRate = 1.0;
      alert('Spotify audio stream connected.');
    } else {
      alert('No media elements detected on this page.');
    }
  };

  shadow.getElementById('run-painty').onclick = () => {
    if (document.getElementById('__paint_canvas__')) {
      document.getElementById('__paint_canvas__').remove();
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.id = '__paint_canvas__';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:2147483646;pointer-events:auto;cursor:crosshair;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY); };
    canvas.onmousemove = (e) => {
      if (!drawing) return;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ef4444';
      ctx.lineCap = 'round';
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };
    canvas.onmouseup = () => { drawing = false; };
  };

  shadow.getElementById('run-ai').onclick = () => {
    const note = prompt('Temporary Note:', localStorage.getItem('__quick_note__') || '');
    if (note !== null) localStorage.setItem('__quick_note__', note);
  };

  shadow.getElementById('run-kbm').onclick = () => {
    let overlay = document.getElementById('__kbm_display__');
    if (overlay) { overlay.remove(); return; }
    overlay = document.createElement('div');
    overlay.id = '__kbm_display__';
    overlay.style.cssText = 'position:fixed;bottom:20px;left:20px;background:rgba(0,0,0,0.85);color:#fff;padding:8px 14px;border-radius:8px;font-family:monospace;font-size:14px;z-index:2147483646;pointer-events:none;';
    overlay.textContent = 'Key: None';
    document.body.appendChild(overlay);

    window.addEventListener('keydown', (e) => {
      if (overlay) overlay.textContent = `Key: ${e.key} (${e.code})`;
    });
  };

  shadow.getElementById('run-controller').onclick = () => {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const connected = Array.from(pads).filter(Boolean);
    alert(connected.length ? `Connected Gamepads: ${connected.map(p => p.id).join(', ')}` : 'No controllers connected.');
  };

  // --- Spoof Page Toggles ---
  shadow.getElementById('chkFocus').onchange = (e) => {
    window.__spoofFocus = e.target.checked;
    if (window.__spoofFocus) {
      Object.defineProperty(document, 'hidden', { value: false, writable: true, configurable: true });
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
      window.onblur = null;
    }
  };

  shadow.getElementById('chkFs').onchange = (e) => {
    window.__spoofFs = e.target.checked;
    if (window.__spoofFs) {
      Object.defineProperty(document, 'fullscreenElement', { value: document.body, writable: true, configurable: true });
    }
  };

  shadow.getElementById('chkRClick').onchange = (e) => {
    window.__spoofRClick = e.target.checked;
    if (window.__spoofRClick) {
      window.addEventListener('contextmenu', (evt) => evt.stopImmediatePropagation(), true);
    }
  };

  // --- BetterTube Controls ---
  const btBtn = shadow.getElementById('bt-toggle-adskip');
  let btTimer = null;
  const runBtSkip = () => {
    if (!window.__btAdSkipEnabled) return;
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
    if (skipBtn) skipBtn.click();
    const vid = document.querySelector('video');
    if (vid && document.querySelector('.ad-showing')) {
      vid.currentTime = vid.duration || 9999;
    }
  };
  btBtn.onclick = () => {
    window.__btAdSkipEnabled = !window.__btAdSkipEnabled;
    btBtn.textContent = `⚡ Smart Ad-Skipper: ${window.__btAdSkipEnabled ? 'ON' : 'OFF'}`;
    if (window.__btAdSkipEnabled) {
      btTimer = setInterval(runBtSkip, 500);
    } else {
      clearInterval(btTimer);
    }
  };
  if (window.__btAdSkipEnabled) btTimer = setInterval(runBtSkip, 500);

  // --- TabEditor Controls ---
  shadow.getElementById('te-edit').onchange = (e) => {
    document.designMode = e.target.checked ? 'on' : 'off';
  };

  shadow.getElementById('te-popups').onchange = (e) => {
    if (e.target.checked) {
      window.open = () => null;
    }
  };

  // --- Drawer Navigation ---
  const drawer = shadow.getElementById('drawer');
  shadow.getElementById('menuBtn').onclick = () => drawer.classList.toggle('open');
  shadow.querySelectorAll('.nav-item').forEach(b => {
    b.onclick = () => {
      shadow.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
      shadow.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      b.classList.add('active');
      shadow.getElementById(b.dataset.page).classList.add('active');
      drawer.classList.remove('open');
    };
  });

  // --- Light/Dark Theme ---
  let isDark = true;
  shadow.getElementById('themeBtn').onclick = () => {
    isDark = !isDark;
    if (isDark) {
      host.removeAttribute('data-theme');
      shadow.getElementById('themeBtn').textContent = '🌙';
    } else {
      host.setAttribute('data-theme', 'light');
      shadow.getElementById('themeBtn').textContent = '☀️';
    }
  };

  // --- Modal Close & Cleanup ---
  const modal = shadow.getElementById('modal');
  shadow.getElementById('closeBtn').onclick = () => modal.classList.add('open');
  shadow.getElementById('mCancel').onclick = () => modal.classList.remove('open');

  const closeClean = () => {
    document.designMode = 'off';
    if (clickInterval) clearInterval(clickInterval);
    if (btTimer) clearInterval(btTimer);
    const overlay = document.getElementById('__kbm_display__');
    if (overlay) overlay.remove();
    const canvas = document.getElementById('__paint_canvas__');
    if (canvas) canvas.remove();
    host.remove();
  };

  shadow.getElementById('mYes').onclick = closeClean;
  shadow.getElementById('mNo').onclick = () => {
    window.__spoofFocus = false;
    window.__spoofFs = false;
    window.__spoofRClick = false;
    closeClean();
  };

  // --- Window Dragging ---
  const tb = shadow.getElementById('tb');
  let isDrag = false, dx = 0, dy = 0;
  tb.onmousedown = (e) => {
    if (e.target.closest('button')) return;
    isDrag = true;
    dx = e.clientX - win.offsetLeft;
    dy = e.clientY - win.offsetTop;
    const move = (ev) => {
      if (!isDrag) return;
      win.style.left = (ev.clientX - dx) + 'px';
      win.style.top = (ev.clientY - dy) + 'px';
    };
    const up = () => {
      isDrag = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // --- Window Resizing ---
  const resizer = shadow.getElementById('resize');
  let isResize = false, rw = 0, rh = 0, rx = 0, ry = 0;
  resizer.onmousedown = (e) => {
    e.stopPropagation();
    isResize = true;
    rw = win.offsetWidth;
    rh = win.offsetHeight;
    rx = e.clientX;
    ry = e.clientY;
    const doResize = (ev) => {
      if (!isResize) return;
      win.style.width = Math.max(320, rw + (ev.clientX - rx)) + 'px';
      win.style.height = Math.max(260, rh + (ev.clientY - ry)) + 'px';
    };
    const stopResize = () => {
      isResize = false;
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
    };
    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResize);
  };
})();
