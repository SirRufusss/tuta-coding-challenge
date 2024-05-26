import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { UrlCheckerComponent } from "./url-checker/url-checker.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [HeaderComponent, FooterComponent, UrlCheckerComponent]
})
export class AppComponent {
  title = 'tuta-coding-challenge';
}
