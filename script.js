/* =========================================================
   EDITKARO.IN — SCRIPT (v3 — inline video previews)
   Each category gets a unique, directly-hosted MP4 preview.
   No YouTube. No iframes. Pure <video> tags, plays on page.
   ========================================================= */

(function(){
  'use strict';

  /* ---------------------------------------------------------
     FREE-TO-USE MP4 VIDEO SOURCES — unique per category
     IMPORTANT: each link below was opened individually and the
     real playable file URL was copied straight off the page —
     no guessed/pattern-built URLs this time (that's what broke
     last time: Mixkit's newer uploads use a hashed CDN path,
     not the old /videos/{id}/{id}-720.mp4 pattern, so a couple
     of guesses 404'd). Sources: Mixkit (Mixkit Stock Video Free
     License — commercial OK) and Pixabay (Pixabay Content
     License — commercial OK, no attribution). All nine are
     distinct clips. These are placeholders standing in for the
     agency's own reels — swap them for real client footage
     whenever you have it.
  --------------------------------------------------------- */
  const VIDEOS = {
    shortform:   'https://assets.mixkit.co/kzpqwo4jhrdyoifa6xg6kf2wst2m', // Mixkit: Young Woman Singing in the Kitchen (vertical)
    longform:    'https://assets.mixkit.co/videos/41291/41291-720.mp4',   // Mixkit: Youtuber filming with a camera on a tripod
    gaming:      'https://cdn.pixabay.com/video/2021/08/26/86462-593059278_large.mp4', // Pixabay: Controller / joystick gamer
    football:    'https://assets.mixkit.co/videos/2921/2921-720.mp4',     // Mixkit: Football player moving forward
    ecommerce:   'https://assets.mixkit.co/videos/42123/42123-720.mp4',   // Mixkit: Checking an item on a sales site on a cell phone
    documentary: 'https://assets.mixkit.co/active_storage/video_items/100174/1721166924/100174-video-720.mp4', // Mixkit: Waterfall Between Green Hills
    colorgrade:  'https://assets.mixkit.co/uajgzfv4bqnr4ytme90cnooy6iz3', // Mixkit: Reflections of Majestic Hills (cinematic)
    anime:       'https://assets.mixkit.co/c4z4nrt32brun8zg2f4q4hqea8dz', // Mixkit: Psychedelic Liquid Marble Background
    ads:         'https://assets.mixkit.co/videos/42643/42643-720.mp4',   // Mixkit: Presentation in a business meeting room
  };

  const PROJECTS = [
    {
      id:'p01', category:'shortform', label:'Short-form',
      title:'9-Second Hook Series', bg:'bg-shortform', tcode:'00:09:12:04',
      desc:'A rapid-fire Reels series built entirely around pattern-interrupt hooks for a skincare creator.'
    },
    {
      id:'p02', category:'shortform', label:'Short-form',
      title:'Founder Story Cutdowns', bg:'bg-shortform', tcode:'00:14:02:11',
      desc:'Long-form podcast clips repackaged as vertical story-driven cuts for daily posting.'
    },
    {
      id:'p03', category:'longform', label:'Long-form',
      title:'Studio Tour — Full Episode', bg:'bg-longform', tcode:'00:22:40:08',
      desc:'A 22-minute YouTube documentary walking through a creator\'s home studio build.'
    },
    {
      id:'p04', category:'longform', label:'Long-form',
      title:'Monthly Vlog Recap', bg:'bg-longform', tcode:'00:18:05:19',
      desc:'Multi-camera vlog edit with chaptered storytelling and a custom title sequence.'
    },
    {
      id:'p05', category:'gaming', label:'Gaming',
      title:'Ranked Highlights Reel', bg:'bg-gaming', tcode:'00:03:31:02',
      desc:'Clutch-moment montage synced to beat drops for a competitive FPS streamer.'
    },
    {
      id:'p06', category:'gaming', label:'Gaming',
      title:'Stream VOD Best-Of', bg:'bg-gaming', tcode:'00:11:48:23',
      desc:'Weekly best-of compilation pulled from twelve hours of stream VOD footage.'
    },
    {
      id:'p07', category:'football', label:'Football',
      title:'Match Day Highlights', bg:'bg-football', tcode:'00:02:54:17',
      desc:'Full-match footage cut down to a 45-second highlight reel within four hours of kickoff.'
    },
    {
      id:'p08', category:'football', label:'Football',
      title:'Player Spotlight Edit', bg:'bg-football', tcode:'00:01:42:09',
      desc:'A single-player highlight package built for transfer-window visibility on Instagram.'
    },
    {
      id:'p09', category:'ecommerce', label:'eCommerce',
      title:'Product Launch Ad', bg:'bg-ecommerce', tcode:'00:00:32:14',
      desc:'A 32-second conversion-focused product film for a D2C skincare launch.'
    },
    {
      id:'p10', category:'ecommerce', label:'eCommerce',
      title:'UGC Ad Compilation', bg:'bg-ecommerce', tcode:'00:00:48:06',
      desc:'Stitched creator UGC clips into a single performance ad for paid social.'
    },
    {
      id:'p11', category:'documentary', label:'Documentary',
      title:'The Artisan — Mini-Doc', bg:'bg-documentary', tcode:'00:08:16:21',
      desc:'A character-driven brand documentary profiling a small-batch furniture maker.'
    },
    {
      id:'p12', category:'colorgrade', label:'Color Grading',
      title:'Cinematic Grade Pass', bg:'bg-colorgrade', tcode:'00:05:09:03',
      desc:'A full orange-and-teal cinematic grade applied across a brand\'s flat-profile footage.'
    },
    {
      id:'p13', category:'colorgrade', label:'Color Grading',
      title:'Moody Editorial Grade', bg:'bg-colorgrade', tcode:'00:04:21:15',
      desc:'Low-contrast, desaturated editorial grade for a fashion lookbook video.'
    },
    {
      id:'p14', category:'anime', label:'Anime',
      title:'AMV — Frame Sync Edit', bg:'bg-anime', tcode:'00:03:03:01',
      desc:'A beat-synced anime music video built frame-by-frame against the track\'s drop.'
    },
    {
      id:'p15', category:'ads', label:'Ads',
      title:'Brand Campaign Film', bg:'bg-ads', tcode:'00:00:59:10',
      desc:'A 60-second hero campaign ad built for both broadcast and paid social cutdowns.'
    },
    {
      id:'p16', category:'ads', label:'Ads',
      title:'App Install Performance Ad', bg:'bg-ads', tcode:'00:00:15:08',
      desc:'A high-velocity 15-second performance ad optimized for app-install campaigns.'
    }
  ];

  /* ---------------------------------------------------------
     UTILS
  --------------------------------------------------------- */
  function pad(n){ return String(n).padStart(2,'0'); }

  function tcFromSeconds(totalSec){
    const f  = 0;
    const s  = totalSec % 60;
    const m  = Math.floor(totalSec / 60) % 60;
    const h  = Math.floor(totalSec / 3600);
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  }

  function startClock(el){
    let frame = 0;
    setInterval(()=>{
      frame++;
      const f = frame % 24;
      const totalSec = Math.floor(frame/24);
      const s = totalSec % 60;
      const m = Math.floor(totalSec/60) % 60;
      const h = Math.floor(totalSec/3600);
      el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    }, 1000/24);
  }

  /* ---------------------------------------------------------
     LOADER
  --------------------------------------------------------- */
  window.addEventListener('load', ()=>{
    const loader = document.getElementById('loader');
    const fill   = document.getElementById('loaderFill');
    const tc     = document.getElementById('loaderTc');
    let pct = 0, frame = 0;
    const iv = setInterval(()=>{
      pct += Math.random()*18 + 6;
      frame += 6;
      if(pct >= 100){
        pct = 100;
        clearInterval(iv);
        fill.style.width = '100%';
        tc.textContent = '00:00:01:00';
        setTimeout(()=>{ loader.classList.add('is-hidden'); }, 280);
      } else {
        fill.style.width = pct + '%';
        tc.textContent = `00:00:00:${pad(frame % 24)}`;
      }
    }, 110);

    // Filmstrip frames
    const filmTrack = document.getElementById('filmTrack');
    if(filmTrack){
      let html = '';
      for(let i=0; i<60; i++) html += '<span></span>';
      filmTrack.innerHTML = html + html;
    }
  });

  const liveTc = document.getElementById('liveTc');
  if(liveTc) startClock(liveTc);

  /* ---------------------------------------------------------
     SCRUB SCROLL PROGRESS
  --------------------------------------------------------- */
  const scrubFill = document.getElementById('scrubFill');
  const scrubHead = document.getElementById('scrubHead');
  function updateScrub(){
    const h = document.documentElement;
    const pct = h.scrollHeight - h.clientHeight > 0
      ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 : 0;
    if(scrubFill) scrubFill.style.width = pct + '%';
    if(scrubHead) scrubHead.style.left  = pct + '%';
  }
  document.addEventListener('scroll', updateScrub, { passive:true });
  updateScrub();

  /* ---------------------------------------------------------
     NAVBAR
  --------------------------------------------------------- */
  const navEl   = document.getElementById('nav');
  const sections = document.querySelectorAll('main > section');

  document.addEventListener('scroll', ()=>{
    if(navEl) navEl.classList.toggle('scrolled', window.scrollY > 30);
    const toTopBtn = document.getElementById('toTop');
    if(toTopBtn) toTopBtn.classList.toggle('is-visible', window.scrollY > 600);

    let current = sections[0]?.id || 'home';
    sections.forEach(sec=>{
      if(window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    document.querySelectorAll('.nav__link').forEach(link=>{
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive:true });

  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burger){
    burger.addEventListener('click', ()=>{
      const open = burger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  document.querySelectorAll('[data-nav]').forEach(link=>{
    link.addEventListener('click', ()=>{
      burger?.classList.remove('is-open');
      mobileMenu?.classList.remove('is-open');
      burger?.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    });
  });

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  let revealObserver;
  function observeReveal(){
    if(!revealObserver){
      revealObserver = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(el=> revealObserver.observe(el));
  }
  document.querySelectorAll('.section__head, .stat-card, .service-card, .why-card').forEach(el=> el.classList.add('reveal'));
  observeReveal();

  /* ---------------------------------------------------------
     RENDER PORTFOLIO BIN
     Cards show the gradient bg thumbnail.
     On hover the <video> muted-autoplay preview fades in.
     On click the modal opens with full controls + sound.
  --------------------------------------------------------- */
  const bin = document.getElementById('bin');

  function cardTemplate(p){
    const src = VIDEOS[p.category] || '';
    return `
      <article class="card reveal" data-category="${p.category}" data-id="${p.id}"
               tabindex="0" role="button" aria-label="Preview ${p.title}">
        <div class="card__thumb">
          <div class="card__thumb-bg ${p.bg}"></div>
          <video class="card__preview" src="${src}" muted playsinline preload="none"
                 loop tabindex="-1" aria-hidden="true"></video>
          <span class="card__tc">${p.tcode}</span>
          <span class="card__cat">${p.label}</span>
          <span class="card__live" aria-hidden="true"><span class="card__live-dot"></span>Preview</span>
          <span class="card__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          </span>
        </div>
        <div class="card__info">
          <h3 class="card__title">${p.title}</h3>
          <p class="card__desc">${p.desc}</p>
        </div>
      </article>`;
  }

  function renderBin(){
    if(!bin) return;
    bin.innerHTML = PROJECTS.map(cardTemplate).join('');
    observeReveal();
    attachCardHoverPreviews();
    attachCardClickEvents();
  }
  renderBin();

  /* Hover → muted silent preview inside the card thumbnail */
  function attachCardHoverPreviews(){
    document.querySelectorAll('.card').forEach(card=>{
      const vid = card.querySelector('.card__preview');
      if(!vid) return;
      card.addEventListener('mouseenter', ()=>{
        vid.currentTime = 0;
        vid.play().catch(()=>{});
      });
      card.addEventListener('mouseleave', ()=>{
        vid.pause();
        vid.currentTime = 0;
      });
    });
  }

  /* ---------------------------------------------------------
     FILTERING
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');

  function applyFilter(key){
    filterBtns.forEach(b=> b.classList.toggle('active', b.dataset.filter === key));
    const count = key === 'all'
      ? PROJECTS.length
      : PROJECTS.filter(p=> p.category === key).length;
    const countEl = document.getElementById('filterCount');
    if(countEl) countEl.textContent = `${count} project${count !== 1 ? 's' : ''}`;

    document.querySelectorAll('.card').forEach(card=>{
      const match = key === 'all' || card.dataset.category === key;
      const vid = card.querySelector('.card__preview');
      if(!match){
        card.classList.add('hide');
        vid?.pause();
      } else {
        card.classList.remove('hide');
        requestAnimationFrame(()=> card.classList.add('is-visible'));
      }
    });
  }

  filterBtns.forEach(btn=>{
    btn.addEventListener('click', ()=> applyFilter(btn.dataset.filter));
  });

  document.querySelectorAll('[data-filter-link]').forEach(link=>{
    link.addEventListener('click', ()=>{
      const key = link.dataset.filterLink;
      setTimeout(()=> applyFilter(key), 350);
    });
  });

  const countEl = document.getElementById('filterCount');
  if(countEl) countEl.textContent = `${PROJECTS.length} projects`;

  /* ---------------------------------------------------------
     VIDEO MODAL — inline <video> with full controls + audio
     Uses the same category MP4, different from the silent hover preview.
  --------------------------------------------------------- */
  const modal        = document.getElementById('videoModal');
  const modalVideoEl = document.getElementById('modalVideoEl');
  const modalCat     = document.getElementById('modalCat');
  const modalTitle   = document.getElementById('modalTitle');
  const modalDesc    = document.getElementById('modalDesc');
  const modalTcEl    = document.getElementById('modalTc');
  let lastFocused    = null;
  let tcInterval     = null;

  function startModalTc(videoEl){
    clearInterval(tcInterval);
    tcInterval = setInterval(()=>{
      if(!videoEl.paused && !videoEl.ended){
        modalTcEl.textContent = tcFromSeconds(Math.floor(videoEl.currentTime));
      }
    }, 1000/24);
  }

  function openModal(p){
    lastFocused = document.activeElement;
    if(modalCat)   modalCat.textContent   = p.label;
    if(modalTitle) modalTitle.textContent = p.title;
    if(modalDesc)  modalDesc.textContent  = p.desc;
    if(modalTcEl)  modalTcEl.textContent  = p.tcode;

    const src = VIDEOS[p.category] || '';
    if(modalVideoEl){
      modalVideoEl.src = src;
      modalVideoEl.load();
      modalVideoEl.play().catch(()=>{});
      modalVideoEl.addEventListener('timeupdate', ()=>{
        if(modalTcEl) modalTcEl.textContent = tcFromSeconds(Math.floor(modalVideoEl.currentTime));
      });
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose')?.focus();
  }

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    clearInterval(tcInterval);
    if(modalVideoEl){ modalVideoEl.pause(); modalVideoEl.src = ''; }
    if(lastFocused) lastFocused.focus();
  }

  function attachCardClickEvents(){
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const p = PROJECTS.find(pr=> pr.id === card.dataset.id);
        if(p) openModal(p);
      });
      card.addEventListener('keydown', e=>{
        if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.click(); }
      });
    });
  }

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  /* ---------------------------------------------------------
     ANIMATED COUNTERS
  --------------------------------------------------------- */
  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ animateCounter(entry.target); statObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-card__num').forEach(el=> statObserver.observe(el));

  /* ---------------------------------------------------------
     BEFORE/AFTER GRADE SLIDER
  --------------------------------------------------------- */
  const gradeSlider = document.getElementById('gradeSlider');
  const gradeHandle = document.getElementById('gradeHandle');
  function setGrade(pct){
    pct = Math.max(4, Math.min(96, pct));
    gradeHandle.style.left = pct + '%';
    gradeSlider.querySelector('.hero__grade-before').style.clipPath = `inset(0 ${100-pct}% 0 0)`;
  }
  let dragging = false;
  function pointerToPct(clientX){
    const rect = gradeSlider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }
  if(gradeSlider && gradeHandle){
    gradeHandle.addEventListener('pointerdown', e=>{ dragging = true; gradeHandle.setPointerCapture(e.pointerId); });
    gradeSlider.addEventListener('pointermove', e=>{ if(dragging) setGrade(pointerToPct(e.clientX)); });
    window.addEventListener('pointerup', ()=> dragging = false);
    gradeSlider.addEventListener('click', e=>{ if(!dragging) setGrade(pointerToPct(e.clientX)); });
    let autoSweep = true;
    gradeSlider.addEventListener('pointerdown', ()=> autoSweep = false);
    let t = 0;
    (function sweep(){ if(!autoSweep) return; t += 0.012; setGrade(50 + Math.sin(t)*26); requestAnimationFrame(sweep); })();
  }

  /* ---------------------------------------------------------
     TESTIMONIALS CAROUSEL (touch support)
  --------------------------------------------------------- */
  const testiTrack    = document.getElementById('testiTrack');
  const testiDotsWrap = document.getElementById('testiDots');
  const slides = testiTrack ? testiTrack.children.length : 0;
  let activeSlide = 0, testiTimer;

  function goToSlide(i){
    activeSlide = (i + slides) % slides;
    testiTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
    if(testiDotsWrap) [...testiDotsWrap.children].forEach((d,idx)=> d.classList.toggle('active', idx===activeSlide));
  }
  function startTesti(){ clearInterval(testiTimer); testiTimer = setInterval(()=> goToSlide(activeSlide+1), 5500); }

  if(testiTrack && testiDotsWrap){
    for(let i=0; i<slides; i++){
      const dot = document.createElement('button');
      dot.setAttribute('aria-label','Go to testimonial '+(i+1));
      dot.addEventListener('click',()=>{ clearInterval(testiTimer); goToSlide(i); startTesti(); });
      testiDotsWrap.appendChild(dot);
    }
    goToSlide(0); startTesti();

    let touchStartX = 0;
    testiTrack.addEventListener('touchstart', e=>{ touchStartX = e.touches[0].clientX; }, { passive:true });
    testiTrack.addEventListener('touchend', e=>{
      const diff = touchStartX - e.changedTouches[0].clientX;
      if(Math.abs(diff) > 50){ clearInterval(testiTimer); goToSlide(diff>0 ? activeSlide+1 : activeSlide-1); startTesti(); }
    }, { passive:true });
  }

  /* ---------------------------------------------------------
     CONTACT FORM
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote    = document.getElementById('formNote');
  const submitLabel = document.getElementById('submitLabel');
  if(contactForm){
    contactForm.addEventListener('submit', e=>{
      e.preventDefault();
      if(!contactForm.checkValidity()){
        if(formNote){ formNote.textContent='Please fill in every field before sending.'; formNote.style.color='var(--orange)'; }
        contactForm.reportValidity(); return;
      }
      if(submitLabel) submitLabel.textContent = 'Sending…';
      if(formNote){ formNote.textContent=''; formNote.style.color=''; }
      setTimeout(()=>{
        if(submitLabel) submitLabel.textContent = 'Send Brief';
        if(formNote){ formNote.style.color='var(--teal-soft)'; formNote.textContent='✓ Brief received — we reply within one business day.'; }
        contactForm.reset();
      }, 1100);
    });
  }

  /* BACK TO TOP */
  const toTop = document.getElementById('toTop');
  if(toTop) toTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

  /* FOOTER YEAR */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* CURSOR GLOW */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let glowRaf;
  document.addEventListener('mousemove', e=>{
    cancelAnimationFrame(glowRaf);
    glowRaf = requestAnimationFrame(()=>{ glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px'; });
  });

})();
