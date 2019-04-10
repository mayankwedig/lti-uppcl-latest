	$( document ).ready(function() {
				$('.main-carousel').owlCarousel({
					loop:true,
					margin:10,
					dots:true,
					nav:false,
					responsive:{
						0:{
							items:1
						},
						600:{
							items:1
						},
						1000:{
							items:1
						}
					}
				})
					$('.important-links-slide').owlCarousel({
					loop:true,
					margin:10,
					dots:false,
					nav:true,
					navText:["<img src='assets/images/left-nav.png'>", "<img src='assets/images/right-nav.png'>"],
					responsive:{
						0:{
							items:1,
						},
						600:{
							items:3,
						},
						1000:{
							items:5
						}
					}
				})
		$('#main-navbar-notifications').slimScroll({ 
			height: 250 ,
			color: '#1d9455',
			opacity : 1,
			size: '15px'
		});

		});