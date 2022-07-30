// // in this file I'am testing all methods in authenticate.ts

import { authHeader, getToken } from '../../services/authenticate';

describe('Check if methods inside authenticate.t file is defined', () => {
  it('authHeader is defined', () => {
    expect(authHeader).toBeDefined();
  });
  it('getToken is defined', () => {
    expect(getToken).toBeDefined();
  });
});
