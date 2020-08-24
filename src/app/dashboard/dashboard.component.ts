import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import vaccinesJSON from '../../assets/vaccines.json'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public patients:any;
  objectKeys = Object.keys;
  constructor(private fs:FirebaseService,private router:Router) { }

  ngOnInit(): void {
    try{
      this.fs.getPatients(JSON.parse(localStorage.getItem('login')).email)
      .then((patients)=>{
        this.patients = patients;
        //console.log(this.patients);
      })
    } catch(err){}
  }

  handleToggle(patient,vacName,value){
    patient.vaccines[vacName].injected = value;
    this.fs.updatePatient(patient.email,patient);
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

  dateSet(event,patient,vacName){
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let str = event.value.toString().split(' ')
    let dd = str[2]
    let mm = ("0"+(months.indexOf(str[1])+1).toString()).slice(-2);
    let yyyy = str[3]
    let date= dd + "-" + mm + "-" + yyyy;
    patient.vaccines[vacName].injDate = date;
    this.fs.updatePatient(patient.email,patient);
  }

  signOut(){
    localStorage.setItem('login','');
    this.router.navigate(['']);
  }
}
