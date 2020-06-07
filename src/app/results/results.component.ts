import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../services/event.service';
import { SlammerEvent } from '../models/SlammerEvent';

/**
 * Display results for a slammer tour event.
 * Different sections for results of matches/points/groups etc.
 * 
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  loadingPercentage: number;
  eventId: number;
  event: SlammerEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.loadingPercentage = 0;
    this.getId();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercentage(percentage: number) {
    this.loadingPercentage = percentage;
  }

  /**
   * Get eventId from router param
   */
  getId() {
    this.subscriptions.push(this.activatedRoute.params.subscribe((params: Params ) => {
      this.eventId = +params.id;
      this.getEvent();
    }));
  }

  /**
   * Get the event info
   */
  getEvent() {
    this.subscriptions.push(this.eventService.get(this.eventId.toString()).subscribe(response => {
      if (response.status === 200) {
        this.event = response.payload;
        console.log(this.event);
        this.setLoadingPercentage(100);
      } else {
        console.error(response);
      }
    }));
  }

}
