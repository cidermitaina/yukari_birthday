const $ = require("jquery");

export default class Common {
    constructor () {
        this.speed = 400;
    }
    init(){
        const self=this;
        $('a[href^="#"]').on('click',e=>pageScroll(e.currentTarget));
    }
    pageScroll(el){
        let self,href,target,position;
        href= $(el).attr("href");
        target = $(href == "#" || href == "" ? 'html' : href);
        position = target.offset().top;
        $("html, body").animate({scrollTop:position}, this.speed);
    }
};
