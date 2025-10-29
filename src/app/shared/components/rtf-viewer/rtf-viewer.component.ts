import {Component, Input} from '@angular/core';
import {GoogleViewerService} from "../../services/google-viewer.service";

@Component({
  selector: 'app-rtf-viewer',
  templateUrl: './rtf-viewer.component.html',
  styleUrls: ['./rtf-viewer.component.scss']
})
export class RtfViewerComponent {
  @Input() filePath: string = 'assets/documents/deepseek.rtf';
  @Input() linkText: string = 'открыть документ';
  @Input() tooltip: string = '';

  constructor(private googleViewer: GoogleViewerService) {}

  openDocument(event: Event): void {
    event.preventDefault();
    this.googleViewer.openRtfWithGoogleViewer(this.filePath);
  }

}
