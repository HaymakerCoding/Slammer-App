import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { SlammerEvent } from '../../models/SlammerEvent';
import { EventService } from '../../services/event.service';
import { GroupService } from '../../services/group.service';
import { RegistrationService } from '../../services/registration.service';
import { Group } from '../../models/Group';
import { ScoresService } from '../../services/scores.service';
import { PlayerScores } from '../../models/PlayerScores';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoggieService } from '../../services/doggie.service';
import { DoggieWinner } from '../../coordinator-wrap-up/wrap-up-doggies/wrap-up-doggies.component';
import { CMPCmatch } from 'src/app/models/CMPCmatch';
import { Sponsor } from 'src/app/models/Sponsor';

/**
 * Main start page for the 'ST Live Scoring'.
 * Allows public to view up to date states for a golf event. 
 *
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  event: SlammerEvent;
  loadingPercentage: number;
  groupNumbers: number[];
  registered: any[];
  groups: Group[];
  selectedGroup: Group;
  selectedView: ViewOption = ViewOption.BYGROUP;
  course: any;
  playerScores: PlayerScores[] = [];
  holes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  pars: HolePars[];
  doggiePars: HolePars[];
  ranks: any;
  loadingRanks: boolean;
  doggieWinners: DoggieWinner[] = [];
  CMPCsingles: CMPCmatch[];
  CMPCdoubles: CMPCmatch[];
  doggieSponsor: Sponsor;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private groupService: GroupService,
    private regService: RegistrationService,
    private scoreService: ScoresService,
    private snackbar: MatSnackBar,
    private changeDetectRef: ChangeDetectorRef,
    private doggieService: DoggieService
  ) { }

  ngOnInit() {
    this.loadingPercentage = 0;
    this.loadingRanks = true;
    this.getId();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getId() {
    this.subscriptions.push(this.activatedRoute.params.subscribe((params: Params) => {
      const eventId = params.id;
      this.getEvent(eventId);
      this.loadingPercentage = 10;
    }));
  }

  /**
   * Get all the relevant event data needed
   * @param eventId Event PK
   */
  getEvent(eventId: string) {
    this.subscriptions.push(this.eventService.get(eventId).subscribe(response => {
      if (response.status === 200) {
        this.event = response.payload;
        this.loadingPercentage = 20;
        this.getCourse();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get the course the event is hosted at
   */
  getCourse() {
    this.subscriptions.push(this.eventService.getCourse(this.event.courseId.toString()).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 30;
        this.course = response.payload[0];
        this.getGroupNumbers();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all group numbers for the event
   */
  getGroupNumbers() {
    this.subscriptions.push(this.groupService.getGroupNumbers(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.groupNumbers = response.payload;
        this.loadingPercentage = 40;
        this.getRegistered();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all registered members in the event
   */
  getRegistered() {
    this.subscriptions.push(this.regService.getAll(this.event.id).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 50;
        this.registered = response.payload;
        this.getAllGroups();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all groups set for the event.
   */
  getAllGroups() {
    this.subscriptions.push(this.groupService.getAllGroups(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 60;
        this.groups = response.payload;
        if (this.groups[0]) {
          this.selectedGroup = this.groups[0];
        }
        this.initSelectedPlayers();
      } else {
        console.error(response);
      }
    }));
  }

  initSelectedPlayers() {
    this.groups.forEach( x => {
      if (!x.playerSelectedId) {
        if (x.player1id) {
          x.playerSelectedId = x.player1id;
        } else if (x.player2id) {
          x.playerSelectedId = x.player2id;
        } else if (x.player3id) {
          x.playerSelectedId = x.player3id;
        } else if (x.player4id) {
          x.playerSelectedId = x.player4id;
        } else {
          console.error('No players in group to set as active player');
          return null;
        }
      }
    });
    this.loadingPercentage = 70;
    this.getSponsor();
  }

  /**
   * Only 1 sponsor set for doggies at a time. Retrive the set sponsor.
   * For displaying promotional name and logo with doggie results
   */
  getSponsor() {
    this.subscriptions.push(this.eventService.getDoggieSponsor().subscribe(response => {
      if (response.status === 200) {
        this.doggieSponsor = response.payload;
        console.log(this.doggieSponsor);
        this.loadingPercentage = 75;
        this.getPars();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all hole pars for the course being played
   */
  getPars() {
    this.subscriptions.push(this.eventService.getPars(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 80;
        this.pars = response.payload;
        this.doggiePars = [];
        this.pars.forEach(x => {
          if (x.par === 3) {
            this.doggiePars.push(x);
          }
        });
        this.getRanks();
        this.initDoggieWinners();
        this.getCMPCmatches();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get a list of the current slammer ranks
   */
  getRanks() {
    this.subscriptions.push(this.eventService.getRanks(this.event.dateTime, this.event.leagueId,
      this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        // payload contains a ; seperated list of rank numbers
        this.ranks = response.payload;
        this.loadingRanks = false;
        if (!this.ranks) {
          console.error('No ranks available');
        }
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Search rank lists for the players rank
   * @param playerId Player ID
   */
  getPlayerRank(playerId) {
    if (this.loadingRanks === true) {
      return '';
    }
    let rank = '';
    this.ranks.A.forEach( x => {
      if (+x.id === +playerId) {
        rank = x.div + x.rank;
      }
    });
    this.ranks.B.forEach( x => {
      if (+x.id === +playerId) {
        rank = x.div + x.rank;
      }
    });
    this.ranks.C.forEach( x => {
      if (+x.id === +playerId) {
        rank = x.div + x.rank;
      }
    });
    this.ranks.D.forEach( x => {
      if (+x.id === +playerId) {
        rank = x.div + x.rank;
      }
    });
    this.ranks.O.forEach( x => {
      if (+x.id === +playerId) {
        rank = x.div + x.rank;
      }
    });
    return rank;
  }

  /**
   * CMPC matches are special tournament matches.
   * Fetch all matches that are flagged as CMPC. These can be single or doubles format, organize as such.
   */
  getCMPCmatches() {
    this.subscriptions.push(this.eventService.getCMPCmatches(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.CMPCsingles = [];
        this.CMPCdoubles = [];
        const cmpcMatches: any[] = response.payload;
        cmpcMatches.forEach(match => {
          if (match.type === 'Singles') {
            this.CMPCsingles.push(match);
          } else {
            this.CMPCdoubles.push(match);
          }
        });
        console.log(this.CMPCdoubles);
        this.loadingPercentage = 90;
        this.getAllScores(false);
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all scores entered
   */
  getAllScores(refreshed: boolean) {
    this.subscriptions.push(this.scoreService.getAllScores(this.event.id).subscribe(response => {
      if (response.status === 200) {
        this.playerScores = response.payload;
        this.loadingPercentage = 100;
        if (refreshed === true) {
          this.changeDetectRef.markForCheck();
          this.snackbar.open('Newest scores loaded!', '', { duration: 1000});
        }
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Initialize all the POSSIBLE Doggie winners. determined by holes where par is 3.
   */
  initDoggieWinners() {
    this.pars.forEach(x => {
      if (x.par === 3) {
        this.doggieWinners.push(new DoggieWinner(null, x.hole, null, null, null));
      }
    });
    this.getAllDoggieWinners();
  }

  getAllDoggieWinners() {
    this.subscriptions.push(this.doggieService.getDoggieWinners(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        const winnerRecords: any[] = response.payload;
        winnerRecords.forEach(x => {
          const winner = this.doggieWinners.find(y => +y.hole === +x.hole);
          if (winner) {
            winner.name = x.nickname;
            winner.distance = x.distance;
            winner.slammerId = +x.player;
            winner.id = +x.id;
          }
        });
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get a players score for a hole
   * @param playerId Player Slammer ID
   * @param hole hole number
   */
  getHoleScore(playerId, hole): number  {
    const playerScores = this.playerScores.find(x => +x.slammerId === +playerId);
    if (playerScores && playerScores.scores) {
      const score = playerScores.scores.find( x => x.hole === hole).score;
      return score > 0 ? score : null;
    } else {
      return null;
    }
  }

  /**
   * Change the selected player in a group
   * This sets the active class CSS and sets up match results view vs this player
   * @param groupNum Group Number
   * @param playerId Player ID
   */
  changeSelected(groupNum, playerId) {
    this.groups.find(x => x.groupNum === groupNum).playerSelectedId = playerId;
  }

  /**
   * Get results between selected player and other players in group
   * @param playerId Player ID
   * @param groupNum Group number
   */
  getMatchResult(playerId, groupNum) {
    return this.calcuteResult(this.groups.find(x => x.groupNum === groupNum).playerSelectedId, playerId);
  }

  /**
   * Get results between 2 players, not involving a group in this scenario.
   * @param player1id Any player
   * @param player2id Any other player
   */
  getMatchResultCMPC(player1id: number, player2id: number) {
    return this.calcuteResult(player1id, player2id);
  }

  /**
   * Get status of holes complete between 2 players
   * @param player1id player 1 slammer id
   * @param player2id player 2 slammer id
   */
  getHolesComplete2players(player1id:number, player2id: number): number {
    let holesComplete = 0;
    let p1score: number;
    let p2score: number;
    for (const hole of this.holes) {
      p1score = this.getHoleScore(player1id, hole);
      p2score = this.getHoleScore(player2id, hole);
      if (!p1score && !p2score ) {
        return holesComplete;
      } else {
        holesComplete++;
      }
    }
    return holesComplete;
  }

  /**
   * Get status of holes complete in a DOUBLES CMPC specific match
   * @param match CMPC match obj containing all players, 4 for doubles
   */
  getHolesCompleteCMPCdoubles(match: CMPCmatch) {
    let holesComplete = 0;
    let p1score: number;
    let p2score: number;
    let p3score: number;
    let p4score: number;
    for (const hole of this.holes) {
      p1score = this.getHoleScore(match.player1id, hole);
      p2score = this.getHoleScore(match.player2id, hole);
      p3score = this.getHoleScore(match.player1partnerId, hole);
      p4score = this.getHoleScore(match.player2partnerId, hole);
      if (!p1score && !p2score && !p3score && !p4score ) {
        return holesComplete;
      } else {
        holesComplete++;
      }
    }
    return holesComplete;
  }

  /**
   * Find out home many holes are done and scored for a group
   * @param group Group obj containing up to 4 players
   */
  getHolesComplete(group: Group) {
    let holesComplete = 0;
    let p1score;
    let p2score;
    let p3score;
    let p4score;
    for (const hole of this.holes) {
      if (group.player1id) {
        p1score = this.getHoleScore(group.player1id, hole);
      }
      if (group.player2id) {
        p2score = this.getHoleScore(group.player2id, hole);
      }
      if (group.player3id) {
        p3score = this.getHoleScore(group.player3id, hole);
      }
      if (group.player4id) {
        p4score = this.getHoleScore(group.player4id, hole);
      }
      if ((!p1score && group.player1id) && (!p2score && group.player2id) && (!p3score && group.player3id)
        && (!p4score && group.player4id)) {
        return holesComplete;
      } else {
        holesComplete++;
      }
    }
    return holesComplete;
  }

  getHolesCompleteByPlayer(playerId: number) {
    let holesComplete = 0;
    let pscore;
    for (const hole of this.holes) {
      if (playerId) {
        pscore = this.getHoleScore(playerId, hole);
      }
      if (!pscore) {
        return holesComplete;
      } else {
        holesComplete++;
      }
    }
    return holesComplete;
  }

  /**
   * Get par for a hole
   * @param hole Hole number
   */
  getPar(hole) {
    return this.pars.find(x => +x.hole === +hole).par;
  }

  /**
   * Get a result between 2 players up to a certain point.
   * The lower score on the hole wins 1 point for that hole.
   * If a player is up by more points than holes left than match is over result wise
   * @param holes An array of hole numbers for all holes up to the one currently selected
   * @param activePlayerNumber The group number for the selected player
   * @param opponentNumber The group number for the opponent comparing with
   */
  calcuteResult(activePlayerNumber: number, opponentNumber: number): string {
    let p1Total = 0;
    let p2Total = 0;
    let holesLeftToPlay = 18;
    let msg: string;
    for (const hole of this.holes) {
      if (hole <= this.getHolesCompleteByPlayer(activePlayerNumber)) {
        holesLeftToPlay = 18 - hole;
        const p1score: number = +this.getHoleScore(activePlayerNumber, hole);
        const p2score: number = +this.getHoleScore(opponentNumber, hole);
        if (p1score < p2score) {
          p1Total++;
        } else if (p2score < p1score) {
          p2Total++;
        }
        if (holesLeftToPlay === 0 && p1Total === p2Total && activePlayerNumber !== opponentNumber) {
          return 'Draw';
        } else if (holesLeftToPlay === 0 && p1Total > p2Total && (p1Total - p2Total === 2)) {
          return 'Won 2 up';
        } else if (p1Total > (p2Total + holesLeftToPlay)) {
          return 'Won ' + (p1Total - p2Total) + ' and ' + holesLeftToPlay;
        } else if(p2Total > (p1Total + holesLeftToPlay)) {
          return'Lost ' + (p2Total - p1Total) + ' and ' + holesLeftToPlay;
        } 
      }
    }
    const difference = p1Total > p2Total ? (p1Total - p2Total) : p2Total > p1Total ? (p2Total - p1Total) : 0;
    if (activePlayerNumber === opponentNumber) {
      return null;
    }
    return p1Total > p2Total ? difference + ' Up' : p2Total > p1Total ? difference + ' Down' : 'All Square';
  }

  refreshScores() {
    this.getAllScores(true);
  }

  /**
   * If set, return name of a doggie winner on a specific hole
   * @param hole Hole number
   */
  getDoggieWinner(hole: number) {
    const winner: DoggieWinner = this.doggieWinners.find(x => +x.hole === +hole);
    if (winner && winner.name) {
      return winner.name;
    } else {
      return 'practice up!';
    }
  }

  getDoggieWinnerDistance(hole: number) {
    const winner: DoggieWinner = this.doggieWinners.find(x => +x.hole === +hole);
    if (winner && winner.distance) {
      return winner.distance + ' feet';
    } else {
      return null;
    }
  }

  /**
   * Use the CMPC match central ID to find the grouped member and return their nickname
   * @param centralId Member ID in central member table
   */
  getCMPCplayerName(centralId: number): string {
    let fullName: string = null;
    this.groups.forEach(group => {
      if (+group.player1id === +centralId) {
        fullName = group.player1name;
        return;
      } else if (+group.player2id === +centralId) {
        fullName = group.player2name;
        return;
      } else if (+group.player3id === +centralId) {
        fullName = group.player3name;
        return;
      } else if (+group.player4id === +centralId) {
        fullName = group.player4name;
        return;
      }
    });
    return fullName;
  }

  /**
   * Find the slammer ID for a player in a group by their Central Member ID
   */
  getSlammerId(centralId) {
    let slammerId = null;
    this.groups.forEach(group => {
      if (group.player1centralId === centralId) {
        slammerId = group.player1id;
        return;
      } else if (group.player2centralId === centralId) {
        slammerId = group.player2id;
        return;
      } else if (group.player3centralId === centralId) {
        slammerId = group.player3id;
        return;
      } else if (group.player4centralId === centralId) {
        slammerId = group.player4id;
        return;
      }
    });
    return centralId;
  }

  /**
   * Get results of a match between doubles.
   * player 1 and player2(parnters) scores are added together for each hole and compared against player 3 and 4(partners).
   * The team with lower score for the hole gets the point for that hole
   * @param match CMPM match obj containing all 4 doubles players
   */
  getMatchResultCMPCdoubles(match: CMPCmatch, pair: number) {
    let pair1Total = 0;
    let pair2Total = 0;
    let holesLeftToPlay = 18;
    for (const hole of this.holes) {
      holesLeftToPlay = 18 - +hole;
      if (hole <= this.getHolesCompleteByPlayer(match.player1id)) {
        const pair1score = +this.getHoleScore(match.player1id, hole) + +this.getHoleScore(match.player1partnerId, hole);
        const pair2score = +this.getHoleScore(match.player2id, hole) + +this.getHoleScore(match.player2partnerId, hole);
        if (pair1score < pair2score) {
          pair1Total++;
        } else if (pair2score < pair1score) {
          pair2Total++;
        }
        if (holesLeftToPlay === 0 && pair1Total === pair2Total) {
          return 'Draw';
        } else if (holesLeftToPlay === 0 && pair1Total > pair2Total && (pair1Total - pair2Total === 2)) {
          return 'Won 2 up';
        } else if (pair1Total > (+pair2Total + +holesLeftToPlay)) {
          if (pair === 1) {
            return 'Won ' + (pair1Total - pair2Total) + ' and ' + holesLeftToPlay;
          } else {
            return'Lost ' + (pair1Total - pair2Total) + ' and ' + holesLeftToPlay;
          }
        } else if(pair2Total > (+pair1Total + +holesLeftToPlay)) {
          if (pair === 1) {
            return'Lost ' + (pair2Total - pair1Total) + ' and ' + holesLeftToPlay;
          } else {
            return 'Won ' + (pair2Total - pair1Total) + ' and ' + holesLeftToPlay;
          }
        }
      }
    }
    const difference = pair1Total > pair2Total ? (pair1Total - pair2Total) : pair2Total > pair1Total ? (pair2Total - pair1Total) : 0;
    if (pair1Total === pair2Total) {
      return 'All Square';
    } else {
      if (pair === 1) {
        return pair1Total > pair2Total ? difference + ' Up' : difference + ' Down';
      } else {
        return pair2Total > pair1Total ? difference + ' Up' : difference + ' Down';
      }
    }
  }


}

enum ViewOption {
  BYGROUP = 'byGroup',
  ALL = 'all'
}

interface HolePars {
  hole: number;
  par: number;
}

