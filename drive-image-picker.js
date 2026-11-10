/* Fotos de la carpeta Google Drive de iPhones, mostradas directamente en
   el selector de colores del panel. Catálogo estático, sin acceso privado
   ni claves de API. */
(function () {
  'use strict';
  const modal = document.getElementById('productModal');
  const gallery = document.getElementById('colorGallery');
  const imageField = document.getElementById('fImage');
  const modelField = document.getElementById('fModel');
  const colorField = document.getElementById('fColor');
  if (!modal || !gallery || !imageField || !modelField) return;

  const section = gallery.closest('.section-box');
  if (!section) return;
  const title = section.querySelector('.section-title');
  const hint = section.querySelector('.hint');
  if (title) title.textContent = 'Fotografías de iPhone · Google Drive';
  if (hint) hint.textContent = 'Elegí una foto real de tu carpeta de Drive. Se utilizará como imagen principal cuando guardes el producto.';

  const style = document.createElement('style');
  style.textContent = [
    '#colorGallery.drive-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;align-items:stretch;max-height:450px;overflow-y:auto;padding:2px}',
    '#colorGallery .drive-card{cursor:pointer;min-width:0;padding:8px;border-radius:15px;border:1px solid var(--border);background:var(--card);color:var(--text);text-align:center}',
    '#colorGallery .drive-card:focus-visible{outline:2px solid var(--text);outline-offset:2px}',
    '#colorGallery .drive-card.is-selected{border-color:var(--text);box-shadow:inset 0 0 0 1px var(--text)}',
    '#colorGallery .drive-card img{width:100%;height:114px;object-fit:contain;background:#fafafa;border-radius:10px;display:block}',
    '#colorGallery .drive-card-label{font-size:.75rem;line-height:1.3;overflow-wrap:anywhere;margin-top:7px;font-weight:800}',
    '#colorGallery .drive-card-detail{font-size:.65rem;line-height:1.25;overflow-wrap:anywhere;color:var(--muted);margin-top:4px}',
    '#colorGallery .drive-card-fallback{display:flex;align-items:center;justify-content:center;height:114px;border-radius:10px;background:#e9e9ed;color:#444;font-size:.67rem}',
    '.drive-filters{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}',
    '.drive-filters .select,.drive-filters .input{min-width:0;flex:1 1 140px}',
    '.drive-gallery-status{font-size:.77rem;color:var(--muted);margin:10px 0;line-height:1.4}'
  ].join('');
  document.head.appendChild(style);
  gallery.classList.add('drive-gallery');
  gallery.replaceChildren();
  const controls = document.createElement('div');
  controls.className = 'drive-filters';
  controls.innerHTML =
    '<input class="input" id="driveLibrarySearch" type="search" placeholder="Buscar color dentro del modelo..." aria-label="Buscar imagen del modelo">';
  const status = document.createElement('div');
  status.className = 'drive-gallery-status';
  status.setAttribute('role', 'status');
  status.textContent = 'Cargando fotografías de Google Drive…';
  section.insertBefore(controls, gallery);
  section.insertBefore(status, gallery);
  const searchInput = controls.querySelector('#driveLibrarySearch');
  let folders = [];
  let all = [];
  let ready = false;
  let error = '';

  function norm(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  function folderFor(model) {
    const n = norm(model);
    if (n === 'iphone14plus') return folders.find(f => norm(f.name) === 'iphone14yplus');
    if (n === 'iphone15plus') return folders.find(f => norm(f.name) === 'iphone15');
    if (n === 'iphone16plus') return folders.find(f => norm(f.name) === 'iphone16');
    return folders.find(f => norm(f.name) === n);
  }
  function modelKeys(f) {
    if (norm(f.name) === 'iphone14yplus') return ['iPhone 14', 'iPhone 14 Plus'];
    if (norm(f.name) === 'iphone15') return ['iPhone 15', 'iPhone 15 Plus'];
    if (norm(f.name) === 'iphone16') return ['iPhone 16', 'iPhone 16 Plus'];
    const parts = f.name.trim().split(/\s+/);
    return [parts.map((x,i) => i === 0 ? 'iPhone' : (x.toLowerCase() === 'pro' ? 'Pro' : x.toLowerCase() === 'max' ? 'Max' : x.toLowerCase() === 'air' ? 'Air' : x)).join(' ')];
  }
  function filenameColor(filename) {
    const value = norm(filename).replace(/(png|jpe?g|webp)$/, '');
    const colors = [
      ['titanionatural','Titanio natural','#aaa49c'],
      ['titanionatura','Titanio natural','#aaa49c'],
      ['titanionegro','Titanio negro','#333333'],
      ['titanioblanco','Titanio blanco','#eeeeee'],
      ['titanioazul','Titanio azul','#5c789a'],
      ['negroespacial','Negro espacial','#282828'],
      ['grisespacial','Gris espacial','#56575a'],
      ['moradooscuro','Morado oscuro','#5a496d'],
      ['ultramarino','Ultramarino','#4d70c0'],
      ['medianoche','Medianoche','#283444'],
      ['desierto','Titanio desierto','#c8a98b'],
      ['lavanda','Lavanda','#d9c6ef'],
      ['grafito','Grafito','#464747'],
      ['silver','Plata','#dfdfdf'],
      ['orange','Naranja','#ff9c35'],
      ['dorado','Dorado','#dfc28a'],
      ['amarillo','Amarillo','#f5de75'],
      ['blanco','Blanco','#f1f1ee'],
      ['morado','Morado','#b5a5d5'],
      ['verde','Verde','#648565'],
      ['negro','Negro','#222222'],
      ['plata','Plata','#dedede'],
      ['azul','Azul','#7797c0'],
      ['rosa','Rosa','#efb2cb'],
      ['rojo','Rojo','#c63236'],
      ['oro','Oro','#dfba80']
    ];
    for (const [match,name,hex] of colors) {
      if (value.includes(match)) return {name,hex};
    }
    return null;
  }
  function currentPhotoId() {
    const found = String(imageField.value || '').match(/[?&]id=([A-Za-z0-9_-]+)/);
    return found ? found[1] : '';
  }
  function pick(item) {
    imageField.value = item.url;
    imageField.dispatchEvent(new Event('input', {bubbles:true}));
    const color = filenameColor(item.name);
    if (color && colorField) colorField.value = color.name;
    renderGallery(true);
    status.textContent = 'Seleccionada: ' + item.name + '. Presioná «Guardar producto» para aplicar el cambio.';
  }
  // El modelo del producto decide qué carpeta se muestra. Nunca se mezclan modelos.
  function selectedModel() {
    if (modelField.value.trim()) return modelField.value.trim();
    const name = (document.getElementById('fName')?.value || '').trim();
    const target = norm(name);
    // Elegir el nombre más específico: "14 Pro Max" antes de "14 Pro".
    const keys = Object.keys(MODEL_CATALOG).filter(k => norm(k).startsWith('iphone'));
    keys.sort((a,b) => norm(b).length - norm(a).length);
    return keys.find(k => target.startsWith(norm(k))) || '';
  }
  function renderGallery(keepStatus) {
    gallery.replaceChildren();
    if (!ready) {
      status.textContent = error ? 'Error al cargar las fotos: ' + error : 'Cargando fotografías de Google Drive…';
      return;
    }
    const model = selectedModel();
    if (!model) {
      status.textContent = 'Seleccioná un modelo de iPhone para ver solamente sus fotografías.';
      return;
    }
    const folder = folderFor(model);
    if (!folder) {
      status.textContent = 'No hay fotos de ' + model + ' en la carpeta de Drive. No se mostrarán imágenes de otros modelos.';
      return;
    }
    const query = norm(searchInput.value);
    const candidates = all.filter(item => item.folderId === folder.id &&
      (!query || norm(item.name).includes(query)));
    if (!keepStatus) status.textContent = model + ' · ' + candidates.length + ' fotografías disponibles.';
    if (!candidates.length) {
      const empty = document.createElement('p');
      empty.className = 'hint';
      empty.textContent = 'No hay fotos de ' + model + ' que coincidan con la búsqueda.';
      gallery.appendChild(empty);
      return;
    }
    const chosen = currentPhotoId();
    const frag = document.createDocumentFragment();
    candidates.forEach(item => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'drive-card' + (item.id === chosen ? ' is-selected' : '');
      card.setAttribute('aria-label', 'Seleccionar ' + item.name + ' de ' + model);
      card.addEventListener('click', () => pick(item));
      const img = document.createElement('img');
      img.src = item.thumbnail;
      img.loading = 'lazy';
      img.alt = item.name;
      img.addEventListener('error', () => {
        const fallback = document.createElement('span');
        fallback.className = 'drive-card-fallback';
        fallback.textContent = 'Sin vista previa';
        img.replaceWith(fallback);
      }, {once:true});
      const label = document.createElement('div');
      label.className = 'drive-card-label';
      label.textContent = (filenameColor(item.name) || {}).name || item.name;
      const detail = document.createElement('div');
      detail.className = 'drive-card-detail';
      detail.textContent = model;
      card.append(img,label,detail);
      frag.appendChild(card);
    });
    gallery.appendChild(frag);
  }
  function showModel() {
    searchInput.value = '';
    renderGallery();
  }
  searchInput.addEventListener('input', () => renderGallery());
  modelField.addEventListener('change', showModel);
  document.getElementById('fName')?.addEventListener('input', showModel);
  new MutationObserver(() => {
    if (modal.classList.contains('open')) showModel();
  }).observe(modal, {attributes:true,attributeFilter:['class']});

  /* Sustituimos el render antiguo: ya no deben verse gráficos generados.
     Además, las imágenes por color al guardar serán las URL reales de Drive. */
  window.renderColorGallery = function() { showModel(); };
  renderGallery();

  fetch('./drive-iphone-images.json', {cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); })
    .then(library => {
      folders = Array.isArray(library.folders) ? library.folders : [];
      all = [];
      folders.forEach(folder => {
        const colors = [];
        (folder.images || []).forEach((item,i) => {
          const detected = filenameColor(item.name);
          const colorName = detected ? detected.name : 'Foto ' + (i+1);
          const hex = detected ? detected.hex : '#808080';
          colors.push([colorName,hex,item.url]);
          all.push({id:item.id,name:item.name,url:item.url,thumbnail:item.thumbnail,folder:folder.name,folderId:folder.id});
        });
        modelKeys(folder).forEach(model => {
          if (!MODEL_CATALOG[model]) MODEL_CATALOG[model] = {cat:'iphone',colors:[]};
          MODEL_CATALOG[model].colors = colors;
        });
      });
      ready = true;
      if (typeof fillModels === 'function') {
        const existingModel = modelField.value;
        fillModels();
        modelField.value = existingModel;
      }
      showModel();
    })
    .catch(err => {
      error = err.message || 'No se pudo leer el catálogo';
      renderGallery();
    });
})();