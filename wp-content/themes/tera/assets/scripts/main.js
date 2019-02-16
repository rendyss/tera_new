function slidersSmall() {
    var sliderS = $('.sliders-small');
    if ($(window).width() < 992) {
        sliderS.addClass('owl-carousel');
        sliderS.owlCarousel({
            navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
            items: 1,
            loop: true,
            nav: true,
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 1
                },
                768: {
                    items: 2
                }
            }
        });
    } else {
        sliderS.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
        sliderS.find('.owl-stage-outer').children().unwrap();
    }
};

function sliderMd() {
    var slider = $('.slider'),
        dot = slider.attr('data-dot') && slider.attr('data-dot') == "yes" ? true : false;

    if(slider.hasClass('owl-carousel')){
      slider.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
      slider.find('.owl-stage-outer').children().unwrap();
      slider.addClass('aa');
    }
    slider.addClass('owl-carousel');
    slider.owlCarousel({
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        items: 1,
        loop: false,
        nav: true,
        dots: dot,
        autoplay: true,
    });
};

//MATCH HEIGHT
function setMH() {
    $('.item').find('h4').matchHeight();
    $('.item').find('p').matchHeight();
    $('.office-item').matchHeight();
    $('.testimoni').find('.sliders-small').find('.col-md-3').matchHeight();
    $('.upgrade.has-more').find('.item').matchHeight();
    // $('dl').find('dt,dd').matchHeight();
    $('.form-get-quote').find('dt,dd').matchHeight();
    $('.same-h').find('.set-h').matchHeight({
        byRow: false
    });
}

//STICKY FOOTER
function stickyFooter() {
    var m = $('main'),
        h = $('header').outerHeight(),
        f = $('footer').outerHeight(),
        w = $(window).height(),
        set = w - h - f;
    m.css('min-height', set)
    // console.log('main('+ set +') = window(' + w + ') - header(' + h + ') - footer(' + f + ')')
}

//selectbox with tag
function multiselect() {
    //remove Array
    Array.prototype.remove = function() {
        var what, a = arguments,
            L = a.length,
            ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    $('select.select.has-tag:not(.scripted)').each(function(index) {
        var t = $(this),
            bs = t.closest('.bootstrap-select'),
            pr = t.closest('.form-group'),
            bn = pr.find('.box-tag').length,
            boxTag = bn == 0 ? $('<div class="box-tag"></div>').insertAfter(bs) : pr.find('.box-tag'),
            bm = $("<div class='text'>").insertAfter(boxTag),
            sel = t.find('option:selected'),
            b = index;
        t.addClass('scripted');


        //get last selected value in multiple select
        var allSelected = [],
            previouslySelected = [];
        if (sel.length > 0) {
            allSelected = $(this).val();
            previouslySelected = $(this).val();
        }

        function getLastSelected(val) {

            if (val != null) {
                var newSelections = val.filter(function(element) {
                    return previouslySelected.indexOf(element) == -1;
                });
                previouslySelected = val;

                if (newSelections.length) {
                    // If there are multiple new selections, we'll take the last in the list
                    return newSelections.reverse()[0];
                } else {
                    // console.log('rem =' + newSelections);
                    return "rem";

                }
            } else {
                return val;
            }
        }

        function removeTag(v) {
            var val = v == null ? 'none' : v;
            boxTag.find('.tag').each(function() {
                var value = $(this).data('value');
                if (!val.includes(value)) {
                    $(this).remove();
                }
            })
        }

        function insertTag(val, text) {
            boxTag.append('<span class="tag" data-value="' + val + '">' + text + '<i class="remove" data-toggle="tooltip" data-placement="top" title="Remove">×</i></span>');
            $('[data-toggle="tooltip"]').tooltip({
                container: "body"
            });
        }

        function insertOther(val) {
            boxTag.append('<span class="tag" data-value="' + val + '"><input type="text" name="other" placeholder="Type your cargo" required><i class="remove" data-toggle="tooltip" data-placement="top" title="Remove">×</i></span>');
            $('[data-toggle="tooltip"]').tooltip({
                container: "body"
            });
        }


        $(this).change(function() {

            var selected = $(this).find('option:selected'),
                text = selected.html(),
                lastAdded = getLastSelected($(this).val()),
                opt = $(this).find('option[value="' + lastAdded + '"]').html();
            //bm.html("value-="+$(this).val()+"<br>lastAdded = "+lastAdded+"<br>allSelected = "+allSelected+"<br>previouslySelected ="+previouslySelected);
            // console.log('last =' + lastAdded + " - " + $(this).val());
            if (lastAdded == 0) {
                $(this).selectpicker('deselectAll');
                $(this).selectpicker('val', "0");
                insertTag(lastAdded, opt);
                allSelected = ["0"];
                previouslySelected = ["0"];
                $(this).prop('disabled', true).closest('.bootstrap-select').addClass('disabled');
            } else if (lastAdded == 'Other') {
                // console.log('Other');
                var isAdded = lastAdded == "rem" ? true : allSelected.includes(lastAdded.toString());
                allSelected = $(this).val() == null ? [] : $(this).val();
                if (!isAdded) {
                    insertOther(lastAdded);
                } else {
                    removeTag($(this).val());
                    allSelected.remove($(this).val());
                }
            } else if (lastAdded != null) {
                var isAdded = lastAdded == "rem" ? true : allSelected.includes(lastAdded.toString());

                allSelected = $(this).val() == null ? [] : $(this).val();

                if (!isAdded) {
                    insertTag(lastAdded, opt);
                } else {
                    removeTag($(this).val());
                    allSelected.remove($(this).val());
                }
            } else {
                removeTag($(this).val());
                allSelected = [];
            }
            t.selectpicker('toggle');
        });
        $('body').on('click', '.tag .remove', function() {
            var val = $(this).parent().data('value').toString(),
                bselect = $(this).closest('.box-tag').prev('.bootstrap-select'),
                select = bselect.find('select.has-tag');
            $(this).parent().remove();
            $('.tooltip').remove();
            allSelected.remove(val);
            previouslySelected.remove(val);
            if (bselect.hasClass('disabled')) {
                bselect.removeClass('disabled').find('select').prop('disabled', false);
                select.selectpicker('deselectAll');
                allSelected = [];
                previouslySelected = [];
            } else {
                select.selectpicker('val', allSelected);
            }
        });
    })
}

function calcAmount() {
    var sum = 0;
    var tax = $('input[name=tax]');
    var subtotal = $('input[name=sub_total]');
    var taxcharge = $('input[name=tax_charges]');
    var total = $('input[name=total]');

    $('#amount').find('.currency').each(function() {
        if ($(this).val() !== '') {
            sum += parseInt(this.value.split('.').join(''));
        }
    });

    sum = Math.round(sum);
    subtotal.val(sum);
    subtotal.rupiah();

    if (subtotal.val() !== '' && tax.val() !== '') {
        var sval = parseInt(subtotal.val().split('.').join(''));
        var tval = parseInt(tax.val().split('.').join(''));
        var tcHasil = (sval / 100) * tval;

        var tcHasil = Math.round(tcHasil);
        taxcharge.val(tcHasil);
        taxcharge.rupiah();
    }
    if (subtotal.val() !== '' && taxcharge.val() !== '') {
        var sval = parseInt(subtotal.val().split('.').join(''));
        var cval = parseInt(taxcharge.val().split('.').join(''));

        var totHasil = sval + cval;
        var totHasil = Math.round(totHasil);
        total.val(totHasil);
        total.rupiah();
    }
}

// VIEW QUOTE
function viewQuote() {
    $('.form-view-quote').each(function() {
        var form = $(this).find('form');
        // form.validate({
        //     ignore: ":disabled, :hidden",
        //     errorPlacement: function(error, element) {
        //         var fg = $(element).closest('.valthis');
        //         error.appendTo(fg);
        //     }
        // });

        $('#amount').find('.currency').each(function() {
            $(this).keyup(function() {
                calcAmount();
            });
        });

        $('input[name=tax]').keyup(function() {
            calcAmount();
        });

        $('.multiplier').find('.btn-delete').each(function() {
            $(this).click(function() {
                setTimeout(calcAmount, 1000)
            });
        });
    });
}

// MULTIPLIER
function multiplierWorHours() {
    $('.multi-working-h').each(function() {
        var t = $(this),
            limit = t.data('limit'),
            item = t.find('.sample')
            add = t.find('.btn-add'),
            target = t.find('.box-item');
        // format;

        item.find('select').each(function() {
            $(this).selectpicker('destroy');
        });

        format = item.clone().removeClass('sample');
        bind(item);

        function bind(obj) {
            $('select.select').each(function() {
                $(this).selectpicker({
                    style: 'select-control',
                    size: 5
                });
                var du = $(this).data('unit'),
                    btn = $(this).closest('.bootstrap-select').find('button');

                if (du != undefined) {
                    btn.addClass('has-unit');
                    btn.append('<span class="unit">' + du + '</spa>');
                }
            });
            $(".num-only").keypress(function(e) {
                if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });
            viewQuote();
            $('.currency').each(function() {
                $(this).keyup(function() {
                    $(this).rupiah();
                })
            });
        };

        function reOrder(obj) {
            var itm = obj.find('.item');
            itm.each(function(i) {
                var tmp = i + 1;
                //re order name
                $(this).find('input').each(function() {
                    if ($(this).attr('name')) {
                        var name = $(this).attr('name').replace(/\_\d/g, '_' + (i));
                        $(this).attr('name', name);
                    }
                });
                $(this).find('select').each(function() {
                    if ($(this).attr('name')) {
                        var name = $(this).attr('name').replace(/\_\d/g, '_' + (i));
                        $(this).attr('name', name);
                    }
                });
            });
            //show and hide delete button
            if (itm.length > 1) {
                t.addClass('cloned');
                $('.show-next').prop('disabled', false);
                // itm.eq(0).find('.show-next').attr('disabled','disabled');
            } else {
                t.removeClass('cloned');
            };
            // show and hide add button
            if (itm.length >= limit) {
                t.addClass('limited');
            } else {
                t.removeClass('limited');
            };
            // set item length
            $('#whCount').val(itm.length - 1);
        };

        add.click(function(e) {
            e.preventDefault();
            var html = format.clone();
            target.append(html);
            bind(html);
            html.slideDown(300);
            reOrder(target);
        });

        // DELETE
        $('body').on('click', '.btn-delete', function(e) {
            e.preventDefault();
            var parent = $(this).closest('.item'),
                target = parent.closest('.box-item');

            parent.slideUp(300, function() {
                parent.remove();
                reOrder(target);
            });
        });
    });
}

function multiplier() {
    $('.multiplier').each(function() {
        var t = $(this),
            limit = t.data('limit'),
            item = t.find('.item').eq(0),
            add = t.find('.btn-add'),
            target = t.find('.box-item'),
            format;

        item.find('select').each(function() {
            $(this).selectpicker('destroy');
        });

        format = item.clone().hide();
        bind(item);

        function bind(obj) {
            $('select.select').each(function() {
                $(this).selectpicker({
                    style: 'select-control',
                    size: 5
                });
                var du = $(this).data('unit'),
                    btn = $(this).closest('.bootstrap-select').find('button');

                if (du != undefined) {
                    btn.addClass('has-unit');
                    btn.append('<span class="unit">' + du + '</spa>');
                }
            });
            $(".num-only").keypress(function(e) {
                if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });
            viewQuote();
            $('.currency').each(function() {
                $(this).keyup(function() {
                    $(this).rupiah();
                })
            });
        };

        function reOrder(obj) {
            var itm = obj.find('.item');
            itm.each(function(i) {
                var tmp = i + 1;
                //re order name
                $(this).find('input').each(function() {
                    if ($(this).attr('name')) {
                        var name = $(this).attr('name').replace(/\_\d/g, '_' + (i));
                        $(this).attr('name', name);
                    }
                });
            });
            //show and hide delete button
            if (itm.length > 1) {
                t.addClass('cloned');
                $('.show-next').prop('disabled', false);
                // itm.eq(0).find('.show-next').attr('disabled','disabled');
            } else {
                t.removeClass('cloned');
            };
            // show and hide add button
            if (itm.length >= limit) {
                t.addClass('limited');
            } else {
                t.removeClass('limited');
            };
            // set item length
            $('input[name=amountCount]').val(itm.length);
        };

        add.click(function(e) {
            e.preventDefault();
            var html = format.clone();
            target.append(html);
            bind(html);
            html.slideDown(300);
            reOrder(target);
        });

        // DELETE
        $('body').on('click', '.btn-delete', function(e) {
            e.preventDefault();
            var parent = $(this).closest('.item'),
                target = parent.closest('.box-item');

            parent.slideUp(300, function() {
                parent.remove();
                reOrder(target);
            });
        });
    });
}

// STICKY SIDEBAR
function setStyle(element, cssProperty) {
    for (var property in cssProperty) {
        element.style[property] = cssProperty[property];
    }
}

function destroySticky(element) {
    setStyle(element, {
        top: '',
        left: '',
        bottom: '',
        width: '',
        position: ''
    });
}

function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    }
}

function simpleStickySidebar(element, options) {

    // Global options
    var sticky = document.querySelector(element); // Sticky sidebar
    var container = document.querySelector(options.container); // Sticky sidebar container
    var topSpace = options.topSpace ? options.topSpace : 0; // Top spacing after sticky
    var bottomSpace = options.bottomSpace ? options.bottomSpace : 0; // Bottom spacing after sticky

    // vars
    var $window = window; // window
    var stickyHeight = sticky.getBoundingClientRect().height; // Sticky sidebar height
    var stickyOffsetTop = getOffset(sticky).top; // Sticky sidebar top offset
    var stickyOffsetBottom = getOffset(sticky).top + sticky.getBoundingClientRect().height; // Sticky sidebar bottom offset
    var stickyOffsetLeft = getOffset(sticky).left; // Sticky sidebar left offset
    var topFixed = false; // checkpoint
    var bottomFixed = false; // checkpoint
    var lastScrollVal = 0; // checkpoint

    //customvars
    var stopper = $('.stickyme-stopper');
    var stopperOffsetBottom = stopper.offset().top - $window.innerHeight;
    var par = $('.stickyme').closest('.row');
    var inner = $('.stickyme-inner');
    var stopTop = par.height() - inner.height();
    par.css('min-height',inner.height() + 80);

    console.log('Test, container height: '+par.height()+', sticky height: '+inner.height());
    // scrolling
    if(par.height() > inner.height() + 80) {
        inner.removeClass('no-sticky');
        window.addEventListener('scroll', function(event) {
            var scrollTop = window.scrollY;
            // when scroll position touch the "Sidebar"
            if (scrollTop > stickyOffsetTop - topSpace) {
                // if "Sidebar" smaller than viewport
                if (stickyHeight <= $window.innerHeight - topSpace) {
                    // fix "Sidebar" from top
                    setStyle(sticky, {
                        top: topSpace + "px",
                        left: stickyOffsetLeft + "px",
                        bottom: '',
                        width: sticky.getBoundingClientRect().width + "px",
                        position: 'fixed'
                    });
                    if (scrollTop > stopperOffsetBottom){
                            setStyle(sticky, {
                                top: stopTop + "px",
                                left: '',
                                bottom: '',
                                width: '',
                                position: 'absolute'
                            });
                        }
                } else {
                    // scrolling down
                    if (scrollTop > lastScrollVal) {
                        // if "Sidebar" fixed from top during scrolling down
                        if (topFixed) {
                            // get new offset of "Sidebar"
                            var absoluteStickyOffsetTop = getOffset(sticky).top;

                            setStyle(sticky, {
                                top: absoluteStickyOffsetTop - getOffset(container).top + "px",
                                left: '',
                                bottom: '',
                                width: '',
                                position: 'absolute'
                            });
                            topFixed = false;
                        }
                        // make "Sidebar" fixed from bottom when bottom area visible in viewport
                        if (scrollTop > stickyOffsetBottom - $window.innerHeight) {
                            setStyle(sticky, {
                                top: '',
                                left: stickyOffsetLeft + "px",
                                bottom: bottomSpace + "px",
                                width: sticky.getBoundingClientRect().width + "px",
                                position: 'fixed'
                            });
                            bottomFixed = true;
                        }
                        if (scrollTop > stopperOffsetBottom){
                            setStyle(sticky, {
                                top: stopTop + "px",
                                left: '',
                                bottom: '',
                                width: '',
                                position: 'absolute'
                            });
                        }
                    } else { // scrolling up
                        // get new offset of "Sidebar" during scrolling up
                        var absoluteStickyOffsetTop = getOffset(sticky).top;
                        //  if "Sidebar" fixed from bottom, stop sticky to its position
                        if (bottomFixed) {
                            setStyle(sticky, {
                                top: absoluteStickyOffsetTop - getOffset(container).top + "px",
                                left: '',
                                bottom: '',
                                width: '',
                                position: 'absolute'
                            });
                            bottomFixed = false;
                        }
                        // make "Sidebar" fixed from top when top area visible in viewport
                        if (scrollTop < absoluteStickyOffsetTop - topSpace) {
                            setStyle(sticky, {
                                top: topSpace + "px",
                                left: stickyOffsetLeft + "px",
                                bottom: '',
                                width: sticky.getBoundingClientRect().width + "px",
                                position: 'fixed'
                            });
                            topFixed = true;
                        }
                    }
                    lastScrollVal = scrollTop;
                }
            } else {
                // make sidebar to default position
                destroySticky(sticky);
            }
        });
    } else {
        // destroySticky(sticky);
        inner.addClass('no-sticky');
        console.log('destroyed');
    }
}

//Alert Image
function alertUpload(par) {
    var text = par;
    $('body').append('<div class="alert-upload blink"><div class="alert alert-danger"><i class="close fa fa-times" data-dismiss="alert"></i>' + text + '</div></div>');
    $('.alert-upload').fadeIn(300);

    $(function() {
        setTimeout(function() {
            $('.alert-upload').fadeOut(300);
        }, 3000);
    });
    $(function() {
        setTimeout(function() {
            $('.alert-upload').remove();
        }, 4500);
    });
};

// Blinker

$('.help-block').each(function(){
    var t = $(this),
        ico = t.find('.fa');
    ico.addClass('blinker');

    ico.mouseenter(function() {
        $(this).removeClass('blinker');
    }).mouseleave(function() {
        $(this).addClass('blinker');
    });
});


