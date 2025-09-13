import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GarmentService } from '../../services/garment.service';

@Component({
  standalone: true,
  selector: 'app-garment-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './garment-form.component.html',
  styleUrls: ['./garment-form.component.css']
})
export class GarmentFormComponent {
  name = '';
  category = '';
  color = '';
  imageFile!: File;

  constructor(private garmentService: GarmentService, private router: Router) {}

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  save() {
    if (!this.name || !this.category || !this.color || !this.imageFile) {
      alert('Completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('category', this.category);
    formData.append('color', this.color);
    formData.append('image', this.imageFile);

    this.garmentService.create(formData).subscribe(() => {
      alert('Prenda creada con éxito.');
      this.router.navigate(['/']);
    });
  }
}
