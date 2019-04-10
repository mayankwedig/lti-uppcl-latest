
import { SignupService } from "./../services/signup/signup.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from "../services/login/login.service";
import { TranslationService } from "../services/translation/translation.service";

declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  sliderContent = [
    {
      image: "../assets/images/main-slide1.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide2.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide3.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    }
  ];
  showForgotPass() {
    $("#loginFr").fadeOut(350);
    $("#forgotPass").fadeIn(350);
  }
  showLogin() {
    $("#forgotPass").fadeOut(300);
    $("#loginFr").fadeIn(300);
  }
  showchangePassword() {
    
  }
  loder: boolean = false;
  loginFrm: FormGroup;
  forgotPassFrm: FormGroup;

  questionsList1 = [];
  questionsList2 = [];

  questionsList1Loader = false;
  questionsList2Loader = false;

  get f() {
    return this.loginFrm.controls;
  }
  get forgotPassFields() {
    return this.forgotPassFrm.controls;
  }
  fechQuestionList(quesType) {
    if (quesType == "1") {
      this.questionsList1Loader = true;
    } else {
      this.questionsList2Loader = true;
    }
    

    this.SignupService.getQuestionList("users/questionList", {
      types: quesType
    }).subscribe((response: any) => {
      if (quesType == "1") {
        this.questionsList1Loader = false;
      } else {
        this.questionsList2Loader = false;
      }
      var res = response;
      if (res.authCode == "200") {
        if (quesType == "1") {
          this.questionsList1 = res.data_params;
        } else {
          this.questionsList2 = res.data_params;
        }
      } else {

        this.toastr.error(this._translate.translate(res.msg), this._translate.translate("Failed!"));
      }
    });
  }
 
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private Dashboard: DashboardService,
    private helper: HelpersService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private SignupService: SignupService,
    private helpers: HelpersService,
    private _translate:TranslationService
  ) {
    this.initLoginFrm();
    this.initForgotFormFrm();
    this.fechQuestionList("1");
    this.fechQuestionList("2");

    sessionStorage.removeItem("withSequityQues");//deleting previouls set session
  }
  getQues(username){
    console.log(username);

  }
 /*  translat_text={
    "UserId":this._translate.translate("UserId"),
  } */
  translateText(key){
     /*  console.log(this._translate.translate(key)); */
    return this._translate.translate(key);
  }
  initLoginFrm() {
    this.loginFrm = this.fb.group({
      user_name: ["", Validators.required],
      password: ["", Validators.required]
    });
  }
  initForgotFormFrm() {
    var fields = {
      email: [""],
      email1: [""],
      questionsList1: [""],
      questionsList2: [""],
      ansques1: [""],
      ansques2: [""]
    };
    this.forgotPassFrm = this.fb.group(fields);
  }

  errorFlags: any = {
    email: false,
    email1: false,
    questionsList1: false,
    questionsList2: false,
    ansques1: false,
    ansques2: false
  };
  setErrorFlags() {
    this.errorFlags.email = false;
    this.errorFlags.email1 = false;
    this.errorFlags.questionsList1 = false;
    this.errorFlags.questionsList2 = false;
    this.errorFlags.ansques1 = false;
    this.errorFlags.ansques2 = false;
  }
  validateForgotPasswordFrm() {
    this.forgotPassFrm = this.helpers.markAsTouched(this.forgotPassFrm);
    var APIUrl = "users/forgotPassword";
    var withSequrityQuest=false;
    this.setErrorFlags(); // Setting Error Flags default to false
    if (this.forgotPassFrm.value.email != "") {
      // only user-email/user-ID selected
      this.forgotPassword(false,this.forgotPassFrm.value, APIUrl);
    } else {
      if (this.forgotPassFrm.value.email1 != "") {
        // user-email/user-ID/mobile selected
        var errorExists = false;
        if (this.forgotPassFrm.value.questionsList1 == "") {
          // check if ques1 not blank
          this.errorFlags.questionsList1 = true;
          errorExists = true;
        }
        if (this.forgotPassFrm.value.questionsList2 == "") {
          // check if questionsList2 not blank
          this.errorFlags.questionsList2 = true;
          errorExists = true;
        }
        if (this.forgotPassFrm.value.ansques1 == "") {
          // check if ansques1 not blank
          this.errorFlags.ansques1 = true;
          errorExists = true;
        }
        if (this.forgotPassFrm.value.ansques2 == "") {
          // check if ansques2 not blank
          this.errorFlags.ansques2 = true;
          errorExists = true;
        }
        if (errorExists == false) {
          // if no error
          APIUrl = "users/forgotPasswordWithSecuirityQuestion";
         
          this.forgotPassword(true,this.forgotPassFrm.value, APIUrl);
        } else {
          this.toastr.error(this._translate.translate("Please fill required field."), this._translate.translate("Failed"));
        }
      } else {
        this.errorFlags.email = true;
        this.errorFlags.email1 = true;
        this.toastr.error(this._translate.translate("Please fill at least one required field."), this._translate.translate("Failed"));
      }
    }
  }
  forgotPassword(withSequityQues:boolean=false,data, apiUrl) {
    var forgotPassData = {};
    if (data.email != "") {
      forgotPassData = { email: data.email };
    } else {
      forgotPassData = {
        email: data.email1,
        question1: data.questionsList1,
        answer1: data.ansques1,
        question2: data.questionsList2,
        answer2: data.ansques2
      };
    }
    this.loder = true;
    this.loginService
      .forgotPassService(apiUrl, forgotPassData)
      .subscribe((response: any) => {
        this.loder = false;
        this.initForgotFormFrm();
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.loginService.setOtpVerificationSession(res.data_params.id);
            var OtpVerificationToken = this.loginService.getOtpVerificationSession();
            if (OtpVerificationToken != null) {
              this.toastr.success(this._translate.translate(res.msg), this._translate.translate("Verification is successful!"));
              this.router.navigate(["/otp-verification"]);
              this.toastr.success(res.msg, "Verification is successful!");
              if(!withSequityQues){
                this.router.navigate(["/otp-verification"]);
              }else{
                this.helper.setLocalStoragData("withSequityQues","true");
                this.router.navigate(["/otp-verification"]);
              }
              
            }
          } else {
            this.toastr.error(this._translate.translate(res.msg), "Failed!");
          }
        }
      },(error)=>{
        this.initForgotFormFrm();
        this.loder = false;
        this.toastr.error(this._translate.translate("Something went wrong,Please try again later"), this._translate.translate("Failed!"));
      });
  }
  /** Redirection Loder*/
  redirectLoding = false;
  PrimaryWhite = "#16689e";
  SecondaryGrey = "#ffffff";
  PrimaryRed = "#dd0031";
  SecondaryBlue = "#006ddd";
  public primaryColour = this.PrimaryWhite;
  public secondaryColour = this.SecondaryGrey;
  public coloursEnabled = false;

  public config = {
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: "3px"
  };
  /** Redirection Loder Ends Here*/

  login() {
    // login funtion goes here
    const loginData = this.loginFrm.value;
    this.loder = true;
    this.loginService.loginUser("users/login", loginData).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true && res.token) {
            this.loginService.setLoginData(res.token);
            this.toastr.success(this._translate.translate(res.msg), this._translate.translate("Success!"));
            let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
            var UserData = this.loginService.getUserData();
            if (UserData.numberOfAccounts == 1) {
              // If user has single Account
              var userId = UserData.userId; //get user Id
              var accountId = UserData.accountNumber; //get Account Id
              var is_net_metering = 0; // Set Default Net Metering Status
              //fetching Account details for getting net metering Status
              this.redirectLoding = true; //redirecting loder
              this.Dashboard.getAccountDetails(accountId, (result: any) => {
                this.redirectLoding = false; //redirecting loder false
                if (result.authCode == "200") {
                  // if Success
                  is_net_metering = result.data_params.is_net_metering; //getting Net Metering
                  this.helper.setLocalStoragData(
                    "accountToken",
                    btoa(userId + ":" + accountId + ":" + is_net_metering)
                  ); // set new account access token.
                  $("body").addClass("animate-mm-lg");
                  $("body").addClass("animate-mm-md");
                  $("body").addClass("animate-mm-sm");
                } else {
                  this.helper.setLocalStoragData(
                    "accountToken",
                    btoa(userId + ":" + accountId + ":" + 0)
                  ); // set new account access token.
                }
                //redirect user to dashboard.
                $("body").addClass("animate-mm-lg");
                $("body").addClass("animate-mm-md");
                $("body").addClass("animate-mm-sm");
                this.router.navigate([returnUrl || "/dashboard"]);
              });
            } else {
              this.router.navigate([returnUrl || "/manageaccount"]);
            }
          } else {
            if(res.authCode == "101"){
              this.toastr.error(this._translate.translate(res.msg), this._translate.translate("Failed!"));
              this.initLoginFrm();
              this.helper.setLocalStoragData("changeExpPassword",res.userId);
              this.router.navigate(["/change-expired-password"]);
            }else{
              this.toastr.error(this._translate.translate(res.msg), this._translate.translate("Failed!"));
            }
          }
        }
      },
      (error: AppError) => {
        this.loder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  getSelectedQuestions(userName){
    var fields ={};
    if(userName != ''){
      this.loginService.getUsersQuetion(userName)
      .subscribe((result:any)=>{
        if(result.authCode == 200 && result.status == true && result.data_params.length > 0){
          var data=result.data_params;
          fields = {
            email: [""],
            email1: [userName],
            questionsList1: [data[0].firstQuestionId],
            questionsList2: [data[1].secondQuestionId],
            ansques1: [""],
            ansques2: [""]
          };
          this.forgotPassFrm = this.fb.group(fields);
        }else{
          fields = {
            email: [""],
            email1: [userName],
            questionsList1: [""],
            questionsList2: [""],
            ansques1: [""],
            ansques2: [""]
          };
          this.forgotPassFrm = this.fb.group(fields);
        }
      },error=>{
        fields = {
          email: [""],
          email1: [userName],
          questionsList1: [""],
          questionsList2: [""],
          ansques1: [""],
          ansques2: [""]
        };
        this.toastr.error("Something went wrong,Please try again later", this._translate.translate("Failed!"));
      });
    }else{
      fields = {
        email: [""],
        email1: [userName],
        questionsList1: [""],
        questionsList2: [""],
        ansques1: [""],
        ansques2: [""]
      };
    }
   
  }
}
