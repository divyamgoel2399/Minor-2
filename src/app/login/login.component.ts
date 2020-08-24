import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private fs: FirebaseService,private router: Router) { }

  ngOnInit(): void {
  }
  public hide = true;
  public invalidDetails = false;

  public loginForm = this.formBuilder.group({
		email: new FormControl('', [ Validators.required, Validators.email ]),
		password: new FormControl('', [ Validators.required ])
  });
  
  get fEmail() {
		return this.loginForm.get('email');
  }
  
  get fPassword() {
		return this.loginForm.get('password');
	}

  async handleLogin(){
    let type = await this.fs.login(this.loginForm.value.email,this.loginForm.value.password);
    console.log(type);
    if(type === 'hospital' || type === 'patient'){
      localStorage.setItem('login',JSON.stringify({
        type: type,
        email: this.loginForm.value.email,
      }));
      if(type=='hospital'){
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      this.invalidDetails = true;
    }
  }
}
