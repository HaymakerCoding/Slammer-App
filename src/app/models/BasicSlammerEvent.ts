
/**
 * Represent a Slammer Tour event, just basic details for lists.
 * @author Malcolm Roy
 */
export class BasicSlammerEvent {

  constructor(
      public id: number,
      public eventNum: number,
      public date: any,
      public time: any,
      public displayDate: any,
      public published: any,
      public courseName: string,
      public winner: string,
      public attendance: number,
      public coordinatorName: string,
      public courseId: number,
      public doggieMaster: string,
      public skinMaster: string,
      public photoMaster: string,
      public doggieMasterVideo: string,
      public skinMasterVideo: string,
      public winnerVideo: string,
      public OCvideo: string,
      public kidsBones: number

  ) {}

}
