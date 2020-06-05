import { Component, OnInit, Input, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BasicSlammerEvent } from '../../models/BasicSlammerEvent';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { WinnerPhotoService } from '../../services/winner-photo.service';
import { BasicReg } from '../../models/BasicReg';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-wrap-up-winner-photo',
  templateUrl: './wrap-up-winner-photo.component.html',
  styleUrls: ['./wrap-up-winner-photo.component.scss']
})
export class WrapUpWinnerPhotoComponent implements OnInit, OnDestroy {

  @Input() eventSelected: BasicSlammerEvent;
  @Input() allRegistered: BasicReg[];
  @ViewChild('imageElement') imageElement: ElementRef;

  winnerPhoto;
  private MAXFILESIZE = 5000000; // 5MB limit
  private suportedFiles = ['jpeg', 'jpg', 'gif', 'png', 'webp'];
  previewImg: any;
  imageReady: boolean;
  fileToUpload: any;
  imageSource: any;
  imageDestination: string;
  cropper: Cropper;
  uploading: boolean;
  subscriptions: Subscription[] = [];
  dialogRef: MatDialogRef<any>;

  constructor(
    private matDialog: MatDialog,
    private winnerPhotoService: WinnerPhotoService
  ) { }

  ngOnInit() {
    this.uploading = false;
    this.imageDestination = '';
    this.getWinnerPhoto();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Fetch current winner photo for this event, returns a string URL in payload
   */
  getWinnerPhoto() {
    this.subscriptions.push(this.winnerPhotoService.get(this.eventSelected.id).subscribe(response => {
      if (response.status === 200) {
        if (response.payload.length > 0) {
          this.winnerPhoto = response.payload;
        }
      } else {
        alert('Sorry there was an error getting the winner photo');
        console.log(response);
      }
    }));
  }

  showWinnerDialog(winnerDialog: TemplateRef<any>) {
    this.dialogRef = this.matDialog.open(winnerDialog, {
      data: this.winnerPhoto !== null ? this.winnerPhoto : null, autoFocus: false,
      minWidth: 340
    });
  }

  previewImgError(img) {
    // do nothing
  }

  /**
   * User chose to save a winner. From here we determine whether we need to add a new winner photo or update existing
   * @param playerId Member ID to add as winner
   */
  save() {

    if (!this.winnerPhoto) {
      this.add();
    } else {
      this.update();
    }
  }

  /**
   * Insert New Winner Photo
   */
  add() {
    this.uploading = true;
    this.subscriptions.push(this.winnerPhotoService.add(
      this.imageDestination,
      this.fileToUpload.fileExtension,
      this.eventSelected.id).subscribe(response => {
        if (response.status === 201) {
          this.getWinnerPhoto();
        } else {
          alert('Sorry there was an error adding the winner.');
          console.error(response);
        }
        this.uploading = false;
        this.close();
    }));
  }

  update() {
    this.uploading = true;
    this.subscriptions.push(this.winnerPhotoService.update(
      this.imageDestination,
      this.fileToUpload.fileExtension,
      this.eventSelected.id,
      this.winnerPhoto).subscribe(response => {
        if (response.status === 200) {
          this.getWinnerPhoto();
        } else {
          alert('Sorry there was an error adding the winner.');
          console.error(response);
        }
        this.uploading = false;
        this.close();
    }));
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

  /**
   * Configure and Start the cropping process
   * @param image Image Element to be cropped
   */
  initCropper(image) {
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

  rotate(amount) {
    if (this.cropper) {
      this.cropper.rotate(amount);
    }
  }

  close() {
    this.dialogRef.close();
    this.previewImg = null;
    if (this.cropper) {
      this.cropper.destroy();
    }
  }

}
