/* ค่าเริ่มต้น: ชื่อเว็บและคำโปรยแก้ได้ในหน้าแอดมิน > ตั้งค่า ส่วนการเชื่อมต่อ Supabase อยู่ใน config.js */
const DEFAULT_SETTINGS = {
  siteName: "ศูนย์รวมลิงก์สำหรับนิสิต",
  tagline: "รวมเว็บไซต์ ระบบ และช่องทางสำคัญไว้ในที่เดียว",
  about: "รวบรวมเว็บไซต์และช่องทางออนไลน์ที่สำคัญของมหาวิทยาลัย คณะ หน่วยงาน และองค์กรนิสิต",
  contact: ""
};
const CFG = window.APP_CONFIG || {};
const CONFIGURED = !!(window.supabase && CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && !/YOUR-/.test(CFG.SUPABASE_URL + CFG.SUPABASE_ANON_KEY));
const sb = CONFIGURED ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

const ICONS = {
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  menu:'<path d="M3 12h18M3 6h18M3 18h18"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram:'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  tag:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  down:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
  inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>'
};
function ic(n, s, fill) {
  s = s || 20;
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + (fill ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + "</svg>";
}

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function setHtml(sel, html) { const e = $(sel); if (e) e.innerHTML = html; }
function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
function safeUrl(u) { try { const x = new URL(String(u)); return /^https?:$/.test(x.protocol) ? x.href : "#"; } catch (e) { return "#"; } }
/* "" = ว่าง, null = ไม่ถูกต้อง, ไม่งั้นคืน URL เต็ม */
function normalizeUrl(v) {
  v = String(v || "").trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  try { const u = new URL(v); return /^https?:$/.test(u.protocol) && u.hostname.includes(".") ? u.href : null; } catch (e) { return null; }
}
function fmtDate(ts) { try { return ts ? new Date(ts).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "-"; } catch (e) { return "-"; } }
function newId() { return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
const byNew = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

const S = {
  db: true, token: "", isAdmin: false, email: "",
  ready: { sites: false, cats: false },
  sites: [], cats: [], settings: Object.assign({}, DEFAULT_SETTINGS),
  decisions: {}, allRequests: [], mine: [], favs: [],
  view: "home", params: {}, q: "", sort: "recent", searchCat: "all", homeCat: "all", adminQ: "",
  menuOpen: false, adminNav: false, lastSubmit: 0
};

/* ---------- ข้อมูลช่วย ---------- */
function cats() { return S.cats.slice().sort((a, b) => (a.order || 0) - (b.order || 0)); }
function catById(id) { return cats().find(c => c.id === id); }
function catName(id) { const c = catById(id); return c ? c.name : "ไม่มีหมวด"; }
function pub() { return S.sites.filter(s => s.visible !== false); }
function matches(s, q) {
  if (!q) return true;
  return [s.name, s.desc, s.url, catName(s.categoryId)].join(" ").toLowerCase().includes(q);
}
function pendingList() { return S.allRequests.filter(r => !S.decisions[r.id]).sort((a, b) => a.createdAt - b.createdAt); }
function errText(e) {
  const m = String((e && (e.message || e.code)) || "");
  if (/too_many|rate/i.test(m)) return "ส่งถี่เกินไป รอสักครู่แล้วลองใหม่";
  if (/row-level security|permission|42501|JWT/i.test(m)) return "ไม่มีสิทธิ์ทำรายการนี้ ลองเข้าสู่ระบบใหม่";
  if (/foreign key|23503/i.test(m)) return "ลบไม่ได้ เพราะยังมีข้อมูลที่อ้างอิงอยู่";
  return "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง";
}

/* ---------- รายการโปรด (เก็บในเบราว์เซอร์ ไม่ต้องล็อกอิน) ---------- */
function loadFavs() { try { const v = JSON.parse(localStorage.getItem("slh-favs") || "[]"); S.favs = Array.isArray(v) ? v : []; } catch (e) { S.favs = []; } }
function saveFavs() { try { localStorage.setItem("slh-favs", JSON.stringify(S.favs)); } catch (e) { /* ใช้ในหน่วยความจำต่อ */ } }
function toggleFav(id) {
  const i = S.favs.indexOf(id);
  if (i >= 0) S.favs.splice(i, 1); else S.favs.push(id);
  saveFavs();
}

/* ---------- toast / modal / confirm ---------- */
function toast(msg, kind) {
  const t = document.createElement("div");
  t.className = "toast" + (kind === "err" ? " err" : "");
  t.textContent = msg;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 3400);
}
let lastFocus = null;
function modal(html, narrow) {
  closeModal(true);
  lastFocus = document.activeElement;
  const root = $("#modal-root");
  root.innerHTML = '<div class="scrim" data-act="m-bg"><div class="dialog' + (narrow ? " narrow" : "") + '" role="dialog" aria-modal="true" aria-labelledby="m-title">' + html + "</div></div>";
  document.body.style.overflow = "hidden";
  const f = $("input:not([type=hidden]):not([type=file]),select,textarea,button", root.querySelector(".dialog"));
  if (f) f.focus();
}
function closeModal(keepFocus) {
  $("#modal-root").innerHTML = "";
  document.body.style.overflow = "";
  if (!keepFocus && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
}
function confirmDialog(o) {
  return new Promise(res => {
    modal('<h2 id="m-title">' + esc(o.title) + '</h2><p class="muted">' + esc(o.text || "") + '</p><div class="actions"><button type="button" class="btn" data-act="m-no">ยกเลิก</button><button type="button" class="btn danger solid" data-act="m-yes">' + esc(o.ok || "ยืนยัน") + "</button></div>", true);
    const root = $("#modal-root");
    const h = e => {
      const t = e.target.closest("[data-act]");
      if (!t) return;
      if (t.dataset.act === "m-yes" || t.dataset.act === "m-no" || t.dataset.act === "m-bg" && e.target === t) {
        root.removeEventListener("click", h, true);
        closeModal();
        res(t.dataset.act === "m-yes");
        e.stopPropagation();
      }
    };
    root.addEventListener("click", h, true);
  });
}

/* ---------- ส่วนประกอบ ---------- */
function logoHtml(s, small) {
  const cls = "mono-logo" + (small ? " sm" : "");
  if (s.logo && /^data:image\//.test(s.logo)) return '<span class="' + cls + '"><img src="' + esc(s.logo) + '" alt=""></span>';
  return '<span class="' + cls + '" aria-hidden="true">' + esc((s.name || "?").trim().charAt(0).toUpperCase()) + "</span>";
}
function cardHtml(s, o) {
  o = o || {};
  const fav = S.favs.includes(s.id);
  const lb = (label, url, icon, main) => url ? '<a class="lb' + (main ? " main" : "") + '" href="' + esc(safeUrl(url)) + '" target="_blank" rel="noopener noreferrer">' + ic(icon, 16) + label + "</a>" : "";
  return '<article class="card"><div class="card-top">' + logoHtml(s) +
    '<div class="card-title"><h3>' + esc(s.name) + "</h3><span>" + esc(catName(s.categoryId)) + " · " + esc(hostOf(s.url)) + "</span></div>" +
    '<button type="button" class="fav" data-act="fav" data-id="' + esc(s.id) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรด") + " " + esc(s.name) + '">' + ic("star", 20, fav) + "</button></div>" +
    '<p class="desc">' + esc(s.desc) + "</p>" +
    '<div class="card-links">' + lb("Website", s.url, "globe", true) + lb("Facebook", s.facebook, "facebook") + lb("Instagram", s.instagram, "instagram") + lb("ช่องทางอื่น", s.other, "link") + "</div>" +
    '<div class="card-foot">' +
    (o.removeFav ? '<button type="button" class="textbtn" data-act="fav" data-id="' + esc(s.id) + '">ลบออกจากรายการโปรด</button>' : "") +
    '<button type="button" class="textbtn" data-act="edit-req" data-id="' + esc(s.id) + '">แจ้งแก้ไขข้อมูล</button></div></article>';
}
function emptyHtml(icon, title, text, btn) {
  return '<div class="empty"><span class="ei">' + ic(icon, 24) + "</span><strong>" + esc(title) + "</strong>" + (text ? "<p>" + esc(text) + "</p>" : "") + (btn || "") + "</div>";
}
function gridOrEmpty(list, empty, o) {
  if (list.length) return '<div class="grid">' + list.map(s => cardHtml(s, o)).join("") + "</div>";
  return empty;
}
function sitesEmpty() {
  if (!S.db) return emptyHtml("shield", CONFIGURED ? "โหลดข้อมูลไม่สำเร็จ" : "ยังไม่ได้ตั้งค่าฐานข้อมูล", CONFIGURED ? "ตรวจสอบอินเทอร์เน็ตแล้วรีเฟรชหน้านี้" : "เปิดไฟล์ config.js แล้วใส่ค่า Supabase ตามคู่มือใน README");
  if (!S.ready.sites) return emptyHtml("globe", "กำลังโหลดรายการ…", "");
  return S.isAdmin
    ? emptyHtml("globe", "ยังไม่มีเว็บไซต์ในรายการ", "เพิ่มเว็บไซต์แรกได้จากหน้าผู้ดูแล หรือรอคำขอจากผู้ใช้", '<button type="button" class="btn primary" data-go="a-sites">ไปหน้าจัดการเว็บไซต์</button>')
    : emptyHtml("globe", "ยังไม่มีเว็บไซต์ในรายการ", "เป็นคนแรกที่เสนอเว็บไซต์เข้ามา", '<button type="button" class="btn primary" data-go="submit">เสนอเว็บไซต์</button>');
}
function chipsHtml(active, action) {
  return '<button type="button" class="chip" data-act="' + action + '" data-id="all" aria-pressed="' + (active === "all") + '">ทั้งหมด</button>' +
    cats().map(c => '<button type="button" class="chip" data-act="' + action + '" data-id="' + esc(c.id) + '" aria-pressed="' + (active === c.id) + '">' + esc(c.name) + "</button>").join("");
}
function searchBar(id, val) {
  return '<form class="searchbar" data-search="' + id + '" role="search"><span class="si">' + ic("search", 22) + '</span><input id="' + id + '" type="search" value="' + esc(val) + '" placeholder="ค้นหาเว็บไซต์ หน่วยงาน หรือหมวดหมู่..." aria-label="ค้นหา" autocomplete="off"><button type="submit" class="btn primary">ค้นหา</button></form>';
}
function setOptions(sel, html) {
  const e = $(sel); if (!e) return;
  const v = e.value; e.innerHTML = html; if (v) e.value = v;
}
const catOptionsHtml = sel => cats().map(c => '<option value="' + esc(c.id) + '"' + (c.id === sel ? " selected" : "") + ">" + esc(c.name) + "</option>").join("");

/* ---------- การนำทาง ---------- */
const ADMIN_VIEWS = ["a-dashboard", "a-sites", "a-cats", "a-featured", "a-requests", "a-settings"];
const build = {}, fill = {};
function go(view, params) {
  if (view === "admin") view = S.isAdmin ? "a-dashboard" : "admin-login";
  if (ADMIN_VIEWS.includes(view) && !S.isAdmin) view = "admin-login";
  S.view = view; S.params = params || {}; S.menuOpen = false; S.adminNav = false;
  const isA = ADMIN_VIEWS.includes(view);
  $("#public").hidden = isA;
  $("#adminwrap").hidden = !isA;
  (build[view] || build.home)();
  refresh();
  window.scrollTo(0, 0);
}
function refresh() {
  fillChrome();
  const f = fill[S.view];
  if (f) f();
}
function navKey() {
  return { home: "home", search: "home", categories: "categories", category: "categories", favorites: "favorites", submit: "submit" }[S.view] || "";
}
function fillChrome() {
  const st = S.settings;
  $$(".brand-name").forEach(e => { e.textContent = st.siteName; });
  $$("[data-nav]").forEach(b => b.setAttribute("aria-current", navKey() === b.dataset.nav ? "page" : "false"));
  const n = $("#fav-n"); n.hidden = !S.favs.length; n.textContent = S.favs.length;
  $("#mnav").hidden = !S.menuOpen;
  $("#menu-btn").setAttribute("aria-expanded", String(S.menuOpen));
  $("#menu-btn").innerHTML = ic(S.menuOpen ? "x" : "menu", 22);
  $("#side").classList.toggle("open", S.adminNav);
  $("#admin-menu-btn").setAttribute("aria-expanded", String(S.adminNav));
  $("#admin-menu-btn").innerHTML = ic(S.adminNav ? "x" : "menu", 22);
  $("#admin-btn").setAttribute("aria-label", S.isAdmin ? "ไปหน้าผู้ดูแล" : "เข้าสู่ระบบผู้ดูแล");
  const pend = pendingList().length;
  const items = [["a-dashboard", "layout", "Dashboard"], ["a-sites", "globe", "จัดการเว็บไซต์"], ["a-cats", "tag", "หมวดหมู่"], ["a-featured", "star", "ลิงก์แนะนำ"], ["a-requests", "inbox", "คำขอจากผู้ใช้"], ["a-settings", "sliders", "ตั้งค่า"]];
  $("#snav").innerHTML = items.map(i => '<button type="button" data-go="' + i[0] + '" aria-current="' + (S.view === i[0] ? "page" : "false") + '">' + ic(i[1], 20) + i[2] + (i[0] === "a-requests" && pend ? '<span class="badge">' + pend + "</span>" : "") + "</button>").join("") +
    '<hr><button type="button" data-go="home">' + ic("globe", 20) + 'ดูหน้าเว็บ</button><button type="button" data-act="logout">' + ic("logout", 20) + "ออกจากระบบ</button>";
  const year = new Date().getFullYear();
  setHtml("#footer", '<div class="container"><div class="ftr-grid"><div><div class="brand" style="cursor:default"><span class="logo">' + ic("link", 20) + '</span><span class="brand-name">' + esc(st.siteName) + '</span></div><p class="muted" style="margin-top:10px;max-width:26rem">' + esc(st.about) + '</p></div>' +
    '<div><h4>ลิงก์ที่เกี่ยวข้อง</h4><div class="flinks"><button type="button" data-go="home">หน้าแรก</button><button type="button" data-go="categories">หมวดหมู่</button><button type="button" data-go="favorites">รายการโปรด</button><button type="button" data-go="submit">เสนอเว็บไซต์</button></div></div>' +
    '<div><h4>ติดต่อผู้ดูแล</h4><p>' + (st.contact ? esc(st.contact) : '<span class="muted">เสนอเว็บไซต์หรือแจ้งแก้ไขได้ที่แบบฟอร์ม</span>') + '</p></div></div><div class="copy">© ' + year + " " + esc(st.siteName) + "</div></div>");
}

/* ---------- หน้าแรก ---------- */
build.home = () => {
  setHtml("#view", '<section class="hero"><h1 id="h-title"></h1><p id="h-sub"></p>' + searchBar("hs", "") + "</section>" +
    '<section class="sec"><div class="chips" id="home-chips" role="group" aria-label="กรองตามหมวดหมู่"></div></section>' +
    '<section class="sec" id="sec-feat"><div class="sec-head"><h2>ลิงก์แนะนำ</h2></div><div id="feat"></div></section>' +
    '<section class="sec"><div class="sec-head"><h2>เพิ่มล่าสุด</h2></div><div id="recent"></div></section>');
};
fill.home = () => {
  $("#h-title").textContent = S.settings.siteName;
  $("#h-sub").textContent = S.settings.tagline;
  setHtml("#home-chips", chipsHtml(S.homeCat, "home-cat"));
  const base = pub().filter(s => S.homeCat === "all" || s.categoryId === S.homeCat);
  const feat = base.filter(s => s.featured).sort(byNew).slice(0, 8);
  $("#sec-feat").hidden = !feat.length;
  setHtml("#feat", gridOrEmpty(feat, ""));
  const recent = base.slice().sort(byNew).slice(0, 8);
  const none = base.length === 0 && S.ready.sites && S.db && S.homeCat !== "all"
    ? emptyHtml("search", "ยังไม่มีเว็บไซต์ในหมวดนี้", "ลองเลือกหมวดอื่น") : sitesEmpty();
  setHtml("#recent", gridOrEmpty(recent, none));
};

/* ---------- ผลการค้นหา ---------- */
build.search = () => {
  setHtml("#view", '<div class="page-head"><h1>ค้นหาเว็บไซต์</h1></div>' + searchBar("sq", S.q) +
    '<div class="toolbar"><p id="s-count" class="muted" role="status"></p><label class="sortbox">เรียงตาม <select id="s-sort" class="input" style="width:auto;min-height:40px"><option value="recent">ล่าสุด</option><option value="name">ชื่อ A-Z</option></select></label></div>' +
    '<div class="chips" id="s-chips" role="group" aria-label="กรองตามหมวดหมู่" style="margin-bottom:16px"></div><div id="s-grid"></div>');
  $("#s-sort").value = S.sort;
  $("#sq").focus();
};
fill.search = () => {
  setHtml("#s-chips", chipsHtml(S.searchCat, "search-cat"));
  const q = S.q.trim().toLowerCase();
  let list = pub().filter(s => (S.searchCat === "all" || s.categoryId === S.searchCat) && matches(s, q));
  list = S.sort === "name" ? list.sort((a, b) => String(a.name).localeCompare(String(b.name), "th")) : list.sort(byNew);
  $("#s-count").textContent = "ผลการค้นหา " + list.length + " รายการ" + (q ? " สำหรับ “" + S.q.trim() + "”" : "");
  const empty = S.ready.sites && S.db
    ? emptyHtml("search", "ไม่พบเว็บไซต์ที่ค้นหา", "ลองค้นหาด้วยคำอื่น", '<button type="button" class="btn" data-act="clear-search">ล้างการค้นหา</button>')
    : sitesEmpty();
  setHtml("#s-grid", gridOrEmpty(list, empty));
};

/* ---------- หมวดหมู่ ---------- */
build.categories = () => {
  setHtml("#view", '<div class="page-head"><h1>หมวดหมู่</h1><p>เลือกหมวดเพื่อดูเว็บไซต์ทั้งหมดในหมวดนั้น</p></div><div class="grid" id="c-grid"></div>');
};
fill.categories = () => {
  const counts = {};
  pub().forEach(s => { counts[s.categoryId] = (counts[s.categoryId] || 0) + 1; });
  setHtml("#c-grid", cats().map(c => '<button type="button" class="tile" data-go="category" data-id="' + esc(c.id) + '"><h3>' + esc(c.name) + "</h3><p>" + esc(c.desc) + '</p><span class="n"><span>' + (counts[c.id] || 0) + " เว็บไซต์</span>" + ic("chev", 18) + "</span></button>").join(""));
};
build.category = () => {
  setHtml("#view", '<div class="page-head"><button type="button" class="crumb" data-go="categories">← หมวดหมู่ทั้งหมด</button><h1 id="cg-name"></h1><p id="cg-desc"></p><p class="small muted" id="cg-n" style="margin-top:6px"></p></div><div id="cg-grid"></div>');
};
fill.category = () => {
  const c = catById(S.params.id);
  if (!c) { $("#cg-name").textContent = "ไม่พบหมวดหมู่"; $("#cg-desc").textContent = "หมวดนี้อาจถูกลบไปแล้ว"; $("#cg-n").textContent = ""; setHtml("#cg-grid", ""); return; }
  const list = pub().filter(s => s.categoryId === c.id).sort(byNew);
  $("#cg-name").textContent = c.name;
  $("#cg-desc").textContent = c.desc;
  $("#cg-n").textContent = list.length + " เว็บไซต์ในหมวดนี้";
  setHtml("#cg-grid", gridOrEmpty(list, S.ready.sites ? emptyHtml("globe", "ยังไม่มีเว็บไซต์ในหมวดนี้", "เสนอเว็บไซต์เข้ามาได้ที่แบบฟอร์ม", '<button type="button" class="btn primary" data-go="submit">เสนอเว็บไซต์</button>') : sitesEmpty()));
};

/* ---------- รายการโปรด ---------- */
build.favorites = () => {
  setHtml("#view", '<div class="page-head"><h1>รายการโปรด</h1><p>เก็บไว้ในเบราว์เซอร์นี้ ไม่ต้องเข้าสู่ระบบ</p></div><div id="fv-grid"></div>');
};
fill.favorites = () => {
  const list = S.favs.map(id => pub().find(s => s.id === id)).filter(Boolean);
  const empty = S.ready.sites || !S.db
    ? emptyHtml("star", "ยังไม่มีรายการโปรด", "กดไอคอนดาวที่การ์ดเว็บไซต์เพื่อเก็บไว้ที่นี่", '<button type="button" class="btn primary" data-go="home">ไปเลือกเว็บไซต์</button>')
    : sitesEmpty();
  setHtml("#fv-grid", gridOrEmpty(list, empty, { removeFav: true }));
};

/* ---------- เสนอเว็บไซต์ / แจ้งแก้ไข ---------- */
build.submit = () => {
  setHtml("#view", '<div class="page-head"><h1>เสนอเว็บไซต์</h1><p>เพิ่มเว็บไซต์ใหม่หรือแจ้งแก้ไขข้อมูล แอดมินจะตรวจสอบก่อนแสดงบนหน้าเว็บ</p></div>' +
    '<div class="panel" style="max-width:720px"><p class="note err" id="f-lock" hidden style="margin-bottom:14px">ส่งคำขอไม่ได้ในตอนนี้ เพราะเชื่อมต่อข้อมูลไม่สำเร็จ</p>' +
    '<form id="f" class="form" novalidate>' +
    '<fieldset class="seg"><legend>ประเภทคำขอ</legend><label for="f-type-add"><input type="radio" id="f-type-add" name="f-type" value="add" checked> เพิ่มเว็บไซต์ใหม่</label><label for="f-type-edit"><input type="radio" id="f-type-edit" name="f-type" value="edit"> แจ้งแก้ไขเว็บไซต์ที่มีอยู่</label></fieldset>' +
    '<div class="field" id="f-site-row" hidden><label for="f-site">เว็บไซต์ที่ต้องการแก้ไข</label><select id="f-site"></select></div>' +
    '<div class="row2"><div class="field"><label for="f-name">ชื่อเว็บไซต์ / หน่วยงาน</label><input id="f-name" maxlength="60" autocomplete="off"></div><div class="field"><label for="f-url">ลิงก์เว็บไซต์</label><input id="f-url" inputmode="url" placeholder="https://example.com" autocomplete="off"></div></div>' +
    '<div class="field"><label for="f-desc">คำอธิบายสั้นๆ</label><textarea id="f-desc" maxlength="200"></textarea><span class="hint" id="f-count">0 / 200</span></div>' +
    '<div class="row2"><div class="field"><label for="f-cat">หมวดหมู่</label><select id="f-cat"></select></div><div class="field"><label for="f-contact">ช่องทางติดต่อกลับ</label><input id="f-contact" maxlength="80" placeholder="อีเมลหรือ LINE" autocomplete="off"><span class="hint">เห็นเฉพาะแอดมิน</span></div></div>' +
    '<div class="row2"><div class="field"><label for="f-fb">Facebook (ถ้ามี)</label><input id="f-fb" inputmode="url" placeholder="facebook.com/..." autocomplete="off"></div><div class="field"><label for="f-ig">Instagram (ถ้ามี)</label><input id="f-ig" inputmode="url" placeholder="instagram.com/..." autocomplete="off"></div></div>' +
    '<div style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><label for="f-hp">อย่ากรอกช่องนี้</label><input id="f-hp" tabindex="-1" autocomplete="off"></div>' +
    '<div class="actions"><button type="submit" class="btn primary" id="f-submit">ส่งคำขอ</button><span class="msg" id="f-msg" role="status"></span></div></form></div>' +
    '<h2 class="sec-head" style="margin-top:32px;font-size:1.1rem;color:var(--navy)">คำขอของฉัน</h2><div class="list" id="mine" style="max-width:720px"></div>');
};
fill.submit = () => {
  const can = !!S.db;
  $("#f-lock").hidden = can || !S.db;
  $$("#f input,#f select,#f textarea,#f button").forEach(el => { el.disabled = !can; });
  setOptions("#f-cat", catOptionsHtml());
  const sorted = pub().sort((a, b) => String(a.name).localeCompare(String(b.name), "th"));
  setOptions("#f-site", '<option value="">เลือกเว็บไซต์…</option>' + sorted.map(s => '<option value="' + esc(s.id) + '">' + esc(s.name) + "</option>").join(""));
  const mine = S.mine.slice().sort((a, b) => b.createdAt - a.createdAt);
  setHtml("#mine", mine.length ? mine.map(r => {
    const d = S.decisions[r.id], st = d ? d.status : "pending";
    const label = st === "approved" ? "อนุมัติแล้ว" : st === "rejected" ? "ไม่อนุมัติ" : "รออนุมัติ";
    return '<div class="item"><div class="item-head"><span class="tag ' + (st === "approved" ? "ok" : st === "rejected" ? "err" : "warn") + '">' + label + '</span><span class="tag">' + (r.type === "edit" ? "แจ้งแก้ไข" : "เพิ่มเว็บไซต์") + "</span><strong>" + esc(r.name) + '</strong><span class="small muted">' + esc(fmtDate(r.createdAt)) + '</span></div><span class="small muted">' + esc(hostOf(r.url)) + "</span>" + (d && d.note ? '<p class="small">ข้อความจากแอดมิน: ' + esc(d.note) + "</p>" : "") + "</div>";
  }).join("") : emptyHtml("inbox", "ยังไม่มีคำขอ", "คำขอที่ส่งแล้วจะแสดงสถานะที่นี่"));
};
function curType() { return $('input[name="f-type"]:checked').value; }
function setType(t) { $("#f-type-" + t).checked = true; $("#f-site-row").hidden = t !== "edit"; }
function fillFromSite(id) {
  const s = S.sites.find(x => x.id === id); if (!s) return;
  $("#f-name").value = s.name || ""; $("#f-url").value = s.url || ""; $("#f-desc").value = s.desc || "";
  $("#f-cat").value = s.categoryId || ""; $("#f-fb").value = s.facebook || ""; $("#f-ig").value = s.instagram || "";
  $("#f-count").textContent = $("#f-desc").value.length + " / 200";
}
function goEdit(id) {
  go("submit"); setType("edit"); $("#f-site").value = id; fillFromSite(id); $("#f-name").focus();
}
async function submitRequest() {
  const msg = $("#f-msg"), say = (t, k) => { msg.textContent = t || ""; msg.className = "msg" + (k ? " " + k : ""); };
  const type = curType(), siteId = $("#f-site").value, name = $("#f-name").value.trim(), url = normalizeUrl($("#f-url").value);
  const desc = $("#f-desc").value.trim(), categoryId = $("#f-cat").value, contact = $("#f-contact").value.trim();
  const fb = normalizeUrl($("#f-fb").value), ig = normalizeUrl($("#f-ig").value);
  if (type === "edit" && !siteId) return say("เลือกเว็บไซต์ที่ต้องการแก้ไขก่อน", "err");
  if (name.length < 2) return say("ใส่ชื่อเว็บไซต์อย่างน้อย 2 ตัวอักษร", "err");
  if (!url) return say("ลิงก์ไม่ถูกต้อง ตัวอย่าง https://example.com", "err");
  if (fb === null || ig === null) return say("ลิงก์ Facebook หรือ Instagram ไม่ถูกต้อง", "err");
  if (desc.length < 10) return say("เขียนคำอธิบายอย่างน้อย 10 ตัวอักษร", "err");
  if (!contact) return say("ใส่ช่องทางติดต่อกลับ แอดมินจะใช้เมื่อต้องถามเพิ่ม", "err");
  if (type === "add" && S.sites.some(s => hostOf(s.url) === hostOf(url))) return say("เว็บไซต์นี้อยู่ในรายการแล้ว ถ้าต้องการเปลี่ยนข้อมูลให้เลือก แจ้งแก้ไข", "err");
  if (S.mine.filter(r => !S.decisions[r.id]).length >= 5) return say("มีคำขอรออนุมัติครบ 5 รายการแล้ว รอแอดมินตรวจก่อน", "err");
  if (Date.now() - S.lastSubmit < 15000) return say("รอสักครู่แล้วส่งใหม่", "err");
  const item = { id: newId(), type, name, url, desc, categoryId, facebook: fb, instagram: ig, contact, createdAt: Date.now() };
  if (type === "edit") item.siteId = siteId;
  const btn = $("#f-submit"); btn.disabled = true; say("กำลังส่ง…");
  try {
    if (($("#f-hp") || {}).value) { say("ส่งคำขอแล้ว รอแอดมินตรวจสอบ", "ok"); btn.disabled = false; return; }
    must(await sb.from("requests").insert({ type, site_id: type === "edit" ? siteId : null, name, url, description: desc, category_id: categoryId, facebook: fb, instagram: ig, contact, client_token: getToken() }));
    await loadMine(); refresh();
    S.lastSubmit = Date.now();
    say("ส่งคำขอแล้ว รอแอดมินตรวจสอบ", "ok");
    $("#f").reset(); setType("add"); $("#f-count").textContent = "0 / 200";
  } catch (err) { say(errText(err), "err"); }
  btn.disabled = false;
}

/* ---------- เข้าสู่ระบบผู้ดูแล ---------- */
build["admin-login"] = () => {
  setHtml("#view", '<div class="login"><div class="panel login-card" style="text-align:left"><span class="logo" style="margin:0 auto">' + ic("link", 26) + '</span><h1 style="text-align:center">เข้าสู่ระบบผู้ดูแล</h1>' +
    '<form id="lf" class="form" novalidate>' +
    '<div class="field"><label for="lf-email">อีเมล</label><input id="lf-email" type="email" autocomplete="username" inputmode="email"></div>' +
    '<div class="field"><label for="lf-pw">รหัสผ่าน</label><div style="display:flex;gap:8px"><input id="lf-pw" type="password" autocomplete="current-password" style="flex:1;min-width:0"><button type="button" class="btn" data-act="toggle-pw" id="lf-toggle" aria-label="แสดงรหัสผ่าน">แสดง</button></div></div>' +
    '<p class="note err" id="lf-err" role="alert" hidden></p><p class="msg" id="lf-msg" role="status"></p>' +
    '<button type="submit" class="btn primary" id="lf-go">เข้าสู่ระบบ</button>' +
    '<button type="button" class="textbtn" data-act="forgot" style="align-self:center">ลืมรหัสผ่าน</button></form>' +
    '<button type="button" class="btn" data-go="home">กลับหน้าแรก</button></div></div>');
};
fill["admin-login"] = () => { if (S.isAdmin) go("a-dashboard"); };
async function doLogin() {
  const email = $("#lf-email").value.trim(), pw = $("#lf-pw").value, err = $("#lf-err"), msg = $("#lf-msg"), btn = $("#lf-go");
  const fail = t => { err.textContent = t; err.hidden = false; msg.textContent = ""; btn.disabled = false; };
  err.hidden = true;
  if (!sb) return fail("ยังไม่ได้ตั้งค่าฐานข้อมูล ดู config.js");
  if (!email || !pw) return fail("กรอกอีเมลและรหัสผ่านให้ครบ");
  btn.disabled = true; msg.textContent = "กำลังเข้าสู่ระบบ…";
  const r = await sb.auth.signInWithPassword({ email, password: pw });
  if (r.error) return fail("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  await syncSession();
  if (!S.isAdmin) { await sb.auth.signOut(); S.isAdmin = false; return fail("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแล"); }
  go("a-dashboard");
}
async function doForgot() {
  const email = ($("#lf-email").value || "").trim(), err = $("#lf-err"), msg = $("#lf-msg");
  err.hidden = true;
  if (!email) { err.textContent = "ใส่อีเมลก่อน แล้วกด “ลืมรหัสผ่าน” อีกครั้ง"; err.hidden = false; return; }
  const r = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  if (r.error) { err.textContent = "ส่งลิงก์ไม่สำเร็จ รอสักครู่แล้วลองใหม่"; err.hidden = false; return; }
  msg.className = "msg ok"; msg.textContent = "ถ้าอีเมลนี้เป็นของผู้ดูแล ระบบส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้แล้ว";
}
build["set-password"] = () => {
  setHtml("#view", '<div class="login"><div class="panel login-card" style="text-align:left"><h1 style="text-align:center">ตั้งรหัสผ่านใหม่</h1><form id="pwf" class="form" novalidate><div class="field"><label for="pw-1">รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)</label><input id="pw-1" type="password" autocomplete="new-password"></div><div class="field"><label for="pw-2">พิมพ์รหัสผ่านอีกครั้ง</label><input id="pw-2" type="password" autocomplete="new-password"></div><p class="msg" id="pw-msg" role="status"></p><button type="submit" class="btn primary" id="pw-go">บันทึกรหัสผ่าน</button></form></div></div>');
};
fill["set-password"] = () => {};
async function doSetPassword() {
  const a = $("#pw-1").value, b = $("#pw-2").value, msg = $("#pw-msg"), btn = $("#pw-go");
  msg.className = "msg err";
  if (a.length < 8) { msg.textContent = "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร"; return; }
  if (a !== b) { msg.textContent = "รหัสผ่านสองช่องไม่ตรงกัน"; return; }
  btn.disabled = true;
  const r = await sb.auth.updateUser({ password: a });
  if (r.error) { msg.textContent = "ตั้งรหัสผ่านไม่สำเร็จ ลิงก์อาจหมดอายุ ขอลิงก์ใหม่จากหน้าเข้าสู่ระบบ"; btn.disabled = false; return; }
  await syncSession();
  toast("ตั้งรหัสผ่านใหม่แล้ว");
  go(S.isAdmin ? "a-dashboard" : "home");
}

/* ---------- แอดมิน ---------- */
const aHead = (title, sub, extra) => '<div class="ahead"><div><h1>' + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" + (extra || "") + "</div>";
build["a-dashboard"] = () => { setHtml("#aview", aHead("Dashboard", "ภาพรวมของรายการเว็บไซต์") + '<div id="a-stats"></div><div class="two"><div class="panel"><h2>เว็บไซต์ที่เพิ่มล่าสุด</h2><ul class="mini" id="a-new"></ul></div><div class="panel"><h2>เว็บไซต์ที่แก้ไขล่าสุด</h2><ul class="mini" id="a-edited"></ul></div></div>'); };
fill["a-dashboard"] = () => {
  const pend = pendingList().length;
  setHtml("#a-stats", '<div class="stats"><div class="stat"><span>เว็บไซต์ทั้งหมด</span><b>' + S.sites.length + '</b></div><div class="stat"><span>หมวดหมู่</span><b>' + cats().length + '</b></div><div class="stat"><span>ลิงก์แนะนำ</span><b>' + S.sites.filter(s => s.featured).length + '</b></div><div class="stat"><span>คำขอรออนุมัติ</span><b>' + pend + "</b></div></div>");
  const li = (s, ts) => '<li>' + logoHtml(s, true) + '<div class="t"><strong>' + esc(s.name) + '</strong><span class="small muted">' + esc(catName(s.categoryId)) + " · " + esc(fmtDate(ts)) + "</span></div></li>";
  const nw = S.sites.slice().sort(byNew).slice(0, 5);
  const ed = S.sites.filter(s => s.updatedAt && s.updatedAt - (s.createdAt || 0) > 60000).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  setHtml("#a-new", nw.length ? nw.map(s => li(s, s.createdAt)).join("") : '<li class="muted">ยังไม่มีรายการ</li>');
  setHtml("#a-edited", ed.length ? ed.map(s => li(s, s.updatedAt)).join("") : '<li class="muted">ยังไม่มีการแก้ไข</li>');
};

build["a-sites"] = () => {
  setHtml("#aview", aHead("จัดการเว็บไซต์", "เพิ่ม แก้ไข ซ่อน หรือลบเว็บไซต์ในรายการ", '<button type="button" class="btn primary" data-act="add-site">' + ic("plus", 18) + " เพิ่มเว็บไซต์</button>") +
    '<div class="field" style="max-width:360px;margin-bottom:16px"><input id="aq" type="search" placeholder="ค้นหาในรายการ" aria-label="ค้นหาในรายการ" value="' + esc(S.adminQ) + '"></div><div id="a-list"></div>');
};
fill["a-sites"] = () => {
  const q = S.adminQ.trim().toLowerCase();
  const list = S.sites.filter(s => matches(s, q)).sort(byNew);
  if (!list.length) return setHtml("#a-list", S.ready.sites ? emptyHtml("globe", q ? "ไม่พบรายการที่ตรงกัน" : "ยังไม่มีเว็บไซต์", q ? "ลองค้นหาด้วยคำอื่น" : "กด “เพิ่มเว็บไซต์” เพื่อเริ่มต้น") : emptyHtml("globe", "กำลังโหลด…", ""));
  const stTag = s => s.visible === false ? '<span class="tag">ซ่อน</span>' : '<span class="tag ok">แสดง</span>';
  const acts = s => '<div class="row-actions"><button type="button" class="btn sm" data-act="edit-site" data-id="' + esc(s.id) + '">' + ic("edit", 15) + ' แก้ไข</button><button type="button" class="btn sm danger" data-act="del-site" data-id="' + esc(s.id) + '">' + ic("trash", 15) + " ลบ</button></div>";
  setHtml("#a-list", '<div class="only-d"><div class="tbl-wrap"><table><thead><tr><th></th><th>ชื่อเว็บไซต์</th><th>หมวดหมู่</th><th>URL</th><th>สถานะ</th><th>วันที่เพิ่ม</th><th></th></tr></thead><tbody>' +
    list.map(s => "<tr><td>" + logoHtml(s, true) + "</td><td><strong>" + esc(s.name) + "</strong></td><td>" + esc(catName(s.categoryId)) + '</td><td class="muted">' + esc(hostOf(s.url)) + "</td><td>" + stTag(s) + "</td><td>" + esc(fmtDate(s.createdAt)) + '</td><td class="ta-r">' + acts(s) + "</td></tr>").join("") +
    '</tbody></table></div></div><div class="only-m list">' +
    list.map(s => '<div class="item"><div class="card-top">' + logoHtml(s) + '<div class="card-title"><h3>' + esc(s.name) + "</h3><span>" + esc(catName(s.categoryId)) + " · " + esc(hostOf(s.url)) + '</span></div>' + stTag(s) + '</div><span class="small muted">เพิ่มเมื่อ ' + esc(fmtDate(s.createdAt)) + "</span>" + acts(s) + "</div>").join("") + "</div>");
};

function openSiteForm(id) {
  const s = id ? S.sites.find(x => x.id === id) : null;
  if (id && !s) return;
  const v = k => esc(s && s[k] || "");
  modal('<h2 id="m-title">' + (s ? "แก้ไขเว็บไซต์" : "เพิ่มเว็บไซต์") + '</h2><form id="sf" class="form" novalidate data-id="' + esc(id || "") + '">' +
    '<div class="field"><label for="sf-name">ชื่อเว็บไซต์</label><input id="sf-name" maxlength="60" value="' + v("name") + '" autocomplete="off"></div>' +
    '<div class="field"><label for="sf-desc">คำอธิบาย</label><textarea id="sf-desc" maxlength="200">' + v("desc") + "</textarea></div>" +
    '<div class="row2"><div class="field"><label for="sf-cat">หมวดหมู่</label><select id="sf-cat">' + catOptionsHtml(s && s.categoryId) + '</select></div><div class="field"><label for="sf-url">URL เว็บไซต์</label><input id="sf-url" inputmode="url" value="' + v("url") + '" placeholder="https://example.com" autocomplete="off"></div></div>' +
    '<div class="row2"><div class="field"><label for="sf-fb">Facebook</label><input id="sf-fb" inputmode="url" value="' + v("facebook") + '" autocomplete="off"></div><div class="field"><label for="sf-ig">Instagram</label><input id="sf-ig" inputmode="url" value="' + v("instagram") + '" autocomplete="off"></div></div>' +
    '<div class="field"><label for="sf-other">ช่องทางอื่นๆ (ลิงก์)</label><input id="sf-other" inputmode="url" value="' + v("other") + '" autocomplete="off"></div>' +
    '<div class="field"><span class="lab">Logo / Icon</span><div class="logo-pick"><span id="sf-prev"></span><button type="button" class="btn sm" data-act="pick-logo">' + ic("upload", 15) + ' เลือกรูป</button><button type="button" class="btn sm" data-act="rm-logo" id="sf-rm">ลบรูป</button><input type="file" id="sf-file" accept="image/*" hidden></div><span class="hint">ถ้าไม่ใส่ จะแสดงตัวอักษรแรกของชื่อแทน</span></div>' +
    '<label class="switch"><input type="checkbox" id="sf-vis"' + (!s || s.visible !== false ? " checked" : "") + '> แสดงบนหน้าเว็บ</label>' +
    '<div class="actions"><span class="msg" id="sf-msg" role="status" style="margin-right:auto"></span><button type="button" class="btn" data-act="m-close">ยกเลิก</button><button type="submit" class="btn primary" id="sf-save">บันทึก</button></div></form>');
  window.__logo = s && s.logo || "";
  paintLogoPrev();
}
function paintLogoPrev() {
  const name = ($("#sf-name") || {}).value || "?";
  setHtml("#sf-prev", logoHtml({ name, logo: window.__logo }));
  const rm = $("#sf-rm"); if (rm) rm.hidden = !window.__logo;
}
function readLogo(file) {
  return new Promise((res, rej) => {
    if (!file || file.size > 5 * 1024 * 1024) return rej(new Error("big"));
    const fr = new FileReader();
    fr.onerror = () => rej(new Error("read"));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => rej(new Error("img"));
      img.onload = () => {
        const n = 128, c = document.createElement("canvas"); c.width = c.height = n;
        const sz = Math.min(img.width, img.height) || n, sx = (img.width - sz) / 2, sy = (img.height - sz) / 2;
        c.getContext("2d").drawImage(img, sx, sy, sz, sz, 0, 0, n, n);
        res(c.toDataURL("image/png"));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
async function saveSite() {
  const say = (t, k) => { const m = $("#sf-msg"); m.textContent = t || ""; m.className = "msg" + (k ? " " + k : ""); };
  const id = $("#sf").dataset.id;
  const name = $("#sf-name").value.trim(), desc = $("#sf-desc").value.trim(), categoryId = $("#sf-cat").value;
  const url = normalizeUrl($("#sf-url").value), fb = normalizeUrl($("#sf-fb").value), ig = normalizeUrl($("#sf-ig").value), other = normalizeUrl($("#sf-other").value);
  if (name.length < 2) return say("ใส่ชื่อเว็บไซต์อย่างน้อย 2 ตัวอักษร", "err");
  if (!url) return say("URL เว็บไซต์ไม่ถูกต้อง ตัวอย่าง https://example.com", "err");
  if (fb === null || ig === null || other === null) return say("ลิงก์ช่องทางอื่นไม่ถูกต้อง", "err");
  if (!desc) return say("ใส่คำอธิบายสั้นๆ", "err");
  const f = { name, desc, categoryId, url, facebook: fb, instagram: ig, other, logo: window.__logo || "", visible: $("#sf-vis").checked, updatedAt: Date.now() };
  const btn = $("#sf-save"); btn.disabled = true; say("กำลังบันทึก…");
  try {
    if (id) must(await sb.from("sites").update(siteToRow(f)).eq("id", id));
    else must(await sb.from("sites").insert(Object.assign(siteToRow(f), { featured: false })));
    await loadAll(); refresh();
    closeModal(); toast(id ? "บันทึกการแก้ไขแล้ว" : "เพิ่มเว็บไซต์แล้ว");
  } catch (err) { say(errText(err), "err"); btn.disabled = false; }
}

build["a-cats"] = () => {
  setHtml("#aview", aHead("หมวดหมู่", "เพิ่ม แก้ไขชื่อ ลบ และจัดลำดับหมวดหมู่", '<button type="button" class="btn primary" data-act="add-cat">' + ic("plus", 18) + " เพิ่มหมวดหมู่</button>") + '<div id="a-cat-note"></div><div class="list" id="a-cat-list"></div>');
};
fill["a-cats"] = () => {
  const isDef = false;
  setHtml("#a-cat-note", isDef && S.ready.cats ? '<div class="note" style="margin-bottom:14px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">หมวดหมู่ด้านล่างเป็นค่าเริ่มต้น ยังไม่ได้บันทึกลงระบบ<button type="button" class="btn sm primary" data-act="save-defaults">บันทึกหมวดเริ่มต้น</button></div>' : "");
  const counts = {}; S.sites.forEach(s => { counts[s.categoryId] = (counts[s.categoryId] || 0) + 1; });
  const list = cats();
  setHtml("#a-cat-list", list.map((c, i) => '<div class="item"><div class="cat-row"><div class="info"><strong>' + esc(c.name) + '</strong><span class="small muted">' + esc(c.desc) + " · " + (counts[c.id] || 0) + ' เว็บไซต์</span></div><div class="row-actions">' +
    '<button type="button" class="btn sm" data-act="cat-up" data-id="' + esc(c.id) + '" aria-label="เลื่อนขึ้น"' + (i === 0 || isDef ? " disabled" : "") + ">" + ic("up", 15) + "</button>" +
    '<button type="button" class="btn sm" data-act="cat-down" data-id="' + esc(c.id) + '" aria-label="เลื่อนลง"' + (i === list.length - 1 || isDef ? " disabled" : "") + ">" + ic("down", 15) + "</button>" +
    '<button type="button" class="btn sm" data-act="edit-cat" data-id="' + esc(c.id) + '"' + (isDef ? " disabled" : "") + ">" + ic("edit", 15) + ' แก้ไข</button>' +
    '<button type="button" class="btn sm danger" data-act="del-cat" data-id="' + esc(c.id) + '"' + (isDef ? " disabled" : "") + ">" + ic("trash", 15) + " ลบ</button></div></div></div>").join(""));
};
function openCatForm(id) {
  const c = id ? S.cats.find(x => x.id === id) : null;
  modal('<h2 id="m-title">' + (c ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่") + '</h2><form id="cf" class="form" novalidate data-id="' + esc(id || "") + '"><div class="field"><label for="cf-name">ชื่อหมวดหมู่</label><input id="cf-name" maxlength="40" value="' + esc(c && c.name || "") + '" autocomplete="off"></div><div class="field"><label for="cf-desc">คำอธิบาย</label><input id="cf-desc" maxlength="100" value="' + esc(c && c.desc || "") + '" autocomplete="off"></div><div class="actions"><span class="msg" id="cf-msg" role="status" style="margin-right:auto"></span><button type="button" class="btn" data-act="m-close">ยกเลิก</button><button type="submit" class="btn primary" id="cf-save">บันทึก</button></div></form>', true);
}
async function saveCat() {
  const say = (t, k) => { const m = $("#cf-msg"); m.textContent = t || ""; m.className = "msg" + (k ? " " + k : ""); };
  const id = $("#cf").dataset.id, name = $("#cf-name").value.trim(), desc = $("#cf-desc").value.trim();
  if (name.length < 2) return say("ใส่ชื่อหมวดหมู่อย่างน้อย 2 ตัวอักษร", "err");
  if (S.cats.some(c => c.id !== id && c.name === name)) return say("มีหมวดหมู่ชื่อนี้อยู่แล้ว", "err");
  const btn = $("#cf-save"); btn.disabled = true;
  try {
    if (id) must(await sb.from("categories").update({ name, description: desc }).eq("id", id));
    else must(await sb.from("categories").insert({ id: "c" + Date.now().toString(36), name, description: desc, sort_order: S.cats.reduce((m, c) => Math.max(m, c.order || 0), -1) + 1 }));
    await loadAll(); refresh();
    closeModal(); toast(id ? "บันทึกแล้ว" : "เพิ่มหมวดหมู่แล้ว");
  } catch (err) { say(errText(err), "err"); btn.disabled = false; }
}
async function moveCat(id, dir) {
  const list = cats(), i = list.findIndex(c => c.id === id), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  const a = list.slice(); const t = a[i]; a[i] = a[j]; a[j] = t;
  try { for (let k = 0; k < a.length; k++) if ((a[k].order || 0) !== k) must(await sb.from("categories").update({ sort_order: k }).eq("id", a[k].id)); await loadAll(); refresh(); }
  catch (err) { toast(errText(err), "err"); }
}

build["a-featured"] = () => { setHtml("#aview", aHead("ลิงก์แนะนำ", "เว็บไซต์ที่เปิดสวิตช์จะขึ้นในส่วน “ลิงก์แนะนำ” ของหน้าแรก") + '<div class="list" id="a-feat"></div>'); };
fill["a-featured"] = () => {
  const list = S.sites.slice().sort((a, b) => String(a.name).localeCompare(String(b.name), "th"));
  setHtml("#a-feat", list.length ? list.map(s => '<div class="item"><div class="cat-row">' + logoHtml(s, true) + '<div class="info"><strong>' + esc(s.name) + '</strong><span class="small muted">' + esc(catName(s.categoryId)) + (s.visible === false ? " · ซ่อนอยู่" : "") + '</span></div><label class="switch"><input type="checkbox" class="js-feat" data-id="' + esc(s.id) + '"' + (s.featured ? " checked" : "") + ' aria-label="แนะนำ ' + esc(s.name) + '"> แนะนำ</label></div></div>').join("") : emptyHtml("star", "ยังไม่มีเว็บไซต์", "เพิ่มเว็บไซต์ก่อนแล้วค่อยเลือกลิงก์แนะนำ"));
};

build["a-requests"] = () => { setHtml("#aview", aHead("คำขอจากผู้ใช้", "ตรวจสอบก่อนแสดงบนหน้าเว็บ") + '<div class="list" id="a-queue"></div>'); };
fill["a-requests"] = () => {
  const q = pendingList();
  setHtml("#a-queue", q.length ? q.map(r => {
    const cur = r.type === "edit" ? S.sites.find(s => s.id === r.siteId) : null;
    const row = (label, key, val, show) => { const old = cur && String(cur[key] || "") !== String(val || "") ? '<span class="old">' + esc(cur[key] || "-") + "</span>" : ""; return "<dt>" + label + "</dt><dd>" + old + esc(show || val || "-") + "</dd>"; };
    return '<div class="item" data-req="' + esc(r.id) + '"><div class="item-head"><span class="tag warn">รออนุมัติ</span><span class="tag">' + (r.type === "edit" ? "แจ้งแก้ไข" : "เพิ่มเว็บไซต์") + "</span><strong>" + esc(r.name) + '</strong><span class="small muted">' + esc(fmtDate(r.createdAt)) + '</span></div><dl class="kv">' +
      row("ชื่อ", "name", r.name) + row("ลิงก์", "url", r.url) + row("อธิบาย", "desc", r.desc) + row("หมวด", "categoryId", r.categoryId, catName(r.categoryId)) + row("Facebook", "facebook", r.facebook) + row("Instagram", "instagram", r.instagram) +
      '<dt>ติดต่อ</dt><dd>' + esc(r.contact) + "</dd></dl>" +
      (r.type === "edit" && !cur ? '<p class="small muted">เว็บไซต์ที่ขอแก้ไขถูกลบไปแล้ว ถ้าอนุมัติจะถูกเพิ่มเป็นเว็บไซต์ใหม่</p>' : "") +
      '<div class="review"><input type="text" maxlength="120" placeholder="ข้อความถึงผู้ส่ง (ไม่บังคับ)" aria-label="ข้อความถึงผู้ส่ง" id="note-' + esc(r.id) + '"><button type="button" class="btn primary" data-act="approve" data-id="' + esc(r.id) + '">อนุมัติ</button><button type="button" class="btn danger" data-act="reject" data-id="' + esc(r.id) + '">ปฏิเสธ</button></div></div>';
  }).join("") : emptyHtml("check", "ไม่มีคำขอค้างอยู่", "คำขอใหม่จะขึ้นที่นี่"));
};
async function decide(id, approve) {
  const req = S.allRequests.find(r => r.id === id); if (!req) return;
  const note = (($("#note-" + id) || {}).value || "").trim();
  $$('[data-req="' + id + '"] button').forEach(b => { b.disabled = true; });
  try {
    const siteId = req.siteId || "";
    if (approve) {
      const f = { name: req.name, desc: req.desc, categoryId: req.categoryId, url: req.url, facebook: req.facebook || "", instagram: req.instagram || "", other: "", logo: "", visible: true };
      if (req.type === "edit" && S.sites.some(s => s.id === siteId)) {
        const row = siteToRow(f); delete row.other; delete row.logo; delete row.visible;
        must(await sb.from("sites").update(row).eq("id", siteId));
      } else must(await sb.from("sites").insert(Object.assign(siteToRow(f), { featured: false })));
    }
    must(await sb.from("requests").update({ status: approve ? "approved" : "rejected", admin_note: note, decided_at: new Date().toISOString() }).eq("id", id));
    await loadAll(); refresh();
    toast(approve ? "อนุมัติแล้ว" : "ปฏิเสธคำขอแล้ว");
  } catch (err) { toast(errText(err), "err"); refresh(); }
}

build["a-settings"] = () => {
  const st = S.settings;
  setHtml("#aview", aHead("ตั้งค่า", "ข้อความที่แสดงบนหัวเว็บ หน้าแรก และส่วนท้าย") + '<div class="panel" style="max-width:640px"><form id="stf" class="form" novalidate>' +
    '<div class="field"><label for="st-name">ชื่อเว็บไซต์</label><input id="st-name" maxlength="60" value="' + esc(st.siteName) + '"></div>' +
    '<div class="field"><label for="st-tag">คำโปรยหน้าแรก</label><input id="st-tag" maxlength="100" value="' + esc(st.tagline) + '"></div>' +
    '<div class="field"><label for="st-about">คำอธิบายส่วนท้าย</label><textarea id="st-about" maxlength="200">' + esc(st.about) + '</textarea></div>' +
    '<div class="field"><label for="st-contact">ช่องทางติดต่อผู้ดูแล</label><input id="st-contact" maxlength="100" value="' + esc(st.contact) + '" placeholder="เช่น อีเมลหรือ LINE"><span class="hint">แสดงเป็นข้อความที่ส่วนท้ายของเว็บ</span></div>' +
    '<div class="actions"><button type="submit" class="btn primary" id="st-save">บันทึก</button><span class="msg" id="st-msg" role="status"></span></div></form></div>');
};
fill["a-settings"] = () => {};
async function saveSettings() {
  const msg = $("#st-msg"), say = (t, k) => { msg.textContent = t || ""; msg.className = "msg" + (k ? " " + k : ""); };
  const v = { siteName: $("#st-name").value.trim(), tagline: $("#st-tag").value.trim(), about: $("#st-about").value.trim(), contact: $("#st-contact").value.trim() };
  if (!v.siteName) return say("ใส่ชื่อเว็บไซต์", "err");
  const btn = $("#st-save"); btn.disabled = true;
  try { must(await sb.from("settings").update({ site_name: v.siteName, tagline: v.tagline, about: v.about, contact: v.contact }).eq("id", 1)); await loadAll(); refresh(); say("บันทึกแล้ว", "ok"); } catch (err) { say(errText(err), "err"); }
  btn.disabled = false;
}

/* ---------- events ---------- */
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-act],[data-go]");
  if (!t) return;
  if (t.dataset.go) return go(t.dataset.go, { id: t.dataset.id });
  const a = t.dataset.act, id = t.dataset.id;
  switch (a) {
    case "menu": S.menuOpen = !S.menuOpen; fillChrome(); break;
    case "admin-menu": S.adminNav = !S.adminNav; fillChrome(); break;
    case "fav": toggleFav(id); refresh(); break;
    case "home-cat": S.homeCat = id; fill.home(); break;
    case "search-cat": S.searchCat = id; fill.search(); break;
    case "edit-req": goEdit(id); break;
    case "clear-search": S.q = ""; S.searchCat = "all"; $("#sq").value = ""; fill.search(); $("#sq").focus(); break;
    case "logout": if (sb) await sb.auth.signOut(); S.isAdmin = false; S.allRequests = []; go("home"); break;
    case "toggle-pw": { const i = $("#lf-pw"), show = i.type === "password"; i.type = show ? "text" : "password"; $("#lf-toggle").textContent = show ? "ซ่อน" : "แสดง"; break; }
    case "forgot": doForgot(); break;
    case "m-close": closeModal(); break;
    case "m-bg": if (e.target === t) closeModal(); break;
    case "add-site": openSiteForm(); break;
    case "edit-site": openSiteForm(id); break;
    case "del-site": {
      const s = S.sites.find(x => x.id === id); if (!s) break;
      if (await confirmDialog({ title: "ลบเว็บไซต์นี้หรือไม่", text: "“" + s.name + "” จะหายจากรายการถาวร", ok: "ลบ" }))
        try { must(await sb.from("sites").delete().eq("id", id)); await loadAll(); refresh(); toast("ลบแล้ว"); } catch (err) { toast(errText(err), "err"); }
      break;
    }
    case "pick-logo": $("#sf-file").click(); break;
    case "rm-logo": window.__logo = ""; paintLogoPrev(); break;
    case "add-cat": openCatForm(); break;
    case "edit-cat": openCatForm(id); break;
    case "del-cat": {
      const c = S.cats.find(x => x.id === id); if (!c) break;
      const n = S.sites.filter(s => s.categoryId === id).length;
      if (n) { toast("มีเว็บไซต์ " + n + " รายการในหมวดนี้ ย้ายหรือลบก่อน", "err"); break; }
      if (await confirmDialog({ title: "ลบหมวดหมู่นี้หรือไม่", text: "“" + c.name + "” จะถูกลบถาวร", ok: "ลบ" }))
        try { must(await sb.from("categories").delete().eq("id", id)); await loadAll(); refresh(); toast("ลบแล้ว"); } catch (err) { toast(errText(err), "err"); }
      break;
    }
    case "cat-up": moveCat(id, -1); break;
    case "cat-down": moveCat(id, 1); break;
    case "approve": decide(id, true); break;
    case "reject": decide(id, false); break;
  }
});
document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.search) {
    S.q = $("#" + f.dataset.search).value;
    if (S.view !== "search") go("search"); else fill.search();
  } else if (f.id === "f") submitRequest();
  else if (f.id === "sf") saveSite();
  else if (f.id === "cf") saveCat();
  else if (f.id === "stf") saveSettings();
  else if (f.id === "lf") doLogin();
  else if (f.id === "pwf") doSetPassword();
});
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id === "sq") { S.q = e.target.value; fill.search(); }
  else if (id === "aq") { S.adminQ = e.target.value; fill["a-sites"](); }
  else if (id === "f-desc") $("#f-count").textContent = e.target.value.length + " / 200";
  else if (id === "sf-name") paintLogoPrev();
});
document.addEventListener("change", async e => {
  const t = e.target;
  if (t.name === "f-type") setType(curType());
  else if (t.id === "f-site") fillFromSite(t.value);
  else if (t.id === "s-sort") { S.sort = t.value; fill.search(); }
  else if (t.classList.contains("js-feat")) {
    try { must(await sb.from("sites").update({ featured: t.checked }).eq("id", t.dataset.id)); await loadAll(); refresh(); } catch (err) { t.checked = !t.checked; toast(errText(err), "err"); }
  } else if (t.id === "sf-file") {
    try { window.__logo = await readLogo(t.files[0]); paintLogoPrev(); } catch (err) { toast("ใช้รูปนี้ไม่ได้ เลือกรูปขนาดไม่เกิน 5 MB", "err"); }
    t.value = "";
  }
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if ($("#modal-root").firstChild) closeModal(); else if (S.menuOpen || S.adminNav) { S.menuOpen = S.adminNav = false; fillChrome(); }
});

/* ---------- ข้อมูลจาก Supabase ---------- */
function must(res) { if (res && res.error) throw res.error; return res; }
function getToken() {
  if (S.token) return S.token;
  let t = "";
  try { t = localStorage.getItem("slh-token") || ""; } catch (e) { t = ""; }
  if (t.length < 20) {
    t = (crypto.randomUUID ? crypto.randomUUID() : "t" + Math.random().toString(36).slice(2) + Date.now().toString(36)) + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem("slh-token", t); } catch (e) { /* ใช้ชั่วคราวในหน้านี้ */ }
  }
  S.token = t;
  return t;
}
const siteFromRow = r => ({ id: r.id, name: r.name, desc: r.description, categoryId: r.category_id, url: r.url, facebook: r.facebook || "", instagram: r.instagram || "", other: r.other || "", logo: r.logo || "", visible: r.visible, featured: r.featured, createdAt: Date.parse(r.created_at), updatedAt: Date.parse(r.updated_at) });
const siteToRow = f => ({ name: f.name, description: f.desc, category_id: f.categoryId, url: f.url, facebook: f.facebook, instagram: f.instagram, other: f.other, logo: f.logo, visible: f.visible, updated_at: new Date().toISOString() });
const catFromRow = r => ({ id: r.id, name: r.name, desc: r.description || "", order: r.sort_order || 0 });
const reqFromRow = r => ({ id: r.id, type: r.type, siteId: r.site_id || "", name: r.name, url: r.url, desc: r.description, categoryId: r.category_id, facebook: r.facebook || "", instagram: r.instagram || "", contact: r.contact || "", createdAt: Date.parse(r.created_at) });

