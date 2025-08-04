import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

type Movimento = {
    tipo : string;
    descricao : string; 
    valor : number;
    categoria : string;
    data : Date;
}

const movimentos : Movimento[] = [];

function adicionarMovimento(move : Movimento): void {
    movimentos.push(move);
}

function calcularSaldo(): number {
    return movimentos.reduce(//itera pelos elementos do vetor acumulando determinado elemento, na variavel saldo
        function (saldo, mov) {//função lambda recebe saldo e mov e se o mov for do tipo entrada, soma ao saldo, se não subtrai
            return mov.tipo === 'entrada' ? saldo + mov.valor : saldo - mov.valor;
        }, 0);//saldo comeca zerado
}

function saldoNoDia(dia): number {
    return movimentos
        .filter(function (mov) {
            return mov.data <= dia;//filtra um dia específico
        })
        .reduce(function (saldo, mov) {//soma ou subtrai dependendo do tipo
            return mov.tipo === 'entrada'
                ? saldo + mov.valor
                : saldo - mov.valor;
        }, 0);
}


function totalGastoNoDia(dia): number {
    return movimentos
        .filter(function (mov) {
            return mov.tipo === 'saida' && mesmaData(mov.data, dia);//filtra pelas saídas
        })
        .reduce(function (total, mov) {
            return total + mov.valor;//soma todas
        }, 0);
}

function mesmaData(a, b): boolean {//verifica se é a mesma data
    return (
        a.getDate() === b.getDate() && 
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

function resumoMensal(mes, ano): any {
    let movData = movimentos
        .filter(function (mov) {//filtra por mes e ano
            return (
                mov.data.getMonth() === mes &&
                mov.data.getFullYear() === ano
            );
        });

    const saidas = movData
        .filter(function (mov) {//filtra por saida
            return ( mov.tipo === 'saida' );
        })
        .reduce(function (total, saida) {
            return total + saida.valor;// soma as saidas
        }, 0);

    const entradas = movData
        .filter(function(mov){
            return (mov.tipo === 'entrada')//filtra por entrada
        })
        .reduce(function(total, entrada){
            return total + entrada.valor//soma as entradas
        }, 0);

    return {
        entradas: entradas,
        saidas: saidas,
        saldo: entradas - saidas,
    };
}

function nomeMes(numeroMes): string {
    const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];
    return meses[numeroMes];
}

async function perguntarMovimento(){
    let continuar = "s";
    while(continuar === "s"){
        try {
            const tipo : string = await rl.question('Digite o tipo (entrada/saida): ');
            const descricao : string = await rl.question('Descrição: ');
            const valorStr : string = await rl.question('Valor: ');
            const categoria  : string = await rl.question('Categoria (fixo/variavel): ');
            const dataStr : string = await rl.question('Data (Dia-Mês-Ano): ');
            const [dia, mes, ano] = dataStr
                .split('-')
                .map(Number);
            const data = new Date(ano, mes - 1, dia);
            const valor : number = parseFloat(
                valorStr.replace(',', '.')
            );
            adicionarMovimento({
                tipo,
                descricao,
                valor,
                categoria,
                data
            });
            continuar = (await rl.question('Deseja adicionar outro movimento? (s/n): ')).toLowerCase();
        } catch (error){
            console.error("erro no input", error.message);
        }
        
    }

    mostrarResumo();
    rl.close();
}

function mostrarResumo(): void {
    console.log('\n--- Movimentos ---');
    movimentos.forEach((mov) => {
        const dataFormatada =
            `${mov.data.getDate().toString().padStart(2, '0')}/` +
            `${(mov.data.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${mov.data.getFullYear()}`;
        const valorFormatado = mov.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        console.log(
            `${mov.tipo.toUpperCase()} | ${
                mov.descricao
            } | ${valorFormatado} | ${mov.categoria} | ${dataFormatada}`
        );
    });
    // Descobre o mês e ano do último movimento, ou do mês atual se não houver movimentos
    let mes, ano;
    if (movimentos.length > 0) {
        const ultimoMov = movimentos[movimentos.length - 1];
        mes = ultimoMov.data.getMonth();
        ano = ultimoMov.data.getFullYear();
    } else {
        const hoje = new Date();
        mes = hoje.getMonth();
        ano = hoje.getFullYear();
    }

    const resumo = resumoMensal(mes, ano);
    const nomeDoMes = nomeMes(mes);

    // Formata os valores do resumo
    const entradasFormat = resumo.entradas.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const saidasFormat = resumo.saidas.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    const saldoFormat = resumo.saldo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    console.log(`\n--- Resumo do mês de ${nomeDoMes} de ${ano} ---`);
    console.log(`Entradas: ${entradasFormat}`);
    console.log(`Saídas: ${saidasFormat}`);
    console.log(`Saldo: ${saldoFormat}`);
}

perguntarMovimento();