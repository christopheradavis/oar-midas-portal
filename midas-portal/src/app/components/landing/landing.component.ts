import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomizationService } from '../auth-service/auth.service';
import { AuthService } from '../auth-service/auth.service';
import { faHouse, faUser, faDashboard, faCloud, faClipboardList,
faSearch, faFileCirclePlus, faPlus,faBook, faListCheck,faLink,faAddressBook
 ,faCircle, faPrint, faPersonCircleQuestion, faBuilding} from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from 'src/app/config/app.config';
import { UserDetails } from '../auth-service/user.interface';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService,DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  providers:[DialogService,MessageService],
  styleUrls: [
    './landing.component.css'
  ]
})
export class LandingComponent implements OnInit {
  faAddressBook=faAddressBook;
  faLink = faLink;
  faCircle = faCircle;
  faBuilding = faBuilding;
  faPlus = faPlus;
  faHouse = faHouse;
  faUser = faUser;
  faDashboard =faDashboard;
  faCloud =faCloud;
  faClipboardList= faClipboardList;
  faSearch=faSearch;
  faFileCirclePlus=faFileCirclePlus;
  faBook=faBook;
  faListCheck=faListCheck;
  faPrint=faPrint;
  faPersonCircleQuestion=faPersonCircleQuestion;
  private _custsvc: CustomizationService ;
  public username: string;
  events: string[] = [];
  opened: boolean;
  display = false;
  filterString: string;
  userLastName : string;
  userName: string;
  userEmail: string;
  userId: string;
  userOU: string;
  userDiv: string;
  public dap: any;
  authAPI: string;
  authRedirect: string;
  dapAPI: string;

  userDetails: UserDetails;

  public constructor(private authsvc: AuthService,
                    private appConfig: AppConfig,
                    private http: HttpClient,public dialogService: DialogService
                    , public messageService: MessageService) { 
    
  }

  private testData = {
    "userId": "cnd7",
    "userName": "Christopher",
    "userLastName": "Davis",
    "userEmail": "christopher.davis@nist.gov",
    "userGroup": "Domain Users",
    "userDiv": "Applications Systems Division",
    "userDivNum": "183",
    "userOU": "Office of Information Systems Management"
    }


  ngOnInit(): void {
    let promise = new Promise((resolve) => {
      //this.startEditing(true);
    
    console.log('******** authAPI: ' + this.authAPI);
      this.appConfig.getRemoteConfig().subscribe(config => {
        this.authAPI = config.authAPI;
        this.authRedirect = config.authRedirect;
        console.log('********** calll userinfor ');
      this.getUserInfo();
      });
    })
  }


  ngAfterViewInit() {
    setTimeout(() => {
        this.messageService.addAll([
            { severity: 'success', summary: 'NIST MIDAS Portal', detail: 'Connected as cnd7'}
        ]);
    })

    let collection = document.getElementsByTagName("p-columnfilter");

    // regular for loop
    var arr = Array.prototype.slice.call(collection)
    for (let i of arr) {
      i.children[0].children[0].ariaLabel="Last Modified"
      
    }

    let coll = document.getElementsByTagName("p-paginator");

    // regular for loop
    var arrr = Array.prototype.slice.call(coll)
    for (let i of arrr) {
        i.children[0].children[1].ariaLabel="First page"
        i.children[0].children[2].ariaLabel="Previous page"
        i.children[0].children[4].ariaLabel="Next page"
        i.children[0].children[5].ariaLabel="Last page"

    }


    

}

