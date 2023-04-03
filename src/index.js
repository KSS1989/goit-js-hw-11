import { fetchAll } from './partials/fetch';
const example = document.getElementById('uk');
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('[type="text"]');
const btn = document.querySelector('[type="submit"]');

form.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();

  fetchAll(searchQuery).then(function (data) {
    console.log(data.hits);
    renderGallery(data.hits);
  });
}

function renderGallery(elements) {
  const markup = elements
    .map(element => {
      return `<div class="photo-card">
    <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b><br> ${element.likes}
      </p>
      <p class="info-item">
        <b>Views</b><br> ${element.views}
      </p>
      <p class="info-item">
        <b>Comments</b><br> ${element.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b><br> ${element.comments}
      </p>
    </div>
    </div>
  </div>`;
    })
    .join('');
  gallery.innerHTML = markup;
}
