import { fetchAll } from './partials/fetch';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const example = document.getElementById('uk');
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('[type="text"]');
const btn = document.querySelector('[type="submit"]');

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  const input = event.currentTarget;
  const searchQuery = input.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const data = await fetchAll(searchQuery)
    .then(response => {
      if (response.data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      return response.data;
    })
    .then(data => {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 2000,
      });
      renderGallery(data.hits);
      new SimpleLightbox('.gallery a');
    })
    .catch(error => {
      console.log(error);
    });
  form.reset();
}

function renderGallery(elements) {
  const markup = elements
    .map(element => {
      return `<a href="${element.largeImageURL}">
      <div class="photo-card">
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy"/>
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
    </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
