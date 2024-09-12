class RecintosZoo {
    constructor() {
        this.recintos = [
            {numero: 1, bioma: 'savana', total: 10, animais: [{especie: 'MACACO', quantidade: 3, carnivoro: false}]},
            {numero: 2, bioma: 'floresta', total: 5, animais: []},
            {numero: 3, bioma: 'savana e rio', total: 7, animais: [{especie: 'GAZELA', quantidade: 1, carnivoro: false}]},
            {numero: 4, bioma: 'rio', total: 8, animais: []},
            {numero: 5, bioma: 'savana', total: 9, animais: [{especie: 'LEAO', quantidade: 1, carnivoro: true}]},
        ];

        this.animaisValidos = {
            LEAO: {tamanho: 3, bioma: ['savana'], carnivoro: true},
            LEOPARDO: {tamanho: 2, bioma: ['savana'], carnivoro: true},
            CROCODILO: {tamanho: 3, bioma: ['rio'], carnivoro: true},
            MACACO: {tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false},
            GAZELA: {tamanho: 2, bioma: ['savana'], carnivoro: false},
            HIPOPOTAMO: {tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false},
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido
        if (!this.animaisValidos[animal]) {
            return {erro: "Animal inválido"};
        }

        // Verifica se a quantidade é válida
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return {erro: "Quantidade inválida"};
        }

        const infoAnimal = this.animaisValidos[animal];
        const recintosViaveis = [];

        // Itera sobre os recintos e verifica viabilidade
        this.recintos.forEach((recinto) => {
            // Verifica se o bioma é adequado
            if (!infoAnimal.bioma.includes(recinto.bioma)) {
                return;
            }

            // Calcula o espaço ocupado pelos animais existentes
            let espacoOcupado = recinto.animais.reduce((total, a) => total + a.quantidade * this.animaisValidos[a.especie].tamanho, 0);

            const espacoNecessario = infoAnimal.tamanho * quantidade;
            const espacoDisponivel = recinto.total - espacoOcupado;

            // Verifica se há espaço suficiente
            if (espacoDisponivel >= espacoNecessario) {
                // Regras para carnívoros
                const AlgumCarnivoro = recinto.animais.some((a) => this.animaisValidos[a.especie].carnivoro);
                if (infoAnimal.carnivoro && (AlgumCarnivoro || recinto.animais.length > 0)) {
                    return;
                }

                // Verifica se o macaco não está sozinho
                if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
                    return;
                }

                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    total: recinto.total,
                    espacoDisponivel,  // Adiciona essa informação para ordenar pelo espaço
                });
            }
        });

        // Ordena os recintos viáveis por espaço livre, em seguida pelo número do recinto
        if (recintosViaveis.length > 0) {
            return {
                recintosViaveis: recintosViaveis
                    .sort((a, b) => a.espacoDisponivel - b.espacoDisponivel || a.numero - b.numero)
                    .map((recinto) => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.total})`),
            };
        } else {
            return {erro: "Não há recinto viável"};
        }
    }
}

export { RecintosZoo as RecintosZoo };
