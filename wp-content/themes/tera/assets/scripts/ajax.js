/**
 * Created by Toshiba on 27/07/2017.
 */
jQuery(".btn.btn-link.del-btn.btn-att").click(function () {
    var divatt = $(this).closest('.upload-file'),
        att_del = divatt.find('.att_del');
    att_del.val('1');
});

jQuery(".oincoterm").click(function (e) {
    e.preventDefault();
    var incoterms = jQuery("#incotermsModal");
    incoterms.modal('show');
});

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function reset_country() {
    var country_select = $("select.popcountry"),
        state_select = $("select.popstate"),
        state_select_parent = state_select.closest('.sparent'),
        state_input = $("input.popstate");

    country_select.val('').selectpicker('refresh');
    state_select_parent.hide();
    state_select.html('').prop('disabled', true).hide().selectpicker('refresh');
    state_input.prop('disabled', false).show();
}

function reset_form_addwhouse(form, is_reset) {
    if (is_reset) {
        var dparent = $(form).closest('div'),
            dalert = dparent.find('.alert');
        dalert.remove();
    }

    reset_country();
    $.each($(form).find('input:text'), function (x, y) {
        $(y).val('');
    });
    $.each($(form).find('input:checkbox'), function (x, y) {
        $(y).prop('checked', false);
        $(y).closest('.btn').removeClass("active");
    });

    $.each($(form).find('textarea'), function (x, y) {
        $(y).val('');
    });

    var box_gallery = $(form).find('.box-gallery'),
        upwrapper = box_gallery.find('div.upload-file'),
        span_preview = upwrapper.find('span.image-preview'),
        rimgs = box_gallery.find('.rimgs');
    upwrapper.removeClass("has-file");
    span_preview.removeAttr("style");
    rimgs.html('');
}

function populate_country(country, is_loop, no) {
    // if (country === '') return false;
    var state_select = $("select.popstate"),
        state_selected = state_select.attr("data-selected"),
        state_select_parent = state_select.closest('.sparent'),
        state_input = $("input.popstate");
    if (is_loop) {
        state_select = $("select.popstate[data-no=" + no + "]");
        state_selected = state_select.attr("data-selected");
        state_select_parent = state_select.closest('.sparent');
        state_input = $("input.popstate[data-no=" + no + "]");
    }

    // console.log('populating');
    if (!country) {
        state_select_parent.hide();
        state_select.prop('disabled', true).hide();
        state_select.selectpicker('refresh');
        state_input.prop('disabled', false).show().val('');
    } else {

        // console.log(state_selected);
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'ajax_states',
                'country': country
            },
            dataType: 'json',
            success: function (data) {
                state_select.html();
                if (data.is_error) {
                    state_select.prop('disabled', true).hide();
                    state_select_parent.hide();
                    state_input.prop('disabled', false).show();
                } else {
                    state_input.prop('disabled', true).hide();
                    state_select.prop('disabled', false).show();
                    state_select_parent.show();
                    var select_value = '',
                        ns = false;
                    state_select.html('');
                    $.each(data.items, function (x, y) {
                        console.log(y);
                        var selectedelm = state_selected === y[0] ? "selected " : "",
                            html = $("<option " + selectedelm + "value=\"" + y[0] + "\">" + y[0] + "</option>");
                        if (selectedelm === "selected ") {
                            ns = true;
                        }
                        state_select.append(html);
                        // state_select.selectpicker('refresh');
                    });

                }
                setTimeout(function () {
                    state_select.selectpicker('refresh');
                }, 250)
                if (!ns) {
                    state_select.val('').selectpicker('refresh');
                    console.log('mboh')
                }
            }
        })
    }
}

function update_transaction(name, status) {
    $.ajax({
        url: my_ajax_object.ajax_url,
        type: 'GET',
        data: {
            'action': 'fpy',
            'trname': name,
            'status': status
        },
        dataType: 'json',
        success: function (data) {
            if (!data.is_error) {
                location.href = data.callback;
            }
        }
    });
}

