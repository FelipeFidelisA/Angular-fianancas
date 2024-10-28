import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import * as toastr from 'toastr';
import { error } from 'console';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = '';
  categoryForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages: string[] | null = null;
  submitting: boolean = false;
  categories: Category[] = [];
  category!: Category;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  get nameControl() {
    return this.categoryForm.get('name');
  }
  
  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }



  submitForm() {
    this.submitting = true;

    if (this.currentAction == 'new')
      this.createcategory();
    else
      this.updateCategory();
  }

  private setCurrentAction() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.currentAction = 'edit';
    } else {
      this.currentAction = 'new';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategories() {
    if (this.currentAction === 'edit') {
      const idParam = this.route.snapshot.paramMap.get('id');

      if (idParam) {
        const id = +idParam;  
        this.categoryService.getById(id).subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category);
          },
          (error) => alert('Erro ao carregar a categoria.')
        );
      } else {
        alert('ID da categoria não encontrado.');
        this.router.navigate(['/categories']);
      }
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name;
      this.pageTitle = `Editando categoria: ${categoryName}`;
    }
  }

  private createcategory() {
    const category: Category = Object.assign(new Category(0,'',''), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      (createdCategory) => {
        this.actionForSuccess(createdCategory);
      },
      (error) => {
        this.actionsForError(error);
      }
    );
  }
  private updateCategory() {
    const category: Category = Object.assign(new Category(0,'',''), this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      () => this.actionForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  private actionForSuccess(category: Category) {
    toastr.success(`Categoria ${category.name} foi processada com sucesso!`);

    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um Erro ao tentar a sua solicitação!')

    this.submitting = false;

    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'];
  }
}