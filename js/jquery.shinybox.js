(function($){

	// initialisation des variables
	var $item;
	var $elem;
	var $current;
	var $imageloader;
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
	
		// implémentation de la popin
		$('body').prepend($themes['default']);
		
		// génération du contenu
		setContent();
		
		
		$('#shinybox_back').css('opacity',0).animate({'opacity' : $settings.opacity}, $settings.duration);
		$('#shinybox_loader').css({left : (getW())/2, top : getScrollY()+(getH())/2}).hide().fadeIn();
		
		$('#shinybox_contener').hide();
		$('#shinybox_img').hide();
		$('#shinybox_close').hide();
		$('#shinybox_prev').hide();
		$('#shinybox_next').hide();
		
		// chargement de l'image
		load();
	
	}
	
	// charge l'image avant de demander de l'afficher
	function load(){
		
		// nouvelle image de préchargement
		$imageloader = new Image();
		
		// si image chargér
		$imageloader.onload = function(){
			show();
		}
		
		// si image pas chargée
		$imageloader.onerror = function(){
			alert('Chargement de l\'image impossible');
			close();
		}		
		
		$imageloader.src = $url;
	}
	
	// affiche l'image
	function show(){
		
		// ouvreture première fois popin
		if(!$open){
			$('#shinybox_contener').show()
										  .css({
										  		width 	: 0, 
										  		height	: 0, 
										  		left 	: (getW()/2), 
										  		top 	: (getScrollY()+getH()/2)
										  	});
			$open = true;
		}
		
		// calcul les dimention de la popin
		setDimension();
		
		// affiche la popin
		$('#shinybox_contener').animate({ height : $himg, top : $postop}, $settings.duration)
							   .animate({ width : $wimg, left : $posleft}, $settings.duration, 'linear', 
							  		function(){
							  		
							  			$('#shinybox_img').fadeIn();
							  			$('#shinybox_close').fadeIn();
							  			$('#shinybox_loader').fadeOut();
							  			
							  			initButton();
							   });
							   
		if($open == true){
			
			$(window).resize(function(){
				setDimension();
				$('#shinybox_contener').css({ height : $himg, top : $postop, width : $wimg, left : $posleft}, $settings.duration);
				$('#shinybox_loader').css({left : (getW())/2, top : getScrollY()+(getH())/2}).hide();
				
			});
			
		}

		// lance le timer
		if($settings.auto) setTimer();
		
	}
	
	
	
	
	// gère l'insertion de l'image
	function setContent(){
		$('#shinybox_img').attr('src',$url);
	}
	
	
	
	
	
	// set taille image
	function setDimension(){
	
		// largeur de l'image
		var width_img = $imageloader.width;
		
		// hauteur de l'image
		var height_img = $imageloader.height;
		
		// largeur de l'ecran
		var width_screen = getW();

		// hauteur de l'ecran
		var height_screen = getH();	
			
		
		// si image plus large que l'écran
		if(width_img >= width_screen && height_img < height_screen){
			
			// calcul de la nouvelle largeur
			$wimg = width_screen - 30;
			
			// calcul de la nouvelle hauteur
			$himg = ($wimg * height_img) / width_img;
			
		}
		
		// si l'image est plus haute de l'écran
		else if(height_img >= height_screen && width_img < width_screen){
			
			// calcul de la nouvelle hauteur
			$himg = height_screen - 30;
			
			// calcul de la nouvelle hauteur
			$wimg = ($himg * width_img) / height_img;
			
		}
		
		// si l'image est plus grande que l'écran en largeur et hauteur
		else if(height_img >= height_screen && width_img >= width_screen){
		
			var ratio = width_img / height_img;
		
			// si image en paysage
			if(ratio > 1){
			
				var temp_width_img = width_screen - 30;
				var temp_height_img = (temp_width_img * height_img) / width_img;
				
				if(temp_height_img > height_screen){
					
					// calcul de la nouvelle hauteur
					$himg = height_screen - 30;
				
					// calcul de la nouvelle hauteur
					$wimg = ($himg * width_img) / height_img;
				}
				
				else{
					$wimg = temp_width_img;
					$himg = temp_height_img;
				}
				
				
			}
			
			// si image en portrait
			else if(ratio < 1){
				
				// calcul de la nouvelle hauteur
				$himg = height_screen - 30;
				
				// calcul de la nouvelle hauteur
				$wimg = ($himg * width_img) / height_img;
					
			}
			
			// si image carrée
			else {
			
				// calcul de la nouvelle hauteur
				$himg = height_screen - 30;
				
				// calcul de la nouvelle largeur
				$wimg = $himg;
			}
		}
		
		// image plus petite que l'écran
		else {
			
			$wimg = width_img;
			$himg = height_img;
			
		}
		

		$posleft = (getW()-$wimg)/2;
		$postop = getScrollY()+(getH()-$himg)/2;
	}
	
	
	
	
	
	
	
	// initialise les click des boutons
	function initButton(){
	
		$('#shinybox_close').unbind('click').click(close);
		$('#shinybox_back').unbind('click').click(close);
		$('#shinybox_prev').unbind('click').click(function(){ setCurrent(0); });
		$('#shinybox_next').unbind('click').click(function(){ setCurrent(1); });
		
		if($nbitem > 1) $('#shinybox_prev,#shinybox_next').fadeIn();
		
	}
	
	
	
	
	
	
	
	// gestion du current
	function setCurrent(sens){
		
		// lance le timer
		if($settings.auto){ 
			clearInterval($timer); 
			setTimer();
		}
		
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
	
		// détection de la future image
		$url = $tabimg[$current];
		
		// affiche le loader
		$('#shinybox_loader').fadeIn();
		
		// cache les control
		$('#shinybox_close,#shinybox_prev,#shinybox_next').fadeOut();
		
		// cache l'image avant de changer son contenu
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
		$('#shinybox').animate(
								{ 'opacity' : 0 }, 
								$settings.duration/2, 
								'linear',
								function(){
									$('#shinybox').remove();
								}
							);
		
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
		auto 		: false
	}
	
})(jQuery);

