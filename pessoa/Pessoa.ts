export class Pessoa{
    readonly nome : string;
    readonly idade : number;
    constructor(nome : string, idade : number){
        this.nome = nome;
        this.idade = idade;
    }

    public apresentar() : void {
        console.log(`Olá meu nome é ${this.nome} e eu tenho ${this.idade}\n`);
    }
}