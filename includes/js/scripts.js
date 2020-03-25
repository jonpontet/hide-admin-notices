jQuery(document).ready(function(){
     if(jQuery('.updated:not(#bulk-action-form .updated):not(#dashboard-widgets-wrap .updated), .error:not(#bulk-action-form .error):not(#dashboard-widgets-wrap .error), .notice:not(#bulk-action-form .notice):not(#dashboard-widgets-wrap .notice)').length != 0){
        jQuery('#screen-meta-links').prepend('<div id="show-notice" class=""><button type="button" id="show-notice-link" class="button show-notice">Show Notice</button></div>');
     }else{
         jQuery('#show-notice').remove();
     }

    jQuery(document).on('click','#show-notice',function(){
        jQuery('#show-notice button').toggleClass('show-notice-active');
        jQuery('.updated:not(#bulk-action-form .updated):not(#dashboard-widgets-wrap .updated), .error:not(#bulk-action-form .error):not(#dashboard-widgets-wrap .error), .notice:not(#bulk-action-form .notice):not(#dashboard-widgets-wrap .notice)').slideToggle('slow');
    })
});