import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-portal',
  templateUrl: './staff-portal.component.html',
  styleUrls: ['./staff-portal.component.css']
})
export class StaffPortalComponent implements OnInit {
  staff: any = null;
  isAuthenticated: boolean = false;
  imageSrc: string | null = null;
  webcamActive: boolean = false;
  videoStream: any;
  attendanceRecords: any[] = [];
  saveButtonDisabled = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.staff = this.authService.getCurrentStaff();
    this.attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]'); // Load attendance records from localStorage

    this.startWebcam();
  }

  startWebcam() {
    const videoElement = document.getElementById('webcam') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoStream = stream;
        videoElement.srcObject = stream;
        this.webcamActive = true;
      })
      .catch((err) => {
        console.error('Error accessing webcam: ', err);
        this.webcamActive = false;
      });
  }

  captureImage() {
    const videoElement = document.getElementById('webcam') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement?.videoWidth || 320;
    canvas.height = videoElement?.videoHeight || 240;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      this.imageSrc = canvas.toDataURL('image/png');
      this.saveButtonDisabled = false;
    }
  }

  saveImage() {
    if (this.imageSrc) {
      const today = new Date().toLocaleDateString(); // Get today's date

      // Check if the user has already captured an image today
      const existingRecord = this.attendanceRecords.find(record => record.name === this.staff.name && new Date(record.date).toLocaleDateString() === today);

      if (existingRecord) {
        alert('You can only capture one image per day.');
        return;
      }

      const timestamp = new Date().toLocaleString(); // Get the current time
      const attendanceRecord = {
        name: this.staff.name,
        date: timestamp,
        time: timestamp,
        image: this.imageSrc
      };
      this.attendanceRecords.push(attendanceRecord);

      localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords)); // Save updated records to localStorage
      alert('Image saved successfully!');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
