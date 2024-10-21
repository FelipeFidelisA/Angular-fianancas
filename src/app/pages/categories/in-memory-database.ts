import { InmemoryDbservice } from "angular-in-memory-web-api";

import { Category } from './shared/category.model';

export class InMemoryDatabase implements InmemoryDbservice {
    createDb() {
        const categories = [
            { id: 1, name: 'Lazer', description: 'Cinema, vídeo, jogos, etc.' },
            { id: 2, name: 'Alimentação', description: 'Mercador, delivery, etc.' },
            { id: 3, name: 'Serviços', description: 'Energia, Água, Internet, etc.' },
            { id: 4, name: 'Salário', description: 'Recebimento de Salário' },
        ];
        return{categories};
    }
}