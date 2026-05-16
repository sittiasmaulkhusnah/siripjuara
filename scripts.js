document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.getElementById('bsWrapper');
  const track   = document.getElementById('bsTrack');
  if (!wrapper || !track) return;

  const TOTAL = 7;
  let startX  = 0;
  let isDown  = false;
  let current = TOTAL + 1; // mulai di duplikat set tengah, index bs2

  // tambah duplikat otomatis via JS
  const originals = Array.from(track.querySelectorAll('.bs-item'));
  
  // clone 7 item, taruh di depan
  originals.slice().reverse().forEach(item => {
    track.insertBefore(item.cloneNode(true), track.firstChild);
  });
  
  // clone 7 item, taruh di belakang
  originals.forEach(item => {
    track.appendChild(item.cloneNode(true));
  });

  // sekarang total 21 item: [7 clone] [7 asli] [7 clone]
  const items = Array.from(track.querySelectorAll('.bs-item'));

  function itemW() { return window.innerWidth * 0.42; }

  function goTo(index, animate) {
    current = index;

    track.style.transition = animate
      ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';

    const x = (wrapper.offsetWidth / 2) - (current * itemW()) - (itemW() / 2);
    track.style.transform = `translateX(${x}px)`;

    items.forEach((item, i) => item.classList.toggle('active', i === current));

    // setelah animasi selesai, jump ke set tengah tanpa animasi
    if (animate) {
      setTimeout(() => {
        if (current <= TOTAL - 1) {
          // terlalu kiri, jump ke set tengah
          current = current + TOTAL;
          track.style.transition = 'none';
          const x2 = (wrapper.offsetWidth / 2) - (current * itemW()) - (itemW() / 2);
          track.style.transform = `translateX(${x2}px)`;
          items.forEach((item, i) => item.classList.toggle('active', i === current));
        } else if (current >= TOTAL * 2) {
          // terlalu kanan, jump ke set tengah
          current = current - TOTAL;
          track.style.transition = 'none';
          const x2 = (wrapper.offsetWidth / 2) - (current * itemW()) - (itemW() / 2);
          track.style.transform = `translateX(${x2}px)`;
          items.forEach((item, i) => item.classList.toggle('active', i === current));
        }
      }, 520);
    }
  }

  wrapper.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.clientX;
    wrapper.style.cursor = 'grabbing';
    e.preventDefault();
  });

  wrapper.addEventListener('mouseup', e => {
    if (!isDown) return;
    isDown = false;
    wrapper.style.cursor = 'grab';
    const diff = e.clientX - startX;
    if (diff < -30) goTo(current + 1, true);
    else if (diff > 30) goTo(current - 1, true);
  });

  wrapper.addEventListener('mouseleave', e => {
    if (!isDown) return;
    isDown = false;
    wrapper.style.cursor = 'grab';
    const diff = e.clientX - startX;
    if (diff < -30) goTo(current + 1, true);
    else if (diff > 30) goTo(current - 1, true);
  });

  wrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -30) goTo(current + 1, true);
    else if (diff > 30) goTo(current - 1, true);
  });

 // klik item untuk pindah
  track.addEventListener('click', e => {
    const clickedItem = e.target.closest('.bs-item');
    if (!clickedItem) return;
    
    const index = items.indexOf(clickedItem);
    if (index === current) return; // klik tengah, tidak geser
    
    // cek posisi visual: kanan atau kiri dari tengah?
    const clickedRect = clickedItem.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
    
    if (clickedRect.left + clickedRect.width / 2 > wrapperCenter) {
      goTo(current + 1, true); // posisi visual di kanan → geser kanan
    } else {
      goTo(current - 1, true); // posisi visual di kiri → geser kiri
    }
  });

  window.addEventListener('resize', () => goTo(current, false));
  goTo(TOTAL + 1, false); // bs2 di tengah
});

