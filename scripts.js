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