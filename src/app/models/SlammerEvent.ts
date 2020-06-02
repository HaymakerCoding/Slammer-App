import { BasicSlammerEvent } from './BasicSlammerEvent';

/**
 * Represent a Slammer Tour event
 * @author Malcolm Roy
 */
export class SlammerEvent {

  constructor(
    public id: number,
    public eventNum: number,
    public date: any,
    public time: any,
    public fullName: string,
    public name: string,
    public leagueId: number,
    public dateTime: any,
    public coordinatorName: string,
    public courseId: number,
    public doggieMaster: string,
    public skinMaster: string,
    public photoMaster: string

  ) { }

}
