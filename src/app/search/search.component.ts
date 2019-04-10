import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from "./../services/search/search.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  searchKeyWord: any = "";
  checkSearcSring() {
    this.activatedRoute.queryParams.subscribe(
      result => {
        let searchKeyWord = result.keyword;
        if (searchKeyWord != null && searchKeyWord != "") {
          this.searchKeyWord = searchKeyWord;
          if (this.searchKeyWord) {
            this.getSearch(this.searchKeyWord);
          } else {
            this.router.navigate(["/"]);
          }
        } else {
          this.searchKeyWord = null;
        }
      },
      error => {
        this.router.navigate(["/"]);
      }
    );
  }

  resultFound: any = false;
  searchLoader: boolean = false;
  searchResponse = [];

  constructor(
    private _searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkSearcSring();
  }

  getSearch(searchKeyWord) {
    this.searchLoader = true;
    this._searchService.search(searchKeyWord).subscribe(
      (response: any) => {
        var res = response;
        this.searchLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.searchResponse = res.data_params;
            this.resultFound = true;
          } else {
            this.searchResponse = [];
            this.resultFound = false;
          }
        }
      },
      (error: AppError) => {
        this.searchLoader = false;
        this.searchResponse = [];
        this.resultFound = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
