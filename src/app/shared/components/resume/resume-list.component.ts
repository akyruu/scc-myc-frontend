import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss'],
})
export class ResumeListComponent {
  @HostBinding('attr.class') className = 'resume-list';
}
