function checkURL(url) {
    var string = url.value;
    if (!~string.indexOf("http")){
        string = "http://" + string;
    }
    url.value = string;
    return url;
}

jQuery(document).ready(function() {
  // if there are no results, we try to reload after n milliseconds.
  // then check again. if on 3rd try there is nothing, we give up and display an error message.
  var tries = 0;
  var blockedurl = jQuery('#wp_blocked_url').val();

  // check if table has more than 0 results
  var resultRows = jQuery('.url-results tbody').find('tr').length;

  setInterval(function(){
    if(!resultRows || resultRows < 2) {
        if(tries < 10) {
            jQuery.ajax({
                beforeSend: function() {
                    jQuery('#blocked-results-loader').fadeIn('fast');
                },
                url : myAjax.ajaxurl,
                method: "POST",
                data: { action: "reload_blocked_results", url: blockedurl },
                dataType: "text",
                cache: false,
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error: " + xhr.status + thrownError);
                },
                success: function(response) {
                    jQuery('#table-results').html(response);
                    jQuery('#blocked-results-loader').fadeOut('slow');
                }
            });
			tries++;
			console.log("Trying to load more results: " + tries);
        } else {
			console.log("Can't load more results.");
		}
    }
  }, 4000);
});
