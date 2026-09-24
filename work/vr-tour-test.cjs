// 通过本地代理验证整个漫游页最终渲染了什么（截图 + 内容检查）
const net = require('net');
const tls = require('tls');
const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');

// 用 Chrome 直接加载 vr.html，代理已开，截屏判断渲染效果
const ps = `
  $chrome="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  $out="$env:TEMP\\vr-tour-test.png";
  Remove-Item $out -Force -ErrorAction SilentlyContinue;
  & $chrome --headless=new --allow-file-access-from-files --proxy-server="socks5://127.0.0.1:10808" --window-size=390,844 --screenshot=$out --virtual-time-budget=60000 --user-data-dir="D:\\客户网站\\theatlas\\work\\pvV" "file:///D:/客户网站/theatlas/vr.html" 2>$null | Out-Null;
  (Get-Item $out -ErrorAction SilentlyContinue).Length
`;
const res = execFileSync('powershell.exe', ['-Command', ps], { encoding: 'utf8', timeout: 300000 });
console.log('screenshot bytes=', res.trim());
