const Article = require('../models/article');
module.exports = (app) => {
  /*
   * DB に保存されている Article のタイトル一覧を表示
   */
  app.get('/', (req, res) => {
    for (let i = 1; i < 50; i++) {
      let articles = [{
        id: [i],
        title: "article",
      }];
      res.render('articles', { articles: articles });
    }
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
  app.get('/', (req, res) => {
    Article.get(req.params.id).
      then((article) => {
        res.render('show', { article: article });
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(404).send("Not Found");
      });
  });


  //更新
  app.get("/edit", function (req, res) {
    let id = req.params.id;
    let article;
    app.locals.dbp.query(
      "SELECT * FROM `articles` WHERE `id` = ? LIMIT 1",
      [id]
    ).then(function (data) {
      let results = data[0];
      let fields = data[1];

      if (results.length < 1) {
        throw new Error("Article not found")
      }

      article = results[0];
      return app.locals.dbp.query(
        "SELECT * FROM `users` WHERE `id` =? LIMIT 1",
        [article.user_id]
      );
    }).then(function (data) {

      let results = data[0];
      let fields = data[1];

      if (results.length < 1) {
        throw new Error("User not found");
      }
      let user = results[0];
      article.user = user;

      res.render('edit_article', { article: article });
    }).catch(function (error) {
      res.status(404).send(error.message)
    })
  });
  app.put("/:id", function (req, res) {
    let id = req.params.id;
    let title = req.body.title;
    let body = req.body.body;

    app.locals.dbp.query(
      "UPDATE `articles` SET `title` = ? ,`body` = ? WHERE `id` = ?",
      [title, body, id]
    ).then(function (data) {
      res.redirect(`/article/${id}`);
    }).catch(function (error) {
      res.status(403).send(error.message);
    })
  });
  app.delete("/:id", function (req, res) {
    let id = req.params.id;

    app.locals.dbp.query(
      "DELETE FROM `articles` WHERE `id` = ?",
      [id]
    ).then(function (data) {
      res.redirect('/article');
    }).catch(function (error) {
      res.status(403).send(error.message);
    })
  });
};


