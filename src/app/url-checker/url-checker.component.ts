import { Component } from '@angular/core';
import { mockData } from '../mock-data/mock-data';

@Component({
  selector: 'app-url-checker',
  standalone: true,
  imports: [],
  templateUrl: './url-checker.component.html',
  styleUrl: './url-checker.component.scss'
})
export class UrlCheckerComponent {
  url: string = '';
  validationMessage: string = '';
  message: string = '';
  timeoutId: any;

  // Validate URL format on input change
  validateUrl(): void {
    this.message = '';
    if (!this.isValidUrl(this.url)) {
      this.validationMessage = 'Invalid URL format';
    } else {
      this.validationMessage = '';
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

    this.message = 'Checking URL...';

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(async () => {
      try {
        const response = await this.checkUrlExists(this.url);
        if (!response.exists) {
          this.message = 'URL does not exist.';
        } else if (response.type === null) {
          this.message = 'URL exists but it does not point to a file or folder.';
        } else {
          this.message = `URL exists and it points to a ${response.type}.`;
        }
      } catch (error) {
        this.message = 'Error checking URL.';
      }
    }, 1000);  // Throttling time set to 1 second
  }
}