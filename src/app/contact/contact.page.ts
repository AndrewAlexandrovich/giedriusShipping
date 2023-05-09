import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

public contacts:any = [];

  constructor(private router:Router, private http: HttpClient, 	public toastController: ToastController, formBuilder: FormBuilder) { }

  ngOnInit() {
    //get contacts from server
    this.http.post('https://giedrius-shipping.com/api/appPoint.php', {
      type: 'getContact'
    }).subscribe(response => {
      if(response){
        console.log(typeof response);
        let response2 = JSON.parse(JSON.stringify(response));
        this.contacts = [];
        // this.contacts = JSON.parse(JSON.stringify(response))[1];
        this.contacts = Object.values(response);
        console.log(Object.values(response));
      }

      console.log(response);
    }, error => {
        this.showToast('Error!', 'Something wrong, pelase restart app and try again.');
      });
  }
	goHome(){
		this.router.navigate(['/home']);
	}

  writeClipboard(text:any){
    if(text){
      Clipboard.write({
        string: text
      });
      //show toast
      this.showToast('Success!','Successfully copied to clipboard.', 3000);
    }
  }

  //submit contact form
    submitForm(fd: NgForm){
      //validate
      let error = false;
      let values = fd.value;
        if(values.name.length < 3){
          this.showToast('Error!', 'Please enter your name');
          error = true;
        }
        if(values.email.length < 3){
          this.showToast('Error!', 'Please enter your email');
          error = true;
        }


        if(!values.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
          this.showToast('Error!', 'Email address is invalid');
          error = true;
        }

        if(!error){
          this.http.post('https://giedrius-shipping.com/api/appPoint.php', {
            type: 'sendEmail',
            name: values.name,
            email: values.email,
            phone: values.phone,
            comment: values.comment,
            company: values.company
          }).subscribe(response => {
            let _key = Object.keys(response);//JSON.parse(JSON.stringify(response));
            if(_key[0] == 'msg'){
              this.showToast('Success', Object.values(response));
           }else{
              this.showToast('Error', Object.values(response));
           }
            console.log(response);
          }, error => {
              this.showToast('Error!', 'Something wrong, pelase restart app and try again.');
            });
        }



      console.log(fd.value);
    }
  // show toast
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
