import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { NewsApiService } from './partials/fetch';
// import imgCard from './partials/img-card.hbs';

const example = document.getElementById('uk');
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('[type="text"]');
const btn = document.querySelector('[type="submit"]');
const lodeBtn = document.querySelector('.load-more');

const newsApiService = new NewsApiService();

lodeBtn.className = 'visually-hidden';

form.addEventListener('submit', onSearch);
lodeBtn.addEventListener('click', lodeMore);

lodeBtn;
async function onSearch(e) {
  e.preventDefault();
  const input = e.currentTarget;
  newsApiService.query = input.elements.searchQuery.value.trim();
  if (newsApiService.searchQuery === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const data = await newsApiService
    .fetchAll()
    .then(data => {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 2000,
      });
      newsApiService.resetPage();
      newsApiService.incrementPage();
      resetGallery();
      renderGallery(data.hits);
      new SimpleLightbox('.gallery a');
      lodeBtn.className = 'load-more';
    })
    .catch(error => {
      console.log(error);
    });
  form.reset();
}

function lodeMore() {
  newsApiService
    .fetchAll()
    .then(data => {
      renderGallery(data.hits);
      new SimpleLightbox('.gallery a').refresh();
    })
    .catch(error => {
      console.log(error);
    });
  newsApiService.incrementPage();
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
function resetGallery() {
  gallery.innerHTML = '';
}
