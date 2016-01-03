// Posting on page
var postCategory = {
	"status": "status",
	"link": "link",
	"photo": "photo",
	"video": "video"
};

var variables = {
	"picture": "picture",
	"thumbnail": "thumbnail",
	"source": "source",
	"url": "url",
	"type": "type"
};
function formSubmission(element, event){
	var valid = true;
	var formType = element.elements[variables.type].value;

	if(formType == postCategory.status){
		
	}
	else if(formType == postCategory.link){
		var link = element.elements[postCategory.link];
		if(link.value.trim() == "" || !isUrlValid(link.value.trim())){
			link.setCustomValidity('Invalid link');
			valid = false;
		}

		var picture = element.elements[variables.picture];
		if(picture && picture.value.trim()!=""){
			if(!isUrlValid(picture.value.trim()) || !validateFileExtension(picture.value.trim(), [".jpg", ".jpeg", ".gif", ".png"]) ){
				picture.setCustomValidity('Invalid photo link');
				valid = false;
			}
		}
		var thumbnail = element.elements[variables.thumbnail];
		if(thumbnail && thumbnail.value.trim()!=""){
			if(!validateFileExtension(thumbnail.value.trim(), [".jpg", ".jpeg", ".gif", ".png"])){
				thumbnail.setCustomValidity('Invalid photo uploaded');
				valid = false;
			}
		}
	}
	else if(formType == postCategory.photo || formType == postCategory.video ){
		var source = element.elements[variables.source];
		var url = element.elements[variables.url];
		// need to validate server side extension
		if(source){
			if(formType == postCategory.photo){
				if(!validateFileExtension(source.value.trim(), [".jpg", ".jpeg", ".bmp", ".gif", ".png"])){
					source.setCustomValidity('Invalid photo uploaded');
					valid = false;
				}
			}
			else if(formType==postCategory.video){
				if(!validateFileExtension(source.value.trim(), [".3g2", ".3gp", ".3gpp", ".asf", ".avi", ".dat", ".divx", ".dv", ".f4v", ".flv", ".m2ts", ".m4v", ".mkv", ".mod", ".mov", ".mp4", ".mpe", ".mpeg", ".mpeg4", ".mpg", ".mts", ".nsv", ".ogm", ".ogv", ".qt", ".tod", ".ts", ".vob", ".wmv"])){
					source.setCustomValidity('Invalid video uploaded');
					valid = false;
				}
			}
		}
		if(url){
			// also check that url is of photo/video or not
			if(!isUrlValid(url.value.trim())){
				url.setCustomValidity('Invalid url');
				valid = false;
			}
		}
	}
	else{
		
	}
	if(!valid){
		event.preventDefault();
	}else{
		showPostsLoader();
	}
	

};

function validateFileExtension(sFileName, validFileExtensions) {
	var blnValid = false;
    if (sFileName.length > 0) {
        for (var j = 0; j < validFileExtensions.length; j++) {
            var sCurExtension = validFileExtensions[j];
            if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                blnValid = true;
                break;
            }
        }   
    }
    return blnValid;
};

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
};

function showPostsLoader(){
	$(".loader").show();
	$(".loaded").hide();

}
function hidePostsLoader(){
	$(".loader").hide();
	$(".loaded").show();
}
function showPaginationLoader(){
	$(".paginationloader").addClass('loader-active');
	$(".paginationloaded").hide();

}
function hidePaginationLoader(){
	$(".paginationloader").removeClass('loader-active');
	$(".paginationloaded").show();
}

$(window).load(function() {
	hidePostsLoader();
	hidePaginationLoader();
	
	// date picker initialization
	$(".scheduleLater").click(function(){
		var temp = this;
		var elem = temp.nextElementSibling.children[1];
		$(elem).DateTimePicker();
	});

	//
	$(".post-type-selection").click(function(){
		showPostsLoader();
	});
});
