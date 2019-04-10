import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  goToHome(){
    this.Router.navigate(["/home"]);
  }
  constructor(private Router:Router) { }

  ngOnInit() {
  }

}
