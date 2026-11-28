/*
  CHỈNH SẢN PHẨM TẠI MẢNG products BÊN DƯỚI.
  Mỗi sản phẩm có 3 link riêng: directUrl, keyUrl, ipaUrl.
  Thay URL mẫu bằng link thật của bạn.
*/
const products = [
  {name:"PUBG VNHAX", game:"PUBG Mobile", icon:"🎮", stock:234, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"PUBG PREMIUM", game:"PUBG Mobile", icon:"🎯", stock:120, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"PUBG VIP", game:"PUBG Mobile", icon:"🪖", stock:85, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"Freefire proxy", game:"Free Fire", icon:"🔥", stock:269, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"Freefire HUNTER", game:"Free Fire", icon:"🟣", stock:142, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"Freefire inova", game:"Free Fire", icon:"⚡", stock:199, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"modskinvip", game:"Liên Quân", icon:"🛡️", stock:454, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"ZOZO VIP1", game:"Liên Quân", icon:"💎", stock:174, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"LQ ZOZO CHẤP TỐ", game:"Liên Quân", icon:"🌌", stock:0, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"LQ DUYVIP", game:"Liên Quân", icon:"👑", stock:0, directUrl:"#", keyUrl:"#", ipaUrl:"#"},
  {name:"GAME TOOL", game:"Game khác", icon:"🧩", stock:50, directUrl:"#", keyUrl:"#", ipaUrl:"#"}
];

const order = ["PUBG Mobile","Free Fire","Liên Quân","Game khác"];
const colors = {"PUBG Mobile":"#ffc66d","Free Fire":"#c98cff","Liên Quân":"#ff91ad","Game khác":"#71d5df"};
let activeFilter = "Tất cả";
const $ = (id) => document.getElementById(id);

function safeUrl(url){ return url && url !== "#" ? url : ""; }
function action(label, url, cls){
  const href = safeUrl(url);
  return href
    ? `<a class="action ${cls}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`
    : `<span class="action ${cls} disabled">${label}</span>`;
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function render(){
  const query = $("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p =>
    (activeFilter === "Tất cả" || p.game === activeFilter) &&
    (p.name.toLowerCase().includes(query) || p.game.toLowerCase().includes(query))
  );
  $("totalCount").textContent = `${products.length} gói`;
  $("allCount").textContent = products.length;
  $("pubgCount").textContent = products.filter(p=>p.game==="PUBG Mobile").length;
  $("ffCount").textContent = products.filter(p=>p.game==="Free Fire").length;
  $("lqCount").textContent = products.filter(p=>p.game==="Liên Quân").length;
  $("otherCount").textContent = products.filter(p=>p.game==="Game khác").length;
  $("resultLine").textContent = `Hiển thị ${filtered.length}/${products.length} gói`;
  $("emptyState").hidden = filtered.length !== 0;
  $("gameSections").innerHTML = order.map(game=>{
    const items = filtered.filter(p=>p.game===game);
    if(!items.length) return "";
    return `<section class="game-group" style="--accent:${colors[game]}">
      <div class="group-title"><span class="left"><i class="dot"></i>${game}</span><small>${items.length} gói</small></div>
      <div class="product-list">${items.map(p=>`
        <article class="product-card" style="--accent:${colors[p.game]}">
          <div class="product-icon" aria-hidden="true">${p.icon}</div>
          <div class="product-info"><h3>${escapeHtml(p.name)}</h3><span class="tag">${escapeHtml(p.game)}</span>
          <div class="stock"><i></i>${p.stock > 0 ? `Còn ${p.stock} key` : "Liên hệ / đang cập nhật"}</div></div>
          <div class="actions">
            ${action("LINK TRỰC TIẾP",p.directUrl,"direct")}
            ${action("LẤY KEY",p.keyUrl,"key")}
            ${action("LINK IPA",p.ipaUrl,"ipa")}
          </div>
        </article>`).join("")}</div>
    </section>`;
  }).join("");
}
$("filters").addEventListener("click", e=>{
  const button=e.target.closest("button[data-filter]");
  if(!button) return;
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  render();
});
$("searchInput").addEventListener("input",render);
$("year").textContent=new Date().getFullYear();
render();
