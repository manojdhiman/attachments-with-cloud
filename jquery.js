/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
	
    $('.view .attach-file').html('');
    $('.action-help').html('');
    $("<p class='action-help'>Press enter to add action item</p>").insertAfter("#action-text");
    $('.view .action-help').html('');
    $('[data-rel="tooltip"]').tooltip();
    $('.actio-list .prioritychange,.view .prioritychange').attr("contentEditable", false);
    $('.actio-list .prioritychange,.view .prioritychange').removeAttr("data-original-title");
    $(".actio-list br,.items-action br").remove();
    $(".actio-list .prioritychange,.view .prioritychange").click(function() {

        return false;
    });

    $('[data-rel="popover"]').popover({
        html: true,
        placement: 'right',
        trigger: 'hover'
    });

    $('.preventDefault').on('click', function(e) {
        e.preventDefault();
    });
    $(document).on('click','.removeattach', function(e) {
		
        $(this).parents('.attach').remove();
    });
	

    $('a.dropdown-toggle').attr('href', '#');

    $('.datepickericon').datepicker().on('changeDate', function(ev) {
        var date = new Date(ev.date);
        var day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString();
        var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        var year = date.getFullYear();

        $(this).siblings('[name*="day"]').val(day);
        $(this).siblings('[name*="month"]').val(month);
        $(this).siblings('[name*="year"]').val(year);
        $(this).datepicker('hide');
    });

    $('[name*="day"], [name*="month"], [name*="year"]').change(function() {
        var date = $(this).parent().children('[name*="day"]').val() + '-' + $(this).parent().children('[name*="month"]').val() + '-' + $(this).parent().children('[name*="year"]').val();
        $(this).siblings('.datepickericon').attr('data-date', date).datepicker('update').update();
    }).click(function(e) {

    });


    /* Handling progress bar initialisation */
    $('.bar').each(function() {
        $(this).css('width', 0).hide(0);
    });
    setTimeout(function() {
        $('.progress .bar').each(function() {
            $(this).show(0).css('width', (parseFloat($(this).attr('data-progress'))) + '%');
        });
    }, 1);
    /* Handling progress bar initialisation */


    /* Handling alerts */
    $('.alert').hide();
    $('.alert').show('slow');
    var alertTimeout = setTimeout(function() {
        $('.alert:not(.keepopen)').hide('slow');
    }, 5000);
    $('.alert').mouseover(function() {
        clearTimeout(alertTimeout);
    });
    $('.alert .close').click(function() {
        $(this).parent('.alert').hide('slow');
    });
    /* Handling alerts */

    $('label').click(function() {
        $(this).parents("form").find('#' + $(this).attr("for")).focus();
    });



    jQuery('.submenu').hover(function() {
        jQuery(this).children('ul').removeClass('submenu-hide').addClass('submenu-show');
    }, function() {
        jQuery(this).children('ul').removeClass('.submenu-show').addClass('submenu-hide');
    }).find("a:first").append(" &raquo; ");

    $('.blockinterface').on('click', function() {
        $.blockUI({
            css: {
                border: "none",
                padding: "15px",
                backgroundColor: "#000",
                "-webkit-border-radius": "10px",
                "-moz-border-radius": "10px",
                opacity: .5,
                color: "#fff"
            }
        });
    });

});

jQuery(window).load(function() {
    function scrollToAndHighlightAnchor(id) {
        jQuery('html,body').animate({
            scrollTop: $("#" + id).offset().top - 60
        }, 'slow', function() {
            $("#" + id).effect("pulsate", {
                times: 2
            }, 300);
        });
    }

    if (window.location.hash != '') {
        scrollToAndHighlightAnchor(window.location.hash.substr(1));
    }
});

function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
        .removeAttr('checked').removeAttr('selected');
}

jQuery.fn.outerHTML = function(s) {
    return s ? this.before(s).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
};

jQuery.fn.valText = function(s) {
    var value = $(this).val();
    var valueInTag = '<p>' + value + '</p>';
    return $(valueInTag).text();
};

