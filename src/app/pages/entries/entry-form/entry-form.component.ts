import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import * as toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string = '';
  entryForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessages: string[] | null = null;
  submitting: boolean = false;
  entry!: Entry;
  categories: Array<Category> = [];

  maskConfig = {
    mask: 'R$ 000.000,00',
  };

  ptBr: any = {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService: EntryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    if (this.currentAction === 'edit') {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = +idParam; 
        this.loadEntry(id);
      } else {
        toastr.error('ID da entrada não encontrado.');
        this.router.navigate(['/entries']);
      }
    }
    this.loadCategories(); 
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submitting = true;

    if (this.entryForm.invalid) {
      this.submitting = false;
      toastr.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }


  get typeOptions(): Array<{ value: string, text: string }> {
    return [
      { value: 'expense', text: 'Despesa' },
      { value: 'revenue', text: 'Receita' }
    ];
  }

  onTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log("Valor selecionado:", selectElement.value);
}

  private setCurrentAction() {
    this.currentAction = this.route.snapshot.paramMap.get('id') ? 'edit' : 'new';
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]], 
      amount: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry(id: number) {
    this.entryService.getById(id).subscribe(
      (entry) => {
        this.entry = entry;
        this.entryForm.patchValue(entry);
      },
      (error) => toastr.error('Erro ao carregar a entrada.')
    );
  }
  
  private loadCategories() {
    this.categoryService.getAll().subscribe(
      (categories) => this.categories = categories,
      (error) => toastr.error('Erro ao carregar as categorias.')
    );
  }

  private setPageTitle() {
    this.pageTitle = this.currentAction === 'new'
      ? 'Cadastro de novo lançamento'
      : `Editando Lançamento: ${this.entry ? this.entry.name : 'Entrada Desconhecida'}`;
  }

  private createEntry() {
    const entry: Entry = {
      ...this.entryForm.value, 
      id: 0 
    };
    this.entryService.create(entry).subscribe(
      (createdEntry) => this.actionForSuccess(createdEntry),
      (error) => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry: Entry = {
      ...this.entryForm.value,
      id: this.entry.id
    };

    console.log("Updating Entry:", entry);
    this.entryService.update(entry).subscribe(
      () => this.actionForSuccess(entry),
      (error) => this.actionsForError(error)
    );
  }

  private actionForSuccess(entry: Entry) {
    toastr.success(`Lançamento ${entry.name} foi processado com sucesso!`);
    this.serverErrorMessages = null;
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    console.error('Error occurred:', error);
    toastr.error('Ocorreu um Erro ao tentar a sua solicitação!');
    this.submitting = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error.error).errors; 
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'];
    }
  }
}
