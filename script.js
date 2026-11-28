/* =====================================================
   MONTERxPUBG — script.js
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- LOADER ---------- */
  const loader = document.getElementById("loader");
   
  window.addEventListener("load", () => {
     
    const logoLoader = document.getElementById("logoLoader");

    if (loader) loader.style.display = "none";

    setTimeout(() => {
        if (logoLoader) {
            logoLoader.style.opacity = "0";
logoLoader.style.transform = "scale(1.5)";

            setTimeout(() => {
                logoLoader.style.display = "none";
            }, 500);
        }
    }, 2000);
});

  /* ---------- POPUP + NHẠC NỀN ---------- */
  const popup      = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const bgmusic     = document.getElementById("bgmusic");
  
   
  const POPUP_STORAGE_KEY = "monterxpubg_popup_last_closed";
  const POPUP_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 giờ

  function getLastClosed() {
    try {
      const v = localStorage.getItem(POPUP_STORAGE_KEY);
      return v ? parseInt(v, 10) : null;
    } catch (e) {
      return null;
    }
  }

  function setLastClosed() {
    try {
      localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
    } catch (e) {
      /* localStorage không khả dụng, bỏ qua */
    }
  }

  function shouldShowPopup() {
    const last = getLastClosed();
    if (!last) return true;
    return Date.now() - last >= POPUP_COOLDOWN_MS;
  }

  function playMusic() {
    if (!bgmusic) return;
    bgmusic.volume = 0.35;
    bgmusic.loop = true;
    bgmusic.play().catch(() => {
      /* trình duyệt chặn autoplay, sẽ phát khi người dùng tương tác */
    });
  }

  function showPopup() {
    if (!popup) return;

    popup.style.display = "flex";
    popup.style.opacity = "1";
    popup.style.visibility = "visible";

    document.body.classList.add("no-scroll");
}

  function hidePopup() {
    if (!popup) return;

    popup.style.opacity = "0";
    popup.style.visibility = "hidden";

    document.body.classList.remove("no-scroll");
}

  function enterSite() {
    hidePopup();
    setLastClosed();
    playMusic();
  }

  if (popup) {
    if (shouldShowPopup()) {
      showPopup();
    } else {
      hidePopup();
      playMusic();
    }
  }

  if (closePopup) {
    closePopup.addEventListener("click", enterSite);
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (!backToTop) return;
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
/* ========= DOWNLOAD POPUP ========= */

const downloadPopup = document.getElementById("downloadPopup");
const continueDownload = document.getElementById("continueDownload");
const cancelDownload = document.getElementById("cancelDownload");
const downloadTitle = document.querySelector(".download-version");
const downloadMessage = document.getElementById("downloadMessage");

let currentLink = "";

document.querySelectorAll(".install,.key,.ipa,.apk64,.apk32,.tipa,.allgame,.adrff").forEach(btn=>{

    btn.addEventListener("click",function(e){

        e.preventDefault();

        currentLink = this.href;

        if(this.classList.contains("install")){

            downloadTitle.innerHTML="LINK TRỰC TIẾP";

            downloadMessage.innerHTML=`
            Link Trực Tiếp Bị Thu Hồi CC<br><br>
            Hãy Chuyển Qua Cài iPA
            `;

        }

        if(this.classList.contains("key")){

            downloadTitle.innerHTML="LẤY KEY";

            downloadMessage.innerHTML=`
            Key Free 24h<br><br>
            Hết Key Cứ Quay Lại Web Lấy
            `;

        }

        if(this.classList.contains("ipa")){

            downloadTitle.innerHTML="LINK IPA";

            downloadMessage.innerHTML=`
            CÀI ĐÚNG iPA GAME<br><br>
            Và Lấy Đúng Key Của Game
            `;

        }
if(this.classList.contains("apk64")){

    downloadTitle.innerHTML="APK 64BIT";

    downloadMessage.innerHTML=`
    Nếu Máy Không Hỗ Trợ 64Bit<br><br>
    Hãy Tải Thử 32Bit.
    `;

}

if(this.classList.contains("apk32")){

    downloadTitle.innerHTML="APK 32BIT";

    downloadMessage.innerHTML=`
    Nếu Máy Hỗ Trợ 64Bit<br><br>
    Khuyên Dùng Apk 64Bit<br><br>
    Nếu Chơi 32Bit Có Thể Bị Giật Lag
    `;

}

if(this.classList.contains("tipa")){

    downloadTitle.innerHTML="TIPA";

    downloadMessage.innerHTML=`
    Sau Khi Tải Xong<br><br>
    Hãy Cài Đặt Bằng TrollStore
    `;

}
if(this.classList.contains("allgame")){

            downloadTitle.innerHTML="LINK TẢI ALL GAME";

            downloadMessage.innerHTML=`
            Tải Game Nào<br><br>
            Lấy Đúng Key Game Đó Nhé
            `;

        }
       if(this.classList.contains("adrff")){

            downloadTitle.innerHTML="Link All";

            downloadMessage.innerHTML=`
            Tất Cả File Trong Đây<br><br>
            Đọc Kỹ Lưu Ý Nhé
            `;

        }
        downloadPopup.style.display="flex";

    });

});

continueDownload.onclick=()=>{

    window.open(currentLink,"_blank");

    downloadPopup.style.display="none";

}

cancelDownload.onclick=()=>{

    downloadPopup.style.display="none";

}

downloadPopup.onclick=(e)=>{

    if(e.target===downloadPopup){

        downloadPopup.style.display="none";

    }

}
/* MONTER navigation */
document.querySelectorAll('.category-nav a').forEach(link=>{
  link.addEventListener('click',()=>{
    document.querySelectorAll('.category-nav a').forEach(a=>a.classList.remove('active'));
    link.classList.add('active');
  });
});

const downloadPopupEl=document.getElementById('downloadPopup');
if(downloadPopupEl){
  const observer=new MutationObserver(()=>{
    if(downloadPopupEl.style.display==='flex') downloadPopupEl.style.display='flex';
  });
  observer.observe(downloadPopupEl,{attributes:true,attributeFilter:['style']});
}


/* =====================================================
   CATEGORY FILTER — mỗi tab chỉ hiển thị đúng nhóm game
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-nav a[data-category]");
  const gameSections = document.querySelectorAll(".game-section[data-game-section]");

  function showCategory(category, updateHash = true) {
    gameSections.forEach(section => {
      const match = section.dataset.gameSection === category;
      section.classList.toggle("game-section-hidden", !match);
      section.setAttribute("aria-hidden", match ? "false" : "true");
    });

    categoryButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.category === category);
      button.setAttribute("aria-selected", button.dataset.category === category ? "true" : "false");
    });

    if (updateHash) {
      const target = document.getElementById(category === "pubg" ? "pubg" : category + "-section");
      if (target) {
        history.replaceState(null, "", "#" + target.id);
        window.scrollTo({ top: Math.max(0, target.offsetTop - 18), behavior: "smooth" });
      }
    }
  }

  categoryButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      showCategory(button.dataset.category);
    });
  });

  // Chỉ hiển thị một nhóm khi mở web. Nếu URL có hash hợp lệ thì mở nhóm đó.
  const hash = window.location.hash;
  const initialCategory = hash === "#lqm-section" ? "lqm"
    : hash === "#freefire-section" ? "freefire"
    : hash === "#allgame-section" ? "allgame"
    : "pubg";

  showCategory(initialCategory, false);
});


/* ===== HEADER HAMBURGER MENU ===== */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".header-menu");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");
  const close = document.getElementById("menuClose");

  if (!menuButton || !menu || !overlay) return;

  function setMenu(open){
    menu.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  }

  menuButton.addEventListener("click", () => setMenu(true));
  close?.addEventListener("click", () => setMenu(false));
  overlay.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", e => { if(e.key === "Escape") setMenu(false); });

  document.querySelectorAll("[data-menu-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.menuCategory;
      const tab = document.querySelector(`.category-nav a[data-category="${category}"]`);
      if(tab) tab.click();
      setMenu(false);
    });
  });
});
