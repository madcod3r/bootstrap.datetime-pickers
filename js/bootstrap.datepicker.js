(function( $ ) {

    // start plugin
    $.fn.datepicker = function( options ) {

        // merging settings
        var settings = $.extend({
            'format': 'dd-mm-yyyy'
        }, options);

        return this.each(function() {

            var $this = $(this);

            var offset = $this.offset();

            var $datepickerObj = $('<div class="datepicker-wrap popover bottom" style="top: ' + (offset.top + $this.height() + 10) + 'px; left: ' + offset.left + 'px">').html(
                '<div class="arrow" style="left: 10%"></div>' +
                '<h3 class="popover-title">' +
                    '<div class="datepicker-select-month">' +
                        '<a class="datepicker-select-btn prev-month-btn" href="#"><span class="icon-chevron-left"></span></a>' +
                        '<span class="datepicker-month-year-title">September</span>' +
                        '<a class="datepicker-select-btn next-month-btn" href="#"><span class="icon-chevron-right"></span></a>' +
                    '</div>' +

                    '<div class="datepicker-select-year">' +
                        '<a class="datepicker-select-btn prev-year-btn" href="#"><span class="icon-chevron-left"></span></a>' +
                        '<span class="datepicker-month-year-title">2012</span>' +
                        '<a class="datepicker-select-btn next-year-btn" href="#"><span class="icon-chevron-right"></span></a>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                '</h3>' +
                '<div class="popover-content">' +
                    '<table class="datepicker-calendar">' +
                        '<thead>' +
                        '<tr>' +
                            '<td>Вс</td>' +
                            '<td>Пн</td>' +
                            '<td>Вт</td>' +
                            '<td>Ср</td>' +
                            '<td>Чт</td>' +
                            '<td>Пт</td>' +
                            '<td>Сб</td>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr>' +
                            '<td class="prev-month-date">28</td>' +
                            '<td class="prev-month-date">29</td>' +
                            '<td class="prev-month-date">30</td>' +
                            '<td class="prev-month-date">31</td>' +
                            '<td>1</td>' +
                            '<td>2</td>' +
                            '<td>3</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>4</td>' +
                            '<td>5</td>' +
                            '<td>6</td>' +
                            '<td>7</td>' +
                            '<td>8</td>' +
                            '<td>9</td>' +
                            '<td>10</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>11</td>' +
                            '<td>12</td>' +
                            '<td>13</td>' +
                            '<td>14</td>' +
                            '<td>15</td>' +
                            '<td>16</td>' +
                            '<td>17</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>18</td>' +
                            '<td>19</td>' +
                            '<td>20</td>' +
                            '<td>21</td>' +
                            '<td>22</td>' +
                            '<td>23</td>' +
                            '<td>24</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>25</td>' +
                            '<td>26</td>' +
                            '<td>27</td>' +
                            '<td>28</td>' +
                            '<td>29</td>' +
                            '<td>30</td>' +
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

            $('.prev-month-btn', $datepickerObj).click(function() {
                console.log('previous month');
            });

            $('.next-month-btn', $datepickerObj).click(function() {
                console.log('next month');
            });

            $('.prev-year-btn', $datepickerObj).click(function() {
                console.log('previous year');
            });

            $('.next-year-btn', $datepickerObj).click(function() {
                console.log('next year');
            });

            $('table.datepicker-calendar tbody td', $datepickerObj).click(function() {
                if ($(this).hasClass('next-month-date'))
                {
                    console.log('next month');
                }
                else if ($(this).hasClass('prev-month-date'))
                {
                    console.log('previous month');
                }
                else
                {
                    console.log('select a date');
                }
            });
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