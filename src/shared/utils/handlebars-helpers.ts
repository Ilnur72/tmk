import * as hbs from 'hbs';

export function registerHelpers(): void {
  hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });
}
