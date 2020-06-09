import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { SummaryService } from '../../services/summary.service';
import { Subscription } from 'rxjs';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { EventSummaries } from '../../models/EventSummaries';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-wrap-up-summaries',
  templateUrl: './wrap-up-summaries.component.html',
  styleUrls: ['./wrap-up-summaries.component.scss']
})
export class WrapUpSummariesComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  subscriptions: Subscription[] = [];
  eventSummaries: EventSummaries;
  dialogRef: MatDialogRef<any>;
  summaryTypes: SummaryType[] = [ SummaryType.COURSE, SummaryType.SUMMARY, SummaryType.WINNER ];

  constructor(
    private summaryService: SummaryService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getSummaries();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getSummaries() {
    this.subscriptions.push(this.summaryService.getAll(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.eventSummaries = response.payload;
      } else {
        alert('Sorry there was a problem getting the event Summaries');
        console.error(response);
      }
    }));
  }

  addSummary(type: SummaryType, text) {
    this.subscriptions.push(this.summaryService.add(this.eventSelected.id, text.trim(), type).subscribe(response => {
      if (response.status === 201) {
        // all good, update view, payload contains ID for new record
        switch (type) {
          case SummaryType.COURSE : this.eventSummaries.courseReport = { id: response.payload, text: text.trim() };
                                    break;
          case SummaryType.SUMMARY : this.eventSummaries.summary = { id: response.payload, text: text.trim() };
                                     break;
          case SummaryType.WINNER : this.eventSummaries.winnerSummary = { id: response.payload, text: text.trim() };
                                    break;
        }
      } else {
        alert('Sorry there was an error adding the summary');
        console.error(response);
      }
      this.close();
    }));
  }

  updateSummary(type: SummaryType, text) {
    let id;
    let summary;
    switch (type) {
      case SummaryType.COURSE : id = this.eventSummaries.courseReport.id;
                                summary = this.eventSummaries.courseReport;
                                break;
      case SummaryType.SUMMARY : id = this.eventSummaries.summary.id;
                                 summary = this.eventSummaries.summary;
                                 break;
      case SummaryType.WINNER : id = this.eventSummaries.winnerSummary.id;
                                summary = this.eventSummaries.winnerSummary;
                                break;
    }
    this.subscriptions.push(this.summaryService.update(id, text.trim(), type, this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        summary.text = text.trim();
      } else {
        alert('Sorry there was an error updating the summary');
        console.error(response);
      }
      this.close();
    }));
  }

  deleteSummary(type: SummaryType) {
    const confirmed = confirm('Are you sure you want to delete this summary text?');
    if (confirmed === true) {
      let id;
      switch (type) {
        case SummaryType.COURSE : id = this.eventSummaries.courseReport.id;
                                  break;
        case SummaryType.SUMMARY : id = this.eventSummaries.summary.id;
                                   break;
        case SummaryType.WINNER : id = this.eventSummaries.winnerSummary.id;
                                  break;
      }
      this.subscriptions.push(this.summaryService.delete(id, type, this.eventSelected.id).subscribe(response => {
        if (response.status === 200) {
          switch (type) {
            case SummaryType.COURSE : this.eventSummaries.courseReport = null;
                                      break;
            case SummaryType.SUMMARY : this.eventSummaries.summary = null;
                                       break;
            case SummaryType.WINNER : this.eventSummaries.winnerSummary = null;
                                      break;
          }
        } else {
          alert('Sorry there was an error deleting the summary');
          console.error(response);
        }
        this.close();
      }));
    }
  }

  openSummaryDialog(dialog: TemplateRef<any>, type: SummaryType) {
    let text;
    switch (type) {
      case SummaryType.COURSE : text = this.eventSummaries.courseReport.text;
                                break;
      case SummaryType.SUMMARY : text = this.eventSummaries.summary.text;
                                 break;
      case SummaryType.WINNER : text = this.eventSummaries.winnerSummary.text;
                                break;
    }
    this.dialogRef = this.dialog.open(dialog, { data: {
      type,
      text
    }, autoFocus: false, minWidth: 300 });
  }

  close() {
    this.dialogRef.close();
  }

}

export enum SummaryType {
  COURSE = 'Course Report',
  SUMMARY = 'Event Summary',
  WINNER = 'Winner Summary'
}
