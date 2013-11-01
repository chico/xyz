
var contacts = [];

$('#mainPage').live('pageshow', function(event) {
    initCameraFromMain();
});

$('#indexPage').live('pageshow', function(event) {
    document.addEventListener("deviceready", initContacts, true);
});

$('#contactsPage').live('pageshow', function(event) {
    displayContacts();
});

$('#photoPage').live('pageshow', function(event) {
    initCamera();
});

$('#setupPage').live('pageshow', function(event) {
    initDatePicker();
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
        // alert(results.length + ' contacts found');
        for (var i=0; i<results.length; i++) {
            var name = null;
            if (results[i].displayName) {
                name = results[i].displayName;
            } else if (results[i].name) {
                if (results[i].name.formatted) {
                    name = results[i].name.formatted;
                }
            }


            if (name && name.trim().length > 0 && new RegExp("^[a-zA-Z ,.'-]+$").test(name.trim())) {
                contacts.push({
                    name: name,
                    emails: results[i].emails,
                    photos: results[i].photos
                });
            }
        }
        contacts.sort(
            function(a,b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            }
        );
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

function renderContact(name, email, top) {
    var html = '';
    if (top) {
        html += '<div class="contact top-border">';
    } else {
        html += '<div class="contact">';
    }
    html += '<div>';
    html += '<a data-iconpos="notext" href="#" data-role="button" data-icon="flat-checkround" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="a" title="" class="ui-btn ui-shadow ui-btn-up-a" style="height: 28px; width: 45px; border: none; border-left: 1px solid #ecf0f1; background-color: #fff; float: left;"><span class="ui-btn-inner" style="padding: 5px;"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-flat-checkmark ui-icon-shadow" style="color: #7f8c8d;">&nbsp;</span></span></a>';
    html += '</div><div><p>' + name + '</p><p>' + email + '</p></div></div>';

    $('#contacts').append(html);
}

function displayContacts() {

    var count = 0;
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].emails) {
            for (var j = 0; j < contacts[i].emails.length; j++) {
                if (count < 5) {
                    alert(contacts[i].name + " - " + contacts[i].emails[j].value);
                }
                renderContact(contacts[i].name, contacts[i].emails[j].value, (count == 0));
                count++;
            }
        }
    }

    count += 1; // one extra for default Me contact
    $('.contacts .heading').html('1 of ' + count + ' contacts');

}




