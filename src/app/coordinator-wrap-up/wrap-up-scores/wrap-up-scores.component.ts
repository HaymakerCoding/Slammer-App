import { Component, OnInit, Input, TemplateRef, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { PlayerScores } from '../../models/PlayerScores';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { ScoresService } from '../../services/scores.service';
import { Subscription } from 'rxjs';
import { BasicReg } from '../../models/BasicReg';
import { Group, Score } from '../../models/Group';

@Component({
  selector: 'app-wrap-up-scores',
  templateUrl: './wrap-up-scores.component.html',
  styleUrls: ['./wrap-up-scores.component.scss']
})
export class WrapUpScoresComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  @Input() allBailed: BasicReg[] = [];
  @Input() allRegistered: BasicReg[];
  @Input() groups: Group[];

  @ViewChildren('scoreInputs') scoreInputs: QueryList<any>;
  private originalScores: PlayerScores[] = [];
  playerScores: PlayerScores[] = [];
  columns = ['name'];
  dataSource: MatTableDataSource<any>;
  dialogRef: MatDialogRef<any>;
  subscriptions: Subscription[] = [];
  playersWithNoScores: BasicReg[] = [];
  holes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  constructor(
    private dialogService: MatDialog,
    private scoreService: ScoresService,
  ) { }

  ngOnInit() {
    this.setupColumns();
    this.getPlayerScores();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Get all players and their scores for the event selected
   */
  getPlayerScores() {
    this.subscriptions.push(this.scoreService.getAllScores(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.playerScores = response.payload;
        this.originalScores = JSON.parse(JSON.stringify(this.playerScores));
        this.getPlayersWithoutScores();
      } else {
        alert('Sorry there was an error getting the player scores from database. Please try back later');
        console.error(response);
      }
    }));
  }

  getPlayersWithoutScores() {
    this.allRegistered.forEach(reg => {
      if (this.playerScores.some(x => x.slammerId === reg.slammerId) === false && reg.status !== 'bailed') {
          this.playersWithNoScores.push(reg);
      }
    });
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
   * Init the columns for the mat table, 18 holes plus total
   */
  setupColumns() {
    for (let x = 1; x < 19; x++) {
      this.columns.push('#' + x);
    }
    this.columns.push('total');
  }

  /**
   * User selected to edit scores. Open the editing dialog
   * @param player Players Scores obj
   * @param dialog Template ref holding dialog
   */
  editScores(playerId, dialog: TemplateRef<any>, errorDialog: TemplateRef<any> ) {
    const player: PlayerScores = this.playerScores.find(x => +x.slammerId === +playerId);
    if (player) {
      this.dialogRef = this.dialogService.open(dialog, { data: player, autoFocus: false, disableClose: true });
    } else {
      // no player found, so we are missing scores, open a dialog to offer to initlize the group scores
      const group: Group = this.groups.find(x => +x.player1id === +playerId || x.player2id === playerId ||
        x.player3id === playerId || x.player4id === playerId);
      if (group) {
        this.dialogRef = this.dialogService.open(errorDialog, { data: group, autoFocus: false, disableClose: true });
      } else {
        alert('No group found');
      }
    }
  }

  /**
   * Fired when an input value was change, user changed the score value.
   * Updates the players score for that hole in memory as well as auto focuses to the next input element
   * @param id  Slammer ID
   * @param hole Golf course hole number
   * @param score New player score
   * @param index Current index of input elements for these scores
   */
  changePlayerSore(id, hole, score, index: number) {
    if (score) {
      const player = this.playerScores.find(x => x.slammerId === id);
      const playerScore = player.scores.find(y => y.hole === hole);
      const oldScore = playerScore.score;
      playerScore.score = score;
      player.total = +player.total - +oldScore + +score;
      const a = this.scoreInputs.toArray();
      const e: ElementRef = a[index + 1];
      if (e) {
        e.nativeElement.focus();
        e.nativeElement.select();
      }
    }
  }

  /**
   * User cancelled editing scores so reset any scores and close the dialog
   * @param data Player scores
   */
  cancel(data: PlayerScores) {
    this.close();
    const originalScores = this.originalScores.find(x => x.slammerId === data.slammerId).scores;
    this.playerScores.find(x => x.slammerId === data.slammerId).scores = originalScores;
  }

  /**
   * Save the new scores to the database for a player in this event
   * @param scores Player Scores object containing an array of Scores by hole
   */
  saveScores(scores: PlayerScores) {
    this.subscriptions.push(this.scoreService.update(scores, this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.originalScores = this.playerScores;
        this.dataSource = new MatTableDataSource(this.playerScores);
      } else {
        alert('Sorry there was an error saving the scores');
        console.error(response);
      }
      this.close();
    }));
  }

  /**
   * Get a players score for a hole
   * @param playerId Player Slammer ID
   * @param hole hole number
   */
  getHoleScore(playerId, hole)  {
    const playerScores = this.playerScores.find(x => +x.slammerId === +playerId);
    if (playerScores && playerScores.scores) {
      return playerScores.scores.find( x => x.hole === hole).score;
    } else {
      return 0;
    }
  }

   /**
   * Initalize a record in the live scoring table for all players in a group
   * Needed when they don't enter scores via app.
   * @param group Group of players
   */
  initGroupScores(group: Group) {
    this.subscriptions.push(this.scoreService.initScores(group, this.eventSelected.id).subscribe(response => {
      if (response.status === 201) {
        this.getPlayerScores();
        this.close();
      } else {
        console.error(response);
      }
    }));
  }

  close() {
    this.dialogRef.close();
  }

}
