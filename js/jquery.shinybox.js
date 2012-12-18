/*
* SHINYBOX
* jquery plugin for photo presentation
* developped by Léo Fontin 2012
*/

(function($){

	// settings initialisation
	var $option = {
		opacity 	: 0.8,
		width 		: 'auto',
		height 		: 'auto',
		duration 	: 500,
		delay 		: 5000,
		galery 		: false,
		autoplay	: false,
		type		: 'default'
	}

	// params initalisation
	
	var $item; 					// objet courant
	var $elem; 					// objet
	var $current; 				// numéro de l'iten courant
	var $imageloader; 			// préchargement de l'image
	var $url; 					// adresse du contenu
	var $posleft; 				// position horizontal de la popin
	var $postop; 				// position verticale de la popin
	var $wimg; 					// largeur de l'image ou contenu
	var $himg; 					// hauteur de l'image ou contenu
	var $open = false; 			// statut de la popin
	var $tabimg = new Array(); 	// tablea udes images
	var $timer; 				// interval 
	var $type; 					// type d'affichage frame / inline / image
	
	var $theme = '<div id="shinybox">\
					<div id="shinybox_contener">\
						<div id="shinybox_close">close.</div>\
						<div id="shinybox_prev">prev.</div>\
						<div id="shinybox_next">next.</div>\
						<div id="shinybox_content"></div>\
					</div>\
					<div id="shinybox_loader"></div>\
					<div id="shinybox_back"></div>\
				</div>';
	
	
	
	// element principal
	$.fn.shinybox = function(options){


		return this.each(function(){
			
			//intialisation
			$elem = $(this);
			
			// création du tableau des images
			if($elem.attr('data-shinybox-galery') == 'true'){
				$tabimg.push($elem.attr('href'));	
			}
			
			
			
			// click on item
			$elem.unbind('click');
			$elem.click(function(){
			
				// concaténation des settings et options
				$settings = $.extend({},$option,options);
				
				// initlisation du type
				$type = $settings['type'];
				
				$item = $(this);
				
				$url = $item.attr('href');
				
				// calcul du current
				for(var i=0; i<$tabimg.length; i++){
					if($url == $tabimg[i]){
						$current = i;
					}
				}
				
				init();
				
				return false;
			});

		});

	}
	
	
	
	// charge le contenu
	function init(){
	
		// implémentation de la popin
		$('body').prepend($theme);
		
		
		$('#shinybox_back').css('opacity',0).animate({'opacity' : $settings.opacity}, $settings.duration);
		$('#shinybox_loader').css({left : (getW())/2, top : getScrollY()+(getH())/2}).hide().fadeIn();
		
		$('#shinybox_contener').hide();
		$('#shinybox_close').hide();
		$('#shinybox_prev').hide();
		$('#shinybox_next').hide();
		
		// génération du contenu
		setContent();
		
		// initialisation des boutons
		initButton();
		
		// chargement de l'image
		load();
	
	}
	
	
	
	
	
	// charge l'image avant de demander de l'afficher
	function load(){
		
		switch($type){
			
			case 'frame':
				$('#shinybox_frame').load($url, function(response,status){
					if(status == 'success'){
						show();	
					}
					else if(status == 'error'){
						alert('Loading impossible, please try later.');
						close();
					}
				});
			break;
			
			case 'inline':
				if($('#shinybox_inline').html() != ''){
					show();
				}else{
					close();
				}
			break;
			
			case 'default':
				// nouvelle image de préchargement
				$imageloader = new Image();
				
				// if image loading
				$imageloader.onload = function(){
					show();
				}
				
				// if image not loaded
				$imageloader.onerror = function(){
					alert('Loading the image can not');
					close();
				}		
				
				$imageloader.src = $url;
			break;
				
		}
		
		
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
		
		// display la popin
		$('#shinybox_contener').animate({ height : $himg, top : $postop}, $settings.duration)
							   .animate({ width : $wimg, left : $posleft}, $settings.duration, 'linear', 
									function(){
									
										switch($type){
											
											case 'frame':
												$('#shinybox_frame').width($wimg).height($himg).fadeIn();
												$('#shinybox_content').addClass('frame');
											break;
											
											case 'inline':
												$('#shinybox_content').width($wimg).height($himg).addClass('inline');
												$('#shinybox_inline').fadeIn();
											break;
											
											case 'default':
												$('#shinybox_img').fadeIn();
												if($settings.galery && $tabimg.length > 1){
													$('#shinybox_prev').fadeIn();
													$('#shinybox_next').fadeIn();		
												}
											break;
											
										}
										
										$('#shinybox_close').fadeIn();
										$('#shinybox_loader').fadeOut();
									}
							   );
							   
		if($open == true){
			
			$(window).resize(function(){
				
				// calcul de snouvelles dimentions
				setDimension();
				
				if($type == 'frame'){
					$('#shinybox_frame').width($wimg).height($himg).fadeIn();	
				}
				
				$('#shinybox_contener').css({ height : $himg, top : $postop, width : $wimg, left : $posleft}, $settings.duration);
				$('#shinybox_loader').css({left : (getW())/2, top : getScrollY()+(getH())/2}).hide();
				
			});
			
		}

		// set timer
		if($settings.autoplay && $settings.galery) setTimer();
		
	}
	
	
	
	
	// gère l'insertion de l'image
	function setContent(){
		
		switch($type){
			
			case 'frame':
				$('#shinybox_content').append('<iframe frameborder="0" src="" id="shinybox_frame"></iframe>');
				$('#shinybox_frame').attr('src',$url).hide();
			break;
			
			
			case 'inline':
				var content = $($url).html();
				$('#shinybox_content').append('<div id="shinybox_inline">' + content + '</div>');
				$('#shinybox_inline').hide();
			break;
			
			
			case 'default':
				if($('#shinybox_img').length == 0){
					$('#shinybox_content').append('<img src="" id="shinybox_img" />');	
				}
				$('#shinybox_img').attr('src',$url).hide();
			break;
			
		}

	}
	
	
	
	
	
	// set image size
	function setDimension(){
		
		// screen width
		var width_screen = getW();
		
		// screen height
		var height_screen = getH();
		
		
		// en fonction du type d'affichage
		switch($type){
		
			case 'frame':
			
				// largeur
				if($settings['width'] != '' && $settings['width'] < width_screen){
					$wimg = $settings['width'];
				}else{
					$wimg = width_screen - 30;
				}
				
				// hauteur
				if($settings['height'] != '' && $settings['height'] < height_screen){
					$himg = $settings['height'];
				}else{
					$himg = height_screen - 30;
				}
			
			break;
			
			
			
			case 'inline':
			
				$wimg = $settings['width'];
				$himg = $settings['height'];
				
				
			break;
			
			
			
			case 'default':
				// image width
				var width_img = $imageloader.width;
				
				// image height
				var height_img = $imageloader.height;

				// if image larger than the screen
				if(width_img >= width_screen && height_img < height_screen){
					
					// calculation of the new width
					$wimg = width_screen - 30;
					
					// calculation of the new pitch
					$himg = ($wimg * height_img) / width_img;
					
				}
				
				// if the image is higher than the screen
				else if(height_img >= height_screen && width_img < width_screen){
					
					// calculation of the new pitch
					$himg = height_screen - 30;
					
					// calculation of the new pitch
					$wimg = ($himg * width_img) / height_img;
					
				}
				
				// if the image is larger than the screen width and height
				else if(height_img >= height_screen && width_img >= width_screen){
				
					var ratio = width_img / height_img;
				
					// if image in landscape
					if(ratio > 1){
					
						var temp_width_img = width_screen - 30;
						var temp_height_img = (temp_width_img * height_img) / width_img;
						
						if(temp_height_img > height_screen){
							
							// calculation of the new pitch
							$himg = height_screen - 30;
						
							// calculation of the new pitch
							$wimg = ($himg * width_img) / height_img;
						}
						
						else{
							$wimg = temp_width_img;
							$himg = temp_height_img;
						}
						
						
					}
					
					// if image portrait
					else if(ratio < 1){
						
						// calculation of the new pitch
						$himg = height_screen - 30;
						
						// calculation of the new pitch
						$wimg = ($himg * width_img) / height_img;
							
					}
					
					// if square image
					else {
					
						// calculation of the new pitch
						$himg = height_screen - 30;
						
						// calculation of the new width
						$wimg = $himg;
					}
				}
				
				// image smaller than the screen
				else {
					
					$wimg = width_img;
					$himg = height_img;
					
				}
			break;
		
		}

		$posleft = (getW()-$wimg)/2;
		$postop = getScrollY()+(getH()-$himg)/2;
	}
	
	
	
	
	
	
	
	// reset button clicks
	function initButton(){
	
		$('#shinybox_close').unbind('click').click(close);
		$('#shinybox_back').unbind('click').click(close);
		$('#shinybox_prev').unbind('click').click(function(){ setCurrent(0); });
		$('#shinybox_next').unbind('click').click(function(){ setCurrent(1); });
		
	}
	
	
	
	
	
	
	
	// current management
	function setCurrent(sens){
		
		// starts the timer
		if($settings.autoplay && $settings.galery){ 
			clearInterval($timer); 
			setTimer();
		}
		
		if(sens){
			if($current < $tabimg.length-1){
				$current++;
			}else{
				$current = 0;
			}
		}else if(!sens){
			if($current > 0){
				$current--;
			}else{
				$current = $tabimg.length-1;
			}
		}
		
		changeSlide();
	}
	
	
	
	
	
	// slide changes after click
	function changeSlide(){
	
		// detection of future image
		$url = $tabimg[$current];
		
		// show loader
		$('#shinybox_loader').fadeIn();
		
		// hide controls
		$('#shinybox_close,#shinybox_prev,#shinybox_next').fadeOut();
		
		// hide image before change url
		$('#shinybox_img').fadeOut($settings.duration/2,
							function(){
								setContent();
								load();
							});
		
		// delete timer
		if($settings.autoplay && $settings.galery) clearInterval($timer);
	}
	
	
	
	
	
	
	
	// close and remove popin
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
		
		if($settings.autoplay && $settings.galery) clearInterval($timer);
	}
	
	
	
	
	
	
	
	// set Timer for automatique change image
	function setTimer(){
		$timer = setInterval(function(){
					setCurrent(1); 
				},$settings.delay);
	}
	
	
	
	
	
	
	
	
	// return screen width
	function getW() {
		if(window.innetWidth){
			return window.innetWidth;
		}else{
			return $(window).width();
		}
	}
	
	
	
	
	
	
	// return screeb height
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

	
})(jQuery);
