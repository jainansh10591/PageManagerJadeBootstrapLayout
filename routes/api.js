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
  var data = {
      "pages": null,
      "prev": null,
      "next": null,
      "params": {

      }
    };

  var query = req._parsedUrl.query;
  var accounts_url = '/me/accounts';
  if(query!=null){
    accounts_url = accounts_url+'?'+query;
  }
  data.params.accounts_url = accounts_url;
  exports.getOwnedPages(req, res, data);  
});

exports.getOwnedPages = function(req, res, data){
  req.facebook.api(data.params.accounts_url, 'GET', function(err, result){
    if(err){
      res.render('pages/error');
      return;
    }
    data.pages = result;
    exports.checkPreviousPaginationPage(req, res, data);
  });
}
exports.checkPreviousPaginationPage = function(req, res, data){
  if(data.pages.paging!=null && data.pages.paging.previous!=null){
      req.facebook.api(data.pages.paging.previous,'GET' ,function(err, result){
        if(err){
          res.render('pages/error');
          return;
        }
        if(result!=null && result.data.length!=0){
          data.prev = data.params.accounts_url+ url.parse(data.pages.paging.previous).search;
        }
        exports.checkNextPaginationPage(req, res, data);
      });
  }
  else{
    exports.checkNextPaginationPage(req, res, data);
  }
}
exports.checkNextPaginationPage = function(req, res, data){
  if(data.pages.paging!=null && data.pages.paging.next!=null){
      req.facebook.api(data.pages.paging.next,'GET' ,function(err, result){
        if(err){
          res.render('pages/error');
          return;
        }
        if(result!=null && result.data.length!=0){
          data.next = data.params.accounts_url+ url.parse(data.pages.paging.next).search;
        }
        data.params = null;
        res.render('pages/pages', data);
      });
  }
  else{
    data.params = null;
    res.render('pages/pages', data);
  }
}


// Get all post of a page
router.get('/page/:id', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
    exports.getPagePosts(req, res, postsSelection.all);
});

router.get('/page/:id/all', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
    exports.getPagePosts(req, res, postsSelection.all);
});

// get all published post
router.get('/page/:id/published', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
    exports.getPagePosts(req, res, postsSelection.published);
});

// get all unpublished posts
router.get('/page/:id/unpublished', Facebook.loginRequired({scope: requestedScope}), function(req, res) {
    exports.getPagePosts(req, res, postsSelection.unpublished);
});

var postsSelection = {
  "all": "All Posts",
  "published": "Published Posts",
  "unpublished": "Unpublished Posts"
}; 

exports.getPageDetails = function(req, res, data) {
    req.facebook.api(data.params.page_info_url,'GET', function(err, result){
      if(err){
        res.render('pages/error');
        return;
      }
      data.page_details = result;
      exports.getFeeds(req, res, data);
    });
};

exports.getFeeds = function(req, res, data) {
    req.facebook.api(data.params.feed_url,'GET', function(err, result){
      if(err){
        res.render('pages/error');
        return;
      }
      data.posts = result;
      exports.checkPreviousPagination(req, res, data);
    });
};
exports.checkPreviousPagination = function(req, res, data) {

    if(data.posts.paging!=null && data.posts.paging.previous!=null){
      req.facebook.api(data.posts.paging.previous,'GET' ,function(err, result){
        if(err){
          res.render('pages/error');
          return;
        }
        if(result!=null && result.data.length !=0){
            data.prev = '/page/'+data.params.id+ url.parse(data.posts.paging.previous).search;
        }
        exports.checkNextPagination(req, res, data);
      });
    }
    else{
      exports.checkNextPagination(req, res, data);
    }
};
exports.checkNextPagination = function(req, res, data) {
    if(data.posts.paging!=null && data.posts.paging.next!=null){
      req.facebook.api(data.posts.paging.next,'GET' ,function(err, result){
        if(err){
          res.render('pages/error');
          return;
        }
        if(result!=null && result.data.length !=0){
            data.next = '/page/'+data.params.id+ url.parse(data.posts.paging.next).search;
        }
        
        data.params = null;
        res.render('pages/posts', data);
      });
    }
    else{
      data.params = null;
      res.render('pages/posts', data);
    }
};

exports.getPagePosts = function(req, res, category){

    var data = exports.defaultData();

    data.page_post_heading = category;
    if(category == postsSelection.published){
      data.active_link.published = true;
    }
    else if(category == postsSelection.unpublished){
      data.active_link.unpublished = true;
    }
    else{
      data.active_link.all = true;
    }

    data.params.id= req.params.id;
    data.base_url = '/page/'+req.params.id;
    var query = req._parsedUrl.query;
    var feed_url = '/'+data.params.id+'/feed';
    if(query!=null){
      feed_url = feed_url+'?'+query;
    }
    data.params.feed_url = feed_url;

    data.params.page_info_url = '/'+req.params.id +'?fields=name,id,about,category';
    exports.getPageDetails(req, res, data);
};

exports.defaultData = function(){
  var data = {
      "page_details": null,
      "posts": null,
      "prev": null,
      "next": null,
      "active_link": {
        "all": null,
        "published": null,
        "unpublished": null
      },
      "page_post_heading": null,
      "base_url": null,
      "params": {
      }
    };
  return data;
};

//
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
