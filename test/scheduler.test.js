const chai = require("chai");
const Scheduler = require("../app/utils/scheduler");

chai.should();
const timeout = process.env.CI ? 30000 : 10000;

let test;

describe("scheduler", function () {
  vi.setConfig({ testTimeout: timeout });
  beforeEach(function () {
    test = true;
  });

  it("kinda runs schedule on time", () =>
    new Promise((done) => {
      const time = 100;
      const callback = function () {
        test = false;
      };
      const schedule = new Scheduler(callback, time);
      schedule.plan();
      setTimeout(function () {
        test.should.equal(false);
        done();
      }, 200);
    }));

  it("kinda runs schedule on time with correct", () =>
    new Promise((done) => {
      const time = 1000;
      const start = Date.now();
      const callback = function () {
        // allow margin due to event loop delay
        (Date.now() - start).should.be.within(time - 200, time + 200);
        test = false;
      };
      const schedule = new Scheduler(callback, time);
      schedule.plan();
      setTimeout(function () {
        schedule.correct();
      }, 200);
      setTimeout(function () {
        test.should.equal(false);
        done();
      }, time + 100);
    }));

  it("it cancels schedule on cancel()", () =>
    new Promise((done) => {
      const time = 100;
      const callback = function () {
        test = false;
      };
      const schedule = new Scheduler(callback, time);
      schedule.plan();
      setTimeout(function () {
        schedule.cancel();
      }, 50);
      setTimeout(function () {
        test.should.equal(true);
        done();
      }, 200);
    }));

  it("it kinda gets the time left", () =>
    new Promise((done) => {
      const time = 100;
      const callback = function () {
        test = false;
      };
      const schedule = new Scheduler(callback, time);
      schedule.plan();
      setTimeout(function () {
        schedule.timeLeft.should.be.a("number").and.to.be.below(100);
      }, 50);
      setTimeout(function () {
        test.should.equal(false);
        done();
      }, 160);
    }));
});
