import { environment } from './../../environments/environment';
import { PayBillService } from './../services/pay-bill/pay-bill.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {

  constructor(private route:ActivatedRoute,private router:Router,private payBillService:PayBillService) { 
    
  }

  ngOnInit() {
    /* this.route.paramMap.subscribe((result)=>{
      console.log(result);
    },(error)=>{
      console.log(error);
    }) */
    /* console.log(environment.siteUrl+this.router.url);
    this.payBillService.getTransectionData(environment.siteUrl+this.router.url)
    .subscribe((resp:any)=>{
      console.log(resp);
    }) */
  }
  
}
