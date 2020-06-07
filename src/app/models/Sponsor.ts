
/**
 * Represent a Sponsor/Friend of ClubEG
 * @author Malcolm Roy
 */
export class Sponsor {

  constructor(
    public id: number,
    public name: string,
    public logo: string,
    public website: string,
    public defaultAd: string,
    public currentAd: string,
    public currentAdWebsite: string
  ) { }

}
