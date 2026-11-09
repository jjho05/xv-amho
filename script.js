/**
 * XV Años - Argelia Margarita Hernández Olvera
 * Lógica Interactiva y Animaciones de Alta Gama (Luxury Edition)
 */

let eventData = getSavedEventData();
let audioInstance = null;
let isAudioPlaying = false;
let guestPasses = 2;
let attendanceConfirmed = true;

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  renderAllEventData();
  initAmbientSparkles();
  initEnvelopeInteraction();
  initAudio();
  initCountdown();
  initRSVPForm();
  initScrollAnimations();
});

/* ==========================================================================
   PARTÍCULAS DORADAS AMBIENTALES (CANVAS)
   ========================================================================== */

function initAmbientSparkles() {
  const canvas = document.getElementById("sparkles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 35));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.2,
      pulsing: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? "#d4af37" : "#f7ccd6"
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulsing) * 0.008;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(0.8, p.alpha));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Destello sutil
      if (p.radius > 1.8) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - p.radius * 2, p.y);
        ctx.lineTo(p.x + p.radius * 2, p.y);
        ctx.moveTo(p.x, p.y - p.radius * 2);
        ctx.lineTo(p.x, p.y + p.radius * 2);
        ctx.stroke();
      }
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   RENDER DE DATOS DEL EVENTO
   ========================================================================== */

function renderAllEventData() {
  document.body.className = `theme-${eventData.tema}`;

  document.querySelectorAll(".dyn-quinceanera-name").forEach(el => el.textContent = eventData.quinceanera.nombre);
  document.querySelectorAll(".dyn-quinceanera-lastname").forEach(el => el.textContent = eventData.quinceanera.apellidos);
  document.querySelectorAll(".dyn-monogram").forEach(el => el.textContent = eventData.quinceanera.monograma || "AM");
  document.querySelectorAll(".dyn-frase").forEach(el => el.textContent = eventData.quinceanera.frase);
  
  // Padres y Padrinos
  const hostsSection = document.getElementById("hosts-section");
  if (hostsSection) {
    if (eventData.padres.mostrar || eventData.padrinos.mostrar) {
      hostsSection.style.display = "block";
      const padresEl = document.getElementById("dyn-padres");
      const padrinosEl = document.getElementById("dyn-padrinos");
      if (padresEl) padresEl.textContent = `${eventData.padres.papa} & ${eventData.padres.mama}`;
      if (padrinosEl) padrinosEl.textContent = `${eventData.padrinos.padrino} & ${eventData.padrinos.madrina}`;
    } else {
      hostsSection.style.display = "none";
    }
  }

  // Fecha y Horarios
  document.querySelectorAll(".dyn-fecha-display").forEach(el => el.textContent = eventData.evento.fechaDisplay);
  document.querySelectorAll(".dyn-hora-misa").forEach(el => el.textContent = eventData.evento.horaMisa);
  document.querySelectorAll(".dyn-hora-recepcion").forEach(el => el.textContent = eventData.evento.horaRecepcion);

  // Lugares: Misa (Anexo Grand Royal)
  const misaName = document.getElementById("dyn-misa-lugar");
  const misaDir = document.getElementById("dyn-misa-dir");
  const misaMaps = document.getElementById("dyn-misa-maps");
  const misaWaze = document.getElementById("dyn-misa-waze");
  if (misaName) misaName.textContent = eventData.ceremonia.lugar;
  if (misaDir) misaDir.textContent = `${eventData.ceremonia.direccion} · ${eventData.ceremonia.ciudad}`;
  if (misaMaps) misaMaps.href = eventData.ceremonia.googleMapsUrl;
  if (misaWaze) misaWaze.href = eventData.ceremonia.wazeUrl;

  // Lugares: Recepción (Salón Camelia Hotel Grand Royal)
  const recepcionName = document.getElementById("dyn-recepcion-lugar");
  const recepcionDir = document.getElementById("dyn-recepcion-dir");
  const recepcionMaps = document.getElementById("dyn-recepcion-maps");
  const recepcionWaze = document.getElementById("dyn-recepcion-waze");
  if (recepcionName) recepcionName.textContent = eventData.recepcion.lugar;
  if (recepcionDir) recepcionDir.textContent = `${eventData.recepcion.direccion} · ${eventData.recepcion.ciudad}`;
  if (recepcionMaps) recepcionMaps.href = eventData.recepcion.googleMapsUrl;
  if (recepcionWaze) recepcionWaze.href = eventData.recepcion.wazeUrl;

  // Dress Code
  const dressType = document.getElementById("dyn-dress-tipo");
  if (dressType) dressType.textContent = eventData.dressCode.tipo;

  // Regalos
  const sobreMsg = document.getElementById("dyn-sobre-msg");
  if (sobreMsg) sobreMsg.textContent = eventData.regalos.mensajeSobres;

  // RSVP Fecha Límite
  const rsvpLimite = document.getElementById("dyn-rsvp-limite");
  if (rsvpLimite) rsvpLimite.textContent = `Favor de confirmar antes del ${eventData.rsvp.fechaLimite}`;

  // Itinerario Dinámico
  renderItinerario();
}

