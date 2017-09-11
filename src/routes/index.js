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
    if (!res.locals.currentUser) {
      res.redirect('/login');
      return;
    }
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
  });

  app.get('/update',(req,res) => {
    res.update();
  });

  app.delete('/api/toots/:id',(req,res) => {
    if(!res.locals.currentUser) {
      res.status(401).json({ "error": "Unauthorized" });
      return;
    }

    res.locals.currentUser.toots().where({
      id: req.params.id
    }).then((toots) => {
      if(toots.length > 0) {
        toots[0].destroy();
      }
      res.status(200).end();
    }).catch((error) => {
      res.status(500).json({ "error": error.toString() });
    })
  })

  app.get('/login',(req,res) => {
    res.render('login');
  })

  app.post('/login', function(req,res) {
    let email = req.body.email;
    let password = req.body.password;

    User.authenticate(email, password).then((user) => {
      return UserSession.create(user);
    }).then((session) => {
      res.cookie("session_id", session.data.id, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
        signed: true
      });

      res.redirect("/");
    }).catch((err) => {
      console.log(err)
      res.render("login", {error: true});
    })
  });
};
