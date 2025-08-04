import {Aluno} from './Aluno';
import {Professor} from './Professor';

function main() : void {
    let P1 = new Professor("Ph", 30, "FUP");
    let A1 = new Aluno("Vitória", 20, 234234);

    P1.apresentar();
    P1.ensinar();

    A1.apresentar();
    A1.exibirMatricula();
}

main();