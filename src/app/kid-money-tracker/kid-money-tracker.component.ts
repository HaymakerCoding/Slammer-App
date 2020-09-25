import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { KidsMoneyService } from '../services/kids-money.service';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';
import { KidsMoney, Payment } from '../models/KidsMoney';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kid-money-tracker',
  templateUrl: './kid-money-tracker.component.html',
  styleUrls: ['./kid-money-tracker.component.scss']
})
export class KidMoneyTrackerComponent implements OnInit, OnDestroy {

  loadingPercent: number;
  subscriptions: Subscription[] = [];
  seasons: number[];
  seasonSelected: number;
  kidsMoney: KidsMoney[];
  dialogRef: MatDialogRef<any>;
  admin: boolean;

  constructor(
    private moneyService: KidsMoneyService,
    private eventService: EventService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.admin = this.authService.isAdmin();
    this.getSeasons();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
  }

  getSeasons() {
    this.eventService.getAllSeasons().subscribe(response => {
      if (response.status === 200) {
        this.seasons = response.payload;
        this.seasonSelected = +this.seasons[0];
        this.setLoadingPercent(20);
        this.getMoneyTrackerData();
      } else {
        console.error(response);
      }
    });
  }

  /**
   * Get Money tracker data for all coordinators. This holds all their events, money raised and payments made.
   */
  getMoneyTrackerData (){
    this.subscriptions.push(this.moneyService.getMoneyTrackerData(this.seasonSelected.toString()).subscribe(response => {
      if (response.status === 200) {
        this.kidsMoney = response.payload;
        this.sortMoney();
        this.setLoadingPercent(100);
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Sort all coordinators by their total amounts raised DESC
   */
  sortMoney() {
    this.kidsMoney.sort((a, b) => (
      this.getTotal(a) - this.getTotal(b)
    )).reverse();
  }

  /**
   * Get the total RAISED by a coordinator
   * @param money Kids Money obj
   */
  getTotal(money: KidsMoney): number {
    let total = 0;
    money.events.forEach(x => {
      total += +x.moneyRaised;
    })
    return total;
  }

  /**
   * Return balance owed for a coordinator
   * @param money Kids Money obj
   */
  getBalance(money: KidsMoney): number {
    let paid = 0;
    money.payments.forEach(x => {
      paid += +x.amount;
    });
    return this.getTotal(money) - paid;

  }

  /**
   * User changes season, fetch money info again
   */
  onSeasonChange() {
    this.setLoadingPercent(20);
    this.getMoneyTrackerData();
  }

  showAddMoney(dialog: TemplateRef<any>, money: KidsMoney) {
    this.dialogRef = this.dialog.open(dialog, { data: money });
  }

  close(){
    this.dialogRef.close();
  }

  addPayment(money: KidsMoney, amount: number) {
    this.subscriptions.push(this.moneyService.addPayment(money.slammerId, amount, this.seasonSelected).subscribe(response => {
      if (response.status === 201) {
        this.snackbar.open('Payment Added!', '', { duration: 1100 });
        money.payments.push({ id: response.payload, amount: amount, date: 'now' })
        this.close();
      } else if (response.status === 403 || response.status === 401) {
        this.snackbar.open('Sorry you are not authorized to perform this action.', 'dismiss');
      } else {
        console.error(response);
      }
    }));
  }

  showEditMoney(money: KidsMoney, payment: Payment, dialog: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(dialog, { data: { payment, money }} );
  }

  updatePayment(payment: Payment) {
    this.subscriptions.push(this.moneyService.updatePayment(payment).subscribe(response => {
      if (response.status === 200) {
        this.snackbar.open('Payment Updated!', '', { duration: 1100 });
        this.close();
      } else {
        console.error(response);
      }
    }));
  }

  deletePayment(payment: Payment, money: KidsMoney) {
    this.subscriptions.push(this.moneyService.deletePayment(payment.id.toString()).subscribe(response => {
      if (response.status === 200) {
        money.payments = money.payments.filter(x => +x.id !== +payment.id);
        this.snackbar.open('Payment Deleted!', '', { duration: 1100 });
        this.close();
      } else {
        console.error(response);
      }
    }));
  }

  loginToEditMoney(){
    sessionStorage.setItem('destination', 'money-tracker');
    this.router.navigate(['login']);
  }


}
