// mySweet.js v2.1
let currentTheme = 'dark';

const themes = {
  dark: { bg: '#1e1e1e', text: '#d4d4d4', primary: '#569CD6', danger: '#CE9178', overlay: 'rgba(0,0,0,0.7)' },
  light: { bg: '#ffffff', text: '#333', primary: '#0078D4', danger: '#D13438', overlay: 'rgba(0,0,0,0.4)' },
  game: { bg: '#2d2d2d', text: '#CE9178', primary: '#4EC9B0', danger: '#FF6B6B', overlay: 'rgba(45,0,69,0.8)' },
  danger:{ bg: '#3d1a1a', text: '#ffcccc', primary: '#D13438', danger: '#FF4444', overlay: 'rgba(0,0,0,0.7)' }
};

(function injectCSS(){
  if(document.getElementById('mysweet-style')) return;
  const css = `
.ms-overlay{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:9999;animation:msFade 0.2s;backdrop-filter:blur(0px)}
.ms-box{width:400px;max-width:90%;border-radius:12px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.5);font-family:system-ui,Segoe UI,Arial;animation:msPop 0.25s}
.ms-title{font-size:20px;font-weight:700;margin-bottom:10px}
.ms-text{font-size:15px;margin-bottom:20px;opacity:0.9;line-height:1.5}
.ms-input,.ms-select{width:100%;padding:12px;border-radius:8px;border:1px solid #555;background:transparent;color:inherit;font-size:14px;margin-bottom:20px;box-sizing:border-box;outline:none}
.ms-footer{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.ms-btn{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s}
.ms-btn:hover{transform:translateY(-2px);filter:brightness(1.1)}
.ms-toast{position:fixed;bottom:20px;right:20px;padding:16px 22px;border-radius:10px;z-index:10000;animation:msSlide 0.3s;font-weight:600;box-shadow:0 5px 20px rgba(0,0,0,0.4)}
  @keyframes msFade{from{opacity:0}to{opacity:1}}
  @keyframes msPop{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes msSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}
  `;
  const style = document.createElement('style');
  style.id = 'mysweet-style';
  style.innerHTML = css;
  document.head.appendChild(style);
})();

function applyStyle(el, styleObj) { if(styleObj) Object.assign(el.style, styleObj); }

function createBox(title, text, t, customStyle = {}) {
  const box = document.createElement('div');
  box.className = 'ms-box';
  box.style.background = t.bg;
  box.style.color = t.text;
  box.style.setProperty('--primary', t.primary);
  box.style.boxShadow = `0 10px 40px ${t.primary}40`; // colored shadow
  applyStyle(box, customStyle.box);
  box.innerHTML = `<div class="ms-title">${title}</div><div class="ms-text">${text}</div><div class="ms-footer"></div>`;
  return box;
}

function createBtn(label, color, customStyle = {}) {
  const btn = document.createElement('button');
  btn.className = 'ms-btn';
  btn.innerText = label;
  btn.style.background = color;
  btn.style.color = '#fff';
  applyStyle(btn, customStyle);
  return btn;
}

function showOverlay(content, overlayStyle) {
  const t = themes[currentTheme];
  const overlay = document.createElement('div');
  overlay.className = 'ms-overlay';
  overlay.style.background = t.overlay; // default from theme
  applyStyle(overlay, overlayStyle); // <-- override here
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  return overlay;
}

const MySweet = {
  setTheme(name){ if(themes[name]) currentTheme = name; },

  alert(title, text='', icon='info', options={}){
    return new Promise(resolve => {
      const t = themes[currentTheme];
      const box = createBox(title, text, t, options);
      const btn = createBtn('OK', t.primary, options.confirmBtn);
      btn.onclick = () => { document.body.removeChild(overlay); resolve() };
      box.querySelector('.ms-footer').appendChild(btn);
      const overlay = showOverlay(box, options.overlay); // <-- pass overlay style
      overlay.onclick = e => { if(e.target === overlay) { document.body.removeChild(overlay); resolve() } };
    });
  },

  confirm(title, text='', options={}){ /* same pattern */ 
    return new Promise(resolve => {
      const t = themes[currentTheme];
      const box = createBox(title, text, t, options);
      const cancelBtn = createBtn('Cancel', '#666', options.cancelBtn);
      const okBtn = createBtn('OK', t.primary, options.confirmBtn);
      cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(false) };
      okBtn.onclick = () => { document.body.removeChild(overlay); resolve(true) };
      box.querySelector('.ms-footer').append(cancelBtn, okBtn);
      const overlay = showOverlay(box, options.overlay);
    });
  },

  prompt(title, placeholder='', options={}){ /* same */ 
    return new Promise(resolve => {
      const t = themes[currentTheme];
      const box = createBox(title, '', t, options);
      const input = document.createElement('input');
      input.className = 'ms-input'; input.placeholder = placeholder;
      applyStyle(input, options.input);
      box.insertBefore(input, box.querySelector('.ms-footer'));
      const cancelBtn = createBtn('Cancel', '#666', options.cancelBtn);
      const okBtn = createBtn('Submit', t.primary, options.confirmBtn);
      cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(null) };
      okBtn.onclick = () => { document.body.removeChild(overlay); resolve(input.value) };
      box.querySelector('.ms-footer').append(cancelBtn, okBtn);
      const overlay = showOverlay(box, options.overlay);
      input.focus();
    });
  },

  choose(title, optionsList={}, options={}){ /* same */ 
    return new Promise(resolve => {
      const t = themes[currentTheme];
      const box = createBox(title, '', t, options);
      const select = document.createElement('select');
      select.className = 'ms-select'; 
      select.style.background = t.bg;
      applyStyle(select, options.select);
      select.innerHTML = `<option value="">Select...</option>` +
        Object.entries(optionsList).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
      box.insertBefore(select, box.querySelector('.ms-footer'));
      const cancelBtn = createBtn('Cancel', '#666', options.cancelBtn);
      const okBtn = createBtn('Choose', t.primary, options.confirmBtn);
      cancelBtn.onclick = () => { document.body.removeChild(overlay); resolve(null) };
      okBtn.onclick = () => { document.body.removeChild(overlay); resolve(select.value || null) };
      box.querySelector('.ms-footer').append(cancelBtn, okBtn);
      const overlay = showOverlay(box, options.overlay);
    });
  },

  toast(message, type='success', options={}){
    const t = themes[currentTheme];
    const toast = document.createElement('div');
    toast.className = 'ms-toast';
    toast.style.background = t.bg;
    toast.style.color = t.text;
    toast.style.borderLeft = `4px solid ${type==='success'? t.primary : t.danger}`;
    toast.innerText = message;
    applyStyle(toast, options);
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  }
}

export default MySweet;