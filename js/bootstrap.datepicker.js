// TODO: keep selected dates after switch month ot year in calendar
(function( $ ) {

    // DPGlobal object
    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
            }],
        dates:{
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        parseFormat: function(format){
            var separator = format.match(/[.\/-].*?/),
                parts = format.split(/\W+/);
            if (!separator || !parts || parts.length == 0){
                throw new Error("Invalid date format.");
            }
            return {separator: separator, parts: parts};
        },
        parseDate: function(date, format) {
            var parts = date.split(format.separator),
                date = new Date(1970, 1, 1, 0, 0, 0),
                val;
            if (parts.length == format.parts.length) {
                for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10)||1;
                    switch(format.parts[i]) {
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
        formatDate: function(date, format){
            var val = {
                d: date.getDate(),
                m: date.getMonth() + 1,
                yy: date.getFullYear().toString().substring(2),
                yyyy: date.getFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [];
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        },
        headTemplate: '<thead>'+
            '<tr>'+
            '<th class="prev"><i class="icon-arrow-left"/></th>'+
            '<th colspan="2" class="switch month"></th>'+
            '<th class="next"><i class="icon-arrow-right"/></th>'+
            '<th class="prev"><i class="icon-arrow-left"/></th>'+
            '<th colspan="2" class="switch year"></th>'+
            '<th class="next"><i class="icon-arrow-right"/></th>'+
            '</tr>'+
            '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };

    // start plugin
    $.fn.datepicker = function( options ) {



        // merging settings
        var settings = $.extend({
            format: 'mm/dd/yyyy',
            multidate: false
        }, options);



        var formatDate = function(date, format){
            var val = {
                d: date.getDate(),
                m: date.getMonth() + 1,
                yy: date.getFullYear().toString().substring(2),
                yyyy: date.getFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [];
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        };

        return this.each(function() {

            var $this = $(this);

            var format = DPGlobal.parseFormat(settings.format||this.element.data('date-format')||'mm/dd/yyyy');

            $this.parent('.input-append').on({
                click: function() { $this.focus() }
            }, '.add-on');

            var offset = $this.offset();

            var $datepickerObj = $('<div class="datepicker-wrap popover bottom" style="top: ' + (offset.top + $this.height() + 10) + 'px; left: ' + offset.left + 'px">').html(
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
            '</div>').appendTo('body');

            $this.focus(function() {
                $datepickerObj.show();
            }).blur(function() {
                $datepickerObj.hide();
            });
            
            $datepickerObj.bind('click mousedown mouseup', function() {
                return false;
            });

            var date = new Date();

            var $month = $('.datepicker-month', $datepickerObj);
            var $year = $('.datepicker-year', $datepickerObj);

            var days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            // set current month
            var currMonth = date.getMonth();

            // set current year
            var currYear = date.getFullYear();


            var month = currMonth;
            var year = currYear;

            var selectedDays = [];


            var setDays = function()
            {
                var dayCount = (new Date(year, month + 1, 0)).getDate();
                var firstDayOfWeek = (new Date(year, month, 1)).getDay();

                var dateTbody = '<tr>';

                var generalCount = 0;

                // if first number of month not sunday - then add few number before
                if (firstDayOfWeek !== 0)
                {
                    var qMonth = month;
                    var qYear = year;

                    if (month == 0)
                    {
                        var qMonth = 11;
                        var qYear = year - 1;
                    }

                    var prevMonthDate = new Date(qYear, qMonth, 0);

                    var lastNumberPrevMonth = prevMonthDate.getDate();
                    for (var b = (lastNumberPrevMonth - firstDayOfWeek + 1); b <= lastNumberPrevMonth; b++)
                    {
                        var classes = ['prev-month-date'];
                        var thisDate = new Date(qYear, qMonth -1, b);

                        // if this date is selected - add class "selected"
                        selectedDays.forEach(function(selectedDate) {
                            if (selectedDate.getTime() == thisDate.getTime())
                            {
                                classes.push('selected');
                            }
                        });

                        dateTbody += '<td class="' + classes.join(' ') + '">' + b + '</td>';
                        generalCount++;
                    }
                }

                for (var i = 1; i <= dayCount; i++)
                {
                    var classes = ['select-date'];
                    var thisDate = new Date(year, month, i, 0, 0, 0);

                    // if this date is selected - add class "selected"
                    selectedDays.forEach(function(selectedDate) {
                        if (selectedDate.getTime() == thisDate.getTime())
                        {
                            classes.push('selected');
                        }
                    });

                    dateTbody += '<td class="' + classes.join(' ') + '">' + i + '</td>';


                    if (firstDayOfWeek == 6)
                    {
                        firstDayOfWeek = 0;

                        dateTbody += '</tr>';

                        if (i != dayCount)
                        {
                            dateTbody += '<tr>';
                        }
                    }
                    else
                    {
                        firstDayOfWeek++;
                    }
                    generalCount++;
                }

                firstDayOfWeek--;

                if (firstDayOfWeek !== 6)
                {
                    var lastDayOfWeek = 6 - firstDayOfWeek;

                    var nextMonth = month + 1;
                    var nextYear = year;

                    if (month == 11)
                    {
                        var nextMonth = 0;
                        var nextYear = year + 1;
                    }

                    for (var j = 1; j <= lastDayOfWeek; j++)
                    {
                        var classes = ['next-month-date'];
                        var thisDate = new Date(nextYear, nextMonth, j);

                        // if this date is selected - add class "selected"
                        selectedDays.forEach(function(selectedDate) {
                            if (selectedDate.getTime() == thisDate.getTime())
                            {
                                classes.push('selected');
                            }
                        });

                        dateTbody += '<td class="' + classes.join(' ') + '">' + j + '</td>';
                        generalCount++;
                    }

                    dateTbody += '</tr>';
                }

                if (generalCount <= 35)
                {
                    var nextMonth = month + 1;
                    var nextYear = year;

                    if (month == 11)
                    {
                        var nextMonth = 0;
                        var nextYear = year + 1;
                    }

                    for (var m = 1; m <= 7; m++, j++)
                    {
                        var classes = ['next-month-date'];
                        var thisDate = new Date(nextYear, nextMonth, j);

                        // if this date is selected - add class "selected"
                        selectedDays.forEach(function(selectedDate) {
                            if (selectedDate.getTime() == thisDate.getTime())
                            {
                                classes.push('selected');
                            }
                        });

                        dateTbody += '<td class="' + classes.join(' ') + '">' + j + '</td>';
                        generalCount++;
                    }
                }

                $('table.datepicker-calendar tbody', $datepickerObj).html(dateTbody);
            }

            setDays();

            var setMonth = function (newMonth)
            {
                month = newMonth;
                $month.html(months[month]);

            }

            var setYear = function (newYear)
            {
                year = newYear;
                $year.html(year);
            }


            setMonth(currMonth);
            setYear(currYear);

            function prevMonth()
            {
                var newMonth = 11;
                if (month == 0)
                {
                    setYear(year - 1);
                }
                else
                {
                    newMonth = month - 1;
                }

                setMonth(newMonth);
                setDays();
            }

            function nextMonth()
            {
                var newMonth = 0;
                if (month == 11)
                {
                    setYear(year + 1);
                }
                else
                {
                    newMonth = month + 1;
                }

                setMonth(newMonth);
                setDays();
            }

            $('.prev-month-btn', $datepickerObj).click(prevMonth);
            $('.next-month-btn', $datepickerObj).click(nextMonth);

            $('.prev-year-btn', $datepickerObj).click(function() {
                setYear(year - 1);
                setDays();
            });

            $('.next-year-btn', $datepickerObj).click(function() {
                setYear(year + 1);
                setDays();
            });

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: nextMonth
            }, '.next-month-date');

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: prevMonth
            }, '.prev-month-date');

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: function(e) {


                    var day = $(this).html();
                    var date = new Date(year, month, day, 0, 0, 0, 0);

                    if (settings.multidate && e.ctrlKey)
                    {
                        // if already exist some date in input
                        if ($this.val())
                        {
                            // if clicked date already selcted
                            if ($(this).hasClass('selected'))
                            {
                                // remove selection
                                $(this).removeClass('selected');

                                // remove selected date
                                selectedDays.forEach(function (oneDate, i) {
                                    if (oneDate.getTime() == date.getTime())
                                    {
                                        delete selectedDays[i];
                                    }
                                });
                            }
                            else
                            {
                                // added selected date
                                selectedDays.push(date);
                                $(this).addClass('selected');
                            }
                        }
                        else
                        {
                            // added selected date
                            selectedDays.push(date);
                            $(this).addClass('selected');
                        }

                    }
                    else
                    {
                        // remove all selected days
                        $('table.datepicker-calendar tbody td').removeClass('selected');
                        selectedDays = [];

                        // added selected date
                        selectedDays.push(date);
                        $(this).addClass('selected');

                        // unfocus
                        $this.blur();
                    }
                    // put all selected dates in input
                    var formattedDates = [];
                    selectedDays.forEach(function(selectedDate) {
                        formattedDates.push(formatDate(selectedDate, format));
                    });
                    $this.val(formattedDates.join(','));
                }
            }, '.select-date');
        });

        // returning self
        return this;
    };

    $('html').on({
        mouseenter: function() {
            $('span', this).addClass('icon-white');
        },
        mouseleave: function() {
            $('span', this).removeClass('icon-white');
        }
    }, '.datepicker-select-btn');

})( jQuery );