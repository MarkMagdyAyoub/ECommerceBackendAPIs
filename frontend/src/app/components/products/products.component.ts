import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductResponseService } from '../../services/product-response.service';
import { Product } from '../../interfaces/product';
import { ApiResponse, ErrorResponse } from '../../interfaces/validation-get-all-products';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule , ProductCardComponent],
  providers:[ProductResponseService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  errors: string[] = [];
  errorMessage: string | null = null;

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(private productService: ProductResponseService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(search: string = '') {
    this.productService.getProducts(this.currentPage, this.pageSize, search)
      .subscribe((res: ApiResponse) => {
        if (res.status === 'success') {
          this.products = res.data.products;
          this.totalPages = res.data.pagination.pages;
          this.errors = [];
          this.errorMessage = null;
        } else if (res.status === 'fail' && "errors" in res.data) {
          this.errorMessage = null;
          this.products = [];
        } else if (res.status === 'error' && "message" in res) {
          this.errorMessage = res.message;
          this.errors = [];
          this.products = [];
        }
      });
  }

  prevPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
