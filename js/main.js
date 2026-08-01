/* =====================================================================
   CONFIGURACION GENERAL
   ===================================================================== */

// TODO CLIENTE: número real de WhatsApp Business, con prefijo de país
// y SIN el símbolo "+" ni espacios. Ej: España -> "34600000000"
const WHATSAPP_NUMBER = "34655741618";

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     0. INTRO / SPLASH
     Se oculta solo tras la animación CSS; aquí solo nos aseguramos de
     quitarla del flujo de eventos cuando termina.
     =================================================================== */
  const intro = document.getElementById('intro-loader');
  if (intro) {
    intro.addEventListener('animationend', (e) => {
      if (e.animationName === 'introHold') {
        intro.style.display = 'none';
      }
    });
    // Permitir saltar la intro haciendo click/tap
    intro.addEventListener('click', () => { intro.style.display = 'none'; });
  }

  /* ===================================================================
     1. HEADER / NAV MOVIL
     =================================================================== */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.style.display === 'flex';
      mainNav.style.display = open ? 'none' : 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '100%';
      mainNav.style.right = '0';
      mainNav.style.background = 'var(--ink)';
      mainNav.style.padding = '1rem 1.5rem';
      mainNav.style.borderRadius = '0 0 12px 12px';
    });
  }

  /* ===================================================================
     2. SCROLL-STAGES: motor genérico de progreso de scroll
     Calcula, para cada .scroll-stage, un valor de 0 a 1 según cuánto
     se ha hecho scroll dentro de esa sección (con el interior "sticky").
     =================================================================== */
  const stages = Array.from(document.querySelectorAll('.scroll-stage'));

  function getProgress(stageEl) {
    const rect = stageEl.getBoundingClientRect();
    const total = stageEl.offsetHeight - window.innerHeight;
    if (total <= 0) return 1;
    const scrolled = -rect.top;
    return Math.min(1, Math.max(0, scrolled / total));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  // remapea progress dentro de un rango [from,to] a [0,1]
  function remap(p, from, to) {
    if (to === from) return p >= to ? 1 : 0;
    return clamp01((p - from) / (to - from));
  }

  /* ---------- Etapa CAMISETA ---------- */
  const stageCamiseta = document.getElementById('stage-camiseta');
  const productCamiseta = document.getElementById('product-camiseta');
  const designCamiseta = document.getElementById('design-camiseta');
  const ctaCamiseta = document.getElementById('cta-camiseta');

  function renderCamiseta(p) {
    // 0 -> 0.25: sube desde abajo
    const riseP = remap(p, 0, 0.25);
    const translateY = lerp(60, 0, riseP);
    const enterOpacity = lerp(0, 1, remap(p, 0, 0.12));
    // 0.25 -> 0.6: se aleja de la "cámara" (escala hacia abajo)
    const awayP = remap(p, 0.25, 0.6);
    const scale = lerp(1, 0.74, awayP);
    productCamiseta.style.transform = `translateY(${translateY}px) scale(${scale})`;
    productCamiseta.style.opacity = enterOpacity;

    // 0.45 -> 0.8: el diseño se fusiona con la camiseta
    const mergeP = remap(p, 0.45, 0.8);
    designCamiseta.style.opacity = lerp(0, 0.85, mergeP);
    designCamiseta.style.transform = `scale(${lerp(0.6, 1, mergeP)}) translateY(${lerp(20, 0, mergeP)}px)`;

    // CTA final
    ctaCamiseta.classList.toggle('is-visible', p > 0.86);
  }

  /* ---------- Etapa TAZA ---------- */
  const stageTaza = document.getElementById('stage-taza');
  const productTaza = document.getElementById('product-taza');
  const designTaza = document.getElementById('design-taza');
  const ctaTaza = document.getElementById('cta-taza');
  const glassCrack = document.getElementById('glass-crack');
  const stageTazaSticky = stageTaza.querySelector('.stage-sticky');
  let crackTriggered = false;

  function renderTaza(p) {
    // 0 -> 0.35: viene desde el fondo hacia la pantalla (crece)
    const approachP = remap(p, 0, 0.35);
    const scaleApproach = lerp(0.25, 1.5, approachP);
    const opacityApproach = lerp(0, 1, remap(p, 0, 0.12));

    // 0.35 -> 0.5: "choque" -> se aleja a distancia normal
    const settleP = remap(p, 0.35, 0.5);
    const scaleSettle = lerp(1.5, 1, settleP);

    const scale = approachP < 1 ? scaleApproach : scaleSettle;
    productTaza.style.transform = `scale(${scale})`;
    productTaza.style.opacity = opacityApproach;

    // Disparo del efecto "cristal roto" una sola vez al llegar al choque
    if (p >= 0.34 && p < 0.5 && !crackTriggered) {
      crackTriggered = true;
      glassCrack.classList.add('is-active');
      stageTazaSticky.classList.add('shake');
      setTimeout(() => glassCrack.classList.remove('is-active'), 550);
      setTimeout(() => stageTazaSticky.classList.remove('shake'), 450);
    }
    if (p < 0.3) crackTriggered = false; // permite re-disparar si el usuario sube y vuelve a bajar

    // 0.5 -> 0.85: silueta entra desde la derecha y se fusiona
    const mergeP = remap(p, 0.5, 0.85);
    designTaza.style.opacity = lerp(0, 0.9, mergeP);
    designTaza.style.transform = `translateX(${lerp(120, 0, mergeP)}px)`;

    ctaTaza.classList.toggle('is-visible', p > 0.88);
  }

  /* ---------- Etapa LLAVEROS ---------- */
  const stageLlaveros = document.getElementById('stage-llaveros');
  const kfRect = document.getElementById('kf-rect');
  const kfHeart = document.getElementById('kf-heart');
  const kfRound = document.getElementById('kf-round');
  const ctaLlaveros = document.getElementById('cta-llaveros');
  const keychains = [
    { el: kfRect, from: 0.05, to: 0.35, mergeFrom: 0.45, mergeTo: 0.75 },
    { el: kfHeart, from: 0.15, to: 0.45, mergeFrom: 0.5, mergeTo: 0.8 },
    { el: kfRound, from: 0.25, to: 0.55, mergeFrom: 0.55, mergeTo: 0.85 },
  ];

  function renderLlaveros(p) {
    keychains.forEach(k => {
      const enterP = remap(p, k.from, k.to);
      k.el.style.opacity = lerp(0, 1, enterP);
      const design = k.el.querySelector('.kf-design');
      const mergeP = remap(p, k.mergeFrom, k.mergeTo);
      design.style.opacity = lerp(0, 0.85, mergeP);
      design.style.transform = `scale(${lerp(0.5, 1, mergeP)})`;
    });
    ctaLlaveros.classList.toggle('is-visible', p > 0.88);
  }

  /* ---------- Versiculos (fade in/out por rango de progreso) ---------- */
  const verses = Array.from(document.querySelectorAll('.stage-verse'));
  function renderVerses(stageEl, p) {
    verses.forEach(v => {
      if (!stageEl.contains(v)) return;
      const from = parseFloat(v.dataset.showFrom);
      const to = parseFloat(v.dataset.showTo);
      v.classList.toggle('is-visible', p >= from && p <= to);
    });
  }

  /* ---------- Bucle principal de scroll (throttled con rAF) ---------- */
  let ticking = false;
  function updateAllStages() {
    if (stageCamiseta) { const p = getProgress(stageCamiseta); renderCamiseta(p); renderVerses(stageCamiseta, p); }
    if (stageTaza) { const p = getProgress(stageTaza); renderTaza(p); }
    if (stageLlaveros) { const p = getProgress(stageLlaveros); renderLlaveros(p); }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateAllStages); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateAllStages);
  updateAllStages(); // estado inicial

  /* ===================================================================
     3. BOTONES "IR A PERSONALIZAR" (desde los CTA de cada etapa)
     =================================================================== */
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.goto;
      const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${targetId.slice(1)}"]`);
      if (targetTabBtn) targetTabBtn.click();
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ===================================================================
     4. TABS PRINCIPALES DE PERSONALIZACION
     =================================================================== */
  document.querySelectorAll('.tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
      tabBtn.classList.add('is-active');
      tabBtn.setAttribute('aria-selected', 'true');
      document.getElementById(tabBtn.dataset.tab).classList.add('is-active');
    });
  });

  /* Sub-tabs (Delante / Detrás) dentro de camiseta y llaveros */
  document.querySelectorAll('.preview-subtabs').forEach(group => {
    const buttons = group.querySelectorAll('.subtab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const side = btn.dataset.side;
        const mockup = group.closest('.panel-preview').querySelector('.mockup');
        mockup.querySelectorAll('.print-zone, .llavero-zone').forEach(z => {
          z.classList.toggle('is-hidden', z.dataset.side !== side);
        });
        // Mostrar/ocultar el control de tamaño correspondiente en camiseta
        if (mockup.id === 'mockup-camiseta') {
          document.getElementById('scale-camiseta-frente').closest('.scale-control').hidden = side !== 'frente';
          document.getElementById('scale-espalda-wrap').hidden = side !== 'espalda';
        }
      });
    });
  });

  /* ===================================================================
     5. FORMULARIO CAMISETA: lógica dinámica de campos
     =================================================================== */
  const telaRadios = document.querySelectorAll('input[name="tela"]');
  const grupoColorAlgodon = document.getElementById('grupo-color-algodon');
  const grupoColorPoliester = document.getElementById('grupo-color-poliester');
  telaRadios.forEach(r => r.addEventListener('change', () => {
    const esAlgodon = document.querySelector('input[name="tela"]:checked').value === 'algodon';
    grupoColorAlgodon.hidden = !esAlgodon;
    grupoColorPoliester.hidden = esAlgodon;
  }));

  // TODO CLIENTE: sustituir estas listas por la tabla de tallas real de la marca
  const TALLAS = {
    hombre: ['S', 'M', 'L', 'XL', 'XXL'],
    mujer: ['XS', 'S', 'M', 'L', 'XL'],
    nino: ['2-3', '4-5', '6-7', '8-9', '10-12'],
    bebe: ['0-3m', '3-6m', '6-9m', '9-12m', '12-18m'],
  };

  const categoriaSelect = document.getElementById('categoria-camiseta');
  const grupoEdadNino = document.getElementById('grupo-edad-nino');
  const grupoMesesBebe = document.getElementById('grupo-meses-bebe');
  const tallaSelect = document.getElementById('talla-camiseta');

  function renderTallas(categoria) {
    tallaSelect.innerHTML = '';
    TALLAS[categoria].forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      tallaSelect.appendChild(opt);
    });
  }

  categoriaSelect.addEventListener('change', () => {
    const cat = categoriaSelect.value;
    grupoEdadNino.hidden = cat !== 'nino';
    grupoMesesBebe.hidden = cat !== 'bebe';
    renderTallas(cat);
  });
  renderTallas(categoriaSelect.value);

  // Checkbox estampado detrás (+5€)
  const checkEspalda = document.getElementById('check-espalda-camiseta');
  const grupoFileEspalda = document.getElementById('grupo-file-espalda');
  const scaleEspaldaWrap = document.getElementById('scale-espalda-wrap');
  checkEspalda.addEventListener('change', () => {
    grupoFileEspalda.hidden = !checkEspalda.checked;
    updateShirtPrice();
  });

  function updateShirtPrice() {
    const base = 12.50;
    const total = base + (checkEspalda.checked ? 5 : 0);
    document.querySelector('#panel-camiseta .add-price').textContent = total.toFixed(2).replace('.', ',') + ' €';
    document.getElementById('panel-camiseta').dataset.price = total.toFixed(2);
  }
  updateShirtPrice();

  /* ===================================================================
     6. SUBIDA DE IMAGENES (genérico) + estado de arrastre/escala
     =================================================================== */
  const dragState = new Map(); // img element -> {x,y,scale}

  function setupFileInput(inputId, imgId, filenameId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const filenameEl = document.getElementById(filenameId);
    if (!input || !img) return;
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      filenameEl.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.hidden = false;
        img.closest('.print-zone').classList.add('has-img');
        if (!dragState.has(img)) dragState.set(img, { x: 0, y: 0, scale: 1 });
        applyTransform(img);
      };
      reader.readAsDataURL(file);
    });
  }

  setupFileInput('file-camiseta-frente', 'img-camiseta-frente', 'filename-camiseta-frente');
  setupFileInput('file-camiseta-espalda', 'img-camiseta-espalda', 'filename-camiseta-espalda');
  setupFileInput('file-taza', 'img-taza', 'filename-taza');

  // Llaveros: input genérico que rellena la imagen correspondiente en CADA forma
  // (rectangular / corazón / redondo), ya que el diseño debe verse en las 3 si el
  // usuario cambia de tipo. Solo se muestra la forma seleccionada, pero guardamos
  // la imagen en todas para no perder el trabajo del usuario si cambia de tipo.
  function setupLlaveroFileInput(inputId, side, filenameId) {
    const input = document.getElementById(inputId);
    const filenameEl = document.getElementById(filenameId);
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      filenameEl.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelectorAll(`.llavero-zone[data-side="${side}"] .draggable-img`).forEach(img => {
          img.src = e.target.result;
          img.hidden = false;
          img.closest('.print-zone').classList.add('has-img');
          if (!dragState.has(img)) dragState.set(img, { x: 0, y: 0, scale: 1 });
          applyTransform(img);
        });
      };
      reader.readAsDataURL(file);
    });
  }
  setupLlaveroFileInput('file-llavero-frente', 'frente', 'filename-llavero-frente');
  setupLlaveroFileInput('file-llavero-espalda', 'espalda', 'filename-llavero-espalda');

  /* ---------- Selector de tipo de llavero ---------- */
  document.querySelectorAll('input[name="tipo-llavero"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.llavero-shape').forEach(s => {
        s.classList.toggle('is-active', s.dataset.shape === radio.value);
      });
    });
  });

  /* ===================================================================
     7. ARRASTRE Y ESCALADO DE IMAGENES DENTRO DE LA ZONA DE IMPRESION
     =================================================================== */
  function applyTransform(img) {
    const s = dragState.get(img);
    if (!s) return;
    img.style.transform = `translate(-50%, -50%) translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
  }

  function makeDraggable(img) {
    let dragging = false;
    let startX = 0, startY = 0, origX = 0, origY = 0;

    img.style.pointerEvents = 'auto';
    img.style.left = '50%';
    img.style.top = '50%';

    function onDown(e) {
      const zone = img.closest('.print-zone, .llavero-zone');
      if (!zone.classList.contains('has-img')) return;
      dragging = true;
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX; startY = point.clientY;
      const s = dragState.get(img) || { x: 0, y: 0, scale: 1 };
      origX = s.x; origY = s.y;
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      const zone = img.closest('.print-zone, .llavero-zone');
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      const zw = zone.clientWidth, zh = zone.clientHeight;
      const s = dragState.get(img);
      s.x = Math.min(zw * 0.4, Math.max(-zw * 0.4, origX + dx));
      s.y = Math.min(zh * 0.4, Math.max(-zh * 0.4, origY + dy));
      applyTransform(img);
    }
    function onUp() { dragging = false; }

    img.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    img.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  document.querySelectorAll('.draggable-img').forEach(makeDraggable);

  function setupScale(sliderId, imgId) {
    const slider = document.getElementById(sliderId);
    const img = document.getElementById(imgId);
    if (!slider || !img) return;
    slider.addEventListener('input', () => {
      if (!dragState.has(img)) dragState.set(img, { x: 0, y: 0, scale: 1 });
      dragState.get(img).scale = slider.value / 100;
      applyTransform(img);
    });
  }
  setupScale('scale-camiseta-frente', 'img-camiseta-frente');
  setupScale('scale-camiseta-espalda', 'img-camiseta-espalda');
  setupScale('scale-taza', 'img-taza');

  /* ===================================================================
     8. RESUMEN DE PEDIDO (añadir productos configurados)
     =================================================================== */
  const orderItems = []; // {id, label, price, mockupSelector, details}
  const orderListEl = document.getElementById('order-list');
  const orderTotalEl = document.getElementById('order-total');

  function renderOrder() {
    orderListEl.innerHTML = '';
    if (orderItems.length === 0) {
      orderListEl.innerHTML = '<li class="order-empty">Todavía no has añadido ningún producto arriba.</li>';
      orderTotalEl.textContent = '0,00 €';
      return;
    }
    let total = 0;
    orderItems.forEach(item => {
      total += item.price;
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.label}</span><span><strong>${item.price.toFixed(2).replace('.', ',')} €</strong> <button type="button" class="remove-item" data-id="${item.id}">✕</button></span>`;
      orderListEl.appendChild(li);
    });
    orderTotalEl.textContent = total.toFixed(2).replace('.', ',') + ' €';

    orderListEl.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = orderItems.findIndex(it => it.id === btn.dataset.id);
        if (idx > -1) orderItems.splice(idx, 1);
        renderOrder();
      });
    });
  }

  function buildCamisetaDetails() {
    const tela = document.querySelector('input[name="tela"]:checked').value;
    const color = tela === 'algodon' ? document.getElementById('color-algodon').value : 'blanco';
    const categoria = categoriaSelect.value;
    const talla = tallaSelect.value;
    const espalda = checkEspalda.checked;
    let extra = '';
    if (categoria === 'nino') extra = ', edad: ' + document.querySelector('[name="edad-nino"]').value;
    if (categoria === 'bebe') extra = ', meses: ' + document.querySelector('[name="meses-bebe"]').value;
    return `Camiseta ${tela} color ${color} · ${categoria}${extra} · talla ${talla} · estampado ${espalda ? 'delante + detrás' : 'solo delante'}`;
  }

  document.querySelectorAll('.add-to-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      let label, price, mockupSelector = null;

      if (product === 'camiseta') {
        price = parseFloat(document.getElementById('panel-camiseta').dataset.price);
        label = buildCamisetaDetails();
        mockupSelector = '#mockup-camiseta';
      } else if (product === 'taza') {
        price = 9.50;
        label = 'Taza personalizada';
        mockupSelector = '#mockup-taza';
      } else if (product === 'llavero') {
        price = 7.50;
        const tipo = document.querySelector('input[name="tipo-llavero"]:checked').value;
        label = `Llavero ${tipo}`;
        mockupSelector = '#mockup-llavero .llavero-shape.is-active';
      }

      orderItems.push({ id: product + '-' + Date.now(), product, label, price, mockupSelector });
      renderOrder();

      btn.classList.add('is-added');
      const original = btn.textContent;
      btn.textContent = '✓ Añadido a tu pedido';
      setTimeout(() => { btn.classList.remove('is-added'); btn.innerHTML = original.includes('€') ? btn.dataset.originalHtml || original : original; }, 1600);
    });
    btn.dataset.originalHtml = btn.innerHTML;
  });

  /* ===================================================================
     9. ENVIO DEL PEDIDO -> DESCARGA DE VISTA PREVIA + WHATSAPP
     Nota importante (Opción A acordada con el cliente):
     WhatsApp NO permite adjuntar imágenes automáticamente mediante un
     enlace (wa.me / api.whatsapp.com). Por eso: 1) generamos y
     descargamos una imagen de vista previa por cada producto añadido
     (usando html2canvas sobre el mockup, tal y como lo dejó el
     usuario), y 2) abrimos WhatsApp con el mensaje de texto ya
     redactado, pidiendo al usuario que adjunte las imágenes descargadas
     en el propio chat.
     =================================================================== */
  const orderForm = document.getElementById('order-form');

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('cliente-nombre').value.trim();
    const telefono = document.getElementById('cliente-telefono').value.trim();
    const terminos = document.getElementById('cliente-terminos').checked;

    if (!nombre || !telefono || !terminos) {
      alert('Por favor, completa tu nombre, teléfono y acepta los términos y condiciones.');
      return;
    }
    if (orderItems.length === 0) {
      alert('Añade al menos un producto a tu pedido antes de continuar (botón "Añadir... a mi pedido" en cada sección).');
      return;
    }

    const submitBtn = document.getElementById('submit-order');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generando vista previa...';

    // 1) Descargar una imagen de vista previa por cada producto (si html2canvas está disponible)
    if (window.html2canvas) {
      for (const item of orderItems) {
        if (!item.mockupSelector) continue;
        const node = document.querySelector(item.mockupSelector);
        if (!node) continue;
        try {
          const canvas = await window.html2canvas(node, { backgroundColor: '#ffffff', scale: 2 });
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `diseno-${item.product}-${item.id}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          // pequeña pausa para que el navegador no bloquee descargas múltiples
          await new Promise(res => setTimeout(res, 350));
        } catch (err) {
          console.warn('No se pudo generar la vista previa de', item.label, err);
        }
      }
    }

    // 2) Construir el mensaje de WhatsApp
    let mensaje = `¡Hola! Quiero hacer un pedido personalizado.%0A%0A`;
    mensaje += `*Nombre:* ${encodeURIComponent(nombre)}%0A`;
    mensaje += `*Teléfono:* ${encodeURIComponent(telefono)}%0A%0A`;
    mensaje += `*Productos:*%0A`;
    orderItems.forEach((item, i) => {
      mensaje += `${i + 1}. ${encodeURIComponent(item.label)} — ${item.price.toFixed(2).replace('.', ',')} €%0A`;
    });
    const total = orderItems.reduce((acc, it) => acc + it.price, 0);
    mensaje += `%0A*Total: ${total.toFixed(2).replace('.', ',')} €*%0A%0A`;
    mensaje += encodeURIComponent('Te adjunto ahora mismo la(s) imagen(es) de vista previa que se acaban de descargar, para que veáis exactamente dónde quiero cada diseño. ¡Gracias!');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

    submitBtn.textContent = 'Abriendo WhatsApp...';
    setTimeout(() => {
      window.open(waUrl, '_blank');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar pedido por WhatsApp';
    }, 400);
  });

});
