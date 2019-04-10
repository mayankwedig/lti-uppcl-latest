import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-dashboar-redirect',
  templateUrl: './dashboar-redirect.component.html',
  styleUrls: ['./dashboar-redirect.component.css']
})
export class DashboarRedirectComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
    this.router.navigate(["/dashboard"]); //redirect user to dashboard.
  }

}