$(document).ready(function() {
    $('#meetingnotes input,#meetingnotes select').keypress(function(event) {
        return event.keyCode != 13;
    });

    $("#action-text").keypress(function(e) {
        if (e.which == 13) {
            var html = '<div class="single-action"><input type="checkbox"  name="task" class="mark-as-done">';
            html += '<div contenteditable="true" class="items-action newaction">' + $(this).html();
            html += '<span data-original-title="click to change priority" data-rel="tooltip" contenteditable="false" class="prioritychange label normal">normal</span></div></div>';
            $('.action-wrapper').append(html);
            $(this).html('');
        }
    });
    $(document).on('change', '.priority', function() {
        var val = $(this).val();
        $(this).parents('.items-action').append('<span contenteditable="false" class="prioritychange label ' + val + '">' + val + '</span>');
        $(this).remove();
    })
    $(document).on('click', '.edit .prioritychange', function() {
        var value = $(this).html();
        var html = '<select class="priority"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select>';
        $(this).parents('.items-action').append(html);
        $('.priority').val(value);
        $(this).remove();
    })
    tinymce.init({
        selector: "div.editable",
        inline: true,
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |print preview  | forecolor backcolor emoticons | link image media |datepicker"
    });
    $(document).on("click", "#rte-button-publish", function() {
        var selector = $(this);
        $(selector).text('please wait...');
        $(selector).attr('disabled', 'disabled');
        // var base_url = '<?php echo Router::url('/', true); ?>';
        var content = tinyMCE.activeEditor.getContent();
        var name = $('#comment_ifr').contents().find("#title").html();
        $.ajax({
            url: base_url + '/notes/savenotes',
            type: 'POST',
            data: {
                'content': content,
                'name': name
            },
            success: function(data) {
                $(selector).text('save');
                $(selector).removeAttr('disabled');
            },
            error: function(data) {
                $(selector).text('save');
                $(selector).removeAttr('disabled');
                alert('Some Error Occurred. Please Try Later.');
            }
        });
    });

    $(document).on('click', '#rte-button-cancel', function() {
        window.location.href = base_url + '/notes';
    });
    $(document).on('click', 'time', function() {
        $('.datepicker').datepicker('show');
    })
    $(".datepicker").datepicker({
        onSelect: function(dateText, inst) {
            // insert into editor-
            $('time').html(dateText);
        },
        beforeShow: function(input, inst) {
            // change position
            // see http://stackoverflow.com/questions/662220/how-to-change-the-pop-up-position-of-the-jquery-datepicker-control

            var $dpBtn = $("time");
            var buttonPos = $dpBtn.position();

            inst.dpDiv.css({
                // cannot use top: and left: attrs here since they are hard-set inline anyway
                marginTop: 20 + 'px',

            });
        }
    });
});

function getuser(cb) {

    $.ajax({
        url: base_url + '/notes/getusers',
        type: 'POST',
        success: function(data) {
            var data = jQuery.parseJSON(data);
            cb(data);
        },
        error: function(data) {
            //getuser();
        }
    });

}

