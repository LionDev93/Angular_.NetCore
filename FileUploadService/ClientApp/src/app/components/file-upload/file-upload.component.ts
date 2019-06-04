import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ResultMsg, ValidationResult } from '../../models/enums';
import { FileUploadService } from '../../services/file-upload.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

  constructor(private fileUploadService: FileUploadService) { }

  ngOnInit() {
  }

  private valid_type = /image\/*|video\/*/;
  private max_file_size : number = 1024 * 1024 * 10; //10MB

  public chosen_file : File;
  public isValid : boolean;

  public message : string;

  public preview_data : any;

  public upload_progress: number;

  emailFormControl = new FormControl('', [
    Validators.required,
  ]);

  private initVars = () => {
      this.chosen_file = null;
      this.isValid = false;
      this.message = "";
      this.preview_data = null;
  }

  private getPreviewData = (file : File) => {
    var sf_reader = new FileReader();
    sf_reader.readAsDataURL(file);
    sf_reader.onload = (_event) => {
      this.preview_data = sf_reader.result;
    }
  }

  private validationForFile = (file : File) => {
    if (!file.type.match(this.valid_type)){
      return ValidationResult.FileTypeInvalid;
    }
    if (file.size > this.max_file_size){
      return ValidationResult.FileSizeInvalid;
    }
    return ValidationResult.Success;
  }

  public onSelectFile = (file) => {

    // Initialize Variables.
    this.initVars();

    var files = file.files;
    // No chosen File then return.
    if (files.length === 0 ) {
      return;
    }

    this.chosen_file = files[0];

    // Validation for File Type and File Size.
    var validation_result =  this.validationForFile(this.chosen_file);
    if (validation_result == ValidationResult.FileTypeInvalid) {
      this.isValid = false;
      this.message = ResultMsg.ValidationTypeError;
      return;
    }
    else if (validation_result == ValidationResult.FileSizeInvalid) {
      this.isValid = false;
      this.message = ResultMsg.ValidationSizeError;
      return;
    }
    else {
      this.isValid = true;
      this.message = ResultMsg.ValidationSuccess;
    }

    // Get data for preview
    if(this.isValid) {
      this.getPreviewData(this.chosen_file);
    }

  }

  public onUpload = (username) => {

    let fileToUpload = <File>this.chosen_file;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('username', username);
    console.log(username);

    this.fileUploadService.uploadFile(formData)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.upload_progress = Math.round(event.loaded * 100 / event.total);
            this.message = this.upload_progress + '%';
          }
          else if (event.type === HttpEventType.Response) {
            this.message = ResultMsg.UploadSuccess;
            this.upload_progress = 100;
          }
        },
        error => {
          this.message = ResultMsg.UploadFailed;
          console.log(error);
        }
      );
  }

}
