import { Component } from '@angular/core';
import { mockData } from '../mock-data/mock-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-checker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './url-checker.component.html',
  styleUrl: './url-checker.component.scss'
})
export class UrlCheckerComponent {
  url: string = '';
  validationMessage: string = '';
  message: string = '';
  timeoutId: any;
  htmlToAdd = "Test Clipboard"

  // Validate URL format on input change
  validateUrl(): void {
    this.message = '';
    if (!this.isValidUrl(this.url)) {
      this.validationMessage = 'Kein gültiges URL Format';
    } else {
      this.validationMessage = '';
      this.checkUrl();
    }
  }

  // Check if URL is valid
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Mock server check for URL existence
  async checkUrlExists(url: string): Promise<{ exists: boolean, type: string | null }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedUrl = url.toLowerCase();
        const response = mockData[normalizedUrl] || { exists: false, type: null };
        resolve(response);
      }, 500);
    });
  }

  // Check if URL exists on button click
  async checkUrl(): Promise<void> {
    if (!this.isValidUrl(this.url)) {
      this.message = 'Invalid URL format';
      return;
    }

    this.message = 'Prüfe URL...';

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(async () => {
      try {
        const response = await this.checkUrlExists(this.url);
        if (!response.exists) {
          this.message = 'URL existiert nicht';
        } else if (response.type === null) {
          this.message = 'URL existiert, ABER zeigt nicht auf einen Order oder eine Datei';
        } else {
          this.message = `URL existiert und zeigt auf ${response.type}.`;
        }
      } catch (error) {
        this.message = 'ERROR (Fehler beim prüfen der URL).';
      }
    }, 1000);  // Throttling time set to 1 second
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
