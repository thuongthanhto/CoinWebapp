var fn = {
    localStorageKeys: {
        currentUserProfile: "currentUserProfile"
    },
    administratorRoleId: "51bd39ff-6679-454f-a1ec-9fef07d25f80",
    guestRoleId: "7b228cb2-505b-4e0d-ba69-a6c7908c7c4c",
    functions: {
        Home: 1,
        Topics: 2,
        Meetings: 3,
        OpenPoints: 4,
        Roles: 5,
        Users: 6,
        MeetingGroups: 7,
        Documents: 8,
        Guests: 9
    },
    permissions: {
        Create: 1,
        Read: 2,
        Update: 3,
        Delete: 4
    },

    isNumber: function (value) {
        var numbers = new RegExp(/^[0-9]+$/);
        return (numbers.test(value));
    },
    alert: function (str) {
        alert(str);
    },
    loadingObject: function (obj) {
        if ($('#wa-mask').length === 0) {
            if ($(obj).css('position') !== 'relative') {
                $(obj).css('position', 'relative');
            }
            oheight = $(obj).height();
            div = '<div id="wa-mask" class="wa-mask mask-object" style="height:' + oheight + 'px">&nbsp;</div>';
            //div += '?ang x? lý...';
            div += '<div id="wa-loading" class="wa-loading">&nbsp;</div>';
            $(div).appendTo($(obj));
        }
    },
    loadingWindow: function () {
        if ($('#wa-mask').length === 0) {
            oh = $(document).height();
            var top = $(document).scrollTop() + $(window).height() / 2;
            div = '<div id="wa-mask" class="wa-mask wa-mask-window" style="height:' + oh + 'px">&nbsp;</div>';
            div += '<div id="wa-loading" class="wa-loading wa-loading-window" style="top:' + top + 'px">&nbsp;</div>';
            $(div).appendTo($('html body'));
        }
    },
    reset: function () {
        if ($('#wa-mask, #wa-loading').length > 0) {
            $('#wa-mask, #wa-loading').remove();
        }
    },
    resetFilter: function (event) {
        //Reset textbox
        $(".filter input:text").val("");
        $(".filter input:text").trigger("change");

        //Reset dropdownlist
        $('.filter select').each(function () {
            var defaultValue = $(this).find("option[selected='selected']").val();
            if (defaultValue) {
                $(this).val(defaultValue);
            } else {
                $(this).val("");
            }
        });
        $(".filter select").trigger("change");

        //Reset select2 multiple select
        $(".select2-selection--multiple").parents(".select2-container").prev("select").select2('val', '-1');

        //Reset select2 single select
        $('select.select2').each(function () {
            var defaultValue = $(this).find("option:first").text();
            $(this).trigger("change");
            $(this).next(".select2-container").find(".select2-selection--single .select2-selection__rendered").text(defaultValue);
        });

        event.preventDefault();
    },
    redirect: function (url) {
        window.location = url;
    },
    getCurrentUserProfile: function () {
        return JSON.parse(localStorage.getItem(fn.localStorageKeys.currentUserProfile));
    },
    setCurrentUserProfile: function (currentUserProfile) {
        localStorage.setItem(fn.localStorageKeys.currentUserProfile, JSON.stringify(currentUserProfile));
    },
    removeCurrentUserProfile: function () {
        localStorage.removeItem(fn.localStorageKeys.currentUserProfile);
    },
    showSuccessToastr: function (message) {
        if (message != null && typeof (message) == 'string' && message.length > 0) {
            window.toastr["success"](message);
        }
    },
    showErrorToastr: function (message) {
        if (message != null && typeof (message) == 'string' && message.length > 0) {
            window.toastr["error"](message);
        }
    },
    accessDenied: function () {
        fn.redirect("#/access_denied");
    },
    cutString: function (source, maxLength) {
        maxLength = maxLength | 25;
        var result = source;
        if (result != null && result.length > maxLength) {
            var str = result.substring(0, maxLength);
            var lastSpace = str.lastIndexOf(' ');
            if (lastSpace > 0) {
                result = str.substring(0, lastSpace) + '...';
            }
        }
        return result;
    },
    hidePopover: function (element) {
        element = $(element).closest('div.popover');
        if (element.length > 0) {
            element.prev().trigger("click");
        }
    },
    newGuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    },
    convertUtcToLocalDate: function (date) {

        var offsetDate = date instanceof Date ? date.toJSON() : date;
        if (offsetDate != null && offsetDate.indexOf('Z') < 0) {
            offsetDate = offsetDate + 'Z';
        }
        var localDate = moment(offsetDate).local().toDate();
        return localDate;
    },

    checkDateTimeDefault: function (defaultVal, currentVal) {
        var isSameDate;
        if (defaultVal !== null && currentVal !== null && defaultVal !== undefined && currentVal !== undefined) {
            isSameDate = defaultVal.getFullYear() === currentVal.getFullYear()
                && defaultVal.getDate() === currentVal.getDate()
                && defaultVal.getMonth() === currentVal.getMonth();

        }
        else {
            isSameDate = defaultVal === currentVal;
        }
        return isSameDate ? "" : "border-orange";
    },
    getEndOfDeadline: function (deadlineVal) {
        var deadline = new Date(
           deadlineVal.getFullYear(),
           deadlineVal.getMonth(),
           deadlineVal.getDate(),
           23, 59, 59
       );
        return deadline;
    },
    bindRightClick: function () {
        $(window.document).on('click', function () {
            $('#context-menu-item').hide();
        });
        $(window.document).off('contextmenu', '.main-content .table.table-right-click tr:has("td")');
        $(window.document).on('contextmenu', '.main-content .table.table-right-click tr:has("td")', function (e) {
            var menu = $('#context-menu-item');
            var main = $('.main-content');
            if (main.length) {
                //TODO: will updated after find best formula for these numbers
                var panelWidth = window.innerWidth - main.width() - 55;
                var panelHeight = 210;
                e.pageX -= panelWidth;
                if (e.pageY >= panelHeight) {
                    e.pageY -= panelHeight;
                }
            }

            menu.hide().css({
                left: e.pageX,
                top: e.pageY
            }).show();
            e.preventDefault();
        });
    },
    isLongText: function (src, len) {
        return src != null && src.length > len;
    },
    isSafari: function () {
        return navigator.appVersion.toString().indexOf('AppleWebKit') > 0 && navigator.appVersion.toString().indexOf('Macintosh') > 0;
    }
}