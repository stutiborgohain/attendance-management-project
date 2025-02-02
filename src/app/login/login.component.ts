import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule]  // Import FormsModule directly in the standalone component
})
export class LoginComponent {
  username = '';
  password = '';
  selectedRole: string | null = null; // Track selected role

  constructor(private authService: AuthService, private router: Router) {}

  selectRole(role: string) {
    this.selectedRole = role;
  }

  login() {
    if (!this.selectedRole) {
      alert('Please select a role before logging in!');
      return;
    }

    if (this.selectedRole === 'manager') {
      if (this.authService.login(this.username, this.password, 'manager')) {
        this.router.navigate(['/manager-dashboard']);
        // this.router.navigate(['/test-component']);
      } else {
        alert('Invalid manager credentials!');
      }
    } else if (this.selectedRole === 'staff') {
      if (this.authService.login(this.username, this.password, 'staff')) {
        this.router.navigate(['/staff-portal']);
      } else {
        alert('Invalid staff credentials!');
      }
    }
  }
}
