import { types } from 'util';
import { Category } from '../../categories/shared/category.model';

export class Entry {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: string,
        public amount?: number,
        public date?: string,
        public paid?: boolean,
        public categoryId?: number,
        public category?: Category,
    ) { }

    static types = {
        expense: 'Despesa',
        renevue: 'Receita'
    };

    get paidText(): string{
        return this.paid ? 'Pago' : 'Não pago';

    }
}