
function typeWriter(element, speed = 50) {
    const text = element.textContent;
    element.textContent = "";
    element.style.visibility = "visible";
    let i = 0;
    function typing(){
        if(i < text.length){
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

function showScreen(id) {
  document.querySelectorAll('.overlay-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// 1. transition
document.getElementById('btn-agree').addEventListener('click', () => {
  
  showScreen('loading-screen');

  const LOADING_DURATION = 2600;

  setTimeout(() => {
    showScreen('main-app');

const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    bgVideo.classList.add('show');
    bgVideo.play();
  } 

    const ambient = document.getElementById('ambient-audio');
    ambient.volume = 0.1; 
    ambient.play().catch(() => {});
    const bgmAudio = document.getElementById('bgm-audio');
    bgmAudio.volume = 0.3;
    bgmAudio.play().catch(e=>console.log(e));
    window.bgm = bgmAudio;
  }, LOADING_DURATION);
});



// bottom
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tabTarget === tabName);
  });
  if (tabName === 'messages') initMessagesOnce();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tabTarget));
});

// log
document.querySelectorAll('.log-entry').forEach(entry => {
  entry.addEventListener('click', () => {
    document.querySelectorAll('.log-entry').forEach(e => e.classList.remove('selected'));
    entry.classList.add('selected');

    if (entry.dataset.jumpTab) {
      switchTab(entry.dataset.jumpTab);
      return;
    }

    renderDetailPanel(entry.dataset);
  });
});

function renderDetailPanel(data) {
  const panel = document.getElementById('detail-panel');
  let mediaHtml = '';
  if (data.video) {
    const posterAttr = data.poster ? `poster="assets/images/${data.poster}"`: '';
    mediaHtml = `
      <div class="detail-video-wrap">
        <video controls ${posterAttr} style="width: 100%; border-radius: 12px;">
          <source src="assets/video/${data.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>`;
  } else {
    mediaHtml = `
      <div class="detail-video-wrap">
        <div class="detail-video-label">No video for this entry — audio/photo only, see description below</div>
      </div>`;
  }
  panel.innerHTML = `
    ${mediaHtml}
    <p class="detail-title">${data.title}</p>
    <p class="detail-change">${data.change}</p>
    <p class="detail-desc">${data.desc}</p>
  `;

  const vid = panel.querySelector('video');
const ambient = document.getElementById('ambient-audio');

if (vid && ambient) {

    vid.addEventListener('play', () => {
        ambient.pause();
    });

    vid.addEventListener('pause', () => {
        ambient.play().catch(() => {});
    });

    vid.addEventListener('ended', () => {
        ambient.play().catch(() => {});
    });

}
}

// message
let messagesInitialized = false;

const CHAT_SCRIPT = [
  { type: 'mom', text: "Hey honey, I’ve just noticed your stress level has suddenly gone up. Has it been a busy day at work?" },
  { type: 'voice', duration: '0:14', transcript: "I'm not blaming you, I'm just worried. You're all alone out there — if something happened, no one would even know." },
  { type: 'system', text: 'Checkup reminder: based on recent data, we recommend scheduling your annual health review early.' },
  { type: 'mom', text: "Go to bed early tonight, sweetie." },
  { type: 'choice' }
];



function initMessagesOnce() {
  if (messagesInitialized) return;
  messagesInitialized = true;

  const log = document.getElementById('chat-log');
  let delay = 0;
  CHAT_SCRIPT.forEach(item => {
    delay += 1500;
    setTimeout(() => renderChatItem(log, item), delay);
  });
}

function renderChatItem(log, item) {
  if (item.type === 'mom' || item.type === 'me') {
    const b = document.createElement('div');
    b.className = 'bubble ' + (item.type === 'mom' ? 'bubble--mom' : 'bubble--me');
    b.textContent = item.text;
    log.appendChild(b);
  }
  if (item.type === 'voice') {
    const b = document.createElement('div');
    b.className = 'bubble bubble--mom bubble--voice';
    b.innerHTML = `
      <button class="voice-play-btn" aria-label="Play voice message">▶</button>
      <div class="voice-wave">${randomWaveBars()}</div>
      <span class="voice-duration">${item.duration}</span>
    `;
    b.querySelector('.voice-play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      playVoiceMessage(item.transcript);
    });
    log.appendChild(b);
  }
  if (item.type === 'system') {
    const b = document.createElement('div');
    b.className = 'bubble bubble--system';
    b.textContent = item.text;
    log.appendChild(b);
  }

  log.scrollTop = log.scrollHeight;
}

function randomWaveBars() {
  let html = '';
  for (let i = 0; i < 8; i++) {
    const h = 6 + Math.round(Math.random() * 12);
    html += `<span style="height:${h}px"></span>`;
  }
  return html;
}

function playVoiceMessage(transcript) {
  const audio = document.getElementById('voice-message-audio');
  if (audio) {
    audio.volume = 0.8; 
    audio.currentTime = 0; 
    
    audio.play().catch((e) => {
      console.log('Voice audio play failed:', e);
      console.log('Voice transcript: ' + transcript);
    });
  } else {
    console.log('Voice transcript: ' + transcript);
  }
}



// news
document.querySelectorAll('.news-card').forEach(card => {
  card.addEventListener('click', () => {
    const full = document.querySelector(`[data-news-full="${card.dataset.news}"]`);
    full.hidden = !full.hidden;
  });
});

// emotion
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

