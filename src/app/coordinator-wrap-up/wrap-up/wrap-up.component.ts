import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { PlayerScores } from '../../models/PlayerScores';
import { SlammerEvent } from '../../models/SlammerEvent';
import { QuoteService } from '../../services/quote.service';
import { AllQuotes } from '../../models/AllQuotes';
import { PointsService } from '../../services/points.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from '../../login/login.component';
import { AuthService } from '../../services/auth.service';
import { BasicReg } from '../../models/BasicReg';
import { RegistrationService } from '../../services/registration.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/Group';
import { Par } from '../wrap-up-doggies/wrap-up-doggies.component';

/**
 * Main component for the 'Coordinator Wrap Up' app. Part of the larger 'Slammer App'
 * This app has many sections which are seperate components for dealing with each step in the wrap up process.
 * Event Coordinators use this app to fill out data on the event and confirm scores and commit points for players.
 *
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-wrap-up',
  templateUrl: './wrap-up.component.html',
  styleUrls: ['./wrap-up.component.scss']
})
export class WrapUpComponent implements OnInit, OnDestroy {

  loadingPercentage: number;
  subscriptions: Subscription[] = [];
  seasons: number[];
  seasonSelected: number;
  eventList: BasicSlammerEvent[];
  eventSelected: BasicSlammerEvent;
  playerScores: PlayerScores[];
  allQuotes: AllQuotes;
  pointsCommited: boolean;
  dialogRef: MatDialogRef<any>;
  allRegistered: BasicReg[];
  allBailed: BasicReg[] = [];
  userName: string;
  unsavedVideoLinks: boolean;
  groups: Group[];
  pars: Par[];
  holes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  constructor(
    private eventService: EventService,
    private quoteService: QuoteService,
    private pointsService: PointsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private registrationService: RegistrationService,
    private snackbar: MatSnackBar,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.unsavedVideoLinks = false;
    this.pointsCommited = false;
    this.loadingPercentage = 0;
    this.getSeasons();
  }

  getSeasons() {
    this.subscriptions.push(this.eventService.getAllSeasons().subscribe(response => {
      if (response.status === 200) {
        this.seasons = response.payload;
        this.seasonSelected = this.seasons[1];
        this.loadingPercentage = 20;
        this.getEventsList(this.seasonSelected);
      } else {
        alert('Sorry there was an error getting season from the database. Please try back later.');
        console.log(response);
      }
    }));
  }

  seasonChanged(season: number) {
    this.seasonSelected = season;
    this.getEventsList(season);
  }

  togglePublish() {
    this.eventSelected.published = this.eventSelected.published === '0' ? '1' : '0';
    this.subscriptions.push(this.eventService.updatePublished(this.eventSelected.id, this.eventSelected.published).subscribe(response => {
      if (response.status === 200) {
        const msg = this.eventSelected.published === '1' ? 'Event Published!' : 'Publishing removed';
        this.snackbar.open(msg, '', { duration: 1100 });
      } else {
        console.error(response);
      }
    }));
  }

  getEventsList(season: number) {
    this.subscriptions.push(this.eventService.getEventsBySeason(season).subscribe(response => {
      if (response.status === 200) {
        this.eventList = response.payload;
        this.eventSelected = this.eventList[0];
        this.loadingPercentage = 40;
        if (this.eventSelected) {
          this.getAllRegistered();
        } else {
          this.loadingPercentage = 100;
        }
      } else {
        alert('Sorry there was an error getting events from the database. Please try back later.');
        console.error(response);
      }
    }));
  }

  /**
   * When a User selects a different event. reload the data
   * @param event Slammer Event
   */
  eventChanged(event: BasicSlammerEvent) {
    if (this.loadingPercentage === 100) {
      this.loadingPercentage = 0;
    }
    this.eventSelected = event;
    this.getAllRegistered();
  }

  /**
   * Get all registered players in this event
   * Seperate bailed into own list (Players that cancelled to play)
   */
  getAllRegistered() {
    this.registrationService.getAll(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.allRegistered = response.payload;
        // filter out bailed to seperate list
        this.allRegistered.forEach(x => {
          if (x.status === 'bailed') {
            this.allBailed.push(x);
          }
        });
        this.allRegistered = this.allRegistered.filter(x => x.status !== 'bailed');
        this.loadingPercentage = 50;
        this.getGroups();
      } else {
        alert('Sorry there was an error getting registered players');
        console.error(response);
      }
    });
  }

  /**
   * Get the players as groups
   */
  getGroups() {
    this.subscriptions.push(this.groupService.getAllGroups(this.eventSelected.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.groups = response.payload;
        this.loadingPercentage = 60;
        this.getAllQuotes();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Check if a player has bailed by checking if in bailed members
   * @param slammerId Slammer ID, ie member ID on slammer tour db
   * @return boolean
   */
  hasPlayerBailed(slammerId) {
    return this.allBailed.some(y => y.slammerId === slammerId);
  }

  /**
   * Get all quotes for the event, quotes, notables and feedbacks
   */
  getAllQuotes() {
    this.subscriptions.push(this.quoteService.getAllQuotes(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.allQuotes = response.payload;
      } else {
        alert('Sorry there was an error getting the player quotes from database. Please try back later');
        console.error(response);
      }
      this.loadingPercentage = 70;
      this.checkPointsCommited();
    }));
  }

  /**
   * Check if points for the event have been stored in the database yet (commited)
   */
  checkPointsCommited() {
    this.subscriptions.push(this.pointsService.checkPointsCommited(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.pointsCommited = response.payload;
      } else {
        console.error(response);
      }
      this.loadingPercentage = 80;
      this.getPars();
    }));
  }

  /**
   * Get all pars for the course, array of numbers
   */
  getPars() {
    this.subscriptions.push(this.eventService.getPars(this.eventSelected.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.pars = response.payload;
        // if no pars found initialize each hole to zero
        if (this.pars.length < 1) {
          this.pars = [];
          for (const hole of this.holes) {
            this.pars.push( { hole, par: 0 });
          }
        }
        this.loadingPercentage = 100;
      } else {
        alert('Error getting pars for this course');
        console.error(response);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateEventLinks() {
    this.subscriptions.push(this.eventService.updateVideoLinks(this.eventSelected).subscribe(response => {
      if (response.status === 200) {
        this.snackbar.open('Update Successfull!', '', { duration: 1300 });
        this.unsavedVideoLinks = false;
      } else {
        console.error(response);
        alert('Sorry there was an error');
      }
    }));
  }

  /**
   * Send message to administration. Send email and save
   */
  sendMessage(msg: string) {
    alert(msg);
  }

  openRegDialog(type, regDialog: TemplateRef<any>) {
    const data = type === 'reg' ? this.allRegistered : this.allBailed;
    const title = type === 'reg' ? 'All Registered' : 'All Bailed';
    this.dialogRef = this.dialog.open(regDialog, { data: { data, title } , autoFocus: false, minWidth: 400 });
  }

  /**
   * Close the current open dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Return the par for a certain hole
   * @param hole Hole number
   */
  getHolePar(hole) {
    const parObj = this.pars.find(x => +x.hole === +hole);
    return parObj ? parObj.par : null;
  }

  /**
   * Open a dialog to allow editing of the scorecard for this event
   * @param dialog Dialog to open (template ref)
   */
  showEditScorecard(dialog) {
    this.dialogRef = this.dialog.open(dialog, { minWidth: '80vw', minHeight: '80vh'});
  }

  /**
   * Update the scorecard for this event, hole by hole pars
   */
  updateScorecard() {
    let validPars = true;
    for (const par of this.pars) {
      if (par.par === 0 || !par.par) {
        validPars = false;
      }
    }
    if (validPars === true) {
      this.subscriptions.push(this.eventService.updateScorecard(this.eventSelected.id, this.pars).subscribe(response => {
        if (response.status === 200) {
          this.close();
          this.snackbar.open('Scorecard updated successfully', '', { duration: 1100 } );
        } else {
          console.error(response);
        }
      }));
    } else {
      this.snackbar.open('Error, sorry you have missing or invalid pars. Each hole must have a par greater than 0.', 'dismiss');
    }
  }

}
