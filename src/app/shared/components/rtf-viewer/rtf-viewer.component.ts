import {Component, Input} from '@angular/core';
import {HexRtfParserService} from "../../services/hex-rtf-parser.service";

@Component({
  selector: 'app-rtf-viewer',
  templateUrl: './rtf-viewer.component.html',
  styleUrls: ['./rtf-viewer.component.scss']
})
export class RtfViewerComponent {
  @Input() filePath: string = 'assets/documents/Policy.rtf';
  @Input() linkText: string = 'открыть документ';
  @Input() anchorId: string = '';
  @Input() tooltip: string = '';

  constructor(private rtfParserService: HexRtfParserService) {}

  async openDocument(event: Event): Promise<void> {
    event.preventDefault();
    await this.rtfParserService.parseRtfFile(this.filePath, this.anchorId);
  }

}
