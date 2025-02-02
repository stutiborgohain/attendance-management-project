import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceRecords = new BehaviorSubject<any[]>([
    { name: 'John Doe', date: '2025-02-01', time: '09:00 AM', image: 'assets/john.jpg' },
    { name: 'Jane Smith', date: '2025-02-01', time: '05:00 PM', image: 'assets/jane.jpg' }
  ]);

  getAttendance() {
    return this.attendanceRecords.asObservable();
  }
}
