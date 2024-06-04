import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  themeFromSourceColor,
  argbFromHex,
  applyTheme,
} from '@material/material-color-utilities';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  generateDynamicTheme(ev: Event) {
    const fallbackColor = '#005cbb';
    const sourceColor = (ev.target as HTMLInputElement).value;

    let argb;
    try {
      argb = argbFromHex(sourceColor);
    } catch (error) {
      // falling to default color if it's invalid color
      argb = argbFromHex(fallbackColor);
    }

    const targetElement = document.documentElement;

    // Get the theme from a hex color
    const theme = themeFromSourceColor(argb);

    // Print out the theme as JSON
    console.log(JSON.stringify(theme, null, 2));

    // Identify if user prefers dark theme
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    // Apply theme to root element
    applyTheme(theme, {
      target: targetElement,
      dark: systemDark,
      brightnessSuffix: true,
    });

    const styles = targetElement.style;

    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const propName = styles[key];
        if (propName.indexOf('--md-sys') === 0) {
          const sysPropName = '--sys' + propName.replace('--md-sys-color', '');
          targetElement.style.setProperty(
            sysPropName,
            targetElement.style.getPropertyValue(propName)
          );
        }
      }
    }
  }
}
