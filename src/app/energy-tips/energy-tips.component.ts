import { EnergyTipsService } from './../services/energy-tips/energy-tips.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-energy-tips',
  templateUrl: './energy-tips.component.html',
  styleUrls: ['./energy-tips.component.css']
})
export class EnergyTipsComponent implements OnInit {

  constructor(private energyTipsService:EnergyTipsService) { }
  
  ngOnInit() {
    this.getEnergyTips();
  }
  loader:boolean=false;
  tips:any=[];
  isTipsfound:boolean=false;
  getEnergyTips(){
    this.energyTipsService.getEnergyTips()
    .subscribe((res:any)=>{
        this.loader=false;
        if(res.authCode == 200 && res.status == true){
          this.tips=res.data_params
          this.isTipsfound=true;
        }else{
          this.isTipsfound=false;
        }
    },(error)=>{
      this.loader=false;
      this.isTipsfound=false;
    });
  }
}
