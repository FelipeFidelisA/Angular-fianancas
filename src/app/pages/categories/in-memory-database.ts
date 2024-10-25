import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from './shared/category.model';
import { Entry } from '../entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories = [
            { id: 1, name: 'Lazer', description: 'Cinema, vídeo, jogos, etc.' },
            { id: 2, name: 'Alimentação', description: 'Mercado, delivery, etc.' },
            { id: 3, name: 'Serviços', description: 'Energia, Água, Internet, etc.' },
            { id: 4, name: 'Salário', description: 'Recebimento de Salário' },
        ];

        const entries: Entry[] = [
            { id: 1, name: 'Gás de cozinha', categoryId: 3, paid: true, paidText: 'Pago', date: '14/10/2018', amount: 70.80, type: 'expense' } as Entry,
            { id: 2, name: 'Gasolina', categoryId: 1, paid: true, paidText: 'Pago', date: '14/10/2018', amount: 70.00, type: 'expense' } as Entry,
            { id: 3, name: 'Internet', categoryId: 3, paid: true, paidText: 'Pendente', date: '14/10/2018', amount: 70.00, type: 'expense' } as Entry,
            { id: 4, name: 'Salário', categoryId: 4, paid: true, paidText: 'Pago', date: '14/10/2018', amount: 2000, type: 'income' } as Entry
        ];

        entries.forEach(entry => {
            entry['category'] = categories.find(category => category.id === entry.categoryId);
        });

        return { categories, entries };
    }
}
