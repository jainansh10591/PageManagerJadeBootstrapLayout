var express = require('express');
var router = express.Router();
var Facebook = require('facebook-node-sdk');

var requestedScope = ['manage_pages','publish_pages', 'ads_management'];

router.get('/', function(req, res) {
  res.render('pages/index');
});

router.get('/login', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.render('pages/welcome');
  });
});

router.get('/logout', Facebook.logout(), function(req, res) {
});

router.get('/me', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me', function(err, user) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, ' + JSON.stringify(user) + '!');
  });
});

router.get('/me/pages', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/me/accounts?fields=name,id,category,perms,access_token,picture', function(err, result) {
    res.render('pages/pages', {
      "pages": result.data 
    });
  });
});

// to get all post of a page
router.get('/page/:id', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  req.facebook.api('/'+req.params.id+'?fields=name,id,feed,about', 'GET', function(err, result) {
    res.render('pages/posts', {
      "page_name": result.name,
      "page_about": result.about,
      "posts": result.feed.data 
    });
  });
});

router.get('/page/:id/fb', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
  data = {};
  data.message = "hello";
  console.log(data);
  req.facebook.api('/'+req.params.id+'/feed', 'POST', data , function(err, user) {
  	if(err){
  		res.writeHead(200, {'Content-Type': 'text/plain'});
    	res.end('Hello, ' + JSON.stringify(err) +'!');
  	}
    else{
    	res.writeHead(200, {'Content-Type': 'text/plain'});
    	res.end('Hello, ' + '!');
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
