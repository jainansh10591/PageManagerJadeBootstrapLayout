# Page Manager #

An application to manage Facebook Pages. Created to demo at Facebook Solution Engineering Onsite Interview

# api to post to page
FB.api(
  '/page_id/feed',
  'POST',
  {"access_token":"","message":""},
  function(response) {
      // Insert your code here
  }
);



# api to get unpublished page post
/page_id/promotable_posts?fields=id,message,created_time&is_published=false

# api to get all posts of page
FB.api(
  '/page_id/feed',
  'GET',
  {},
  function(response) {
      // Insert your code here
  }
);

# api to get details of a page
FB.api(
  '/page_id',
  'GET',
  {},
  function(response) {
      // Insert your code here
  }
);



# api to get all pages owned by user and accesstoken
FB.api(
  '/me/accounts',
  'GET',
  {"access_token":""},
  function(response) {
      // Insert your code here
  }
);

# api to get unique views of pagepost
insights/post_impressions_unique?ids=1552417364837853_1558986087514314,1552417364837853_1558702250876031
FB.api(
  '/page_id/posts?fields=message,id,created_time,insights{name,values}',
  'GET',
  {},
  function(response) {
      // Insert your code here
  }
); 


#######################################################

# unpublished post ("published": "0")-- 
# permission -- manage_pages, publish_pages
# https://developers.facebook.com/docs/marketing-api/unpublished-page-posts/v2.5

## 5 Types - 
# Status Post  -- text
# Photo post  -- text, optional link, photo
# Link post  -- link , otional text
		picture - string -- url 
		thumbnail - file - .jpg,.jpeg,.gif,.png

# Video post  -- video, optional text
# Offer post  -- (only offline offer)
# For posts, links, or status updates -- use published field.
# For photos, videos -- use the no_story field.


## use "privacy": {"value":"", "allow":"", "deny":""}
# https://developers.facebook.com/docs/graph-api/common-scenarios#privacy-param


## scheduled post - "scheduled_publish_time" 
				   "published" set to false
#https://developers.facebook.com/docs/graph-api/common-scenarios#scheduledposts



#######################################################

# post on page
# https://developers.facebook.com/docs/pages/publishing

## text -- "message"
## link -- "message", "link"
## photo -- "page_id/photos"
## video -- "page_id/videos"

#######################################################

# comment on post - "post_id/comments" with "message" and user "access_token"
