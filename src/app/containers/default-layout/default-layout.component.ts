import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public username: string;

  constructor(private authServices: AuthService, private router: Router) {
    this.username = localStorage.getItem('username');
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authServices.logout();
    this.router.navigate(['/login']);
  }
}
