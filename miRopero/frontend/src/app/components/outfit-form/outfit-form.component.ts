import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OutfitService } from '../../services/outfit.service';
import { GarmentService } from '../../services/garment.service';
import { Garment } from '../../models/garment.model';

@Component({
  standalone: true,
  selector: 'app-outfit-form',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './outfit-form.component.html',
  styleUrls: ['./outfit-form.component.css']
})
export class OutfitFormComponent implements OnInit {
  name = '';
  imageFile!: File;
  garments: Garment[] = [];
  selectedGarments: number[] = [];
  categorias: string[] = [];
  carouselIndex: { [key: string]: number } = {};

  modalVisible = false;
  modalMessage = '';

  constructor(
    private outfitService: OutfitService,
    private garmentService: GarmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.garmentService.getAll().subscribe((data) => {
      this.garments = data;
      this.categorias = [...new Set(this.garments.map(g => g.category))];
      this.categorias.forEach(c => this.carouselIndex[c] = 0);
    });
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      if (!this.selectedGarments.includes(id)) {
        this.selectedGarments.push(id);
      }
    } else {
      this.selectedGarments = this.selectedGarments.filter(x => x !== id);
    }
  }

  getPrendasPorCategoria(categoria: string): Garment[] {
    return this.garments.filter(g => g.category === categoria);
  }

  retroceder(categoria: string): void {
    if (this.carouselIndex[categoria] >= 3) {
      this.carouselIndex[categoria] -= 3;
    }
  }

  avanzar(categoria: string): void {
    const total = this.getPrendasPorCategoria(categoria).length;
    if (this.carouselIndex[categoria] + 3 < total) {
      this.carouselIndex[categoria] += 3;
    }
  }

  mostrarModal(mensaje: string) {
    this.modalMessage = mensaje;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  save() {
  if (!this.name.trim()) {
    this.mostrarModal('Por favor, completá el nombre del outfit.');
    return;
  }

  if (!this.imageFile) {
    this.mostrarModal('Seleccioná una imagen para el outfit.');
    return;
  }

  if (this.selectedGarments.length < 2) {
    this.mostrarModal('Seleccioná al menos 2 prendas para crear el outfit.');
    return;
  }

  const formData = new FormData();
  formData.append('name', this.name);
  formData.append('image', this.imageFile);

  this.selectedGarments.forEach(id => {
    formData.append('garments', id.toString());
  });

  this.outfitService.create(formData).subscribe(() => {
    this.mostrarModal('¡Outfit creado con éxito!');
    setTimeout(() => this.router.navigate(['/outfits']), 2000);
  }, () => {
    this.mostrarModal('Ocurrió un error al crear el outfit.');
  });
}

}
