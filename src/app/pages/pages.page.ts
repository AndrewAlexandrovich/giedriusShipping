import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  //
  page_id     :string = '';
  title       :string = '';
  description :string = '';
  top_image   :string = '';

  constructor(private route:ActivatedRoute, private router: Router, private http: HttpClient, 	public toastController: ToastController) { }

  ngOnInit() {
    //get page id
    this.route.params.subscribe(params => {
			 this.page_id = params['id'];
		});


    //get page data from server
    this.http.post('https://giedrius-shipping.com/api/appPoint.php', {
      type: 'getPage',
      id: this.page_id,
    }).subscribe(response => {
      //convert
      let data = JSON.parse(JSON.stringify(response));
      this.title = data.title;
      this.description = data.description;
      this.top_image = data.top_image;
    }, error => {
        this.showToast('Error!', 'Something wrong, pelase restart app and try again.');
      });
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  openContact(){
		this.router.navigate(['/contact']);
	}



  // show toast
  showToast(header: any, msg: any) {
    this.toastController.create({
      header: header,
      message: msg,
      position: 'middle',
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
