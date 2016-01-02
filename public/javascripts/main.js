// Posting on page
function formSubmission(element, event){
	//$(".loader").addClass( "loader-active" );
	var valid = true;
	var formType = element.elements["type"].value;
	if(formType == "status"){
		
	}
	else if(formType == "link"){
		var link = element.elements["link"];
		if(link.value.trim() == ""){
			valid = false;
		}
		if(!isUrlValid(link.value.trim())){
			valid = false;
		}
		var picture = element.elements["picture"];
		if(picture && picture.value.trim()!=""){
			if(!isUrlValid(picture.value.trim())){
				valid = false;
			}
			if(!validateFileExtension(picture.value.trim(), [".jpg", ".jpeg", ".gif", ".png"])){
				valid = false;
			}
		}
		var thumbnail = element.elements["thumbnail"];
		if(thumbnail && thumbnail.value.trim()!=""){
			if(!validateFileExtension(thumbnail.value.trim(), [".jpg", ".jpeg", ".gif", ".png"])){
				valid = false;
			}
		}
	}
	else if(formType == "photo" || formType == "video" ){
		var source = element.elements["source"];
		var url = element.elements["url"];
		// need to validate server side extension
		if(source){
			if(formType == "photo"){
				if(!validateFileExtension(source.value.trim(), [".jpg", ".jpeg", ".bmp", ".gif", ".png"])){
					valid = false;
				}
			}
			else if(formType=="video"){
				if(!validateFileExtension(source.value.trim(), [".3g2", ".3gp", ".3gpp", ".asf", ".avi", ".dat", ".divx", ".dv", ".f4v", ".flv", ".m2ts", ".m4v", ".mkv", ".mod", ".mov", ".mp4", ".mpe", ".mpeg", ".mpeg4", ".mpg", ".mts", ".nsv", ".ogm", ".ogv", ".qt", ".tod", ".ts", ".vob", ".wmv"])){
					valid = false;
				}
			}
		}
		if(url){
			// also check that url is of photo/video or not
			if(!isUrlValid(url.value.trim())){
				valid = false;
			}
		}
	}
	else{
		
	}
	if(!valid){
		event.preventDefault();
	}else{
		showLoader();
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

function showLoader(){
	$(".loader").show();
	$(".loaded").hide();

}
function hideLoader(){
	$(".loader").hide();
	$(".loaded").show();
}

$(window).load(function() {
	hideLoader();
	
	// date picker initialization
	$(".scheduleLater").click(function(){
		var temp = this;
		var elem = temp.nextElementSibling.children[1];
		$(elem).DateTimePicker();
	});

	//
	$(".post-type-selection").click(function(){
		showLoader();
	});
});
