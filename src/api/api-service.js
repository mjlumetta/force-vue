import Vue from 'vue';
import { EventEmitter } from 'events';
import { Promise } from 'es6-promise';
import { ApiCache } from './api-cache.js';

const resourceCache = new ApiCache();
const apiService = new EventEmitter();
export default apiService;

const validateFetchParams = (resource, id) => {
  if (!resource || !id) {
  	return false;
  }

  const validResources = {
  	"": true,
  	"films": true,
    "people": true,
    "planets": true,
    "species": true,
    "starships": true,
    "vehicles": true
  };
  return validResources[resource];
};

apiService.fetch = (resource, id) => {
  if (validateFetchParams(resource, id)) {
  	return Promise.resolve('');
  }

  return new Promise((resolve, reject) => {
  	const resourceUrl = `${resource}/${id}/`;

  	if (resourceCache.get(resourceUrl)) {
  	  resolve(resourceCache.get(resourceUrl));
  	}

  	Vue.http.get(resourceUrl).then(response => {
  	  const resourceData = response.data;
  	  resourceCache.put(resourceUrl, resourceData);
  	  resolve(resourceData);
  	}, reject);
  });
};