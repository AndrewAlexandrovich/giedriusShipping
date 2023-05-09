import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {

	public track_id : string = '';
	public trackInformation = [];
	public histories: any;
	//
	cotainer_no:   string = '';
	current_loc:   string = '';
	date_modified: string = '';
	final_loc:     string = '';
	ship_name:     string = '';
	status_:       string = '';
	id_db:         any    = 0;
  exporter:      any    = '';
  consignee:     any    = '';
	ishidden = false;

	constructor(private route: ActivatedRoute,private router:Router, 	public toastController: ToastController, private http: HttpClient) { }

	ngOnInit() {


		this.route.params.subscribe(params => {
			 console.log(params['track_id']);
			 this.track_id = params['track_id'];
		});


			this.http.post('https://giedrius-shipping.com/api/getInfo.php', {
			search: this.track_id,
      getExporter : true
			}).subscribe(response => {
				console.log(response);
				let trackdetails = JSON.parse(JSON.stringify(response));
				this.trackInformation = trackdetails['result'][0];

				this.cotainer_no   = trackdetails['result'][0]['container_no'];
				this.current_loc   = trackdetails['result'][0]['current_loc'];
				this.date_modified = trackdetails['result'][0]['date_modified'];
				this.final_loc     = trackdetails['result'][0]['final_loc'];
				this.ship_name     = trackdetails['result'][0]['ship_name'];
				this.status_       = trackdetails['result'][0]['status'];
				this.id_db         = trackdetails['result'][0]['id'];

        if(trackdetails['result']['expoter_consig']){
          this.exporter = trackdetails['result']['expoter_consig']['exporter'];
          this.consignee = trackdetails['result']['expoter_consig']['consignee'];
        }

				//get history
				this.http.post('https://giedrius-shipping.com/api/getHistory.php', {
					id: this.id_db
					}).subscribe(response => {
						console.log('history');
						console.log(response);
						this.histories = response;
					}, error => {
						console.log(error);
					});


			}, error => {
				console.log(error);
			});

			console.log(this.id_db);

	}
	goHome(){
		this.router.navigate(['/home']);
	}

	downloadFile(type: any){

    this.http.post('https://giedrius-shipping.com/api/getFile.php', {
    type: type,
    id: this.id_db
    }).subscribe(response => {
      let details = JSON.parse(JSON.stringify(response));
      if(details.link){
          window.open(details.link, "_blank");
      }else if(details.error){
          this.showToast('Error', details.error);
      }else{
          this.showToast('Error', 'Something wrong. Please try again or use our website');
      }

    }, error => {
      console.log(error);
    });



	  //window.open(url, "_blank");
	}


  showToast(header: any, msg: any, durat: any = '') {
    if(!durat){
      durat = 5000;
    }
    this.toastController.create({
      header: header,
      message: msg,
      position: 'top',
      duration: durat,
      buttons: [
        {
          side: 'end',
          text: 'Close',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    }).then((obj) => {
      obj.present();
    });
  }





}