///responsive
/* ============================================================
   mobile-fixes.js — tambahkan SEBELUM </body> di index.html
   Atau paste ke dalam <script> yang sudah ada di bawah
   ============================================================ */

// ── HAMBURGER MENU ──────────────────────────────────────────
(function () {
  // Inject hamburger button ke header-inner
  const headerInner = document.querySelector('.header-inner');
  if (!headerInner) return;

  // Buat hamburger button
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  headerInner.appendChild(hamburger);

  // Buat mobile nav drawer
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <button class="mobile-nav-close" aria-label="Tutup">✕</button>
    <a href="index.html">HOME</a>
    <a href="shop.html">SHOP</a>
    <a href="careguide.html">CARE GUIDE</a>
    <a href="about.html">ABOUT</a>
    <a href="support1.html">FAQ</a>
    <a href="support2.html">CONTACT</a>
    <a href="Signup.html" class="mobile-auth" id="mobileAuthBtn">SIGN UP</a>
  `;
  document.body.appendChild(mobileNav);

  // Toggle buka/tutup
  function openNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });
  mobileNav.querySelector('.mobile-nav-close').addEventListener('click', closeNav);

  // Tutup kalau klik link
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // Active page di mobile nav
  const current = location.pathname.split('/').pop() || 'index.html';
  mobileNav.querySelectorAll('a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current) link.classList.add('active-page');
  });

  // Sync auth state di mobile nav
  const loggedIn = localStorage.getItem('sj_loggedIn') === 'true';
  const mobileAuthBtn = document.getElementById('mobileAuthBtn');
  if (mobileAuthBtn && loggedIn) {
    mobileAuthBtn.href = 'profil.html';
    mobileAuthBtn.textContent = 'PROFIL';
  }
})();

// ── BEST SELLER SLIDER ───────────────────────────────────────
(function () {
  const track   = document.getElementById('bsTrack');
  const wrapper = document.getElementById('bsWrapper');
  if (!track || !wrapper) return;

  // Bersihkan duplikat nested track (bug di HTML asli)
  const nestedTrack = track.querySelector('#bsTrack');
  if (nestedTrack) {
    // Pindahkan item dari nested ke parent, hapus nested
    while (nestedTrack.firstChild) {
      track.appendChild(nestedTrack.firstChild);
    }
    nestedTrack.remove();
  }

  const items = Array.from(track.querySelectorAll('.bs-item'));
  if (items.length === 0) return;

  // Duplikat items untuk loop infinite
  const clones = items.map(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
    return clone;
  });
  const allItems = [...items, ...clones];

  const itemWidth = () => wrapper.offsetWidth * 0.42 || 400;
  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let autoTimer;

  function getOffset(idx) {
    const iw = itemWidth();
    const center = wrapper.offsetWidth / 2;
    return center - iw / 2 - idx * iw;
  }

  function goTo(idx, animate = true) {
    // Loop infinite
    if (idx >= items.length) idx = 0;
    if (idx < 0) idx = items.length - 1;
    currentIndex = idx;

    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
    track.style.transform = `translateX(${getOffset(idx)}px)`;

    allItems.forEach((item, i) => {
      item.classList.toggle('active', i % items.length === idx);
    });
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  // Auto play
  function startAuto() { autoTimer = setInterval(next, 2800); }
  function stopAuto()  { clearInterval(autoTimer); }

  // Drag / swipe
  wrapper.addEventListener('mousedown',  e => { isDragging = true; startX = e.clientX; stopAuto(); });
  wrapper.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; stopAuto(); }, { passive: true });

  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
    startAuto();
  });

  wrapper.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
    startAuto();
  });

  // Klik item
  allItems.forEach((item, i) => {
    item.addEventListener('click', () => goTo(i % items.length));
  });

  // Init
  goTo(0, false);
  startAuto();

  // Recalc saat resize
  window.addEventListener('resize', () => goTo(currentIndex, false));
})();