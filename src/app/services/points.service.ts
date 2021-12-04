import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Check if the the points for an event have been commited to the db
   * Payload should return boolean or result
   */
  checkPointsCommited(eventId: number) {
    const params = new HttpParams().set('eventId', eventId.toString());
    const URL = environment.API_URL + 'slammer-tour/points/check-commit/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }


}
