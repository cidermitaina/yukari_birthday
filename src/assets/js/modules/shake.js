const $ = require("jquery");

export default () => {
	window.addEventListener('devicemotion', function(event) {
	  	var gv = event.accelerationIncludingGravity;
	 	if(gv.z >= 9){
			$('.c-oval,.c-cakes').stop().addClass('show');
		}else if(gv.z < 8){
			$('.c-oval,.c-cakes').stop().removeClass('show');
		}
	});
};
