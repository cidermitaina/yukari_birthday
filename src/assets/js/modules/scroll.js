const $ = require("jquery");

export default () => {
    const $jsBg = $('.js-bg');
    const windowHeight = window.innerHeight
    const offsetY = $('.p-yukari__chat').offset().top - windowHeight;

    console.log(offsetY);
    $(window).scroll(function () {
        if ($(this).scrollTop() > offsetY) {
            $jsBg.fadeIn('slow');
        } else {
            $jsBg.fadeOut('slow');
        }
    });
};
