import { PeakLoadManageService } from './services/peack-load-manage/peak-load-manage.service';
import { AdvertisementService } from './services/advertisement/advertisement.service';
import { ContactUsService } from './services/contact-us/contact-us.service';
import { PayBillService } from './services/pay-bill/pay-bill.service';
import { AboutService } from './services/about/about.service';

import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationsService } from './services/notifications/notifications.service';
import { SignupOtpVerificationService } from './services/signup-otp-verification/signup-otp-verification.service';
import { NetMeteringService } from './services/net-metering/net-metering.service';
import { SerivceRequestService } from './services/service-request/serivce-request.service';
import { ComplaintsService } from './services/complaints/complaints.service';
import { ProfileService } from './services/profile/profile.service';
import { AppErrorHandler } from './common/app-error-handler';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, ErrorHandler } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageSliderComponent } from './home-page-slider/home-page-slider.component';
import {WindowRefService} from './services/window-ref/window-ref.service';
import { LoginComponent } from './login/login.component';
import { ValidateAccountNumber } from './validate-account-number/validate-account-number.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {SignupService} from './services/signup/signup.service';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { DataService } from './services/data.service';
import { LoginService } from './services/login/login.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/authService/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { FaqComponent } from './faq/faq.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { ConsumptionComponent } from './consumption/consumption.component';
import { SettingsComponent } from './settings/settings.component';
import { UsageComponent } from './usage/usage.component';
import { NewsMediaComponent } from './news-media/news-media.component';
import { ChartsModule } from 'ng2-charts';
import { ImportantLinksComponent } from './important-links/important-links.component';
import { ProfileComponent } from './profile/profile.component';
import { ManageaccountComponent } from './manageaccount/manageaccount.component';
import { DownloadComponent } from './download/download.component';
import { RequesttrackComponent } from './requesttrack/requesttrack.component';
import { BillingComponent } from './billing/billing.component';
import { HomeImpLinkSliderComponent } from './home-imp-link-slider/home-imp-link-slider.component';
import {MatTabsModule} from '@angular/material';
import { DisclamiderComponent } from './disclamider/disclamider.component';
import { RegistrationComponent } from './registration/registration.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import {HelpersService} from './services/helpers/helpers.service';
import { OtpVerificationService } from './services/otp-varification/otp-verification.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import {DataTableModule} from "angular-6-datatable";
import { ComplaintsComponent } from './complaints/complaints.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { NetMeteringComponent } from './net-metering/net-metering.component';
import { NgxLoadingModule } from 'ngx-loading';
import { SingupOtpVarificationComponent } from './singup-otp-varification/singup-otp-varification.component';
import { ViewAllServiceRequestsComponent } from './view-all-service-requests/view-all-service-requests.component';
import { ServiceRequestDetailsComponent } from './service-request-details/service-request-details.component';
import { ViewAllComplaintsComponent } from './view-all-complaints/view-all-complaints.component';
import { DashboarRedirectComponent } from './dashboar-redirect/dashboar-redirect.component';
import { ComplaintRequestDetailsComponent } from './complaint-request-details/complaint-request-details.component';

import { SelectDropDownModule } from 'ngx-select-dropdown'
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { TouComponent } from './tou/tou.component';
import { RechargeHistoryComponent } from './recharge-history/recharge-history.component';
import { NewServiceConnectionComponent } from './new-service-connection/new-service-connection.component';
import {HomeService} from './services/home/home.service';
import {LatestNewsMarqueeComponent} from './latest-news-marquee/latest-news-marquee.component';

import { MomentModule } from 'ngx-moment';
import { ConsumptionEstimatorComponent } from './consumption-estimator/consumption-estimator.component';
import { TranslatePipe } from '../app/common/translate/translate.pipe';
import { SearchComponent } from './search/search.component';
 
import { TranslationService } from 'src/app/services/translation/translation.service';

import { AdsenseModule } from 'ng2-adsense';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TrackComplaintsComponent } from './track-complaints/track-complaints.component';
import { TrackServiceRequestComponent } from './track-service-request/track-service-request.component';
import { PayBillComponent } from './pay-bill/pay-bill.component';
import { EnergyTipsComponent } from './energy-tips/energy-tips.component';
import { EnergyTipsService } from './services/energy-tips/energy-tips.service';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { TransectionStatusMessageComponent } from './transection-status-message/transection-status-message.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordWithoutLoginComponent } from './change-password-without-login/change-password-without-login.component';
import { PeakLoadManageComponent } from './peak-load-manage/peak-load-manage.component';


