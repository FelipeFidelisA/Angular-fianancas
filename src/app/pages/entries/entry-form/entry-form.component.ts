import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import * as toastr from 'toastr';

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

  maskConfig = {
    mask: 'R$ 000.000,00',
  };

  ptBr: any = {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
};

  constructor(
    private entryService: EntryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submitting = true;
    if (this.currentAction == 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
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
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadCategories() {
    if (this.currentAction === 'edit') {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = +idParam;
        this.entryService.getById(id).subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry);
          },
          (error) => toastr.error('Erro ao carregar a categoria.')
        );
      } else {
        toastr.error('ID da categoria não encontrado.');
        this.router.navigate(['/entries']);
      }
    }
  }

  private setPageTitle() {
    this.pageTitle = this.currentAction === 'new'
      ? 'Cadastro de novo lançamento'
      : `Editando Lançamento: ${this.entry.name}`;
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(0, '', ''), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      (createdEntry) => this.actionForSuccess(createdEntry),
      (error) => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(0, '', ''), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      () => this.actionForSuccess(entry),
      (error) => this.actionsForError(error)
    );
  }

  private actionForSuccess(entry: Entry) {
    toastr.success(`Lançamento ${entry.name} foi processado com sucesso!`);
    this.serverErrorMessages = null; // Limpa mensagens de erro
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um Erro ao tentar a sua solicitação!');
    this.submitting = false;

    if (error.status == 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente novamente mais tarde.'];
    }
  }
}
