const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const password = process.env.STORYBOOK_PASSWORD;
if (!password) {
  console.error('Error: STORYBOOK_PASSWORD environment variable is required');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');

const gate = `
<style id="sb-gate-style">
  #sb-gate {
    position: fixed;
    inset: 0;
    background: #f5f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  #sb-gate .box {
    background: #fff;
    border: 1px solid #e5e9f0;
    border-radius: 12px;
    padding: 40px 36px;
    width: 360px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    text-align: center;
  }
  #sb-gate .icon { font-size: 36px; margin-bottom: 16px; }
  #sb-gate h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2328;
    margin: 0 0 6px;
  }
  #sb-gate p {
    font-size: 14px;
    color: #8f8f8f;
    margin: 0 0 24px;
    line-height: 1.5;
  }
  #sb-gate input {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 14px;
    margin-bottom: 12px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.15s;
  }
  #sb-gate input:focus { border-color: #1976d2; box-shadow: 0 0 0 3px rgba(25,118,210,0.1); }
  #sb-gate button {
    width: 100%;
    height: 40px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  #sb-gate button:hover { background: #1565c0; }
  #sb-gate button:active { background: #0d47a1; }
  #sb-gate .err {
    color: #d32f2f;
    font-size: 13px;
    margin-top: 10px;
    min-height: 18px;
  }
</style>
<div id="sb-gate">
  <div class="box">
    <div class="icon">📚</div>
    <h2>Component Library</h2>
    <p>Enter the password to access this Storybook</p>
    <input type="password" id="sb-pw" placeholder="Password" autocomplete="current-password" />
    <button id="sb-btn">Unlock</button>
    <div class="err" id="sb-err"></div>
  </div>
</div>
<script>
(function(){
  var H='${hash}';
  async function sha256(s){
    var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('');
  }
  function unlock(){document.getElementById('sb-gate').remove();document.getElementById('sb-gate-style').remove();}
  if(sessionStorage.getItem('sb_tok')===H){unlock();return;}
  async function attempt(){
    var v=document.getElementById('sb-pw').value;
    if(!v)return;
    document.getElementById('sb-btn').textContent='Checking…';
    var h=await sha256(v);
    if(h===H){sessionStorage.setItem('sb_tok',H);unlock();}
    else{document.getElementById('sb-err').textContent='Incorrect password — try again.';document.getElementById('sb-pw').value='';document.getElementById('sb-pw').focus();document.getElementById('sb-btn').textContent='Unlock';}
  }
  document.getElementById('sb-btn').addEventListener('click',attempt);
  document.getElementById('sb-pw').addEventListener('keydown',function(e){if(e.key==='Enter')attempt();});
})();
</script>`;

// Inject into both index.html and iframe.html
const targets = ['index.html', 'iframe.html'].map(f =>
  path.join(__dirname, '..', 'storybook-static', f)
);

let injected = 0;
for (const p of targets) {
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('sb-gate')) { console.log(`Already injected: ${p}`); continue; }
  // Inject right after <body> opening tag
  html = html.replace(/(<body[^>]*>)/, '$1' + gate);
  fs.writeFileSync(p, html, 'utf8');
  console.log(`✓ Password protection injected: ${path.basename(p)}`);
  injected++;
}

if (injected === 0) {
  console.error('No files were injected — check storybook-static/ exists');
  process.exit(1);
}
console.log('Done.');
