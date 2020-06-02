import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

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

}
