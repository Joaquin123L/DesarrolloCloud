import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  standalone: true,
  selector: 'app-folder-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit {
  folder!: Folder;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.folderService.get(+id).subscribe((data) => {
        this.folder = data;
        this.loading = false;
      });
    }
  }
}
