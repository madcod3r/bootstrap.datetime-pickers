(function ($) {
    "use strict";

    // DPGlobal object
    var DPGlobal = {
            dates: {
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            isLeapYear: function (year) {
                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
            },
            getSimpleDate: function (year, month, day) {
                return new Date(year, month, day);
            },
            getDaysInMonth: function (year, month) {
                return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            },
            parseFormat: function (format) {
                var separator = format.match(/[.\/\-][\w\W]*?/),
                    parts = format.split(/\W+/);
                if (!separator || !parts || parts.length === 0) {
                    throw new Error("Invalid date format.");
                }
                return {separator: separator, parts: parts};
            },
            parseDate: function (date, format) {
                var parts = date.split(format.separator),
                    val,
                    i,
                    cnt;
                if (parts.length === format.parts.length) {
                    for (i = 0, cnt = format.parts.length; i < cnt; i += 1) {
                        val = parseInt(parts[i], 10) || 1;
                        switch (format.parts[i]) {
                        case 'dd':
                        case 'd':
                            date.setDate(val);
                            break;
                        case 'mm':
                        case 'm':
                            date.setMonth(val - 1);
                            break;
                        case 'yy':
                            date.setFullYear(2000 + val);
                            break;
                        case 'yyyy':
                            date.setFullYear(val);
                            break;
                        }
                    }
                }
                return date;
            },
            formatDate: function (date, format) {
                var val = {
                        d: date.getDate(),
                        m: date.getMonth() + 1,
                        yy: date.getFullYear().toString().substring(2),
                        yyyy: date.getFullYear()
                    },
                    i,
                    cnt;
                val.dd = (val.d < 10 ? '0' : '') + val.d;
                val.mm = (val.m < 10 ? '0' : '') + val.m;
                date = [];
                for (i = 0, cnt = format.parts.length; i < cnt; i += 1) {
                    date.push(val[format.parts[i]]);
                }
                return date.join(format.separator);
            },
            headTemplate: '<thead>' +
                '<tr>' +
                '<th class="prev"><i class="icon-arrow-left"/></th>' +
                '<th colspan="2" class="switch month"></th>' +
                '<th class="next"><i class="icon-arrow-right"/></th>' +
                '<th class="prev"><i class="icon-arrow-left"/></th>' +
                '<th colspan="2" class="switch year"></th>' +
                '<th class="next"><i class="icon-arrow-right"/></th>' +
                '</tr>' +
                '</thead>',
            contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
        },

        // Datepicket object
        Datepicker = function (element, options) {
            var self = this,
                currentDate = new Date();

            self.element = $(element);
            self.format = DPGlobal.parseFormat(options.format || self.element.data('date-format') || 'mm/dd/yyyy');

            // offset
            self.offset = self.element.offset();

            // set current month and year
            self.month = currentDate.getMonth();
            self.year = currentDate.getFullYear();

            // selected dates
            self.selectedDates = [];

            self.$datepickerObj = $('<div class="datepicker-wrap popover bottom" style="top: ' +
                (self.offset.top + self.element.height() + 10) + 'px; left: ' + self.offset.left + 'px">').html(
                '<div class="arrow" style="left: 10%"></div>' +
                    '<h3 class="popover-title">' +
                        '<div class="datepicker-select-month">' +
                            '<a class="datepicker-select-btn prev-month-btn" href="#"><span class="icon-chevron-left"></span></a>' +
                            '<span class="datepicker-month-year-title datepicker-month">September</span>' +
                            '<a class="datepicker-select-btn next-month-btn" href="#"><span class="icon-chevron-right"></span></a>' +
                        '</div>' +

                        '<div class="datepicker-select-year">' +
                            '<a class="datepicker-select-btn prev-year-btn" href="#"><span class="icon-chevron-left"></span></a>' +
                            '<span class="datepicker-month-year-title datepicker-year">2011</span>' +
                            '<a class="datepicker-select-btn next-year-btn" href="#"><span class="icon-chevron-right"></span></a>' +
                        '</div>' +
                        '<div class="clearfix"></div>' +
                    '</h3>' +
                    '<div class="popover-content">' +
                        '<table class="datepicker-calendar">' +
                            '<thead>' +
                            '<tr>' +
                                '<td>Su</td>' +
                                '<td>Mo</td>' +
                                '<td>Tu</td>' +
                                '<td>We</td>' +
                                '<td>Th</td>' +
                                '<td>Fr</td>' +
                                '<td>Sa</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                                '<td class="prev-month-date">28</td>' +
                                '<td class="prev-month-date">29</td>' +
                                '<td class="prev-month-date">30</td>' +
                                '<td class="prev-month-date">31</td>' +
                                '<td class="select-date">1</td>' +
                                '<td class="select-date">2</td>' +
                                '<td class="select-date">3</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="select-date">4</td>' +
                                '<td class="select-date">5</td>' +
                                '<td class="select-date">6</td>' +
                                '<td class="select-date">7</td>' +
                                '<td class="select-date">8</td>' +
                                '<td class="select-date">9</td>' +
                                '<td class="select-date">10</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="select-date">11</td>' +
                                '<td class="select-date">12</td>' +
                                '<td class="select-date">13</td>' +
                                '<td class="select-date">14</td>' +
                                '<td class="select-date">15</td>' +
                                '<td class="select-date">16</td>' +
                                '<td class="select-date">17</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="select-date">18</td>' +
                                '<td class="select-date">19</td>' +
                                '<td class="select-date">20</td>' +
                                '<td class="select-date">21</td>' +
                                '<td class="select-date">22</td>' +
                                '<td class="select-date">23</td>' +
                                '<td class="select-date">24</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="select-date">25</td>' +
                                '<td class="select-date">26</td>' +
                                '<td class="select-date">27</td>' +
                                '<td class="select-date">28</td>' +
                                '<td class="select-date">29</td>' +
                                '<td class="select-date">30</td>' +
                                '<td class="next-month-date">1</td>' +
                            '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +
                    '</div>'
            ).appendTo('body');

            // fill calendar
            self.fill();

            self.element.focus(function () {
                self.$datepickerObj.show();
            }).blur(function () {
                self.$datepickerObj.hide();
            });

            self.$datepickerObj.bind('click mousedown mouseup', function () {
                return false;
            });

            // set onclick event for .add-on
            self.element.parent('.input-append').on({
                click: function () { self.element.focus(); }
            }, '.add-on');

            self.$month = $('.datepicker-month', self.$datepickerObj);
            self.$year = $('.datepicker-year', self.$datepickerObj);

            self.setMonth(self.month);
            self.setYear(self.year);

            // set many events
            $('.prev-month-btn', self.$datepickerObj).click($.proxy(self.goPrevMonth, self));
            $('.next-month-btn', self.$datepickerObj).click($.proxy(self.goNextMonth, self));

            $('.prev-year-btn', self.$datepickerObj).click(function () {
                self.setYear(self.year - 1);
                self.fill();
            });

            $('.next-year-btn', self.$datepickerObj).click(function () {
                self.setYear(self.year + 1);
                self.fill();
            });

            $('table.datepicker-calendar tbody', self.$datepickerObj).on({
                click: $.proxy(self.goNextMonth, self)
            }, '.next-month-date');

            $('table.datepicker-calendar tbody', self.$datepickerObj).on({
                click: $.proxy(self.goPrevMonth, self)
            }, '.prev-month-date');

            $('table.datepicker-calendar tbody', self.$datepickerObj).on({
                click: function (e) {
                    var $day = $(this),
                        day = $day.html(),
                        date = DPGlobal.getSimpleDate(self.year, self.month, day),
                        formattedDates = [];

                    if (options.multidate && e.ctrlKey) {
                        // if already exist some date in input
                        if (self.element.val()) {
                            // if clicked date already selcted
                            if ($day.hasClass('selected')) {
                                // remove selection
                                $day.removeClass('selected');

                                // remove selected date
                                self.selectedDates.forEach(function (selectedDate, i) {
                                    if (selectedDate.getTime() === date.getTime()) {
                                        delete self.selectedDates[i];
                                    }
                                });
                            } else {
                                // added selected date
                                self.selectedDates.push(date);
                                $day.addClass('selected');
                            }
                        } else {
                            // added selected date
                            self.selectedDates.push(date);
                            $day.addClass('selected');
                        }

                    } else {
                        // remove all selected days
                        $('table.datepicker-calendar tbody td').removeClass('selected');
                        self.selectedDates = [];

                        // added selected date
                        self.selectedDates.push(date);
                        $day.addClass('selected');

                        // unfocus
                        self.element.blur();
                    }
                    // put all selected dates in input
                    self.selectedDates.forEach(function (selectedDate) {
                        formattedDates.push(DPGlobal.formatDate(selectedDate, self.format));
                    });
                    self.element.val(formattedDates.join(options.separator));
                }
            }, '.select-date');
        };

    Datepicker.prototype = {
        constructor: Datepicker,

        getDaysInMonth: function (year, month) {
            return DPGlobal.getSimpleDate(year, month + 1, 0).getDate();
        },

        getPrevMonth: function () {
            return (this.month === 0) ? 11 : this.month - 1;
        },

        getNextMonth: function () {
            return (this.month === 11) ? 0 : this.month + 1;
        },

        getPrevYear: function () {
            return this.year - 1;
        },

        getNextYear: function () {
            return this.year + 1;
        },

        getYearInPrevMonth: function () {
            return (this.month === 0) ? this.getPrevYear() : this.year;
        },

        getYearInNextMonth: function () {
            return (this.month === 11) ? this.getNextYear() : this.year;
        },

        goPrevMonth: function () {
            var newMonth = 11;
            if (this.month === 0) {
                this.setYear(this.year - 1);
            } else {
                newMonth = this.month - 1;
            }

            //this.setMonth(newMonth);
            this.month = newMonth;
            this.$month.html(DPGlobal.dates.months[this.month]);
            this.fill();
        },

        goNextMonth: function () {
            var newMonth = 0;
            if (this.month === 11) {
                this.setYear(this.year + 1);
            } else {
                newMonth = this.month + 1;
            }

            //this.setMonth(newMonth);
            this.month = newMonth;
            this.$month.html(DPGlobal.dates.months[this.month]);
            this.fill();
        },

        setMonth: function (newMonth) {
            this.month = newMonth;
            this.$month.html(DPGlobal.dates.months[this.month]);
        },

        setYear: function (newYear) {
            this.year = newYear;
            this.$year.html(this.year);
        },

        fill: function () {
            var self = this,
                daysInMonth = self.getDaysInMonth(self.year, self.month),
                firstDayOfWeek = DPGlobal.getSimpleDate(self.year, self.month, 1).getDay(),
                lastDayOfWeek = 6 - firstDayOfWeek,
                dateTbody = '<tr>',
                daysMax = 36,
                daysCount = 0,
                daysInPrevMonth = (firstDayOfWeek === 0) ? 0 : self.getDaysInMonth(self.getYearInPrevMonth(), self.getPrevMonth()),
                day,
                date,
                i,
                classes = [],
                selectDateIfSelected1 = function (selectedDate) {
                    if (selectedDate.getTime() === date.getTime()) {
                        classes.push('selected');
                    }
                },
                /**
                 * if this date is selected - add class "selected"
                 */
                 selectDateIfSelected = function (date, firstClass) {
                    classes = [firstClass];
                    self.selectedDates.forEach(selectDateIfSelected1);
                    return classes;
                };

            // if first number of month not sunday - then add few number before
            if (daysInPrevMonth > 0) {
                for (day = (daysInPrevMonth - firstDayOfWeek + 1); day <= daysInPrevMonth; day += 1) {

                    date = DPGlobal.getSimpleDate(self.getYearInPrevMonth(), self.getPrevMonth(), day);
                    classes = selectDateIfSelected(date, 'prev-month-date');

                    dateTbody += '<td class="' + classes.join(' ') + '">' + day + '</td>';
                    daysCount += 1;
                }
            }

            for (day = 1; day <= daysInMonth; day += 1) {
                date = DPGlobal.getSimpleDate(self.year, self.month, day);
                classes = selectDateIfSelected(date, 'select-date');

                dateTbody += '<td class="' + classes.join(' ') + '">' + day + '</td>';

                if (firstDayOfWeek === 6) {
                    firstDayOfWeek = 0;

                    dateTbody += '</tr>';

                    if (day !== daysInMonth) {
                        dateTbody += '<tr>';
                    }
                } else {
                    firstDayOfWeek += 1;
                }
                daysCount += 1;
            }

            firstDayOfWeek -= 1;

            if (firstDayOfWeek !== 6) {
                lastDayOfWeek = 6 - firstDayOfWeek;

                for (day = 1; day <= lastDayOfWeek; day += 1) {
                    date = DPGlobal.getSimpleDate(self.getYearInNextMonth(), self.getNextMonth(), day);
                    classes = selectDateIfSelected(date, 'next-month-date');

                    dateTbody += '<td class="' + classes.join(' ') + '">' + day + '</td>';
                    daysCount += 1;
                }

                dateTbody += '</tr>';
            }

            if (daysCount < daysMax) {
                for (i = 1; i <= 7; i += 1, day += 1) {
                    date = DPGlobal.getSimpleDate(self.getYearInNextMonth(), self.getNextMonth(), day);
                    classes = selectDateIfSelected(date, 'next-month-date');

                    dateTbody += '<td class="' + classes.join(' ') + '">' + day + '</td>';
                    daysCount += 1;
                }
            }

            $('table.datepicker-calendar tbody', self.$datepickerObj).html(dateTbody);
        }
    };

    // start plugin

    $.fn.datepicker = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('datepicker'),
                settings = typeof options === 'object' && options;
            if (!data) {
                $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults, settings))));
            }
            if (typeof options === 'string') {
                data[options]();
            }
            return this;
        });
    };

    $.fn.datepicker.defaults = {
        format: 'mm/dd/yyyy',
        multidate: false,
        separator: ','
    };

    $.fn.datepicker.Constructor = Datepicker;

    $('html').on({
        mouseenter: function () {
            $('span', this).addClass('icon-white');
        },
        mouseleave: function () {
            $('span', this).removeClass('icon-white');
        }
    }, '.datepicker-select-btn');

})(jQuery);