import { Component, OnInit, Input, TemplateRef, OnDestroy } from '@angular/core';
import { AllQuotes } from '../../models/AllQuotes';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuoteService } from '../../services/quote.service';
import { Subscription } from 'rxjs';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { BasicReg } from '../../models/BasicReg';

@Component({
  selector: 'app-wrap-quotables',
  templateUrl: './wrap-quotables.component.html',
  styleUrls: ['./wrap-quotables.component.scss']
})
export class WrapQuotablesComponent implements OnInit, OnDestroy {

  @Input() allQuotes: AllQuotes;
  @Input() allRegistered: BasicReg[];
  @Input() eventSelected: BasicSlammerEvent;

  dialogRef: MatDialogRef<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private quoteService: QuoteService
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Open a dialog to edit or add a new notable. If the notable is null then we are adding a new one.
   * @param notablesDialog Template Ref holding material dialog
   * @param quote Quote data possibly null
   */
  editOrAddQuote(notablesDialog: TemplateRef<any>, quote, type) {
    this.dialogRef = this.matDialog.open(notablesDialog,
      { data: { quote, type }, autoFocus: false });
  }

  /**
   * Return the number corresponding to a quote type text
   * @param typeName display name for quote type
   */
  getTypeNumber(typeName): number {
    switch (typeName) {
      case 'Quotable' : return 1;
      case 'Notable' : return 2;
      case 'Feedback' : return 3;
      default: return null;
    }
  }

  /**
   * Find a PlayerScores obj by matching nicknames
   * @param player Player nickname
   */
  getPlayer(player) {
    return this.allRegistered.find(x => x.nickname === player);

  }

  /**
   * Add a new quotable/notable/feedback to the database for a player in this event
   * @param text Text for new quote
   * @param player Player Scores obj for who submitted quote, containing basic player data
   * @param typeName Display version of quote type
   */
  add(text: string, player: BasicReg, typeName) {
    if (!text || text === null || text === ' ' || text === '') {
      alert('Please supply text');
    } else if (!player) {
      alert('Please choose a player');
    } else  {
      const type = this.getTypeNumber(typeName);
      if (type) {
        this.subscriptions.push(this.quoteService.add(
          this.eventSelected.id, player.slammerId, type, text, player.nickname).subscribe(response => {
          if (response.status === 201) {
            let quotes = [];
            if (type === 1) {
              quotes = this.allQuotes.quotables;
            } else if (type === 2) {
              quotes = this.allQuotes.notables;
            } else {
              quotes = this.allQuotes.feedbacks;
            }
            const newId = response.payload; // new inserted record id in payload
            quotes.push({
              id: newId,
              eventId: this.eventSelected.id,
              playerId: player.slammerId,
              Slammer: player.nickname,
              Quote: text,
              typeOfQuote: type
            });
            this.close();
          } else {
            alert('Sorry there was a problem saving the quote');
            console.error(response);
          }
        }));
      } else {
        alert('Error, missing type of quote');
      }
    }
  }

  /**
   * Update a quotable/notable/feedback
   * Can change player or text
   */
  update(id, text: string, player: BasicReg, typeName) {
    const type = this.getTypeNumber(typeName);
    if (type) {
      this.subscriptions.push(this.quoteService.update(id, player.slammerId, type, text, player.nickname,
        this.eventSelected.id.toString()).subscribe(response => {
        if (response.status === 200) {
          // update view
          if (type === 1) {
            this.allQuotes.quotables.find(x => x.id === id).Quote = text;
            this.allQuotes.quotables.find(x => x.id === id).playerId = player.slammerId;
            this.allQuotes.quotables.find(x => x.id === id).Slammer = player.nickname;
          } else if (type === 2) {
            this.allQuotes.notables.find(x => x.id === id).Quote = text;
            this.allQuotes.notables.find(x => x.id === id).playerId = player.slammerId;
            this.allQuotes.notables.find(x => x.id === id).Slammer = player.nickname;
          } else {
            this.allQuotes.feedbacks.find(x => x.id === id).Quote = text;
            this.allQuotes.feedbacks.find(x => x.id === id).playerId = player.slammerId;
            this.allQuotes.feedbacks.find(x => x.id === id).Slammer = player.nickname;
          }
        } else {
          alert('Sorry there was a problem updating the quote');
          console.error(response);
        }
        this.close();
      }));
    } else {
      alert('Error, missing type of quote');
    }
  }

  /**
   * Delete a quotable/notable/feedback using its record ID
   * @param id ID of quote
   * @param typeName Display text for quote type
   */
  delete(id, typeName) {
    const type = this.getTypeNumber(typeName);
    this.subscriptions.push(this.quoteService.delete(id, this.eventSelected.id.toString()).subscribe(response => {
      if (response.status === 200) {
        // all good so filter out from view
        if (type) {
          if (type === 1) {
            this.allQuotes.quotables = this.allQuotes.quotables.filter(x => x.id !== id);
          } else if (type === 2) {
            this.allQuotes.notables = this.allQuotes.notables.filter(x => x.id !== id);
          } else {
            this.allQuotes.feedbacks = this.allQuotes.feedbacks.filter(x => x.id !== id);
          }
        }
        this.close();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Close the currently open dialog
   */
  close(): void {
    this.dialogRef.close();
  }

}
