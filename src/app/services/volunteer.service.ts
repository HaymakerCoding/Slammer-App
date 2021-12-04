import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * return all events, basic data for a list only, for a season
   */
  update(type, eventId: number, nickname) {
    const headers = this.authService.getAuthHeader();
    const URL = environment.API_URL + 'slammer-tour/events/volunteers/update/index.php';
    return this.http.patch<any>(URL, { type, eventId, nickname }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }
}
