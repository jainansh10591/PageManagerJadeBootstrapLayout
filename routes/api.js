var express = require('express');
var router = express.Router();
var Facebook = require('facebook-node-sdk');
var Step = require('step');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var moment = require('moment');

var variables = {
  "requestedScope": ['manage_pages','publish_pages', 'ads_management', 'read_insights'],
  "pages": {
              "error_page": 'pages/error',
              "owned_pages": 'pages/pages',
              "page_posts": 'pages/posts',
              "index": 'pages/index'
            },
  "postsSelection": {
                      "Published": "Published Posts",
                      "Unpublished": "Unpublished Posts"
                    }
};

// check user already signedin or not and navigate to index/starting page
router.get('/', function(req, res) {
  if (!req.facebook) {
      Facebook.middleware(config)(req, res, afterNew);
  }

  req.facebook.getUser(function(err, user) {
      if (err) {
        res.render(variables.pages.error_page);
      }else {
        var data = {};
        if (user === 0) { 
          data.loggedIn = false;
        }else {
          data.loggedIn = true;
        }
        res.render(variables.pages.index, data);
      }
  });
});

// Login route
router.get('/login', Facebook.loginRequired({scope: variables.requestedScope}), function(req, res) {
  res.redirect('/me/pages');
});

// Logout route
router.get('/logout', Facebook.logout(), function(req, res) {
});

//--- Get all pages owned by loggedIn User
router.get('/me/pages', Facebook.loginRequired({scope: variables.requestedScope}), function(req, res) {
  var data = {
      "pages": null,
      "prev": null,
      "next": null,
      "params": {}
    };
  exports.getOwnedPages(req, res, data);  
});

exports.getOwnedPages = function(req, res, data){
  var accounts_url = '/me/accounts';
  data.params.accounts_url = accounts_url;

  req.facebook.api(data.params.accounts_url, 'GET', function(err, result){
    if(err){
      res.render(variables.pages.error_page);
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
          res.render(variables.pages.error_page);
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
          res.render(variables.pages.error_page);
          return;
        }
        if(result!=null && result.data.length!=0){
          data.next = data.params.accounts_url+ url.parse(data.pages.paging.next).search;
        }
        data.params = null;
        res.render(variables.pages.owned_pages, data);
      });
  }
  else{
    data.params = null;
    res.render(variables.pages.owned_pages, data);
  }
}
// *****************************************************************************

// ----Get all posts of a page 
router.get('/page/:id/posts/:type', Facebook.loginRequired({scope: variables.requestedScope}), function(req, res) {
    exports.getPagePosts(req, res);
});

exports.defaultData = function(){
  var data = {
      "page_details": null,
      "posts": null,
      "reachs": null,
      "reachs_id": null,
      "prev": null,
      "next": null,
      "active_link": {
        "published": null,
        "unpublished": null
      },
      "posts_type": null,
      "page_post_heading": null,
      "base_url": null,
      "scheduled_publish_time": null,
      "params": {
      }
    };
  return data;
};

exports.getPagePosts = function(req, res){
    var data = exports.defaultData();

    data.posts_type = req.params.type;

    var feed_url = '/'+req.params.id;
    var category = variables.postsSelection[req.params.type];
    if(category == variables.postsSelection.Published) feed_url = feed_url + "/feed";
    if(category == variables.postsSelection.Unpublished) feed_url = feed_url + "/promotable_posts";

    //checking if code is present or not
    var query = req._parsedUrl.query;
    var valid_query = true;
    if(query!=null){
      var params = query.split(/&/);
      for(var i=0; i<params.length; i++){
         var param = params[i].split(/=/);
         if(param[0]=="code"){
          valid_query = false;
          break;
         }
      }
    }

    if(query && valid_query) {
      feed_url = feed_url+'?'+query;
    }else{
      feed_url = feed_url+'?fields=message,created_time,id,call_to_action,scheduled_publish_time,application,admin_creator,caption,description,from,icon,link,name,picture,source,object_id,type,is_published,full_picture';
    }

    // checking getting published post or unpublished
    data.page_post_heading = category;
    if(category == variables.postsSelection.Published){
      data.active_link.published = true;
      feed_url = feed_url + "&is_published=true";
    }
    else if(category == variables.postsSelection.Unpublished){
      data.active_link.unpublished = true;
      feed_url = feed_url + "&is_published=false";
    }


    data.params.id = req.params.id;
    data.base_url = '/page/'+req.params.id;
    data.params.feed_url = feed_url;
    data.params.page_info_url = '/'+req.params.id +'?fields=name,id,about,category,access_token,picture';
    exports.getPageDetails(req, res, data);
};

