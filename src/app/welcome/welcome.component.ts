import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  constructor(private fs:FirebaseService,private router:Router) { }

  ngOnInit(): void {
    try{
      this.fs.checkType(JSON.parse(localStorage.getItem('login')).email).then(type=>{
        if(type == 'patient'){
          this.router.navigate(['/home']);
        } else if(type == 'hospital'){
          this.router.navigate(['/dashboard']);
        }
      });
    } catch(err){};
    
  }


}
