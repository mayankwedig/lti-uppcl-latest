import { environment } from './../../environments/environment';
import { AboutService } from './../services/about/about.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  fetchAdQuery = "help";

  constructor(private _aboutServices:AboutService) { }
  content:any=`<div class="description">
  <p>This website includes some content that is available in non-HTML format. They might not be visible properly if your browser does not have the required plug-ins.</p>

  <p>For example, Acrobat Reader software is required to view Adobe Acrobat PDF files. In case your system does not have this software, you can download it from the Internet for free. The following table lists some of the required plug- ins.</p>
</div>
<div class="help-table-sec">
  <table cellspacing="0" cellpadding="0" border="0" width="100%" class="help-table">
    <tr>
      <th>Document type</th>
      <th>Downloads</th>
    </tr>
    <tr>
      <td>PDF content</td>
      <td><a href="#">Adobe Acrobat Reader (External website that opens in a new window/tab)</a></td>
    </tr>
    <tr>
      <td>Word, Excel and PPT</td>
      <td><a href="#">Apache Open Office for Word, Excel and PPT (External website that opens in a new window/tab)</a></td>
    </tr>
    <tr>
      <td>Input Tools</td>
      <td><a href="#">Google Input Tools on Windows (External website that opens in a new window/tab)</a></td>
    </tr>
  </table>
</div>`;
	contentLoader:boolean=false;
	isContentFound:boolean=false;
  contentTitle:any="Help and support";
  banner:any="";
  ngOnInit() {
    this.getContent();
  }
  getContent(){
		this.contentLoader=true;
		var data={"slug":"help"};
		this._aboutServices.getAboutContent(data)
			.subscribe((response:any)=>{
				this.contentLoader=false;
				if(response.status && response.authCode == "200"){
					this.isContentFound=true;
					this.contentTitle=response.data_params.title;
          this.content=response.data_params.description;/* .replace(/<(.|\n)*?>/g, '').replace(/\n/g, '').replace(/\t/g, '').replace("&#39;", "'").replace("�",'-').replace("�",'"').replace("&ldquo;",'"').replace("&rdquo;",'"').replace("&amp;",'&').replace('&#39;',"'");	 */
          if(response.data_params.uploaded_file != null){
            this.banner=environment.cms_img+response.data_params.id+"/"+response.data_params.uploaded_file;
          }
          
				}else{
          this.banner="";
					this.isContentFound=false;
				}
			},(error)=>{
          this.banner="";
				this.isContentFound=false;
				this.contentLoader=false;
			});
	}

}