$(document).ready(function() {
    $(document).on('click', '.save-note,.save_new ', function() {
        $("#description").val($('#meetingnotes').html());
        var ProjectsNoteCode = $('#ProjectsNoteCode').val();
        $('.newaction .action-items').each(function(i, el) {

            el = $(el);
            var mentions_user = el.html();
            var action_items = el.parents('.items-action').html();
            var project_id = $('#project_id_note').val();

            $.ajax({
                type: "POST",
                url: base_url + '/notes/addactionitems', // Database name search 
                data: {
                    'user': mentions_user,
                    'action_items': action_items,
                    'project_id': project_id,
                    'note_code': ProjectsNoteCode
                },
                cache: false,
                success: function(data) {

                },
                error: function(e) {
                    alert('there is an error to save the action items');
                }
            });
        });

        $('.mentions').each(function(i, el) {

            el = $(el);
            var mentions_user = el.html();
            var action_items = el.html();
            var project_id = $('#project_id_note').val();
            //var ProjectsNoteCode = $('#ProjectsNoteCode').val();
            $.ajax({
                type: "POST",
                url: base_url + '/notes/addmentionitems', // Database name search 
                data: {
                    'user': mentions_user,
                    'action_items': action_items,
                    'project_id': project_id,
                    'note_code': ProjectsNoteCode
                },
                cache: false,
                success: function(data) {

                },
                error: function(e) {
                    alert('there is an error to save the action items');
                }
            });
        });


    })


    var start = /@/ig; // @ Match
    var word = /@(\w+)/ig; //@abc Match

    $(document).on("keyup", "#action-text", function() {
        var content = $(this).html(); //Content Box Data
        var go = content.match(start); //Content Matching @
        var name = content.match(word); //Content Matching @abc
        var dataString = 'searchword=' + name;
        //If @ available
        if (go.length > 0) {
            $("#msgbox").slideDown('show');
            $("#display").slideUp('show');
            $("#msgbox").html("Type the name of someone or something...");
            //if @abc avalable
            if (name.length > 0) {
                $.ajax({
                    type: "POST",
                    url: base_url + '/notes/getusers', // Database name search 
                    data: dataString,
                    cache: false,
                    success: function(data) {
                        $("#msgbox").hide();
                        $("#display").html(data).show();
                    }
                });
            }
        }
        return false;
    });

    //Adding result name to content box.
    $(document).on("click", ".addname", function() {
        var username = $(this).attr('title');
        var old = $("#action-text").html();
        var content = old.replace(word, " "); //replacing @abc to (" ") space
        $("#action-text").html(content);
        var E = "&nbsp<a class='red action-items' contenteditable='false' href='#' >" + username + "</a>&nbsp; ";
        $("#action-text").append(E);
        $("#action-text br").remove();
        $("#display").hide();
        $("#msgbox").hide();
    });
});
$(document).ready(function() {
    var start2 = /(?:@|#)/ig; // @ Match
    var word2 = /(?:@|#)(\w+)/ig; //@abc Match

    $(document).on("keyup", "#mention-text", function() {
        var content2 = $(this).html(); //Content Box Data
        var go = content2.match(start2); //Content Matching @
        var name = content2.match(word2); //Content Matching @abc
        var tomatch = content2.match(word2).toString();
        var atexist = (tomatch.indexOf('@') >= 0) ? true : false;
        var hashexist = (tomatch.indexOf('#') >= 0) ? true : false;
        var dataString = 'searchword=' + name;
        if (go.length > 0 && atexist) {
            $("#msgbox-dept").slideDown('show');
            $("#display-dept").slideUp('show');
            $("#msgbox-dept").html("Type the name of someone or something...");
            //if @abc avalable
            if (name.length > 0) {
                $.ajax({
                    type: "POST",
                    url: base_url + '/notes/getusersdept', // Database name search 
                    data: dataString,
                    cache: false,
                    success: function(data) {
                        $("#msgbox-dept").hide();
                        $("#display-dept").html(data).show();
                    }
                });
            }
        }
        if (go.length > 0 && hashexist) {
            $("#msgbox-dept").slideDown('show');
            $("#display-dept").slideUp('show');
            $("#msgbox-dept").html("Type the name of someone or something...");
            //if @abc avalable
            if (name.length > 0) {
                $.ajax({
                    type: "POST",
                    url: base_url + '/notes/getdept', // Database name search 
                    data: dataString,
                    cache: false,
                    success: function(data) {
                        $("#msgbox-dept").hide();
                        $("#display-dept").html(data).show();
                    }
                });
            }
        }
        return false;
    });

    //Adding result name to content box.
    $(document).on("click", ".addname2", function() {
        var username2 = $(this).attr('title');
        var old2 = $("#mention-text").html();
        var content2 = old2.replace(word2, " "); //replacing @abc to (" ") space
        $("#mention-text").html(content2);
        var E2 = "&nbsp<a class='red mentions' contenteditable='false' href='#' >" + username2 + "</a>&nbsp; ";
        $("#mention-text").append(E2);
        $("#mention-text br").remove();
        $("#display-dept").hide();
        $("#msgbox-dept").hide();
    });

    //Adding result name to content box.
    $(document).on("click", ".adddept2", function() {
        var username2 = $(this).attr('title');
        var dept = $(this).attr('alt');
        var old2 = $("#mention-text").html();
        var content2 = old2.replace(word2, " "); //replacing @abc to (" ") space
        $("#mention-text").html(content2);
        var dataString = 'dept=' + dept;
        $.ajax({
            type: "POST",
            url: base_url + '/notes/getuserfromdepartment', // Database name search 
            data: dataString,
            cache: false,
            success: function(data) {
                $("#mention-text").append(data);
                $("#mention-text br").remove();
                $("#display-dept").hide();
                $("#msgbox-dept").hide();
            }
        });

    });

    $(document).on("click", ".mark-as-done", function() {
        if (this.checked) {

            $(this).next().addClass('mark-done');
            this.setAttribute("checked", "checked");
            markasdone();
        } else {

            $(this).next().removeClass('mark-done');
            this.removeAttribute("checked");
            markasdone();
        }

    });
})

$(document).on("click", ".mark-as-complete", function() {
    var selecter = $(this);
    var id = $(this).attr('alt');
    if (selecter.attr('name') == 'close') {
        var action = 1;
    } else if (selecter.attr('name') == 'reopen') {
        var action = 0;
    }


    if (this.checked || action == 0) {

        markascomplete(id, action, selecter);
    }

});

function markascomplete(id, action, selecter) {

    $.ajax({
        type: "POST",
        url: base_url + '/notes/markcomplete',
        data: {
            'id': id,
            'action': action,
        },
        cache: false,
        success: function(data) {
            window.location.reload(true);
        }
    });

}

function markasdone() {
    var note_id = $('#notecode').val();
    var content = $('#notecontent').html();
    $.ajax({
        type: "POST",
        url: base_url + '/notes/markdone',
        data: {
            'id': note_id,
            'content': content,
        },
        cache: false,
        success: function(data) {
            $("#mention-text").append(data);
            $("#mention-text br").remove();
            $("#display-dept").hide();
            $("#msgbox-dept").hide();
        }
    });
}

function noteAttachlocal() {

    $('#fileupload').trigger('click');
}
$(function() {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var url = base_url + 'fileupload';
    $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            done: function(e, data) {
                $.each(data.result.files, function(index, file) {
                    var url = file.url.replace('/app/webroot/', '/');
                    var file = "<div class='attach'><i class='ico-delete link removeattach'></i><a target='_blank' href='" + url + "'>" + file.name + "</a></div>"
                    $('#attachments').append(file);
                    $('#progress').hide();
                    $('.prgresscounter').html('');
                    $('#progress .progress-bar').css('width', '0%');
                });
            },
            progressall: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress').show();
                $('.prgresscounter').html(progress + '%');
                $('#progress .progress-bar').css('width', progress + '%');
            }
        }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});

