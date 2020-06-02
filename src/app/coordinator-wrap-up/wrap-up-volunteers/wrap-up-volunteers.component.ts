import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { PlayerScores } from '../../models/PlayerScores';
import { Subscription } from 'rxjs';
import { VolunteerService } from '../../services/volunteer.service';
import { BasicReg } from '../../models/BasicReg';

@Component({
  selector: 'app-wrap-up-volunteers',
  templateUrl: './wrap-up-volunteers.component.html',
  styleUrls: ['./wrap-up-volunteers.component.scss']
})
export class WrapUpVolunteersComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  @Input() allRegistered: BasicReg[];
  subscriptions: Subscription[] = [];
  doggieMaster = Volunteer.doggieMaster;
  skinMaster = Volunteer.skinMaster;
  photoMaster = Volunteer.photoMaster;
  updating: boolean;

  constructor(
    private volunteerService: VolunteerService
  ) { }

  ngOnInit() {
    this.updating = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Update the volunteer in an event
   * @param nickname Player nickname - unforuntately the older system is configure to use nicknames rather than IDs
   * @param volunteerType Type of volunteer in database column format
   */
  updateVolunteer(nickname: string, volunteerType: Volunteer) {
    if (this.updating === false) {
      this.updating = true;
      this.subscriptions.push(this.volunteerService.update(volunteerType, this.eventSelected.id, nickname).subscribe(response => {
        if (response.status !== 200) {
          console.error(response);
        }
        this.updating = false;
      }));
    }
  }
}

export enum Volunteer {
  doggieMaster = 'doggie_master',
  photoMaster = 'photo_master',
  skinMaster = 'skin_master'
}
