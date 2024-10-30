import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap, switchMap } from 'rxjs/operators';

import { CategoryService } from '../../categories/shared/category.service'

import { Entry } from './entry.model';
import { Category } from '../../categories/shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries';

  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {

    if (entry.categoryId === undefined) {
      return throwError(() => new Error('O campo categoryId é obrigatório.'));
    }

    return this.categoryService.getById(entry.categoryId).pipe(
      switchMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        );
      })
    );

  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;
  
    if (entry.categoryId === undefined) {
      return throwError(() => new Error('O campo categoryId é obrigatório.'));
    }
  
    return this.categoryService.getById(entry.categoryId).pipe(
      switchMap(category => {
        entry.category = category;
        return this.http.put<Entry>(url, entry).pipe(
          map(() => entry),
          catchError(this.handleError)
        );
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }



  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => entries.push(element as Entry));
    return entries;
  }

  private jsonDataToEntry(jsondata: any): Entry {
    return jsondata as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISAIÇÃO =>", error);
    return throwError(error);
  }
}
