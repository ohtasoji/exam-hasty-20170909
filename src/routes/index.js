const Article = require('../models/article');

module.exports = (app) => {
  /*
   * DB に保存されている Article のタイトル一覧を表示
   */
  app.get('/', (req, res) => {
    Article.all().
      then((articles) => {
        res.render('index', { articles: articles });
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(500).send('Error');
      });
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
    if (!req.body.title) {
      res.status(400).send('Title is empty');
      return;
    }
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
   * 更新画面
   */
  app.get('/:id/update', (req, res) => {
    Article.get(req.params.id).
      then((article) => {
        res.render('update', { article: article });
      }).
      catch(() => {
        app.logger.error(error);
        res.status(404).send("Not Found");
      });
  });

  /*
   * 記事更新
   */
  app.post('/:id', (req, res) => {
    if (!req.body.title) {
      res.status(400).send('Title is empty');
      return;
    }
    Article.get(req.params.id).
      then(article => {
        article.assign(req.body);
        return article.save();
      }).
      then(article => {
        res.redirect('/' + article.id);
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(500).send('Error');
      });
  });

  /*
   * 記事削除
   */
  app.post('/:id/delete', (req, res) => {
    Article.get(req.params.id).
      then(article => {
        return article.destroy();
      }).
      then(article => {
        res.redirect('/');
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(404).send("Not Found");
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
  });
};
