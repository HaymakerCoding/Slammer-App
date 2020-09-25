import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../services/event.service';
import { BasicSlammerEvent } from '../models/BasicSlammerEvent';
import { SlammerEvent } from '../models/SlammerEvent';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/**
 * Show a table of events for the Slammer Tour.
 * User can click on events to go to the full results page for that event.
 *
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-event-results-table',
  templateUrl: './event-results-table.component.html',
  styleUrls: ['./event-results-table.component.scss']
})
export class EventResultsTableComponent implements OnInit, OnDestroy {

  loading: boolean;
  subscriptions: Subscription[] = [];
  years: number[];
  yearSelected: number;
  events: BasicSlammerEvent[];
  displayedMonths: DisplayedMonths[] = [];
  months: string[] = [];
  monthEvents: MonthEvents[] = [];
  liveEvents: BasicSlammerEvent[];
  onPhone: boolean;

  constructor(
    private eventService: EventService,
    private router: Router,
    private breakpointOberver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.initBreakObserver();
    this.getAllYears();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Listen to screen size changes, for setting phone specific settings like nav background image
   */
  initBreakObserver() {
    this.breakpointOberver.observe(
      ['(max-width: 800px)']).subscribe(result => {
        if (result.matches) {
          this.onPhone = true;
        } else {
          this.onPhone = false;
        }
      });
  }

  /**
   * Get all years of event existence. Set selected to most recent
   */
  getAllYears() {
    this.subscriptions.push(this.eventService.getAllSeasons().subscribe(response => {
      if (response.status === 200) {
        this.years = response.payload;
        this.yearSelected = this.years[0];
        this.getEvents();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get events for a specific year
   */
  getEvents() {
    this.loading = true;
    this.subscriptions.push(this.eventService.getResultsList(this.yearSelected).subscribe(response => {
      if (response.status === 200) {
        this.events = response.payload;
        this.getLiveEvents();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get events that are 'Live'
   * These are events runnin today and NOT published
   */
  getLiveEvents() {
    this.liveEvents = [];
    this.events.forEach(x => {
      const date = x.date;
      const eventDate = new Date(Date.parse(date.replace(/[-]/g, '/')));
      const today = new Date();
      if (eventDate.getMonth() === today.getMonth()
        && eventDate.getDay() === today.getDay()
        && eventDate.getFullYear() === today.getFullYear()
        && x.published === '0') {
        this.liveEvents.push(x);
        this.events = this.events.filter(event => +event.id !== +x.id);
      }
    });
    this.organizeEvents();
  }

  /**
   * Setup the events into groups by month
   */
  organizeEvents() {
    this.events.forEach(x => {
      const month = x.displayDate.split(' ')[1];
      if (this.months.includes(month) === false) {
        this.months.push(month);
        const newEvents: BasicSlammerEvent[] = [];
        newEvents.push(x);
        const newMonthEvent: MonthEvents = { month, events: newEvents };
        this.monthEvents.push(newMonthEvent);
      } else {
        this.monthEvents.find(y => y.month === month).events.push(x);
      }
    });
    this.loading = false;
  }

  /**
   * Go to the results page for this event
   * @param eventId Event ID
   */
  goToEvent(eventId) {
    window.location.href = 'https://new.slammertour.com/Results/event_results_page.php?event_id=' +
    eventId.toString() + '&season=' + this.yearSelected.toString();
  }

  /**
   * Go to the 'LIVE' event page for this event
   * @param id Event ID
   */
  goToLiveEvent(id) {
    this.router.navigate(['/st-live/' + id]);
  }

  /**
   * Translate some 3 char shortened months to full month names
   * @param shortMonth 3 letter month abreviation
   */
  getFullMonth(shortMonth: string) {
    switch (shortMonth) {
      case 'Sep': return 'September';
      case 'Aug': return 'August';
      case 'Jul': return 'July';
      case 'Jun': return 'June';
      case 'May': return 'May';
      case 'Apr': return 'April';
      case 'Mar': return 'March';
      case 'Feb': return 'February';
      case 'Jan': return 'January';
      case 'Dec': return 'December';
      case 'Nov': return 'November';
      case 'Oct': return 'October';

      default: return shortMonth;

    }
  }

}

interface DisplayedMonths {
  index: number;
  month: string;
}

interface MonthEvents {
  month: string;
  events: BasicSlammerEvent[];
}
