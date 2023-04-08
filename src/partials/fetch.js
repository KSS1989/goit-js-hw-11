const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const KEY_API = '34998740-5263be479f93eb60e1ee91a90';

export class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchAll() {
    const dataObj = await axios
      .get(
        `${BASE_URL}/?key=${KEY_API}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(response => {
        if (response.data.total === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        // this.incrementPage();
        return response.data;
      });
    return dataObj;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