function fileupload(element) {

    $('#uploader').trigger('click');
}

function fileuploadouter(element) {
	if($(element).attr('data-rel'))
	$('#project_id').val($(element).attr('data-rel'));
    $(element).next('.uploaderouter').trigger('click');
}
$(document).on('change','.uploaderouter',function()
{
	var projectid=$('#project_id').val();
	var url = base_url + 'admin/uploads/add/'+projectid;
	$(this).fileupload({
            url: url,
            dataType: 'json',
            done: function(e, data) {
                 //window.location.reload(true);
            },
            progressall: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress').show();
                $('.prgresscounter').html(progress + '%');
                $('#progress .progress-bar').css('width', progress + '%');
            }
        }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
	
});
$(function() {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var projectid=$('#project_id').val();
    var url = base_url + 'admin/uploads/add';
    if(projectid)
    url+='/'+projectid;
    $('#uploader').fileupload({
            url: url,
            dataType: 'json',
            done: function(e, data) {
                 //window.location.reload(true);
            },
            progressall: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress').show();
                $('.prgresscounter').html(progress + '%');
                $('#progress .progress-bar').css('width', progress + '%');
            }
        }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});



function initPicker() {
    var picker = new FilePicker({
        apiKey: 'AIzaSyD-vR3KTfGdzHlpTJU-QfQJHNdACDWfs-0',
        clientId: '1019652465109-2m0237gte3nmqcs9419sq9mg6ajkap4u',
        buttonEl: document.getElementById('googlepicker'),
        onSelect: function(file) {
		
            var file = "<div class='attach'><i class='ico-delete link removeattach'></i><a target='_blank' href='" + file.alternateLink + "'>" + file.title + "</a></div>"
            $('#attachments').append(file);
        }
    });
}

