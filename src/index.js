import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { NewsApiService } from './partials/fetch';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const newsApiService = new NewsApiService();
const message = Notiflix.Notify;

form.addEventListener('submit', onSearch);
window.addEventListener(
  'scroll',
  throttle(e => {
    checkPosition();
  }, 1000)
);
window.addEventListener(
  'resize',
  throttle(e => {
    checkPosition();
  }, 1000)
);

async function onSearch(e) {
  e.preventDefault();
  const input = e.currentTarget;
  newsApiService.query = input.elements.searchQuery.value.trim();

  const data = await newsApiService
    .fetchAll()
    .then(({ totalHits, hits }) => {
      if (newsApiService.searchQuery === '')
        return message.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            timeout: 1000,
          }
        );
      message.info(`Hooray! We found ${totalHits} images.`, {
        timeout: 1000,
      });
      newsApiService.resetPage();
      newsApiService.incrementPage();
      resetGallery();
      renderGallery(hits);
      new SimpleLightbox('.gallery a').refresh();
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => form.reset());
}
const checkPosition = () => {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 5;
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
      })
      .finally(() => newsApiService.incrementPage());
  }
};

const renderGallery = elements => {
  const markup = elements
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}">
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span class="span" > ${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span class="span"> ${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span class="span"> ${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span class="span"> ${downloads}</span>
        </p>
      </div>
    </div>
    </a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
};
const resetGallery = () => (gallery.innerHTML = '');
