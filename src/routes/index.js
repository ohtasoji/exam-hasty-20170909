const Article = require('../models/article');

module.exports = (app) => {
  /*
   * DB に保存されている Article のタイトル一覧を表示
   */
  app.get('/', (req, res) => {
    Article.all().then((articles) => {
      res.render('index', { articles: articles });
    })
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
  * 記事修正
  */
  app.get("/set/:id", (req, res) => {
    Article.get(id=req.params.id).then((article) => {
      console.log(article);
      res.render("set", {article: article});
    })
  })

  app.put("/:id", (req, res) => {
    console.log("PUT !!!!!!!!!!!!!!!!!!!!!!!!!")
    article_id = req.params.id;
    body = req.body.body
    title = req.body.title
    console.log(body, title)
    new Article({
      id: article_id,
      body: body,
      title: title
    }).save().then((article) => {
      res.redirect("/" + article_id);
    })
  })

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
  });
};
