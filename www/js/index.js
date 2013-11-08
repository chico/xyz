
var photos = [
    {photo:'https://dl.dropboxusercontent.com/u/21463137/luca.png', caption:''},
    {photo:'http://farm4.staticflickr.com/3767/9056854173_28bbd5c2cb_n.jpg', caption:''},
    {photo:'http://farm3.staticflickr.com/2835/8926405863_8b4afb79b9_m.jpg', caption:''},
    {photo:'http://farm4.staticflickr.com/3767/9056854173_28bbd5c2cb_n.jpg', caption:''},
    {photo:'http://farm3.staticflickr.com/2835/8926405863_8b4afb79b9_m.jpg', caption:''}
];

var contacts = [];

var selectedContacts = [];
selectedContacts.push({name: 'Me', email: 'chico.charlesworth@gmail.com'});

var captionInputFocus = false;

$('#mainPage').live('pageshow', function(event) {
    initCameraFromMain();

    $(".caption-input").focus( function() {
        $("#main-img-1").hide();
        $(".img-actions").hide();
        $(this).parent().css("height", "115px");
        $(this).css("width", "100%");
        $(this).css("max-height", "115px");
        $("#main-1 .directions-text").html("Add caption &amp; click Save.");
        $('.done-btn').hide();
        $('.save-btn').show();
        $('.save-btn').on('tap', function() {
            $(".caption-input").blur();
        });

        setTimeout(function() {captionInputFocus=true}, 1000);
    });

    $(".caption-input").blur( function() {
      captionInputFocus = false;
      $("#main-img-1").show();
      $(".img-actions").show();
      $(this).parent().css("height", "30px");
      $(this).css("width", "220px");
      $(this).css("max-height", "25px");
      $("#main-1 .directions-text").html("Add up to 5 photos &amp; click Done.");
      $('.save-btn').hide();
      $('.done-btn').show();

      alert('saving caption to ' + parseInt(($this).data("index"), 10) - 1);
      photos[parseInt(($this).data("index"), 10) - 1].caption = $(this).val();
    });

    $('.edit-img-btn').on("tap", function(){
        $(".caption-input").focus();
    });

    $(window).on("resize", function() {
        if (captionInputFocus) {
            $(".caption-input").blur();
        }
    });
    
});

$('#photoPage').live('pageshow', function(event) {

});

$('#indexPage').live('pageshow', function(event) {
    document.addEventListener("deviceready", initContacts, true);
});

$('#contactsPage').live('pageshow', function(event) {
    displayContacts();
});

