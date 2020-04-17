import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: '../../views/login/login.component.html'
})
export class LoginComponent implements OnInit {

  public username: any;
  public password: any;
  private dataResponse: any;

  constructor(private authService: AuthService,
    private router: Router,
    private activated: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onLogin = () => {
    this.authService.authenticate(this.username, this.password).subscribe((data) => {
      this.dataResponse = data;
      console.log(' => Login Data', this.dataResponse);
      if (this.dataResponse.message == 'Ok') {
        localStorage.setItem('username', this.dataResponse.username);
        this.router.navigate(['/dashboard']);
      }
    }, (error) => {
      console.log(error);
      this.showError(error.message);
    });
  }

  showError = (error: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error
      // footer: '<a href>Why do I have this issue?</a>'
    });
  }
}
