// in this file I'am testing all methods in dashboard.ts

//serviceMethods will contain user dashboard method
import { serviceMethods } from '../../services/dashboard';

const services = new serviceMethods();

describe('Check if methods inside dashboard.ts file is defined', () => {
  it('services.userDashboard is defined', () => {
    expect(services.userDashboard).toBeDefined();
  });
});
