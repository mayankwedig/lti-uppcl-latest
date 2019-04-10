import { environment } from 'src/environments/environment';
import { PeakLoadManageService } from './../services/peack-load-manage/peak-load-manage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-peak-load-manage',
  templateUrl: './peak-load-manage.component.html',
  styleUrls: ['./peak-load-manage.component.css']
})
export class PeakLoadManageComponent implements OnInit {
  contentLoader:boolean=false;
  isContentFound:boolean=false;
  contentTitle:any="Peak load management";
  content:any="";
  banner:any="";
  constructor(private peakLoadManageService:PeakLoadManageService) { }
  getContent(){
		this.contentLoader=true;
		var data={"slug":"peak-load-management"};
		this.peakLoadManageService.getAboutContent(data)
			.subscribe((response:any)=>{
				this.contentLoader=false;
				if(response.status && response.authCode == "200"){
					this.isContentFound=true;
					this.contentTitle=response.data_params.title;
					this.content=response.data_params.description;/* .replace(/<(.|\n)*?>/g, '').replace(/\n/g, '').replace(/\t/g, '').replace("&#39;", "'").replace("�",'-').replace("�",'"').replace("&ldquo;",'"').replace("&rdquo;",'"').replace("&amp;",'&').replace('&#39;',"'");	 */
					this.banner=environment.cms_img+response.data_params.id+"/"+response.data_params.uploaded_file;
				}else{
					this.banner="";
					this.content="";
					this.isContentFound=false;
				}
			},(error)=>{
				this.isContentFound=false;
				this.contentLoader=false;
				this.content="";
				this.banner="";
			});
	}

  ngOnInit() {
    this.getContent();
  }

}
