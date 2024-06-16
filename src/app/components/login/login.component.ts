import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    //add types
    const username = formData.get('username');
    const password = formData.get('username');

    console.log(username, password);
  }
}
