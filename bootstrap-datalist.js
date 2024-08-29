(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function ($) {
            return factory($);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(this, function ($) {
    const www = function () {
        "use strict";
        return build();
        function build() {
            return {
                css: buildCss(),
            }
        }
        function buildCss() {
            return {
                top: {
                    borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '0',
                    borderBottomColor: 'var(--bs-border-color)',
                    clipPath: 'inset(-0.25rem -0.25rem 0 -0.25rem)'
                },
                bottom: {
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    borderTop: 'none',
                    borderColor: '#86b7fe',
                    outline: '0',
                    boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                    clipPath: 'inset(0px -0.25rem -0.25rem -0.25rem)',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                }
            };
        }
    }();
    (function () {
        "use strict";
        let arr;
        let m = {
            initialize: function (input) {
                arr = {};
                arr.wrapper = input.parent('.datalist-wrapper');
                let wrapperWidth = arr.wrapper.width();
                arr.shown = input;
                if (arr.wrapper.children('.datalist-value').length < 1) {
                    let inputName = input.prop('name');
                    arr.shown = input.removeAttr('name list')
                    arr.wrapper.prepend('<input type="hidden" class="datalist-value" name="' + inputName + '">')
                }
                arr.hidden = arr.wrapper.children('.datalist-value');
                arr.datalist = arr.wrapper.children('datalist').addClass('dropdown-menu option-list').css('width', wrapperWidth);
                arr.options = arr.datalist.find('option').addClass('dropdown-item')
                if (arr.options.length > 0) {
                    // reset options
                    arr.options.removeClass('d-none active');
                    // rebuild if needed
                    arr.options.each(function () {
                        if (!$(this).text()) {
                            $(this).text($(this).val());
                        }
                        if (!$(this).val()) {
                            $(this).val($(this).text());
                        }
                    })
                    return true;
                }
                return false;
            },
            show: function (arr) {
                // apply styles
                arr.shown.css(www.css.top)
                arr.datalist.addClass('dropdown-menu option-list show').css(www.css.bottom)

                // if selected
                m.selected(arr)

                // controls
                m.mouse(arr);
                m.input(arr);
                m.keydown(arr);
            },
            hide: function (arr) {
                if (arr.hidden.val() === '') {
                    arr.shown.val('');
                }
                arr.datalist.removeClass('show');
                arr.shown.removeAttr('style');
            },
            mouse: function (arr) {
                arr.options.each(function () {
                    // on hover
                    $(this).mouseenter(function (e) {
                        e.stopImmediatePropagation();
                        arr.shown.val($(this).text());
                    })
                    $(this).mouseleave(function (e) {
                        e.stopImmediatePropagation();
                        if (arr.hidden.val() !== '') {
                            m.selected(arr);
                        } else {
                            arr.shown.val('');
                        }
                    })
                    // on click
                    $(this).mousedown(function (e) {
                        e.stopImmediatePropagation();
                        m.select(arr, $(this));
                        arr.shown.trigger('blur');
                    })
                })
            },
            input: function (arr) {
                // filtered input
                arr.shown.on('input', function (e) {
                    e.stopImmediatePropagation();
                    // clear selected value
                    arr.hidden.val('');
                    let inputKey = $(this).val();
                    arr.options.each(function () {
                        $(this).removeClass('active d-none');
                        let optVal = ($(this).text().toLowerCase());
                        if (optVal.indexOf(inputKey.toLowerCase()) === -1) {
                            $(this).addClass('d-none');
                        }
                        if (inputKey === $(this).text()) {
                            m.select(arr, $(this));
                        }
                    })
                })
            },
            keydown: function () {
                arr.shown.on('keydown', function (e) {
                    e.stopImmediatePropagation();
                    switch (e.keyCode) {
                        case 40:
                            m.change(arr, 'next');
                            break;
                        case 38:
                            m.change(arr, 'prev');
                            break;
                        case 9:
                            e.preventDefault();
                            arr.shown.trigger('blur');
                            break;
                        case 13:
                            e.preventDefault();
                            arr.shown.trigger('blur');
                            break;
                    }
                })
            },
            change: function (arr, action) {
                let filtered = arr.datalist.find('option:not(".d-none")');
                let key = m.active(filtered);
                let listLength = filtered.length;
                if (listLength < 1) {
                    return;
                }
                if (action === 'next') {
                    key++
                    if (key >= listLength) {
                        key = 0;
                    }
                } else {
                    key--
                    if (key < 0) {
                        key = (listLength - 1);
                    }
                }

                m.select(arr, $(filtered[key]));
            },
            active: function (list) {
                let key = -1;
                if ((list.length > 0) && (list.hasClass('active'))) {
                    let old = -1;
                    list.each(function () {
                        old++
                        if ($(this).hasClass('active')) {
                            key = old;
                        }
                    })
                }
                return key;
            },
            select: function (arr, elem) {
                arr.hidden.val(elem.val())
                arr.shown.val(elem.text())
                arr.options.removeClass('active');
                elem.addClass('active');
            },
            selected: function (arr) {
                let hiddenVal = arr.hidden.val();
                let shownVal = arr.shown.val();
                if ((hiddenVal !== '') && (shownVal !== '')) {
                    arr.options.each(function () {
                        if ($(this).val() === hiddenVal) {
                            m.select(arr, $(this));
                        }
                    })
                }

                if ((hiddenVal === '') && (shownVal !== '')) {
                    arr.options.each(function () {
                        if ($(this).text() === shownVal) {
                            m.select(arr, $(this));
                        }
                    })
                }
            },
        }
        $.fn.bootstrapDatalist = function () {
            $(this).on('focus', function () {
                if (m.initialize($(this)) === true) {
                    m.show(arr);
                }
            })
            $(this).on('focusout blur', function () {
                m.hide(arr);
            })
        }
    })();
});