import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import vaccinesJSON from '../../assets/vaccines.json'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public patient:any;
  objectKeys = Object.keys;

  constructor(private fs:FirebaseService,private router:Router) { }

  ngOnInit(): void {
    this.fs.getPatientsAll().subscribe((patients)=>{
      patients.forEach((patient:any)=>{
        if(patient.email == JSON.parse(localStorage.getItem('login')).email){
          this.patient = patient;
        }
      })
    })
  }

  dueDate(patient,vacName){
    let dobYear = parseInt(patient.dob.substring(0,patient.dob.indexOf('-')));
    let dobMonth = parseInt(patient.dob.substring(patient.dob.indexOf('-') + 1,patient.dob.lastIndexOf('-')));
    let dobDay = parseInt(patient.dob.substring(patient.dob.lastIndexOf('-') + 1));
    let vac = vaccinesJSON.filter((entry)=>{
      if(vacName === entry.name){
        return true;
      }
    });
    let vacYear = parseInt(vac[0].years);
    let vacMonth = parseInt(vac[0].months);
    let dueYear = dobYear + vacYear + Math.floor(vacMonth/12);
    let dueMonth = dobMonth + Math.floor(vacMonth%12);
    return `${dobDay}-${dueMonth}-${dueYear}`;
  }

  signOut(){
    localStorage.setItem('login','');
    this.router.navigate(['']);
  }
}
