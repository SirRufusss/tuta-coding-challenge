import { Component } from '@angular/core';
import { mockData } from '../mock-data/mock-data';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-url-checker',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './url-checker.component.html',
  styleUrl: './url-checker.component.scss'
})
export class UrlCheckerComponent {
  urlControl = new FormControl('');
  validationMessage: string = '';
  message: string = '';
  htmlToAdd = "Test Clipboard";

  constructor() {
    this.urlControl.valueChanges.pipe(
      debounceTime(300),  // Wait for the user to stop typing for 300ms
      distinctUntilChanged(),  // Only proceed if the value has changed
      switchMap(url => {
        this.message = 'Prüfe URL...';
        if (this.isValidUrl(url)) {
          this.validationMessage = '';
          return this.checkUrlExists(url).pipe(
            catchError(() => {
              this.message = 'ERROR (Fehler beim prüfen der URL).';
              return of(null);
            })
          );
        } else {
          this.validationMessage = 'Kein gültiges URL Format';
          this.message = '';
          return of(null);
        }
      })
    ).subscribe(response => {
      if (response) {
        if (!response.exists) {
          this.message = 'URL existiert nicht';
        } else if (response.type === null) {
          this.message = 'URL existiert, ABER zeigt nicht auf einen Order oder eine Datei';
        } else {
          this.message = `URL existiert und zeigt auf ${response.type}.`;
        }
      }
    });
  }

  // Check if URL is valid
  isValidUrl(url: string | null): boolean {
    try {
      new URL(url ? url : '');
      return true;
    } catch (_) {
      return false;
    }
  }

  // Mock server check for URL existence
  checkUrlExists(url: string | null) {
    return timer(5000).pipe(  // Simulate a network delay of 5 seconds
      switchMap(() => {
        const normalizedUrl = url ? url.toLowerCase() : '';
        const response = mockData[normalizedUrl] || { exists: false, type: null };
        return of(response);
      })
    );
  }

  copyContent(text: string): void {
    const content1 = document.createElement('textarea');
    content1.value = text;
    document.body.appendChild(content1);
    content1.focus();
    content1.select();
    document.execCommand('copy');
    document.body.removeChild(content1);
  }
}
