import { environment } from './../../environments/environment';
import { Component, OnInit,AfterViewInit, Input } from '@angular/core';
declare var $: any;
require('../../assets/js/owl.carousel.js');

@Component({
  selector: 'home-imp-link-slider',
  templateUrl: './home-imp-link-slider.component.html',
  styleUrls: ['./home-imp-link-slider.component.css']
})
export class HomeImpLinkSliderComponent implements OnInit,AfterViewInit {
	@Input('impLinks') impLinks:any;
	
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $(function() {
			$('.important-links-slide').owlCarousel({
		    loop:true,
		    margin:10,
		    dots:false,
		    nav:true,
		    navText:["<img src='../../assets/images/left-nav.png'>", "<img src='../../assets/images/right-nav.png'>"],
		    responsive:{
		        0:{
		            items:2,
		        },
		        600:{
		            items:3,
		        },
		        1000:{
		            items:5
		        }
		    }
		})
	})
  }
  getIcons(data){
	var iconUrl= environment.no_image;
	  var icon=data.icon
	  if(icon != null && icon != ''){
		iconUrl=environment.importantLinksIcones+"/"+data.id+"/"+icon;
	  }
	return iconUrl;
  }
}
