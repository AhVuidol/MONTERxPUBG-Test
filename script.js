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
            Nếu Link Trực Tiếp Cài Lỗi<br><br>
            Hãy Cài Link iPA
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
            Cài Đúng iPA<br><br>
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
/* ===========================
      GALAXY 3D EFFECT
=========================== */

const galaxy = document.getElementById("galaxy");

const galaxyColors = [
"#9d4dff",
"#00d4ff",
"#ffffff",
"#6f6cff",
"#7b2fff"
];

function createGalaxyStar(){

    if(!galaxy) return;

    const star = document.createElement("div");

    star.className="star";

    const size=Math.random()*5+2;

    star.style.width=size+"px";
    star.style.height=size+"px";

    star.style.left=Math.random()*100+"vw";

    const color=galaxyColors[
        Math.floor(Math.random()*galaxyColors.length)
    ];

    star.style.background=color;

    star.style.boxShadow=`
    0 0 ${size*2}px ${color},
    0 0 ${size*6}px ${color}
    `;

    const duration=4+Math.random()*5;

    star.style.animationDuration=duration+"s";

    galaxy.appendChild(star);

    setTimeout(()=>{
        star.remove();
    },duration*1000);

}

setInterval(createGalaxyStar,120);

/* ===========================
   MONTERxPUBG UI REDESIGN
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = [...document.querySelectorAll(".category-bar a[data-target]")];
  const sections = {
    pubg: document.getElementById("pubg"),
    lqm: document.getElementById("lqm"),
    ff: document.getElementById("ff"),
    other: document.getElementById("other")
  };

  function showCategory(target, scroll = true) {
    Object.entries(sections).forEach(([key, section]) => {
      if (!section) return;
      section.classList.toggle("category-hidden", key !== target);
    });
    tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.target === target));

    if (scroll && sections[target]) {
      const nav = document.querySelector(".category-bar");
      const y = Math.max(
        0,
        sections[target].getBoundingClientRect().top +
        window.scrollY -
        (nav?.offsetHeight || 0) - 12
      );
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      showCategory(tab.dataset.target);
      history.replaceState(null, "", "#" + tab.dataset.target);
    });
  });

  const menuToggle = document.getElementById("menuToggle");
  const menuDrawer = document.getElementById("menuDrawer");
  const menuClose = document.getElementById("menuClose");
  const menuBackdrop = document.getElementById("menuBackdrop");

  function closeMenu() {
    menuDrawer?.classList.remove("open");
    menuDrawer?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    menuDrawer?.classList.add("open");
    menuDrawer?.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  }

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  menuBackdrop?.addEventListener("click", closeMenu);

  menuDrawer?.querySelectorAll("a[data-target]").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      closeMenu();
      showCategory(a.dataset.target);
      history.replaceState(null, "", "#" + a.dataset.target);
    });
  });

  const initial = location.hash.replace("#", "");
  showCategory(sections[initial] ? initial : "lqm", false);
});
