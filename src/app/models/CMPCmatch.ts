
/**
 * Represent a City Match Play Championship tournament match
 * @author Malcolm Roy
 */
export class CMPCmatch {

  constructor(
    public id: number,
    public division: string,
    public round: string,
    public eventId: number,
    public type: string,
    public player1id: number,
    public player1partnerId: number,
    public player2id: number,
    public player2partnerId: number,
    public result: string,
    public updatedAt: any,
    public playoffWinner: string
  ) {}

}
