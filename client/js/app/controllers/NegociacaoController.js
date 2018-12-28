class  NegociacaoController{
    
    constructor () {
        let $ = document.querySelector.bind(document); //so funciona mantendo a associação com document por isso o uso do bind
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        
        /*
        this._listaNegociacoes = new ListaNegociacoes(model => 
        this._negociacoesView.update(model));
        let self = this;
        */       
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia'
        );
        
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        );
    }

    importaNegociacoes() {

        let service = new NegociacaoService();

        Promise.all([service.obterNegociacoesDaSemana(), 
                    service.obterNegociacoesDaSemanaAnterior(), 
                    service.obterNegociacoesDaSemanaRetrasada()]
                ).then(negociacoes => {
                        negociacoes
                        .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
                        .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));

                    this._mensagem.texto = 'Negociações importadas com sucesso';
                })
                .catch(erro => {
                    console.log(erro);
                    this._mensagem.texto = erro;
                });

        /*
       let service = new NegociacaoService();
       service.obterNegociacoesDaSemana()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da semana importadas com sucesso';
            })
            .catch(erro => console.log(erro));

        service.obterNegociacoesDaSemanaAnterior()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da semana anterior importadas com sucesso';
            })
            .catch(erro => console.log(erro));

        service.obterNegociacoesDaSemanaRetrasada()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da semana retrasada importadas com sucesso';
            })
            .catch(erro => console.log(erro));



        
       let service = new NegociacaoService();
       service.obterNegociacoesDaSemana((erro, negociacoes) => {

            if(erro){
                this._mensagem.texto = err;
                return;
            }

            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            

            service.obterNegociacoesDaSemanaAnterior((erro, negociacoes) => {

                if(erro){
                    this._mensagem.texto = err;
                    return;
                }
        
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                

                service.obterNegociacoesDaSemanaRetrasada((erro, negociacoes) => {

                    if(erro){
                        this._mensagem.texto = err;
                        return;
                    }
            
                    negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    this._mensagem.texto = 'Negociações importadas com sucesso';
                });

                });

       });*/

       

        
    }

    adiciona (event) {
        event.preventDefault();       
        this._listaNegociacoes.adiciona(this._criaNegociacao());        
        this._limpaFormulario();
        this._mensagem.texto = 'Negociação adicionada com sucesso';
        console.log(this._listaNegociacoes);
    }

    apaga () {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso';
    }

    _criaNegociacao(){
        return new Negociacao(DateHelper.textoParaData(this._inputData.value),
                              this._inputQuantidade.value,
                              this._inputValor.value);
    }

    _limpaFormulario(){
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

}