function renderItinerario() {
  const container = document.getElementById("dyn-timeline-container");
  if (!container || !eventData.itinerario) return;

  container.innerHTML = eventData.itinerario.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-time">${item.hora}</div>
        <div class="timeline-title">${item.titulo}</div>
        <div class="timeline-desc">${item.desc}</div>
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   INTERACCIÓN CINEMATOGRÁFICA DEL SOBRE 3D
   ========================================================================== */

function initEnvelopeInteraction() {
  const envelopeScreen = document.getElementById("envelope-screen");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const openCtaBtn = document.getElementById("open-invitation-btn");
  const envelopeSeal = document.getElementById("envelope-seal");
  const invitationMain = document.getElementById("invitation-main");

  // Bloqueo de scroll asegurado mientras el sobre permanezca cerrado
  document.body.classList.add("envelope-locked");

  const openEnvelope = (e) => {
    if (e) e.stopPropagation();
    if (!envelopeScreen || envelopeScreen.classList.contains("opening") || envelopeScreen.classList.contains("opened")) return;

    // 1. Sonido celestial
    playChimeSound();

    // 2. Comienza la apertura física en 3D
    envelopeScreen.classList.add("opening");

    // 3. Iniciar música de fondo de inmediato con fade-in suave
    startMusic();

    // 4. Lluvia coreografiada de confeti y destellos
    setTimeout(() => {
      triggerConfetti();
    }, 400);

    setTimeout(() => {
      triggerConfetti();
    }, 850);

    // 5. Desvanecer suavemente el sobre una vez que la carta fue admirada
    setTimeout(() => {
      envelopeScreen.classList.add("fading-out");
    }, 1350);

    // 6. Culminar transición: desmontar sobre y revelar invitación completa sin colisión visual
    setTimeout(() => {
      envelopeScreen.classList.add("opened");
      envelopeScreen.style.display = "none";
      if (invitationMain) invitationMain.classList.add("revealed");
      document.body.classList.remove("envelope-locked");
      window.scrollTo(0, 0);
    }, 1680);
  };

  if (envelopeWrapper) envelopeWrapper.addEventListener("click", openEnvelope);
  if (openCtaBtn) openCtaBtn.addEventListener("click", openEnvelope);
  if (envelopeSeal) envelopeSeal.addEventListener("click", openEnvelope);
}

/* Confeti Dorado y Pétalos con canvas-confetti */
function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.65 },
      colors: ["#d4af37", "#f7ccd6", "#ffffff", "#e8a2b5", "#f9e7b8"]
    });

    confetti({
      particleCount: 35,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.75 },
      colors: ["#d4af37", "#f7ccd6", "#ffffff"]
    });

    confetti({
      particleCount: 35,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.75 },
      colors: ["#d4af37", "#f7ccd6", "#ffffff"]
    });
  }
}

/* ==========================================================================
   SISTEMA DE AUDIO
   ========================================================================== */

function initAudio() {
  const musicBtn = document.getElementById("floating-music-btn");
  if (!musicBtn) return;

  musicBtn.addEventListener("click", toggleMusic);
}

function startMusic() {
  if (!eventData.musica || !eventData.musica.activa) return;

  const musicBtn = document.getElementById("floating-music-btn");

  if (!audioInstance) {
    const audioSrc = eventData.musica.localAudio || eventData.musica.audioUrl;
    audioInstance = new Audio(audioSrc);
    audioInstance.loop = true;
    audioInstance.volume = 0.6;

    audioInstance.addEventListener("error", () => {
      if (audioInstance.src !== eventData.musica.audioUrl) {
        audioInstance.src = eventData.musica.audioUrl;
        audioInstance.play().catch(() => playAmbientArpeggio());
      }
    });
  }

  audioInstance.play().then(() => {
    isAudioPlaying = true;
    if (musicBtn) {
      musicBtn.classList.add("playing");
      musicBtn.title = "Pausar música (" + eventData.musica.cancion + ")";
    }
  }).catch(() => {
    playAmbientArpeggio();
    isAudioPlaying = true;
    if (musicBtn) musicBtn.classList.add("playing");
  });
}

function toggleMusic() {
  const musicBtn = document.getElementById("floating-music-btn");

  if (isAudioPlaying) {
    if (audioInstance) audioInstance.pause();
    isAudioPlaying = false;
    if (musicBtn) {
      musicBtn.classList.remove("playing");
      musicBtn.title = "Reproducir música";
    }
    showToast("Música pausada");
  } else {
    if (audioInstance) {
      audioInstance.play().catch(() => playAmbientArpeggio());
    } else {
      startMusic();
    }
    isAudioPlaying = true;
    if (musicBtn) {
      musicBtn.classList.add("playing");
      musicBtn.title = "Pausar música";
    }
    showToast("Reproduciendo: Quédate (Soy Luna)");
  }
}

