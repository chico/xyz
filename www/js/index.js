
var contacts = [];

$('#photoPage').live('pageshow', function(event) {
    initCamera();
});

$('#setupPage').live('pageshow', function(event) {
    initDatePicker();
});

$('#mainPage').live('pageshow', function(event) {
    initCameraFromMain();
});

$('#indexPage').live('pageshow', function(event) {
    document.addEventListener("deviceready", initContacts, true);
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

    var replaceMainImage = function(src) {
        document.getElementById('main-img-1').src = src;
    };

    var makeThumbnailActive = function(img) {
        $(img).parent().addClass("active").siblings().removeClass('active');
        replaceMainImage($(img).attr('src'));
    };

    var onSuccess = function(uri, imgIndex) {
        if (imgIndex == "1") {
            replaceMainImage(uri);
        }

        image = document.getElementById('main-img-thumb-' + imgIndex);
        image.src = uri;

        if (imgIndex == "1") {
            $('#main-0').hide();
            $('#main-1').show();
            $('#btn-done').show();
        } else {
            $('#btn-camera-' + imgIndex).hide();
            $('#main-img-thumb-' + imgIndex).show();
        }

        makeThumbnailActive(image);
        $(image).bind('tap', function() {
            makeThumbnailActive(this);
        });
    };

    var onFail = function() {
        console.log('Failed to get an image');
    };


    $('.btn-camera').each(function() {
        var imgIndex = $(this).data("img-index");
        $(this).bind('tap', function() {
            navigator.camera.getPicture(
                function(uri) {
                    onSuccess(uri, imgIndex)
                },
                onFail,
                {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                }
            );
        });
    });

}

function initContacts() {

    var onSuccess = function(results) {
        alert(results.length + ' contacts found');
        for (var i=0; i<results.length; i++) {
            contacts.push({
                displayName: results[i].displayName,
                emails: results[i].emails,
                photos: results[i].photos
            });            
        }

        alert(contacts[0].displayName);
        if (contacts[0].emails.length > 0) {
            alert(contacts[0].emails[0].value + " - " + contacts[0].emails[0].type);
        }
        if (contacts[0].photos.length > 0) {
            alert(contacts[0].photos[0].value + " - " + contacts[0].photos[0].type);
        }
        alert('ok');
    }

    var onFail = function(error) {
        console.log('Failed to get contacts - ' + error);
    };

    // specify contact search criteria
    var options = new ContactFindOptions();
    options.multiple=true;      // return multiple results
    options.filter="";          // empty search string returns all contacts    

    var fields = ["displayName", "emails", "photos"];

    // find contacts
    navigator.contacts.find(
        fields,
        onSuccess,
        onFail,
        options);

}




