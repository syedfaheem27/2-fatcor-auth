import { Component, Input, OnInit } from '@angular/core';
import { FaIcon } from 'src/app/models/fa-icon.interface';

type InputType = 'password' | 'text';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
})
export class PasswordInputComponent implements OnInit {
  @Input() placeholder!: string;
  @Input() id!: string;
  @Input() name!: string;
  inputType: InputType = 'password';

  eyeIcon: FaIcon = FaIcon.eyeSlash;

  constructor() {}

  ngOnInit(): void {}

  public togglePasswordVisibility(): void {
    this.eyeIcon = this.eyeIcon === FaIcon.eye ? FaIcon.eyeSlash : FaIcon.eye;
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
}
