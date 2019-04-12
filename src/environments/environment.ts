// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//ng build --prod --build-optimizer --base-href=http://103.249.98.101:82/

// Prod config

  //var AdminUrl="http://103.249.98.246/admin/data/"; // Prod Admin
  //var apiUrl='http://103.249.98.246:3002/'; // Prod API URL
  //var siteUrl='http://103.249.98.246/uppcl';  //prod Portal url

  // Dev config

  var AdminUrl="http://103.249.98.101:82/admin/data/"; //Dev Admin
  var apiUrl='http://103.249.98.101:3000/' //dev  API
  //var siteUrl='http://103.249.98.101:82'; //Dev Site

  //var apiUrl='http://103.249.98.101:3002/'; // Dev URL SOA old
  //var siteUrl='http://103.249.98.101:82/uppcl';//dev

  // Local Config

  //var  apiUrl='http://192.168.1.156:3002/'; //local API
  //var siteUrl="http://192.168.1.108:4200"; // local site url
 var siteUrl ="http://192.168.1.110:4200/";
  //var apiUrl='http://192.168.1.156:3003/'; //local soa

export const environment = {
  production: false,
  adimageUrl:AdminUrl+"ads/3/",
  missionImage:AdminUrl+"edit_message",
  importantLinksIcones:AdminUrl+"link_icon",
  apiUrl:apiUrl,
  logoUrl:AdminUrl+"other/",
  no_image:"../assets/images/no-image-found.jpg",
  logo_not_found:'../assets/images/no-logo.png',
  icon_img:AdminUrl+"/icon_img/",
  dashVBoardIcone:AdminUrl+"/widget/",
  siteUrl:siteUrl,
  cms_img:AdminUrl+"/cms_img/",
  download:AdminUrl+"download/",
  ads:{
    options:{
    pubId: "pub-9616389000213823", // Make sure this the correct client ID!
    query: "Electricity",
    adPage: 1
  },
  adblock:{
    container: "afscontainer1",
    width: "100%",
    number: 2
  }
},
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
