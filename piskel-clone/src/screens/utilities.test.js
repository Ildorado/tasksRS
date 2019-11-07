const utilities = require('./utilities');
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

test('arrays [1,2,3] and [1,2,3] are equal', () => {
  expect(utilities.areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
});
test('arrays [2,2,3] and [1,2,3] are not equal', () => {
  expect(utilities.areArraysEqual([2, 2, 3], [1, 2, 3])).toBe(false);
});
test('random between 1 and 9 be number', () => {
  expect(utilities.getRandomInt(1, 10)).toBeWithinRange(1, 10);
  expect(utilities.getRandomInt(1000, 1100)).toBeWithinRange(1000, 1100);
});
// test('arrays [2,2,3] and [1,2,3] are not equal', () => {
//   expect(utilities.getRandomInt([2, 2, 3], [1, 2, 3])).toBe(false);
// });
