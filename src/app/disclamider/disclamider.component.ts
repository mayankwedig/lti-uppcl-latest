import { AboutService } from './../services/about/about.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disclamider',
  templateUrl: './disclamider.component.html',
  styleUrls: ['./disclamider.component.css']
})
export class DisclamiderComponent implements OnInit {
  content:any="";
	contentLoader:boolean=false;
	isContentFound:boolean=false;
  contentTitle:any="Disclaimer";
  getContent(){
		this.contentLoader=true;
		var data={"slug":"disclaimer"};
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
  constructor(private _aboutServices:AboutService) { }

  ngOnInit() {
    this.getContent();
  }

}
