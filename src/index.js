import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { NewsApiService } from './partials/fetch';
import throttle from 'lodash.throttle';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const newsApiService = new NewsApiService();

form.addEventListener('submit', onSearch);
window.addEventListener(
  'scroll',
  throttle(e => {
    checkPosition();
  }, 250)
);
window.addEventListener(
  'resize',
  throttle(e => {
    checkPosition();
  }, 250)
);

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiService.searchQuery === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const data = await newsApiService
    .fetchAll()
    .then(({ totalHits, hits }) => {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`, {
        timeout: 2000,
      });
      newsApiService.resetPage();
      newsApiService.incrementPage();
      resetGallery();
      renderGallery(hits);
      new SimpleLightbox('.gallery a').refresh();
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
          <b>Likes</b>
          <span class="span" > ${element.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span class="span"> ${element.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span class="span"> ${element.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span class="span"> ${element.comments}</span>
        </p>
      </div>
    </div>
    </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
function resetGallery() {
  gallery.innerHTML = '';
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    newsApiService
      .fetchAll()
      .then(({ hits }) => {
        renderGallery(hits);
        new SimpleLightbox('.gallery a').refresh();
      })
      .catch(error => {
        console.log(error);
      });
    newsApiService.incrementPage();
  }
}
