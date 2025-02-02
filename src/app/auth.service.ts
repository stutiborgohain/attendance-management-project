import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private managerKey = 'isManagerLoggedIn'; // Key for checking if Manager is logged in
  private currentUserKey = 'currentUser';
  // private staffList = [
  //   { username: 'staff1', password: 'password1' },
  //   { username: 'staff2', password: 'password2' },
  // ]; // List of staff
  private staffList = [
    { id: 1, name: 'John Doe new', role: 'Staff', shift: 'Morning', workingDays: 'Mon, Wed, Fri', username: 'staff1', password: 'password1' },
    { id: 2, name: 'Jane Smith new', role: 'Staff', shift: 'Evening', workingDays: 'Tue, Thu', username: 'staff2', password: 'password2' }
  ];

  constructor(private router: Router) {}

  // Login function for Manager or Staff
  // login(username: string, password: string, role: string): boolean {
  //   if (role === 'manager' && username === 'admin' && password === 'password123') {
  //     localStorage.setItem(this.managerKey, 'true'); // Store login state for Manager
  //     return true;
  //   } 
  //   if (role === 'staff') {
  //     const staff = this.staffList.find(staffMember => staffMember.username === username && staffMember.password === password);
  //     if (staff) {
  //       localStorage.setItem(this.currentUserKey, JSON.stringify(staff)); // Store the logged-in staff data
  //       return true;
  //     }
  //   }
  //   return false; // Invalid credentials for Manager or Staff
  // }

  
  login(username: string, password: string, role: string): boolean {
    if (role === 'manager' && username === 'admin' && password === 'password123') {
      localStorage.setItem(this.managerKey, 'true'); // Store login state for Manager
      return true;
    } else if (role === 'staff') {
      const staff = this.staffList.find(staffMember => staffMember.username === username && staffMember.password === password);
      if (staff) {
        this.router.navigate(['/staff-portal']);
        localStorage.setItem(this.currentUserKey, JSON.stringify(staff)); // Store the logged-in staff data
        return true;
      }
    }
    return false; // Invalid credentials for Manager or Staff
  }
  

  // Check if Manager is logged in
  isManagerLoggedIn(): boolean {
    return localStorage.getItem(this.managerKey) === 'true';
  }
  getCurrentStaff(): any {
    const currentUser = localStorage.getItem(this.currentUserKey);
    return currentUser ? JSON.parse(currentUser) : null;
  }
  getRoster(): any[] {
    return this.staffList;
  }
  // Check if either Manager or Staff is logged in
  isLoggedIn(): boolean {
    return this.isManagerLoggedIn() || this.getCurrentStaff() !== null; // Check if either Manager or Staff is logged in
  }
  
  // Logout function to remove login state
  logout(): void {
    localStorage.removeItem(this.managerKey);
    this.router.navigate(['/login']); // Redirect to login page
  }
}


