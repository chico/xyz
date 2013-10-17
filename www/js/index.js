
$('#photoPage').live('pageshow', function(event) {
    initCamera();
});

$('#setupPage').live('pageshow', function(event) {
    initDatePicker();
});

$('#mainPage').live('pageshow', function(event) {
    
});

function initDatePicker() {
    yepnope({
        test: Modernizr.inputtypes.date && Modernizr.inputtypes.time,
        nope: [
            'css/jqm-datebox.min.css',
            'js/jquery.mousewheel.js',
            'js/jqm-datebox.core.js',
            'js/jqm-datebox.mode.calbox.js',
            'js/jqm-datebox.mode.datebox.js',
            'js/jquery.mobile.datebox.i18n.en_US.utf8.js'],
        complete: function(url, result, key) {
            
            if (!Modernizr.inputtypes.date) {
                // polyfill the date inputs
                $( document ).on( "pagecreate create", function( e ){
                    $( "input[type='date']", e.target ).each(function() {
                        if ( typeof($(this).data('datebox')) === "undefined" ) {
                            $(this).datebox();
                        }
                    });
                });
                $("input[type='date']").each(function() {
                    if (typeof($(this).data('datebox')) === "undefined") {
                        $(this).datebox();
                    }
                });
            }
        
            if (!Modernizr.inputtypes.time) {
                // polyfill the time inputs
                $( document ).on( "pagecreate create", function( e ){
                    $( "input[type='time']", e.target ).each(function() {
                        if ( typeof($(this).data('datebox')) === "undefined" ) {
                            $(this).datebox();
                        }
                    });
                });
                $("input[type='time']").each(function() {
                    if (typeof($(this).data('datebox')) === "undefined") {
                        $(this).datebox();
                    }
                });
            }
        }
    });
}

function initCamera() {

    var onSuccess = function(uri) {
        // alert(uri);
        $('#image-upload img').css({
            'background-image': 'url('+uri+')',
            'background-size':  '100%'
        });
    };

    var onFail = function() {
        console.log('Failed to get an image');
    };

    $('.image-upload').bind('tap', function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    });

}




