import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Payment } from '../models/KidsMoney';

@Injectable({
  providedIn: 'root'
})
export class KidsMoneyService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get the kids money for an event
   * @param eventId Event PK
   */
  get(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Update the kids money for an event
   * @param eventId Event PK
   * @param money dollar value
   */
  update(eventId, money) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/update/index.php';
    return this.http.patch<any>(URL, { eventId, money }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  getMoneyTrackerData(season: string) {
    const params = new HttpParams().set('season', season);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/get-money-tracker-data/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Add a payment for a coordinator owed kids money from event
   */
  addPayment(slammerId, amount, season) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/add-payment/index.php';
    return this.http.post<any>(URL, { slammerId, amount, season }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  updatePayment(payment: Payment) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/update-payment/index.php';
    return this.http.patch<any>(URL, { payment }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Delete a payment for a coordinator owed kids money from event
   */
  deletePayment(id: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/kids-money/delete-payment/index.php';
    return this.http.delete<any>(URL, { params, headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
