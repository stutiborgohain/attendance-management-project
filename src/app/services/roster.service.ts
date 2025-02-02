import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private roster = new BehaviorSubject<any[]>([
    { id: '1', name: 'John Doe', role: 'Staff', shift: 'Morning' },
    { id: '2', name: 'Jane Smith', role: 'Staff', shift: 'Evening' }
  ]);

  getRoster() {
    return this.roster.asObservable();
  }

  addStaffMember(staff: any) {
    const currentRoster = this.roster.getValue();
    this.roster.next([...currentRoster, { ...staff, id: (currentRoster.length + 1).toString() }]);
  }

  updateStaffMember(id: string, updatedStaff: any) {
    const currentRoster = this.roster.getValue().map(staff =>
      staff.id === id ? { ...updatedStaff, id } : staff
    );
    this.roster.next(currentRoster);
  }

  deleteStaffMember(id: string) {
    const updatedRoster = this.roster.getValue().filter(staff => staff.id !== id);
    this.roster.next(updatedRoster);
  }
}