  public getUserInfo() {
    console.log('authAPI: ' + this.authAPI);
    console.log('authRedirect: ' + this.authRedirect);

    //make the call to the auth service
    this.http.get(this.authAPI, { observe: 'response', headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }}).subscribe(response => {
      console.log('response code: ' + response.status);
      console.log('user details: ' + response.body);
      if(response.status != 200) {
        //redirect to authentication URL

        console.log("Redirecting to " + this.authRedirect + " to authenticate user");
        window.location.assign(this.authRedirect);        
      }
      else {

         console.log(" userDetails ::"+JSON.parse(JSON.stringify(response.body)))
         var testToken =  JSON.parse(JSON.stringify(response.body)).token;
         console.log(" TOKEN ::"+testToken)
         let userDetails = JSON.parse(JSON.stringify(response.body)).userDetails;
         console.log(" userDetails ::"+userDetails)
         /*
         this.userName = userDetails.userName;
         this.userLastName = userDetails.userLastName;
         this.userEmail = userDetails.userEmail;
         this.userId = userDetails.userId;
         this.userOU = userDetails.userOU;
         this.userDiv = userDetails.userDiv + " , "+ userDetails.userDivNum;
        console.log('username: ' + this.userName);
*/
      }
      //this.userDetails = response.body;
      
    },
    httperr => {
      if (httperr.status == 401) {
        console.log("Redirecting to " + this.authRedirect + " to authenticate user");
        window.location.assign(this.authRedirect);  
     }
     else if (httperr.status < 100 && httperr.error) {
       
         let msg = "Service connection error"
         if (httperr['message'])
             msg += ": " + httperr.message
         if (httperr.error.message)
             msg += ": " + httperr.error.message
         if (httperr.status == 0 && httperr.statusText.includes('Unknown'))
             msg += " (possibly due to CORS restriction?)";
         alert(msg)
     }
     else  {
        
         // URL returned some other error status
         let msg = "Unexpected error during authorization";
         // TODO: can we get at body of message when an error occurs?
         // msg += (httperr.body['message']) ? httperr.body['message'] : httperr.statusText;
         msg += " (" + httperr.status.toString() + " " + httperr.statusText + ")"
         alert(msg);
     }
    }
    );
  }

  public fetchRecords(url:string){
    this.http.get(url)
    .pipe(map((responseData: any)  => {
      return responseData
    })). subscribe(records => {
      this.dap = records
    })
  }


  public logintest(){
    alert("Test");
    //this.authsvc.getUserInfo();
  }
    /**
     * return true if the user is currently authorized to to edit the resource metadata.
     * If false, can attempt to gain authorization via a call to authorizeEditing();
     */
     public isAuthorized(): boolean {
      return Boolean(this._custsvc);
  }


  public startEditing(nologin: boolean = false): void {
    this.authorizeEditing(nologin).subscribe(
      (successful) => {
        // User authorized
        if(successful){
          console.log("Loading draft...");

        }
      },
      (err) => {
          console.log("Authentication failed.");
      }
  );
  }

  /**
     * obtain authorization to edit the metadata and pass that authorization to the editing widgets.
     *
     * Authorization in this context mean a CustomizationService with a valid authorization token 
     * embedded in it.  The CustomizationService will be passed to the MetadataUpdateService so 
     * that it can send updates from the editing widgets to the remote customization web service.  
     *
     * Note that calling this method may cause the browser to redirect to an authorization server, 
     * and, thus, this function would not return to its caller.  The authorization server should 
     * return the browser to the landing page which should trigger calling this function again.  
     * 
     * @param nologin   if false (default) and the user is not logged in, the browser will be redirected 
     *                  to the authentication service.  If true, redirection will not occur; instead, 
     *                  false is returned if the user is not logged in.  
     * @return Observable<boolean>   this will resolve to true if the application is authorized; 
     *                               false, if either the user could not authenticate or is otherwise 
     *                               not allowed to edit this record.  
     */
   public authorizeEditing(nologin: boolean = false): Observable<boolean> {
    if (this._custsvc) return of<boolean>(true);   // We're already authorized


    return new Observable<boolean>(subscriber => {
        console.log("obtaining editing authorization");
        // this.statusbar.showMessage("Authenticating/authorizing access...", true)

        this.authsvc.authorizeEditing(nologin).subscribe(  // might cause redirect (see above)
            (custsvc) => {
                this._custsvc = custsvc;    // could be null, indicating user is not authorized.
                // this.mdupdsvc._setCustomizationService(custsvc);
                this.username = this._custsvc.userId; 
                console.log("USER NAME"+this.username );
                var msg: string = "";
                var authenticated: boolean = false;

                if (!this.authsvc.userID) {
                    msg = "authentication failed";
                    console.log("User log in cancelled or failed.")
                }
                else if (!custsvc) {
                    msg = "authorization denied for user " + this.authsvc.userID;
                    if(this.authsvc.errorMessage)
                    console.log(this.authsvc.errorMessage);
                    else
                       console.log("Sorry, you are not authorized to edit this submission.")    // Default message
                      //  this.msgsvc.error("Sorry, you are not authorized to edit this submission.")
                }
                else{
                    msg = "authorization granted for user " + this.authsvc.userID;
                    authenticated = true;
                }

                console.log(msg);
                // this.statusbar.showMessage(msg, false); 

                if(authenticated){
                  subscriber.next(Boolean(this._custsvc));
                  // this.edstatsvc._setUserID(this.authsvc.userID);
                  // this.edstatsvc._setAuthorized(true);
                }else{
                  subscriber.next(false);
                  // this.edstatsvc._setAuthorized(false);
                  // this.edstatsvc._setEditMode(this.EDIT_MODES.PREVIEW_MODE)
                }
                
                subscriber.complete();
            },
            (err) => {
                let msg = "Failure during authorization: " + err.message;
                // this.statusbar.showMessage(msg, false); 
                console.error(msg);
                // this.msgsvc.syserror(msg);
                subscriber.next(false);
                subscriber.complete();
                // this.edstatsvc._setAuthorized(false);
                // this.edstatsvc._setEditMode(this.EDIT_MODES.PREVIEW_MODE)
            }
        );
    });
}
}

