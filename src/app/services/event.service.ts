import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BasicSlammerEvent } from '../models/BasicSlammerEvent';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all event Info
   * @param id Event PK
   */
  get(id: string) {
    const params = new HttpParams().set('id', id);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Get all player ranks
   * Based on the last event played before this event so we need the date and time of this event
   * @param dateTime Current event date and time
   * @param league League id
   */
  getRanks(dateTime, leagueId, eventId: string) {
    const params = new HttpParams().set('dateTime', dateTime).set('leagueId', leagueId).set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-ranks/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * return all seasons in an array
   */
  getAllSeasons() {
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/seasons/get-all/index.php';
    return this.http.get<any>(URL)
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Get all matches for the City Match Play Championship that are in this event
   */
  getCMPCmatches(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/clubeg/tournaments/cmpc/get-all-by-event/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Get the pars for the course played
   */
  getPars(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/pars/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * return all events, basic data for a list only, for a season
   */
  getEventsBySeason(season: number) {
    const params = new HttpParams().set('season', season.toString());
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-list-by-season/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * return all events, basic data including winner, for events that are complete
   */
  getResultsList(season: number) {
    const params = new HttpParams().set('season', season.toString());
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-results-list/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  updateVideoLinks(event: BasicSlammerEvent) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/update-video-links/index.php';
    return this.http.patch<any>(URL, { event }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  getCourse(id) {
    const params = new HttpParams().set('id', id.toString());
    const URL = 'https://clubeg.golf/common/api_REST/v1/clubeg/courses/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }


  updateScorecard(eventId, pars) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/update-scorecard/index.php';
    return this.http.patch<any>(URL, { eventId, pars }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  updatePublished(eventId, published) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/update-published/index.php';
    return this.http.patch<any>(URL, { eventId, published }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
