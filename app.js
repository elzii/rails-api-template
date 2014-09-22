if(typeof jQuery == 'undefined') {
    console.log('%cERROR', 'color:red', ' - jQuery not found.')
} else {

var App;

!(function ($) {

    "use strict";

    App = window.APPLICATION = {};

    /**
     * Config
     * Debug toggling, environment, breakpoints, etc.
     */
    App.config = {

        environment : (window.location.href.match(/(localhost)/g) ? 'development' : 'production' ),
        debug: true,

        media_queries : {
            widescreen : 1280
        }
    }

    

    /**
     * Elements
     */
    App.$el = {
        
        modal               : $('.modal'),
        modal_bay           : $('#modals'),

        form                : $('#form-signup'),
        form_submit         : $('#form-submit'),
        form_text           : $('#form-text'),
        form_confirmation   : $('#form-confirmation'),
        form_error          : $('#form-error'),
        
        video_box           : $('.video-box'),

        curtains            : $('.curtains')
    }




    /**
     * Initiate Functions
     *
     */
    App.init = function(){
        App.initScripts();
        App.fixes();
        App.helpers.userAgentDetection();
        App.events();
        App.scroll();
        App.modals();
        App.animations();
        App.signupForm();
        App.videoPlayer();
        App.addThis();
        App.konamiCode();

        App.helpers.inputPlaceholders();
    
    };

    App.setElements = function() {

        
    }

    /**
     * Initialize Scripts
     *
     */
    App.initScripts = function(){

        // WOW.js
        if ( !window.WOW ) { 
            return false; 
        } else {
            new WOW().init();
        }

    }


    /**
     * Fixes
     *
     */
    App.fixes = function() {
        // invisible font fix for chrome
        if ( App.helpers.isBrowser().desktop_chrome ) {

            var chrome_fix_2 = function() {
                var orig_body_offset = $('body').offset();
                $('body').offset(orig_body_offset);
            }
            // Invoke Method 2
            // chrome_fix_2();
        }
    };



    
    /**
     * Click Event Bindings
     *
     */
    App.events = function(){


        

    };





    /**
     * Animations
     *
     */
    App.animations = function() {

       
    }


    /**
     * Scroll
     * 
     * @require `.scroll` class on <a>
     */
    App.scroll = function(){

        // <a> method manual
        $('a.scroll, li.scroll > a').click(function(e){
            e.preventDefault();

            var $this       = $(this),
                target_id   = $this.attr('href'),
                target      = $(target_id),
                duration    = (target.offset().top - $(window).scrollTop());

            App.helpers.animateScroll(target, duration, 'swing', 15);

        });
    };


    /**
     * Ajax Loader Event Bindings
     *
     */
    App.loadContentBindings = function() {

        $('*[data-load-content]').click(function (event) {

            event.preventDefault();

            var $this       = $(this),
                url         = $this.attr('href'),
                selector    = $this.data('load-content-selector'),
                target      = $this.data('load-content-target');

                console.log(url, selector, target);

            App.loadContent(url, selector, target);
        })
    }


    /**
     * Ajax Loader
     *
     */
    App.loadContent = function(url, selector, target, callback) {

        var request = $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html'
        })
        .done(function (data) {

            if ( App.config.debug ) { console.log("loadContent -> SUCCESS"); }

            if ( data ) { var html = $(data); }

            $(target).html(html.filter(selector));
        

            if ( callback !== undefined ) { callback(html); }
        })
        .fail(function (data) {
            if ( App.config.debug ) { console.log("error", data); }
        })

        // return request;
        
    }





    /**
     * Modals
     *
     */
    App.modals = function() {

        var modals          = App.$el.modal,
            modal_bay       = App.$el.modal_bay,
            modal_trigger   = $('.modal-trigger'),
            modal_close     = $('.modal-close');
            
        // move all modals to modal bay
        if ( modals )
            modals.appendTo(modal_bay);

        // attach modal trigger click handler
        modal_trigger.click(function (event) {
            event.preventDefault();

            var $this           = $(this),
                modal_target    = $($this.attr('href'));

                showModal(modal_target);
        });
        
        function showModal(target) {

            // modal overlay
            modal_bay.addClass('show');

            // show the modal
            target.addClass('show');
            
            // close via close button
            modal_close.click(function() {
                target.removeClass('show');
                modal_bay.removeClass('show');
            });
            // close via esc key
            $(window).on('keydown', function (event) {

                if ( event.keyCode == 27) {
                    target.removeClass('show');
                    modal_bay.removeClass('show');
                }
            });

        }

    }



    /**
     * videoPlayer
     * @return {[type]}
     */
    App.videoPlayer = function() {


        App.$el.video_box.click(function (event) {

            $(this)
                .removeClass('video-overlay')
                .addClass('video-active');

            App.$el.curtains.addClass('show')

            $(this).find('img').hide()

            $('#video')
                .show()
                .empty()
                .append('<iframe src="//player.vimeo.com/video/106630091?autoplay=1" width="712" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        })


        App.$el.curtains.click(function (event) {
            hideVideoPlayer();
        });

        $(window).on('keydown', function (event) {

            if ( event.keyCode == 27) {
                hideVideoPlayer();
            }
        });


        function hideVideoPlayer() {
            App.$el.curtains.removeClass('show');
            
            App.$el.video_box
                .addClass('video-overlay')
                .removeClass('video-active');
            
            App.$el.video_box.find('img').fadeIn(100);

            setTimeout(function(){
                $('#video').hide()
                $('#video iframe').remove()
            }, 550);
        }

    }



    /**
     * signupForm
     * @return {[type]}
     */
    App.signupForm = function() {

        App.$el.form.submit(function (event) {

            event.preventDefault();


            if ( !validate_email() ) {
                App.$el.form.find('#EMAIL').focus();
                App.$el.form.find('#EMAIL').parent().addClass('error');
                form_error('The email you entered is invalid.  Please use a valid email address.');
            }
            else if ( !validate_bank() ) {
                App.$el.form.find('#BANK').focus();
                App.$el.form.find('#BANK').parent().addClass('error');
                form_error('You must select a financial institution.');
            }

            if ( validate_email() && validate_bank() ) {
                $.post( $(this).attr("action"), $(this).serialize(), function(){
                    form_success();
                });
            }
        });

        App.$el.form.find('input, select').focus(function() { $(this).parent().addClass('focus'); })
        App.$el.form.find('input, select').blur(function() { 

            if ( validate_email() ) {
                App.$el.form.find('#EMAIL').parent().removeClass('error');
                App.$el.form_error.removeClass('show shakeFast');
            }
            if ( validate_bank() ) {
                App.$el.form.find('#BANK').parent().removeClass('error');
                App.$el.form_error.removeClass('show shakeFast');
            }
        })
        App.$el.form.find('#BANK').change(function() {
            if ( validate_bank() ) {
                App.$el.form.find('#BANK').parent().removeClass('error');
                App.$el.form_error.removeClass('show shakeFast');
            }
        });

        function validate_email() {
            var x = App.$el.form.find('#EMAIL').val();
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var valid = re.test(x);

            return valid;
        }
        function validate_bank() {
            var x = document.forms["form-signup"]["BANK"].value;
            if ( x == 0 ) {
                return false;
            } else {
                return true;
            }
        }

        function form_error(message) {
            App.$el.form_error.addClass('show animated animated-250 shakeFast');
            setTimeout(function() {
                App.$el.form_error.removeClass('shakeFast');
            }, 250)
            App.$el.form_error.empty().append(message);
        }

        function form_success() {
            App.$el.form.addClass('animated animated-500 fadeOutDown');

            setTimeout(function() {
                App.$el.form_confirmation.show();
                App.$el.form_confirmation.find('.form-confirmation__content').addClass('animated animated-show fadeInUp');
            }, 900)
        }

    }


    App.addThis = function() {

    }



    /**
     * Konami Code
     *
     */
    App.konamiCode = function() {

        var secret = '38403840373937396665',
            input  = '',
            timer;

        $(document).keyup(function (e) {

            input += e.which;

            clearTimeout(timer);

            timer = setTimeout(function() {
                input = '';
            }, 500);


            if( input == secret ) {
                // do stuff here
                if ( App.config.debug ) { console.log('konami code fired!'); }
            }
        })
    }



    




    /**
     * DOCUMENT READY
     *
     */
    $(document).ready(function(){
        
        App.init()

    });

   


    /**
     * WINDOW LOAD
     *
     */
    $(window).load(function(){
        

    });

    /**
     * WINDOW SCROLL
     *
     */
    $(window).on('scroll', function(){


    });


    /**
     * WINDOW RESIZE
     *
     */
    $(window).resize(function(){   
        


    }).trigger('resize');



    /**
     * ORIENTATION CHANGE (requires jQuery mobile)
     *
     */
    window.addEventListener("orientationchange", function() {
        
        

    }, false);




    /**
     * SELF INVOKING ANONYMOUS FUNCTION(s)
     *
     */
    (function(){ 

          

    })(); 




    /**
     * Helpers
     * Various helper functions for user agent detection and cross browser compatibility
     */
    App.helpers = {

        /**
         * isUserAgent
         * Determine the user agent via regex matching the string
         * @return {Boolean}
         */
        isUserAgent : function() {
            return {
                iOS         : (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
                iphone      : (navigator.userAgent.match(/(iPhone|iPod)/g) ? true : false),
                ipad        : (navigator.userAgent.match(/(iPad)/g) ? true : false),
                android     : (navigator.userAgent.match(/(Android)/g) ? true : false),
                mobile      : ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera) ? true : false),
                mobile_all  : ((/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera) ? true : false)
            }
        },

        /**
         * userAgentDetection
         * Perform actions if the user agent is a mobile device
         */
        userAgentDetection: function(){

            if ( App.helpers.isUserAgent().mobile ) {
                $('body').addClass('is_mobile');
            } else {
                $('body').addClass('non_mobile');
            }

        },

        /**
         * isBrowser
         * Determine the browser based on regex matching the navigator
         * @return {Boolean}
         */
        isBrowser: function() {
            return {
                desktop_chrome   : (window.chrome ? true : false),
                iphone_chrome    : ((navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/) && navigator.userAgent.match('CriOS')) ? true : false),
                iphone_safari    : ((navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/) && !navigator.userAgent.match('CriOS')) ? true : false),
                android_native   : (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('AppleWebKit') > -1 && navigator.userAgent.indexOf('Chrome') <= -1),
                android_chrome   : (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('AppleWebKit') > -1 && navigator.userAgent.indexOf('Chrome') > -1),
                android_samsung  : (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mozilla/5.0') > -1 && navigator.userAgent.indexOf('AppleWebKit') > -1 && navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('SCH') > -1)
            }
        },

        /**
         * onLocationHash
         * Run a callback function when a string is the location hash
         * @param  {String}   hash_string
         * @param  {Function} callback
         */
        onLocationHash: function(hash_string, callback) {

            if( window.location.hash ) {
                var hash = window.location.hash.substring(1); 
                
                if ( hash === hash_string ) {
                    callback();
                }
            } else {
                return false;
            }
        },

        /**
         * preloadImages
         * Preload images by passing in array of url strings
         * @param  {Array} array
         */
        preloadImages: function(array) {
            $(array).each(function (index, img_src){
                $('<img/>')[0].src = this;

                console.log('%cPreloaded', 'color:#4f89d1;', img_src);
            });
        },

        /**
         * inputPlaceholders
         * Faux placeholders for old browsers
         * @required Modernizr library
         */
        inputPlaceholders: function(use_modernizr) {

            $('[placeholder]').focus(function() {

                var input = $(this);

                if ( input.val() == input.attr('placeholder') ) {
                    input.val('')
                    input.removeClass('placeholder');
                }

            }).blur(function() {

              var input = $(this);

                if ( input.val() == '' || input.val() == input.attr('placeholder') ) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }

            }).blur();

            $('[placeholder]').parents('form').submit(function() {

                $(this).find('[placeholder]').each(function() {
                    
                    var input = $(this);

                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                })
            });
 
        },

        /**
         * openSharePane
         * Open a small popup, used for social share windows
         * @param  {String} url
         */
        openSharePane: function(url) {
            window.open( url, "socialShareWindow", "status = 1, height = 500, width = 650, resizable = 0" );
        },


        /**
         * renderHTMLPartial
         * Render an HTML partial to a page (hacky, work-in-progress, do-not-ever-use-in-production)
         * @param  {String} file_path
         */
        renderHTMLPartial: function(file_path, target_id) {
            $.ajax({
                url: file_path,
                dataType: 'html'
            })
            .done(function (data) {
                console.log('%cIncluding partial', 'color:red', file_path);

                var html = data.split("\n").join("");

                document.getElementById(target_id).innerHTML = html;
            })
        },

        /**
         * animateScroll
         * Scroll the window to the target element
         * @param  {String} target
         * @param  {Integer} duration
         * @param  {Sting} easing
         * @param  {Integer} offset
         */
        animateScroll: function(target, duration, easing, offset) {
            if(target){
                if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, duration, easing);
                } else {
                    $('html, body').animate({
                        scrollTop: target.offset().top - (offset)
                    }, duration, easing);
                }
            }
        },

        testFunc: function() {
            console.log(this);
        }
    }


    

})(jQuery);
};