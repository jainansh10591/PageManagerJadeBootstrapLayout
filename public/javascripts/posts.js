$(window).load(function() {
	var result = ["BOOK_TRAVEL","BUY_NOW","CALL_NOW","DOWNLOAD","GET_DIRECTIONS","GET_QUOTE","INSTALL_APP","INSTALL_MOBILE_APP","LIKE_PAGE","LISTEN_MUSIC","MESSAGE_PAGE","NO_BUTTON","OPEN_LINK","PLAY_GAME","SHOP_NOW","SIGN_UP","SUBSCRIBE","USE_APP","USE_MOBILE_APP","WATCH_MORE","WATCH_VIDEO"];
	var optionsValues = '<select id="call-to-action-select" name="callToActionSelect">';

	// default selected
	optionsValues += '<option value="LEARN_MORE" selected>LEARN_MORE</option>';

    $.each(result, function(item) {
		optionsValues += '<option value="' + result[item] + '">' + result[item] + '</option>';
    });
	optionsValues += '</select>';
	var options = $('#call-to-action-select');
	options.replaceWith(optionsValues);
});