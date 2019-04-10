import { AboutService } from './../services/about/about.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news-media',
  templateUrl: './news-media.component.html',
  styleUrls: ['./news-media.component.css']
})
export class NewsMediaComponent implements OnInit {

  constructor(private _aboutServices:AboutService) { }

  ngOnInit() {
    this.getContent();
  }
  content:any="";
	contentLoader:boolean=false;
	isContentFound:boolean=false;
	contentTitle:any="News and Media";
  getContent(){
		this.contentLoader=true;
		var data={"slug":"news"};
		this._aboutServices.getAboutContent(data)
			.subscribe((response:any)=>{
				this.contentLoader=false;
				if(response.status && response.authCode == "200"){
					this.isContentFound=true;
					this.contentTitle=response.data_params.title;
					this.content=response.data_params.description;/* .replace(/<(.|\n)*?>/g, '').replace(/\n/g, '').replace(/\t/g, '').replace("&#39;", "'").replace("�",'-').replace("�",'"').replace("&ldquo;",'"').replace("&rdquo;",'"').replace("&amp;",'&').replace('&#39;',"'");	 */
				}else{
					this.content="";
					this.isContentFound=false;
				}
			},(error)=>{
				this.isContentFound=false;
				this.contentLoader=false;
				this.content="";
			});
	}
}
