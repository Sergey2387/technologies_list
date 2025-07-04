const modal = document.querySelector('#modal');
const content = document.querySelector('#content');
const backDrop = document.querySelector('#backdrop');
const progress = document.querySelector('#progress');
const form = document.querySelector('#form');

const APP_TITLE = document.title;
const KEY_ITEM = 'my-key';

content.addEventListener('click', openCard);
backDrop.addEventListener('click', closeModal);
modal.addEventListener('change', toggleTech);
form.addEventListener('submit', createTech);
modal.addEventListener('click', handleModalActions);

const technologies = getTechLocal();

function openModal (html, title = APP_TITLE) {
  document.title = `${title} | ${APP_TITLE}`;
  modal.innerHTML = html;
  modal.classList.add('open');
}

function closeModal () {
  document.title = APP_TITLE;
  modal.classList.remove('open');
}

function openCard (event) {
  const data = event.target.dataset;
  const tech = technologies.find((t) => t.type === data.type);
  if (!tech) return;

  openModal(toModal(tech), tech.title);
}

function toggleTech (event) {
  const type = event.target.dataset.type;
  const tech = technologies.find((t) => t.type === type);
  tech.done = event.target.checked;
  saveTechLocal();
  init();
}

function deleteTechnology (type) {
  const index = technologies.findIndex(t => t.type === type);
  if (index !== -1) {
    technologies.splice(index, 1);
    saveTechLocal();
    closeModal();
    init();
  }
}

function handleModalActions (event) {
  const target = event.target;
  if (target.dataset.action === 'delete') {
    const type = target.dataset.type;
    deleteTechnology(type);
  }
}

function toModal (tech) {
  const checked = tech.done ? 'checked' : '';
  return `
    <h2>${tech.title}</h2>
    <p>${tech.description}</p>
    <hr />
    <div>
      <input type="checkbox" id="done" ${checked} data-type="${tech.type}" />
      <label for="done">Выучил</label>
      <button type="button" data-action="delete" data-type="${tech.type}" class="delete-btn">Удалить</button>
    </div>
  `;
}

function init () {
  renderCards();
  renderProgress();
}

function toCard (tech) {
  const doneClass = tech.done ? 'done' : '';
  return `
  <div class="card ${doneClass}" data-type="${tech.type}">
      <h3 data-type="${tech.type}">${tech.title}</h3>
    </div>
  `;
}

function renderCards () {
  if (technologies.length === 0) {
    content.innerHTML = `
    <h2 class="empty">
      Технологий нет
    </h2>
  `;
  } else {
    let html = '';
    for (let i = 0; i < technologies.length; i++) {
      const tech = technologies[i];
      html += toCard(tech);
    }
    content.innerHTML = html;
    //    content.innerHTML = technologies.map(toCard).join('');
  }
}

function renderProgress () {
  const percent = computeProgressPercent();
  const background =
    percent < 30 ? '#EC0909' : percent < 70 ? '#F9D315' : '#50B205';
  progress.style.width = `${percent}%`;
  progress.textContent = `${percent}%`;
  progress.style.background = background;
}

const computeProgressPercent = () => {

  if (technologies.length === 0) {
    return 0;
  }
  let doneCount = 0;
  for (const tech of technologies) {
    if (tech.done) {
      doneCount++;
    }
  }
  return Math.round((doneCount * 100) / technologies.length);
};

function isInvalid (title, description) {
  return !title.value || !description.value;
}

function createTech (event) {
  event.preventDefault();
  const { title, description } = event.target;

  if (isInvalid(title, description)) {
    if (!title.value) title.classList.add('invalid');
    if (!description.value) description.classList.add('invalid');

    setTimeout(() => {
      title.classList.remove('invalid');
      description.classList.remove('invalid');
    }, 2000);
    return;
  }
  const newTech = {
    title: title.value,
    description: description.value,
    done: false,
    type: title.value.toLowerCase(),
  };

  technologies.push(newTech);

  title.value = '';
  description.value = '';
  saveTechLocal();
  init();
}

function saveTechLocal () {
  localStorage.setItem(KEY_ITEM, JSON.stringify(technologies));
}

function getTechLocal () {
  const row = localStorage.getItem(KEY_ITEM);
  return row ? JSON.parse(row) : [];
}

init();