async function loadMine() {
  const r = await sb.rpc("my_requests", { token: getToken() });
  if (r.error) return;
  S.mine = r.data.map(reqFromRow);
  const d = {};
  r.data.forEach(x => { if (x.status !== "pending") d[x.id] = { status: x.status, note: x.admin_note || "" }; });
  S.decisions = d;
}
async function loadAll() {
  try {
    const [c, s, st] = await Promise.all([
      sb.from("categories").select("*").order("sort_order"),
      sb.from("sites").select("*").order("created_at", { ascending: false }),
      sb.from("settings").select("*").eq("id", 1).maybeSingle()
    ]);
    must(c); must(s); must(st);
    S.cats = c.data.map(catFromRow);
    S.sites = s.data.map(siteFromRow);
    const x = st.data || {};
    S.settings = { siteName: x.site_name || DEFAULT_SETTINGS.siteName, tagline: x.tagline || DEFAULT_SETTINGS.tagline, about: x.about || DEFAULT_SETTINGS.about, contact: x.contact || "" };
    S.ready = { sites: true, cats: true };
    S.db = true;
    await loadMine();
    if (S.isAdmin) {
      const r = must(await sb.from("requests").select("*").eq("status", "pending").order("created_at"));
      S.allRequests = r.data.map(reqFromRow);
    } else S.allRequests = [];
  } catch (e) { console.error(e); S.db = false; }
}
async function syncSession() {
  const g = await sb.auth.getSession();
  const ses = g.data && g.data.session;
  S.isAdmin = false; S.email = "";
  if (ses) {
    const r = await sb.rpc("is_admin");
    S.isAdmin = !r.error && r.data === true;
    S.email = ses.user.email || "";
  }
  await loadAll();
}

/* ---------- เริ่มทำงาน ---------- */
(async function init() {
  $$(".logo").forEach(e => { e.innerHTML = ic("link", 20); });
  $("#admin-btn").innerHTML = ic("shield", 20);
  loadFavs();
  go("home");
  if (!CONFIGURED) { S.db = false; refresh(); return; }
  sb.auth.onAuthStateChange(ev => {
    if (ev === "PASSWORD_RECOVERY") setTimeout(() => go("set-password"), 0);
    else if (ev === "SIGNED_OUT") setTimeout(() => { S.isAdmin = false; S.allRequests = []; if (ADMIN_VIEWS.includes(S.view)) go("home"); else refresh(); }, 0);
  });
  await syncSession();
  refresh();
})();
