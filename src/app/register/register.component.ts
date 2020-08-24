import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {
	public hospitals = [];

	constructor(private formBuilder: FormBuilder, private fs: FirebaseService) {}

	ngOnInit(): void {
		this.fs.getHospitals().subscribe((res) => {
			this.hospitals = [];
			res.forEach((h: any) => {
				if (h) {
					this.hospitals.push(h.name);
				}
			});
		});

		this.regForm.get('type').valueChanges.subscribe(val=>{
			if(val == 'patient'){
				this.regForm.get('dob').setValidators([ Validators.required ])
				this.regForm.get('hospital').setValidators([ Validators.required ])
			} else {
				this.regForm.get('dob').clearValidators()
				this.regForm.get('hospital').clearValidators()
			}
			this.regForm.get('dob').updateValueAndValidity()
			this.regForm.get('hospital').updateValueAndValidity()
		})
	}

	public hide = true;
	public registered = false;

	public regForm = this.formBuilder.group({
		type: new FormControl('patient', [ Validators.required ]),
		name: new FormControl('', [ Validators.required ]),
		email: new FormControl('', [ Validators.required, Validators.email ]),
		dob: new FormControl('', [ Validators.required ]),
		hospital: new FormControl('', [ Validators.required ]),
		password: new FormControl('', [ Validators.required ])
	});

	get fName() {
		return this.regForm.get('name');
	}

	get fEmail() {
		return this.regForm.get('email');
	}

	get fDob() {
		return this.regForm.get('dob');
	}

	get fPassword() {
		return this.regForm.get('password');
	}

	get fHospital() {
		return this.regForm.get('hospital');
	}

	handleRegister() {
		if(this.regForm.valid){
			if (this.regForm.value.type == 'patient') {
				this.fs.addPatient(this.regForm.value);
			} else {
				this.fs.addHospital(this.regForm.value);
			}
			this.registered = true;
		}
	}
}
