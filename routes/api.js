var express = require('express');
var router = express.Router();
var Facebook = require('facebook-node-sdk');
var Step = require('step');
var url = require('url');

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
    var data = {
      "page_details": null,
      "posts": null,
      "prev": null,
      "next": null
    };

    var id = req.params.id;
    var query = req._parsedUrl.query;
    var feed_url = '/'+id+'/feed';
    if(query!=null){
      feed_url = feed_url+'?'+query;
    }

    Step(
        function getPageDetails() {
            req.facebook.api('/'+req.params.id +'?fields=name,id,about,category','GET', this);
        },
        function getFeeds(err, result) {
          if(err){
            res.render('pages/error');
            return;
          }

          data.page_details = result;

          req.facebook.api(feed_url, 'GET', this);
        },
        function checkPreviousPagination(err, result) {
          if(err){
            res.render('pages/error');
            return;
          }

          data.posts = result;

          if(result.paging!=null && result.paging.previous!=null){
            req.facebook.api(result.paging.previous,'GET' ,this);
          }
        },
        function checkNextPagination(err, result) {
          if(err){
            res.render('pages/error');
            return;
          }

          if(result!=null && result.data.length !=0){
            data.prev = '/page/'+id+ url.parse(data.posts.paging.previous).search;
          }
          
          if(data.posts.paging!=null && data.posts.paging.next!=null){
            req.facebook.api(data.posts.paging.next,'GET' ,this);
          }
        },
        function (err, result) {
          if(err){
            res.render('pages/error');
            return;
          }

          if(result!=null && result.data.length !=0){
            data.next = '/page/'+id+ url.parse(data.posts.paging.next).search;
          }
          res.render('pages/posts', data);
        }
    );
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
