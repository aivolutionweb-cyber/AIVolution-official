/* tee.js — widget shell: lazy boot, drag/inertia, overlay, adapt, fallback. */
(() => {
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FROZEN = params.get("spin") === "0"; // deterministic screenshots

  const widget = $("tee-widget"), stage = widget.querySelector(".tee-stage"),
    canvas = $("tee-canvas"), hint = $("tee-hint"), grip = $("tee-grip"),
    sideTag = $("tee-side-tag"), fallback = $("tee-fallback"),
    overlay = $("tee-overlay"), mount = $("tee-viewer-mount");

  if (params.get("hint") === "0") widget.classList.add("hinted");

  const S = {
    yaw: -0.55, pitch: 0.04, vel: 0, dragging: false,
    lastTouch: 0, interacted: false, lastInteract: 0,
    expanded: false, booted: false, ctl: null,
    camZ: 1.85, pinchD: 0, pointers: new Map(),
  };

  const norm = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const nearest = (a, t) => t + Math.round((a - t) / (Math.PI * 2)) * Math.PI * 2;
  let tween = null; // {from,to,t0,dur,prop}
  const tweenTo = (prop, target, dur = 650) => {
    tween = { prop, from: prop === "yaw" ? S.yaw : S.pitch, to: target, t0: performance.now(), dur };
  };

  function paintSide() {
    const n = Math.abs(norm(S.yaw));
    sideTag.textContent = n < 0.9 ? "FRONT" : n > 2.24 ? "BACK" : "¾ SIDE";
  }

  function poke() {
    S.lastInteract = performance.now();
    if (!S.interacted) { S.interacted = true; widget.classList.add("hinted"); }
  }

  /* ---------- boot (lazy) ---------- */
  async function boot() {
    if (S.booted) return;
    S.booted = true;
    try {
      if (!window.WebGLRenderingContext) throw new Error("no-webgl");
      const { createTeeScene } = await import("./tee-scene.js");
      S.ctl = await createTeeScene(canvas);
      const test = S.ctl.renderer.getContext();
      if (!test || test.isContextLost()) throw new Error("ctx-lost");
      widget.dataset.state = "ready";
      fit();
      applyViewParam();
      requestAnimationFrame(loop);
    } catch (e) {
      console.error("Tee boot error:", e);
      widget.dataset.state = "fallback";
      canvas.hidden = true;
      fallback.hidden = false;
    }
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { io.disconnect(); boot(); }
    }, { rootMargin: "800px" });
    io.observe(widget);
  }
  setTimeout(boot, 2500); // idle backstop

  /* ---------- sizing ---------- */
  function fit() {
    if (!S.ctl) return;
    const host = S.expanded ? mount : stage;
    const r = host.getBoundingClientRect();
    S.ctl.renderer.setSize(Math.max(2, r.width), Math.max(2, r.height), false);
    S.ctl.camera.aspect = r.width / Math.max(1, r.height);
    S.ctl.camera.updateProjectionMatrix();
  }
  new ResizeObserver(() => fit()).observe(stage);
  new ResizeObserver(() => { if (S.expanded) fit(); }).observe(mount);
  addEventListener("resize", fit);

  /* ---------- render loop ---------- */
  let last = performance.now(), visible = true, suspended = false;
  document.addEventListener("visibilitychange", () => { suspended = document.hidden; });
  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
  }).observe(S.expanded ? mount : stage);

  function loop(now) {
    requestAnimationFrame(loop);
    if (suspended || !S.ctl) return;
    const host = S.expanded ? mount : stage;
    const r = host.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (tween) {
      const k = Math.min(1, (now - tween.t0) / tween.dur);
      const e = 1 - Math.pow(1 - k, 3);
      const v = tween.from + (tween.to - tween.from) * e;
      if (tween.prop === "yaw") S.yaw = v; else S.pitch = v;
      if (k >= 1) tween = null;
    } else if (!S.dragging && !FROZEN && !REDUCED) {
      if (Math.abs(S.vel) > 0.0004) {           // inertia, exponential damping
        S.yaw += S.vel * dt;
        S.vel *= Math.exp(-dt * 2.2);
      } else if (now - S.lastInteract > 4000) { // idle drift
        S.yaw += dt * 0.12;
      }
    }
    S.pitch += (THREE_CLAMP(S.pitch) - S.pitch) * Math.min(1, dt * 8);
    if (S.ctl.updateCloth && !FROZEN && !REDUCED) {
      S.ctl.updateCloth(now / 1000, S.dragging ? 0.2 : 1.0, dt);
    }
    S.ctl.shirt.rotation.y = S.yaw;
    S.ctl.shirt.rotation.x = S.pitch + (S.ctl.springState ? S.ctl.springState.pitch : 0);
    S.ctl.camera.position.z += (S.camZ - S.ctl.camera.position.z) * Math.min(1, dt * 6);
    paintSide();
    S.ctl.renderer.render(S.ctl.scene, S.ctl.camera);
  }
  const THREE_CLAMP = (p) => Math.max(-0.25, Math.min(0.25, p));

  /* ---------- pointer interaction (playful spring pull + 360 spin) ---------- */
  canvas.addEventListener("pointerdown", (e) => {
    if (!S.ctl) return;
    canvas.setPointerCapture(e.pointerId);
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (S.pointers.size === 1) {
      S.dragging = true; S.vel = 0; tween = null; S.lastX = e.clientX; S.lastY = e.clientY; S.lastT = performance.now();
      
      // Hit-test on 3D shirt for playful elastic cloth pull
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (S.ctl.tryGrabCloth && S.ctl.tryGrabCloth(ndcX, ndcY)) {
        S.grabMode = "cloth";
        S.grabStartX = e.clientX;
        S.grabStartY = e.clientY;
      } else {
        S.grabMode = "spin";
      }
      poke();
    } else if (S.pointers.size === 2 && S.expanded) {
      const [a, b] = [...S.pointers.values()];
      S.pinchD = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!S.pointers.has(e.pointerId)) return;
    const prev = S.pointers.get(e.pointerId);
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!S.dragging) return;
    if (S.pointers.size === 2 && S.expanded) {
      const [a, b] = [...S.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (S.pinchD > 0) S.camZ = Math.max(1.15, Math.min(2.5, S.camZ - (d - S.pinchD) * 0.005));
      S.pinchD = d;
      return;
    }
    const now = performance.now();
    const dx = e.clientX - S.lastX, dy = e.clientY - S.lastY, dt = Math.max(8, now - S.lastT);
    const host = S.expanded ? mount : stage;
    const k = (S.expanded ? 320 : 208) / host.getBoundingClientRect().width;

    if (S.grabMode === "cloth" && S.ctl.pullCloth) {
      const pullDx = e.clientX - S.grabStartX;
      const pullDy = e.clientY - S.grabStartY;
      S.ctl.pullCloth(pullDx, pullDy);
      // Subtle yaw nudge when pulling horizontally
      S.yaw += (dx / 320) * k * 0.4;
    } else {
      S.yaw += (dx / 220) * k;
      S.pitch = THREE_CLAMP(S.pitch + (dy / 300) * k);
      S.vel = 0.7 * S.vel + 0.3 * ((dx / 220) * k) / (dt / 1000);
      S.vel = Math.max(-9, Math.min(9, S.vel));
    }

    S.lastX = e.clientX; S.lastY = e.clientY; S.lastT = now;
    poke();
  });
  const endPointer = (e) => {
    S.pointers.delete(e.pointerId);
    if (S.pointers.size === 0) {
      S.dragging = false;
      if (S.grabMode === "cloth" && S.ctl.releaseCloth) {
        S.ctl.releaseCloth();
      }
      S.grabMode = null;
      if (REDUCED || FROZEN) S.vel = 0;
      else if (Math.abs(S.vel) < 0.4) S.vel = 0; // tiny releases settle, real flicks spin
      poke();
    }
  };
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("wheel", (e) => {
    if (!S.expanded || !S.ctl) return;
    e.preventDefault();
    S.camZ = Math.max(1.15, Math.min(2.5, S.camZ + e.deltaY * 0.0015));
  }, { passive: false });

  /* ---------- keyboard ---------- */
  const goFront = () => { tween = null; tweenTo("yaw", nearest(S.yaw, 0)); poke(); };
  const goBack = () => { tween = null; tweenTo("yaw", nearest(S.yaw, Math.PI)); poke(); };
  canvas.addEventListener("keydown", (e) => {
    if (!S.ctl) return;
    if (e.key === "ArrowLeft") { S.yaw -= 0.3; poke(); e.preventDefault(); }
    else if (e.key === "ArrowRight") { S.yaw += 0.3; poke(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { S.pitch = THREE_CLAMP(S.pitch - 0.08); poke(); e.preventDefault(); }
    else if (e.key === "ArrowDown") { S.pitch = THREE_CLAMP(S.pitch + 0.08); poke(); e.preventDefault(); }
    else if (e.key === "f" || e.key === "F") goFront();
    else if (e.key === "b" || e.key === "B") goBack();
    else if (e.key === "r" || e.key === "R") doReset();
    else if (e.key === "e" || e.key === "E") openOverlay();
  });
  const doReset = () => { tween = null; tweenTo("yaw", nearest(S.yaw, 0)); tweenTo("pitch", 0.04); S.vel = 0; S.camZ = S.expanded ? 1.45 : 1.85; poke(); };

  /* ---------- buttons ---------- */
  $("tee-front").onclick = goFront;
  $("tee-back").onclick = goBack;
  $("tee-reset").onclick = doReset;
  $("tee-expand").onclick = () => openOverlay();
  $("tee-v-front").onclick = goFront;
  $("tee-v-back").onclick = goBack;
  $("tee-v-side").onclick = () => { tween = null; tweenTo("yaw", nearest(S.yaw, 0) + 0.75); poke(); };
  $("tee-v-reset").onclick = doReset;
  $("tee-close").onclick = () => closeOverlay();
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && S.expanded) closeOverlay(); });

  /* ---------- overlay (moves the SAME canvas, one GL context) ---------- */
  let lastFocus = null;
  function openOverlay() {
    if (!S.ctl) { // fallback path: static art in viewer
      mount.innerHTML = '<div class="tee-fallback" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px"><img src="./assets/front-chest-logo.png" alt="Front print" style="width:100%;background:#161318;border-radius:10px"><img src="./assets/back-art-isolated.png" alt="Back print" style="width:100%;background:#161318;border-radius:10px"></div>';
    } else {
      mount.appendChild(canvas);
      S.expanded = true; S.camZ = 1.45; S.vel = 0;
      fit();
    }
    S.expanded = S.expanded || true;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    $("tee-close").focus();
    poke();
  }
  function closeOverlay() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (S.ctl && canvas.parentElement === mount) stage.prepend(canvas);
    S.expanded = false; S.camZ = 1.85;
    fit();
    if (lastFocus) lastFocus.focus();
  }
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeOverlay(); });

  /* ---------- reposition via distinct grip handle ---------- */
  grip.addEventListener("pointerdown", (e) => {
    e.stopPropagation(); e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY;
    const r = widget.getBoundingClientRect();
    const ox = innerWidth - r.right, oy = innerHeight - r.bottom;
    widget.style.left = "auto"; widget.style.top = "auto";
    const move = (ev) => {
      // anchor by pointer deltas from grab point, clamped to safe viewport bounds
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      widget.style.right = Math.max(8, Math.min(innerWidth - r.width - 8, ox - dx)) + "px";
      widget.style.bottom = Math.max(8, Math.min(innerHeight - r.height - 8, oy - dy)) + "px";
    };
    const up = () => {
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", up);
      poke();
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
  });

  /* ---------- light/dark adaptation ---------- */
  const themed = [...document.querySelectorAll("[data-theme]")];
  let themeTick = false;
  function adapt() {
    themeTick = false;
    const r = widget.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (const el of themed) {
      const b = el.getBoundingClientRect();
      if (cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom) {
        widget.dataset.theme = el.dataset.theme;
        return;
      }
    }
  }
  addEventListener("scroll", () => { if (!themeTick) { themeTick = true; requestAnimationFrame(adapt); } }, { passive: true });
  addEventListener("resize", adapt);
  setTimeout(adapt, 600);

  /* ---------- URL views (verification) ---------- */
  function applyViewParam() {
    const at = params.get("at");
    if (at === "light" || at === "deep") {
      const el = document.querySelector(at === "light" ? ".harness-light" : ".harness-deep");
      if (el) el.scrollIntoView({ block: "center" });
    }
    const v = params.get("view");
    if (v === "back") { S.yaw = Math.PI - 0.0; }
    else if (v === "side") { S.yaw = 0.75; }
    else if (v === "side90") { S.yaw = Math.PI / 2; }
    else if (v === "back34") { S.yaw = Math.PI - 0.75; }
    else if (v === "front") { S.yaw = 0; }
    if (FROZEN) { S.vel = 0; S.lastInteract = performance.now(); }
    if (v === "expanded") setTimeout(openOverlay, 900);
    paintSide();
  }
})();
