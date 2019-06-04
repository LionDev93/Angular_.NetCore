import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploadService } from '../../services/file-upload.service';
import { FileInfo } from '../../interfaces/fileInfo.interface';

@Component({
  selector: 'app-uploaded-file-list',
  templateUrl: './uploaded-file-list.component.html',
  styleUrls: ['./uploaded-file-list.component.css']
})

export class UploadedFileListComponent implements OnInit {

  constructor(private fileUploadService: FileUploadService) { }

  public tableTypes : string[] = ['image', 'video'];
  public displayedColumns: string[] = ['id', 'name', 'size', 'type', 'updated_at', 'user'];
  public dataSource = [];
  public uploadedFiles: any;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.onRefresh();
  }

  public updateList = () => {
    for(let i=0; i<this.tableTypes.length; i++){
      this.fileUploadService.getUploadedList(this.tableTypes[i])
        .subscribe(res => {
          this.uploadedFiles = res as FileInfo[];
          this.dataSource[i] = new MatTableDataSource(this.uploadedFiles);
        });
    }
  }

  public onRefresh = () => {
    this.updateList();
  }

}
