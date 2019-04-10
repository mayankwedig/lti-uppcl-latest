import {ErrorHandler} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
export class AppErrorHandler implements ErrorHandler{
    private ToastrServ:ToastrService;
    constructor(){

    }
    handleError(error){
            console.log(error);
        /* this.ToastrServ.error("unaccepted error occured", 'Failed!'); */
        /* this.ToastrServ.error("unaccepted error occured", 'Failed!'); */
        /* alert('an unexpected error occurred'); */
        
    }
}