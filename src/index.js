const app = require('./app');

let port = 3999;

app.listen(port, () => {
  app.logger.debug("Lanched server");
  app.logger.debug(`Access http://localhost:${port}/`);
});
