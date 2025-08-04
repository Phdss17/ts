import {Pessoa} from './Pessoa';

export class Aluno extends Pessoa{
    readonly matricula : number;
    constructor(nome : string, idade : number, matricula : number){
        super(nome, idade);
        this.matricula = matricula
    }

    public exibirMatricula() : void {
        console.log(`O(a) aluno(a) ${this.nome} porta a matrícula de número ${this.matricula}`);
    }
}