var express = require('express');
var router = express.Router();
var Facebook = require('facebook-node-sdk');

var requestedScope = ['manage_pages','publish_pages', 'ads_management'];

router.get('/', function(req, res) {
  if (!req.facebook) {
      Facebook.middleware(config)(req, res, afterNew);
  }

  req.facebook.getUser(function(err, user) {
      if (err) {
        res.render('pages/error');
      }
      else {
        var data = {};
        if (user === 0) { 
          data.loggedIn = false;
        }
        else {
          data.loggedIn = true;
          
        }
        res.render('pages/index', data);
      }
  });
});

// Login
router.get('/login', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  res.redirect('/me/pages');
});

// Logout
router.get('/logout', Facebook.logout(), function(req, res) {
});

// Get all pages owned by loggedIn User
router.get('/me/pages', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me/accounts?fields=name,id,category,perms,access_token,picture', function(err, result) {
    res.render('pages/pages', {
      "pages": result.data 
    });
  });
});

// Get all post of a page
router.get('/page/:id', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/'+req.params.id+'?fields=id,name,about,feed.limit(100)', 'GET', function(err, result) {
    res.render('pages/posts', {
      "page_name": result.name,
      "page_about": result.about,
      "posts": result.feed 
    });
  });
});


router.get('/page/:id/fb', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  data = {};
  data.message = "new hello";
  data.access_token = "CAACEdEose0cBAKluzk7QZAvF9ErHzEc6Dc7hmcfZBBY1WCd1R1WS5wDQVrldA6AzxafTLDJWrKCIihhAziO8N71i176LTVzD8DQKlZA4mJJu5ZAQrWocKI3UGcHt8TP6HjCxxihZCOdqdpb3EikSBaVsna4ogsx3YwQAwOvLNsFMnJFqlFJZADUVFZCfS2uhr4ZD";
  console.log(data);
  req.facebook.api('/'+req.params.id+'/feed', 'POST', data , function(err, user) {
  	if(err){
  		res.writeHead(200, {'Content-Type': 'text/plain'});
    	res.end('Hello, ' + JSON.stringify(err) +'!');
  	}
    else{
    	res.writeHead(200, {'Content-Type': 'text/plain'});
    	res.end('Hello, ' + JSON.stringify(user) +'!');
	}
  });
});


router.get('/page/:id/view', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});

router.get('/page/:id/edit', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});

router.get('/page/:id/delete', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});

router.get('/page/:id/post', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});

router.get('/page/:id/unpublished_post', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});



module.exports = router;
