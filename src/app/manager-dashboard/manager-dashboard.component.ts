import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface StaffInfo {
  name: string;
  role: string;
  shift: string;
  workingDays: string;
  username: string;
  password: string;
}

interface StaffMember extends StaffInfo {
  id: number;
}

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements AfterViewInit {
  staffList: StaffMember[] = [];
  newStaff = { name: '', role: '', shift: '', workingDays: '', username: '', password: '' }; // Added password
  editingId: number | null = null;
  editingStaff: StaffInfo = { name: '', role: '', shift: '', workingDays: '', username: '', password: '' }; // Staff being edited

  attendanceRecords: any[] = []; // Store attendance records

  constructor(private authService: AuthService, private router: Router) {
    // Bind methods to window for inline onclick calls
    (window as any).deleteStaff = this.deleteStaff.bind(this);
    (window as any).editStaff = this.editStaff.bind(this);
    (window as any).saveEditStaff = this.saveEditStaff.bind(this);
    (window as any).cancelEditStaff = this.cancelEditStaff.bind(this);
    (window as any).updateEditingStaff = this.updateEditingStaff.bind(this);

    if (!this.authService.isManagerLoggedIn()) {
      this.router.navigate(['/login']); // Redirect if not logged in as manager
    } else {
      this.staffList = this.authService.getRoster(); // Get roster data from AuthService
    }
  }

  ngAfterViewInit() {
    this.loadAttendanceRecords(); // Load attendance records from localStorage
    this.renderTables();
  }

  // Load attendance records from localStorage
  loadAttendanceRecords() {
    const storedAttendance = localStorage.getItem('attendanceRecords');
    if (storedAttendance) {
      this.attendanceRecords = JSON.parse(storedAttendance); // Parse and set attendance records
    }
  }

  // Add new staff
  addStaff() {
    // Check if username is unique
    const existingStaff = this.staffList.find(staff => staff.username === this.newStaff.username);
    if (existingStaff) {
      alert('Username must be unique!');
      return; // Stop if username is not unique
    }

    // Check if all required fields are filled
    if (this.newStaff.name && this.newStaff.role && this.newStaff.shift && this.newStaff.workingDays && this.newStaff.username && this.newStaff.password) {
      const newMember: StaffMember = {
        ...this.newStaff,
        id: this.staffList.length > 0 ? this.staffList[this.staffList.length - 1].id + 1 : 1
      };
      this.staffList.push(newMember);
      this.newStaff = { name: '', role: '', shift: '', workingDays: '', username: '', password: '' }; // Reset the newStaff object
      this.renderTables();
    }
  }

  // Delete staff by id
  deleteStaff(id: number) {
    this.staffList = this.staffList.filter(staff => staff.id !== id);
    if (this.editingId === id) {
      this.editingId = null;
    }
    this.renderTables();
  }

  // Begin editing a staff member
  editStaff(id: number) {
    const staff = this.staffList.find(s => s.id === id);
    if (staff) {
      this.editingId = id;
      this.editingStaff = { ...staff };
      this.renderTables();
    }
  }

  // Save the edited staff member
  saveEditStaff() {
    if (this.editingId !== null) {
      const index = this.staffList.findIndex(staff => staff.id === this.editingId);
      if (index !== -1) {
        this.staffList[index] = { ...this.editingStaff, id: this.editingId };
        this.editingId = null;
        this.renderTables();
      }
    }
  }

  // Cancel editing mode
  cancelEditStaff() {
    this.editingId = null;
    this.renderTables();
  }

  // Called from inline event handlers in editing inputs
  updateEditingStaff(field: keyof StaffInfo, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.editingStaff[field] = inputElement.value;
  }

  // Render both the roster and attendance tables
  renderTables() {
    const rosterTable = document.getElementById('rosterTable') as HTMLTableElement;
    if (rosterTable) {
      rosterTable.innerHTML = ''; // Clear any existing rows

      // Add table rows for staff list
      this.staffList.forEach(staff => {
        const row = rosterTable.insertRow();
        if (this.editingId === staff.id) {
          row.innerHTML = `
            <td><input value="${this.editingStaff.name}" oninput="updateEditingStaff('name', event)" /></td>
            <td><input value="${this.editingStaff.role}" oninput="updateEditingStaff('role', event)" /></td>
            <td><input value="${this.editingStaff.shift}" oninput="updateEditingStaff('shift', event)" /></td>
            <td><input value="${this.editingStaff.workingDays}" oninput="updateEditingStaff('workingDays', event)" /></td>
            <td><input value="${this.editingStaff.username}" oninput="updateEditingStaff('username', event)" /></td>
            <td><input value="${this.editingStaff.password}" oninput="updateEditingStaff('password', event)" /></td>

            <td>
              <button onclick="saveEditStaff()" class="btn btn-success">Save</button>
              <button onclick="cancelEditStaff()" class="btn btn-secondary">Cancel</button>
            </td>
          `;
        } else {
          row.innerHTML = `
            <td>${staff.name}</td>
            <td>${staff.role}</td>
            <td>${staff.shift}</td>
            <td>${staff.workingDays}</td>
            <td>${staff.username}</td>
            <td>${staff.password}</td>
            <td>
              <button onclick="editStaff(${staff.id})" class="btn btn-warning">Edit</button>
              <button onclick="deleteStaff(${staff.id})" class="btn btn-danger">Delete</button>
            </td>
          `;
        }
      });
    }

    const attendanceTable = document.getElementById('attendanceTable') as HTMLTableElement;
    if (attendanceTable) {
      attendanceTable.innerHTML = ''; // Clear any existing rows

      // Add table rows for attendance records
      this.attendanceRecords.forEach(record => {
        const row = attendanceTable.insertRow();
        row.innerHTML = `
          <td>${record.name}</td>
          <td>${record.date}</td>
          <td>${record.time}</td>
          <td><img src="${record.image}" alt="Attendance Image" width="50"></td>
        `;
      });
    }
  }

  // Save the attendance record to localStorage
  saveAttendanceRecord(record: any) {
    this.attendanceRecords.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords)); // Save to localStorage
    alert('Attendance recorded successfully!');
  }

  logout() {
    // Clear user data (e.g., remove from local storage)
    localStorage.removeItem('isManagerLoggedIn');
    localStorage.removeItem('staffList');
    
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
}

