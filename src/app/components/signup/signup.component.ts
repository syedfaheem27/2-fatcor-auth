import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const username = formData.get('username');
    const emailId = formData.get('email');
    const phoneNumber = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    console.log(username, emailId, password, confirmPassword, phoneNumber);
  }
}
