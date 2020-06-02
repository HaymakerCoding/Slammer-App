import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { KidsMoneyService } from '../../services/kids-money.service';
import { SlammerEvent } from '../../models/SlammerEvent';

@Component({
  selector: 'app-wrap-up-kids-money',
  templateUrl: './wrap-up-kids-money.component.html',
  styleUrls: ['./wrap-up-kids-money.component.scss']
})
export class WrapUpKidsMoneyComponent implements OnInit, OnDestroy {

  @Input() eventSelected: SlammerEvent;
  subscriptions: Subscription[] = [];
  kidsMoney;
  dialogRef: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private kidsMoneyService: KidsMoneyService
  ) { }

  ngOnInit() {
    this.getKidsMoney();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getKidsMoney() {
    this.subscriptions.push(this.kidsMoneyService.get(this.eventSelected.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.kidsMoney = response.payload;
      } else if (response.status === 404) {
        // no money set
      } else {
        alert('Sorry there was an error getting the kids money for this event');
        console.error(response);
      }
    }));
  }

  saveMoney(money) {
    this.subscriptions.push(this.kidsMoneyService.update(this.eventSelected.id, money).subscribe(response => {
      if (response.status === 200) {
        this.kidsMoney = money;
      } else {
        console.error(response);
      }
      this.close();
    }));
  }

  openDialog(moneyDialog) {
    this.dialogRef = this.dialog.open(moneyDialog, { autoFocus: false });
  }

  close() {
    this.dialogRef.close();
  }

}
