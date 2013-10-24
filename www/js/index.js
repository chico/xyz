
$('#photoPage').live('pageshow', function(event) {
    initCamera();
});

$('#setupPage').live('pageshow', function(event) {
    initDatePicker();
});

$('#mainPage').live('pageshow', function(event) {
    initCameraFromMain();
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

function initCameraFromMain() {

    var imgIndex = "1";

    var onSuccess = function(uri) {
        alert(imgIndex);

        var image = document.getElementById('main-img-' + imgIndex);
        image.src = uri;

        image = document.getElementById('main-img-thumb-' + imgIndex);
        image.src = uri;

        if (imgIndex == "1") {
            $('#main-0').hide();
            $('#main-1').show();
        } else {
            $('#btn-camera-' + imgIndex).hide();
            $('#main-img-thumb-' + imgIndex).show();
        }
    };

    var onFail = function() {
        console.log('Failed to get an image');
    };


    $('.btn-camera').each(function() {
        imgIndex = $(this).data("img-index");
        alert(imgIndex);
        $(this).bind('tap', function() {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        });
    });

}




