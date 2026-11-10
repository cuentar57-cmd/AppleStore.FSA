/* Selector de fotos desde la biblioteca compartida de Google Drive.
   El catálogo se genera en drive-iphone-images.json; no requiere credenciales
   y no cambia los productos hasta que el administrador pulse Guardar producto. */
(function () {
  'use strict';
  var root = document.getElementById('productModal');
  var imageField = document.getElementById('fImage');
  var modelField = document.getElementById('fModel');
  if (!root || !imageField || !modelField) return;
  var body = root.querySelector('.modal-body');
  var preview = document.getElementById('previewBox');
  var imageBox = preview && preview.closest('.section-box');
  if (!body || !imageBox) return;

  var css = document.createElement('style');
  css.textContent = [
    '#driveImageLibrary .drive-toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}',
    '#driveImageLibrary .drive-toolbar .input,#driveImageLibrary .drive-toolbar .select{flex:1 1 180px;min-width:0}',
    '#driveImageLibrary .drive-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));gap:10px;max-height:390px;overflow-y:auto;padding:3px}',
    '#driveImageLibrary .drive-photo{background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:14px;padding:8px;min-width:0;text-align:center;cursor:pointer;transition:border-color .15s}',
    '#driveImageLibrary .drive-photo:hover,#driveImageLibrary .drive-photo.chosen{border-color:var(--text)}',
    '#driveImageLibrary .drive-photo.chosen{box-shadow:0 0 0 1px var(--text)}',
    '#driveImageLibrary .drive-photo img{display:block;width:100%;height:105px;object-fit:contain;background:#fff;border-radius:9px}',
    '#driveImageLibrary .drive-photo-name{font-size:11px;line-height:1.3;overflow-wrap:anywhere;margin-top:7px}',
    '#driveImageLibrary .drive-photo-model{font-size:10px;line-height:1.3;color:var(--muted);margin-top:3px}',
    '#driveImageLibrary .drive-photo-placeholder{display:flex;align-items:center;justify-content:center;height:105px;font-size:11px;color:#555;background:#f3f3f3;border-radius:9px}',
    '#driveImageLibrary .drive-status{font-size:12px;color:var(--muted);margin:9px 0;line-height:1.5}',
    '#driveImageLibrary a{color:var(--text);text-decoration:underline}'
  ].join('');
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.id = 'driveImageLibrary';
  box.className = 'section-box';
  box.innerHTML =
    '<div class="section-title">Fotos de iPhone · Google Drive</div>' +
    '<p class="hint">Elegí una foto para usarla como imagen principal del producto.</p>' +
    '<div class="drive-toolbar">' +
    '<select id="driveModelFilter" class="select" aria-label="Filtrar por modelo"><option value="">Todos los modelos</option></select>' +
    '<input id="drivePhotoSearch" class="input" type="search" placeholder="Buscar foto o color..." aria-label="Buscar foto">' +
    '</div>' +
    '<div id="drivePhotoStatus" class="drive-status" role="status">Cargando biblioteca…</div>' +
    '<div id="drivePhotoGrid" class="drive-photos"></div>' +
    '<p class="hint" style="margin-top:12px">Fotos de la <a href="https://drive.google.com/drive/folders/150Fg6hT6JXzctvRiVeucgInCX4adyzUJ" target="_blank" rel="noopener noreferrer">carpeta de Google Drive</a>. Las fotos nuevas requieren actualizar esta biblioteca.</p>';
  imageBox.insertAdjacentElement('afterend', box);

  var select = box.querySelector('#driveModelFilter');
  var search = box.querySelector('#drivePhotoSearch');
  var status = box.querySelector('#drivePhotoStatus');
  var grid = box.querySelector('#drivePhotoGrid');
  var folders = [];
  var all = [];
  var loading = true;
  var failed = '';

  function normalize(v) {
    return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  function folderFor(model) {
    var n = normalize(model);
    if (n === 'iphone14plus') return folders.find(function (f) { return normalize(f.name) === 'iphone14yplus'; });
    return folders.find(function (f) { return normalize(f.name) === n; });
  }
  function currentImageId() {
    var match = String(imageField.value || '').match(/[?&]id=([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
  }
  function deriveColor(name) {
    var n = normalize(name).replace(/png$|jpe?g$|webp$/g, '');
    var colors = [
      ['titanionatural','Titanio Natural'], ['titanionegro','Titanio Negro'],
      ['titanioblanco','Titanio Blanco'], ['titanioazul','Titanio Azul'],
      ['titanionatura','Titanio Natural'], ['negroespacial','Negro Espacial'],
      ['grisespacial','Gris Espacial'], ['moradooscuro','Morado Oscuro'],
      ['medianoche','Medianoche'], ['ultramarino','Ultramarino'],
      ['desierto','Titanio Desierto'], ['lavanda','Lavanda'],
      ['grafito','Grafito'], ['silver','Plata'], ['orange','Naranja'],
      ['dorado','Dorado'], ['amarillo','Amarillo'], ['blanco','Blanco'],
      ['morado','Morado'], ['verde','Verde'], ['negro','Negro'],
      ['plata','Plata'], ['azul','Azul'], ['rosa','Rosa'], ['rojo','Rojo'],
      ['oro','Oro']
    ];
    for (var i = 0; i < colors.length; i++) {
      if (n.includes(colors[i][0])) return colors[i][1];
    }
    return '';
  }
  function choose(item) {
    imageField.value = item.url;
    imageField.dispatchEvent(new Event('input', { bubbles: true }));
    var color = deriveColor(item.name);
    if (color) {
      var colorField = document.getElementById('fColor');
      if (colorField) colorField.value = color;
    }
    status.textContent = 'Seleccionada: ' + item.name + '. Guardá el producto para aplicar el cambio.';
    renderPhotos(true);
  }
  function renderPhotos(keepStatus) {
    grid.replaceChildren();
    if (loading) { status.textContent = 'Cargando biblioteca…'; return; }
    if (failed) { status.textContent = 'No se pudo cargar la biblioteca: ' + failed; return; }
    var id = select.value;
    var query = normalize(search.value);
    var matches = all.filter(function (it) {
      return (!id || it.folderId === id) &&
        (!query || normalize(it.name + ' ' + it.folder).includes(query));
    });
    if (!keepStatus) status.textContent =
      matches.length + ' fotos disponibles · ' + folders.length + ' carpetas de iPhone.';
    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'hint';
      empty.textContent = 'No hay fotos para este filtro. Probá con «Todos los modelos».';
      grid.appendChild(empty);
      return;
    }
    var selected = currentImageId();
    var fragment = document.createDocumentFragment();
    matches.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'drive-photo' + (selected === item.id ? ' chosen' : '');
      button.title = item.folder + ' · ' + item.name;
      button.setAttribute('aria-label', 'Elegir ' + item.name + ' de ' + item.folder);
      button.addEventListener('click', function () { choose(item); });
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.src = item.thumbnail;
      img.alt = item.name;
      img.addEventListener('error', function () {
        var placeholder = document.createElement('span');
        placeholder.className = 'drive-photo-placeholder';
        placeholder.textContent = 'Sin vista previa';
        img.replaceWith(placeholder);
      }, { once: true });
      var label = document.createElement('div');
      label.className = 'drive-photo-name';
      label.textContent = item.name;
      var model = document.createElement('div');
      model.className = 'drive-photo-model';
      model.textContent = item.folder;
      button.append(img, label, model);
      fragment.appendChild(button);
    });
    grid.appendChild(fragment);
  }
  function syncModel() {
    if (loading || failed) return;
    var matched = folderFor(modelField.value);
    select.value = matched ? matched.id : '';
    search.value = '';
    renderPhotos();
  }
  select.addEventListener('change', function () { renderPhotos(); });
  search.addEventListener('input', function () { renderPhotos(); });
  modelField.addEventListener('change', syncModel);
  new MutationObserver(function () {
    if (root.classList.contains('open')) syncModel();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  fetch('./drive-iphone-images.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (library) {
      folders = Array.isArray(library.folders) ? library.folders : [];
      all = [];
      select.innerHTML = '<option value="">Todos los modelos</option>';
      folders.forEach(function (f) {
        var opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.name;
        select.appendChild(opt);
        (f.images || []).forEach(function (img) {
          all.push({
            id: img.id, name: img.name, url: img.url,
            thumbnail: img.thumbnail, folder: f.name, folderId: f.id
          });
        });
      });
      loading = false;
      syncModel();
    })
    .catch(function (error) {
      loading = false;
      failed = error.message || 'error desconocido';
      renderPhotos();
    });
})();