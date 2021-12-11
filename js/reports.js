$(function () {
    $('.goBack').on('click', function (e) {
        e.preventDefault();
        $(window).attr('location', 'index.html')
    })
});