$(document).ready(function() {

    $('.stickyme').each(function(){
        simpleStickySidebar('.stickyme-inner', {
            container: '.stickyme',
            topSpace: 70,
            bottomSpace : 30
        });
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('.stickyme').each(function(){
            simpleStickySidebar('.stickyme-inner', {
                container: '.stickyme',
                topSpace: 70,
                bottomSpace : 30
            });
        })
    });



    // Replace all SVG images with inline SVG
    jQuery('img.svg').each(function() {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });


    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    //SELECTPICKER
    $('select.select').each(function() {
        $(this).selectpicker({
            style: 'select-control',
            size: 5
        });
        var du = $(this).data('unit'),
            btn = $(this).closest('.bootstrap-select').find('button');

        if (du != undefined) {
            btn.addClass('has-unit');
            btn.append('<span class="unit">' + du + '</spa>');
        }
    });

    //inputfile
    $('.upload-file').each(function(e) {
        var t = $(this),
            input = t.find('.inputfile'),
            label = t.find('.label-btn'),
            del = t.find('.del-btn'),
            info = t.find('.file-info'),
            prev = t.find('.image-preview'),
            fSize;

        function toggleDel() {
            if (t.hasClass('has-file')) {
                del.removeClass('dis');
            } else {
                del.addClass('dis');
            }
        }
        toggleDel();

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    prev.css('background-image', 'url(' + e.target.result + ')');
                    // console.log('hai');
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        input.change(function(e) {
            var fileName = '',
                val = $(this).val();

            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            } else if (e.target.value) {
                fileName = e.target.value.split('\\').pop();
            }

            if (this.files[0].size > 2097152) {
                // alert('Max upload 2MB.');
                alertUpload('Your file is too large!');
                input.val('');
            } else {

                if (fileName && prev.length == 0) {
                    switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
                        case 'doc':
                        case 'docx':
                        case 'pdf':
                        case 'txt':
                        case 'jpg':
                        case 'png':
                            info.html(fileName);
                            info.removeClass('deleted');
                            t.addClass('has-file');
                            break;
                        default:
                            // alert('Only document files are allowed.')
                            alertUpload('Only document files are allowed.');
                            break;
                    }
                }

                if (prev.length != 0) {
                    switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
                        case 'gif':
                        case 'jpg':
                        case 'png':
                        case 'svg':
                            readURL(this);
                            t.addClass('has-file');
                            break;
                        default:
                            // alert('Only image files are allowed.')
                            alertUpload('Only image files are allowed.');
                            break;
                    }
                }

            }

            toggleDel();
        });

        del.click(function() {
            if (prev.length != 0) {
                $('.image-preview').css('background-image', '');
            }

            info.addClass('deleted');
            input.val('');
            t.removeClass('has-file');

            toggleDel();
        })
    });
    

    //IMAGESLOADED
    $('body').imagesLoaded()
        .done(function() {
            $('#preloading').fadeOut('slow');
        })
        .fail(function() {
            $('#preloading').fadeOut('slow');
        })



    $('button[type="reset"]').each(function() {
        var t = $(this),
            f = $(this).closest('form'),
            s = $(this).closest('form').find('select.select');

        t.click(function() {
            s.val('default');
            s.selectpicker('refresh');
        })
    });


    //TOGGLE MENU
    $('.icon-menu').click(function() {
        $('body').toggleClass('menu-open');
    });
    $(".m-toggle").find('.trigger').click(function() {
        $('body').toggleClass('m-toggle-open');
    }).find('.sidebar').click(function(e) {
        // e.stopPropagation();
    });
    $('.foot-menu').each(function() {
        var t = $(this),
            ft = t.find('.foot-title'),
            ul = t.find('ul');
        ft.click(function() {
            t.toggleClass('open');
        })
    });

    // TOGGLE FILTER
    $('.sort-filter').each(function(){
        $(this).find('.close').click(function(){
            $('body').removeClass('sort-open');
            $('body').removeClass('filter-open');
        })
        $(this).find('.trigger .col-sort').click(function(){
            $('body').addClass('sort-open');
        });
        $(this).find('.trigger .col-filter').click(function(){
            $('body').addClass('filter-open');
        });
    })


    //STICKY HEADER
    $(window).scroll(function() {
        var sticky = $('header'),
            scroll = $(window).scrollTop(),
            h = $(window).height(),
            btt = $('.back-to-top');

        if (scroll > 0) {
            sticky.addClass('fixed');
            if (scroll > h) {
                btt.addClass('on');
            }
        } else {
            sticky.removeClass('fixed');
            btt.removeClass('on');
        }
    });


    //BACK TO TOP
    // var html = "<a class='back-to-top h'><i class='fa fa-angle-up'></i></a>";
    // $('body').append(html);
    // $('.back-to-top').on('click', function() {
    //   $("html, body").animate({
    //     scrollTop: 0
    //   }, 'slow');
    // });

    $('.form-search').on('submit', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 'slow');
    });

    //ON WINDOW RESIZE
    $(window).resize(function() {
        stickyFooter();
        slidersSmall();
        setMH();
    })

    //rating
    $('.box-rate').each(function() {
        var t = $(this),
            r = t.find('.rate'),
            s = t.find('.star');

        if (s.width() == 0) {
            r.html('unrated');
        }
    })

    //table
    $('.quote-request').each(function() {
        var t = $(this),
            act = t.find('.table-action'),
            check = t.find('.checkbox').find('input[type="checkbox"]'),
            cAll = t.find('#checkAll');

        function toggle() {
            var n = t.find('input:checkbox:checked').length;
            if (n == 0) {
                act.removeClass('shown');
            } else {
                act.addClass('shown');
            }
        }

        cAll.click(function() {
            check.not(this).prop('checked', this.checked);
        })

        check.change(function() {
            toggle();
        })
    })

    //STEP WIZZARD
    $('.get-quote').each(function() {

        var stepWizz = $(this).find('.step-wizz'),
            step = stepWizz.find('.step'),
            stepNum = step.find('.step-num'),
            n = 0,
            stepAct = $('.form-get-quote').find('.form-action').find('.btn');

        stepAct.click(function() {
            $('html, body').animate({
                scrollTop: $('.get-quote').offset().top
            }, 400);
        })

        stepAct.on('shown.bs.tab', function(e) {
            function stepWizz() {
                step.eq(n).addClass('active');
                step.eq(n).removeClass('pass');
                step.not(':eq(' + n + ')').removeClass('active');
                for (var i = 0; i < n; i++) {
                    step.eq(i).addClass('pass');
                }
            }
            if ($('#getQuote1').hasClass('active')) {
                n = 0;
                stepWizz();
            }
            if ($('#getQuote2').hasClass('active')) {
                n = 1;
                stepWizz();
            }
            if ($('#getQuote3').hasClass('active')) {
                n = 2;
                stepWizz();
            }
            if ($('#getQuote4').hasClass('active')) {
                n = 3;
                stepWizz();
            }
            if ($('#getQuote5').hasClass('active')) {
                n = 4;
                stepWizz();
            }
        })

    });

    $('.form-get-quote').each(function() {

        // var validator = $('form').validate({
        //     ignore: ":disabled, :hidden",
        //     errorPlacement: function(error, element) {
        //         var fg = $(element).closest('.valthis');
        //         error.appendTo(fg);
        //     }
        // });
        //
        // $('button:submit').click(function(e) {
        //     e.preventDefault();
        //     var t = $(this),
        //         tabPane = t.closest('.tab-pane'),
        //         input = tabPane.find(":input"),
        //         valid = true;
        //
        //     input.each(function() {
        //         if (!validator.element(this) && valid) {
        //             valid = false;
        //             //FALSE FOR ACTIVE VALIDATION
        //         }
        //     });
        //
        //     // if (valid) {
        //     //   t.tab("show");
        //     // }
        //     toTopGetQuote();
        // });

        function toTopGetQuote() {
            $('html, body').animate({
                scrollTop: $('.get-quote').offset().top
            }, 400);
        }

        // CONDITIONS

        $('#getQuote1').each(function() {

            //ON STEP 1
            $('#service_type').dependsOn({
                'input[name="type_of_trade"]': {
                    values: ['domestic']
                }
            }, {
                onDisable: function() {
                    $('#service_type').find('select').attr('disabled', 'disabled');
                    $('select.select').selectpicker('refresh');
                },
                onEnable: function() {
                    $('#service_type').find('select').prop("disabled", false);
                    $('select.select').selectpicker('refresh');
                }
            });

            $('#type_of_shipment').dependsOn({
                'input[name="type_of_transportation"]': {
                    values: ['ocean']
                }
            }, {
                onDisable: function() {
                    $('#type_of_shipment').find('input').attr('disabled', 'disabled');
                },
                onEnable: function() {
                    $('#type_of_shipment').find('input').prop("disabled", false);
                }
            });

            $('#incoterms').dependsOn({
                'input[name="type_of_trade"]': {
                    values: ['export', 'import']
                }
            }, {
                onDisable: function() {
                    $('#incoterms').find('select').attr('disabled', 'disabled');
                    $('select.select').selectpicker('refresh');
                },
                onEnable: function() {
                    $('#incoterms').find('select').prop("disabled", false);
                    $('select.select').selectpicker('refresh');
                }
            });

        });

        var totrade = '';
        var totrans = '';

        function cekForInconterms() {
            var incoterms = $('#incoterms').find('select'),
                opt = '<option ',
                opts = '<option selected ',
                opt2 = '</option>',
                exw = opt + 'value="EXW">EXW' + opt2,
                fca = opt + 'value="FCA" >FCA' + opt2,
                fas = opt + 'value="FAS" >FAS' + opt2,
                fob = opt + 'value="FOB" >FOB' + opt2,
                cfr = opt + 'value="CFR" >CFR' + opt2,
                cif = opt + 'value="CIF" >CIF' + opt2,
                cpt = opt + 'value="CPT" >CPT' + opt2,
                cip = opt + 'value="CIP" >CIP' + opt2,
                dat = opt + 'value="DAT" >DAT' + opt2,
                dap = opt + 'value="DAP" >DAP' + opt2,
                ddp = opt + 'value="DDP" >DDP' + opt2;

            var selected = $('#incoterms').find('select').data('selected');
            if (selected != undefined) {
                if (selected == 'exw') exw = opts + 'value="EXW">EXW' + opt2;
                if (selected == 'fca') fca = opts + 'value="FCA">FCA' + opt2;
                if (selected == 'fas') fas = opts + 'value="FAS">FAS' + opt2;
                if (selected == 'fob') fob = opts + 'value="FOB">FOB' + opt2;
                if (selected == 'cfr') cfr = opts + 'value="CFR">CFR' + opt2;
                if (selected == 'cif') cif = opts + 'value="CIF">CIF' + opt2;
                if (selected == 'cpt') cpt = opts + 'value="CPT">CPT' + opt2;
                if (selected == 'cip') cip = opts + 'value="CIP">CIP' + opt2;
                if (selected == 'dat') dat = opts + 'value="DAT">DAT' + opt2;
                if (selected == 'dap') dap = opts + 'value="DAP">DAP' + opt2;
                if (selected == 'ddp') ddp = opts + 'value="DDP">DDP' + opt2;
            }

            if (totrade == 'export' && totrans == 'ocean') {
                incoterms.find('option').remove().end()
                    .append(fca + fas + fob + cfr + cif + dat + dap + ddp);
                $('select.select').selectpicker('refresh');
            }
            if (totrade == 'export' && totrans == 'air') {
                incoterms.find('option').remove().end()
                    .append(fca + cpt + cip + dat + dap + ddp);
                $('select.select').selectpicker('refresh');
            }
            if (totrade == 'import' && totrans == 'ocean') {
                incoterms.find('option').remove().end()
                    .append(exw + fca + fas + fob + cfr + cif + dat + dap);
                $('select.select').selectpicker('refresh');
            }
            if (totrade == 'import' && totrans == 'air') {
                incoterms.find('option').remove().end()
                    .append(exw + fca + cpt + cip + dat + dap);
                $('select.select').selectpicker('refresh');
            }
        }
        $('#type_of_trade').each(function() {
            var input = $(this).find('input'),
                val = $(this).find('.active').find('input').val();

            totrade = val;
            // console.log('Totrade = ' + totrade)
            input.change(function() {
                totrade = $(this).val();
                cekForInconterms();
                // console.log('totrade '+totrade)
            })
        });

        $('#type_of_transportation').each(function() {
            var input = $(this).find('input'),
                val = $(this).find('.active').find('input').val();

            totrans = val;
            // console.log('Totrans = ' + totrans)
            input.change(function() {
                totrans = $(this).val();
                cekForInconterms();
                // console.log('totrans '+totrans)
            })
        });
        cekForInconterms();


        $('#getQuote3').each(function() {

            $('#shipment_value').dependsOn({
                'input[name="insurance"]': {
                    checked: true
                }
            }, {
                hide: false,
                onDisable: function() {
                    $('#shipment_value').find('select').attr('disabled', 'disabled');
                    $('#shipment_value').find('input').attr('disabled', 'disabled');
                    $('select.select').selectpicker('refresh');
                },
                onEnable: function() {
                    $('#shipment_value').find('select').prop("disabled", false);
                    $('#shipment_value').find('input').prop("disabled", false);
                    $('select.select').selectpicker('refresh');
                }
            });
            $('input[name="shipment_value"]').dependsOn({
                'input[name="insurance"]': {
                    checked: true
                }
            }, {
                hide: false,
            });

        });

    });

    $('.form-action').each(function() {
        var check = $('input[name="agree"]');
        if (check.length != 0) {
            $('button[type="submit"]').dependsOn({
                'input[name="agree"]': {
                    checked: true
                }
            }, {
                hide: false,
            });
        }
    });


    //OFFICE
    $('.office').each(function() {
        var t = $(this),
            add = t.parent().find('.btn-add-branch'),
            del = t.find('.btn-del'),
            item = t.find('.office-item'),
            bc = t.find('#branchCount'),
            n = bc.val();

        function bind(obj) {
            $('html, body').animate({
                scrollTop: $('.office-item:last-child').offset().top - 100
            }, 500);
            $('select.select').each(function() {
                $(this).selectpicker({
                    style: 'select-control',
                    size: 5
                });
            });
            $('.office-item').matchHeight();
            $("body").find('.tcontact input').keypress(function(e) {
                if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });
        }

        function reOrder() {
            var roTemp = 0;
            $("body").find('.office-item').each(function() {

                $(this).find('input:not(.bs-searchbox input)').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                    $(this).attr('data-no', roTemp);
                });

                $(this).find('select').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                });

                $(this).find('select').each(function() {
                    // var data = $(this).attr('data-no');
                    // name = name.substring(0, name.indexOf('_'));
                    $(this).attr('data-no', roTemp);
                });

                $(this).find('textarea').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                });

                roTemp++;
                // console.log('reorder');
            })
        }

        add.click(function() {
            n++;
            $('select.select').selectpicker('destroy');

            var format = item.eq(0).clone();
            html = format.clone();

            html.find('.title').each(function() {
                $(this).text('Branch Office');
            });
            html.find('input').each(function() {
                $(this).val('');
                $(this).attr('value', '');
            });
            html.find('textarea').each(function() {
                $(this).val('');
                $(this).attr('value', '');
            });
            html.find('.nclone').each(function() {
                $(this).remove();
            });
            html.prepend('<button class="btn-del">delete</button>');

            t.append(html.fadeIn());

            scrollTop: $(window).scrollTop() + 100
            bind(html);
            bc.val(n);
            reOrder();
        })

        $("body").on('click', '.btn-del', function() {
            $(this).closest('.office-item').remove();
            n--;
            bc.val(n);
            reOrder();
        });

    })

    //CARGO
    $('.cargo-wrap').each(function() {
        var t = $(this),
            box = t.find('.box-cargo'),
            add = t.find('.add-cargo'),
            del = t.find('.del-cargo'),
            item = t.find('.cargo'),
            bc = t.find('#cargocount'),
            n = 1;

        function bind(obj) {
            $('select.select').each(function() {
                $(this).selectpicker({
                    style: 'select-control',
                    size: 5
                });
            });
            calculate();
        }

        function calculate() {

            $("body").find('.cargo').each(function() {
                var t = $(this),
                    weight = t.find('.weight'),
                    length = t.find('.length'),
                    width = t.find('.width'),
                    height = t.find('.height'),
                    qty = t.find('.qty'),
                    tWeight = t.find('.tWeight'),
                    tVolume = t.find('.tVolume');

                function totalWeight() {
                    var ton = weight.val() * qty.val();
                    ton = ton / 1000;
                    if (ton != 0) {
                        tWeight.val(ton);
                    } else {
                        tWeight.val('');
                    }
                }

                function totalVolume() {
                    var m3 = length.val() * width.val() * height.val() * qty.val();
                    m3 = m3 / 1000000;
                    if (m3 != 0) {
                        tVolume.val(m3);
                    } else {
                        tVolume.val('');
                    }
                }

                weight.keyup(function() {
                    totalWeight();
                })
                length.keyup(function() {
                    totalVolume();
                })
                width.keyup(function() {
                    totalVolume();
                })
                height.keyup(function() {
                    totalVolume();
                })
                qty.keyup(function() {
                    totalWeight();
                    totalVolume()
                })
            })

        }
        calculate();

        function reOrder() {
            var roTemp = 0;
            $("body").find('.cargo').each(function() {

                $(this).find('input').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                });
                $(this).find('select').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                });
                $(this).find('textarea').each(function() {
                    var name = $(this).attr('name');
                    name = name.substring(0, name.indexOf('_'));
                    $(this).attr('name', name + '_' + roTemp);
                });

                roTemp++;
                // console.log('reorder');
            })
        }

        function activeDel() {
            $('body').find('.del-cargo').addClass('active');
        }

        add.click(function() {
            n++;
            $('select.select').selectpicker('destroy');

            var format = item.eq(0).clone(),
            html = format.clone();

            html.find('input').each(function() {
                $(this).val('');
                $(this).attr('value', '');
            });
            html.find('textarea').each(function() {
                $(this).val('');
                $(this).attr('value', '');
            });

            html.prepend('<button class="del-cargo"><i class="fa fa-trash-o" aria-hidden="true"></i> delete</button>');
            html.find('textarea').val('');
            box.append(html.fadeIn());
            activeDel();

            bind(html);
            bc.val(n);
            reOrder();
        })

        $("body").on('click', '.del-cargo', function() {
            $(this).closest('.cargo').remove();
            n--;
            bc.val(n);
            reOrder();
        });

    })

    $('.work-list').each(function() {
        $("body").on('click', '.del-btn', function() {
            $(this).closest('.item').remove();
        });
    })

    $('.dtpckr').each(function() {
        var date = new Date(),
            today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        $(this).datepicker({
            // daysOfWeekDisabled: [0],
            format: 'dd M yyyy',
            autoclose: true,
            startDate: today
        });
    })

    $('.dtpckr2').each(function() {
        $(this).datepicker({
            // daysOfWeekDisabled: [0],
            format: 'dd/mm/yyyy',
            autoclose: true,
        });
    })


    $('form').each(function() {
        var submit = $(this).find('.btn-primary');
        submit.click(function(e) {
            // e.preventDefault();
            $('html, body').animate({
                scrollTop: $('form').offset().top - 100
            }, 300);
            $('.modal').animate({
                scrollTop: 0
            }, 300);
        });
    });

    $('#frmaddwhouse').each(function() {
        var submit = $(this).find('.btn-primary');
        submit.click(function(e) {
            $('html, body').animate({
                scrollTop: $('form').offset().top - 100
            }, 300)
        });
    });


    // $('.form-login').each(function() {
    //     var t = $(this),
    //         b = t.find('button:submit');
    //
    //     b.click(function() {
    //         $('.right').animate({
    //             scrollTop: 0
    //         }, 300);
    //         return false;
    //     });
    // })
    $(".num-only").keypress(function(e) {
        if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("body").find('.tcontact input').keypress(function(e) {
        if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });


    $('.upgrade').each(function() {
        var t = $(this),
            button = t.find('.confirm-again'),
            chkBox = t.find('.check-confirm-again');

        // button.addClass('disabled');
        chkBox.change(function() {
            button.toggleClass('disabled', !this.checked)
        }).change();
    })


    $('.work-h').each(function() {
        $('button[type="submit"]').click(function() {
            $('select.select').selectpicker('refresh');
        })

        var ns = $(this).find('input[name="nonstop"]');
        if (ns.length != 0) {
            // console.log('as')
            $('select[name="startH"]').dependsOn({
                'input[name="nonstop"]': {
                    checked: false
                }
            }, {
                hide: false,
                onDisable: function() {
                    $('select.select').selectpicker('refresh');
                },
                onEnable: function() {
                    $('select.select').selectpicker('refresh');
                }
            });
            $('select[name="endH"]').dependsOn({
                'input[name="nonstop"]': {
                    checked: false
                }
            }, {
                hide: false,
                onDisable: function() {
                    $('select.select').selectpicker('refresh');
                },
                onEnable: function() {
                    $('select.select').selectpicker('refresh');
                }
            });
        }
    })


    $('body').on('click', function(e) {
        $('[data-toggle="popover"]').each(function() {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('.input-tag').each(function() {
        var t = $(this),
            fg = $(this).closest('.form-group'),
            bt = fg.find('.box-tag'),
            tg = fg.find('span.tag'),
            max = $(this).data('max-options'),
            n = tg.length,
            dv = $(this).data('val');
        // console.log("tags: "+n);

        if (max == undefined) {
            max = 1000;
        }

        function updateVal() {
            var v1 = $('body').find('.input-tag').closest('.form-group').find('.tag').eq(0).data('value');
            var v2 = $('body').find('.input-tag').closest('.form-group').find('.tag').eq(1).data('value');
            var v3 = $('body').find('.input-tag').closest('.form-group').find('.tag').eq(2).data('value');
            var v4 = $('body').find('.input-tag').closest('.form-group').find('.tag').eq(3).data('value');
            var v5 = $('body').find('.input-tag').closest('.form-group').find('.tag').eq(4).data('value');
            var val = v1 + ',' + v2 + ',' + v3 + ',' + v4 + ',' + v5;
            var val2 = val.replace(/\,undefined/g, '');
            // val2 = val2==undifined?"":val2;
            t.attr('data-val', val2);
            if (val2 == 'undefined') {
                t.attr('data-val', '')
            }
            // console.log(val2);
        }
        $(this).keypress(function(e) {
            // var keyword = $('#keyword').val();

            if (e.which == 44) {
                e.preventDefault();
                if ($(this).val() != "" && n < max) {
                    var val = $(this).val();
                    bt.append('<span class="tag" data-value="' + val + '">' + val + '<i class="remove" data-toggle="tooltip" data-placement="top" title="" data-original-title="Remove">×</i></span>');
                    $(this).val("");
                    n++;
                    updateVal();
                }
            }
        });

        $('body').on('click', '.tag .remove', function() {
            n--;
            updateVal();
        });
    });

    $.fn.rupiah = function() {
        return this.each(function() {
            var v = $(this).val().split('.').join(''),
                f = v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

            $(this).val(f);
        })
    }

    $('.currency').each(function() {
        $(this).keyup(function() {
            $(this).rupiah();
        })
    });


    $('.form-login').each(function(){
        var t = $(this);

        $('#i_am_a').find('input[type="radio"]').change(function(){            
            if($('#iama2').is(':checked')) { 
                // alert("it's checked");
                $('#company_name').prop('required', true);
            } else {
                // alert("it's unchecked");
                $('#company_name').prop('required', false);
            }
        });
    });

    sliderMd();
    slidersSmall();
    setMH();
    stickyFooter();
    multiselect();
    viewQuote();
    multiplier();
    multiplierWorHours();

});// END OF document READY

function setProvider(){
    var t = $('#providerCheck'),
        checkboxes = t.find("input[type='checkbox']"),
        data = $('#dataCheck').val(),
        set  = t.find("input[name='"+data+"']");

    set.prop("checked", true);
    set.parents("li").addClass('showed');    
    $('#modalWarning').modal('hide');

}

$('#providerCheck').each(function(){
    var t = $(this);
    var checkboxes = t.find("input[type='checkbox']"),
        checkp = t.find("input[name='providers']"),
        checkw = t.find("input[name='warehouse']"),
        checkt = t.find("input[name='trucking']"),
        checkf = t.find("input[name='freigth_rate']"),
        err = t.find(".cb-error");
 
    checkboxes.each(function(){
        var cb = $(this);
        cb.click(function(e){
            var data = $(this).attr('name');

            if( cb.is(":checked") ) {
                // cb.parents("li").addClass('showed');
                e.preventDefault();
                e.stopPropagation();            
                $('#modalWarning').modal('show');
                $('#dataCheck').val(data);
            } else {
                cb.parents("li").removeClass('showed');
            }

            if (checkt.is(":checked")) {
                $('#freightRate').fadeIn();
            }else{
                $('#freightRate').fadeOut();
            };
        })

        if (checkt.is(":checked")) {
            $('#freightRate').fadeIn();
        }else{
            $('#freightRate').fadeOut();
        };
    })
    // checkboxes.click(function() {
        // checkboxes.attr("required", !checkboxes.is(":checked"));
        // if (checkp.is(":checked")) {
        //     checkp.parents("li").addClass('showed');
        // }else{
        //      checkp.parents("li").removeClass('showed');
        // };
        // if (checkw.is(":checked")) {
        //     checkw.parents("li").addClass('showed');
        // }else{
        //      checkw.parents("li").removeClass('showed');
        // };
        // if (checkt.is(":checked")) {
        //     checkt.parents("li").addClass('showed');
        // }else{
        //      checkt.parents("li").removeClass('showed');
        // };
        // if (checkf.is(":checked")) {
        //     checkf.parents("li").addClass('showed');
        // }else{
        //      checkf.parents("li").removeClass('showed');
        // };
    // });
    checkboxes.change(function() {
        if (!checkp.is(":checked") && !checkw.is(":checked") && !checkt.is(":checked")) {
            err.fadeIn();
        }else{
            err.fadeOut();
        };
    })
    console.log();

})

function sliderGal() {
  // reference for main items
  var slider = $('.gall-big-img');
  // reference for thumbnail items
  var thumbnailSlider = $('.gallery-slider');
  //transition time in ms
  var duration = 500;

  thumbnailSlider.addClass('owl-carousel');
  slider.addClass('owl-carousel');

  // carousel function for main slider
  slider.owlCarousel({
   loop:false,
   navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
   nav:true,
   dots: false,
   items:1
  }).on('changed.owl.carousel', function (e) {
   //On change of main item to trigger thumbnail item
   thumbnailSlider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });

  // carousel function for thumbnail slider
  thumbnailSlider.owlCarousel({
   loop:false,
   center: true, //to display the thumbnail item in center
   items: 9,
   dots: false,
   margin: 10,
  }).on('click', '.owl-item', function () {
   // On click of thumbnail items to trigger same main item
   slider.trigger('to.owl.carousel', [$(this).index(), duration, true]);
   $('.owl-item').removeClass('current');
   $(this).addClass('current');
  }).on('changed.owl.carousel', function (e) {
   // On change of thumbnail item to trigger main item
   slider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });
   $('.gallery-slider .owl-item').eq(0).addClass('current');


  //These two are navigation for main items
  $('.slider-left').click(function() {
   slider.trigger('next.owl.carousel', function (){
       $('.gallery-slider .owl-item.current').removeClass('current');
       $('.gallery-slider .owl-item').addClass('current');
   });
  });
  $('.slider-left').click(function() {
   slider.trigger('prev.owl.carousel');
   $('.gallery-slider .owl-item.current').removeClass('current');
   $('.gallery-slider .owl-item').addClass('current');
  });
}sliderGal();


$('#frmaddwhouse').each(function() {
  var form = $(this);
  form.validate({
     ignore: ":disabled, :hidden",
     errorPlacement: function(error, element) {
         var fg = $(element).closest('.form-group');
        error.insertAfter(fg);
     }
   });
 });

$('#fchpswd').each(function() {
  var form = $(this);
  form.validate({
     ignore: ":disabled, :hidden",
     errorPlacement: function(error, element) {
         var cb = $(element).closest('.checkbox');
        error.insertAfter(cb);
        error.addClass('cb-error');
     }
   });
 });


$('.box-location').each(function(){
  var t = $(this),
      L = t.find('.location'),
      more = t.find('.more');

  var count = L.length;
  console.log(count);
  if(count > 3){
      for (var i = 3; i < count; i++) {
          L.eq(i).addClass('fade');
          more.show();
      }
  }
  more.click(function(){
      L.toggleClass('in');
      $(this).toggleClass('in');
  });
});


function boxLocation(){
    $('.box-location').each(function(){
      var t = $(this),
          L = t.find('.location'),
          more = t.find('.more');

      var count = L.length;
      console.log(count);
      if(count > 3){
          for (var i = 3; i < count; i++) {
              L.eq(i).addClass('fade');
              more.show();
          }
      }
      more.click(function(){
          L.toggleClass('in');
          $(this).toggleClass('in');
      });
    });
};


$('.freight-rate').each(function(){
    var t = $(this),
        item = t.find('.item');

    item.click(function(){
        $(this).toggleClass('show');
        $(this).find('.collapse').collapse('toggle');
    })

})


// Show more description

// $('.box-wrap-text').each(function(){
//     var t = $(this),
//         h = t.outerHeight();

//     if(h > 140){
//         t.addClass('less');
//         t.append('<span class="s-more"><i>Show more</i><i>Show less</i></span>')
//     }
//     $('body').on('click', '.box-wrap-text .s-more', function() {
//        t.toggleClass('less');
//     });
// });

$('.box-wrap-text').each(function(){
    $(this).bind('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;

        if(e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -0.20);
        }else if(e.type = 'DOMMouseScroll') {
            scrollTo = (e.originalEvent.wheelDelta * -0.20);
        }
        if(scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });
});

// Multiple Upload image
document.addEventListener("DOMContentLoaded", init, false);
  var AttachmentArray = [];
  var arrCounter = 0;
  var filesCounterAlertStatus = false;

  var ul = document.createElement('div');
  ul.className = ("thumb-Images");
  ul.id = "imgList";

  function init() {
      document.querySelector('#wh_gallery').addEventListener('change', handleFileSelect, false);
  }

    function handleFileSelect(e) {
        if (!e.target.files) return;

        var files = e.target.files;

        for (var i = 0, f; f = files[i]; i++) {

            var fileReader = new FileReader();

            fileReader.onload = (function (readerEvt) {
                return function (e) {
                    RenderThumbnail(e, readerEvt);

                    FillAttachmentArray(e, readerEvt)
                };
            })(f);
            fileReader.readAsDataURL(f);
        }
        document.getElementById('wh_gallery').addEventListener('change', handleFileSelect, false);
    }

    //To check files count according to upload conditions
    function CheckFilesCount(AttachmentArray) {
        var len = 0;
        for (var i = 0; i < AttachmentArray.length; i++) {
            if (AttachmentArray[i] !== undefined) {
                len++;
            }
        }
        //To check the length does not exceed 10 files maximum
        if (len > 9) {
            return false;
        }
        else
        {
            return true;
        }
    }

    //Render attachments thumbnails.
    function RenderThumbnail(e, readerEvt)
    {
        var li = document.createElement('div');
        li.className = ("col-sm-4");
        ul.appendChild(li);
        li.innerHTML = ['<div class="box-img"> <a class="btn-del" href="#">Delete</a>' +
            '<a class="img" href="#" style="background-image: url('+ e.target.result +')" data-lity></a>'
           + '</div>'].join('');
        document.getElementById('Filelist').insertBefore(ul, null);
    }


$('.has-sub').each(function(){
    var t = $(this);

    if ($(window).width() < 1025) {
        t.find('> a').click(function(e){
            e.preventDefault();
        })
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNsaWRlcnNTbWFsbCgpIHtcclxuICAgIHZhciBzbGlkZXJTID0gJCgnLnNsaWRlcnMtc21hbGwnKTtcclxuICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDk5Mikge1xyXG4gICAgICAgIHNsaWRlclMuYWRkQ2xhc3MoJ293bC1jYXJvdXNlbCcpO1xyXG4gICAgICAgIHNsaWRlclMub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBuYXZUZXh0OiBbXCI8aSBjbGFzcz0nZmEgZmEtY2hldnJvbi1sZWZ0Jz48L2k+XCIsIFwiPGkgY2xhc3M9J2ZhIGZhLWNoZXZyb24tcmlnaHQnPjwvaT5cIl0sXHJcbiAgICAgICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2xpZGVyUy50cmlnZ2VyKCdkZXN0cm95Lm93bC5jYXJvdXNlbCcpLnJlbW92ZUNsYXNzKCdvd2wtY2Fyb3VzZWwgb3dsLWxvYWRlZCcpO1xyXG4gICAgICAgIHNsaWRlclMuZmluZCgnLm93bC1zdGFnZS1vdXRlcicpLmNoaWxkcmVuKCkudW53cmFwKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBzbGlkZXJNZCgpIHtcclxuICAgIHZhciBzbGlkZXIgPSAkKCcuc2xpZGVyJyksXHJcbiAgICAgICAgZG90ID0gc2xpZGVyLmF0dHIoJ2RhdGEtZG90JykgJiYgc2xpZGVyLmF0dHIoJ2RhdGEtZG90JykgPT0gXCJ5ZXNcIiA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICBpZihzbGlkZXIuaGFzQ2xhc3MoJ293bC1jYXJvdXNlbCcpKXtcclxuICAgICAgc2xpZGVyLnRyaWdnZXIoJ2Rlc3Ryb3kub3dsLmNhcm91c2VsJykucmVtb3ZlQ2xhc3MoJ293bC1jYXJvdXNlbCBvd2wtbG9hZGVkJyk7XHJcbiAgICAgIHNsaWRlci5maW5kKCcub3dsLXN0YWdlLW91dGVyJykuY2hpbGRyZW4oKS51bndyYXAoKTtcclxuICAgICAgc2xpZGVyLmFkZENsYXNzKCdhYScpO1xyXG4gICAgfVxyXG4gICAgc2xpZGVyLmFkZENsYXNzKCdvd2wtY2Fyb3VzZWwnKTtcclxuICAgIHNsaWRlci5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgbmF2VGV4dDogW1wiPGkgY2xhc3M9J2ZhIGZhLWFuZ2xlLWxlZnQnPjwvaT5cIiwgXCI8aSBjbGFzcz0nZmEgZmEtYW5nbGUtcmlnaHQnPjwvaT5cIl0sXHJcbiAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgIGRvdHM6IGRvdCxcclxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLy9NQVRDSCBIRUlHSFRcclxuZnVuY3Rpb24gc2V0TUgoKSB7XHJcbiAgICAkKCcuaXRlbScpLmZpbmQoJ2g0JykubWF0Y2hIZWlnaHQoKTtcclxuICAgICQoJy5pdGVtJykuZmluZCgncCcpLm1hdGNoSGVpZ2h0KCk7XHJcbiAgICAkKCcub2ZmaWNlLWl0ZW0nKS5tYXRjaEhlaWdodCgpO1xyXG4gICAgJCgnLnRlc3RpbW9uaScpLmZpbmQoJy5zbGlkZXJzLXNtYWxsJykuZmluZCgnLmNvbC1tZC0zJykubWF0Y2hIZWlnaHQoKTtcclxuICAgICQoJy51cGdyYWRlLmhhcy1tb3JlJykuZmluZCgnLml0ZW0nKS5tYXRjaEhlaWdodCgpO1xyXG4gICAgLy8gJCgnZGwnKS5maW5kKCdkdCxkZCcpLm1hdGNoSGVpZ2h0KCk7XHJcbiAgICAkKCcuZm9ybS1nZXQtcXVvdGUnKS5maW5kKCdkdCxkZCcpLm1hdGNoSGVpZ2h0KCk7XHJcbiAgICAkKCcuc2FtZS1oJykuZmluZCgnLnNldC1oJykubWF0Y2hIZWlnaHQoe1xyXG4gICAgICAgIGJ5Um93OiBmYWxzZVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vU1RJQ0tZIEZPT1RFUlxyXG5mdW5jdGlvbiBzdGlja3lGb290ZXIoKSB7XHJcbiAgICB2YXIgbSA9ICQoJ21haW4nKSxcclxuICAgICAgICBoID0gJCgnaGVhZGVyJykub3V0ZXJIZWlnaHQoKSxcclxuICAgICAgICBmID0gJCgnZm9vdGVyJykub3V0ZXJIZWlnaHQoKSxcclxuICAgICAgICB3ID0gJCh3aW5kb3cpLmhlaWdodCgpLFxyXG4gICAgICAgIHNldCA9IHcgLSBoIC0gZjtcclxuICAgIG0uY3NzKCdtaW4taGVpZ2h0Jywgc2V0KVxyXG4gICAgLy8gY29uc29sZS5sb2coJ21haW4oJysgc2V0ICsnKSA9IHdpbmRvdygnICsgdyArICcpIC0gaGVhZGVyKCcgKyBoICsgJykgLSBmb290ZXIoJyArIGYgKyAnKScpXHJcbn1cclxuXHJcbi8vc2VsZWN0Ym94IHdpdGggdGFnXHJcbmZ1bmN0aW9uIG11bHRpc2VsZWN0KCkge1xyXG4gICAgLy9yZW1vdmUgQXJyYXlcclxuICAgIEFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgd2hhdCwgYSA9IGFyZ3VtZW50cyxcclxuICAgICAgICAgICAgTCA9IGEubGVuZ3RoLFxyXG4gICAgICAgICAgICBheDtcclxuICAgICAgICB3aGlsZSAoTCAmJiB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB3aGF0ID0gYVstLUxdO1xyXG4gICAgICAgICAgICB3aGlsZSAoKGF4ID0gdGhpcy5pbmRleE9mKHdoYXQpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKGF4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcblxyXG4gICAgJCgnc2VsZWN0LnNlbGVjdC5oYXMtdGFnOm5vdCguc2NyaXB0ZWQpJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgYnMgPSB0LmNsb3Nlc3QoJy5ib290c3RyYXAtc2VsZWN0JyksXHJcbiAgICAgICAgICAgIHByID0gdC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLFxyXG4gICAgICAgICAgICBibiA9IHByLmZpbmQoJy5ib3gtdGFnJykubGVuZ3RoLFxyXG4gICAgICAgICAgICBib3hUYWcgPSBibiA9PSAwID8gJCgnPGRpdiBjbGFzcz1cImJveC10YWdcIj48L2Rpdj4nKS5pbnNlcnRBZnRlcihicykgOiBwci5maW5kKCcuYm94LXRhZycpLFxyXG4gICAgICAgICAgICBibSA9ICQoXCI8ZGl2IGNsYXNzPSd0ZXh0Jz5cIikuaW5zZXJ0QWZ0ZXIoYm94VGFnKSxcclxuICAgICAgICAgICAgc2VsID0gdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSxcclxuICAgICAgICAgICAgYiA9IGluZGV4O1xyXG4gICAgICAgIHQuYWRkQ2xhc3MoJ3NjcmlwdGVkJyk7XHJcblxyXG5cclxuICAgICAgICAvL2dldCBsYXN0IHNlbGVjdGVkIHZhbHVlIGluIG11bHRpcGxlIHNlbGVjdFxyXG4gICAgICAgIHZhciBhbGxTZWxlY3RlZCA9IFtdLFxyXG4gICAgICAgICAgICBwcmV2aW91c2x5U2VsZWN0ZWQgPSBbXTtcclxuICAgICAgICBpZiAoc2VsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYWxsU2VsZWN0ZWQgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBwcmV2aW91c2x5U2VsZWN0ZWQgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGFzdFNlbGVjdGVkKHZhbCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3U2VsZWN0aW9ucyA9IHZhbC5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2aW91c2x5U2VsZWN0ZWQuaW5kZXhPZihlbGVtZW50KSA9PSAtMTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNseVNlbGVjdGVkID0gdmFsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChuZXdTZWxlY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBuZXcgc2VsZWN0aW9ucywgd2UnbGwgdGFrZSB0aGUgbGFzdCBpbiB0aGUgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdTZWxlY3Rpb25zLnJldmVyc2UoKVswXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlbSA9JyArIG5ld1NlbGVjdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInJlbVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVRhZyh2KSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB2ID09IG51bGwgPyAnbm9uZScgOiB2O1xyXG4gICAgICAgICAgICBib3hUYWcuZmluZCgnLnRhZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbC5pbmNsdWRlcyh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5zZXJ0VGFnKHZhbCwgdGV4dCkge1xyXG4gICAgICAgICAgICBib3hUYWcuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInRhZ1wiIGRhdGEtdmFsdWU9XCInICsgdmFsICsgJ1wiPicgKyB0ZXh0ICsgJzxpIGNsYXNzPVwicmVtb3ZlXCIgZGF0YS10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1wbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT1cIlJlbW92ZVwiPsOXPC9pPjwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiBcImJvZHlcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluc2VydE90aGVyKHZhbCkge1xyXG4gICAgICAgICAgICBib3hUYWcuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInRhZ1wiIGRhdGEtdmFsdWU9XCInICsgdmFsICsgJ1wiPjxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJvdGhlclwiIHBsYWNlaG9sZGVyPVwiVHlwZSB5b3VyIGNhcmdvXCIgcmVxdWlyZWQ+PGkgY2xhc3M9XCJyZW1vdmVcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLXBsYWNlbWVudD1cInRvcFwiIHRpdGxlPVwiUmVtb3ZlXCI+w5c8L2k+PC9zcGFuPicpO1xyXG4gICAgICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCh7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXI6IFwiYm9keVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICQodGhpcykuY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSxcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzZWxlY3RlZC5odG1sKCksXHJcbiAgICAgICAgICAgICAgICBsYXN0QWRkZWQgPSBnZXRMYXN0U2VsZWN0ZWQoJCh0aGlzKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICBvcHQgPSAkKHRoaXMpLmZpbmQoJ29wdGlvblt2YWx1ZT1cIicgKyBsYXN0QWRkZWQgKyAnXCJdJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAvL2JtLmh0bWwoXCJ2YWx1ZS09XCIrJCh0aGlzKS52YWwoKStcIjxicj5sYXN0QWRkZWQgPSBcIitsYXN0QWRkZWQrXCI8YnI+YWxsU2VsZWN0ZWQgPSBcIithbGxTZWxlY3RlZCtcIjxicj5wcmV2aW91c2x5U2VsZWN0ZWQgPVwiK3ByZXZpb3VzbHlTZWxlY3RlZCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXN0ID0nICsgbGFzdEFkZGVkICsgXCIgLSBcIiArICQodGhpcykudmFsKCkpO1xyXG4gICAgICAgICAgICBpZiAobGFzdEFkZGVkID09IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuc2VsZWN0cGlja2VyKCdkZXNlbGVjdEFsbCcpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3RwaWNrZXIoJ3ZhbCcsIFwiMFwiKTtcclxuICAgICAgICAgICAgICAgIGluc2VydFRhZyhsYXN0QWRkZWQsIG9wdCk7XHJcbiAgICAgICAgICAgICAgICBhbGxTZWxlY3RlZCA9IFtcIjBcIl07XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5U2VsZWN0ZWQgPSBbXCIwXCJdO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLmNsb3Nlc3QoJy5ib290c3RyYXAtc2VsZWN0JykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdEFkZGVkID09ICdPdGhlcicpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdPdGhlcicpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzQWRkZWQgPSBsYXN0QWRkZWQgPT0gXCJyZW1cIiA/IHRydWUgOiBhbGxTZWxlY3RlZC5pbmNsdWRlcyhsYXN0QWRkZWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBhbGxTZWxlY3RlZCA9ICQodGhpcykudmFsKCkgPT0gbnVsbCA/IFtdIDogJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNBZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydE90aGVyKGxhc3RBZGRlZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZVRhZygkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGxTZWxlY3RlZC5yZW1vdmUoJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdEFkZGVkICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpc0FkZGVkID0gbGFzdEFkZGVkID09IFwicmVtXCIgPyB0cnVlIDogYWxsU2VsZWN0ZWQuaW5jbHVkZXMobGFzdEFkZGVkLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFsbFNlbGVjdGVkID0gJCh0aGlzKS52YWwoKSA9PSBudWxsID8gW10gOiAkKHRoaXMpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXNBZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc2VydFRhZyhsYXN0QWRkZWQsIG9wdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZVRhZygkKHRoaXMpLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGxTZWxlY3RlZC5yZW1vdmUoJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVUYWcoJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICBhbGxTZWxlY3RlZCA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHQuc2VsZWN0cGlja2VyKCd0b2dnbGUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy50YWcgLnJlbW92ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCd2YWx1ZScpLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBic2VsZWN0ID0gJCh0aGlzKS5jbG9zZXN0KCcuYm94LXRhZycpLnByZXYoJy5ib290c3RyYXAtc2VsZWN0JyksXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QgPSBic2VsZWN0LmZpbmQoJ3NlbGVjdC5oYXMtdGFnJyk7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICQoJy50b29sdGlwJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGFsbFNlbGVjdGVkLnJlbW92ZSh2YWwpO1xyXG4gICAgICAgICAgICBwcmV2aW91c2x5U2VsZWN0ZWQucmVtb3ZlKHZhbCk7XHJcbiAgICAgICAgICAgIGlmIChic2VsZWN0Lmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBic2VsZWN0LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLmZpbmQoJ3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0LnNlbGVjdHBpY2tlcignZGVzZWxlY3RBbGwnKTtcclxuICAgICAgICAgICAgICAgIGFsbFNlbGVjdGVkID0gW107XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c2x5U2VsZWN0ZWQgPSBbXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5zZWxlY3RwaWNrZXIoJ3ZhbCcsIGFsbFNlbGVjdGVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2FsY0Ftb3VudCgpIHtcclxuICAgIHZhciBzdW0gPSAwO1xyXG4gICAgdmFyIHRheCA9ICQoJ2lucHV0W25hbWU9dGF4XScpO1xyXG4gICAgdmFyIHN1YnRvdGFsID0gJCgnaW5wdXRbbmFtZT1zdWJfdG90YWxdJyk7XHJcbiAgICB2YXIgdGF4Y2hhcmdlID0gJCgnaW5wdXRbbmFtZT10YXhfY2hhcmdlc10nKTtcclxuICAgIHZhciB0b3RhbCA9ICQoJ2lucHV0W25hbWU9dG90YWxdJyk7XHJcblxyXG4gICAgJCgnI2Ftb3VudCcpLmZpbmQoJy5jdXJyZW5jeScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHN1bSArPSBwYXJzZUludCh0aGlzLnZhbHVlLnNwbGl0KCcuJykuam9pbignJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHN1bSA9IE1hdGgucm91bmQoc3VtKTtcclxuICAgIHN1YnRvdGFsLnZhbChzdW0pO1xyXG4gICAgc3VidG90YWwucnVwaWFoKCk7XHJcblxyXG4gICAgaWYgKHN1YnRvdGFsLnZhbCgpICE9PSAnJyAmJiB0YXgudmFsKCkgIT09ICcnKSB7XHJcbiAgICAgICAgdmFyIHN2YWwgPSBwYXJzZUludChzdWJ0b3RhbC52YWwoKS5zcGxpdCgnLicpLmpvaW4oJycpKTtcclxuICAgICAgICB2YXIgdHZhbCA9IHBhcnNlSW50KHRheC52YWwoKS5zcGxpdCgnLicpLmpvaW4oJycpKTtcclxuICAgICAgICB2YXIgdGNIYXNpbCA9IChzdmFsIC8gMTAwKSAqIHR2YWw7XHJcblxyXG4gICAgICAgIHZhciB0Y0hhc2lsID0gTWF0aC5yb3VuZCh0Y0hhc2lsKTtcclxuICAgICAgICB0YXhjaGFyZ2UudmFsKHRjSGFzaWwpO1xyXG4gICAgICAgIHRheGNoYXJnZS5ydXBpYWgoKTtcclxuICAgIH1cclxuICAgIGlmIChzdWJ0b3RhbC52YWwoKSAhPT0gJycgJiYgdGF4Y2hhcmdlLnZhbCgpICE9PSAnJykge1xyXG4gICAgICAgIHZhciBzdmFsID0gcGFyc2VJbnQoc3VidG90YWwudmFsKCkuc3BsaXQoJy4nKS5qb2luKCcnKSk7XHJcbiAgICAgICAgdmFyIGN2YWwgPSBwYXJzZUludCh0YXhjaGFyZ2UudmFsKCkuc3BsaXQoJy4nKS5qb2luKCcnKSk7XHJcblxyXG4gICAgICAgIHZhciB0b3RIYXNpbCA9IHN2YWwgKyBjdmFsO1xyXG4gICAgICAgIHZhciB0b3RIYXNpbCA9IE1hdGgucm91bmQodG90SGFzaWwpO1xyXG4gICAgICAgIHRvdGFsLnZhbCh0b3RIYXNpbCk7XHJcbiAgICAgICAgdG90YWwucnVwaWFoKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFZJRVcgUVVPVEVcclxuZnVuY3Rpb24gdmlld1F1b3RlKCkge1xyXG4gICAgJCgnLmZvcm0tdmlldy1xdW90ZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpLmZpbmQoJ2Zvcm0nKTtcclxuICAgICAgICAvLyBmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgICAvLyAgICAgaWdub3JlOiBcIjpkaXNhYmxlZCwgOmhpZGRlblwiLFxyXG4gICAgICAgIC8vICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyAgICAgICAgIHZhciBmZyA9ICQoZWxlbWVudCkuY2xvc2VzdCgnLnZhbHRoaXMnKTtcclxuICAgICAgICAvLyAgICAgICAgIGVycm9yLmFwcGVuZFRvKGZnKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAkKCcjYW1vdW50JykuZmluZCgnLmN1cnJlbmN5JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNhbGNBbW91bnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJ2lucHV0W25hbWU9dGF4XScpLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjYWxjQW1vdW50KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5tdWx0aXBsaWVyJykuZmluZCgnLmJ0bi1kZWxldGUnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChjYWxjQW1vdW50LCAxMDAwKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBNVUxUSVBMSUVSXHJcbmZ1bmN0aW9uIG11bHRpcGxpZXJXb3JIb3VycygpIHtcclxuICAgICQoJy5tdWx0aS13b3JraW5nLWgnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgbGltaXQgPSB0LmRhdGEoJ2xpbWl0JyksXHJcbiAgICAgICAgICAgIGl0ZW0gPSB0LmZpbmQoJy5zYW1wbGUnKVxyXG4gICAgICAgICAgICBhZGQgPSB0LmZpbmQoJy5idG4tYWRkJyksXHJcbiAgICAgICAgICAgIHRhcmdldCA9IHQuZmluZCgnLmJveC1pdGVtJyk7XHJcbiAgICAgICAgLy8gZm9ybWF0O1xyXG5cclxuICAgICAgICBpdGVtLmZpbmQoJ3NlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2VsZWN0cGlja2VyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvcm1hdCA9IGl0ZW0uY2xvbmUoKS5yZW1vdmVDbGFzcygnc2FtcGxlJyk7XHJcbiAgICAgICAgYmluZChpdGVtKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmluZChvYmopIHtcclxuICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdHBpY2tlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdzZWxlY3QtY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogNVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHUgPSAkKHRoaXMpLmRhdGEoJ3VuaXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBidG4gPSAkKHRoaXMpLmNsb3Nlc3QoJy5ib290c3RyYXAtc2VsZWN0JykuZmluZCgnYnV0dG9uJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGR1ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ0bi5hZGRDbGFzcygnaGFzLXVuaXQnKTtcclxuICAgICAgICAgICAgICAgICAgICBidG4uYXBwZW5kKCc8c3BhbiBjbGFzcz1cInVuaXRcIj4nICsgZHUgKyAnPC9zcGE+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiLm51bS1vbmx5XCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoICE9IDggJiYgZS53aGljaCAhPSAwICYmIGUud2hpY2ggIT0gNDMgJiYgKGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmlld1F1b3RlKCk7XHJcbiAgICAgICAgICAgICQoJy5jdXJyZW5jeScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmtleXVwKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucnVwaWFoKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiByZU9yZGVyKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRtID0gb2JqLmZpbmQoJy5pdGVtJyk7XHJcbiAgICAgICAgICAgIGl0bS5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0bXAgPSBpICsgMTtcclxuICAgICAgICAgICAgICAgIC8vcmUgb3JkZXIgbmFtZVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignbmFtZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5hdHRyKCduYW1lJykucmVwbGFjZSgvXFxfXFxkL2csICdfJyArIChpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ25hbWUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpLnJlcGxhY2UoL1xcX1xcZC9nLCAnXycgKyAoaSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ25hbWUnLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vc2hvdyBhbmQgaGlkZSBkZWxldGUgYnV0dG9uXHJcbiAgICAgICAgICAgIGlmIChpdG0ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdC5hZGRDbGFzcygnY2xvbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2hvdy1uZXh0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBpdG0uZXEoMCkuZmluZCgnLnNob3ctbmV4dCcpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHQucmVtb3ZlQ2xhc3MoJ2Nsb25lZCcpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBzaG93IGFuZCBoaWRlIGFkZCBidXR0b25cclxuICAgICAgICAgICAgaWYgKGl0bS5sZW5ndGggPj0gbGltaXQpIHtcclxuICAgICAgICAgICAgICAgIHQuYWRkQ2xhc3MoJ2xpbWl0ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHQucmVtb3ZlQ2xhc3MoJ2xpbWl0ZWQnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc2V0IGl0ZW0gbGVuZ3RoXHJcbiAgICAgICAgICAgICQoJyN3aENvdW50JykudmFsKGl0bS5sZW5ndGggLSAxKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhZGQuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gZm9ybWF0LmNsb25lKCk7XHJcbiAgICAgICAgICAgIHRhcmdldC5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgIGJpbmQoaHRtbCk7XHJcbiAgICAgICAgICAgIGh0bWwuc2xpZGVEb3duKDMwMCk7XHJcbiAgICAgICAgICAgIHJlT3JkZXIodGFyZ2V0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gREVMRVRFXHJcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuYnRuLWRlbGV0ZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5jbG9zZXN0KCcuaXRlbScpLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gcGFyZW50LmNsb3Nlc3QoJy5ib3gtaXRlbScpO1xyXG5cclxuICAgICAgICAgICAgcGFyZW50LnNsaWRlVXAoMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlT3JkZXIodGFyZ2V0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbXVsdGlwbGllcigpIHtcclxuICAgICQoJy5tdWx0aXBsaWVyJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGxpbWl0ID0gdC5kYXRhKCdsaW1pdCcpLFxyXG4gICAgICAgICAgICBpdGVtID0gdC5maW5kKCcuaXRlbScpLmVxKDApLFxyXG4gICAgICAgICAgICBhZGQgPSB0LmZpbmQoJy5idG4tYWRkJyksXHJcbiAgICAgICAgICAgIHRhcmdldCA9IHQuZmluZCgnLmJveC1pdGVtJyksXHJcbiAgICAgICAgICAgIGZvcm1hdDtcclxuXHJcbiAgICAgICAgaXRlbS5maW5kKCdzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNlbGVjdHBpY2tlcignZGVzdHJveScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3JtYXQgPSBpdGVtLmNsb25lKCkuaGlkZSgpO1xyXG4gICAgICAgIGJpbmQoaXRlbSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJpbmQob2JqKSB7XHJcbiAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zZWxlY3RwaWNrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiAnc2VsZWN0LWNvbnRyb2wnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IDVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGR1ID0gJCh0aGlzKS5kYXRhKCd1bml0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgYnRuID0gJCh0aGlzKS5jbG9zZXN0KCcuYm9vdHN0cmFwLXNlbGVjdCcpLmZpbmQoJ2J1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkdSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBidG4uYWRkQ2xhc3MoJ2hhcy11bml0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnRuLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJ1bml0XCI+JyArIGR1ICsgJzwvc3BhPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJChcIi5udW0tb25seVwiKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCAhPSA4ICYmIGUud2hpY2ggIT0gMCAmJiBlLndoaWNoICE9IDQzICYmIChlLndoaWNoIDwgNDggfHwgZS53aGljaCA+IDU3KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZpZXdRdW90ZSgpO1xyXG4gICAgICAgICAgICAkKCcuY3VycmVuY3knKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJ1cGlhaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVPcmRlcihvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0bSA9IG9iai5maW5kKCcuaXRlbScpO1xyXG4gICAgICAgICAgICBpdG0uZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gaSArIDE7XHJcbiAgICAgICAgICAgICAgICAvL3JlIG9yZGVyIG5hbWVcclxuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ25hbWUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpLnJlcGxhY2UoL1xcX1xcZC9nLCAnXycgKyAoaSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ25hbWUnLCBuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vc2hvdyBhbmQgaGlkZSBkZWxldGUgYnV0dG9uXHJcbiAgICAgICAgICAgIGlmIChpdG0ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdC5hZGRDbGFzcygnY2xvbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuc2hvdy1uZXh0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBpdG0uZXEoMCkuZmluZCgnLnNob3ctbmV4dCcpLmF0dHIoJ2Rpc2FibGVkJywnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHQucmVtb3ZlQ2xhc3MoJ2Nsb25lZCcpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBzaG93IGFuZCBoaWRlIGFkZCBidXR0b25cclxuICAgICAgICAgICAgaWYgKGl0bS5sZW5ndGggPj0gbGltaXQpIHtcclxuICAgICAgICAgICAgICAgIHQuYWRkQ2xhc3MoJ2xpbWl0ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHQucmVtb3ZlQ2xhc3MoJ2xpbWl0ZWQnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc2V0IGl0ZW0gbGVuZ3RoXHJcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9YW1vdW50Q291bnRdJykudmFsKGl0bS5sZW5ndGgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFkZC5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSBmb3JtYXQuY2xvbmUoKTtcclxuICAgICAgICAgICAgdGFyZ2V0LmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgYmluZChodG1sKTtcclxuICAgICAgICAgICAgaHRtbC5zbGlkZURvd24oMzAwKTtcclxuICAgICAgICAgICAgcmVPcmRlcih0YXJnZXQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBERUxFVEVcclxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5idG4tZGVsZXRlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5pdGVtJyksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBwYXJlbnQuY2xvc2VzdCgnLmJveC1pdGVtJyk7XHJcblxyXG4gICAgICAgICAgICBwYXJlbnQuc2xpZGVVcCgzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVPcmRlcih0YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBTVElDS1kgU0lERUJBUlxyXG5mdW5jdGlvbiBzZXRTdHlsZShlbGVtZW50LCBjc3NQcm9wZXJ0eSkge1xyXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY3NzUHJvcGVydHkpIHtcclxuICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XSA9IGNzc1Byb3BlcnR5W3Byb3BlcnR5XTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVzdHJveVN0aWNreShlbGVtZW50KSB7XHJcbiAgICBzZXRTdHlsZShlbGVtZW50LCB7XHJcbiAgICAgICAgdG9wOiAnJyxcclxuICAgICAgICBsZWZ0OiAnJyxcclxuICAgICAgICBib3R0b206ICcnLFxyXG4gICAgICAgIHdpZHRoOiAnJyxcclxuICAgICAgICBwb3NpdGlvbjogJydcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPZmZzZXQoZWwpIHtcclxuICAgIGVsID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxlZnQ6IGVsLmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCxcclxuICAgICAgICB0b3A6IGVsLnRvcCArIHdpbmRvdy5zY3JvbGxZXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNpbXBsZVN0aWNreVNpZGViYXIoZWxlbWVudCwgb3B0aW9ucykge1xyXG5cclxuICAgIC8vIEdsb2JhbCBvcHRpb25zXHJcbiAgICB2YXIgc3RpY2t5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KTsgLy8gU3RpY2t5IHNpZGViYXJcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuY29udGFpbmVyKTsgLy8gU3RpY2t5IHNpZGViYXIgY29udGFpbmVyXHJcbiAgICB2YXIgdG9wU3BhY2UgPSBvcHRpb25zLnRvcFNwYWNlID8gb3B0aW9ucy50b3BTcGFjZSA6IDA7IC8vIFRvcCBzcGFjaW5nIGFmdGVyIHN0aWNreVxyXG4gICAgdmFyIGJvdHRvbVNwYWNlID0gb3B0aW9ucy5ib3R0b21TcGFjZSA/IG9wdGlvbnMuYm90dG9tU3BhY2UgOiAwOyAvLyBCb3R0b20gc3BhY2luZyBhZnRlciBzdGlja3lcclxuXHJcbiAgICAvLyB2YXJzXHJcbiAgICB2YXIgJHdpbmRvdyA9IHdpbmRvdzsgLy8gd2luZG93XHJcbiAgICB2YXIgc3RpY2t5SGVpZ2h0ID0gc3RpY2t5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDsgLy8gU3RpY2t5IHNpZGViYXIgaGVpZ2h0XHJcbiAgICB2YXIgc3RpY2t5T2Zmc2V0VG9wID0gZ2V0T2Zmc2V0KHN0aWNreSkudG9wOyAvLyBTdGlja3kgc2lkZWJhciB0b3Agb2Zmc2V0XHJcbiAgICB2YXIgc3RpY2t5T2Zmc2V0Qm90dG9tID0gZ2V0T2Zmc2V0KHN0aWNreSkudG9wICsgc3RpY2t5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDsgLy8gU3RpY2t5IHNpZGViYXIgYm90dG9tIG9mZnNldFxyXG4gICAgdmFyIHN0aWNreU9mZnNldExlZnQgPSBnZXRPZmZzZXQoc3RpY2t5KS5sZWZ0OyAvLyBTdGlja3kgc2lkZWJhciBsZWZ0IG9mZnNldFxyXG4gICAgdmFyIHRvcEZpeGVkID0gZmFsc2U7IC8vIGNoZWNrcG9pbnRcclxuICAgIHZhciBib3R0b21GaXhlZCA9IGZhbHNlOyAvLyBjaGVja3BvaW50XHJcbiAgICB2YXIgbGFzdFNjcm9sbFZhbCA9IDA7IC8vIGNoZWNrcG9pbnRcclxuXHJcbiAgICAvL2N1c3RvbXZhcnNcclxuICAgIHZhciBzdG9wcGVyID0gJCgnLnN0aWNreW1lLXN0b3BwZXInKTtcclxuICAgIHZhciBzdG9wcGVyT2Zmc2V0Qm90dG9tID0gc3RvcHBlci5vZmZzZXQoKS50b3AgLSAkd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgdmFyIHBhciA9ICQoJy5zdGlja3ltZScpLmNsb3Nlc3QoJy5yb3cnKTtcclxuICAgIHZhciBpbm5lciA9ICQoJy5zdGlja3ltZS1pbm5lcicpO1xyXG4gICAgdmFyIHN0b3BUb3AgPSBwYXIuaGVpZ2h0KCkgLSBpbm5lci5oZWlnaHQoKTtcclxuICAgIHBhci5jc3MoJ21pbi1oZWlnaHQnLGlubmVyLmhlaWdodCgpICsgODApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdUZXN0LCBjb250YWluZXIgaGVpZ2h0OiAnK3Bhci5oZWlnaHQoKSsnLCBzdGlja3kgaGVpZ2h0OiAnK2lubmVyLmhlaWdodCgpKTtcclxuICAgIC8vIHNjcm9sbGluZ1xyXG4gICAgaWYocGFyLmhlaWdodCgpID4gaW5uZXIuaGVpZ2h0KCkgKyA4MCkge1xyXG4gICAgICAgIGlubmVyLnJlbW92ZUNsYXNzKCduby1zdGlja3knKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgICAgICAgICAvLyB3aGVuIHNjcm9sbCBwb3NpdGlvbiB0b3VjaCB0aGUgXCJTaWRlYmFyXCJcclxuICAgICAgICAgICAgaWYgKHNjcm9sbFRvcCA+IHN0aWNreU9mZnNldFRvcCAtIHRvcFNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBcIlNpZGViYXJcIiBzbWFsbGVyIHRoYW4gdmlld3BvcnRcclxuICAgICAgICAgICAgICAgIGlmIChzdGlja3lIZWlnaHQgPD0gJHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcFNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZml4IFwiU2lkZWJhclwiIGZyb20gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U3R5bGUoc3RpY2t5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wU3BhY2UgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHN0aWNreU9mZnNldExlZnQgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBzdGlja3kuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbFRvcCA+IHN0b3BwZXJPZmZzZXRCb3R0b20pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3R5bGUoc3RpY2t5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBzdG9wVG9wICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzY3JvbGxpbmcgZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPiBsYXN0U2Nyb2xsVmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIFwiU2lkZWJhclwiIGZpeGVkIGZyb20gdG9wIGR1cmluZyBzY3JvbGxpbmcgZG93blxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9wRml4ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBuZXcgb2Zmc2V0IG9mIFwiU2lkZWJhclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWJzb2x1dGVTdGlja3lPZmZzZXRUb3AgPSBnZXRPZmZzZXQoc3RpY2t5KS50b3A7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3R5bGUoc3RpY2t5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBhYnNvbHV0ZVN0aWNreU9mZnNldFRvcCAtIGdldE9mZnNldChjb250YWluZXIpLnRvcCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BGaXhlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgXCJTaWRlYmFyXCIgZml4ZWQgZnJvbSBib3R0b20gd2hlbiBib3R0b20gYXJlYSB2aXNpYmxlIGluIHZpZXdwb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPiBzdGlja3lPZmZzZXRCb3R0b20gLSAkd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTdHlsZShzdGlja3ksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHN0aWNreU9mZnNldExlZnQgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiBib3R0b21TcGFjZSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogc3RpY2t5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbUZpeGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVG9wID4gc3RvcHBlck9mZnNldEJvdHRvbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTdHlsZShzdGlja3ksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHN0b3BUb3AgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gc2Nyb2xsaW5nIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBuZXcgb2Zmc2V0IG9mIFwiU2lkZWJhclwiIGR1cmluZyBzY3JvbGxpbmcgdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFic29sdXRlU3RpY2t5T2Zmc2V0VG9wID0gZ2V0T2Zmc2V0KHN0aWNreSkudG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgaWYgXCJTaWRlYmFyXCIgZml4ZWQgZnJvbSBib3R0b20sIHN0b3Agc3RpY2t5IHRvIGl0cyBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYm90dG9tRml4ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFN0eWxlKHN0aWNreSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogYWJzb2x1dGVTdGlja3lPZmZzZXRUb3AgLSBnZXRPZmZzZXQoY29udGFpbmVyKS50b3AgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tRml4ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIFwiU2lkZWJhclwiIGZpeGVkIGZyb20gdG9wIHdoZW4gdG9wIGFyZWEgdmlzaWJsZSBpbiB2aWV3cG9ydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVG9wIDwgYWJzb2x1dGVTdGlja3lPZmZzZXRUb3AgLSB0b3BTcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3R5bGUoc3RpY2t5LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3BTcGFjZSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBzdGlja3lPZmZzZXRMZWZ0ICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHN0aWNreS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCArIFwicHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3BGaXhlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNjcm9sbFZhbCA9IHNjcm9sbFRvcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc2lkZWJhciB0byBkZWZhdWx0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95U3RpY2t5KHN0aWNreSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gZGVzdHJveVN0aWNreShzdGlja3kpO1xyXG4gICAgICAgIGlubmVyLmFkZENsYXNzKCduby1zdGlja3knKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vQWxlcnQgSW1hZ2VcclxuZnVuY3Rpb24gYWxlcnRVcGxvYWQocGFyKSB7XHJcbiAgICB2YXIgdGV4dCA9IHBhcjtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJhbGVydC11cGxvYWQgYmxpbmtcIj48ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI+PGkgY2xhc3M9XCJjbG9zZSBmYSBmYS10aW1lc1wiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCI+PC9pPicgKyB0ZXh0ICsgJzwvZGl2PjwvZGl2PicpO1xyXG4gICAgJCgnLmFsZXJ0LXVwbG9hZCcpLmZhZGVJbigzMDApO1xyXG5cclxuICAgICQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnLmFsZXJ0LXVwbG9hZCcpLmZhZGVPdXQoMzAwKTtcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgIH0pO1xyXG4gICAgJChmdW5jdGlvbigpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcuYWxlcnQtdXBsb2FkJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfSwgNDUwMCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8vIEJsaW5rZXJcclxuXHJcbiQoJy5oZWxwLWJsb2NrJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgdmFyIHQgPSAkKHRoaXMpLFxyXG4gICAgICAgIGljbyA9IHQuZmluZCgnLmZhJyk7XHJcbiAgICBpY28uYWRkQ2xhc3MoJ2JsaW5rZXInKTtcclxuXHJcbiAgICBpY28ubW91c2VlbnRlcihmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdibGlua2VyJyk7XHJcbiAgICB9KS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2JsaW5rZXInKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKCcuc3RpY2t5bWUnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2ltcGxlU3RpY2t5U2lkZWJhcignLnN0aWNreW1lLWlubmVyJywge1xyXG4gICAgICAgICAgICBjb250YWluZXI6ICcuc3RpY2t5bWUnLFxyXG4gICAgICAgICAgICB0b3BTcGFjZTogNzAsXHJcbiAgICAgICAgICAgIGJvdHRvbVNwYWNlIDogMzBcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnYVtkYXRhLXRvZ2dsZT1cInRhYlwiXScpLm9uKCdzaG93bi5icy50YWInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICQoJy5zdGlja3ltZScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgc2ltcGxlU3RpY2t5U2lkZWJhcignLnN0aWNreW1lLWlubmVyJywge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiAnLnN0aWNreW1lJyxcclxuICAgICAgICAgICAgICAgIHRvcFNwYWNlOiA3MCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbVNwYWNlIDogMzBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgLy8gUmVwbGFjZSBhbGwgU1ZHIGltYWdlcyB3aXRoIGlubGluZSBTVkdcclxuICAgIGpRdWVyeSgnaW1nLnN2ZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRpbWcgPSBqUXVlcnkodGhpcyk7XHJcbiAgICAgICAgdmFyIGltZ0lEID0gJGltZy5hdHRyKCdpZCcpO1xyXG4gICAgICAgIHZhciBpbWdDbGFzcyA9ICRpbWcuYXR0cignY2xhc3MnKTtcclxuICAgICAgICB2YXIgaW1nVVJMID0gJGltZy5hdHRyKCdzcmMnKTtcclxuXHJcbiAgICAgICAgalF1ZXJ5LmdldChpbWdVUkwsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBTVkcgdGFnLCBpZ25vcmUgdGhlIHJlc3RcclxuICAgICAgICAgICAgdmFyICRzdmcgPSBqUXVlcnkoZGF0YSkuZmluZCgnc3ZnJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcmVwbGFjZWQgaW1hZ2UncyBJRCB0byB0aGUgbmV3IFNWR1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGltZ0lEICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgJHN2ZyA9ICRzdmcuYXR0cignaWQnLCBpbWdJRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQWRkIHJlcGxhY2VkIGltYWdlJ3MgY2xhc3NlcyB0byB0aGUgbmV3IFNWR1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGltZ0NsYXNzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgJHN2ZyA9ICRzdmcuYXR0cignY2xhc3MnLCBpbWdDbGFzcyArICcgcmVwbGFjZWQtc3ZnJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgaW52YWxpZCBYTUwgdGFncyBhcyBwZXIgaHR0cDovL3ZhbGlkYXRvci53My5vcmdcclxuICAgICAgICAgICAgJHN2ZyA9ICRzdmcucmVtb3ZlQXR0cigneG1sbnM6YScpO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVwbGFjZSBpbWFnZSB3aXRoIG5ldyBTVkdcclxuICAgICAgICAgICAgJGltZy5yZXBsYWNlV2l0aCgkc3ZnKTtcclxuXHJcbiAgICAgICAgfSwgJ3htbCcpO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xyXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcclxuXHJcbiAgICAvL1NFTEVDVFBJQ0tFUlxyXG4gICAgJCgnc2VsZWN0LnNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5zZWxlY3RwaWNrZXIoe1xyXG4gICAgICAgICAgICBzdHlsZTogJ3NlbGVjdC1jb250cm9sJyxcclxuICAgICAgICAgICAgc2l6ZTogNVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkdSA9ICQodGhpcykuZGF0YSgndW5pdCcpLFxyXG4gICAgICAgICAgICBidG4gPSAkKHRoaXMpLmNsb3Nlc3QoJy5ib290c3RyYXAtc2VsZWN0JykuZmluZCgnYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIGlmIChkdSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYnRuLmFkZENsYXNzKCdoYXMtdW5pdCcpO1xyXG4gICAgICAgICAgICBidG4uYXBwZW5kKCc8c3BhbiBjbGFzcz1cInVuaXRcIj4nICsgZHUgKyAnPC9zcGE+Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy9pbnB1dGZpbGVcclxuICAgICQoJy51cGxvYWQtZmlsZScpLmVhY2goZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgaW5wdXQgPSB0LmZpbmQoJy5pbnB1dGZpbGUnKSxcclxuICAgICAgICAgICAgbGFiZWwgPSB0LmZpbmQoJy5sYWJlbC1idG4nKSxcclxuICAgICAgICAgICAgZGVsID0gdC5maW5kKCcuZGVsLWJ0bicpLFxyXG4gICAgICAgICAgICBpbmZvID0gdC5maW5kKCcuZmlsZS1pbmZvJyksXHJcbiAgICAgICAgICAgIHByZXYgPSB0LmZpbmQoJy5pbWFnZS1wcmV2aWV3JyksXHJcbiAgICAgICAgICAgIGZTaXplO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVEZWwoKSB7XHJcbiAgICAgICAgICAgIGlmICh0Lmhhc0NsYXNzKCdoYXMtZmlsZScpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWwucmVtb3ZlQ2xhc3MoJ2RpcycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsLmFkZENsYXNzKCdkaXMnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0b2dnbGVEZWwoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVhZFVSTChpbnB1dCkge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQuZmlsZXMgJiYgaW5wdXQuZmlsZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2LmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIGUudGFyZ2V0LnJlc3VsdCArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hhaScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dC5jaGFuZ2UoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSAnJyxcclxuICAgICAgICAgICAgICAgIHZhbCA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxlcyAmJiB0aGlzLmZpbGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gKHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLW11bHRpcGxlLWNhcHRpb24nKSB8fCAnJykucmVwbGFjZSgne2NvdW50fScsIHRoaXMuZmlsZXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCgnXFxcXCcpLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxlc1swXS5zaXplID4gMjA5NzE1Mikge1xyXG4gICAgICAgICAgICAgICAgLy8gYWxlcnQoJ01heCB1cGxvYWQgMk1CLicpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnRVcGxvYWQoJ1lvdXIgZmlsZSBpcyB0b28gbGFyZ2UhJyk7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSAmJiBwcmV2Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWwuc3Vic3RyaW5nKHZhbC5sYXN0SW5kZXhPZignLicpICsgMSkudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkb2MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkb2N4JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGRmJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndHh0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnanBnJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncG5nJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uaHRtbChmaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLnJlbW92ZUNsYXNzKCdkZWxldGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LmFkZENsYXNzKCdoYXMtZmlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGVydCgnT25seSBkb2N1bWVudCBmaWxlcyBhcmUgYWxsb3dlZC4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnRVcGxvYWQoJ09ubHkgZG9jdW1lbnQgZmlsZXMgYXJlIGFsbG93ZWQuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXYubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbC5zdWJzdHJpbmcodmFsLmxhc3RJbmRleE9mKCcuJykgKyAxKS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2dpZic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2pwZyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3BuZyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N2Zyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkVVJMKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5hZGRDbGFzcygnaGFzLWZpbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoJ09ubHkgaW1hZ2UgZmlsZXMgYXJlIGFsbG93ZWQuJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0VXBsb2FkKCdPbmx5IGltYWdlIGZpbGVzIGFyZSBhbGxvd2VkLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdG9nZ2xlRGVsKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbC5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHByZXYubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgICQoJy5pbWFnZS1wcmV2aWV3JykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbmZvLmFkZENsYXNzKCdkZWxldGVkJyk7XHJcbiAgICAgICAgICAgIGlucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIHQucmVtb3ZlQ2xhc3MoJ2hhcy1maWxlJyk7XHJcblxyXG4gICAgICAgICAgICB0b2dnbGVEZWwoKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcbiAgICBcclxuXHJcbiAgICAvL0lNQUdFU0xPQURFRFxyXG4gICAgJCgnYm9keScpLmltYWdlc0xvYWRlZCgpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNwcmVsb2FkaW5nJykuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJyNwcmVsb2FkaW5nJykuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgIH0pXHJcblxyXG5cclxuXHJcbiAgICAkKCdidXR0b25bdHlwZT1cInJlc2V0XCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGYgPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKSxcclxuICAgICAgICAgICAgcyA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpLmZpbmQoJ3NlbGVjdC5zZWxlY3QnKTtcclxuXHJcbiAgICAgICAgdC5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcy52YWwoJ2RlZmF1bHQnKTtcclxuICAgICAgICAgICAgcy5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vVE9HR0xFIE1FTlVcclxuICAgICQoJy5pY29uLW1lbnUnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ21lbnUtb3BlbicpO1xyXG4gICAgfSk7XHJcbiAgICAkKFwiLm0tdG9nZ2xlXCIpLmZpbmQoJy50cmlnZ2VyJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdtLXRvZ2dsZS1vcGVuJyk7XHJcbiAgICB9KS5maW5kKCcuc2lkZWJhcicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcuZm9vdC1tZW51JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGZ0ID0gdC5maW5kKCcuZm9vdC10aXRsZScpLFxyXG4gICAgICAgICAgICB1bCA9IHQuZmluZCgndWwnKTtcclxuICAgICAgICBmdC5jbGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdC50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBUT0dHTEUgRklMVEVSXHJcbiAgICAkKCcuc29ydC1maWx0ZXInKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuY2xvc2UnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvcnQtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2ZpbHRlci1vcGVuJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAkKHRoaXMpLmZpbmQoJy50cmlnZ2VyIC5jb2wtc29ydCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29ydC1vcGVuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzKS5maW5kKCcudHJpZ2dlciAuY29sLWZpbHRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZmlsdGVyLW9wZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcblxyXG5cclxuICAgIC8vU1RJQ0tZIEhFQURFUlxyXG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3RpY2t5ID0gJCgnaGVhZGVyJyksXHJcbiAgICAgICAgICAgIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSxcclxuICAgICAgICAgICAgaCA9ICQod2luZG93KS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgYnR0ID0gJCgnLmJhY2stdG8tdG9wJyk7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGwgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0aWNreS5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgICAgICAgaWYgKHNjcm9sbCA+IGgpIHtcclxuICAgICAgICAgICAgICAgIGJ0dC5hZGRDbGFzcygnb24nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0aWNreS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcclxuICAgICAgICAgICAgYnR0LnJlbW92ZUNsYXNzKCdvbicpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvL0JBQ0sgVE8gVE9QXHJcbiAgICAvLyB2YXIgaHRtbCA9IFwiPGEgY2xhc3M9J2JhY2stdG8tdG9wIGgnPjxpIGNsYXNzPSdmYSBmYS1hbmdsZS11cCc+PC9pPjwvYT5cIjtcclxuICAgIC8vICQoJ2JvZHknKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAvLyAkKCcuYmFjay10by10b3AnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIC8vICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAvLyAgICAgc2Nyb2xsVG9wOiAwXHJcbiAgICAvLyAgIH0sICdzbG93Jyk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAkKCcuZm9ybS1zZWFyY2gnKS5vbignc3VibWl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG4gICAgICAgIH0sICdzbG93Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL09OIFdJTkRPVyBSRVNJWkVcclxuICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgc3RpY2t5Rm9vdGVyKCk7XHJcbiAgICAgICAgc2xpZGVyc1NtYWxsKCk7XHJcbiAgICAgICAgc2V0TUgoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy9yYXRpbmdcclxuICAgICQoJy5ib3gtcmF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICByID0gdC5maW5kKCcucmF0ZScpLFxyXG4gICAgICAgICAgICBzID0gdC5maW5kKCcuc3RhcicpO1xyXG5cclxuICAgICAgICBpZiAocy53aWR0aCgpID09IDApIHtcclxuICAgICAgICAgICAgci5odG1sKCd1bnJhdGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvL3RhYmxlXHJcbiAgICAkKCcucXVvdGUtcmVxdWVzdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBhY3QgPSB0LmZpbmQoJy50YWJsZS1hY3Rpb24nKSxcclxuICAgICAgICAgICAgY2hlY2sgPSB0LmZpbmQoJy5jaGVja2JveCcpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLFxyXG4gICAgICAgICAgICBjQWxsID0gdC5maW5kKCcjY2hlY2tBbGwnKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlKCkge1xyXG4gICAgICAgICAgICB2YXIgbiA9IHQuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKG4gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYWN0LnJlbW92ZUNsYXNzKCdzaG93bicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWN0LmFkZENsYXNzKCdzaG93bicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjQWxsLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjaGVjay5ub3QodGhpcykucHJvcCgnY2hlY2tlZCcsIHRoaXMuY2hlY2tlZCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY2hlY2suY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0b2dnbGUoKTtcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICAvL1NURVAgV0laWkFSRFxyXG4gICAgJCgnLmdldC1xdW90ZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBzdGVwV2l6eiA9ICQodGhpcykuZmluZCgnLnN0ZXAtd2l6eicpLFxyXG4gICAgICAgICAgICBzdGVwID0gc3RlcFdpenouZmluZCgnLnN0ZXAnKSxcclxuICAgICAgICAgICAgc3RlcE51bSA9IHN0ZXAuZmluZCgnLnN0ZXAtbnVtJyksXHJcbiAgICAgICAgICAgIG4gPSAwLFxyXG4gICAgICAgICAgICBzdGVwQWN0ID0gJCgnLmZvcm0tZ2V0LXF1b3RlJykuZmluZCgnLmZvcm0tYWN0aW9uJykuZmluZCgnLmJ0bicpO1xyXG5cclxuICAgICAgICBzdGVwQWN0LmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJy5nZXQtcXVvdGUnKS5vZmZzZXQoKS50b3BcclxuICAgICAgICAgICAgfSwgNDAwKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzdGVwQWN0Lm9uKCdzaG93bi5icy50YWInLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHN0ZXBXaXp6KCkge1xyXG4gICAgICAgICAgICAgICAgc3RlcC5lcShuKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBzdGVwLmVxKG4pLnJlbW92ZUNsYXNzKCdwYXNzJyk7XHJcbiAgICAgICAgICAgICAgICBzdGVwLm5vdCgnOmVxKCcgKyBuICsgJyknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXAuZXEoaSkuYWRkQ2xhc3MoJ3Bhc3MnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCgnI2dldFF1b3RlMScpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBzdGVwV2l6eigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcjZ2V0UXVvdGUyJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBuID0gMTtcclxuICAgICAgICAgICAgICAgIHN0ZXBXaXp6KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJyNnZXRRdW90ZTMnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIG4gPSAyO1xyXG4gICAgICAgICAgICAgICAgc3RlcFdpenooKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCgnI2dldFF1b3RlNCcpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgbiA9IDM7XHJcbiAgICAgICAgICAgICAgICBzdGVwV2l6eigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKCcjZ2V0UXVvdGU1JykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBuID0gNDtcclxuICAgICAgICAgICAgICAgIHN0ZXBXaXp6KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgICQoJy5mb3JtLWdldC1xdW90ZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIHZhciB2YWxpZGF0b3IgPSAkKCdmb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICAgIC8vICAgICBpZ25vcmU6IFwiOmRpc2FibGVkLCA6aGlkZGVuXCIsXHJcbiAgICAgICAgLy8gICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vICAgICAgICAgdmFyIGZnID0gJChlbGVtZW50KS5jbG9zZXN0KCcudmFsdGhpcycpO1xyXG4gICAgICAgIC8vICAgICAgICAgZXJyb3IuYXBwZW5kVG8oZmcpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAkKCdidXR0b246c3VibWl0JykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIC8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8gICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAvLyAgICAgICAgIHRhYlBhbmUgPSB0LmNsb3Nlc3QoJy50YWItcGFuZScpLFxyXG4gICAgICAgIC8vICAgICAgICAgaW5wdXQgPSB0YWJQYW5lLmZpbmQoXCI6aW5wdXRcIiksXHJcbiAgICAgICAgLy8gICAgICAgICB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgICAgaW5wdXQuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyAgICAgICAgIGlmICghdmFsaWRhdG9yLmVsZW1lbnQodGhpcykgJiYgdmFsaWQpIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIC8vRkFMU0UgRk9SIEFDVElWRSBWQUxJREFUSU9OXHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gICAgIC8vIGlmICh2YWxpZCkge1xyXG4gICAgICAgIC8vICAgICAvLyAgIHQudGFiKFwic2hvd1wiKTtcclxuICAgICAgICAvLyAgICAgLy8gfVxyXG4gICAgICAgIC8vICAgICB0b1RvcEdldFF1b3RlKCk7XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRvVG9wR2V0UXVvdGUoKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJCgnLmdldC1xdW90ZScpLm9mZnNldCgpLnRvcFxyXG4gICAgICAgICAgICB9LCA0MDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ09ORElUSU9OU1xyXG5cclxuICAgICAgICAkKCcjZ2V0UXVvdGUxJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vT04gU1RFUCAxXHJcbiAgICAgICAgICAgICQoJyNzZXJ2aWNlX3R5cGUnKS5kZXBlbmRzT24oe1xyXG4gICAgICAgICAgICAgICAgJ2lucHV0W25hbWU9XCJ0eXBlX29mX3RyYWRlXCJdJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogWydkb21lc3RpYyddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NlcnZpY2VfdHlwZScpLmZpbmQoJ3NlbGVjdCcpLmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjc2VydmljZV90eXBlJykuZmluZCgnc2VsZWN0JykucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJCgnI3R5cGVfb2Zfc2hpcG1lbnQnKS5kZXBlbmRzT24oe1xyXG4gICAgICAgICAgICAgICAgJ2lucHV0W25hbWU9XCJ0eXBlX29mX3RyYW5zcG9ydGF0aW9uXCJdJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogWydvY2VhbiddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3R5cGVfb2Zfc2hpcG1lbnQnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyN0eXBlX29mX3NoaXBtZW50JykuZmluZCgnaW5wdXQnKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoJyNpbmNvdGVybXMnKS5kZXBlbmRzT24oe1xyXG4gICAgICAgICAgICAgICAgJ2lucHV0W25hbWU9XCJ0eXBlX29mX3RyYWRlXCJdJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogWydleHBvcnQnLCAnaW1wb3J0J11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjaW5jb3Rlcm1zJykuZmluZCgnc2VsZWN0JykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNpbmNvdGVybXMnKS5maW5kKCdzZWxlY3QnKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdG90cmFkZSA9ICcnO1xyXG4gICAgICAgIHZhciB0b3RyYW5zID0gJyc7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNla0ZvckluY29udGVybXMoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmNvdGVybXMgPSAkKCcjaW5jb3Rlcm1zJykuZmluZCgnc2VsZWN0JyksXHJcbiAgICAgICAgICAgICAgICBvcHQgPSAnPG9wdGlvbiAnLFxyXG4gICAgICAgICAgICAgICAgb3B0cyA9ICc8b3B0aW9uIHNlbGVjdGVkICcsXHJcbiAgICAgICAgICAgICAgICBvcHQyID0gJzwvb3B0aW9uPicsXHJcbiAgICAgICAgICAgICAgICBleHcgPSBvcHQgKyAndmFsdWU9XCJFWFdcIj5FWFcnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGZjYSA9IG9wdCArICd2YWx1ZT1cIkZDQVwiID5GQ0EnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGZhcyA9IG9wdCArICd2YWx1ZT1cIkZBU1wiID5GQVMnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGZvYiA9IG9wdCArICd2YWx1ZT1cIkZPQlwiID5GT0InICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGNmciA9IG9wdCArICd2YWx1ZT1cIkNGUlwiID5DRlInICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGNpZiA9IG9wdCArICd2YWx1ZT1cIkNJRlwiID5DSUYnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGNwdCA9IG9wdCArICd2YWx1ZT1cIkNQVFwiID5DUFQnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGNpcCA9IG9wdCArICd2YWx1ZT1cIkNJUFwiID5DSVAnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGRhdCA9IG9wdCArICd2YWx1ZT1cIkRBVFwiID5EQVQnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGRhcCA9IG9wdCArICd2YWx1ZT1cIkRBUFwiID5EQVAnICsgb3B0MixcclxuICAgICAgICAgICAgICAgIGRkcCA9IG9wdCArICd2YWx1ZT1cIkREUFwiID5ERFAnICsgb3B0MjtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICQoJyNpbmNvdGVybXMnKS5maW5kKCdzZWxlY3QnKS5kYXRhKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT0gJ2V4dycpIGV4dyA9IG9wdHMgKyAndmFsdWU9XCJFWFdcIj5FWFcnICsgb3B0MjtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCA9PSAnZmNhJykgZmNhID0gb3B0cyArICd2YWx1ZT1cIkZDQVwiPkZDQScgKyBvcHQyO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkID09ICdmYXMnKSBmYXMgPSBvcHRzICsgJ3ZhbHVlPVwiRkFTXCI+RkFTJyArIG9wdDI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT0gJ2ZvYicpIGZvYiA9IG9wdHMgKyAndmFsdWU9XCJGT0JcIj5GT0InICsgb3B0MjtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCA9PSAnY2ZyJykgY2ZyID0gb3B0cyArICd2YWx1ZT1cIkNGUlwiPkNGUicgKyBvcHQyO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkID09ICdjaWYnKSBjaWYgPSBvcHRzICsgJ3ZhbHVlPVwiQ0lGXCI+Q0lGJyArIG9wdDI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT0gJ2NwdCcpIGNwdCA9IG9wdHMgKyAndmFsdWU9XCJDUFRcIj5DUFQnICsgb3B0MjtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCA9PSAnY2lwJykgY2lwID0gb3B0cyArICd2YWx1ZT1cIkNJUFwiPkNJUCcgKyBvcHQyO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkID09ICdkYXQnKSBkYXQgPSBvcHRzICsgJ3ZhbHVlPVwiREFUXCI+REFUJyArIG9wdDI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgPT0gJ2RhcCcpIGRhcCA9IG9wdHMgKyAndmFsdWU9XCJEQVBcIj5EQVAnICsgb3B0MjtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCA9PSAnZGRwJykgZGRwID0gb3B0cyArICd2YWx1ZT1cIkREUFwiPkREUCcgKyBvcHQyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodG90cmFkZSA9PSAnZXhwb3J0JyAmJiB0b3RyYW5zID09ICdvY2VhbicpIHtcclxuICAgICAgICAgICAgICAgIGluY290ZXJtcy5maW5kKCdvcHRpb24nKS5yZW1vdmUoKS5lbmQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoZmNhICsgZmFzICsgZm9iICsgY2ZyICsgY2lmICsgZGF0ICsgZGFwICsgZGRwKTtcclxuICAgICAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodG90cmFkZSA9PSAnZXhwb3J0JyAmJiB0b3RyYW5zID09ICdhaXInKSB7XHJcbiAgICAgICAgICAgICAgICBpbmNvdGVybXMuZmluZCgnb3B0aW9uJykucmVtb3ZlKCkuZW5kKClcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKGZjYSArIGNwdCArIGNpcCArIGRhdCArIGRhcCArIGRkcCk7XHJcbiAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRvdHJhZGUgPT0gJ2ltcG9ydCcgJiYgdG90cmFucyA9PSAnb2NlYW4nKSB7XHJcbiAgICAgICAgICAgICAgICBpbmNvdGVybXMuZmluZCgnb3B0aW9uJykucmVtb3ZlKCkuZW5kKClcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKGV4dyArIGZjYSArIGZhcyArIGZvYiArIGNmciArIGNpZiArIGRhdCArIGRhcCk7XHJcbiAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRvdHJhZGUgPT0gJ2ltcG9ydCcgJiYgdG90cmFucyA9PSAnYWlyJykge1xyXG4gICAgICAgICAgICAgICAgaW5jb3Rlcm1zLmZpbmQoJ29wdGlvbicpLnJlbW92ZSgpLmVuZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChleHcgKyBmY2EgKyBjcHQgKyBjaXAgKyBkYXQgKyBkYXApO1xyXG4gICAgICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJyN0eXBlX29mX3RyYWRlJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgdmFsID0gJCh0aGlzKS5maW5kKCcuYWN0aXZlJykuZmluZCgnaW5wdXQnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRvdHJhZGUgPSB2YWw7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdUb3RyYWRlID0gJyArIHRvdHJhZGUpXHJcbiAgICAgICAgICAgIGlucHV0LmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRvdHJhZGUgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgY2VrRm9ySW5jb250ZXJtcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RvdHJhZGUgJyt0b3RyYWRlKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjdHlwZV9vZl90cmFuc3BvcnRhdGlvbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9ICQodGhpcykuZmluZCgnaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgIHZhbCA9ICQodGhpcykuZmluZCgnLmFjdGl2ZScpLmZpbmQoJ2lucHV0JykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICB0b3RyYW5zID0gdmFsO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVG90cmFucyA9ICcgKyB0b3RyYW5zKVxyXG4gICAgICAgICAgICBpbnB1dC5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RyYW5zID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIGNla0ZvckluY29udGVybXMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b3RyYW5zICcrdG90cmFucylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBjZWtGb3JJbmNvbnRlcm1zKCk7XHJcblxyXG5cclxuICAgICAgICAkKCcjZ2V0UXVvdGUzJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICQoJyNzaGlwbWVudF92YWx1ZScpLmRlcGVuZHNPbih7XHJcbiAgICAgICAgICAgICAgICAnaW5wdXRbbmFtZT1cImluc3VyYW5jZVwiXSc6IHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjc2hpcG1lbnRfdmFsdWUnKS5maW5kKCdzZWxlY3QnKS5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNzaGlwbWVudF92YWx1ZScpLmZpbmQoJ2lucHV0JykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNzaGlwbWVudF92YWx1ZScpLmZpbmQoJ3NlbGVjdCcpLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NoaXBtZW50X3ZhbHVlJykuZmluZCgnaW5wdXQnKS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJzaGlwbWVudF92YWx1ZVwiXScpLmRlcGVuZHNPbih7XHJcbiAgICAgICAgICAgICAgICAnaW5wdXRbbmFtZT1cImluc3VyYW5jZVwiXSc6IHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmZvcm0tYWN0aW9uJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2hlY2sgPSAkKCdpbnB1dFtuYW1lPVwiYWdyZWVcIl0nKTtcclxuICAgICAgICBpZiAoY2hlY2subGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgJCgnYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0nKS5kZXBlbmRzT24oe1xyXG4gICAgICAgICAgICAgICAgJ2lucHV0W25hbWU9XCJhZ3JlZVwiXSc6IHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy9PRkZJQ0VcclxuICAgICQoJy5vZmZpY2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgYWRkID0gdC5wYXJlbnQoKS5maW5kKCcuYnRuLWFkZC1icmFuY2gnKSxcclxuICAgICAgICAgICAgZGVsID0gdC5maW5kKCcuYnRuLWRlbCcpLFxyXG4gICAgICAgICAgICBpdGVtID0gdC5maW5kKCcub2ZmaWNlLWl0ZW0nKSxcclxuICAgICAgICAgICAgYmMgPSB0LmZpbmQoJyNicmFuY2hDb3VudCcpLFxyXG4gICAgICAgICAgICBuID0gYmMudmFsKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJpbmQob2JqKSB7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJCgnLm9mZmljZS1pdGVtOmxhc3QtY2hpbGQnKS5vZmZzZXQoKS50b3AgLSAxMDBcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdHBpY2tlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdzZWxlY3QtY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogNVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcub2ZmaWNlLWl0ZW0nKS5tYXRjaEhlaWdodCgpO1xyXG4gICAgICAgICAgICAkKFwiYm9keVwiKS5maW5kKCcudGNvbnRhY3QgaW5wdXQnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCAhPSA4ICYmIGUud2hpY2ggIT0gMCAmJiBlLndoaWNoICE9IDQzICYmIChlLndoaWNoIDwgNDggfHwgZS53aGljaCA+IDU3KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZU9yZGVyKCkge1xyXG4gICAgICAgICAgICB2YXIgcm9UZW1wID0gMDtcclxuICAgICAgICAgICAgJChcImJvZHlcIikuZmluZCgnLm9mZmljZS1pdGVtJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0Om5vdCguYnMtc2VhcmNoYm94IGlucHV0KScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCdfJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUgKyAnXycgKyByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignZGF0YS1ubycsIHJvVGVtcCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3NlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCdfJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUgKyAnXycgKyByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBkYXRhID0gJCh0aGlzKS5hdHRyKCdkYXRhLW5vJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZignXycpKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2RhdGEtbm8nLCByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd0ZXh0YXJlYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCdfJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUgKyAnXycgKyByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcm9UZW1wKys7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVvcmRlcicpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2Rlc3Ryb3knKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBpdGVtLmVxKDApLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGh0bWwgPSBmb3JtYXQuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgICAgIGh0bWwuZmluZCgnLnRpdGxlJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykudGV4dCgnQnJhbmNoIE9mZmljZScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaHRtbC5maW5kKCdpbnB1dCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3ZhbHVlJywgJycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaHRtbC5maW5kKCd0ZXh0YXJlYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3ZhbHVlJywgJycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaHRtbC5maW5kKCcubmNsb25lJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBodG1sLnByZXBlbmQoJzxidXR0b24gY2xhc3M9XCJidG4tZGVsXCI+ZGVsZXRlPC9idXR0b24+Jyk7XHJcblxyXG4gICAgICAgICAgICB0LmFwcGVuZChodG1sLmZhZGVJbigpKTtcclxuXHJcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgMTAwXHJcbiAgICAgICAgICAgIGJpbmQoaHRtbCk7XHJcbiAgICAgICAgICAgIGJjLnZhbChuKTtcclxuICAgICAgICAgICAgcmVPcmRlcigpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKCdjbGljaycsICcuYnRuLWRlbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5vZmZpY2UtaXRlbScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBuLS07XHJcbiAgICAgICAgICAgIGJjLnZhbChuKTtcclxuICAgICAgICAgICAgcmVPcmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgLy9DQVJHT1xyXG4gICAgJCgnLmNhcmdvLXdyYXAnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgYm94ID0gdC5maW5kKCcuYm94LWNhcmdvJyksXHJcbiAgICAgICAgICAgIGFkZCA9IHQuZmluZCgnLmFkZC1jYXJnbycpLFxyXG4gICAgICAgICAgICBkZWwgPSB0LmZpbmQoJy5kZWwtY2FyZ28nKSxcclxuICAgICAgICAgICAgaXRlbSA9IHQuZmluZCgnLmNhcmdvJyksXHJcbiAgICAgICAgICAgIGJjID0gdC5maW5kKCcjY2FyZ29jb3VudCcpLFxyXG4gICAgICAgICAgICBuID0gMTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmluZChvYmopIHtcclxuICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdHBpY2tlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdzZWxlY3QtY29udHJvbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogNVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZSgpIHtcclxuXHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmZpbmQoJy5jYXJnbycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ID0gdC5maW5kKCcud2VpZ2h0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gdC5maW5kKCcubGVuZ3RoJyksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSB0LmZpbmQoJy53aWR0aCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IHQuZmluZCgnLmhlaWdodCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIHF0eSA9IHQuZmluZCgnLnF0eScpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRXZWlnaHQgPSB0LmZpbmQoJy50V2VpZ2h0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgdFZvbHVtZSA9IHQuZmluZCgnLnRWb2x1bWUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0b3RhbFdlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9uID0gd2VpZ2h0LnZhbCgpICogcXR5LnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvbiA9IHRvbiAvIDEwMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvbiAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRXZWlnaHQudmFsKHRvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFdlaWdodC52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0b3RhbFZvbHVtZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbTMgPSBsZW5ndGgudmFsKCkgKiB3aWR0aC52YWwoKSAqIGhlaWdodC52YWwoKSAqIHF0eS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBtMyA9IG0zIC8gMTAwMDAwMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobTMgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0Vm9sdW1lLnZhbChtMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdFZvbHVtZS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHQua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxXZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBsZW5ndGgua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxWb2x1bWUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB3aWR0aC5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFZvbHVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGhlaWdodC5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFZvbHVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHF0eS5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFdlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsVm9sdW1lKClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxjdWxhdGUoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVPcmRlcigpIHtcclxuICAgICAgICAgICAgdmFyIHJvVGVtcCA9IDA7XHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmZpbmQoJy5jYXJnbycpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCdfJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUgKyAnXycgKyByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3NlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCdfJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5hbWUgKyAnXycgKyByb1RlbXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3RleHRhcmVhJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmluZGV4T2YoJ18nKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCduYW1lJywgbmFtZSArICdfJyArIHJvVGVtcCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByb1RlbXArKztcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZW9yZGVyJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmVEZWwoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5maW5kKCcuZGVsLWNhcmdvJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2Rlc3Ryb3knKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSBpdGVtLmVxKDApLmNsb25lKCksXHJcbiAgICAgICAgICAgIGh0bWwgPSBmb3JtYXQuY2xvbmUoKTtcclxuXHJcbiAgICAgICAgICAgIGh0bWwuZmluZCgnaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCd2YWx1ZScsICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGh0bWwuZmluZCgndGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCd2YWx1ZScsICcnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBodG1sLnByZXBlbmQoJzxidXR0b24gY2xhc3M9XCJkZWwtY2FyZ29cIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IGRlbGV0ZTwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgICBodG1sLmZpbmQoJ3RleHRhcmVhJykudmFsKCcnKTtcclxuICAgICAgICAgICAgYm94LmFwcGVuZChodG1sLmZhZGVJbigpKTtcclxuICAgICAgICAgICAgYWN0aXZlRGVsKCk7XHJcblxyXG4gICAgICAgICAgICBiaW5kKGh0bWwpO1xyXG4gICAgICAgICAgICBiYy52YWwobik7XHJcbiAgICAgICAgICAgIHJlT3JkZXIoKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbignY2xpY2snLCAnLmRlbC1jYXJnbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5jYXJnbycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBuLS07XHJcbiAgICAgICAgICAgIGJjLnZhbChuKTtcclxuICAgICAgICAgICAgcmVPcmRlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pXHJcblxyXG4gICAgJCgnLndvcmstbGlzdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChcImJvZHlcIikub24oJ2NsaWNrJywgJy5kZWwtYnRuJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLml0ZW0nKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnLmR0cGNrcicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICB0b2RheSA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSlcclxuXHJcbiAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgLy8gZGF5c09mV2Vla0Rpc2FibGVkOiBbMF0sXHJcbiAgICAgICAgICAgIGZvcm1hdDogJ2RkIE0geXl5eScsXHJcbiAgICAgICAgICAgIGF1dG9jbG9zZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3RhcnREYXRlOiB0b2RheVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCcuZHRwY2tyMicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgLy8gZGF5c09mV2Vla0Rpc2FibGVkOiBbMF0sXHJcbiAgICAgICAgICAgIGZvcm1hdDogJ2RkL21tL3l5eXknLFxyXG4gICAgICAgICAgICBhdXRvY2xvc2U6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAkKCdmb3JtJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc3VibWl0ID0gJCh0aGlzKS5maW5kKCcuYnRuLXByaW1hcnknKTtcclxuICAgICAgICBzdWJtaXQuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJCgnZm9ybScpLm9mZnNldCgpLnRvcCAtIDEwMFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICAkKCcubW9kYWwnKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogMFxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnI2ZybWFkZHdob3VzZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHN1Ym1pdCA9ICQodGhpcykuZmluZCgnLmJ0bi1wcmltYXJ5Jyk7XHJcbiAgICAgICAgc3VibWl0LmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKCdmb3JtJykub2Zmc2V0KCkudG9wIC0gMTAwXHJcbiAgICAgICAgICAgIH0sIDMwMClcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyAkKCcuZm9ybS1sb2dpbicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgdmFyIHQgPSAkKHRoaXMpLFxyXG4gICAgLy8gICAgICAgICBiID0gdC5maW5kKCdidXR0b246c3VibWl0Jyk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGIuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgICAgICQoJy5yaWdodCcpLmFuaW1hdGUoe1xyXG4gICAgLy8gICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXHJcbiAgICAvLyAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vIH0pXHJcbiAgICAkKFwiLm51bS1vbmx5XCIpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoZS53aGljaCAhPSA4ICYmIGUud2hpY2ggIT0gMCAmJiBlLndoaWNoICE9IDQzICYmIChlLndoaWNoIDwgNDggfHwgZS53aGljaCA+IDU3KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcImJvZHlcIikuZmluZCgnLnRjb250YWN0IGlucHV0Jykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmIChlLndoaWNoICE9IDggJiYgZS53aGljaCAhPSAwICYmIGUud2hpY2ggIT0gNDMgJiYgKGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJCgnLnVwZ3JhZGUnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgYnV0dG9uID0gdC5maW5kKCcuY29uZmlybS1hZ2FpbicpLFxyXG4gICAgICAgICAgICBjaGtCb3ggPSB0LmZpbmQoJy5jaGVjay1jb25maXJtLWFnYWluJyk7XHJcblxyXG4gICAgICAgIC8vIGJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICBjaGtCb3guY2hhbmdlKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBidXR0b24udG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgIXRoaXMuY2hlY2tlZClcclxuICAgICAgICB9KS5jaGFuZ2UoKTtcclxuICAgIH0pXHJcblxyXG5cclxuICAgICQoJy53b3JrLWgnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB2YXIgbnMgPSAkKHRoaXMpLmZpbmQoJ2lucHV0W25hbWU9XCJub25zdG9wXCJdJyk7XHJcbiAgICAgICAgaWYgKG5zLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhcycpXHJcbiAgICAgICAgICAgICQoJ3NlbGVjdFtuYW1lPVwic3RhcnRIXCJdJykuZGVwZW5kc09uKHtcclxuICAgICAgICAgICAgICAgICdpbnB1dFtuYW1lPVwibm9uc3RvcFwiXSc6IHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBoaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnc2VsZWN0LnNlbGVjdCcpLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCdzZWxlY3RbbmFtZT1cImVuZEhcIl0nKS5kZXBlbmRzT24oe1xyXG4gICAgICAgICAgICAgICAgJ2lucHV0W25hbWU9XCJub25zdG9wXCJdJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGhpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJwb3BvdmVyXCJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy90aGUgJ2lzJyBmb3IgYnV0dG9ucyB0aGF0IHRyaWdnZXIgcG9wdXBzXHJcbiAgICAgICAgICAgIC8vdGhlICdoYXMnIGZvciBpY29ucyB3aXRoaW4gYSBidXR0b24gdGhhdCB0cmlnZ2VycyBhIHBvcHVwXHJcbiAgICAgICAgICAgIGlmICghJCh0aGlzKS5pcyhlLnRhcmdldCkgJiYgJCh0aGlzKS5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCAmJiAkKCcucG9wb3ZlcicpLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBvcG92ZXIoJ2hpZGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnLmlucHV0LXRhZycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBmZyA9ICQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKSxcclxuICAgICAgICAgICAgYnQgPSBmZy5maW5kKCcuYm94LXRhZycpLFxyXG4gICAgICAgICAgICB0ZyA9IGZnLmZpbmQoJ3NwYW4udGFnJyksXHJcbiAgICAgICAgICAgIG1heCA9ICQodGhpcykuZGF0YSgnbWF4LW9wdGlvbnMnKSxcclxuICAgICAgICAgICAgbiA9IHRnLmxlbmd0aCxcclxuICAgICAgICAgICAgZHYgPSAkKHRoaXMpLmRhdGEoJ3ZhbCcpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGFnczogXCIrbik7XHJcblxyXG4gICAgICAgIGlmIChtYXggPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG1heCA9IDEwMDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVWYWwoKSB7XHJcbiAgICAgICAgICAgIHZhciB2MSA9ICQoJ2JvZHknKS5maW5kKCcuaW5wdXQtdGFnJykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5maW5kKCcudGFnJykuZXEoMCkuZGF0YSgndmFsdWUnKTtcclxuICAgICAgICAgICAgdmFyIHYyID0gJCgnYm9keScpLmZpbmQoJy5pbnB1dC10YWcnKS5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLmZpbmQoJy50YWcnKS5lcSgxKS5kYXRhKCd2YWx1ZScpO1xyXG4gICAgICAgICAgICB2YXIgdjMgPSAkKCdib2R5JykuZmluZCgnLmlucHV0LXRhZycpLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJykuZmluZCgnLnRhZycpLmVxKDIpLmRhdGEoJ3ZhbHVlJyk7XHJcbiAgICAgICAgICAgIHZhciB2NCA9ICQoJ2JvZHknKS5maW5kKCcuaW5wdXQtdGFnJykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5maW5kKCcudGFnJykuZXEoMykuZGF0YSgndmFsdWUnKTtcclxuICAgICAgICAgICAgdmFyIHY1ID0gJCgnYm9keScpLmZpbmQoJy5pbnB1dC10YWcnKS5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLmZpbmQoJy50YWcnKS5lcSg0KS5kYXRhKCd2YWx1ZScpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdjEgKyAnLCcgKyB2MiArICcsJyArIHYzICsgJywnICsgdjQgKyAnLCcgKyB2NTtcclxuICAgICAgICAgICAgdmFyIHZhbDIgPSB2YWwucmVwbGFjZSgvXFwsdW5kZWZpbmVkL2csICcnKTtcclxuICAgICAgICAgICAgLy8gdmFsMiA9IHZhbDI9PXVuZGlmaW5lZD9cIlwiOnZhbDI7XHJcbiAgICAgICAgICAgIHQuYXR0cignZGF0YS12YWwnLCB2YWwyKTtcclxuICAgICAgICAgICAgaWYgKHZhbDIgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHQuYXR0cignZGF0YS12YWwnLCAnJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWwyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIC8vIHZhciBrZXl3b3JkID0gJCgnI2tleXdvcmQnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDQ0KSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPSBcIlwiICYmIG4gPCBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBidC5hcHBlbmQoJzxzcGFuIGNsYXNzPVwidGFnXCIgZGF0YS12YWx1ZT1cIicgKyB2YWwgKyAnXCI+JyArIHZhbCArICc8aSBjbGFzcz1cInJlbW92ZVwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9XCJcIiBkYXRhLW9yaWdpbmFsLXRpdGxlPVwiUmVtb3ZlXCI+w5c8L2k+PC9zcGFuPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVWYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy50YWcgLnJlbW92ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBuLS07XHJcbiAgICAgICAgICAgIHVwZGF0ZVZhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5ydXBpYWggPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdiA9ICQodGhpcykudmFsKCkuc3BsaXQoJy4nKS5qb2luKCcnKSxcclxuICAgICAgICAgICAgICAgIGYgPSB2LnJlcGxhY2UoLyhcXGQpKD89KFxcZFxcZFxcZCkrKD8hXFxkKSkvZywgXCIkMS5cIik7XHJcblxyXG4gICAgICAgICAgICAkKHRoaXMpLnZhbChmKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgICQoJy5jdXJyZW5jeScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5rZXl1cChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5ydXBpYWgoKTtcclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQoJy5mb3JtLWxvZ2luJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgJCgnI2lfYW1fYScpLmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpLmNoYW5nZShmdW5jdGlvbigpeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZigkKCcjaWFtYTInKS5pcygnOmNoZWNrZWQnKSkgeyBcclxuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiaXQncyBjaGVja2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2NvbXBhbnlfbmFtZScpLnByb3AoJ3JlcXVpcmVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhbGVydChcIml0J3MgdW5jaGVja2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2NvbXBhbnlfbmFtZScpLnByb3AoJ3JlcXVpcmVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzbGlkZXJNZCgpO1xyXG4gICAgc2xpZGVyc1NtYWxsKCk7XHJcbiAgICBzZXRNSCgpO1xyXG4gICAgc3RpY2t5Rm9vdGVyKCk7XHJcbiAgICBtdWx0aXNlbGVjdCgpO1xyXG4gICAgdmlld1F1b3RlKCk7XHJcbiAgICBtdWx0aXBsaWVyKCk7XHJcbiAgICBtdWx0aXBsaWVyV29ySG91cnMoKTtcclxuXHJcbn0pOy8vIEVORCBPRiBkb2N1bWVudCBSRUFEWVxyXG5cclxuZnVuY3Rpb24gc2V0UHJvdmlkZXIoKXtcclxuICAgIHZhciB0ID0gJCgnI3Byb3ZpZGVyQ2hlY2snKSxcclxuICAgICAgICBjaGVja2JveGVzID0gdC5maW5kKFwiaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKSxcclxuICAgICAgICBkYXRhID0gJCgnI2RhdGFDaGVjaycpLnZhbCgpLFxyXG4gICAgICAgIHNldCAgPSB0LmZpbmQoXCJpbnB1dFtuYW1lPSdcIitkYXRhK1wiJ11cIik7XHJcblxyXG4gICAgc2V0LnByb3AoXCJjaGVja2VkXCIsIHRydWUpO1xyXG4gICAgc2V0LnBhcmVudHMoXCJsaVwiKS5hZGRDbGFzcygnc2hvd2VkJyk7ICAgIFxyXG4gICAgJCgnI21vZGFsV2FybmluZycpLm1vZGFsKCdoaWRlJyk7XHJcblxyXG59XHJcblxyXG4kKCcjcHJvdmlkZXJDaGVjaycpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgIHZhciB0ID0gJCh0aGlzKTtcclxuICAgIHZhciBjaGVja2JveGVzID0gdC5maW5kKFwiaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKSxcclxuICAgICAgICBjaGVja3AgPSB0LmZpbmQoXCJpbnB1dFtuYW1lPSdwcm92aWRlcnMnXVwiKSxcclxuICAgICAgICBjaGVja3cgPSB0LmZpbmQoXCJpbnB1dFtuYW1lPSd3YXJlaG91c2UnXVwiKSxcclxuICAgICAgICBjaGVja3QgPSB0LmZpbmQoXCJpbnB1dFtuYW1lPSd0cnVja2luZyddXCIpLFxyXG4gICAgICAgIGNoZWNrZiA9IHQuZmluZChcImlucHV0W25hbWU9J2ZyZWlndGhfcmF0ZSddXCIpLFxyXG4gICAgICAgIGVyciA9IHQuZmluZChcIi5jYi1lcnJvclwiKTtcclxuIFxyXG4gICAgY2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGNiID0gJCh0aGlzKTtcclxuICAgICAgICBjYi5jbGljayhmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCBjYi5pcyhcIjpjaGVja2VkXCIpICkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2IucGFyZW50cyhcImxpXCIpLmFkZENsYXNzKCdzaG93ZWQnKTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkKCcjbW9kYWxXYXJuaW5nJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICQoJyNkYXRhQ2hlY2snKS52YWwoZGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYi5wYXJlbnRzKFwibGlcIikucmVtb3ZlQ2xhc3MoJ3Nob3dlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hlY2t0LmlzKFwiOmNoZWNrZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICQoJyNmcmVpZ2h0UmF0ZScpLmZhZGVJbigpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICQoJyNmcmVpZ2h0UmF0ZScpLmZhZGVPdXQoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoY2hlY2t0LmlzKFwiOmNoZWNrZWRcIikpIHtcclxuICAgICAgICAgICAgJCgnI2ZyZWlnaHRSYXRlJykuZmFkZUluKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQoJyNmcmVpZ2h0UmF0ZScpLmZhZGVPdXQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIC8vIGNoZWNrYm94ZXMuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gY2hlY2tib3hlcy5hdHRyKFwicmVxdWlyZWRcIiwgIWNoZWNrYm94ZXMuaXMoXCI6Y2hlY2tlZFwiKSk7XHJcbiAgICAgICAgLy8gaWYgKGNoZWNrcC5pcyhcIjpjaGVja2VkXCIpKSB7XHJcbiAgICAgICAgLy8gICAgIGNoZWNrcC5wYXJlbnRzKFwibGlcIikuYWRkQ2xhc3MoJ3Nob3dlZCcpO1xyXG4gICAgICAgIC8vIH1lbHNle1xyXG4gICAgICAgIC8vICAgICAgY2hlY2twLnBhcmVudHMoXCJsaVwiKS5yZW1vdmVDbGFzcygnc2hvd2VkJyk7XHJcbiAgICAgICAgLy8gfTtcclxuICAgICAgICAvLyBpZiAoY2hlY2t3LmlzKFwiOmNoZWNrZWRcIikpIHtcclxuICAgICAgICAvLyAgICAgY2hlY2t3LnBhcmVudHMoXCJsaVwiKS5hZGRDbGFzcygnc2hvd2VkJyk7XHJcbiAgICAgICAgLy8gfWVsc2V7XHJcbiAgICAgICAgLy8gICAgICBjaGVja3cucGFyZW50cyhcImxpXCIpLnJlbW92ZUNsYXNzKCdzaG93ZWQnKTtcclxuICAgICAgICAvLyB9O1xyXG4gICAgICAgIC8vIGlmIChjaGVja3QuaXMoXCI6Y2hlY2tlZFwiKSkge1xyXG4gICAgICAgIC8vICAgICBjaGVja3QucGFyZW50cyhcImxpXCIpLmFkZENsYXNzKCdzaG93ZWQnKTtcclxuICAgICAgICAvLyB9ZWxzZXtcclxuICAgICAgICAvLyAgICAgIGNoZWNrdC5wYXJlbnRzKFwibGlcIikucmVtb3ZlQ2xhc3MoJ3Nob3dlZCcpO1xyXG4gICAgICAgIC8vIH07XHJcbiAgICAgICAgLy8gaWYgKGNoZWNrZi5pcyhcIjpjaGVja2VkXCIpKSB7XHJcbiAgICAgICAgLy8gICAgIGNoZWNrZi5wYXJlbnRzKFwibGlcIikuYWRkQ2xhc3MoJ3Nob3dlZCcpO1xyXG4gICAgICAgIC8vIH1lbHNle1xyXG4gICAgICAgIC8vICAgICAgY2hlY2tmLnBhcmVudHMoXCJsaVwiKS5yZW1vdmVDbGFzcygnc2hvd2VkJyk7XHJcbiAgICAgICAgLy8gfTtcclxuICAgIC8vIH0pO1xyXG4gICAgY2hlY2tib3hlcy5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCFjaGVja3AuaXMoXCI6Y2hlY2tlZFwiKSAmJiAhY2hlY2t3LmlzKFwiOmNoZWNrZWRcIikgJiYgIWNoZWNrdC5pcyhcIjpjaGVja2VkXCIpKSB7XHJcbiAgICAgICAgICAgIGVyci5mYWRlSW4oKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZXJyLmZhZGVPdXQoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSlcclxuICAgIGNvbnNvbGUubG9nKCk7XHJcblxyXG59KVxyXG5cclxuZnVuY3Rpb24gc2xpZGVyR2FsKCkge1xyXG4gIC8vIHJlZmVyZW5jZSBmb3IgbWFpbiBpdGVtc1xyXG4gIHZhciBzbGlkZXIgPSAkKCcuZ2FsbC1iaWctaW1nJyk7XHJcbiAgLy8gcmVmZXJlbmNlIGZvciB0aHVtYm5haWwgaXRlbXNcclxuICB2YXIgdGh1bWJuYWlsU2xpZGVyID0gJCgnLmdhbGxlcnktc2xpZGVyJyk7XHJcbiAgLy90cmFuc2l0aW9uIHRpbWUgaW4gbXNcclxuICB2YXIgZHVyYXRpb24gPSA1MDA7XHJcblxyXG4gIHRodW1ibmFpbFNsaWRlci5hZGRDbGFzcygnb3dsLWNhcm91c2VsJyk7XHJcbiAgc2xpZGVyLmFkZENsYXNzKCdvd2wtY2Fyb3VzZWwnKTtcclxuXHJcbiAgLy8gY2Fyb3VzZWwgZnVuY3Rpb24gZm9yIG1haW4gc2xpZGVyXHJcbiAgc2xpZGVyLm93bENhcm91c2VsKHtcclxuICAgbG9vcDpmYWxzZSxcclxuICAgbmF2VGV4dDogW1wiPGkgY2xhc3M9J2ZhIGZhLWFuZ2xlLWxlZnQnPjwvaT5cIixcIjxpIGNsYXNzPSdmYSBmYS1hbmdsZS1yaWdodCc+PC9pPlwiXSxcclxuICAgbmF2OnRydWUsXHJcbiAgIGRvdHM6IGZhbHNlLFxyXG4gICBpdGVtczoxXHJcbiAgfSkub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24gKGUpIHtcclxuICAgLy9PbiBjaGFuZ2Ugb2YgbWFpbiBpdGVtIHRvIHRyaWdnZXIgdGh1bWJuYWlsIGl0ZW1cclxuICAgdGh1bWJuYWlsU2xpZGVyLnRyaWdnZXIoJ3RvLm93bC5jYXJvdXNlbCcsIFtlLml0ZW0uaW5kZXgsIGR1cmF0aW9uLCB0cnVlXSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNhcm91c2VsIGZ1bmN0aW9uIGZvciB0aHVtYm5haWwgc2xpZGVyXHJcbiAgdGh1bWJuYWlsU2xpZGVyLm93bENhcm91c2VsKHtcclxuICAgbG9vcDpmYWxzZSxcclxuICAgY2VudGVyOiB0cnVlLCAvL3RvIGRpc3BsYXkgdGhlIHRodW1ibmFpbCBpdGVtIGluIGNlbnRlclxyXG4gICBpdGVtczogOSxcclxuICAgZG90czogZmFsc2UsXHJcbiAgIG1hcmdpbjogMTAsXHJcbiAgfSkub24oJ2NsaWNrJywgJy5vd2wtaXRlbScsIGZ1bmN0aW9uICgpIHtcclxuICAgLy8gT24gY2xpY2sgb2YgdGh1bWJuYWlsIGl0ZW1zIHRvIHRyaWdnZXIgc2FtZSBtYWluIGl0ZW1cclxuICAgc2xpZGVyLnRyaWdnZXIoJ3RvLm93bC5jYXJvdXNlbCcsIFskKHRoaXMpLmluZGV4KCksIGR1cmF0aW9uLCB0cnVlXSk7XHJcbiAgICQoJy5vd2wtaXRlbScpLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XHJcbiAgICQodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcclxuICB9KS5vbignY2hhbmdlZC5vd2wuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAvLyBPbiBjaGFuZ2Ugb2YgdGh1bWJuYWlsIGl0ZW0gdG8gdHJpZ2dlciBtYWluIGl0ZW1cclxuICAgc2xpZGVyLnRyaWdnZXIoJ3RvLm93bC5jYXJvdXNlbCcsIFtlLml0ZW0uaW5kZXgsIGR1cmF0aW9uLCB0cnVlXSk7XHJcbiAgfSk7XHJcbiAgICQoJy5nYWxsZXJ5LXNsaWRlciAub3dsLWl0ZW0nKS5lcSgwKS5hZGRDbGFzcygnY3VycmVudCcpO1xyXG5cclxuXHJcbiAgLy9UaGVzZSB0d28gYXJlIG5hdmlnYXRpb24gZm9yIG1haW4gaXRlbXNcclxuICAkKCcuc2xpZGVyLWxlZnQnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAgc2xpZGVyLnRyaWdnZXIoJ25leHQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAkKCcuZ2FsbGVyeS1zbGlkZXIgLm93bC1pdGVtLmN1cnJlbnQnKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xyXG4gICAgICAgJCgnLmdhbGxlcnktc2xpZGVyIC5vd2wtaXRlbScpLmFkZENsYXNzKCdjdXJyZW50Jyk7XHJcbiAgIH0pO1xyXG4gIH0pO1xyXG4gICQoJy5zbGlkZXItbGVmdCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICBzbGlkZXIudHJpZ2dlcigncHJldi5vd2wuY2Fyb3VzZWwnKTtcclxuICAgJCgnLmdhbGxlcnktc2xpZGVyIC5vd2wtaXRlbS5jdXJyZW50JykucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcclxuICAgJCgnLmdhbGxlcnktc2xpZGVyIC5vd2wtaXRlbScpLmFkZENsYXNzKCdjdXJyZW50Jyk7XHJcbiAgfSk7XHJcbn1zbGlkZXJHYWwoKTtcclxuXHJcblxyXG4kKCcjZnJtYWRkd2hvdXNlJykuZWFjaChmdW5jdGlvbigpIHtcclxuICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgaWdub3JlOiBcIjpkaXNhYmxlZCwgOmhpZGRlblwiLFxyXG4gICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge1xyXG4gICAgICAgICB2YXIgZmcgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJyk7XHJcbiAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZmcpO1xyXG4gICAgIH1cclxuICAgfSk7XHJcbiB9KTtcclxuXHJcbiQoJyNmY2hwc3dkJykuZWFjaChmdW5jdGlvbigpIHtcclxuICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgaWdub3JlOiBcIjpkaXNhYmxlZCwgOmhpZGRlblwiLFxyXG4gICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge1xyXG4gICAgICAgICB2YXIgY2IgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5jaGVja2JveCcpO1xyXG4gICAgICAgIGVycm9yLmluc2VydEFmdGVyKGNiKTtcclxuICAgICAgICBlcnJvci5hZGRDbGFzcygnY2ItZXJyb3InKTtcclxuICAgICB9XHJcbiAgIH0pO1xyXG4gfSk7XHJcblxyXG5cclxuJCgnLmJveC1sb2NhdGlvbicpLmVhY2goZnVuY3Rpb24oKXtcclxuICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgIEwgPSB0LmZpbmQoJy5sb2NhdGlvbicpLFxyXG4gICAgICBtb3JlID0gdC5maW5kKCcubW9yZScpO1xyXG5cclxuICB2YXIgY291bnQgPSBMLmxlbmd0aDtcclxuICBjb25zb2xlLmxvZyhjb3VudCk7XHJcbiAgaWYoY291bnQgPiAzKXtcclxuICAgICAgZm9yICh2YXIgaSA9IDM7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICBMLmVxKGkpLmFkZENsYXNzKCdmYWRlJyk7XHJcbiAgICAgICAgICBtb3JlLnNob3coKTtcclxuICAgICAgfVxyXG4gIH1cclxuICBtb3JlLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgIEwudG9nZ2xlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2luJyk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGJveExvY2F0aW9uKCl7XHJcbiAgICAkKCcuYm94LWxvY2F0aW9uJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgICBMID0gdC5maW5kKCcubG9jYXRpb24nKSxcclxuICAgICAgICAgIG1vcmUgPSB0LmZpbmQoJy5tb3JlJyk7XHJcblxyXG4gICAgICB2YXIgY291bnQgPSBMLmxlbmd0aDtcclxuICAgICAgY29uc29sZS5sb2coY291bnQpO1xyXG4gICAgICBpZihjb3VudCA+IDMpe1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDM7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgTC5lcShpKS5hZGRDbGFzcygnZmFkZScpO1xyXG4gICAgICAgICAgICAgIG1vcmUuc2hvdygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIG1vcmUuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgIEwudG9nZ2xlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpbicpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbiQoJy5mcmVpZ2h0LXJhdGUnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgICAgaXRlbSA9IHQuZmluZCgnLml0ZW0nKTtcclxuXHJcbiAgICBpdGVtLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICQodGhpcykuZmluZCgnLmNvbGxhcHNlJykuY29sbGFwc2UoJ3RvZ2dsZScpO1xyXG4gICAgfSlcclxuXHJcbn0pXHJcblxyXG5cclxuLy8gU2hvdyBtb3JlIGRlc2NyaXB0aW9uXHJcblxyXG4vLyAkKCcuYm94LXdyYXAtdGV4dCcpLmVhY2goZnVuY3Rpb24oKXtcclxuLy8gICAgIHZhciB0ID0gJCh0aGlzKSxcclxuLy8gICAgICAgICBoID0gdC5vdXRlckhlaWdodCgpO1xyXG5cclxuLy8gICAgIGlmKGggPiAxNDApe1xyXG4vLyAgICAgICAgIHQuYWRkQ2xhc3MoJ2xlc3MnKTtcclxuLy8gICAgICAgICB0LmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJzLW1vcmVcIj48aT5TaG93IG1vcmU8L2k+PGk+U2hvdyBsZXNzPC9pPjwvc3Bhbj4nKVxyXG4vLyAgICAgfVxyXG4vLyAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuYm94LXdyYXAtdGV4dCAucy1tb3JlJywgZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICB0LnRvZ2dsZUNsYXNzKCdsZXNzJyk7XHJcbi8vICAgICB9KTtcclxuLy8gfSk7XHJcblxyXG4kKCcuYm94LXdyYXAtdGV4dCcpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICQodGhpcykuYmluZCgnbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgc2Nyb2xsVG8gPSBudWxsO1xyXG5cclxuICAgICAgICBpZihlLnR5cGUgPT0gJ21vdXNld2hlZWwnKSB7XHJcbiAgICAgICAgICAgIHNjcm9sbFRvID0gKGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhICogLTAuMjApO1xyXG4gICAgICAgIH1lbHNlIGlmKGUudHlwZSA9ICdET01Nb3VzZVNjcm9sbCcpIHtcclxuICAgICAgICAgICAgc2Nyb2xsVG8gPSAoZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgKiAtMC4yMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNjcm9sbFRvKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5zY3JvbGxUb3Aoc2Nyb2xsVG8gKyAkKHRoaXMpLnNjcm9sbFRvcCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4vLyBNdWx0aXBsZSBVcGxvYWQgaW1hZ2VcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCwgZmFsc2UpO1xyXG4gIHZhciBBdHRhY2htZW50QXJyYXkgPSBbXTtcclxuICB2YXIgYXJyQ291bnRlciA9IDA7XHJcbiAgdmFyIGZpbGVzQ291bnRlckFsZXJ0U3RhdHVzID0gZmFsc2U7XHJcblxyXG4gIHZhciB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHVsLmNsYXNzTmFtZSA9IChcInRodW1iLUltYWdlc1wiKTtcclxuICB1bC5pZCA9IFwiaW1nTGlzdFwiO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2hfZ2FsbGVyeScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUZpbGVTZWxlY3QsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRmlsZVNlbGVjdChlKSB7XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5maWxlcykgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGY7IGYgPSBmaWxlc1tpXTsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbiAocmVhZGVyRXZ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBSZW5kZXJUaHVtYm5haWwoZSwgcmVhZGVyRXZ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgRmlsbEF0dGFjaG1lbnRBcnJheShlLCByZWFkZXJFdnQpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KShmKTtcclxuICAgICAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2hfZ2FsbGVyeScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUZpbGVTZWxlY3QsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvL1RvIGNoZWNrIGZpbGVzIGNvdW50IGFjY29yZGluZyB0byB1cGxvYWQgY29uZGl0aW9uc1xyXG4gICAgZnVuY3Rpb24gQ2hlY2tGaWxlc0NvdW50KEF0dGFjaG1lbnRBcnJheSkge1xyXG4gICAgICAgIHZhciBsZW4gPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQXR0YWNobWVudEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChBdHRhY2htZW50QXJyYXlbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGVuKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9UbyBjaGVjayB0aGUgbGVuZ3RoIGRvZXMgbm90IGV4Y2VlZCAxMCBmaWxlcyBtYXhpbXVtXHJcbiAgICAgICAgaWYgKGxlbiA+IDkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9SZW5kZXIgYXR0YWNobWVudHMgdGh1bWJuYWlscy5cclxuICAgIGZ1bmN0aW9uIFJlbmRlclRodW1ibmFpbChlLCByZWFkZXJFdnQpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGkuY2xhc3NOYW1lID0gKFwiY29sLXNtLTRcIik7XHJcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIGxpLmlubmVySFRNTCA9IFsnPGRpdiBjbGFzcz1cImJveC1pbWdcIj4gPGEgY2xhc3M9XCJidG4tZGVsXCIgaHJlZj1cIiNcIj5EZWxldGU8L2E+JyArXHJcbiAgICAgICAgICAgICc8YSBjbGFzcz1cImltZ1wiIGhyZWY9XCIjXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKVwiIGRhdGEtbGl0eT48L2E+J1xyXG4gICAgICAgICAgICsgJzwvZGl2PiddLmpvaW4oJycpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdGaWxlbGlzdCcpLmluc2VydEJlZm9yZSh1bCwgbnVsbCk7XHJcbiAgICB9XHJcblxyXG5cclxuJCgnLmhhcy1zdWInKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgdCA9ICQodGhpcyk7XHJcblxyXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNSkge1xyXG4gICAgICAgIHQuZmluZCgnPiBhJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==

//# sourceMappingURL=main.js.map
