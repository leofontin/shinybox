(function($){

	// initialisation des variables
	var $item;
	var $elem;
	var $current;
	var $url;
	var $settings;
	var $posleft;
	var $postop;
	var $wimg;
	var $himg;
	var $selector;
	var $nbitem;
	var $open = false;
	var $tabimg = new Array();
	var $timer;
	
	var $themes = {
		'default' : '\
			<div id="shinybox">\
				<div id="shinybox_contener">\
					<div id="shinybox_close"></div>\
					<div id="shinybox_prev"></div>\
					<div id="shinybox_next"></div>\
					<div id="shinybox_content">\
						<img id="shinybox_img" src="" alt="" />\
					</div>\
				</div>\
				<div id="shinybox_loader"></div>\
				<div id="shinybox_back"></div>\
			</div>'
	}
	
	// charge le contenu
	function init(){
		$('body').prepend($themes['default']);
		
		setContent();
		
		$('#shinybox_back').css('opacity',0).animate({'opacity' : $settings.opacity}, $settings.duration);
		$('#shinybox_loader').css({left : (getW()-17)/2, top : getScrollY()+(getH()-17)/2}).hide().fadeIn();
		$('#shinybox_contener').hide();
		$('#shinybox_img').hide();
		$('#shinybox_close').hide();
		$('#shinybox_prev').hide();
		$('#shinybox_next').hide();
		
		load();
	
	}
	
	// charge l'image avant de demander de l'afficher
	function load(){
		var image = new Image();
		image.onload = function(){
			show();
		}
		image.src = $url;
	}
	
	// affiche l'image
	function show(){
		if(!$open){
			$('#shinybox_contener').show()
										  .css({
										  		width : 0, 
										  		height: 0, 
										  		left : (getW()/2), 
										  		top : (getScrollY()+getH()/2)
										  	});
			$open = true;
		}
		setDimension();
		$('#shinybox_contener').animate({ height : $himg, top : $postop}, $settings.duration)
									  .animate({ width : $wimg, left : $posleft}, $settings.duration, 'linear', 
									  		function(){
									  			$('#shinybox_img').fadeIn();
									  			$('#shinybox_close').fadeIn();
									  			$('#shinybox_loader').fadeOut();
									  			
									  			initButton();
									  		});
		// lance le timer							  		
		if($settings.auto) setTimer();
	}
	
	
	
	
	// gère l'insertion de l'image
	function setContent(){
		$('#shinybox_img').attr('src',$url);
	}
	
	
	
	
	
	// set taille image
	function setDimension(){
		$wimg = $('#shinybox_img').width();
		if($settings.maxw != false){
			if($wimg > $settings.maxw){
				$wimg = $settings.maxw;
				$('#shinybox_img').width($settings.maxw);
			}
		}
		$himg = $('#shinybox_img').height();
		$posleft = (getW()-$wimg)/2;
		$postop = getScrollY()+(getH()-$himg)/2;
	}
	
	
	
	
	
	
	
	// initialise les click des boutons
	function initButton(){
		$('#shinybox_close').unbind('click');
		$('#shinybox_close').click(close);
		$('#shinybox_back').unbind('click');
		$('#shinybox_back').click(close);
		if($nbitem > 1){
			$('#shinybox_prev').fadeIn();
			$('#shinybox_next').fadeIn();
		}
		$('#shinybox_prev').unbind('click');
		$('#shinybox_prev').click(function(){setCurrent(0);});
		$('#shinybox_next').unbind('click');
		$('#shinybox_next').click(function(){setCurrent(1);});
	}
	
	
	
	
	
	
	
	// gestion du current
	function setCurrent(sens){
	
		clearInterval($timer);
		setTimer();
		
		if(sens){
			if($current < $nbitem-1){
				$current++;
			}else{
				$current = 0;
			}
		}else if(!sens){
			if($current > 0){
				$current--;
			}else{
				$current = $nbitem-1;
			}
		}
		changeSlide();
	}
	
	
	
	
	
	//change slide après click
	function changeSlide(){
		$url = $tabimg[$current];
		$('#shinybox_loader').fadeIn();
		$('#shinybox_close').fadeOut();
		$('#shinybox_prev').fadeOut();
		$('#shinybox_next').fadeOut();
		$('#shinybox_img').fadeOut($settings.duration/2,
							function(){
								setContent();
								load();
							});
		
		// supprimer le timer
		if($settings.auto) clearInterval($timer);
	}
	
	
	
	
	
	
	
	// ferme et détruit la popin
	function close(){
		$('#shinybox').animate({'opacity' : 0}, $settings.duration/2, 'linear',
							function(){
								$('#shinybox').remove();
							});
		$open = false;
		if($settings.auto) clearInterval($timer);
	}
	
	
	
	
	
	
	
	// gère le time
	function setTimer(){
		$timer = setInterval(function(){
					setCurrent(1); 
				},$settings.delay);
	}
	
	
	
	
	
	
	
	
	// retour la largeur du navigateur
	function getW() {
		if(window.innetWidth){
			return window.innetWidth;
		}else{
			return $(window).width();
		}
	}
	
	
	
	
	
	
	// retour la hauteur du navigateur
	function getH() {
		if(window.innetHeight){
			return window.innetHeight;
		}else{
			return $(window).height();
		}
	}






	// get scroll Y
	function getScrollY() {
		scrOfY = 0;
		if( typeof( window.pageYOffset ) == 'number' ) {
			scrOfY = window.pageYOffset;
		} else if( document.body && ( document.body.scrollTop ) ) {
			scrOfY = document.body.scrollTop;
		} else if( document.documentElement && ( document.documentElement.scrollTop ) ) {
			scrOfY = document.documentElement.scrollTop;
		}
		return scrOfY;
	}
	
	
	
	
	
	
	
	// get scroll X
	function getscrollX() {
		scrOfX = 0;
		if( typeof( window.pageXOffset ) == 'number' ) {
			scrOfX = window.pageXOffset;
		} else if( document.body && ( document.body.scrollLeft ) ) {
			scrOfX = document.body.scrollLeft;
		} else if( document.documentElement && ( document.documentElement.scrollLeft ) ) {
			scrOfX = document.documentElement.scrollLeft;
		}
		return scrOfX;
	}
	
	
	
	
	
	
	// element principal
	$.fn.shinybox = function(options){
	
		$selector = $(this).selector;
		$nbitem = $($selector).length;

		return this.each(function(){
			
			//intialisation
			$elem = $(this);
			$settings = $.extend({},$.fn.shinybox.settings,options);
			
			// creation du tableau d'image
			$tabimg.push($elem.attr('href'));
			
			// click sur un item
			$elem.unbind('click');
			$elem.click(function(){
				$item = $(this);
				$current = $($selector).index($item);
				$url = $item.attr('href');
				init();
				return false;
			});

		});

	}
	
	$.fn.shinybox.settings = {
		opacity 	: 0.8,
		duration 	: 500,
		delay 		: 5000,
		maxw		: 900,
		auto 		: true
	}
	
})(jQuery);

