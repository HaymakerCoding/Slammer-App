import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { DoggieService } from '../../services/doggie.service';
import { BasicReg } from '../../models/BasicReg';

@Component({
  selector: 'app-wrap-up-doggies',
  templateUrl: './wrap-up-doggies.component.html',
  styleUrls: ['./wrap-up-doggies.component.scss']
})
export class WrapUpDoggiesComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  @Input() allRegistered: BasicReg[];
  @Input() pars: Par[];

  subscriptions: Subscription[] = [];
  columns = ['hole', 'name', 'distance'];
  datasource: MatTableDataSource<any>;
  winners: DoggieWinner[] = [];
  dialogRef: MatDialogRef<any>;
  holeSelected;

  constructor(
    private doggieService: DoggieService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.pars) {
      this.initWinners();
    } else {
      console.error('No pars in doggie section');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Initialize all the POSSIBLE winners. determined by holes where par is 3.
   */
  initWinners() {
    this.pars.forEach(x => {
      if (x.par <= 3) {
        this.winners.push(new DoggieWinner(null, x.hole, null, null, null));
      }
    });
    this.datasource = new MatTableDataSource(this.winners);
    this.getWinners();
  }

  /**
   * Get the winners already set
   */
  getWinners() {
    this.subscriptions.push(this.doggieService.getDoggieWinners(this.eventSelected.id.toString()).subscribe(response => {
      if (response.status === 200) {
        const winnerRecords: any[] = response.payload;
        winnerRecords.forEach(x => {
          const winner = this.winners.find(y => y.hole === +x.hole);
          if (winner) {
            winner.name = x.nickname;
            winner.distance = x.distance;
            winner.slammerId = +x.player;
            winner.id = +x.id;
          }
        });
      } else {
        alert('Error getting the doggie winners');
        console.error(response);
      }
    }));
  }

  addWinner(playerId, distance) {
    if (playerId === null || playerId === '') {
      alert('Please choose a player');
    } else if (distance === null || distance === '' || distance === ' ') {
      alert('Please enter a distance');
    } else {
      this.subscriptions.push(this.doggieService.add(this.eventSelected.id, playerId, distance, this.holeSelected).subscribe( response => {
        if (response.status === 201) {
          const winner = this.winners.find(x => x.hole === this.holeSelected);
          winner.id = response.payload;
          winner.distance = distance;
          winner.slammerId = playerId;
          winner.name = this.allRegistered.find(x => x.slammerId === playerId).nickname;
        } else {
          alert('Sorry there was a problem adding the doggie winner.');
          console.error(response);
        }
        this.close();
      }));
    }
  }

  updateWinner(playerId, distance, id) {
    if (playerId === null || playerId === '') {
      alert('Please choose a player');
    } else if (distance === null || distance === '' || distance === ' ') {
      alert('Please enter a distance');
      console.log('here');
    } else {
      this.subscriptions.push(this.doggieService.update(id, playerId, distance, this.eventSelected.id).subscribe(
        response => {
          console.log(response);
          if (response.status === 200) {
            if (playerId !== 0) {
              const winner = this.winners.find(x => x.hole === this.holeSelected);
              winner.distance = distance;
              winner.slammerId = playerId;
              winner.name = this.allRegistered.find(x => x.slammerId === playerId).nickname;
            }
          } else {
            alert('Sorry there was a problem updating the doggie winner.');
            console.error(response);
          }
          this.close();
        }
      ));
    }
  }

  deleteWinner(id: number) {
    if (confirm('Are you sure you want to delete this doggie winner?') === true) {
      this.subscriptions.push(this.doggieService.delete(id, this.eventSelected.id.toString()).subscribe(response => {
        if (response.status === 200) {
          const winner = this.winners.find(x => x.id === id);
          winner.distance = null;
          winner.id = null;
          winner.name = null;
          winner.slammerId = null;
          this.datasource.data = this.winners;
        } else {
          alert('Sorry there was a problem deleting the record');
          console.error(response);
        }
        this.close();
      }));
    }
  }

  showDoggieDialog(dialog: TemplateRef<any>, data: DoggieWinner, hole) {
    this.holeSelected = hole;
    this.dialogRef = this.matDialog.open(dialog, { data, autoFocus: false } );
  }

  close() {
    this.dialogRef.close();
  }

}

export interface Par {
  hole: number;
  par: number;
}

export class DoggieWinner {
  constructor(
    public id: number,
    public hole: number,
    public name: string,
    public distance: string,
    public slammerId: number
  ) {}
}