$('#previewPage').live('pageshow', function(event) {
    displayPreview();
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

function toggleMain() {
    $('#main-0').hide();
    $('#main-1').show();
    $('#btn-done').show();
}

function initCameraFromMain() {

    var replaceMainImage = function(src) {
        document.getElementById('main-img-1').src = src;
    };

    var makeThumbnailActive = function(img, imgIndex) {
        $(img).parent().addClass("active").siblings().removeClass('active');
        replaceMainImage($(img).attr('src'));
        alert('index = ' + imgIndex);
        $(".caption-input").data("index", imgIndex);
        alert('caption = ' + photos[imgIndex - 1].caption);
        $(".caption-input").val(photos[imgIndex - 1].caption);
        alert('ok');
    };

    var onSuccess = function(uri, imgIndex) {
        if (imgIndex == "1") {
            replaceMainImage(uri);
        }

        image = document.getElementById('main-img-thumb-' + imgIndex);
        image.src = uri;        
        $(image).data("index", imgIndex);

        photos[imgIndex - 1].photo = uri;

        if (imgIndex == "1") {
            toggleMain();            
        } else {
            $('#btn-camera-' + imgIndex).hide();
            $('#main-img-thumb-' + imgIndex).show();
        }

        makeThumbnailActive(image, imgIndex);
        $(image).bind('tap', function() {
            alert('tap');
            makeThumbnailActive(this, parseInt(($this).data("index"), 10));
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

function validateName(name) { 
    var re = new RegExp("^[a-zA-Z ,.'-]+$");
    return re.test(name);
}

function validateEmail(email) {
    var re = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
    return re.test(email);
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

            if (name && name.trim().length > 0 && validateName(name.trim())) {
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

function renderContact(el, name, email, top, active) {
    var classAttrs = '';
    if (top) {
        classAttrs += ' top-border';
    }
    if (active) {
        classAttrs += ' active';
    }    
    var html = '';
    html += '<div class="contact' + classAttrs + '" data-contact-name="' + name + '" data-contact-email="' + email + '">';
    html += '<div>';
    html += '<a data-iconpos="notext" href="#" data-role="button" data-icon="flat-checkround" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="a" title="" class="ui-btn ui-shadow ui-btn-up-a" style="height: 28px; width: 45px; border: none; border-left: 1px solid #ecf0f1; background-color: #fff; float: left;"><span class="ui-btn-inner" style="padding: 5px;"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-flat-checkmark ui-icon-shadow">&nbsp;</span></span></a>';
    html += '</div><div><p>' + name + '</p><p>' + email + '</p></div></div>';

    $(el).append(html);
}

function toggleContact(name, email) {
    $(".all-contacts .contact[data-contact-name='" + name + "'][data-contact-email='" + email + "']").toggleClass("active");
}

function findSelectedContact(name, email) {
    var index = -1;
    for (var i = 0; i < selectedContacts.length; i++) {
        if (selectedContacts[i].name === name && selectedContacts[i].email === email) {
            index = i;
            break;
        }
    }
    return index;
}

function addSelectedContact(name, email) {
    if (findSelectedContact(name, email) < 0) {
        selectedContacts.push({name: name, email: email});
    }
}

function removeSelectedContact(name, email) {
    var indexToRemove = findSelectedContact(name, email);
    if (indexToRemove >= 0) {
        selectedContacts.splice(indexToRemove, 1);
    }
}

function renderSelectedContacts() {
    $('.selected-contacts').html("");
    for (var i = 0; i < selectedContacts.length; i++) {
        renderContact('.selected-contacts', selectedContacts[i].name, selectedContacts[i].email, false, true);
    }
    $('.selected-contacts .contact').each(function() {
        $(this).on('tap', function(event) {
            event.stopPropagation();
            event.preventDefault();

            $(this).toggleClass("active");
            if ($(this).hasClass("active")) {
                addSelectedContact($(this).data('contact-name'), $(this).data('contact-email'));
            } else {
                removeSelectedContact($(this).data('contact-name'), $(this).data('contact-email'));
            }
            toggleContact($(this).data('contact-name'), $(this).data('contact-email'));
            renderSelectedContactsHeading();
        });
    });
}

function renderSelectedContactsHeading() {
    var suffix = ' contacts selected';
    if (selectedContacts.length == 1) {
        suffix = ' contact selected';
    }
    $('.heading:first-child').html(selectedContacts.length + suffix);
}

function renderContacts(letter) {
    $('.all-contacts').html("");
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].name.substring(0, 1).toUpperCase() != letter.toUpperCase()) {
            continue;
        }
        if (contacts[i].emails) {
            for (var j = 0; j < contacts[i].emails.length; j++) {
                if (validateEmail(contacts[i].emails[j].value)) {
                    renderContact('.all-contacts', contacts[i].name, contacts[i].emails[j].value, false, findSelectedContact(contacts[i].name, contacts[i].emails[j].value) >= 0);
                }
            }
        }
    }

    $('.all-contacts .contact').each(function() {
        $(this).on('tap', function(event) {
            event.stopPropagation();
            event.preventDefault();

            $(this).toggleClass("active");
            if ($(this).hasClass("active")) {
                addSelectedContact($(this).data('contact-name'), $(this).data('contact-email'));
            } else {
                removeSelectedContact($(this).data('contact-name'), $(this).data('contact-email'));
            }
            renderSelectedContacts();
            renderSelectedContactsHeading();
        });
    });
}

function displayContacts() {

    $('.add-contact .collapse').on('tap', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $('.selected-contacts').show();
            $('.add-contact .collapse div:first-child').removeClass("arrow_box").addClass("arrow_box_top");
        } else {
            $('.selected-contacts').hide();            
            $('.add-contact .collapse div:first-child').removeClass("arrow_box_top").addClass("arrow_box");
        }
    });

    $('.alphabet div').on('tap', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $(this).addClass("active").siblings().removeClass('active');
        renderContacts($(this).html());
    });

    renderSelectedContacts();

    renderContacts("A");
    renderSelectedContactsHeading();

}

function displayPreview() {
    for(var i=0; i < photos.length; i++) {
        if (photos[i]) {

            var html = '';

            if (i === 0) {
                html += '<div class="photo full"><img src="' + photos[i] + '" alt="" border="0" height="100%"></img><p></p></div>';
            } else {
                html += '<div class="photo"><img src="' + photos[i] + '" alt="" border="0" height="100%"></img><p></p></div>';
            }

            $('.preview-photos').append(html);
        }
    }
}




