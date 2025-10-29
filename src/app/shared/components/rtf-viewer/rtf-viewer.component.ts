import {Component, Input} from '@angular/core';
import {SimpleRtfParserService} from "../../services/simple-rtf-parser.service";

@Component({
  selector: 'app-rtf-viewer',
  templateUrl: './rtf-viewer.component.html',
  styleUrls: ['./rtf-viewer.component.scss']
})
export class RtfViewerComponent {
  @Input() filePath: string = 'assets/documents/agreement.rtf';
  @Input() linkText: string = 'открыть документ';
  @Input() anchorId: string = '';
  @Input() tooltip: string = '';

  isLoading: boolean = false;

  constructor(private rtfParser: SimpleRtfParserService) {}

  async openDocument(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (this.isLoading) return;

    this.isLoading = true;

    try {
      await this.rtfParser.parseRtfFile(this.filePath, this.anchorId);
    } catch (error) {
      console.error('Failed to open document:', error);
      // Fallback
      window.open(this.filePath, '_blank');
    } finally {
      this.isLoading = false;
    }
  }

}
