const Article = require('../models/article');

module.exports = (app) => {
  /*
   * DB に保存されている Article のタイトル一覧を表示
   */
  app.get('/', (req, res) => {
    let articles = [{
      id: 1,
      title: "hoge",
    }];
    res.render('index', { articles: articles });
  });

  /*
   * 新規作成画面
   */
  app.get('/new', (req, res) => {
    let article = new Article();
    res.render('new', { article: article });
  });

  /*
   * 新規記事作成
   */
  app.post('/', (req, res) => {
    console.log(req.body);
    let article = new Article(req.body);
    article.save().
      then((article) => {
        res.redirect(`/${article.id}`);
      }).
      catch((error) => {
        app.logger.error(error);
        res.render('new', { article: article });
      });
  });

  /*
   * 個別記事表示
   */
  app.get('/:id', (req, res) => {
    Article.get(req.params.id).
      then((article) => {
        res.render('show', { article: article });
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(404).send("Not Found");
      });
  })
  app.delete("/:id", function (req, res) {
    let id = req.params.id;

    app.locals.dbp.query(
      "DELETE FROM `show` WHERE `id` = ?", [id]
    ).then(function (data) {
      res.redirect(`/show`);
    }).catch(function (error) {
      res.status(403).send(error.message);
    })
  });
};
