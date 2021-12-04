import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  /**
   * Get all registrations for an event
   * Return just basic info for listing
   */
  getAll(eventId: number) {
    const params = new HttpParams().set('eventId', eventId.toString());
    const URL = environment.API_URL + 'slammer-tour/events/registrations/get-all/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
