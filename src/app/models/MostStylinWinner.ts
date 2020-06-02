
/**
 * Represent a winner for the most stylin award in an event
 * @author Malcolm Roy
 */
export class MostStylinWinner {

  constructor(
      public id: number,
      public eventId: number,
      public memberId: number,
      public pic: string, // URL link to pic
      public fullName: string,
      public nickname: string
  ) {}

}