/* import { NgxCaptchaModule } from 'ngx-captcha'; */
@NgModule({
  declarations: [

    AppComponent,
    HomeComponent,
    SideBarComponent,
    HeaderComponent,
    FooterComponent,
    HomePageSliderComponent,
    LoginComponent,
    ValidateAccountNumber,
    PageNotFoundComponent,
    DashboardComponent,
    ContactUsComponent,
    AboutComponent,
    HelpComponent,
    FaqComponent,
    SitemapComponent,
    ConsumptionComponent,
    SettingsComponent,
    UsageComponent,
    NewsMediaComponent,
    ImportantLinksComponent,
    ProfileComponent,
    ManageaccountComponent,
    DownloadComponent,
    RequesttrackComponent,
    BillingComponent,
    HomeImpLinkSliderComponent,
    DisclamiderComponent,
    RegistrationComponent,
    OtpVerificationComponent,
    ComplaintsComponent,
    ServiceRequestComponent,
    NetMeteringComponent,
    SingupOtpVarificationComponent,
    ViewAllServiceRequestsComponent,
    ServiceRequestDetailsComponent,
    ViewAllComplaintsComponent,
    DashboarRedirectComponent,
    ComplaintRequestDetailsComponent,
    TouComponent,
    RechargeHistoryComponent,
    NewServiceConnectionComponent,
    LatestNewsMarqueeComponent,
    NotificationListComponent,
    ConsumptionEstimatorComponent,
    TranslatePipe,
    SearchComponent,
    ResetPasswordComponent,
    TrackComplaintsComponent,
    TrackServiceRequestComponent,
    PayBillComponent,
    EnergyTipsComponent,
    PaymentProcessComponent,
    TransectionStatusMessageComponent,
    AdvertisementComponent,
    ChangePasswordComponent,
    ChangePasswordWithoutLoginComponent,
    PeakLoadManageComponent
  ],
  imports: [

    CommonModule,       
        AdsenseModule.forRoot({
        adClient: 'ca-pub-1234567899876543', //replace with your client from google adsense
        adSlot: 1234567891 //replace with your slot from google adsense
      }),
    BrowserModule,
    DataTableModule,
    MatTabsModule,
    LoadingBarRouterModule,
    FormsModule,ReactiveFormsModule, 
    ChartsModule,
    RouterModule.forRoot([
      {path:'',component: HomeComponent},
      {path:'home',component: HomeComponent}, 
      {path:'about',component: AboutComponent}, 
      {path:'contact-us',component: ContactUsComponent},  
      {path:'login',component: LoginComponent},
      {path:'account-verification',component: ValidateAccountNumber},
      {path:'dashboard',component: DashboardComponent,canActivate:[AuthGuard]},
      {path:'help',component: HelpComponent},
      {path:'faqs',component: FaqComponent},   
      {path:'energy-tips',component: EnergyTipsComponent}, 
      {path:'sitemap',component: SitemapComponent},    
      {path:'consumption',component: ConsumptionComponent,canActivate:[AuthGuard]},
      {path:'settings',component: SettingsComponent},
      {path:'search',component: SearchComponent},
      {path:'usage',component: UsageComponent},
      {path:'news-media',component: NewsMediaComponent},
      {path:'important-links',component: ImportantLinksComponent},
      {path:'track-complaint',component:TrackComplaintsComponent},
      {path:'track-service-request',component:TrackServiceRequestComponent},
      {path:'profile',component: ProfileComponent,canActivate:[AuthGuard]},
      {path:'manageaccount',component: ManageaccountComponent,canActivate:[AuthGuard]},
      {path:'downloads',component: DownloadComponent},
      {path:'request-track',component: RequesttrackComponent},
      {path:'pay-bill',component: PayBillComponent},
      {path:'billing',component: BillingComponent,canActivate:[AuthGuard]},
      {path:'otp-verification',component: OtpVerificationComponent,canActivate:[AuthGuard]}, 
      {path:'registration',component: RegistrationComponent,canActivate:[AuthGuard]}, 
      {path:'complaints',component: ComplaintsComponent},
      {path:'service-request',component:ServiceRequestComponent,canActivate:[AuthGuard]},
      {path:'net-metering',component:NetMeteringComponent,canActivate:[AuthGuard]},
      {path:'singup-otp-varification',component:SingupOtpVarificationComponent}, 
      {path:'view-all-service-request',component:ViewAllServiceRequestsComponent,canActivate:[AuthGuard]},
      {path:'service-request-details',component:ServiceRequestDetailsComponent},
      {path:'view-all-complaints',component:ViewAllComplaintsComponent,canActivate:[AuthGuard]},
      {path:'redirect-dashboard',component:DashboarRedirectComponent,canActivate:[AuthGuard]},
      {path:'complaint-request-details',component:ComplaintRequestDetailsComponent},
      {path:'new-service-connection',component:NewServiceConnectionComponent},
      {path:'tou',component:TouComponent,canActivate:[AuthGuard]},
      {path:'recharge-history',component:RechargeHistoryComponent,canActivate:[AuthGuard]},
      {path:'notifications',component:NotificationListComponent,canActivate:[AuthGuard]},
      {path:'consumption-estimator',component:ConsumptionEstimatorComponent,canActivate:[AuthGuard]},
      {path:'change-password',component:ResetPasswordComponent,canActivate:[AuthGuard]},
      {path:"payment-process",component:PaymentProcessComponent},
      {path:"transection-status",component:TransectionStatusMessageComponent},
      {path:"change-expired-password",component:ChangePasswordWithoutLoginComponent},
      {path:"peak-load-management",component:PeakLoadManageComponent,canActivate:[AuthGuard]},
      {path:'**',component: PageNotFoundComponent}
      
      
    ]),ToastrModule.forRoot({
      maxOpened:1,
      
      autoDismiss:true,
      preventDuplicates:true
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({}),
    NgxMyDatePickerModule.forRoot(),
    SelectDropDownModule,
    MomentModule
    /* NgxCaptchaModule */
  ],
  providers: [
    WindowRefService,
    HelpersService,
    DataService,
    SignupService,
    {provide:ErrorHandler,useClass:AppErrorHandler},
    LoginService,
    AuthService,  
    OtpVerificationService,
    DashboardService,
    ProfileService,
    ComplaintsService,
    SerivceRequestService,
    NetMeteringService,
    SignupOtpVerificationService,
    HomeService,
    NotificationsService,
    TranslationService,
    AboutService,
    PayBillService,
    EnergyTipsService,
    ContactUsService,
    AdvertisementService,
    PeakLoadManageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
  