/* Sonido de arpegio celestial con Web Audio API */
function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.9);
    });
  } catch (e) {}
}

function playAmbientArpeggio() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const chords = [
      [392.00, 493.88, 587.33, 783.99], // G major
      [293.66, 369.99, 440.00, 587.33], // D major
      [246.94, 293.66, 369.99, 493.88], // B minor
      [220.00, 277.18, 329.63, 440.00]  // A major
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (!isAudioPlaying) {
        clearInterval(interval);
        return;
      }
      const chord = chords[Math.floor(step / 4) % chords.length];
      const freq = chord[step % 4];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);
      step++;
    }, 550);
  } catch (e) {}
}

/* ==========================================================================
   CUENTA REGRESIVA (COUNTDOWN TIMER)
   ========================================================================== */

function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function update() {
    const target = new Date(eventData.evento.fechaISO).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);

  const addCalBtn = document.getElementById("add-calendar-btn");
  if (addCalBtn) {
    addCalBtn.addEventListener("click", downloadCalendarFile);
  }
}

function downloadCalendarFile() {
  const startDate = new Date(eventData.evento.fechaISO);
  const endDate = new Date(startDate.getTime() + 8 * 60 * 60 * 1000);

  const formatICSDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XV Años Argelia Margarita//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:XV Años de ${eventData.quinceanera.nombre} ${eventData.quinceanera.apellidos}`,
    `DESCRIPTION:Ceremonia: ${eventData.ceremonia.lugar} (6:00 PM)\\nRecepción: ${eventData.recepcion.lugar} (7:00 PM)\\nHotel Grand Royal Tampico`,
    `LOCATION:${eventData.recepcion.lugar}, ${eventData.recepcion.direccion}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `XV_${eventData.quinceanera.nombre.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Fecha agregada a tu calendario");
}

/* ==========================================================================
   FORMULARIO RSVP & PASE PERSONALIZADO DINÁMICO
   ========================================================================== */

function initRSVPForm() {
  const btnYes = document.getElementById("btn-attend-yes");
  const btnNo = document.getElementById("btn-attend-no");
  const rsvpSubmitBtn = document.getElementById("rsvp-submit-btn");
  const guestNameInput = document.getElementById("rsvp-guest-name");

  if (btnYes && btnNo) {
    btnYes.addEventListener("click", () => {
      attendanceConfirmed = true;
      btnYes.classList.add("active");
      btnNo.classList.remove("active");
    });

    btnNo.addEventListener("click", () => {
      attendanceConfirmed = false;
      btnNo.classList.add("active");
      btnYes.classList.remove("active");
    });
  }

  if (rsvpSubmitBtn) {
    rsvpSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const guestName = guestNameInput ? guestNameInput.value.trim() : "";

      if (!guestName) {
        alert("Por favor escribe tu nombre completo antes de confirmar.");
        if (guestNameInput) guestNameInput.focus();
        return;
      }

      const estadoTexto = attendanceConfirmed 
        ? "¡Sí, asistiré con mucho gusto a celebrar esta gran noche!" 
        : "Lamentablemente no podré asistir, pero les deseo lo mejor en este gran día.";

      const mensaje = `¡Hola! Confirmo mi respuesta para los XV Años de *${eventData.quinceanera.nombre} ${eventData.quinceanera.apellidos}*:\n\n` +
        `👤 *Invitado:* ${guestName}\n` +
        `🎟️ *Pases:* 1 lugar\n` +
        `✨ *Confirmación:* ${estadoTexto}\n\n` +
        `¡Muchas felicidades!`;

      // Formatear y asegurar código de país para México (52 + 10 dígitos)
      let phone = (eventData.rsvp.telefonoWhatsApp || "528332315716").replace(/\D/g, "");
      if (phone.length === 10) {
        phone = "52" + phone;
      }

      const urlWhatsApp = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;

      if (attendanceConfirmed) {
        triggerConfetti();
      }

      window.open(urlWhatsApp, "_blank");
    });
  }
}

/* ==========================================================================
   ANIMACIONES AL SCROLLEAR (INTERSECTION OBSERVER)
   ========================================================================== */

function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;

  // Solo animar secciones secundarias debajo de la cabecera y el countdown
  const animatableSections = document.querySelectorAll(
    ".card-sheet > section:not(.countdown-section):not(.hero-section), .invitation-footer"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  animatableSections.forEach(sec => {
    sec.classList.add("scroll-reveal");
    observer.observe(sec);
  });
}

/* ==========================================================================
   TOAST DE NOTIFICACIÓN FLOTANTE
   ========================================================================== */

function showToast(message) {
  let toast = document.getElementById("toast-notice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
