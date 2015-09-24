$(function() {
    $("#nav-bar-link a").click(function() {
        $("#nav-bar-link a").removeClass("active");
        $(this).addClass("active");
    });

    $('a').click(function() {
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
        return false;
    });

});