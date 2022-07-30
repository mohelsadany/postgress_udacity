//in this file we check if the server run without issues

import supertest from 'supertest';
import { app } from '../server';

const httpConnection = supertest(app);

describe("The server run's fine", () => {
  it('server is up', async () => {
    //test the main route if working or not.
    const result = await httpConnection.get('/');
    expect(result.status).toEqual(200);
  });
});
