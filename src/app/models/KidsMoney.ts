
/**
 * Kids money collected/owed by a coordinator
 * @author Malcolm Roy
 */
export class KidsMoney {

  constructor(
      public coordinator: string,
      public slammerId: number,
      public events: Event[],
      public payments: Payment[]
  ) {}

}

export interface Event {
  moneyRaised: number;
  eventName: string;
  eventId: number;
  eventDate: any;

}

export interface Payment {
  id: number,
  amount: number,
  date: any
}
