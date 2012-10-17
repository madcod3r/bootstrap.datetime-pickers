(function( $ ) {

    // start plugin
    $.fn.datepicker = function( options ) {

        // merging settings
        var settings = $.extend({
            'format': 'dd-mm-yyyy'
        }, options);

        return this.each(function() {

            var $this = $(this);

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


            var setDays = function()
            {
                var dayCount = (new Date(year, month + 1, 0)).getDate();
                var firstDayOfWeek = (new Date(year, month, 1)).getDay();

                var dateTbody = '<tr>';

                var generalCount = 0;

                // if first number of month not sunday - then add few number before
                if (firstDayOfWeek !== 0)
                {
                    var qMonth = month - 1;
                    var qYear = year;

                    if (month == 0)
                    {
                        var qMonth = 11;
                        var qMonth = year - 1;
                    }

                    var lastNumberPrevMonth = (new Date(qYear.toString().slice(2), qMonth, 0)).getDate();
                    for (var b = 1; b <= firstDayOfWeek; b++)
                    {
                        dateTbody += '<td class="prev-month-date">' + lastNumberPrevMonth + '</td>';
                        lastNumberPrevMonth--;
                        generalCount++;
                    }
                }

                for (var i = 1; i <= dayCount; i++)
                {
                    dateTbody += '<td class="select-date">' + i + '</td>';


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

                    for (var j = 1; j <= lastDayOfWeek; j++)
                    {
                        dateTbody += '<td class="next-month-date">' + j + '</td>';
                        generalCount++;
                    }

                    dateTbody += '</tr>';
                }

                if (generalCount <= 35)
                {
                    for (var m = 1; m <= 7; m++, j++)
                    {
                        dateTbody += '<td class="next-month-date">' + j + '</td>';
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
                setDays();
            }

            var setYear = function (newYear)
            {
                year = newYear;
                $year.html(year);
                setDays();
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
            }

            $('.prev-month-btn', $datepickerObj).click(prevMonth);
            $('.next-month-btn', $datepickerObj).click(nextMonth);

            $('.prev-year-btn', $datepickerObj).click(function() {
                setYear(year - 1);
            });

            $('.next-year-btn', $datepickerObj).click(function() {
                setYear(year + 1);
            });

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: nextMonth
            }, '.next-month-date');

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: prevMonth
            }, '.prev-month-date');

            $('table.datepicker-calendar tbody', $datepickerObj).on({
                click: function() {
                    $this.val($(this).html() + '.' + (month + 1) + '.' + year);
                    $this.blur();
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