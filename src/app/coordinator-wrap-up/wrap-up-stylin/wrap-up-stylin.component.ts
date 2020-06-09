import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MostStylinService } from '../../services/most-stylin.service';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { MostStylinWinner } from '../../models/MostStylinWinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Cropper from 'cropperjs';
import { BasicReg } from '../../models/BasicReg';

@Component({
  selector: 'app-wrap-up-stylin',
  templateUrl: './wrap-up-stylin.component.html',
  styleUrls: ['./wrap-up-stylin.component.scss']
})
export class WrapUpStylinComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  @Input() allRegistered: BasicReg[];

  private MAXFILESIZE = 5000000; // 5MB limit
  private suportedFiles = ['jpeg', 'jpg', 'gif', 'png', 'webp'];
  previewImg: any;
  fileToUpload: any;
  imageSource: any;
  imageDestination: string;
  cropper: Cropper;
  uploading: boolean;
  subscriptions: Subscription[] = [];
  mostStylin: MostStylinWinner;
  dialogRef: MatDialogRef<any>;
  loading: boolean;

  constructor(
    private stylinService: MostStylinService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading = true;
    this.uploading = false;
    this.imageDestination = '';
    this.getMostStylin();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getMostStylin() {
    this.subscriptions.push(this.stylinService.get(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        this.mostStylin = response.payload;
      } else if (response.status === 404) {
        // success but no record found
      } else {
        // fail
        alert('Sorry there was an error getting the most stylin winner from the database');
        console.error(response);
      }
      this.loading = false;
    }));
  }

  /**
   * Open a Dialog to update or Add a stylin winner.
   * Pass in current winner data if avail
   * @param styleDialog Template Ref holding dialog
   */
  showStyleDialog(styleDialog: TemplateRef<any>) {
    this.dialogRef = this.matDialog.open(styleDialog, { data: this.mostStylin });
  }

  previewImgError(image) {
    image.src = 'https://clubeg.golf/common/Events/most-stylin.jpg';
  }

  /**
   * User chose to save a winner. From here we determine whether we need to add a new winner or update existing
   * @param playerId Member ID to add as winner
   */
  save(playerId) {
    if (!playerId || playerId === 'none') {
      alert('Please select a player first.');
    } else {
      if (!this.mostStylin) {
        this.add(playerId);
      } else {
        this.update(playerId);
      }

    }
  }

  /**
   * Insert New Winner
   * @param playerId Member ID to add as winner
   */
  add(playerId) {
    this.uploading = true;
    this.subscriptions.push(this.stylinService.add(
      playerId,
      this.imageDestination,
      this.fileToUpload.fileExtenstion,
      this.fileToUpload.fileName,
      this.eventSelected.id).subscribe(response => {
        if (response.status === 201) {
          this.getMostStylin();
        } else {
          alert('Sorry there was an error adding the winner.');
          console.error(response);
        }
        this.uploading = false;
        this.close();
    }));
  }

  /**
   * Update this events winner, update by record PK
   * @param playerId Member ID to add as winner
   */
  update(playerId) {
    this.uploading = true;
    this.subscriptions.push(this.stylinService.update(
      playerId,
      this.imageDestination,
      this.fileToUpload.fileExtenstion,
      this.mostStylin.id,
      this.mostStylin.pic,
      this.eventSelected.id).subscribe(response => {
        if (response.status === 200) {
          this.mostStylin = null;
          this.getMostStylin();
        } else {
          alert('Sorry there was an error adding the winner.');
          console.error(response);
        }
        this.uploading = false;
        this.close();
    }));
  }

  delete(winner: MostStylinWinner) {
    if (winner) {
      this.subscriptions.push(this.stylinService.delete(winner.id, winner.pic, this.eventSelected.id).subscribe(response => {
        if (response.status === 200) {
          this.mostStylin = null;
        } else {
          alert('Sorry there was an error deleting the winner');
          console.error(response);
        }
        this.close();
      }));
    }
  }

  /**
   * Close the dialog. If the cropper was initialize we want to destroy it to clear image/canvas
   */
  close() {
    this.dialogRef.close();
    this.previewImg = null;
    if (this.cropper) {
      this.cropper.destroy();
    }
  }

  /**
   * Fired on input change for choose image file to upload. Sets the preview image src var.
   * Browser side validation of image type and size done here as well.
   * @param event The file upload event
   */
  readImage(event, image, w): void {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];
      const extension = imageFile.name.split('.').pop();
      const reader = new FileReader();
      reader.onload = e => {
        this.fileToUpload = {
          fileName: imageFile.name,
          fileType: imageFile.type,
          fileExtension: extension,
          value: reader.result
        };
        if (this.cropper) {
          this.cropper.destroy();
        }
        const resizeImg = new Image();
        resizeImg.onload = () => {
          // Now we resize the image to ensure we don't have super big images that slow down performance of the cropper
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const width = w;
          // let multiplier = image.height image.height
          const height = w * (resizeImg.height / resizeImg.width);
          canvas.width = width;
          canvas.height = height;
          // draw new image to canavs, then make a new image element and sent that to the cropper
          ctx.drawImage( resizeImg, 0, 0, width, height );
          // NOTE: Image ONLOAD function MUST be declared BEFORE setting source or it might not be define is image is loaded rigth away
          const newImage = new Image();
          newImage.onload = () => {
            image.onload = () => {
              this.initCropper(image);
            };
            image.src = newImage.src;
          };
          newImage.src = canvas.toDataURL('image/' + this.fileToUpload.fileType);
        };
        resizeImg.src = reader.result.toString();
      };
      if (imageFile.size <= this.MAXFILESIZE) {
        if (this.suportedFiles.includes(extension.toLowerCase())) {
          reader.readAsDataURL(imageFile);
        } else {
          alert('Sorry this is not a valid file type: ' + extension);
        }
      } else {
        alert('Sorry this file exceeds the maximum size of 5MB.');
      }
    }
  }

  rotate(amount) {
    if (this.cropper) {
      this.cropper.rotate(amount);
    }
  }

  initCropper(image: HTMLImageElement) {
    this.cropper = new Cropper(image, {
      aspectRatio: 4 / 5,
      checkOrientation: true,
      rotatable: true,
      scalable: true,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas(
          {
            imageSmoothingEnabled: true,
            imageSmoothingQuality : 'low',
        });
        this.imageDestination = canvas.toDataURL('image/' + this.fileToUpload.fileType);
      }
    });
  }


}
