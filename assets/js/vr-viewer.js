/* THE ATLAS 擎海 — 内置 720° 全景查看器（纯 WebGL，无外部依赖）
   - 载入 window.VR_PANO_SRC 指定的 2:1 等距柱状全景图（equirectangular）
   - 图片缺失时渲染程序化测试网格，保证交互可预览
   - 支持拖拽环视（鼠标/触摸）、滚轮缩放、惯性滑动
   - prefers-reduced-motion: reduce 时禁用惯性 */
(function () {
  "use strict";

  var canvas = document.getElementById("vr-canvas");
  if (!canvas) return;

  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  var yaw = 0, pitch = 0, fov = Math.PI / 2.4; /* ~75° */
  var velYaw = 0, velPitch = 0;
  var dragging = false, lastX = 0, lastY = 0;
  var texReady = false;
  var motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /* ---------- 非 WebGL 退化：简单 2D 平移预览 ---------- */
  function fallback2D(img) {
    var ctx = canvas.getContext("2d");
    var off = 0;
    function draw() {
      resize();
      var w = canvas.width, h = canvas.height;
      if (!w || !h || !img) return;
      var scale = h / img.height;
      var dw = img.width * scale;
      off = ((off % dw) + dw) % dw;
      for (var x = -off; x < w; x += dw) ctx.drawImage(img, x, 0, dw, h);
    }
    canvas.addEventListener("pointerdown", function (e) { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointermove", function (e) { if (dragging) { off -= (e.clientX - lastX) * 2; lastX = e.clientX; draw(); } });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    window.addEventListener("resize", draw);
    draw();
  }

  if (!gl) {
    loadImage(fallback2DWithImg);
    return;
    function fallback2DWithImg(img) { fallback2D(img || makeFallbackImage()); }
  }

  /* ---------- WebGL 着色器 ---------- */
  var VS = "attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.0,1.0);}";
  var FS = "precision mediump float;varying vec2 vUv;uniform sampler2D uTex;uniform float uYaw;uniform float uPitch;uniform float uFov;uniform float uAspect;" +
    "const float PI=3.14159265358979;" +
    "void main(){" +
    "vec2 ndc=vUv*2.0-1.0;ndc.x*=uAspect;" +
    "float f=1.0/tan(uFov*0.5);" +
    "vec3 dir=normalize(vec3(ndc.x,ndc.y,-f));" +
    "float cp=cos(uPitch),sp=sin(uPitch);" +
    "dir=vec3(dir.x,cp*dir.y-sp*dir.z,sp*dir.y+cp*dir.z);" +
    "float cy=cos(uYaw),sy=sin(uYaw);" +
    "dir=vec3(cy*dir.x+sy*dir.z,dir.y,-sy*dir.x+cy*dir.z);" +
    "float u=atan(dir.x,-dir.z)/(2.0*PI)+0.5;" +
    "float v=acos(clamp(dir.y,-1.0,1.0))/PI;" +
    "gl_FragColor=texture2D(uTex,vec2(u,v));}";

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(sh)); return null; }
    return sh;
  }

  var vs = compile(gl.VERTEX_SHADER, VS);
  var fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uYaw = gl.getUniformLocation(prog, "uYaw");
  var uPitch = gl.getUniformLocation(prog, "uPitch");
  var uFov = gl.getUniformLocation(prog, "uFov");
  var uAspect = gl.getUniformLocation(prog, "uAspect");

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  /* 程序化测试全景（正式图缺失时使用） */
  function makeFallbackImage() {
    var c = document.createElement("canvas");
    c.width = 2048; c.height = 1024;
    var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, 1024);
    g.addColorStop(0, "#0d3349");
    g.addColorStop(0.55, "#2d7193");
    g.addColorStop(0.75, "#c8e9ef");
    g.addColorStop(1, "#0d3349");
    x.fillStyle = g;
    x.fillRect(0, 0, 2048, 1024);
    x.strokeStyle = "rgba(255,255,255,0.28)";
    x.lineWidth = 2;
    for (var i = 0; i <= 24; i++) { x.beginPath(); x.moveTo(i * 2048 / 24, 0); x.lineTo(i * 2048 / 24, 1024); x.stroke(); }
    for (var j = 0; j <= 12; j++) { x.beginPath(); x.moveTo(0, j * 1024 / 12); x.lineTo(2048, j * 1024 / 12); x.stroke(); }
    x.fillStyle = "rgba(255,255,255,0.9)";
    x.font = "64px serif";
    x.textAlign = "center";
    x.fillText("720° VR", 1024, 492);
    x.font = "30px sans-serif";
    x.fillStyle = "rgba(255,255,255,0.7)";
    x.fillText("全景內容待提供 · Awaiting panorama", 1024, 552);
    return c;
  }

  function uploadTexture(img) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    texReady = true;
  }

  function loadImage(cb) {
    var src = window.VR_PANO_SRC;
    if (!src) { cb(null); return; }
    var img = new Image();
    img.onload = function () { cb(img); };
    img.onerror = function () { cb(null); };
    img.src = src;
  }

  loadImage(function (img) {
    uploadTexture(img || makeFallbackImage());
  });

  /* ---------- 交互：拖拽 + 惯性 + 滚轮缩放 ---------- */
  function onDown(x, y, id) { dragging = true; lastX = x; lastY = y; velYaw = 0; velPitch = 0; if (id !== undefined && canvas.setPointerCapture) { try { canvas.setPointerCapture(id); } catch (e) {} } }
  function onMove(x, y) {
    if (!dragging) return;
    var dx = x - lastX, dy = y - lastY;
    lastX = x; lastY = y;
    var k = fov / Math.max(canvas.clientHeight, 1);
    yaw -= dx * k;
    pitch += dy * k;
    velYaw = -dx * k; velPitch = dy * k;
    clampPitch();
  }
  function onUp() { dragging = false; }
  function clampPitch() {
    var lim = Math.PI / 2 - 0.05;
    if (pitch > lim) pitch = lim;
    if (pitch < -lim) pitch = -lim;
  }

  canvas.addEventListener("pointerdown", function (e) { onDown(e.clientX, e.clientY, e.pointerId); });
  canvas.addEventListener("pointermove", function (e) { onMove(e.clientX, e.clientY); });
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    fov *= (e.deltaY > 0) ? 1.08 : 0.92;
    var min = Math.PI / 4.5, max = Math.PI / 1.6;
    if (fov < min) fov = min;
    if (fov > max) fov = max;
  }, { passive: false });

  /* ---------- 渲染循环 ---------- */
  function frame() {
    if (!dragging && motionOK && (Math.abs(velYaw) > 1e-5 || Math.abs(velPitch) > 1e-5)) {
      yaw += velYaw; pitch += velPitch;
      velYaw *= 0.94; velPitch *= 0.94;
      clampPitch();
    }
    if (texReady) {
      var aspect = canvas.width / Math.max(canvas.height, 1);
      gl.uniform1f(uYaw, yaw);
      gl.uniform1f(uPitch, pitch);
      gl.uniform1f(uFov, fov);
      gl.uniform1f(uAspect, aspect);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
})();
