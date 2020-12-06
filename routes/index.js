// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');

// Models
var Admin = require('../models/admin');
var Client = require('../models/client');
var Advisor = require('../models/advisor');

const { response } = require('../app');
// Library helper variables
const saltRounds = 10;

var baseUrl = "http://localhost:3000"

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/home');
});
/* GET stocks. */
router.get('/data/stocks.json', function (req, res, next) {
  res.redirect('/home');
});

/* Welcome API */
router.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the MoneyNotSleep APIs'
  });
});
/*main website*/
router.get('/home', function (req, res, next) {
  res.render('home/index.hbs', {
    title: 'MoneyNotSleep - Home',
    layout: 'home/layout.hbs',
  });
});
/*stock page*/
router.get('/home/stock/:symbol', function (req, res, next) {
  res.render('home/stock.hbs', {
    title: 'MoneyNotSleep - Stock',
    layout: 'home/layout.hbs',
  });
});

/*admin start*/
router.get('/admin/login', function (req, res, next) {
  res.render('login-admin/index.hbs', {
    title: 'MoneyNotSleep Admin - Login',
    layout: 'login-admin/layout.hbs',
  });
});

router.get('/blogs', function (req, res, next) {
  res.render('blogs/index.hbs', {
    title: 'MoneyNotSleep Blogs - Login',
    layout: 'blogs/dashLayout.hbs',
  });
});

router.get('/home/contact-form', function (req, res, next) {
  res.render('home/contactFrom.hbs', {
    title: 'MoneyNotSleep Contact Us - Login',
    layout: 'home/Layout.hbs',
  });
});

router.get('/admin/dashboard/client', function (req, res, next) {
  if (req.session.admin == true) {
    res.render('admin/client/index.hbs', {
      title: 'MoneyNotSleep Admin - Dashboard',
      layout: 'admin/client/dashLayout.hbs',
    });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/admin/dashboard/client/history/:id', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('admin/client/historyClient.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'admin/client/dashLayout.hbs',
    });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/admin/dashboard/advisor', function (req, res, next) {
  if (req.session.admin == true) {
    res.render('admin/advisor/index.hbs', {
      title: 'MoneyNotSleep Admin - Dashboard',
      layout: 'admin/advisor/dashLayout.hbs',
    });
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/admin/dashboard/advisor/history/:id', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('admin/advisor/historyAdvisor.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'admin/advisor/dashLayout.hbs',
    });
  } else {
    res.redirect('/admin/login');
  }
});
router.get('/admin/dashboard/plan', function (req, res, next) {
  if (req.session.admin == true) {
    res.render('admin/plan/index.hbs', {
      title: 'MoneyNotSleep Admin - Dashboard',
      layout: 'admin/plan/dashLayout.hbs',
    });
  } else {
    res.redirect('/admin/login');
  }
});

/*admin end*/

/*client start*/
router.get('/client/login', function (req, res, next) {
  res.render('login-client/index.hbs', {
    title: 'MoneyNotSleep Client - Login',
    layout: 'login-client/layout.hbs',
  });
});

router.get('/client/details', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/details/kyc.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'client/details/Layout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});

router.get('/client/details/selectAdvisor', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/details/selectAdvisor.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'client/details/Layout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});

router.get('/client/dashboard/myprofile', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/myprofile/index.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'client/myprofile/dashLayout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});
/*blogs for client*/
router.get('/client/dashboard/blog', function (req, res, next) {
  if (req.session.client == true) {
    res.render('advisor-blog/index.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'advisor-blog/dashLayout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});
/*watchlist */
router.get('/client/dashboard/watchlist', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/watchlist/index.hbs', {
      title: 'MoneyNotSleep - watchlist',
      layout: 'client/watchlist/dashLayout.hbs'
    })
  } else {
    res.redirect('/client/login');
  }
})

router.get('/client/dashboard/schedule', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/schedule/index.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'client/schedule/dashLayout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});

router.get('/client/dashboard/chat', function (req, res, next) {
  if (req.session.client == true) {
    res.render('client/chat/index.hbs', {
      title: 'MoneyNotSleep Client - Dashboard',
      layout: 'client/chat/dashLayout.hbs',
    });
  } else {
    res.redirect('/client/login');
  }
});


/*client end*/

/*advisor start*/
router.get('/advisor/login', function (req, res, next) {
  res.render('login-advisor/index.hbs', {
    title: 'MoneyNotSleep Advisor - Login',
    layout: 'login-advisor/layout.hbs',
  });
});

router.get('/advisor/dashboard/myprofile', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/myprofile/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/myprofile/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/announcements', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/annoucements/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/annoucements/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});
router.get('/advisor/dashboard/schedule', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/schedule/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/schedule/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/chat', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/chat/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/chat/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/blog', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/blogs/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/blogs/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/blog/add', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/blogs/add.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/blogs/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/blog/edit/:id', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/blogs/edit.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/blogs/dashLayout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

router.get('/advisor/dashboard/twilio', function (req, res, next) {
  if (req.session.advisor == true) {
    res.render('advisor/twilio/index.hbs', {
      title: 'MoneyNotSleep Advisor - Dashboard',
      layout: 'advisor/twilio/Layout.hbs',
    });
  } else {
    res.redirect('/advisor/login');
  }
});

/*advisor end*/


// Authorization: Bearer <access_token>

/* Verify Token function */
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

}
module.exports = router;
