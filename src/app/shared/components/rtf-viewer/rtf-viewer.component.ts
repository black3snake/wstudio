import {Component, Input} from '@angular/core';
import {TextDecoderRtfService} from "../../services/text-decoder-rtf.service";

@Component({
  selector: 'app-rtf-viewer',
  templateUrl: './rtf-viewer.component.html',
  styleUrls: ['./rtf-viewer.component.scss']
})
export class RtfViewerComponent {
  @Input() filePath: string = '';
  @Input() linkText: string = '';
  @Input() anchorId: string = '';
  @Input() tooltip: string = '';

  constructor(private rtfService: TextDecoderRtfService) {}

  async openDocument(event: Event): Promise<void> {
    event.preventDefault();
    await this.rtfService.parseRtfWithTextDecoder(this.filePath, this.anchorId);
  }


}