const hoverSound = new Audio('assets/audio/click.mp3');
hoverSound.volume = 0.2;

function playHoverSound() {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
}

function bindHoverSound() {
  const selector = 'button, a, .log-entry, .news-card, .mood-btn, .choice-btn, .tab-btn';
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.hoverBound) return;
    el.dataset.hoverBound = 'true';
    el.addEventListener('mouseenter', playHoverSound);
  });
}
bindHoverSound();


const HAND_DRAWN_FRAMES = [
  'assets/images/frame1.png',
  'assets/images/frame2.png',
  'assets/images/frame3.png'
];
let frameIndex = 0;
setInterval(() => {
  const frameImgs = document.querySelectorAll('.hand-drawn-frame');
  frameIndex = (frameIndex + 1) % HAND_DRAWN_FRAMES.length;
  frameImgs.forEach(img => { img.src = HAND_DRAWN_FRAMES[frameIndex]; });
}, 280);


window.addEventListener("load", ()=>{

    typeWriter(document.querySelector(".consent-eyebrow"),25);

    setTimeout(()=>{
        typeWriter(document.querySelector(".consent-title"),20);
    },500);

});


const rules = document.querySelectorAll(".rules-list li");

rules.forEach((rule,index)=>{

    setTimeout(()=>{

        rule.classList.add("show");

    },2000 + index*1000);

});


// pop-up windows
const handModalImages = {
  blueSmall: 'assets/images/blue1.png',   
  orangeSmall: 'assets/images/orange1.png', 
  orangeLarge: 'assets/images/orange2.png'  
};

const moodContentMap = {
  STABLE: {
    title: "Your mood is stable.",
    desc: "Your emotional indicators remain within your usual range.<br><br>NHMS will continue to monitor your wellbeing.",
    image: handModalImages.blueSmall,
    closeColor: "#6fe7dc"
  },
  FINE: {
    title: "You’re doing well today.",
    desc: "Your current mood is consistent with your recent wellbeing indicators.<br><br>Keep doing what works for you.",
    image: handModalImages.blueSmall,
    closeColor: "#6fe7dc"
  },
  DISTRESSED: {
    title: "We noticed a change in your emotional state.",
    desc: "Your stress indicators are above your usual range today.<br><br>Would you like to review what may have contributed to this change?",
    image: handModalImages.orangeSmall,
    closeColor: "#e8a33d",
    hasAnalysis: true
  }
};

function initHandMoodModal() {
  const overlay = document.getElementById('mood-modal-overlay');
  const body = document.getElementById('mood-modal-body');
  const bgImg = document.getElementById('hand-card-bg');
  const closeBtn = document.getElementById('mood-modal-close');

  if (!overlay || !body || !bgImg) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood-btn');
    if (btn) {
      const moodKey = (btn.dataset.mood || btn.textContent).trim().toUpperCase();
      if (moodContentMap[moodKey]) {
        openModal(moodKey);
      }
    }
  });

function openModal(key) {
  const data = moodContentMap[key];

  bgImg.src = data.image;
  closeBtn.style.color = data.closeColor;

  if (key === 'DISTRESSED') {
    body.classList.add('distressed-body');
  } else {
    body.classList.remove('distressed-body');
  }

  let html = `
    <h3 class="mood-title">${data.title}</h3>
    <p class="mood-desc">${data.desc}</p>
  `;

  if (data.hasAnalysis) {
    html += `
      <div class="mood-actions" id="mood-initial-actions">
        <button class="mood-btn-action mood-btn-primary" id="btn-view-analysis">VIEW ANALYSIS</button>
        <button class="mood-btn-action mood-btn-secondary" id="btn-mood-cancel">NOT NOW</button>
      </div>
    `;
  }

  body.innerHTML = html;
  overlay.classList.add('show');

  const btnAnalysis = document.getElementById('btn-view-analysis');
  const btnCancel = document.getElementById('btn-mood-cancel');

  if (btnAnalysis) {
    btnAnalysis.addEventListener('click', showAnalysisView);
  }
  if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
  }
}

function showAnalysisView() {
  bgImg.src = handModalImages.orangeLarge;
  body.classList.remove('distressed-body');
  body.classList.add('analysis-body');

  body.innerHTML = `
    <p style="font-family:var(--font-mono); font-size:15px; color:#e8a33d; margin:0 0 6px 0;">// POSSIBLE FACTORS DETECTED</p>
    <ul class="analysis-list">
      <li>Sleep quality <span class="trend-down">↓</span></li>
      <li>Work-related stress <span class="trend-up">↑</span></li>
      <li>Resting heart rate <span class="trend-up">↑</span></li>
      <li>Prolonged sedentary time <span class="trend-up">↑</span></li>
    </ul>
    <div class="suggested-box" style="font-size:12px;">
      <strong>Suggested action:</strong><br>
      Consider taking a break and reducing your workload before bedtime.
    </div>
    <div class="mood-actions" style="margin-top:10px;">
      <button class="mood-btn-action mood-btn-secondary" style="width:100%;font-size:13px" id="btn-close-analysis">CLOSE REPORT</button>
    </div>
  `;

  document.getElementById('btn-close-analysis').addEventListener('click', closeModal);
}

function closeModal() {
  overlay.classList.remove('show');
  body.classList.remove('distressed-body');
  body.classList.remove('analysis-body');
}


  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHandMoodModal);
} else {
  initHandMoodModal();
}