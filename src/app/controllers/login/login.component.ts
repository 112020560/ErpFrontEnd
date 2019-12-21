import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: '../../views/login/login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    private activated: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  onLogin = () => {
    this.router.navigate(['/dashboard']);
  }
}
