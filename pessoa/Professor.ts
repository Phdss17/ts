import {Pessoa} from "./Pessoa";

export class Professor extends Pessoa{
    private _disciplina : string;
    constructor(nome : string, idade : number, disciplina : string){
        super(nome, idade);
        this._disciplina = disciplina;
    }

    public set disciplina(novaDisciplina : string){
        this._disciplina = novaDisciplina;
    }

    public ensinar() : void {
        console.log(`O(a) Professor(a) ${this.nome} está ensinando ${this._disciplina}\n`);
    }
}