import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { take } from 'rxjs/operators';
import { pipe } from 'rxjs';
import vaccinesJSON from '../../assets/vaccines.json'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  addHospital(data){
    return new Promise<any>((resolve,reject)=>{
      this.firestore.collection('hospitals').add({
        email: data.email,
        name: data.name,
        password: data.password,
      })
      .then(res => {},err => reject(err))
    });
  }

  addPatient(data){
    let vacs = vaccinesJSON.map(entry => {return entry.name});
    let vac = {}
    vacs.forEach((v)=>{ vac[v]={injected:false,injDate:null} });
    return new Promise<any>((resolve,reject)=>{
      this.firestore.collection('patients').add({
        email: data.email,
        name: data.name,
        dob: data.dob,
        hospital: data.hospital,
        password: data.password,
        vaccines: vac, 
      })
      .then(res => {},err => reject(err))
    });
  }

  getHospitals(){
    return this.firestore.collection('hospitals').valueChanges();
  }

  async getPatients(hEmail){
    let hName = undefined;
    let pats = [];
    let hospitals$ = this.firestore.collection('hospitals').valueChanges().pipe(take(1))
    hospitals$.subscribe( (hospitals:any) => {
      hospitals.forEach((entry:any)=>{
        if(entry.email === hEmail){
          hName = entry.name;
        }
      })
    });
    let patients$ = this.firestore.collection('patients').valueChanges().pipe(take(1))
    patients$.subscribe( (patients:any) => {
      patients.forEach((entry:any)=>{
        if(entry.hospital === hName){
          pats.push(entry);
        }
      })
    });
    await Promise.all([hospitals$.toPromise(),patients$.toPromise()]);
    return pats;
  }

  getPatientsAll(){
    return this.firestore.collection('patients').valueChanges();
  }

  async login(email,password){
    let type = undefined;
    let hospitals$ = this.firestore.collection('hospitals').valueChanges().pipe(take(1))
    hospitals$.subscribe( (hospitals:any) => {
      hospitals.forEach((entry:any)=>{
        if(entry.email === email && entry.password === password){
          type='hospital';
        }
      })
    });
    let patients$ = this.firestore.collection('patients').valueChanges().pipe(take(1))
    patients$.subscribe( (patients:any) => {
      patients.forEach((entry:any)=>{
        if(entry.email === email && entry.password === password){
          type='patient';
        }
      })
    });
    await Promise.all([hospitals$.toPromise(),patients$.toPromise()]);
    return type;
  }

  async checkType(email){
    let type = undefined;
    let hospitals$ = this.firestore.collection('hospitals').valueChanges().pipe(take(1))
    hospitals$.subscribe( (hospitals:any) => {
      hospitals.forEach((entry:any)=>{
        if(entry.email === email){
          type='hospital';
        }
      })
    });
    let patients$ = this.firestore.collection('patients').valueChanges().pipe(take(1))
    patients$.subscribe( (patients:any) => {
      patients.forEach((entry:any)=>{
        if(entry.email === email){
          type='patient';
        }
      })
    });
    await Promise.all([hospitals$.toPromise(),patients$.toPromise()]);
    return type;
  }

  async updatePatient(email,data){
    let id = null;
    let patients$ = this.firestore.collection('patients').snapshotChanges().pipe(take(1))
    patients$.subscribe((res)=>{
      res.forEach((patient:any)=>{
        if(patient.payload.doc.data().email===email){
          id = patient.payload.doc.id;
        }
      })
    })
    await patients$.toPromise();
    this.firestore.collection('patients').doc(id).set(data,{merge:true})
  }
}
