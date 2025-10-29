import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleViewerService {
  openRtfWithGoogleViewer(rtfFilePath: string, anchorId?: string): void {
    // Получаем абсолютный URL к файлу
    const absoluteUrl = this.getAbsoluteUrl(rtfFilePath);

    // Используем Google Docs Viewer для отображения RTF
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;

    this.openInNewTab(googleViewerUrl);
  }

  private getAbsoluteUrl(relativePath: string): string {
    // Если файл лежит в assets, нужно получить абсолютный URL
    if (relativePath.startsWith('assets/')) {
      return `${window.location.origin}/${relativePath}`;
    }
    return relativePath;
  }

  private openInNewTab(url: string): void {
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  }

}
