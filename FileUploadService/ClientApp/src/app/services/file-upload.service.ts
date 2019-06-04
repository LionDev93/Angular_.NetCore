import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  public site_url = 'https://localhost:44342';

  constructor(private http: HttpClient) { }

  public getUploadedList(fileType) {
    return this.http.get(this.site_url + '/FileUpload/UploadedFiles/', {
      params: {
        fileType: fileType
      }
    });
  }

  public uploadFile(formData) {
    return this.http.post(this.site_url + '/FileUpload/Upload', formData, {observe: 'events', reportProgress: true})
  }
}
