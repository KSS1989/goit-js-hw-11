import { fetchAll } from './partials/fetch';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
form.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();

  fetchAll(searchQuery).then(data => {
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
        <b>Likes: ${element.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${element.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${element.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${element.comments}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  gallery.innerHTML = markup;
}
