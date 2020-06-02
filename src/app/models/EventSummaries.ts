
/**
 * Represent summaries from an event. Course report, event summary, winner summary.
 * @author Malcolm Roy
 */
export class EventSummaries {

  constructor(
      public eventId: number,
      public courseReport: CourseReport,
      public summary: Summary,
      public winnerSummary: WinnerSummary
  ) {}

}

interface CourseReport {
  id: number;
  text: string;
}

interface Summary {
  id: number;
  text: string;
}

interface WinnerSummary {
  id: number;
  text: string;
}
