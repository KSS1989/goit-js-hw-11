// const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const KEY_API = '34998740-5263be479f93eb60e1ee91a90';

export const fetchAll = name => {
  return fetch(
    `${BASE_URL}/?key=${KEY_API}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
  )
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
};
