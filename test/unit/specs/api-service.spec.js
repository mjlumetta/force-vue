import apiService from 'src/api/api-service';

describe('apiService', () => {
  const server = sinon.fakeServer.create();
  const responseData = { name: 'Luke Skywalker', height: '172', mass: '77', hair_color: 'blond',
    skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male' };

  before(() => {
    server.autoRespond = true;
    server.respondWith('GET', 'people/1/',
      '{"name":"Luke Skywalker","height":"172","mass":"77","hair_color":"blond",' +
      '"skin_color":"fair","eye_color":"blue","birth_year":"19BBY","gender":"male"}');
  });

  after(() => {
    server.restore();
  });

  describe('fetch()', () => {
    it('returns an empty string if resource is not passed', () => {
      const promise = apiService.fetch('', 1);
      promise.then(result => {
        expect(result).toBe('');
      }, () => {
        expect('promise').toBe('not to be rejected');
      });
    });

    it('returns an empty string if id is not passed', () => {
      const promise = apiService.fetch('people', '');
      promise.then(result => {
        expect(result).toBe('');
      }, () => {
        expect('promise').toBe('not to be rejected');
      });
    });

    it('returns an empty string for an invalid resource', () => {
      const promise = apiService.fetch('badresource', 1);
      promise.then(result => {
        expect(result).toBe('');
      }, () => {
        expect('promise').toBe('not to be rejected');
      });
    });

    it('should call the API to get the correct data', () => {
      const promise = apiService.fetch('people', 1);
      promise.then(result => {
        expect(result).toEqual(responseData);
      }, () => {
        expect('promise').toBe('not to be rejected');
      });
    });

    it('should get data from the cache if possible', () => {
      server.autoRespond = false;

      const firstPromise = apiService.fetch('people', 1);
      firstPromise.then(result => {
        expect(result).toEqual(responseData);
      });
      server.respond();

      const secondPromise = apiService.fetch('people', 1);
      secondPromise.then(result => {
        expect(result).toEqual(responseData);
      });

      server.autoRespond = true;
    });
  });
});