jQuery(document).ready(function () {

    var browseproviders = jQuery("ul#menu-main_nav .bp"),
        bpa = browseproviders.find('a');
    //get browse pages
    $.ajax({
        url: my_ajax_object.ajax_url,
        type: 'GET',
        data: {
            'action': 'browse_links'
        },
        dataType: 'json',
        success: function (data) {
            if (!data.is_error) {
                var bpul = "<ul class=\"sub-menu has-img\">";
                jQuery.each(data.items, function (l, o) {
                    bpul += "<li>\n" +
                        "\t\t\t\t\t\t<a href=\"" + o.link + "\" class=\"box-img\">\n" +
                        "\t\t\t\t\t\t\t<div class=\"img\">\n" +
                        "\t\t\t\t\t\t\t\t<img src=\"" + o.icon + "\">\n" +
                        "\t\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t\t</a>\n" +
                        "\t\t\t\t\t\t<div class=\"content\">\n" +
                        "\t\t\t\t\t\t\t<a href=\"" + o.link + "\">" + o.caption + "</a>\n" +
                        o.desc +
                        "\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t</li>";
                });
                bpul += "</ul>";
                browseproviders.addClass("has-sub");
                bpa.after(bpul);
            }
        }
    });


    var parent_warehouse = jQuery("#forwarder-ware");
    if (parent_warehouse.length) {
        var wid = parent_warehouse.attr("data-wid");
        reload_whouse(wid);
    }

    var parent_trucking = jQuery("#forwarder-truck");
    if (parent_trucking.length) {
        var trfid = parent_trucking.attr("data-tid");
        reload_truck(trfid);
    }
    //Delete reply
    jQuery('body').on('click', '.btn.btn-link.btn-sm.btn-del-reply', function (e) {
        e.preventDefault();
        var me = jQuery(this),
            me_rid = me.attr("data-rid"),
            parentme = me.closest('.item'),
            breply = parentme.find('.box-reply');

        parentme.addClass('loading');
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'delete_reply',
                'rid': me_rid
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    breply.html('<a class="btn btn-primary btnsreply" href="#" data-cid="' + data.callback['cid'] + '" data-u="' + data.callback['author'] + '" data-add="' + data.callback['addr'] + '">Reply Review</a>');
                    parentme.removeClass('loading');
                }
            }
        });
    });

    //Klik edit reply review
    jQuery('body').on('click', '.btn.btn-primary.btn-sm.btn-ed-rep', function (e) {
        e.preventDefault();
        var me = jQuery(this),
            me_rid = me.attr('data-rid'),
            me_cid = me.attr('data-cid'),
            me_u = me.attr('data-u'),
            me_add = me.attr('data-add'),
            me_reply = me.closest('.reply'),
            me_reply_left = me_reply.find('.reply-left'),
            me_msg = me_reply_left.find('p').html(),
            modalreply = jQuery("#replyreviewModal"),
            m_header = modalreply.find('.modal-header'),
            h_name = m_header.find('h3'),
            h_add = m_header.find('span'),
            rid = modalreply.find('input[name=rid]'),
            cid = modalreply.find('input[name=cid]'),
            msg = modalreply.find('textarea[name=msg]');

        msg.val(me_msg);
        rid.val(me_rid);
        cid.val(me_cid);
        h_name.html(me_u);
        h_add.html(me_add);
        modalreply.modal('show');
    });

    jQuery('body').on('click', '.btn.btn-primary.btnsreply', function (e) {
        e.preventDefault();
        var me = jQuery(this),
            me_cid = me.attr('data-cid'),
            me_u = me.attr('data-u'),
            me_add = me.attr('data-add'),
            modalreply = jQuery("#replyreviewModal"),
            m_header = modalreply.find('.modal-header'),
            h_name = m_header.find('h3'),
            h_add = m_header.find('span'),
            rid = modalreply.find('input[name=rid]'),
            cid = modalreply.find('input[name=cid]'),
            msg = modalreply.find('textarea[name=msg]');

        msg.val('');
        rid.val('');
        cid.val(me_cid);
        h_name.html(me_u);
        h_add.html(me_add);
        modalreply.modal('show');
    })

    jQuery(".frm_reply_review").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {
            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            var data = $(form).serializeArray(),
                btn = $(form).find('.btn.btn-primary'),
                btn_ori = btn.html();
            btn.html('Submitting...').addClass('disabled');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'reply_review',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    var modalreply = jQuery("#replyreviewModal");
                    btn.html(btn_ori).removeClass('disabled');
                    if (!data.is_error) {
                        var pitem = jQuery('.item.c' + data.callback['cid']),
                            box_reply = pitem.find('.box-reply'),
                            waiting_icon = '';
                        if (data.callback['waiting']) {
                            if (!pitem.hasClass('waiting')) {
                                pitem.addClass('waiting');
                            }
                            waiting_icon = '<span class="waiting-icon">\n' +
                                '<i class="fa fa-clock-o" data-toggle="tooltip" data-placement="top" title="Waiting for approval"></i>\n' +
                                '</span>';
                        } else {
                            if (pitem.hasClass('waiting')) {
                                pitem.removeClass('waiting');
                            }
                        }
                        if (data.callback['new']) {
                            box_reply.html('<div class="reply">\n' +
                                waiting_icon +
                                '<div class="reply-left">\n' +
                                '<p>' + data.callback['msg'] + '</p>\n' +
                                '<a class="box-img" href="#">\n' +
                                '<div class="img" style="background-image: url(' + data.callback['logo_url'] + ')"></div>\n' +
                                '</a>\n' +
                                '<div class="box-sellerreplyinfo">\n' +
                                '<span class="info">' + data.callback['name'] + '<i>' + data.callback['date'] + '</i></span>\n' +
                                '</div>\n' +
                                '</div>\n' +
                                '<div class="item-action">\n' +
                                '<a class="btn btn-primary btn-sm btn-ed-rep" href="#" data-cid="' + data.callback['cid'] + '" data-rid="' + data.callback['rid'] + '" data-u="' + data.callback['author'] + '" data-add="' + data.callback['addr'] + '">Edit</a>\n' +
                                '<a class="btn btn-link btn-sm btn-del-reply" data-rid="' + data.callback['rid'] + '" href="#">Delete</a>\n' +
                                '</div>\n' +
                                '</div>');
                        } else {
                            box_reply.find('.reply').prepend(waiting_icon);
                            box_reply.find('.reply-left').find('p').html(data.callback['msg'])
                        }
                        modalreply.modal('hide');
                    }
                }
            })
        }
    })

    if (jQuery("#frmaddwhouse").length) {
        setTimeout(function () {
            reset_form_addwhouse();
        }, 500)
    }
    if (jQuery("#frm_ca").length) {
        setTimeout(function () {
            reset_country();
        }, 1000)
    }
    //forwarder dashboard
    var ulli = $("#menu-edit_profile");
    if (ulli.length) {
        jQuery.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'disp_clasfrm'
            },
            dataType: 'json',
            success: function (data) {
                var is_forw = data.items.is_forwarder,
                    is_ware = data.items.is_warehouse,
                    is_tr = data.items.is_trucking;

                var lieditaccount = ulli.find("li.eaccount"),
                    liforwarders = ulli.find("li.forw"),
                    liwarehouses = ulli.find("li.ware"),
                    litruckings = ulli.find("li.tr"),
                    forw_checked = is_forw ? "checked" : "",
                    forw_disp = !is_forw ? "style=\"display:none;\"" : "",
                    ware_checked = is_ware ? "checked" : "",
                    ware_disp = !is_ware ? "style=\"display:none;\"" : "",
                    tr_checked = is_tr ? "checked" : "",
                    tr_disp = !is_tr ? "style=\"display:none;\"" : "";

                var providerselectorhtml = "<li class=\"providers-menu\"><a>Provider Classification</a>";

                providerselectorhtml += "<ul class=\"form-group\" id=\"providerCheck\">";

                //start li forwarder
                providerselectorhtml += "<li class=\"liforwarder\">\n" +
                    "<div class=\"checkbox\">\n" +
                    "<input type=\"checkbox\" name=\"pr\" value='1' required " + forw_checked + "><span>Forwarder</span>\n" +
                    "</div>";
                //start sub forwarder
                providerselectorhtml += "<ul id=\"sub-providers\">";
                $.each($(liforwarders), function (k, l) {
                    providerselectorhtml += "<li " + forw_disp + ">";
                    providerselectorhtml += $(l).html();
                    providerselectorhtml += "</li>";
                });
                providerselectorhtml += "</ul>"; //end sub forwarder
                providerselectorhtml += "</li>"; //end li forwarder

                //start li warehouse
                providerselectorhtml += "<li class=\"liwarehouse\">\n" +
                    "<div class=\"checkbox\">\n" +
                    "<input type=\"checkbox\" name=\"pr\" value='2' required " + ware_checked + "><span>Warehouse</span>\n" +
                    "</div>";
                //start sub warehouse
                providerselectorhtml += "<ul>";
                $.each($(liwarehouses), function (m, n) {
                    providerselectorhtml += "<li " + ware_disp + ">";
                    providerselectorhtml += $(n).html();
                    providerselectorhtml += "</li>";
                });
                providerselectorhtml += "</ul>"; //end sub warehouse
                providerselectorhtml += "</li>"; //end li warehouse

                //start li trucking
                providerselectorhtml += "<li class=\"litrucking\">\n" +
                    "<div class=\"checkbox\">\n" +
                    "<input type=\"checkbox\" name=\"pr\" value='3' required " + tr_checked + "><span>Trucking</span>\n" +
                    "</div>";
                //start sub trucking
                providerselectorhtml += "<ul>";
                $.each($(litruckings), function (m, n) {
                    providerselectorhtml += "<li " + tr_disp + ">";
                    providerselectorhtml += $(n).html();
                    providerselectorhtml += "</li>";
                });
                providerselectorhtml += "</ul>"; //end sub trucking
                providerselectorhtml += "</li>"; //end li trucking

                liforwarders.hide();
                liwarehouses.hide();
                litruckings.hide();
                $(providerselectorhtml).insertAfter(lieditaccount);
            }
        })
    }

    var frmgs1 = $("#gs1"),
        frmgs2 = $("#gs2");
    var sel1 = frmgs1.find('select'),
        sel2 = frmgs2.find('select');
    $.each(sel1, function (x, y) {
        $(y).val('').selectpicker('refresh');
    });
    $.each(sel2, function (x, y) {
        $(y).val('').selectpicker('refresh');
    });

    var sincoterm = $("select[name=incoterms]"),
        sincoterm_def = sincoterm.attr('data-selected');
    if (sincoterm_def === null || sincoterm_def === undefined || sincoterm_def === '') {
        sincoterm.val('').selectpicker('refresh');
    }

    var forwarderswrapper = jQuery("#forwarderswrapper"),
        warehouseswrapper = jQuery("#warehouseswrapper"),
        truckingswrapper = jQuery("#truckingswrapper");

    $("a.mod-conf").click(function () {
        var modal_quote_payment_confirmation = $("#quoteconfirmationModal"),
            modal_quote_transfer_bank = $("#bankTransfer");
        modal_quote_transfer_bank.modal('hide');
        setTimeout(function () {
            modal_quote_payment_confirmation.find('.modal-close').remove();
            modal_quote_payment_confirmation.modal('show');
        }, 500);
    });

    jQuery("#quotepaymentconfirm").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var ifields = $(form).find('input[type=text]', 'textarea', 'select'),
                btn = $(form).find('.btn-submit'),
                snotice = $("#snotice"),
                formdata = false;

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');

            if (window.FormData) {
                formdata = new FormData();
            }
            var logo_data = $("#logo");

            $.each($(logo_data), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('logos[' + j + ']', file);
                })
            });

            // our AJAX identifier
            formdata.append('action', 'quopaycon');
            formdata.append('ino', jQuery('input[name=ino]').val());
            formdata.append('bac', jQuery('select[name=bac]').val());
            formdata.append('ana', jQuery('input[name=ana]').val());
            formdata.append('ta', jQuery('input[name=ta]').val());
            formdata.append('dot', jQuery('input[name=dot]').val());
            formdata.append('cnote', jQuery('textarea[name=cnote]').val());

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Submit');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        ifields.val('');
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    }
                }
            })
        }
    });

    //Populated country & states
    var popcountry = $("select.popcountry");

    if (popcountry.length) {
        if (!forwarderswrapper.length && !warehouseswrapper.length) {
            $.each(popcountry, function () {
                var me = $(this),
                    data_no = me.attr('data-no'),
                    is_loop = !!data_no,
                    my_value = me.val();
                populate_country(my_value, is_loop, data_no);
            });
        }
    }

    $('body').on('change', 'select.popcountry', function () {
        var me = $(this),
            data_no = me.attr('data-no'),
            is_loop = !!data_no,
            my_value = me.val();
        // console.log(is_loop)
        // console.log(data_no)
        populate_country(my_value, is_loop, data_no);
    });


    var isBusy = false,
        instantReloadLogin = false;

    jQuery(document).ready(function () {
        jQuery("time.timeago").timeago();

        //load forwarders for the first time
        if (forwarderswrapper.length) {
            reset_country();
            setTimeout(function () {
                browse_forwarders(curr_page, false);
            }, 500)
        }
        if (warehouseswrapper.length) {
            reset_country();
            setTimeout(function () {
                browse_warehouses(curr_page, false)
            }, 500)
        }
        if (truckingswrapper.length) {
            reset_country();
            setTimeout(function () {
                browse_truckings(curr_page, false)
            }, 500)
        }
    });

    $('#fgqts').keypress(function (event) {
        if (event.which === '13') {
            event.preventDefault();
        }
    });

    function alert_wrapper(a_content, a_title, a_class, a_dismissable) {
        var result = "<div class=\"alert alert-" + a_class + "\">";
        result += a_dismissable ? "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>" : "";
        result += a_title ? "<strong>" + a_title + "</strong> " + a_content : a_content;
        result += "</div>";
        return result;
    }

    var bf = jQuery("#p_30"),
        bd = jQuery("body");

    var curr_page = $("input[name=curr_page]").val() ? $("input[name=curr_page]").val() : 1;

    function browse_forwarders(page, is_paging, no_reload) {
        if (!no_reload) {
            $("html, body").animate({
                scrollTop: 0
            }, 'slow');
        }

        setTimeout(function () {
            var mainform = jQuery("#seforw"),
                qorderby = jQuery("ul.forw.side-menu.sort-by li.active a").attr("data-o"),
                qsearch = mainform.find("[name=fn]").val(),
                qcountry = mainform.find("[name=fc]").val(),
                qprovince = mainform.find("[name=fp]:enabled").val(),
                arr_most_cargo = [],
                arr_most_service = [],
                arr_most_target = [],
                elmmost_cargo = mainform.find('select[name=fmc]').val(),
                elmmost_service = mainform.find('select[name=fms]').val(),
                elmmost_target = mainform.find('select[name=fsd]').val();
            arr_most_cargo = elmmost_cargo;
            arr_most_service = elmmost_service;
            arr_most_target = elmmost_target;

            console.log(qprovince);
            console.log(qcountry);

            var shortby = bf.find("ul.forw.side-menu.sort-by"),
                fw = bf.find("#forwarderswrapper"),
                fwload = fw.closest('.forwarders'),
                wlm = $("#forwarderspagination");

            shortby.find('li.' + qorderby).addClass('active');

            // alert(qprovince);

            fwload.addClass("loading");
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'GET',
                data: {
                    'action': 'uforwarders',
                    'p': page,
                    'ob': qorderby,
                    's': qsearch,
                    'c': qcountry,
                    'pr': qprovince,
                    'mc': arr_most_cargo,
                    'ms': arr_most_service,
                    'sd': arr_most_target
                },
                dataType: 'json',
                success: function (data) {
                    wlm.html(data.other);

                    if (data.is_error) {
                        fw.html("<div class=\"item\"><p align=\"center\">" + data.message + "</p></div>")
                    } else {
                        var fi = '';
                        $.each(data.items, function (x, y) {
                            fi += "<div class=\"item\">";
                            fi += "<div class=\"left-cont\">";
                            fi += y.logo;
                            fi += "</div>";
                            fi += "<div class=\"mid-cont\">";
                            fi += "<div class=\"heading\">";
                            fi += "<h4>";
                            fi += "<a href=\"" + y.link + "\">" + y.display + "</a>";
                            fi += y.verified;
                            fi += "</h4>";
                            fi += "</div>";
                            fi += "<div class=\"box-rate\">" + y.rate_p + "</div>";
                            fi += "<div class=\"box-location\">" + y.addresses_html + "<a href=\"#\" class=\"more\">\n" +
                                "<span>Show more</span>\n" +
                                "<span>Show less</span>\n" +
                                "</a></div>";
                            fi += "</div>";
                            fi += "<div class=\"item-action\">";
                            fi += "<a class=\"btn btn-primary btn-sm\" href=\"" + y.link + "\">Browse profile</a>";
                            fi += "<a class=\"btn btn-link btn-sm btn-bfrev\" data-title=\"" + y.display + "\" data-addr=\"" + y.short_address + "\" data-fid=\"" + y.id + "\" href=\"#\">Write a review</a>";
                            fi += "</div>";
                            fi += "</div>";
                        });
                        if (is_paging) {
                            fw.append(fi);
                        } else {
                            fw.html(fi);
                        }
                    }
                    fwload.removeClass("loading");
                    boxLocation();

                    $('.stickyme').each(function () {
                        simpleStickySidebar('.stickyme-inner', {
                            container: '.stickyme',
                            topSpace: 70,
                            bottomSpace: 30
                        });
                    })
                }
            })
        }, 1000)
    }

    function browse_warehouses(page, is_paging, no_reload) {
        if (!no_reload) {
            $("html, body").animate({
                scrollTop: 0
            }, 'slow');
        }

        setTimeout(function () {
            var mainform = jQuery("#sewhouse"),
                qorderby = jQuery("ul.whouse.side-menu.sort-by li.active a").attr("data-o"),
                qname = mainform.find("[name=wn]").val(),
                qcountry = mainform.find("[name=wc]").val(),
                qprovince = mainform.find("[name=wp]:enabled").val(),
                arr_temperature_controlled = [],
                arr_storage_type = [],
                elmtemperature_controlled = mainform.find('select[name=wtc]').val(),
                elmstorage_type = mainform.find('select[name=wst]').val();

            arr_temperature_controlled = elmtemperature_controlled;
            arr_storage_type = elmstorage_type;

            console.log(qprovince);
            console.log(qcountry);

            var shortby = bd.find("ul.whouse.side-menu.sort-by"),
                fw = bd.find("#warehouseswrapper"),
                fwload = bd.closest('.forwarders'),
                wlm = $("#warehousespagination");

            shortby.find('li.' + qorderby).addClass('active');

            fwload.addClass("loading");
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'GET',
                data: {
                    'action': 'uwarehouses',
                    'p': page,
                    'ob': qorderby,
                    'n': qname,
                    'c': qcountry,
                    'pr': qprovince,
                    'tc': arr_temperature_controlled,
                    'st': arr_storage_type
                },
                dataType: 'json',
                success: function (data) {
                    wlm.html(data.other);

                    if (data.is_error) {
                        fw.html("<div class=\"item\"><p align=\"center\">" + data.message + "</p></div>")
                    } else {
                        var fi = '';
                        $.each(data.items, function (x, y) {
                            fi += "<div class=\"item\">";
                            fi += "<div class=\"left-cont\">";
                            fi += y.logo;
                            fi += "</div>";
                            fi += "<div class=\"mid-cont\">";
                            fi += "<div class=\"heading\">";
                            fi += "<h4>";
                            fi += "<a href=\"" + y.link + "\">" + y.display + "</a>";
                            fi += y.verified;
                            fi += "</h4>";
                            fi += "</div>";
                            fi += "<div class=\"box-rate\">" + y.rate_p + "</div>";
                            fi += "<div class=\"box-location\">" + y.addresses_html + "<a href=\"#\" class=\"more\">\n" +
                                "<span>Show more</span>\n" +
                                "<span>Show less</span>\n" +
                                "</a></div>";
                            fi += "</div>";
                            fi += "<div class=\"item-action\">";
                            fi += "<a class=\"btn btn-primary btn-sm\" href=\"" + y.link + "\">Browse profile</a>";
                            fi += "<a class=\"btn btn-link btn-sm btn-bfrev\" data-title=\"" + y.display + "\" data-addr=\"" + y.short_address + "\" data-fid=\"" + y.fid + "\" href=\"#\">Write a review</a>";
                            fi += "</div>";
                            fi += "</div>";
                        });
                        if (is_paging) {
                            fw.append(fi);
                        } else {
                            fw.html(fi);
                        }
                    }
                    fwload.removeClass("loading");

                    $('.stickyme').each(function () {
                        simpleStickySidebar('.stickyme-inner', {
                            container: '.stickyme',
                            topSpace: 70,
                            bottomSpace: 30
                        });
                    })
                }
            })
        }, 1000)
    }

    function browse_truckings(page, is_paging, no_reload) {
        if (!no_reload) {
            $("html, body").animate({
                scrollTop: 0
            }, 'slow');
        }

        setTimeout(function () {
            var mainform = jQuery("#setruck"),
                qorderby = jQuery("ul.truck.side-menu.sort-by li.active a").attr("data-o"),
                qname = mainform.find("[name=tn]").val(),
                qcountry = mainform.find("[name=tc]").val(),
                qprovince = mainform.find("[name=tp]:enabled").val(),
                qtype = mainform.find('[name=ttype]').val(),
                qclass = mainform.find('[name=tclass]').val();

            console.log(qprovince);
            console.log(qcountry);

            var shortby = bd.find("ul.truck.side-menu.sort-by"),
                fw = bd.find("#truckingswrapper"),
                fwload = bd.closest('.forwarders'),
                wlm = $("#truckingspagination");

            shortby.find('li.' + qorderby).addClass('active');

            fwload.addClass("loading");
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'GET',
                data: {
                    'action': 'utruckings',
                    'p': page,
                    'ob': qorderby,
                    'n': qname,
                    'c': qcountry,
                    'pr': qprovince,
                    'type': qtype,
                    'class': qclass
                },
                dataType: 'json',
                success: function (data) {
                    wlm.html(data.other);

                    if (data.is_error) {
                        fw.html("<div class=\"item\"><p align=\"center\">" + data.message + "</p></div>")
                    } else {
                        var fi = '';
                        $.each(data.items, function (x, y) {
                            fi += "<div class=\"item\">";
                            fi += "<div class=\"left-cont\">";
                            fi += y.logo;
                            fi += "</div>";
                            fi += "<div class=\"mid-cont\">";
                            fi += "<div class=\"heading\">";
                            fi += "<h4>";
                            fi += "<a href=\"" + y.link + "\">" + y.display + "</a>";
                            fi += y.verified;
                            fi += "</h4>";
                            fi += "</div>";
                            fi += "<div class=\"box-rate\">" + y.rate_p + "</div>";
                            fi += "<div class=\"box-location\">" + y.addresses_html + "<a href=\"#\" class=\"more\">\n" +
                                "<span>Show more</span>\n" +
                                "<span>Show less</span>\n" +
                                "</a></div>";
                            fi += "</div>";
                            fi += "<div class=\"item-action\">";
                            fi += "<a class=\"btn btn-primary btn-sm\" href=\"" + y.link + "\">Browse profile</a>";
                            fi += "<a class=\"btn btn-link btn-sm btn-bfrev\" data-title=\"" + y.display + "\" data-addr=\"" + y.short_address + "\" data-fid=\"" + y.fid + "\" href=\"#\">Write a review</a>";
                            fi += "</div>";
                            fi += "</div>";
                        });
                        if (is_paging) {
                            fw.append(fi);
                        } else {
                            fw.html(fi);
                        }
                    }
                    fwload.removeClass("loading");

                    $('.stickyme').each(function () {
                        simpleStickySidebar('.stickyme-inner', {
                            container: '.stickyme',
                            topSpace: 70,
                            bottomSpace: 30
                        });
                    })
                }
            })
        }, 1000)
    }


    //reload whouse
    function reload_whouse(wid) {
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'mywarehouses',
                'wid': wid
            },
            dataType: 'json',
            success: function (data) {
                var paneId = $("#forwarder-ware"),
                    outer_parent = paneId.find('.outer_parent');
                outer_parent.html('');

                setTimeout(function () {
                    if (data.items.length > 0) {
                        var new_elm = "<div class=\"box-warehouse\">\n" +
                            "<p>Total warehouse: " + data.other + "</p>\n" +
                            "<div class=\"slider top-dot\" data-dot=\"yes\">";
                        $.each(data.items, function (p, q) {
                            // console.log(q.id);
                            new_elm += "<div class=\"box-img\">\n" +
                                "<a class=\"img ware-det\" id=\"w" + q.id + "_tab\" href=\"#w" + q.id + "\" style=\"background-image: url(" + q.logo_url + ")\" data-toggle=\"tab\"></a>\n" +
                                "<a href=\"#warehouse-details\" class=\"content\" data-toggle=\"tab\">\n" +
                                "<div class=\"row\">\n" +
                                "<div class=\"col-md-6\">\n" +
                                "<h4>" + q.display + "</h4>" +
                                "<p>" + q.address + "</p>\n" +
                                "</div>\n" +
                                "<div class=\"col-md-6\">\n" +
                                "<p>Total Ground Space <span>" + q.space.total_ground_space + " m<sup>2</sup></span></p>\n" +
                                q.space.storage_html +
                                "</div>\n" +
                                "</div>\n" +
                                "</a>\n" +
                                "</div>";

                            var wdetnemwlm = "<div class=\"col-md-12\">\n" +
                                "                                                <div class=\"box-warehouse\">\n" +
                                "                                                    <div class=\"clearfix mb30\">\n" +
                                q.back_html +
                                "</div>\n" +
                                "<h3 class=\"det-title\">" + q.display + "</h3>" +
                                "                                                    <!--                                                    <h3 class=\"det-title\">Warehouse 1</h3>-->\n" +
                                "                                                    <div class=\"details\">\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-1 col-s-2\"><h5>Country</h5></div>\n" +
                                "                                                            <div class=\"col-3 col-s-2\">" + q.country + "</div>\n" +
                                "                                                        </div>\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-1 col-s-2\"><h5>Province</h5></div>\n" +
                                "                                                            <div class=\"col-3 col-s-2\">" + q.province + "</div>\n" +
                                "                                                        </div>\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-1 col-s-2\"><h5>City</h5></div>\n" +
                                "                                                            <div class=\"col-3 col-s-2\">" + q.city + "</div>\n" +
                                "                                                        </div>\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-1 col-s-2\"><h5>Street address</h5></div>\n" +
                                "                                                            <div class=\"col-3 col-s-2\">" + q.only_address + "</div>\n" +
                                "                                                        </div>\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-1 col-s-2\"><h5>Description</h5></div>\n" +
                                "                                                            <div class=\"col-3 col-s-2\">" + q.description + "</div>\n" +
                                "                                                        </div>\n" +
                                "                                                    </div>\n" +
                                "                                                    <h4 class=\"title gtitle\">Space</h4>\n" +
                                "                                                    <div class=\"details bordered\">\n" +
                                "                                                        <div class=\"wh-spec\">\n" +
                                "                                                            <div class=\"drow\">\n" +
                                "                                                                <div class=\"col-2 col-s-2\">\n" +
                                "                                                                    <h5>Total Ground Space<span>" + q.space.total_ground_space_html + "\n" + "</span></h5>\n" +
                                "                                                                </div>\n" +
                                "                                                                <div class=\"col-2 col-s-2\">\n" +
                                "                                                                    <h5>Clear Height<span>" + q.space.clear_height_html + "\n" + "</span></h5>\n" +
                                "                                                                </div>\n" +
                                "                                                                <div class=\"col-2 col-s-2\">\n" +
                                "                                                                    &nbsp;\n" +
                                "                                                                </div>\n" +
                                "                                                            </div>";

                            if (q.use_storage) {
                                wdetnemwlm += "                                                 <div class=\"drow\">\n" +
                                    "                                                                <div class=\"col-2 col-s-2\">\n" +
                                    "                                                                    <h5 class=\"title\">Storage Mode :</h5>\n" +
                                    "                                                                </div>\n" +
                                    "                                                                <div class=\"col-2 col-s-2\">\n" +
                                    "                                                                    &nbsp;\n" +
                                    "                                                                </div>\n" +
                                    "                                                            </div>\n" +
                                    "<div class=\"wh-list\"><ul class=\"desc\">";
                                if (q.space.rack) {
                                    wdetnemwlm += "<li><span>Rack <b>" + q.space.rack_html + "</b></span></li>";
                                }
                                if (q.space.shelf) {
                                    wdetnemwlm += "<li><span>Shelf <b>" + q.space.shelf_html + "</b></span></li>";
                                }
                                if (q.space.bulk) {
                                    wdetnemwlm += "<li><span>Bulk <b>" + q.space.bulk_html + "</b></span></li>";
                                }
                                if (q.space.outside) {
                                    wdetnemwlm += "<li><span>Open Yard <b>" + q.space.rack_html + "</b></span></li>";
                                }
                                wdetnemwlm += "</ul></div>";
                            }
                            wdetnemwlm += "                                                        </div>\n" +
                                "                                                    </div>\n" +
                                "                                                    <h4 class=\"title gtitle\">Information</h4>\n" +
                                "                                                    <div class=\"details bg-gray\">\n" +
                                "                                                        <div class=\"drow\">\n" +
                                "                                                            <div class=\"col-4 col-s-4\">\n" +
                                "                                                                <h5 class=\"title\">Floor Load Capacity<span>" + q.space.floor_load_capacity_html + "</span></h5>\n" +
                                "                                                            </div>\n" +
                                "                                                        </div>";

                            if (q.use_temperature_controlled || q.use_usage_type) {
                                var final_ambient_html = q.temperature_controlled.ambient ? "<li class=\"set-h\"><span>Ambient <b>" + q.temperature_controlled.ambient_html + "</b></span></li>" : "";
                                var final_chilled_html = q.temperature_controlled.chilled ? "<li class=\"set-h\"><span>Chilled <b>" + q.temperature_controlled.chilled_html + "</b></span></li>" : "";
                                var final_heated_html = q.temperature_controlled.heated ? "<li class=\"set-h\"><span>Heated <b>" + q.temperature_controlled.ambient_html + "</b></span></li>" : "";

                                var final_dedicated_html = q.usage_type.dedicated ? "<li class=\"set-h\"><span>Dedicated/Single Tenant <b>" + q.usage_type.dedicated_html + "</b></span></li>" : "";
                                var final_shared_html = q.usage_type.shared ? "<li class=\"set-h\"><span>Shared/Multi Tenant <b>" + q.usage_type.shared_html + "</b></span></li>" : "";

                                // wdetnemwlm += "<div class=\"drow\">";
                                if (q.use_temperature_controlled && q.use_usage_type) {
                                    wdetnemwlm += "<div class=\"wh-list-2 same-h\">\n" +
                                        "<div class=\"col\">\n" +
                                        "<div class=\"title-list\">Temperature Controlled:</div>\n" +
                                        "<ul class=\"desc\">\n" +
                                        final_ambient_html +
                                        final_chilled_html +
                                        final_heated_html +
                                        "</ul>\n" +
                                        "</div>\n" +
                                        "<div class=\"col\">\n" +
                                        "<div class=\"title-list\">Usage Type:</div>\n" +
                                        "<ul class=\"desc\">\n" +
                                        final_dedicated_html +
                                        final_shared_html +
                                        "</ul>\n" +
                                        "</div>\n" +
                                        "</div>";
                                }
                            }

                            wdetnemwlm += "</div>";

                            if (q.use_facility) {
                                wdetnemwlm += "                                                    <h4 class=\"title gtitle\">Facility</h4>\n" +
                                    "                                                    <div class=\"details bg-gray\"><div class=\"wh-spec\"><div class=\"wh-list\"><ul>";
                                if (q.facility.forklift) {
                                    wdetnemwlm += "<li><span>Forklift <b>" + q.facility.forklift_html + "</b></span></li>";
                                }
                                if (q.facility.mobile_crane) {
                                    wdetnemwlm += "<li><span>Mobile Crane <b>" + q.facility.mobile_crane_html + "</b></span></li>";
                                }
                                if (q.facility.hoist_crane) {
                                    wdetnemwlm += "<li><span>Hoist Crane <b>" + q.facility.hoist_crane_html + "</b></span></li>";
                                }
                                if (q.facility.loading_dock) {
                                    wdetnemwlm += "<li><span>Loading Dock <b>" + q.facility.loading_dock_html + "</b></span></li>";
                                }
                                wdetnemwlm += "                                                    </ul></div></div></div>";
                            }

                            if (q.use_security) {
                                wdetnemwlm += "                                                    <h4 class=\"title gtitle\">Security and Protection</h4>\n" +
                                    "                                                    <div class=\"details bg-gray\"><div class=\"wh-list\"><ul>";
                                if (q.security.cctv === "1") {
                                    wdetnemwlm += "<li><span>CCTV <b>" + q.security.cctv_html + "</b></span></li>";
                                }
                                if (q.security.security_guard) {
                                    wdetnemwlm += "<li><span>Security Guard <b>" + q.security.security_guard_html + "</b></span></li>";
                                }
                                if (q.security.access_control) {
                                    wdetnemwlm += "<li><span>Access Control <b>" + q.security.access_control_html + "</b></span></li>";
                                }
                                if (q.security.smoke_detector) {
                                    wdetnemwlm += "<li><span>Smoke Detector <b>" + q.security.smoke_detector_html + "</b></span></li>";
                                }
                                if (q.security.fire_hydrant) {
                                    wdetnemwlm += "<li><span>Fire Hydrant & Fire Sprinkler <b>" + q.security.fire_hydrant_html + "</b></span></li>";
                                }
                                wdetnemwlm += "                                                    </ul></div></div>";
                            }

                            if (q.use_certification) {
                                wdetnemwlm += "                                                    <h4 class=\"title gtitle\">Certifications</h4>\n" +
                                    "                                                    <div class=\"details bg-gray\"><div class=\"wh-spec\"><div class=\"wh-list\"><ul>";
                                if (q.certification.iso_9001) {
                                    wdetnemwlm += "<li><span>ISO 9001 <b>" + q.certification.iso_9001_html + "</b></span></li>";
                                }
                                if (q.certification.iso_14001) {
                                    wdetnemwlm += "<li><span>ISO 14001 <b>" + q.certification.iso_14001_html + "</b></span></li>";
                                }
                                if (q.certification.ohsas_18001) {
                                    wdetnemwlm += "<li><span>OHSAS 18001 <b>" + q.certification.ohsas_18001_html + "</b></span></li>";
                                }
                                if (q.certification.aeo) {
                                    wdetnemwlm += "<li><span>AEO <b>" + q.certification.aeo_html + "</b></span></li>";
                                }
                                if (q.certification.tapa_fsr) {
                                    wdetnemwlm += "<li><span>TAPA FSR <b>" + q.certification.tapa_fsr_html + "</b></span></li>";
                                }
                                wdetnemwlm += "                                                    </ul></div></div></div>";
                            }

                            wdetnemwlm += q.gallery_html;
                            wdetnemwlm += " </div></div>";
                            var detparent = $("#w" + q.id);
                            if (detparent.length) {
                                detparent.html(wdetnemwlm);
                            } else {
                                paneId.after("<div role=\"tabpanel\" data-id=\"" + q.id + "\" class=\"wdet tab-pane fade\" id=\"w" + q.id + "\">" + wdetnemwlm + "</div>")
                            }
                            sliderGal();
                        });
                        new_elm += "</div></div>";
                        outer_parent.html(new_elm);
                        sliderMd();
                    } else {
                        outer_parent.html('<div class="box-item blank">\n' +
                            '<p>You don’t have any warehouse yet.</p>\n' +
                            '</div>')
                    }
                }, 300)

            }
        })
    }

    function reload_truck(tid) {
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'mytruckings',
                'tid': tid
            },
            dataType: 'json',
            success: function (data) {
                var paneId = $("#forwarder-truck"),
                    outer_parent = paneId.find('.trcks');
                outer_parent.html('');

                setTimeout(function () {
                    if (data.items.length > 0) {
                        var new_elm = "<div class=\"box-category\">\n" +
                            data.other +
                            "<div class=\"row\">\n" +
                            "<div class=\"truck-list\">";
                        $.each(data.items, function (p, q) {
                            // console.log(q.id);
                            new_elm += "<div class=\"truck\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-sm-5\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"img\" style=\"background-image: url(" + q.logo_url + ");\"></div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-sm-7\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h4>" + q.display + "</h4>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"truck-detail equal\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"item\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <h4 class=\"title\">Ukuran Karoseri</h4> -->\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>GVWR</label><span>" + q.basic.class_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Weight Capacity</label><span>" + q.basic.weight_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Type</label><span>" + q.basic.type_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Total Unit</label><span>" + q.basic.unit_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"item\">\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <h4 class=\"title\">Cargo Load Interior</h4> -->\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Length</label><span>" + q.cargo.length_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Width</label><span>" + q.cargo.width_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Height</label><span>" + q.cargo.height_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><label>Max Volume</label><span>" + q.cargo.volume_html + "</span></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#\" class=\"mdtr\" data-trid=\"" + tid + "\" data-sintrid=\"" + q.id + "\">View detail</a>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t\t\t\t</div>";
                        });
                        new_elm += "</div></div></div>";
                        outer_parent.html(new_elm);
                    } else {
                        outer_parent.html('<div class="box-item blank">\n' +
                            '<p>You don’t have any trucking yet.</p>\n' +
                            '</div>')
                    }
                }, 300)

            }
        })
    }

    $("body").on('click', 'a.a_back_wares', function (e) {
        var wid = $(this).data("wid");
        reload_whouse(wid)
    });

    $("body").on('click', 'a.a_back_truck', function (e) {
        var tid = $(this).data("tid");
        reload_truck(tid)
    });

    function get_filter_session() {
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'fsess'
            },
            dataType: 'json',
            success: function (data) {
                var fcountry = $("select[name=fc]"),
                    fprovince_input = $("input[name=fp]"),
                    fprovince_select = $("select[name=fp]");
                if (data.items.f.country) {
                    $(fcountry).val(data.items.f.country).selectpicker('refresh');
                    if (data.items.f.province) {
                        $(fprovince_select).val(data.items.f.province).selectpicker('refresh');
                        $(fprovince_input).val(data.items.f.province);
                    }
                } else {
                    reset_country();
                }
            }
        })
    }

    var bfulsortby = jQuery("ul.forw.side-menu.sort-by");
    if (bfulsortby.length) {
        var li = bfulsortby.find('li'),
            a = li.find('a');
        a.click(function (e) {
            e.preventDefault();
            li.removeClass('active');

            var myli = $(this).closest('li');
            myli.addClass('active');
            browse_forwarders(curr_page, false);
        })
    }

    var bwulsortby = jQuery("ul.whouse.side-menu.sort-by");
    if (bwulsortby.length) {
        var li = bwulsortby.find('li'),
            a = li.find('a');
        a.click(function (e) {
            e.preventDefault();
            li.removeClass('active');

            var myli = $(this).closest('li');
            myli.addClass('active');
            browse_warehouses(curr_page, false);
        })
    }

    var btulsortby = jQuery("ul.truck.side-menu.sort-by");
    if (btulsortby.length) {
        var li = btulsortby.find('li'),
            a = li.find('a');
        a.click(function (e) {
            e.preventDefault();
            li.removeClass('active');

            var myli = $(this).closest('li');
            myli.addClass('active');
            browse_truckings(curr_page, false);
        })
    }

    //Filter reset
    jQuery(".btn-reset-forw").click(function (e) {
        setTimeout(function () {
            $("input[name=fn]").val("");
            var selectcountry = $("select.popcountry"),
                data_no = selectcountry.attr('data-no'),
                is_loop = !!data_no;
            selectcountry.val('').selectpicker('refresh');
            $("select[name=fmt]").val("").selectpicker("refresh");
            $("select[name=fmc]").val("").selectpicker("refresh");
            $("select[name=fms]").val("").selectpicker("refresh");
            $("select[name=fsd]").val("").selectpicker("refresh");
            populate_country('', is_loop, data_no);
            browse_forwarders(curr_page, false);
        }, 500);
    });

    //button reset warehouses
    jQuery(".btn-reset-ware").click(function (e) {
        setTimeout(function () {
            $("input[name=wn]").val("");
            var selectcountry = $("select.popcountry"),
                data_no = selectcountry.attr('data-no'),
                is_loop = !!data_no;
            selectcountry.val('').selectpicker('refresh');
            $("select[name=wtc]").val("").selectpicker("refresh");
            $("select[name=wst]").val("").selectpicker("refresh");
            populate_country('', is_loop, data_no);
            browse_warehouses(curr_page, false);
        }, 500);
    });

    //button reset truckings
    jQuery(".btn-reset-truck").click(function (e) {
        setTimeout(function () {
            $("input[name=tn]").val("");
            var selectcountry = $("select.popcountry"),
                data_no = selectcountry.attr('data-no'),
                is_loop = !!data_no;
            selectcountry.val('').selectpicker('refresh');
            populate_country('', is_loop, data_no);
            browse_truckings(curr_page, false);
        }, 500);
    });

    //Searchbox changed
    jQuery("[name=fn]").change(function () {
        browse_forwarders(curr_page, false);
    });
    jQuery("[name=wn]").change(function () {
        browse_warehouses(curr_page, false);
    });
    jQuery("[name=tn]").change(function () {
        browse_truckings(curr_page, false);
    });

    //Coutry changed
    jQuery("[name=fc]").change(function () {
        browse_forwarders(curr_page, false)
    });
    jQuery("[name=wc]").change(function () { //warehouse
        browse_warehouses(curr_page, false)
    });
    jQuery("[name=tc]").change(function () { //trucking
        browse_truckings(curr_page, false)
    });

    //Province changed
    jQuery("[name=fp]").change(function () {
        browse_forwarders(curr_page, false)
    });
    jQuery("[name=wp]").change(function () { //warehouse
        browse_warehouses(curr_page, false)
    });
    jQuery("[name=tp]").change(function () { //trucking
        browse_truckings(curr_page, false)
    });

    //Target changed
    jQuery("[name=fmt]").change(function () {
        browse_forwarders(curr_page, false)
    });

    //Most of cargo checkboxes
    jQuery("[name=fmc]").change(function (e) {
        browse_forwarders(curr_page, false, true);
    });

    //Most of service checkboxes
    jQuery("[name=fms]").change(function (e) {
        browse_forwarders(curr_page, false, true);
    });

    //Most Shipment Destination
    jQuery("[name=fsd]").change(function (e) {
        browse_forwarders(curr_page, false, true);
    });

    //Temperature controlled changed
    jQuery("[name=wtc]").change(function () {
        browse_warehouses(curr_page, false)
    });

    jQuery("[name=tclass]").change(function () {
        browse_truckings(curr_page, false)
    });

    jQuery("[name=ttype]").change(function () {
        browse_truckings(curr_page, false)
    });

    //Storage Type changed
    jQuery("[name=wst]").change(function () {
        browse_warehouses(curr_page, false)
    });

    jQuery("#fchpswd").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var cb = $(element).closest('.checkbox');
            error.insertAfter(cb);
            error.addClass('cb-error');
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input[type=email],input[type=password]'),
                btn = $(form).find('.btn-chpswd'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'chpswd',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Login');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                        setTimeout(function () {
                            location.href = data.callback;
                        }, 2000)
                    }
                }
            })
        }
    });

    jQuery('.btn-dflog').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'dflog'
            },
            dataType: 'json',
            success: function (data) {

            }
        })
    });

    jQuery('.btn-dfat').click(function (e) {
        e.preventDefault();
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'dfat'
            },
            dataType: 'json',
            success: function (data) {

            }
        })
    });

    jQuery("#fcomi").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var ifields = $(form).find('input[type=text], textarea, select'),
                btn = $(form).find('.btn-uci'),
                snotice = $("#snotice"),
                formdata = false;

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');

            if (window.FormData) {
                formdata = new FormData();
            }
            var files_data = $('#file'), logo_data = $("#logo");

            $.each($(files_data), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('files[' + j + ']', file);
                })
            });
            $.each($(logo_data), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('logos[' + j + ']', file);
                })
            });

            // our AJAX identifier
            formdata.append('action', 'xuci');
            formdata.append('cname', jQuery('input[name=cname]').val());
            formdata.append('yfo', jQuery('input[name=yfo]').val());
            formdata.append('csize', jQuery('select[name=csize]').val());
            formdata.append('cdesc', jQuery('textarea[name=cdesc]').val());

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Save changes');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, 'Great', 'success', true));
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            })
        }
    });

    $("body").on('click', '.btn.del-cofm', function (e) {
        e.preventDefault();
        var me = $(this),
            wid = me.attr("data-wsingid"),
            sintrid = me.attr("data-sintrid"),
            me_ori = me.html(),
            mod_del = $("#deleteWhouseModal"),
            pt = me.attr("data-pt");
        me.addClass("disabled").html("Loading");
        if (pt === "truck") { //deleting truck
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'GET',
                data: {
                    'action': 'deltruck',
                    'sintrid': sintrid
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.is_error) {
                        me.removeClass("disabled").html(me_ori);

                        var parent_trucking = jQuery("#forwarder-truck");
                        if (parent_trucking.length) {
                            var trfid = parent_trucking.attr("data-tid");
                            reload_truck(trfid);
                        }
                        mod_del.modal('toggle');
                    }
                }
            });
        } else { //deketing warehouse
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'GET',
                data: {
                    'action': 'delwhouse',
                    'wid': wid
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.is_error) {
                        me.removeClass("disabled").html(me_ori);
                        var aback = $('a.a_back_wares'),
                            awid = aback.attr("data-wid");
                        reload_whouse(awid);
                        $(aback).tab('show');
                        mod_del.modal('toggle');
                    }
                }
            });
        }
    });

    $("body").on('click', '.btn-go-del', function (e) {
        e.preventDefault();
        var me = $(this),
            wsingid = me.data("wsingid"),
            me_ori = me.html(),
            mod_del = $("#deleteWhouseModal"),
            mod_button = mod_del.find('button.del-cofm');

        mod_button.attr("data-wsingid", wsingid);

        me.addClass("disabled").html("Loading");
        mod_del.modal('show');
        me.removeClass("disabled").html(me_ori);
    });

    $("body").on('click', '.btn-go-edit', function (e) {
        e.preventDefault();
        var dparent = $("#frmaddwhouse").closest('div'),
            dalert = dparent.find('.alert');
        dalert.remove();

        var me = $(this),
            wsingid = me.data("wsingid"),
            me_ori = me.html(),
            row_imgs = $(".rimgs");

        me.addClass("disabled").html("Loading");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'detwhouse',
                'wsingid': wsingid
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {

                } else {
                    row_imgs.html('');
                    var imgshtml = '',
                        imggalls = data.items['gallery'];
                    if (imggalls) {
                        $.each(imggalls, function (x, y) {
                            imgshtml += "<div class=\"col-sm-4\"><div class=\"box-img\"><a class=\"img\" href=\"" + y['medium'] + "\" style=\"background-image: url(" + y['thumbnail'] + ")\" data-lity></a><input type=\"hidden\" class=\"gid\" value=\"" + y['id'] + "\"> <a class=\"btn-del temp\" href=\"#\">Delete</a></div></div>"
                        })
                    }
                    row_imgs.html(imgshtml);

                    jQuery("input:hidden[name=wid]").val(wsingid);
                    jQuery("input[name=wname]").val(data.items.display);

                    jQuery("input[name=curimgids]").val(data.items['all_galls']);
                    jQuery("select[name=wcountry]").val(data.items['country']).selectpicker('refresh');
                    populate_country(data.items['country'], false, 0);
                    setTimeout(function () {
                        console.log(jQuery("select[name=wprovince]").val());
                        jQuery("select[name=wprovince]").val(data.items['province']).selectpicker('refresh');
                        jQuery("input[name=wprovince]").val(data.items['province']);
                    }, 2000);
                    console.log('ada');
                    jQuery("input[name=wcity]").val(data.items['city']);
                    jQuery("textarea[name=waddress]").val(data.items['address']);
                    jQuery("textarea[name=wdesc]").val(data.items['description']);

                    jQuery("input[name=floor_load_capacity]").val(data.items['floor_load_capacity']);
                    jQuery("input[name=total_ground_space]").val(data.items['total_ground_space']);
                    jQuery("input[name=clear_height]").val(data.items['clear_height']);
                    // jQuery("input[name=rack]").val(data.items['rack']);
                    // jQuery("input[name=shelf]").val(data.items['shelf']);
                    // jQuery("input[name=bulk]").val(data.items['bulk']);
                    // jQuery("input[name=outside]").val(data.items['outside']);

                    jQuery("input[name=forklift]").val(data.items['forklift']);
                    jQuery("input[name=mobile_crane]").val(data.items['mobile_crane']);
                    jQuery("input[name=hoist_crane]").val(data.items['hoist_crane']);

                    var rack = jQuery("input[name=rack]"),
                        rack_wrapper = rack.closest('.btn'),
                        rack_data = data.items['rack'],
                        rack_wrapper_class = rack_data === "checked" ? "active" : "";
                    if (rack_data === "checked") {
                        rack.attr(rack_data, rack_data);
                        rack_wrapper.addClass(rack_wrapper_class);
                    } else {
                        rack.removeAttr("checked");
                        if (rack_wrapper.hasClass("active")) {
                            rack_wrapper.removeClass("active");
                        }
                    }
                    var shelf = jQuery("input[name=shelf]"),
                        shelf_wrapper = shelf.closest('.btn'),
                        shelf_data = data.items['shelf'],
                        shelf_wrapper_class = shelf_data === "checked" ? "active" : "";
                    if (shelf_data === "checked") {
                        shelf.attr(shelf_data, shelf_data);
                        shelf_wrapper.addClass(shelf_wrapper_class);
                    } else {
                        shelf.removeAttr("checked");
                        if (shelf_wrapper.hasClass("active")) {
                            shelf_wrapper.removeClass("active");
                        }
                    }
                    var bulk = jQuery("input[name=bulk]"),
                        bulk_wrapper = bulk.closest('.btn'),
                        bulk_data = data.items['bulk'],
                        bulk_wrapper_class = bulk_data === "checked" ? "active" : "";
                    if (bulk_data === "checked") {
                        bulk.attr(bulk_data, bulk_data);
                        bulk_wrapper.addClass(bulk_wrapper_class);
                    } else {
                        bulk.removeAttr("checked");
                        if (bulk_wrapper.hasClass("active")) {
                            bulk_wrapper.removeClass("active");
                        }
                    }
                    var outside = jQuery("input[name=outside]"),
                        outside_wrapper = outside.closest('.btn'),
                        outside_data = data.items['outside'],
                        outside_wrapper_class = outside_data === "checked" ? "active" : "";
                    if (outside_data === "checked") {
                        outside.attr(outside_data, outside_data);
                        outside_wrapper.addClass(outside_wrapper_class);
                    } else {
                        outside.removeAttr("checked");
                        if (outside_wrapper.hasClass("active")) {
                            outside_wrapper.removeClass("active");
                        }
                    }

                    var ambient = jQuery("input[name=watc][value=ambient]"),
                        ambient_wrapper = ambient.closest('.btn'),
                        ambient_data = data.items['ambient'],
                        ambient_wrapper_class = ambient_data === "checked" ? "active" : "";
                    if (ambient_data === "checked") {
                        ambient.attr(ambient_data, ambient_data);
                        ambient_wrapper.addClass(ambient_wrapper_class);
                    } else {
                        ambient.removeAttr("checked");
                        if (ambient_wrapper.hasClass("active")) {
                            ambient_wrapper.removeClass("active");
                        }
                    }
                    var chilled = jQuery("input[name=watc][value=chilled]"),
                        chilled_wrapper = chilled.closest('.btn'),
                        chilled_data = data.items['chilled'],
                        chilled_wrapper_class = chilled_data === "checked" ? "active" : "";
                    if (chilled_data === "checked") {
                        chilled.attr(chilled_data, chilled_data);
                        chilled_wrapper.addClass(chilled_wrapper_class);
                    } else {
                        chilled.removeAttr("checked");
                        if (chilled_wrapper.hasClass("active")) {
                            chilled_wrapper.removeClass("active");
                        }
                    }
                    var heated = jQuery("input[name=watc][value=heated]"),
                        heated_wrapper = heated.closest('.btn'),
                        heated_data = data.items['heated'],
                        heated_wrapper_class = heated_data === "checked" ? "active" : "";
                    if (heated_data === "checked") {
                        heated.attr(heated_data, heated_data);
                        heated_wrapper.addClass(heated_wrapper_class);
                    } else {
                        heated.removeAttr("checked");
                        if (heated_wrapper.hasClass("active")) {
                            heated_wrapper.removeClass("active");
                        }
                    }

                    var dedicated = jQuery("input[name=dedicated]"),
                        dedicated_wrapper = dedicated.closest('.btn'),
                        dedicated_data = data.items['dedicated'],
                        dedicated_wrapper_class = dedicated_data === "checked" ? "active" : "";
                    if (dedicated_data === "checked") {
                        dedicated.attr(dedicated_data, dedicated_data);
                        dedicated_wrapper.addClass(dedicated_wrapper_class);
                    } else {
                        dedicated.removeAttr("checked");
                        if (dedicated_wrapper.hasClass("active")) {
                            dedicated_wrapper.removeClass("active");
                        }
                    }
                    var shared = jQuery("input[name=shared]"),
                        shared_wrapper = shared.closest('.btn'),
                        shared_data = data.items['shared'],
                        shared_wrapper_class = shared_data === "checked" ? "active" : "";
                    if (shared_data === "checked") {
                        shared.attr(shared_data, shared_data);
                        shared_wrapper.addClass(shared_wrapper_class);
                    } else {
                        shared.removeAttr("checked");
                        if (shared_wrapper.hasClass("active")) {
                            shared_wrapper.removeClass("active");
                        }
                    }

                    var loading_dock = jQuery("input[name=loading_dock]"),
                        loading_dock_wrapper = loading_dock.closest('.btn'),
                        loading_dock_data = data.items['loading_dock'],
                        loading_dock_wrapper_class = loading_dock_data === "checked" ? "active" : "";
                    if (loading_dock_data === "checked") {
                        loading_dock.attr(loading_dock_data, loading_dock_data);
                        loading_dock_wrapper.addClass(loading_dock_wrapper_class);
                    } else {
                        loading_dock.removeAttr("checked");
                        if (loading_dock_wrapper.hasClass("active")) {
                            loading_dock_wrapper.removeClass("active");
                        }
                    }

                    var cctv = jQuery("input[name=cctv]"),
                        cctv_wrapper = cctv.closest('.btn'),
                        cctv_data = data.items['cctv'],
                        cctv_wrapper_class = cctv_data === "checked" ? "active" : "";
                    if (cctv_data === "checked") {
                        cctv.attr(cctv_data, cctv_data);
                        cctv_wrapper.addClass(cctv_wrapper_class);
                    } else {
                        cctv.removeAttr("checked");
                        if (cctv_wrapper.hasClass("active")) {
                            cctv_wrapper.removeClass("active");
                        }
                    }
                    var security_guard = jQuery("input[name=security_guard]"),
                        security_guard_wrapper = security_guard.closest('.btn'),
                        security_guard_data = data.items['security_guard'],
                        security_guard_wrapper_class = security_guard_data === "checked" ? "active" : "";
                    if (security_guard_data === "checked") {
                        security_guard.attr(security_guard_data, security_guard_data);
                        security_guard_wrapper.addClass(security_guard_wrapper_class);
                    } else {
                        security_guard.removeAttr("checked");
                        if (security_guard_wrapper.hasClass("active")) {
                            security_guard_wrapper.removeClass("active");
                        }
                    }
                    var access_control = jQuery("input[name=access_control]"),
                        access_control_wrapper = access_control.closest('.btn'),
                        access_control_data = data.items['access_control'],
                        access_control_wrapper_class = access_control_data === "checked" ? "active" : "";
                    if (access_control_data === "checked") {
                        access_control.attr(access_control_data, access_control_data);
                        access_control_wrapper.addClass(access_control_wrapper_class);
                    } else {
                        access_control.removeAttr("checked");
                        if (access_control_wrapper.hasClass("active")) {
                            access_control_wrapper.removeClass("active");
                        }
                    }
                    var smoke_detector = jQuery("input[name=smoke_detector]"),
                        smoke_detector_wrapper = smoke_detector.closest('.btn'),
                        smoke_detector_data = data.items['smoke_detector'],
                        smoke_detector_wrapper_class = smoke_detector_data === "checked" ? "active" : "";
                    if (smoke_detector_data === "checked") {
                        smoke_detector.attr(smoke_detector_data, smoke_detector_data);
                        smoke_detector_wrapper.addClass(smoke_detector_wrapper_class);
                    } else {
                        smoke_detector.removeAttr("checked");
                        if (smoke_detector_wrapper.hasClass("active")) {
                            smoke_detector_wrapper.removeClass("active");
                        }
                    }
                    var fire_hydrant = jQuery("input[name=fire_hydrant]"),
                        fire_hydrant_wrapper = fire_hydrant.closest('.btn'),
                        fire_hydrant_data = data.items['fire_hydrant'],
                        fire_hydrant_wrapper_class = fire_hydrant_data === "checked" ? "active" : "";
                    if (fire_hydrant_data === "checked") {
                        console.log('checked');
                        fire_hydrant.attr(fire_hydrant_data, fire_hydrant_data);
                        fire_hydrant_wrapper.addClass(fire_hydrant_wrapper_class);
                    } else {
                        fire_hydrant.removeAttr("checked");
                        if (fire_hydrant_wrapper.hasClass("active")) {
                            fire_hydrant_wrapper.removeClass("active");
                        }
                    }

                    var iso_9001 = jQuery("input[name=iso_9001]"),
                        iso_9001_wrapper = iso_9001.closest('.btn'),
                        iso_9001_data = data.items['iso_9001'],
                        iso_9001_wrapper_class = iso_9001_data === "checked" ? "active" : "";
                    if (iso_9001_data === "checked") {
                        iso_9001.attr(iso_9001_data, iso_9001_data);
                        iso_9001_wrapper.addClass(iso_9001_wrapper_class);
                    } else {
                        iso_9001.removeAttr("checked");
                        if (iso_9001_wrapper.hasClass("active")) {
                            iso_9001_wrapper.removeClass("active");
                        }
                    }
                    var iso_14001 = jQuery("input[name=iso_14001]"),
                        iso_14001_wrapper = iso_14001.closest('.btn'),
                        iso_14001_data = data.items['iso_14001'],
                        iso_14001_wrapper_class = iso_14001_data === "checked" ? "active" : "";
                    if (iso_14001_data === "checked") {
                        iso_14001.attr(iso_14001_data, iso_14001_data);
                        iso_14001_wrapper.addClass(iso_14001_wrapper_class);
                    } else {
                        iso_14001.removeAttr("checked");
                        if (iso_14001_wrapper.hasClass("active")) {
                            iso_14001_wrapper.removeClass("active");
                        }
                    }
                    var ohsas_18001 = jQuery("input[name=ohsas_18001]"),
                        ohsas_18001_wrapper = ohsas_18001.closest('.btn'),
                        ohsas_18001_data = data.items['ohsas_18001'],
                        ohsas_18001_wrapper_class = ohsas_18001_data === "checked" ? "active" : "";
                    if (ohsas_18001_data === "checked") {
                        ohsas_18001.attr(ohsas_18001_data, ohsas_18001_data);
                        ohsas_18001_wrapper.addClass(ohsas_18001_wrapper_class);
                    } else {
                        ohsas_18001.removeAttr("checked");
                        if (ohsas_18001_wrapper.hasClass("active")) {
                            ohsas_18001_wrapper.removeClass("active");
                        }
                    }
                    var aeo = jQuery("input[name=aeo]"),
                        aeo_wrapper = aeo.closest('.btn'),
                        aeo_data = data.items['aeo'],
                        aeo_wrapper_class = aeo_data === "checked" ? "active" : "";
                    if (aeo_data === "checked") {
                        aeo.attr(aeo_data, aeo_data);
                        aeo_wrapper.addClass(aeo_wrapper_class);
                    } else {
                        aeo.removeAttr("checked");
                        if (aeo_wrapper.hasClass("active")) {
                            aeo_wrapper.removeClass("active");
                        }
                    }
                    var tapa_fsr = jQuery("input[name=tapa_fsr]"),
                        tapa_fsr_wrapper = tapa_fsr.closest('.btn'),
                        tapa_fsr_data = data.items['tapa_fsr'],
                        tapa_fsr_wrapper_class = tapa_fsr_data === "checked" ? "active" : "";
                    if (tapa_fsr_data === "checked") {
                        tapa_fsr.attr(tapa_fsr_data, tapa_fsr_data);
                        tapa_fsr_wrapper.addClass(tapa_fsr_wrapper_class);
                    } else {
                        tapa_fsr.removeAttr("checked");
                        if (tapa_fsr_wrapper.hasClass("active")) {
                            tapa_fsr_wrapper.removeClass("active");
                        }
                    }

                    setTimeout(function () {
                        jQuery("button.addnwh").tab('show');
                        me.removeClass("disabled").html(me_ori);
                    }, 1000);
                }
            }
        })
    });

    $("body").on('click', '.btn-go-edit-tr', function (e) {
        e.preventDefault();
        var dparent = $("#frmaddtrck").closest('div'),
            dalert = dparent.find('.alert');
        dalert.remove();

        var me = $(this),
            trid = me.attr("data-trid"),
            sintrid = me.attr("data-sintrid"),
            me_ori = me.html(),
            row_imgs = jQuery(".rimgs");

        me.addClass("disabled").html("Loading");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'dettruck',
                'trid': trid,
                'sintrid': sintrid
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {

                } else {
                    row_imgs.html('');
                    var imgshtml = '',
                        imggalls = data.items['gallery'];
                    if (imggalls) {
                        $.each(imggalls, function (x, y) {
                            imgshtml += "<div class=\"col-sm-4\"><div class=\"box-img\"><a class=\"img\" href=\"" + y['medium'] + "\" style=\"background-image: url(" + y['thumbnail'] + ")\" data-lity></a><input type=\"hidden\" class=\"gid\" value=\"" + y['id'] + "\"> <a class=\"btn-del temp\" href=\"#\">Delete</a></div></div>"
                        })
                    }
                    row_imgs.html(imgshtml);

                    jQuery("input:hidden[name=sintrid]").val(sintrid);
                    jQuery("input[name=tname]").val(data.items.name);
                    jQuery("input[name=curimgids]").val(data.items.gallids);

                    jQuery("input[name=tweight]").val(data.items['basic']['weight']);
                    jQuery("input[name=tclass]").val(data.items['basic']['class']);
                    jQuery("select[name=frttype]").val(data.items['basic']['type']).selectpicker('refresh');
                    jQuery("input[name=tunits]").val(data.items['basic']['unit']);

                    jQuery("input[name=tlength]").val(data.items['cargo']['length']);
                    jQuery("input[name=twidth]").val(data.items['cargo']['width']);
                    jQuery("input[name=theight]").val(data.items['cargo']['height']);
                    jQuery("input[name=tvolume]").val(data.items['cargo']['volume']);

                    setTimeout(function () {
                        jQuery("button.addntr").tab('show');
                        me.removeClass("disabled").html(me_ori);
                        jQuery("#detailModalTrucking").modal('hide');
                    }, 500);
                }
            }
        })
    });

    jQuery(".addnwh").click(function (e) {
        jQuery("input:hidden[name=wid]").val('');
        var mform = jQuery("#frmaddwhouse");
        reset_form_addwhouse(mform, true);
    });

    jQuery("#frmaddwhouse").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var fg = $(element).closest('.form-group');
            error.insertAfter(fg);
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var ifields = $(form).find('input[type=hidden], input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, select:enabled, textarea:enabled'),
                btn = $(form).find('.btn-save-whouse'),
                btn_ori = btn.html(),
                snotice = $("#xnotice"),
                data = $(form).serializeArray();

            snotice.html('');
            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'svewhouse',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');

                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html(btn_ori);
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                        // console.log('errr')
                    } else {
                        snotice.html(alert_wrapper(data.message, 'Great!', 'success', true));
                        // console.log('guud');
                        if (!jQuery("input[name=wid]").val()) { //you are not editing warehouse, it means you are creating new one
                            reset_form_addwhouse($(form), false);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            })
        }
    });

    function reset_form_addtruck(form, is_reset) {
        if (is_reset) {
            var dparent = $(form).closest('div'),
                dalert = dparent.find('.alert');
            dalert.remove();
        }

        $.each($(form).find('input:text, input:hidden'), function (x, y) {
            $(y).val('');
        });

        var upllogo = $(form).find('.box-gallery'),
            rimgs = upllogo.find('.rimgs');
        rimgs.html('')

    }

    jQuery("#frmaddtrck").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var fg = $(element).closest('.form-group');
            error.insertAfter(fg);
        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var ifields = $(form).find('input[type=hidden], input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, select:enabled, textarea:enabled'),
                btn = $(form).find('.btn-save-truck'),
                btn_ori = btn.html(),
                snotice = $("#stnotice"),
                data = $(form).serializeArray();

            snotice.html('');
            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'sve_truck',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');

                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html(btn_ori);
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                        // console.log('errr')
                    } else {
                        snotice.html(alert_wrapper(data.message, 'Great!', 'success', true));
                        // console.log('guud');
                        if (!jQuery("input[name=trid]").val()) { //you are not editing warehouse, it means you are creating new one
                            reset_form_addtruck($(form), false);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                }
            })
        }
    });

    $("body").on('click', '.mdtr', function (e) {
        e.preventDefault();
        var modalDetailTrucking = jQuery("#detailModalTrucking"),
            mcontent = modalDetailTrucking.find(".modal-content");
        var trid = jQuery(this).attr("data-trid"),
            sintrid = jQuery(this).attr("data-sintrid"),
            noedit = jQuery(this).attr("data-noedit");

        mcontent.addClass("loading");
        modalDetailTrucking.modal('show');
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'dettruck',
                'trid': trid,
                'sintrid': sintrid,
                'noedit': noedit
            },
            dataType: 'json',
            success: function (data) {
                mcontent.html(data.other).removeClass("loading");
                sliderMd();
            }
        })
    })

    $("body").on('click', '.btn-go-del-tr', function (e) {
        e.preventDefault();
        var modalDeleteTrucking = jQuery("#deleteWhouseModal"),
            btndelconf = modalDeleteTrucking.find(".del-cofm");
        var trid = jQuery(this).attr("data-sintrid");
        var modalDetailTrucking = jQuery("#detailModalTrucking");
        modalDetailTrucking.modal('hide');
        setTimeout(function () {
            btndelconf.attr("data-sintrid", trid).attr("data-pt", "truck");
            modalDeleteTrucking.modal('show');
        }, 300);
    });

    $("body").on('click', '.box-img .btn-del.temp', function (e) {
        e.preventDefault();
        var me = $(this),
            wrapper = $(this).closest('.box-img'),
            frm = me.closest('form'),
            gids = [],
            myid = wrapper.find('input:hidden').val();
        // curgallelm = $("input[name=curgall]"),
        // curgall = curgallelm.val();


        $.each(frm.find(".gid"), function (x, obj) {
            gids.push($(obj).val());
        });

        wrapper.addClass('loading');
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'gendelfile',
                'lgids': gids,
                'me': myid
            },
            dataType: 'json',
            success: function (data) {
                wrapper.removeClass('loading');
                var mebox = me.closest('.col-sm-4');
                $("input[name=curimgids]").val(data.callback);
                if (mebox.length) {
                    mebox.remove();
                }
            }
        });
    });

    jQuery("input:file.inputfile.return-id").change(function () {
        var frm = $(this).closest('form'),
            // notice = $("#xyznotice"),
            formdata = false,
            row_images = $(".rimgs"),
            gids = [];
        // curgallelm = $("input[name=curimgids]"),
        // curgall = curgallelm.val();

        $.each(frm.find(".gid"), function (x, obj) {
            gids.push($(obj).val());
        });

        if (window.FormData) {
            formdata = new FormData();
        }
        var logo_data = $(this);

        $.each($(logo_data), function (i, obj) {
            $.each(obj.files, function (j, file) {
                formdata.append('logos[' + j + ']', file);
            })
        });

        // our AJAX identifier
        formdata.append('action', 'genupfile');
        formdata.append('gids', gids);
        // formdata.append('curgall', curgall);

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data) {
                var upwrapper = frm.find('div.upload-file'),
                    span_preview = upwrapper.find('span.image-preview'),
                    ids = frm.find('input[name=curimgids]');
                upwrapper.removeClass("has-file");
                span_preview.removeAttr("style");
                if (data.is_error) {
                    // notice.html(alert_wrapper(data.message, 'Sorry', 'warning', true));
                    // alert(data.message);
                    alertUpload(data.message);
                } else {
                    $.each(data.callback, function (s, t) {
                        console.log(t);
                        // curgallelm.val(parseInt(curgall, 10) + 1);
                        row_images.append("<div class=\"col-sm-4\"><div class=\"box-img\"><a class=\"img\" href=\"" + t['medium'] + "\" style=\"background-image: url(" + t['thumbnail'] + ")\" data-lity></a><input type=\"hidden\" class=\"gid\" value=\"" + t['id'] + "\"> <a class=\"btn-del temp\" href=\"#\">Delete</a></div></div>");
                    });
                    ids.attr("value", data.other);
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        })
    });

    jQuery("form.frm_write_review").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('.modal').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input[type=radio], textarea'),
                btn = $(form).find('.btn-review'),
                snotice = $("#snotice"),
                tid = $(form).find('input[name=tid]').val();

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'write_review',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $(".modal").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Send');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry', 'warning', true));
                    } else {
                        jQuery("input[type=radio]").prop('checked', false);
                        jQuery("textarea").val('');
                        snotice.html(alert_wrapper(data.message, 'Great', 'success', true));
                        //if review accessed from transaction history
                        if (tid) {
                            console.log('ok');
                            var cutr = $("tr.tid_" + tid),
                                mebtn = cutr.find('a.btn-bfrev');
                            mebtn.addClass('disabled').html('Reviewed');
                        } else {
                            console.log('nooo');
                            console.log(tid);
                        }
                    }
                }
            })
        }
    });

    jQuery("form.frm_send_messge").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('textarea'),
                btn = $(form).find('.btn-msg');
            // snotice = $("#smsgnotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            // snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'smsg',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Send');
                    if (data.is_error) {
                        // snotice.html(alert_wrapper(data.message, 'Sorry', 'warning', true));
                    } else {
                        $('#messageModal').modal('toggle');
                        jQuery("textarea").val('');
                        // snotice.html(alert_wrapper(data.message, 'Great', 'success', true));
                    }
                }
            })
        }
    });

    jQuery("#frm_ca").validate({
        rules: {
            pw1: {
                minlength: 5
            },
            pw2: {
                minlength: 5,
                equalTo: "#pw1"
            }
        },
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('.right').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input[type=text], input[type=password], input[type=number], input[type=email], textarea'),
                iselect = $(form).find('option'),
                btn = $(form).find('.btn-reg'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            iselect.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'create_account',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $(".right").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    iselect.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Create account');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        ifields.val('');
                        snotice.html(alert_wrapper(data.message, "Congratulation!", "success", true));
                    }
                }
            })
        }
    });

    jQuery(".btn-goreg").click(function (e) {
        e.preventDefault();
        var me = $(this);
        me.prop('disabled', true).html("Loading...");
        setTimeout(function () {
            console.log(isBusy);
            if (!isBusy) {
                $.ajax({
                    url: my_ajax_object.ajax_url,
                    type: 'GET',
                    data: {
                        'action': 'get_reg'
                    },
                    dataType: 'json',
                    success: function (data) {
                        window.location.href = data.callback;
                    }
                })
            }
        }, 500)
    });

    jQuery("#frm_lg").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input[type=text], input[type=password]'),
                btn = $(form).find('.btn-log'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');

            //Check if stil busy
            doQueueLogin(data);

            // setTimeout(function () {
            //     console.log(isBusy);
            //     if (!isBusy) {
            //         $.ajax({
            //             url: my_ajax_object.ajax_url,
            //             type: 'POST',
            //             data: {
            //                 'action': 'ulogin',
            //                 'sobj': data
            //             },
            //             dataType: 'json',
            //             success: function (data) {
            //                 ifields.prop('disabled', false);
            //                 btn.prop('disabled', false);
            //                 btn.html('Login');
            //                 if (data.is_error) {
            //                     snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
            //                 } else {
            //                     ifields.val('');
            //                     snotice.html(alert_wrapper(data.message, "Great!", "success", true));
            //                     setTimeout(function () {
            //                         window.location.href = data.callback;
            //                     }, 1000);
            //                 }
            //             }
            //         })
            //     }
            // }, 500);

        }
    });

    jQuery("#frm_rp").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var eml = $(form).find('input[name=eml]'),
                ifields = $(form).find('input[type=email]'),
                btn = $(form).find('.btn-rp'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'rp',
                    'eml': eml.val()
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Reset password');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        ifields.val('');
                        $(form).remove();
                        snotice.prev().remove();
                        snotice.html(data.message);
                    }
                }
            })
        }
    });

    jQuery("#frm_np").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input[type=password]'),
                btn = $(form).find('.btn-np'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'np',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Login');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        ifields.val('');
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                        setTimeout(function () {
                            window.location.href = data.callback;
                        }, 1000);
                    }
                }
            })
        }
    });

    jQuery("#frm_ac").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var eml = $(form).find('input[name=eml]'),
                ifields = $(form).find('input[type=email]'),
                btn = $(form).find('.btn-ac'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'ac',
                    'eml': eml.val()
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Send activation');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        ifields.val('');
                        $(form).remove();
                        snotice.prev().remove();
                        snotice.html(data.message);
                    }
                }
            })
        }
    });

    jQuery("a.btn-wreview").click(function (e) {
        e.preventDefault();
        var rmodal = jQuery("#reviewModal");
        rmodal.modal();

        rmodal.on('shown.bs.modal', function () {
            jQuery("input[type=radio]").prop('checked', false);
            jQuery("textarea").val('');
            jQuery("#snotice").html("");
        })
    });

    $('a.repaymnt').click(function (e) {
        e.preventDefault();
        var me = jQuery(this),
            me_parent = me.closest('.upgrade');
        me_parent.addClass("loading");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'repaymnt'
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {
                    alertUpload(data.message);
                    me_parent.removeClass('loading')
                } else {
                    location.reload();
                }
            }
        })
    });

    $("body").on('click', 'a.btn-bfrev', function (e) {
        e.preventDefault();
        var rmodal = jQuery("#reviewModal"),
            modalFid = rmodal.find('input[name=fid]'),
            modalTid = rmodal.find('input[name=tid]'),
            fTitle = rmodal.find('.ftitle'),
            fAddress = rmodal.find('.faddress'),
            meTid = $(this).attr("data-tid"),
            meFid = $(this).attr("data-fid"),
            meTitle = $(this).attr("data-title"),
            meAddress = $(this).attr("data-address");

        modalTid.val(meTid);
        modalFid.val(meFid);
        fTitle.html(meTitle);
        fAddress.html(meAddress);
        rmodal.modal();

        rmodal.on('shown.bs.modal', function () {
            jQuery("input[type=radio]").prop('checked', false);
            jQuery("textarea").val('')
        })
    });

    jQuery("a.btn-sendmsg").click(function (e) {
        e.preventDefault();
        var rmodal = jQuery("#messageModal");
        rmodal.modal();

        rmodal.on('shown.bs.modal', function () {
            jQuery("textarea").val('')
        })
    });

    jQuery("#do_paymentconfirm").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var ifields = $(form).find('input[type=text]', 'textarea', 'select'),
                btn = $(form).find('.btn-confirm'),
                snotice = $("#snotice"),
                formdata = false;

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');

            if (window.FormData) {
                formdata = new FormData();
            }
            var logo_data = $("#logo");

            $.each($(logo_data), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('logos[' + j + ']', file);
                })
            });

            // our AJAX identifier
            formdata.append('action', 'payment_confirmation');
            formdata.append('ino', jQuery('input[name=ino]').val());
            formdata.append('bac', jQuery('select[name=bac]').val());
            formdata.append('ana', jQuery('input[name=ana]').val());
            formdata.append('ta', jQuery('input[name=ta]').val());
            formdata.append('dot', jQuery('input[name=dot]').val());
            formdata.append('pid', jQuery('input[name=pid]').val());
            formdata.append('cnote', jQuery('textarea[name=cnote]').val());

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Submit');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        ifields.val('');
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    }
                }
            })
        }
    });

    $("body").on('change', '.nstop', function () {
        var me = $(this),
            fgroup = me.closest('.form-group'),
            start_h = fgroup.find('.cstarth'),
            end_h = fgroup.find('.cendh'),
            isdisable = false;
        if (me.is(':checked')) {
            isdisable = true;
        } else {
            isdisable = false;
        }
        start_h.prop('disabled', isdisable).selectpicker('refresh');
        end_h.prop('disabled', isdisable).selectpicker('refresh');
    });

    jQuery(".btn.btn-add.btn-whou").click(function (e) {
        e.preventDefault();
        e.preventDefault();
        var wrapper = jQuery("#whours");
        var cwho = 0;
        if (wrapper.find('li.item').length) {
            cwho = wrapper.find('li.item:last-child').attr("data-num");
        }
        cwho++;
        var me = $("#fwhou");
        var f_day_start = $(me).find('select[name=ds]'),
            day_start = f_day_start.val(),
            f_day_end = $(me).find('select[name=de]'),
            day_end = f_day_end.val(),
            f_start = $(me).find('select[name=startH]'),
            start = f_start.val(),
            f_end = $(me).find('select[name=endH]'),
            end = f_end.val(),
            fullday = $(me).find('input[name=nonstop]');
        var final_day = day_end !== '-' ? day_start + " - " + day_end : day_start;
        if ($.trim(day_start) === '') {
            // console.log('asdasd');
            return false;
        }

        if (fullday.prop('checked')) {
            start = '12am';
            end = '11pm'
        }

        var wcontent = "<li class=\"item\" data-num=\"" + cwho + "\">";
        wcontent += "<input type=\"hidden\" name=\"d_" + cwho + "\" value=\"" + final_day + "|" + start + "|" + end + "\">";
        wcontent += final_day + " <span>" + start + " - " + end + "</span>";
        wcontent += "<a class=\"del-btn\" href=\"#\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>";
        wcontent += "</li>";

        wrapper.append(wcontent);

        f_day_start.val('Monday').prop('disabled', false).selectpicker('refresh');
        f_day_end.val('Friday').prop('disabled', false).selectpicker('refresh');
        f_start.val('8am').prop('disabled', false).selectpicker('refresh');
        f_end.val('5pm').prop('disabled', false).selectpicker('refresh');
        fullday.prop('checked', false);
    });
    // jQuery("#fwhou").submit(function (e) {
    //     e.preventDefault();
    //     var wrapper = jQuery("#whours");
    //     var cwho = 0;
    //     if (wrapper.find('li.item').length) {
    //         cwho = wrapper.find('li.item:last-child').attr("data-num");
    //     }
    //     cwho++;
    //     var me = $(this);
    //     var day = me.find('input[name=dn]').val(),
    //         start = me.find('select[name=ws]').val(),
    //         end = me.find('select[name=we]').val();
    //     if ($.trim(day) === '') {
    //         return false;
    //     }
    //     var wcontent = "<li class=\"item\" data-num=\"" + cwho + "\">";
    //     wcontent += "<input type=\"hidden\" name=\"d_" + cwho + "\" value=\"" + day + "|" + start + "|" + end + "\">";
    //     wcontent += day + " <span>" + start + " - " + end + "</span>";
    //     wcontent += "<a class=\"del-btn\" href=\"#\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>";
    //     wcontent += "</li>";
    //
    //     wrapper.append(wcontent);
    // });

    jQuery("#swhou").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                btn = $(form).find('.btn-savewhou'),
                btn_txt_ori = btn.html(),
                snotice = $("#snotice");

            btn.prop('disabled', true).html('Saving...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'swhou',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    btn.prop('disabled', false);
                    btn.html(btn_txt_ori);
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                    }
                }
            })
        }
    });

    jQuery(".btn-resetwhou").click(function (e) {
        var whouwp = $("#whours");
        whouwp.html("");
    });

    function sgs(data) {
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'gstrtd',
                'sobj': data
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {
                    return false;
                } else {
                    location.href = data.callback;
                }
            }
        })
    }

    jQuery("#gs1").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                btn = $(form).find('.btn-gs');
            btn.html("Loading...");
            sgs(data)
        }
    });

    jQuery("#gs2").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                btn = $(form).find('.btn-gs');
            btn.html("Loading...");
            sgs(data)
        }
    });

    jQuery("#fugl input:file.fgallery").change(function () {
        var fugl = $("#fugl"),
            notice = $("#xyznotice"),
            formdata = false,
            row_images = $("#rimgs"),
            gids = [],
            curgallelm = $("input[name=curgall]"),
            curgall = curgallelm.val();

        notice.html('');

        $.each(fugl.find(".gids"), function (x, obj) {
            gids.push($(obj).val());
        });

        if (window.FormData) {
            formdata = new FormData();
        }
        var logo_data = $(this);

        $.each($(logo_data), function (i, obj) {
            $.each(obj.files, function (j, file) {
                formdata.append('logos[' + j + ']', file);
            })
        });

        // our AJAX identifier
        formdata.append('action', 'upfile');
        formdata.append('gids', gids);
        formdata.append('curgall', curgall);

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: formdata,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
                var upwrapper = fugl.find('div.upload-file'),
                    span_preview = upwrapper.find('span.image-preview');
                upwrapper.removeClass("has-file");
                span_preview.removeAttr("style");
                if (data.is_error) {
                    notice.html(alert_wrapper(data.message, 'Sorry', 'warning', true));
                    // alert(data.message);
                } else {
                    curgallelm.val(parseInt(curgall, 10) + 1);
                    row_images.append("<div class=\"col-sm-4\"><div class=\"box-img\"><a class=\"img\" href=\"" + data.callback['medium'] + "\" style=\"background-image: url(" + data.callback['thumbnail'] + ")\" data-lity></a><input type=\"hidden\" class=\"gids\" value=\"" + data.callback['id'] + "\"> <a class=\"btn-del gal\" href=\"#\">Delete</a></div></div>")
                }
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        })
    });

    $("body").on('click', '.box-img .btn-del.gal', function (e) {
        e.preventDefault();
        var me = $(this),
            wrapper = $(this).closest('.box-img'),
            fugl = $("#fugl"),
            gids = [],
            myid = wrapper.find('input:hidden').val(),
            curgallelm = $("input[name=curgall]"),
            curgall = curgallelm.val();


        $.each(fugl.find(".gids"), function (x, obj) {
            gids.push($(obj).val());
        });

        wrapper.addClass('loading');
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'delfile',
                'lgids': gids,
                'me': myid
            },
            dataType: 'json',
            success: function (data) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
                wrapper.removeClass('loading');
                var mebox = me.closest('.col-sm-4');
                if (mebox.length) {
                    mebox.remove();
                }
                curgallelm.val(parseInt(curgall, 10) - 1);
            }
        });
    });

    $("body").on('click', 'a.marall', function (e) {
        e.preventDefault();
        var me = $(this),
            wrapper = me.closest('div.quote-request'),
            trs = wrapper.find('tr.ids'),
            gids = [];

        $.each(trs, function (x, y) {
            if ($(y).find('input[type=checkbox]').is(':checked')) {
                gids.push($(y).attr("data-id"));
            }
        });

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'rmnotif',
                'nids': gids
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {
                } else {
                    $.each(trs, function (x, y) {
                        if ($(y).find('input[type=checkbox]').is(':checked')) {
                            $(y).removeClass("unread");
                            $(y).find('input[type=checkbox]').prop('checked', false);
                        }
                    });
                }
                // wrapper.removeClass('loading');
                // var mebox = me.closest('.col-sm-4');
                // if (mebox.length) {
                //     mebox.remove();
                // }
            }
        });
    });

    $("body").on('click', 'a.delall', function (e) {
        e.preventDefault();
        var me = $(this),
            wrapper = me.closest('div.quote-request'),
            trs = wrapper.find('tr.ids'),
            gids = [];

        $.each(trs, function (x, y) {
            if ($(y).find('input[type=checkbox]').is(':checked')) {
                gids.push($(y).attr("data-id"));
            }
        });

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'rmdelete',
                'nids': gids
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_error) {
                } else {
                    $.each(trs, function (x, y) {
                        if ($(y).find('input[type=checkbox]').is(':checked')) {
                            $(y).remove();
                        }
                    });
                }
                // wrapper.removeClass('loading');
                // var mebox = me.closest('.col-sm-4');
                // if (mebox.length) {
                //     mebox.remove();
                // }
            }
        });
    });

    //Detail notifications
    var modal_step1 = $("#quoteView"),
        modal_step2 = $("#quoteView2"),
        modal_step3 = $("#quoteView3"),
        modal_step4 = $("#quoteView4"),
        modal_viewbid = $("#quoteViewBid"),
        modal_viewbids = $("#mViewBids");

    $("body").on('click', '.btn-read-notice', function (e) {
        e.preventDefault();
        var me = $(this),
            wrapper = $(this).closest('tr'),
            nid = wrapper.attr("data-id"),
            me_or_text = me.html();
        me.html("Loading...").addClass("disabled");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'qdetail',
                'nid': nid
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    var modal_body = modal_step1.find(".modal-body"),
                        modal_body_form = modal_body.find('form'),
                        modal_header = modal_body.closest('.modal-content').find('.modal-header');

                    modal_body.removeClass("quotation-details");
                    modal_body.addClass("form-get-quote");

                    if (data.callback) { //it means it's already bid
                        modal_header.append('<div class="modal-badge modal-badge-primary"><span>Submitted</span></div>');
                        $.each(modal_step1.find("ul.step-wizz li"), function (x, y) {
                            if (!$(y).hasClass("active")) {
                                $(y).addClass("active");
                            }
                        })
                    } else {
                        modal_header.html("<h3>Quotation Information</h3>");
                        $.each(modal_step1.find("ul.step-wizz li"), function (x, y) {
                            if (x > 0) {
                                if ($(y).hasClass("active")) {
                                    $(y).removeClass("active");
                                }
                            }
                        })
                    }
                    modal_body_form.html(data.other);
                    modal_step1.modal('show');
                    me.html(me_or_text).removeClass("disabled");
                    // location.href = data.callback;
                    wrapper.removeClass('unread');
                }
            }
        });
    });

    $("body").on("click", ".btn-q-back", function () {
        modal_viewbid.modal('hide');
        setTimeout(function () {
            modal_step1.modal('show');
        }, 500)
    })

    $("body").on('click', '.btn-view-bid', function (e) {
        e.preventDefault();
        var me = $(this),
            bid = me.data("bid"),
            ori_text = me.html();
        me.addClass("disabled").html("Loading...");
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'vbid',
                'bid': bid
            },
            dataType: 'json',
            success: function (data) {
                var modal_body = modal_viewbid.find(".modal-body"),
                    modal_header = modal_body.closest('.modal-content').find('.modal-header');
                if (data.callback === 1) { //it means it's approved
                    modal_header.append('<div class="modal-badge modal-badge-success"><span>Approved</span></div>');
                } else if (data.callback === 2) {
                    modal_header.append('<div class="modal-badge modal-badge-danger"><span>Rejected</span></div>');
                } else {
                    modal_header.append('<div class="modal-badge modal-badge-secondary"><span>Waiting</span></div>');
                }
                modal_body.html(data.other);
                modal_step1.modal('hide');
                setTimeout(function () {
                    modal_viewbid.modal('show')
                    me.removeClass("disabled").html(ori_text);
                }, 500);
            }
        })
    });

    $("body").on("click", ".btn-go-quote", function (e) {
        var me = $(this),
            qid = me.data("qid"),
            nid = me.data("nid"),
            ori_text = me.html();
        me.addClass("disabled").html("Loading");
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'qst1',
                'qid': qid,
                'nid': nid
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    var modal_body = modal_step2.find(".modal-body form");
                    modal_body.html(data.other);
                    modal_body.find('.dtpckr').each(function () {
                        var date = new Date(),
                            today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

                        $(this).datepicker({
                            // daysOfWeekDisabled: [0],
                            format: 'dd/mm/yyyy',
                            autoclose: true,
                            startDate: today
                        });
                    });
                    modal_step1.modal('hide');
                    setTimeout(function () {
                        modal_step2.modal('show');
                    }, 500);

                    me.removeClass("disabled").html(ori_text);
                }
            }
        })
    });

    $("body").on("click", ".btn-back-1", function (e) {
        modal_step2.modal("hide");
        setTimeout(function () {
            modal_step1.modal("show");
        }, 500)
    });

    $("#fqv2").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input'),
                btn = $(form).find('.btn-quote-2'),
                ori_text = btn.html();

            ifields.prop('disabled', true);
            btn.addClass('disabled').html('Loading...');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'qst2',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    if (!data.is_error) {
                        var modal_body = modal_step3.find(".modal-body form");
                        modal_body.html(data.other);
                        modal_body.find('.multiplier').each(function () {
                            var t = $(this),
                                limit = t.data('limit'),
                                item = t.find('.item').eq(0),
                                add = t.find('.btn-add'),
                                target = t.find('.box-item'),
                                format;

                            item.find('select').each(function () {
                                $(this).selectpicker('destroy');
                            });

                            format = item.clone().hide();
                            bind(item);

                            function bind(obj) {
                                $('select.select').each(function () {
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
                                $(".num-only").keypress(function (e) {
                                    if (e.which != 8 && e.which != 0 && e.which != 43 && (e.which < 48 || e.which > 57)) {
                                        return false;
                                    }
                                });
                                viewQuote();
                                $('.currency').each(function () {
                                    $(this).keyup(function () {
                                        $(this).rupiah();
                                    })
                                });
                            }

                            function reOrder(obj) {
                                var itm = obj.find('.item');
                                itm.each(function (i) {
                                    var tmp = i + 1;
                                    //re order name
                                    $(this).find('input').each(function () {
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
                                }

                                // show and hide add button
                                if (itm.length >= limit) {
                                    t.addClass('limited');
                                } else {
                                    t.removeClass('limited');
                                }

                                // set item length
                                modal_body.find('input[name=amountCount]').val(itm.length);
                            }

                            add.click(function (e) {
                                e.preventDefault();
                                var html = format.clone();
                                target.append(html);
                                bind(html);
                                html.slideDown(300);
                                reOrder(target);
                            });

                            // DELETE
                            $('body').on('click', '.btn-delete', function (e) {
                                e.preventDefault();
                                var parent = $(this).closest('.item'),
                                    target = parent.closest('.box-item');

                                parent.slideUp(300, function () {
                                    parent.remove();
                                    reOrder(target);
                                });
                            });
                        });
                        modal_body.find('.upload-file').each(function (e) {
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
                                    reader.onload = function (e) {
                                        prev.css('background-image', 'url(' + e.target.result + ')');
                                        // console.log('hai');
                                    }
                                    reader.readAsDataURL(input.files[0]);
                                }
                            }

                            function alertUpload(par) {
                                var text = par;
                                $('body').append('<div class="alert-upload"><div class="alert alert-danger"><i class="close fa fa-times" data-dismiss="alert"></i>' + text + '</div></div>');
                                $('.alert-upload').fadeIn(300);

                                $(function () {
                                    setTimeout(function () {
                                        $('.alert-upload').fadeOut(300);
                                    }, 3000);
                                });
                                $(function () {
                                    setTimeout(function () {
                                        $('.alert-upload').remove();
                                    }, 3500);
                                });
                            }

                            input.change(function (e) {
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
                                            case 'txt' :
                                            case 'jpg' :
                                            case 'png' :
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
                                            case 'svg' :
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

                            del.click(function () {
                                if (prev.length != 0) {
                                    $('.image-preview').css('background-image', '');
                                }

                                info.addClass('deleted');
                                input.val('');
                                t.removeClass('has-file');

                                toggleDel();
                            })
                        });

                        modal_step2.modal('hide');
                        setTimeout(function () {
                            modal_step3.modal('show');
                        }, 500);

                        ifields.prop('disabled', false);
                        btn.removeClass("disabled").html(ori_text);
                    }
                }
            })
        }
    });

    $("body").on("click", ".btn-back-2", function (e) {
        modal_step3.modal("hide");
        setTimeout(function () {
            modal_step2.modal("show");
        }, 500)
    });

    $("#fqv3").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            var formdata = false,
                inputs = $(form).find('input[type=hidden]:enabled, input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, input[type=radio]:checked, select:enabled, textarea:enabled');
            if (window.FormData) {
                formdata = new FormData();
            }

            var attachment = $("#file");

            $.each($(attachment), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('files[' + j + ']', file);
                })
            });

            $.each(inputs, function (x, cont) {
                if (!$(cont).is(":disabled")) {
                    formdata.append('data[' + $(cont).attr("name") + ']', $(cont).val());
                }
            });

            // our AJAX identifier
            formdata.append('action', 'qst3');

            var btn = $(form).find('button.btn-quote-3');

            btn.addClass('disabled').html('Loading...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    if (!data.is_error) {
                        modal_step3.modal('hide');
                        setTimeout(function () {
                            modal_step4.modal('show');
                        }, 500)
                    }
                }
            })
        }
    });

    $("body").on('click', '.btn-sim-quo', function (e) {
        e.preventDefault();
        var me = $(this),
            qid = me.data("qid");
        // me_or_text = me.html();
        me.addClass("disabled");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'iqdet',
                'qid': qid
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    $.each(modal_step1.find("ul.step-wizz li"), function (x, y) {
                        if (!$(y).hasClass("active")) {
                            $(y).addClass("active");
                        }
                    });
                    var modal_body = modal_step1.find(".modal-body");
                    modal_body.removeClass("quotation-details");
                    modal_body.addClass("form-get-quote");
                    modal_body.html(data.other);
                    modal_step1.modal('show');
                    me.removeClass("disabled");
                }
            }
        });
    });

    $("body").on('click', '.btn-show-bid', function (e) {
        e.preventDefault();
        var me = $(this),
            qid = me.data("qid");
        me.addClass("disabled");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'liabids',
                'qid': qid
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    var modal_body = modal_viewbids.find(".modal-body");
                    modal_body.html(data.other);
                    modal_viewbids.modal('show');
                    modal_body.find('[data-toggle="popover"]').popover();
                    me.removeClass("disabled");
                }
            }
        });
    });

    $("body").on("click", ".btn-shipper-ch-bid", function (e) {
        e.preventDefault();
        var me = $(this),
            bname = me.data("bname");
        me.html("Loading...").addClass("disabled");

        $(".btn-shipper-ch-bid").addClass("disabled");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'py',
                'bname': bname
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    location.href = data.callback;
                }
            }
        });
    });

    $("body").on("click", ".btn-shipper-det-bid-forw", function (e) {
        e.preventDefault();
        var me = $(this),
            me_ori = me.html(),
            bname = me.data("bname");
        me.html("Loading...").addClass("disabled");

        $(".btn-shipper-ch-bid").addClass("disabled");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'detbid',
                'bname': bname
            },
            dataType: 'json',
            success: function (data) {
                if (!data.is_error) {
                    var mdetBid = jQuery("#modalDetailBid"),
                        citem = mdetBid.find('.quote-item'),
                        fwprop = mdetBid.find('.fw-profile .img');
                    fwprop.css("background-image", "url(" + data.other + ")");
                    citem.html(data.callback);
                    mdetBid.modal('show');

                    me.html(me_ori).removeClass("disabled");
                }
            }
        });
    });

    jQuery(".btn-quoprev").click(function (e) {
        e.preventDefault();
        var stype = {
                'dtd': 'Door to Door',
                'dtp': 'Door to Port',
                'ptd': 'Port to Door'
            },
            shiptype = {
                'FCL': 'Full Container Load',
                'LCL': 'Less Container Load',
                'BB': 'Break Bulk',
                'OD': 'On Desk',
                'LB': 'Liquid Bulk',
                'DB': 'Dry Bulk'
            };

        var fgquote = jQuery("#fgqts"),
            inputs = fgquote.find('input[type=file]:enabled, input[type=hidden]:enabled, input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, input[type=radio]:checked, select:enabled, textarea:enabled'),
            dataInputs = [];
        $.each(inputs, function (x, cont) {
            dataInputs[$(cont).attr("name")] = $(cont).val();
        });

        if (dataInputs['type_of_trade'] !== '') {
            jQuery(".i_type_of_trade").html(capitalizeFirstLetter(dataInputs['type_of_trade']));
        }

        if (dataInputs['incoterms'] !== '') {
            jQuery(".i_incoterms").html(dataInputs['incoterms'].toUpperCase());
        }

        if (dataInputs['type_of_trade'] === 'domestic') {
            if (dataInputs['service_type'] !== '') {
                jQuery(".i_service_type").html(stype[dataInputs['service_type']]);
            }
        } else {
            jQuery(".i_service_type").html("-");
        }

        if (dataInputs['shipment_date'] !== '') {
            jQuery(".i_shipment_date").html(dataInputs['shipment_date']);
        }

        if (dataInputs['type_of_shipment'] !== '') {
            jQuery(".i_type_of_shipment").html(shiptype[dataInputs['type_of_shipment']]);
        }

        var origin_address = "";
        if ('origin_port' in dataInputs) {
            origin_address += dataInputs['origin_port'] + " ";
        }
        if ('origin_street_address' in dataInputs) {
            origin_address += dataInputs['origin_street_address'] + " ";
        }
        if ('origin_city' in dataInputs) {
            origin_address += dataInputs['origin_city'] + ", ";
        }
        if ('origin_province' in dataInputs) {
            origin_address += "<br/>" + dataInputs['origin_province'] + ", ";
        }
        if ('origin_country' in dataInputs) {
            origin_address += dataInputs['origin_country'];
        }
        jQuery(".i_origin").html(origin_address);

        var freight_class = dataInputs['type_of_transportation'] === "ocean" ? "freight-o" : "freight-a";
        jQuery("span.freight-type").attr("class", "freight-type " + freight_class);

        var destination_address = "";
        if ('destination_port' in dataInputs) {
            destination_address += dataInputs['destination_port'] + " ";
        }
        if ('destination_street_address' in dataInputs) {
            destination_address += dataInputs['destination_street_address'] + " ";
        }
        if ('destination_city' in dataInputs) {
            destination_address += dataInputs['destination_city'] + ", ";
        }
        if ('destination_province' in dataInputs) {
            destination_address += "<br/>" + dataInputs['destination_province'] + ", ";
        }
        if ('destination_country' in dataInputs) {
            destination_address += dataInputs['destination_country'];
        }
        jQuery(".i_destination").html(destination_address);

        var loop_cargo = jQuery(".loop_cargo"),
            numcargo = dataInputs['cargocount'],
            outputhtml = '';
        for (var i = 0; i < numcargo; i++) {
            outputhtml += "<div class='cargo-detail row'>";
            outputhtml += "<dl class='col-md-12'>";
            outputhtml += "<dt>Cargo Description:</dt>";
            outputhtml += "<dd>" + dataInputs['describe_' + i] + "</dd>";
            outputhtml += "</dl>";
            if (dataInputs['packaging_' + i]) {
                outputhtml += "<dl class='col-md-12 pt15'>";
                outputhtml += "<dt>Packaging:</dt><dd>" + dataInputs['packaging_' + i] + "</dd>";
                outputhtml += "</dl>";
            }
            if (dataInputs['type_of_transportation'] === 'ocean') {
                outputhtml += "<dl class='col-md-6'>";
                outputhtml += "<dt>Unit length:</dt><dd>" + dataInputs['unit-length_' + i] + " cm</dd>";
                outputhtml += "<dt>Unit width:</dt><dd>" + dataInputs['unit-width_' + i] + " cm</dd>";
                outputhtml += "<dt>Unit height:</dt><dd>" + dataInputs['unit-height_' + i] + " cm</dd>";
                outputhtml += "</dl>";
                outputhtml += "<dl class='col-md-6'>";
                outputhtml += "<dt>Quantity:</dt><dd>" + dataInputs['quatity_' + i] + " unit(s)</dd>";
                outputhtml += "<dt>Unit weight:</dt><dd>" + dataInputs['unit-weight_' + i] + " kg</dd>";
                outputhtml += "</dl>";
                outputhtml += "<dl class='col-md-12 pt15'>";
                outputhtml += "<dt>Total volume:</dt><dd>" + dataInputs['total-volume_' + i] + " m3</dd>";
                outputhtml += "<dt>Total weight:</dt><dd>" + dataInputs['total-weight_' + i] + " metric ton</dd>";
                outputhtml += "</dl>";
                outputhtml += "<dl class='col-md-12 pt15'>";
                outputhtml += "<dt>HS code:</dt><dd>" + dataInputs['hs_code_' + i] + "</dd>";
                outputhtml += "</dl>";
            }
            outputhtml += "</div>";
        }
        loop_cargo.html(outputhtml);

        var insurance_value = dataInputs['insurance'] === '1' ? "Yes" : "No";
        jQuery(".i_insurance").html(insurance_value);


        if (dataInputs['insurance'] === '1') {
            if (dataInputs['shipment_value'] !== '' && dataInputs['shipment_value'] !== 'undefined') {
                jQuery(".i_shipment_value").html(dataInputs['currency'] + " " + dataInputs['shipment_value']);
            }
        } else {
            jQuery(".i_shipment_value").html("-");
        }

        var request_refrigeration_value = dataInputs['request_refrigeration'] === '1' ? "Yes" : "No";
        jQuery(".i_request_refrigeration").html(request_refrigeration_value);

        var request_certificate_value = dataInputs['request_certificate'] === '1' ? "Yes" : "No";
        jQuery(".i_request_certificate").html(request_certificate_value);

        var transhipment_value = dataInputs['transhipment'] === '1' ? "Allowed" : "Not allowed";
        jQuery(".i_transhipment").html(transhipment_value);

        var transitment_value = dataInputs['transitment'] === '1' ? "Allowed" : "Not allowed";
        jQuery(".i_transitment").html(transitment_value);

        if (dataInputs['additional_information'] !== '' && dataInputs['additional_information'] !== 'undefined') {
            jQuery(".i_additional_information").html(dataInputs['additional_information']);
        } else {
            jQuery(".i_additional_information").html("-");
        }

        if (dataInputs['file']) {
            jQuery(".i_attachment").html(dataInputs['file'].split(/(\\|\/)/g).pop());
        } else {
            jQuery(".i_attachment").html("-");
        }
    });

    jQuery(".btn-quote").click(function (e) {
        e.preventDefault();
        doSaveQuote(true);
    });

    jQuery(".btn-sbt-quote").click(function (e) {
        e.preventDefault();
        doSaveQuote(false);
    });

    //Old method
    // function doSaveQuote(foreground) {
    //     if (!foreground) {
    //         isBusy = true;
    //     }
    //     var notifplan = '',
    //         notifloading = '',
    //         notifcontent = '',
    //         btnSubmit = '',
    //         fgquote = jQuery("#fgqts"),
    //         inputs = fgquote.find('input[type=hidden]:enabled, input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, input[type=radio]:checked, select:enabled, textarea:enabled'),
    //         formdata = false,
    //         wnotice = '';
    //
    //     if (foreground) {
    //         notifplan = $("#notifplan");
    //         notifloading = notifplan.find("#notifloading");
    //         notifcontent = notifplan.find("#notifcontent");
    //         btnSubmit = $(".btn-quote");
    //         wnotice = $("#wnotice");
    //
    //         notifplan.modal({
    //             backdrop: 'static',
    //             keyboard: false
    //         });
    //
    //         btnSubmit.prop('disabled', true).html("Submitting...");
    //         wnotice.html('');
    //     }
    //
    //     if (window.FormData) {
    //         formdata = new FormData();
    //     }
    //
    //     var logo_data = $("#file");
    //
    //     $.each($(logo_data), function (i, obj) {
    //         $.each(obj.files, function (j, file) {
    //             formdata.append('files[' + j + ']', file);
    //         })
    //     });
    //
    //     $.each(inputs, function (x, cont) {
    //         if (!$(cont).is(":disabled")) {
    //             formdata.append('txt[' + $(cont).attr("name") + ']', $(cont).val());
    //         }
    //     });
    //
    //     // our AJAX identifier
    //     formdata.append('action', 'gqts');
    //
    //     $.ajax({
    //         url: my_ajax_object.ajax_url,
    //         type: 'POST',
    //         data: formdata,
    //         dataType: 'json',
    //         processData: false,
    //         contentType: false,
    //         success: function (data) {
    //             if (foreground) {
    //                 if (data.is_error) {
    //                     btnSubmit.prop('disabled', false).html("Submit");
    //                     notifplan.modal('hide');
    //                     wnotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
    //                 } else {
    //                     window.location = data.callback;
    //                 }
    //             } else {
    //                 isBusy = false;
    //             }
    //         }
    //     });
    // }


    //New method
    function doSaveQuote(foreground) {
        if (!foreground) {
            isBusy = true;
        }
        var notifplan = '',
            notifloading = '',
            notifcontent = '',
            btnSubmit = '',
            fgquote = jQuery("#fgqts4"),
            wnotice = '';

        if (foreground) {
            notifplan = $("#notifplan");
            notifloading = notifplan.find("#notifloading");
            notifcontent = notifplan.find("#notifcontent");
            btnSubmit = $(".btn-quote");
            wnotice = $("#wnotice");

            notifplan.modal({
                backdrop: 'static',
                keyboard: false
            });

            btnSubmit.prop('disabled', true).html("Submitting...");
            wnotice.html('');
        }

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'POST',
            data: {
                'action': 'gqts4'
            },
            dataType: 'json',
            success: function (data) {
                if (foreground) {
                    if (data.is_error) {
                        btnSubmit.prop('disabled', false).html("Submit");
                        notifplan.modal('hide');
                        wnotice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        window.location = data.callback;
                    }
                } else {
                    isBusy = false;
                }
            },
            error: function () {
                console.log('wkwkwkwk');
            }
        });
    }

    function doQueueLogin(data) {
        var form = $("#frm_lg"),
            ifields = $(form).find('input[type=text], input[type=password]'),
            btn = $(form).find('.btn-log'),
            snotice = $("#snotice");

        console.log(isBusy);
        if (isBusy) {
            instantReloadLogin = true;
            setTimeout(function () {
                doQueueLogin(data)
            }, 500);
        } else {
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'ulogin',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    console.log("instant? " + instantReloadLogin);
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Login');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        ifields.val('');
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                        if (instantReloadLogin) {
                            console.log("instant oouuuyy");
                            window.location.href = data.callback;
                        } else {
                            setTimeout(function () {
                                window.location.href = data.callback;
                            }, 3000);
                        }
                    }
                }
            })
        }
    }

    jQuery("#ucont").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input, select'),
                btn = $(form).find('.btn-cont'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'ucont',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Save changes');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                    }
                }
            })
        }
    });

    jQuery("#ucat").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var most_cargo = $(form).find('select[name=mocargo]'),
                most_service = $(form).find('select[name=moservice]'),
                most_int = $(form).find('select[name=tint]'),
                // most_dom = $(form).find('input[name=tdom]'),
                btn = $(form).find('.btn-ucat'),
                snotice = $("#snotice");

            most_cargo.prop('disabled', true);
            most_service.prop('disabled', true);
            most_int.prop('disabled', true);
            // most_dom.prop('disabled', true);

            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'ucat',
                    'c': most_cargo.val(),
                    's': most_service.val(),
                    'i': most_int.val(),
                    // 'd': most_dom.attr('data-val')
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    most_cargo.prop('disabled', false);
                    most_service.prop('disabled', false);
                    // most_dom.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Save changes');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                    }
                }
            })
        }
    });

    jQuery("#fshpr").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var data = $(form).serializeArray(),
                ifields = $(form).find('input, select'),
                btn = $(form).find('.btn-shpr'),
                snotice = $("#snotice");

            ifields.prop('disabled', true);
            btn.prop('disabled', true);
            btn.html('Submitting...');
            snotice.html('');
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'fshpr',
                    'sobj': data
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    ifields.prop('disabled', false);
                    btn.prop('disabled', false);
                    btn.html('Save changes');
                    if (data.is_error) {
                        snotice.html(alert_wrapper(data.message, 'Oops!', 'warning', true));
                    } else {
                        snotice.html(alert_wrapper(data.message, "Great!", "success", true));
                    }
                    if (data.callback) {
                        setTimeout(function () {
                            location.href = data.callback;
                        }, 3000);
                    }
                }
            })
        }
    });

    jQuery("#fdosubs").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

        },
        submitHandler: function (form, e) {
            e.preventDefault();
            var email = $(form).find('input[name=eml]'),
                notice = $('#qwenotice');
            notice.html('');
            email.prop('disabled', true);
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'do_subs',
                    'eml': email.val()
                },
                dataType: 'json',
                success: function (data) {
                    email.prop('disabled', false);
                    if (data.is_error) {
                        notice.html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        email.val('');
                        notice.html(alert_wrapper(data.message, 'Thank you!', 'success', true));
                    }
                }
            })
        }
    });

    //Load more forwarders
    jQuery('body').on('click', '#forwarderspagination ul li a', function (e) {
        e.preventDefault();

        var me = $(this),
            p = me.html();
        var currentPage = jQuery("#forwarderspagination ul li span.current").html();
        if (me.hasClass('prev')) {
            p = parseInt(currentPage, 10) - 1;

        } else if (me.hasClass('next')) {
            p = parseInt(currentPage, 10) + 1;
        }
        // link = me.attr("href"),
        // splitarr = link.split('#'),
        // p = splitarr[splitarr.length - 1];

        browse_forwarders(p, false);
    });

    //Load more warehouses
    jQuery('body').on('click', '#warehousespagination ul li a', function (e) {
        e.preventDefault();

        var me = $(this),
            p = me.html();
        var currentPage = jQuery("#warehousespagination ul li span.current").html();
        if (me.hasClass('prev')) {
            p = parseInt(currentPage, 10) - 1;

        } else if (me.hasClass('next')) {
            p = parseInt(currentPage, 10) + 1;
        }
        // link = me.attr("href"),
        // splitarr = link.split('#'),
        // p = splitarr[splitarr.length - 1];

        browse_warehouses(p, false);
    });

    jQuery(".btn-tstnext").click(function (e) {
        e.preventDefault();
        var me = $('a.btn-tstnext'),
            page = me.attr('data-page'),
            parent = $("#testimonials_container"),
            listswrapper = parent.find(".testilists"),
            lmoreparent = parent.find('.lmparent');

        me.addClass("disabled");
        me.html("Loading...");
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'tstmnl',
                'p': page
            },
            dataType: 'json',
            success: function (data) {
                me.removeClass("disabled");
                me.html("Load more");
                if (data.is_error) {
                } else {
                    $.each(data.items, function (x, y) {
                        var tempHtml = "<div class=\"col-md-3\">";
                        tempHtml += "<div class=\"item\">";
                        tempHtml += y.content;
                        tempHtml += "<div class=\"content\">";
                        tempHtml += "<div class=\"img\" style=\"background-image: url(" + y.picture + ");\"></div>";
                        tempHtml += "<h4>" + y.name + "</h4>";
                        tempHtml += y.location;
                        tempHtml += "</div>";
                        tempHtml += "</div>";
                        tempHtml += "</div>";

                        listswrapper.append(tempHtml);
                    });

                    if (data.total_pages > page) {
                        var nextpage = parseInt(page) + 1;
                        console.log(page);
                        console.log(data.total_pages);
                        console.log(nextpage);
                        me.attr('data-page', nextpage);
                    } else {
                        lmoreparent.remove();
                    }
                }
            }
        });
    });

    jQuery(".btn-repayment").click(function (e) {
        e.preventDefault();
        var me = $(this);

        me.prop("disabled", true).html("Please wait, let me set it for you...");
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'repayment'
            },
            dataType: 'json',
            success: function (data) {
                me.prop('disabled', false).html("I'll do payment again");
                if (data.is_error) {
                    alert(data.message);
                } else {
                    location.reload();
                }
            }
        })
    });

    //Get quote step 1
    jQuery("#fgqts1").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var fg = $(element).closest('.valthis');
            error.appendTo(fg);
        },
        submitHandler: function (form, e) {
            e.preventDefault();

            var btn = $(form).find('button.btn'),
                mLoading = $("#notifplan");

            mLoading.modal({
                backdrop: 'static',
                keyboard: false
            });
            btn.prop('disabled', true).html('Loading...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'gqts1',
                    'data': $(form).serializeArray()
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    btn.prop('disabled', false).html('Continue');
                    if (data.is_error) {
                        mLoading.modal('hide');
                        jQuery("#wnotice").html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        location.href = data.callback;
                    }
                }
            })
        }
    })

    //Get quote step 2
    jQuery("#fgqts2").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var fg = $(element).closest('.valthis');
            error.appendTo(fg);
        },
        submitHandler: function (form, e) {
            e.preventDefault();

            var btn = $(form).find('button.btn'),
                mLoading = $("#notifplan");

            mLoading.modal({
                backdrop: 'static',
                keyboard: false
            });
            btn.prop('disabled', true).html('Loading...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'gqts2',
                    'data': $(form).serializeArray()
                },
                dataType: 'json',
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    btn.prop('disabled', false).html('Continue');
                    if (data.is_error) {
                        mLoading.modal('hide');
                        jQuery("#wnotice").html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        location.href = data.callback;
                    }
                }
            })
        }
    })

    //Get quote step 3
    jQuery("#fgqts3").validate({
        focusInvalid: true,
        invalidHandler: function (form, validator) {

            if (!validator.numberOfInvalids())
                return;

            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 100
            }, 1000);

        },
        errorPlacement: function (error, element) {
            var fg = $(element).closest('.valthis');
            error.appendTo(fg);
        },
        submitHandler: function (form, e) {
            var formdata = false,
                inputs = $(form).find('input[type=hidden]:enabled, input[type=number]:enabled, input[type=checkbox]:checked, input[type=text]:enabled, input[type=radio]:checked, select:enabled, textarea:enabled');
            if (window.FormData) {
                formdata = new FormData();
            }

            var logo_data = $("#file");

            $.each($(logo_data), function (i, obj) {
                $.each(obj.files, function (j, file) {
                    formdata.append('files[' + j + ']', file);
                })
            });

            $.each(inputs, function (x, cont) {
                if (!$(cont).is(":disabled")) {
                    formdata.append('data[' + $(cont).attr("name") + ']', $(cont).val());
                }
            });

            // our AJAX identifier
            formdata.append('action', 'gqts3');

            var btn = $(form).find('button.btn'),
                mLoading = $("#notifplan");

            mLoading.modal({
                backdrop: 'static',
                keyboard: false
            });
            btn.prop('disabled', true).html('Loading...');

            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 'slow');
                    btn.prop('disabled', false).html('Continue');
                    if (data.is_error) {
                        mLoading.modal('hide');
                        jQuery("#wnotice").html(alert_wrapper(data.message, 'Sorry!', 'warning', true));
                    } else {
                        location.href = data.callback;
                    }
                }
            });
        }
    })

    function do_switch_account() {
        var modalAccountNotFound = $("#accountNotCreatedModal"),
            notifloading = modalAccountNotFound.find('#notifloading'),
            notifmain = modalAccountNotFound.find('#notifmain'),
            notiffooter = modalAccountNotFound.find('.modal-footer');

        notifloading.show();
        notifmain.hide();
        notiffooter.hide();

        modalAccountNotFound.modal("show");
        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'cheswiacc'
            },
            dataType: 'json',
            success: function (data) {
                setTimeout(function () {
                    if (data.is_error) {
                        if (data.callback) {
                            location.href = data.callback;
                        } else if (data.code === 404) {
                            notifloading.hide();
                            notifmain.show();
                            notiffooter.show();
                        }
                    } else {
                        if (data.callback) {
                            location.href = data.callback;
                        }
                    }
                }, 2000)

                modalAccountNotFound.on('hidden.bs.modal', function () {
                    notifmain.hide();
                    notiffooter.hide();
                    notifloading.show();
                })
            }
        });
    }

    jQuery("a.swacc").click(function (e) {
        e.preventDefault();
        do_switch_account();
    });

    jQuery('.btn.cofm').click(function () {
        var me = $(this),
            me_ori_text = me.html();
        me.addClass("disabled").html("Creating...");

        $.ajax({
            url: my_ajax_object.ajax_url,
            type: 'GET',
            data: {
                'action': 'genmetwin'
            },
            dataType: 'json',
            success: function (data) {
                if (data.callback) {
                    location.href = data.callback;
                }

                if (data.is_error) {

                } else {
                    setTimeout(function () {
                        me.removeClass("disabled").html(me_ori_text);
                        do_switch_account();
                    }, 2000);
                }

            }
        })
    })

    $("body").on('change', 'input:checkbox[name=pr]', function (e) {
        var chbox = $("input:checked[name=pr]"),
            chboxval = [];
        $.each($(chbox), function (b, c) {
            chboxval.push($(c).val());
        });

        var me_li = $(this).closest("li"),
            child = $(me_li).find("ul"),
            childli = $(child).find("li");
        if ($(this).is(":checked")) {
            childli.show();
        } else {
            childli.hide();
            console.log("no");
        }

        if (chboxval.length > 0) {
            $.ajax({
                url: my_ajax_object.ajax_url,
                type: 'POST',
                data: {
                    'action': 'swtchprvdr',
                    'cls': chboxval.join()
                },
                dataType: 'json',
                success: function (data) {

                }
            });
        } else {
            return false;
        }
    })
});