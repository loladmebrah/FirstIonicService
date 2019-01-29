import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentialsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email:['', Validators.required],
      accountnumber:['', [Validators.required, Validators.minLength(8)]],
      username:['', [Validators.required, Validators.minLength(6)]],
      password:['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit(){
    this.authService.register(this.credentialsForm.value).subscribe(res =>{
      this.authService.login(this.credentialsForm.value).subscribe();
    });
  }

}
