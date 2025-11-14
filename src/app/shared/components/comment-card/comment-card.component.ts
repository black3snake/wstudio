import {Component, Input} from '@angular/core';
import {CommentsType} from "../../../../types/comments-count.type";

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent {
  @Input() comment!: CommentsType;
}
