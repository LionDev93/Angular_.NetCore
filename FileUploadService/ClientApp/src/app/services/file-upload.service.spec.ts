import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FileUploadService } from './file-upload.service';
import {FileInfo} from '../interfaces/fileInfo.interface';

describe('FileUploadService', () => {
  let fileUploadService : FileUploadService;
  let httpMock : HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileUploadService]
    });
    fileUploadService = TestBed.get(FileUploadService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));

  it('be able to retrieve files from the API bia GET', () => {
    const dummyFiles: FileInfo[] = [
      {
        id: 1,
        filename : 'avatar1',
        filesize : '123456',
        filetype : 'image/png',
        updated_at : "06/04/2019",
        username : "user1"
      },
      {
        id: 2,
        filename : 'avatar12',
        filesize : '12345',
        filetype : 'video/mp4',
        updated_at : "06/04/2019",
        username : "user2"
      },
    ];
    fileUploadService.getUploadedList("image").subscribe(files => {
        expect(files).toEqual(dummyFiles);
    });
    const request = httpMock.expectOne( `${fileUploadService.site_url}/FileUpload/UploadedFiles/?fileType=image`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyFiles);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