exports.getPageDetails = function(req, res, data) {
    req.facebook.api(data.params.page_info_url,'GET', function(err, result){
      if(err){
        res.render(variables.pages.error_page);
        return;
      }
      data.page_details = result;
      exports.getFeeds(req, res, data);
    });
};

exports.getFeeds = function(req, res, data) {
    req.facebook.api(data.params.feed_url,'GET', function(err, result){
      if(err){
        res.render(variables.pages.error_page);
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
          res.render(variables.pages.error_page);
          return;
        }
        if(result!=null && result.data.length !=0){
            data.prev = '/page/'+data.params.id+'/posts/'+data.posts_type+ url.parse(data.posts.paging.previous).search;
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
          res.render(variables.pages.error_page);
          return;
        }
        if(result!=null && result.data.length !=0){
            data.next = '/page/'+data.params.id+'/posts/'+data.posts_type+ url.parse(data.posts.paging.next).search;
        }
        data.params = null;
        exports.getIds(data);
        exports.getReaches(req,res,data);
      });
    }
    else{
      data.params = null;
      exports.getReaches(req,res,data);
    }
};

exports.getReaches = function(req, res, data){
  if(data.reachs_id!=null){
    req.facebook.api('/insights/post_impressions_unique?ids='+data.reachs_id,'GET' ,function(err, result){
      if(err){
        res.render(variables.pages.error_page);
        return;
      }
      else{
        data.reachs = result;
        res.render(variables.pages.page_posts, data);
      }
    });
  }
  else{
    res.render(variables.pages.page_posts, data);
  }
};

exports.getIds = function(data){
  if(data.posts==null)return;

  var ids ="";
  for(var i=0;i<data.posts.data.length;i++){
    ids = ids+data.posts.data[i].id;
    if(i < data.posts.data.length-1){
      ids=ids+",";
    }
  }
  data.reachs_id = ids;
};
// ********************************************************

// -- Post on the page
router.post('/page/:id/post/:type', Facebook.loginRequired({scope: variables.requestedScope}), function(req, res) {

  req.facebook.api('/'+req.params.id +'?fields=name,id,about,category,access_token','GET', function(err, result){
    if(err){
      res.render(variables.pages.error_page);
      return;
    }

    var data = {access_token: result.access_token};
    var api_url = '';
    var redirect_uri = "/page/"+req.params.id+'/posts/'+req.params.type;

    // checking published, unpublished or scheduled
    if(req.params.type == "Unpublished"){
      data.published = 0;
      if(req.body.scheduleLater){
        if(req.body.datetime){
          var currentTimeStamp = Math.round(new Date().getTime() / 1000);
          var scheduledTimeStamp = Math.round(new Date(req.body.datetime).getTime() / 1000);
          var timeDifference = scheduledTimeStamp - currentTimeStamp;
          if((timeDifference > 600) && (timeDifference < 15552000) ) {
            data.scheduled_publish_time = scheduledTimeStamp;
          }
        }
      }
    }

    switch (req.body.type) {
      case "status":
      case "link":
          if(req.body.message){
            data.message = req.body.message;
          }else{
            data.message = req.body.link;
          }
          if(req.body.link) data.link = req.body.link;
          if(req.body.name) data.name = req.body.name;
          if(req.body.description) data.description = req.body.description;
          if(req.body.caption) data.caption = req.body.caption;
          if(req.body.picture) data.picture = req.body.picture;

          //check for call_to_action in published
          if(req.params.type == "Unpublished"){
            if(req.body.callToAction) {
              data.call_to_action = {
                "type": req.body.callToActionSelect,
                "value": req.body.link
              };
            }
          }

          api_url = '/'+req.params.id+'/feed';
          break;
      case "photo":
          if(req.body.message) data.message = req.body.message;
          if(req.body.url) data.url = req.body.url;
          if(req.files && req.files.source) data.source = '@'+req.files.source.path;
          api_url = '/'+req.params.id+'/photos';
          break;  
      case "video":
          if(req.body.message) data.description = req.body.message;
          if(req.body.url) data.file_url = req.body.url;
          api_url = '/'+req.params.id+'/videos';
          if(req.files && req.files.source) data.source = '@'+req.files.source.path;
          break;
    }

    req.facebook.api(api_url,'POST', data ,function(err, result) {
      if(err){
        console.log("--error--");
        console.log(err);
        res.render(variables.pages.error_page);
        return;
      }
      res.redirect(redirect_uri);
    });    
  });

});
// ***********************************************************************************

module.exports = router;
