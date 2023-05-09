import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {
	mainObject: any;
  empty_text:string = '';
	public cn_results = [];
  public menus = [];
  public home_cards = [];


  constructor(
        private http: HttpClient,
				public toastController: ToastController,
				private route: Router
				) {}


ngOnInit() {


  this.http.post('https://giedrius-shipping.com/api/appPoint.php', {
    type: 'getPages'
  }).subscribe(response => {
    console.log('Server response');
    console.log(response);
    //response = JSON.parse(JSON.stringify(response));

    //set menu items
    let newmenu:any = [];
    let newcards:any = [];
    Object.values(response).forEach(function(elem) {
      if(elem['show_in_menu'] == 1){
        newmenu.push({
          "id":elem['id'],
          "menu_title":elem['menu_title'],
          "ion_icon":elem['ion_icon']
        });
      }
      if(elem['show_card_home'] == 1){
        newcards.push({
          "id":elem['id'],
          "title":elem['title'],
          "ion_icon":elem['ion_icon'],
          "short_description":elem['short_description'],
          "card_home_image":elem['card_home_image']
        });
      }


    });
    //set data to objects
    this.menus = newmenu;
    this.home_cards = newcards;



  }, error => {
        console.log(error);
  });
}

	searchel(keyword_cn: string){
	this.http.post('https://giedrius-shipping.com/api/getInfo.php', {
    search: keyword_cn
	}).subscribe(response => {
		console.log(response);

		console.log(keyword_cn);
		let trackdetails = JSON.parse(JSON.stringify(response));
		console.log(typeof trackdetails['success']);
		if(trackdetails && typeof trackdetails['success'] != undefined && trackdetails['result'].length >= 1){
			console.log(trackdetails.success);
			this.cn_results = trackdetails['result'];
		}else if(trackdetails && typeof trackdetails['success'] != undefined && trackdetails['result'].length == 0){
      this.empty_text = trackdetails['success'];
		}else if(trackdetails && typeof trackdetails['error'] != undefined){
			this.showToast('Error',trackdetails['error']);
      this.empty_text = trackdetails['error'];
		}
	}, error => {
        console.log(error);
		    this.cn_results = [];
        this.empty_text = '';
      });
	}

	getItems(keywords: any){
		if(keywords.detail.value.length > 5){
			this.searchel(keywords.detail.value);
			this.cn_results = [];
		}else{
      this.empty_text = '';
    }
	}

	onCancel(_event: any){
		//clear list of tracks
		this.cn_results = [];
    this.empty_text = '';
	}


	openTrackPage(track_id: any){
		this.route.navigate(['/track', {track_id:track_id}]);
	}

  openPages(page_id: any){
    this.route.navigate(['/pages', {id:page_id}]);
  }

	openContact(){
		this.route.navigate(['/contact']);
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
