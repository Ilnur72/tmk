import hbs from 'hbs';

export function registerHelpers(): void {
  hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });
  hbs.registerHelper('eq', function (a, b) {
    return a == b;
  });
  hbs.registerHelper('ne', function (a, b) {
    return a !== b;
  });
  hbs.registerHelper('and', function (...args) {
    const options = args.pop();
    const allTruthy = args.every((arg) => !!arg);

    if (options && typeof options.fn === 'function') {
      return allTruthy ? options.fn(this) : options.inverse(this);
    }
    return allTruthy;
  });
  hbs.registerHelper('arrayToString', function (array) {
    if (!Array.isArray(array)) return array;
    return array.join(', ');
  });
  hbs.registerHelper('getFirstImage', function (jsonString) {
    try {
      const images = JSON.parse(jsonString);
      return images[0] || 'default.jpg';
    } catch {
      return 'default.jpg';
    }
  });
  hbs.registerHelper('length', function (str) {
    return str ? str.length : 0;
  });

  hbs.registerHelper('gt', function (a, b) {
    return a > b;
  });
}
