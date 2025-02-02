import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule
import { ManagerDashboardComponent } from './manager-dashboard.component';

@NgModule({
  declarations: [ManagerDashboardComponent],
  imports: [BrowserModule, FormsModule],  // ✅ Ensure FormsModule is here
  bootstrap: [ManagerDashboardComponent]
})
export class ManagerDashboardModule { }
