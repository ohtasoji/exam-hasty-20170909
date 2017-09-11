const Article = require('../models/article');
const multer = require('multer');
let upload = multer({
  storage: multer.memoryStorage(),
});
const auth = require('../filters/auth');
const UserSession = require('../models/user_session');
const User = require('../models/user');

module.exports = (app) => {
  /*
   * DB に保存されている Article のタイトル一覧を表示
   */
  app.get('/', (req, res) => {
    let page = Number(req.query.page) || 1;
    Article.getPage(page - 1).
      then((articles) => {
        res.render('index', { articles: articles, page: page });
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(500).send('Error');
      });
  });
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  app.post('/signup', (req, res) => {
    User.signup(req.body.email, req.body.password).then(user => {
       res.redirect('/login');
    }).catch(error => res.redirect('/login'));
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.post('/login', (req, res) => {
    User.authenticate(req.body.email, req.body.password).then(user => {
      return new UserSession({ user_id: user.id });
    }).then(session => {
      res.cookie('session_id', session.id, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
        signed: true,
      });
      res.redirect('/');
    }).catch(error => {
      res.redirect('/login');
      console.log(error);
    });
  });

  /*
   * 新規作成画面
   */
  app.get('/new', auth, (req, res) => {
    let article = new Article();
    res.render('new', { article: article });
  });

  /*
   * 新規記事作成
   */
  app.post('/', auth, (req, res) => {
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
  app.get('/:id/update', auth, (req, res) => {
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
  app.post('/:id', auth, (req, res) => {
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
  app.post('/:id/delete', auth, (req, res) => {
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

  app.get('/:id/image', auth, (req, res) => {
    res.render('image', { id: req.params.id });
  })

  app.post('/:id/image', auth, upload.single('image'), (req, res) => {
    Article.get(req.params.id).
      then(article => {
        article.image = req.file.buffer;
        return article.save();
      }).
      then(article => {
        res.redirect('/' + article.id);
      }).
      catch((error) => {
        app.logger.error(error);
        res.status(404).send("Not Found");
      })
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