function noteAttachdb() {
    var options = {

        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
			$.each(files, function(index, file) {
                   
                    var file = "<div class='attach'><i class='ico-delete link removeattach'></i><a target='_blank' href='" + file.link + "'>" + file.name + "</a></div>"
                    $('#attachments').append(file);
                    //$('#progress').hide();
                    //$('.prgresscounter').html('');
                    //$('#progress .progress-bar').css('width', '0%');
                });
            //var file = "<div class='attach'><i class='ico-delete link removeattach'></i><a target='_blank' href='" + files[0].link + "'>" + files[0].name + "</a></div>"
            //$('#attachments').append(file);
        },
        cancel: function() {

        },
        linkType: "preview", // or "direct"
        multiselect: true, // or true
    };
    Dropbox.choose(options);
}




/**!
 * Google Drive File Picker Example
 * By Daniel Lo Nigro (http://dan.cx/)
 */
(function() {
    /**
     * Initialise a Google Driver file picker
     */
    var FilePicker = window.FilePicker = function(options) {
        // Config
        this.apiKey = options.apiKey;
        this.clientId = options.clientId;

        // Elements
        this.buttonEl = options.buttonEl;

        // Events
        this.onSelect = options.onSelect;
        this.buttonEl.addEventListener('click', this.open.bind(this));

        // Disable the button until the API loads, as it won't work properly until then.
        this.buttonEl.disabled = true;

        // Load the drive API
        gapi.client.setApiKey(this.apiKey);
        gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
        google.load('picker', '1', {
            callback: this._pickerApiLoaded.bind(this)
        });
    }

    FilePicker.prototype = {
        /**
         * Open the file picker.
         */
        open: function() {
            // Check if the user has already authenticated
            var token = gapi.auth.getToken();
            if (token) {
                this._showPicker();
            } else {
                // The user has not yet authenticated with Google
                // We need to do the authentication before displaying the Drive picker.
                this._doAuth(false, function() {
                    this._showPicker();
                }.bind(this));
            }
        },

        /**
         * Show the file picker once authentication has been done.
         * @private
         */
        _showPicker: function() {
            var accessToken = gapi.auth.getToken().access_token;
            this.picker = new google.picker.PickerBuilder().
            addView(google.picker.ViewId.DOCUMENTS).
            setAppId(this.clientId).
            setOAuthToken(accessToken).
            setCallback(this._pickerCallback.bind(this)).
            build().
            setVisible(true);
        },

        /**
         * Called when a file has been selected in the Google Drive file picker.
         * @private
         */
        _pickerCallback: function(data) {
            if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                var file = data[google.picker.Response.DOCUMENTS][0],
                    id = file[google.picker.Document.ID],
                    request = gapi.client.drive.files.get({
                        fileId: id
                    });

                request.execute(this._fileGetCallback.bind(this));
            }
        },
        /**
         * Called when file details have been retrieved from Google Drive.
         * @private
         */
        _fileGetCallback: function(file) {
            if (this.onSelect) {
                this.onSelect(file);
            }
        },

        /**
         * Called when the Google Drive file picker API has finished loading.
         * @private
         */
        _pickerApiLoaded: function() {
            this.buttonEl.disabled = false;
        },

        /**
         * Called when the Google Drive API has finished loading.
         * @private
         */
        _driveApiLoaded: function() {
            this._doAuth(true);
        },

        /**
         * Authenticate with Google Drive via the Google JavaScript API.
         * @private
         */
        _doAuth: function(immediate, callback) {
            gapi.auth.authorize({
                client_id: this.clientId + '.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive.readonly',
                immediate: immediate
            }, callback);
        }
    };
}());
