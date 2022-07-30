// use this custom reporter code to  change the ENV variable on the fly from "dev" to "test" and perform tests.
//this code will work across different systems well.
//this code is provided from eng.Tarek El-Barody.

import { SpecReporter } from 'jasmine-spec-reporter';
import dotenv from 'dotenv';
dotenv.config();
process.env.ENV = 'test';
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    suite: {
      displayNumber: true,
    },
    spec: {
      displayPending: false,
      displayDuration: false,
      displayErrorMessages: true,
    },
    summary: {
      displayDuration: true,
      displayFailed: true,
      displaySuccessful: false,
      displayPending: true,
      displayErrorMessages: false,
    },
  })
);
