/*import*/
import $ from 'jquery';
import aos from './modules/aos';
import scroll from './modules/scroll';
import shake from './modules/shake'

document.addEventListener('DOMContentLoaded', () => {
    aos();
    scroll();
	shake();
})
