import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { StaffPortalComponent } from './staff-portal/staff-portal.component';
// import { StaffPortalComponent } from './staff-portal/staff-portal.component';
import { TestComponent } from './test-component/test-component.component';


// Define routes for the application
export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
  { path: 'login', component: LoginComponent },           // Route for Login
  { path: 'manager-dashboard', component: ManagerDashboardComponent },
  { path: 'staff-portal', component: StaffPortalComponent },  // Route for Manager Dashboard
  // { path: 'staff-portal', component: StaffPortalComponent },  // Route for Staff Portal
];
