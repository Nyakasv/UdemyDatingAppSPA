import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { environment } from './../../../environments/environment';
import { Photo } from './../../_models/Photo';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as _ from 'underscore';

// this component utilize NG2 File Uploader and UnderscorJS
@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  constructor(private authSevice: AuthService, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // even so the isHTML5 is set to true the component html give an error:
  // Identifier 'isHTML5' is not defined. 'FileUploader' does not contain such a member
  initializeUploader() {
    this.uploader  =  new FileUploader({
      url: this.baseUrl + 'users/' + this.authSevice.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authSevice.changeMemberPhoto(photo.url);
          this.authSevice.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authSevice.currentUser));
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authSevice.decodedToken.nameid, photo.id).subscribe(() => {
      // console.log('photo set as main');
      this.currentMain = _.findWhere(this.photos, {isMain: true});
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.authSevice.changeMemberPhoto(photo.url);
      this.authSevice.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authSevice.currentUser));
    }, error => {
      this.alertifyService.error(error);
    });
  }

  deletePhoto(id: number) {
    this.alertifyService.confirm('Are you sure deleting this photo?', () => {
      this.userService.deletePhoto(this.authSevice.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(_.findIndex(this.photos, { id: id}), 1);
        this.alertifyService.success('Photo deleted');
      }, error => {this.alertifyService.error('Failed to delete photo'); }
      );
    });
  }
}
