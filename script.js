
 const Estado = new Object({
        vida:100,
        fome:100,
        sede:100,
        tempo:0,
        morto: false,

        modo_teste: false,

        morrendo_de_fome: false,
        morrendo_de_sede:false,


        taxa_aumento_fome:10,
        taxa_aumento_sede:10,

        texto_atual:1,
        cena_atual:1,

        tela_atual:1,

        ja_clicou_em_acao: false,

        fogueira_ativa:false,
        fogueira_duracao:0,

        dano_atual: 3,
        desarmado: true,

        em_combate: false,

        em_combate_lobo: false,
        em_combate_urso: false,

        lobos_amigos: 0,
    

        ignorou_prisioneiro:false,
        passou_pela_portinha:false,
        morador_do_buraco_nota_fogueira:false,

        final:false

        
    });

const Coisas = new Object({

    total:0,

    madeira:0,
    pedra:0,

    carne:0,
    

    fruta:0,
    erva:0,
    cogumelo:0,
    migalha_gigante:0,

    couro:0,

    ouro:0,
    carvao:0,
    
    faca:0,
    capacete:0
    

});


const Combate = new Object({

    vida_criatura: 0,
    defesa_criatura:0,
    chance_de_escapar:0,

    agressivo: true,

    pode_ser_acalmado: false

});


//INFORMAÇÕES SOBRE CRIATURAS
const Lobo = new Object({

    vida:10,
    dano_mordida:20,
    defesa:3,
    chance_de_escapar:30
    //ataques
});

const Urso = new Object({
    vida:30,
    dano_mordida:25,
    dano_arranhao:20,
    defesa:4,
    chance_de_escapar:50
});



//////////////////////////////////////////////
//////////////////////////////////////////////
//PARTE DE INTERRUPÇÕES
//////////////////////////////////////////////
//////////////////////////////////////////////


//CADA TRECHO DE CENAS TEM UMA CERTA PROBABILIDADE DE APARECEREM CERTAS CRIATURAS
//das cenas 1 a 8
const Trecho1 = new Object({
    //ocorrem no trecho 1
    probabilidade_lobo: 35,
    probabilidade_urso:30,

    probabilidade_lobo_inicial:35, //para voltar o valor anterior quando acabar a fogueira
    probabilidade_urso_inicial:30

});



function atualiza_texto_combate(texto){
    
    if(Estado.em_combate_lobo){
        document.getElementById("texto_combate_lobo").innerHTML = texto;
    }
    if(Estado.em_combate_urso){
        document.getElementById("texto_combate_urso").innerHTML = texto;
    }
}


////////////////////////////////
////////////////////////////////


//USAR Combate, e não a classe específica do monstro.
//A classe Combate foi feita porque pode ser alterada. a classe de cada monstro é fixa.

function rodar_ataque_lobo(){

    document.getElementById("tela1").style.animation = 'none';
    document.getElementById("tela1").offsetHeight;
    document.getElementById("tela1").style.animation = null;
  
    number = Math.random();

    total = Lobo.dano_mordida + Math.floor(4*number);

    Estado.vida -= total;
}


function dropar_itens_lobo(){
    
    Coisas.carne += 1;
    Coisas.total += 1;
    alert("Você conseguiu carne!");

    var random_number = Math.random();
    if(random_number > 0.1){
        Coisas.couro+=1;
        Coisas.total+=1;
        alert("Você conseguiu couro!");
    }
    random_number = Math.random();
    if(random_number > 0.1){
        Coisas.carna+=2;
        Coisas.total+=2;
    }     
    atualizar();
}


//checa se ataques e outras ações surtiram efeito antes de chamar essa função
function rodar_turno_lobo(fim_combate,jogada){

    if(fim_combate){
        if (jogada == "fugiu"){
            alert("Você fugiu");
            desativa_ataque_monstro();
        }
        if (jogada == "atacou"){
            alert("Você matou Lobo");
            desativa_ataque_monstro();

            dropar_itens_lobo();
        }
        if (jogada == "jogou_carne"){
            alert("Lobo decide te deixar sossegado.");
            Estado.lobos_amigos += 1;
            desativa_ataque_monstro();
        }
    }
    else{
        if(jogada == "fugiu"){
            atualiza_texto_combate("Você tenta fugir mas não consegue. Lobo ataca.");

            rodar_ataque_lobo();
            atualizar();
        }
        else if(jogada == "atacou") {
            if(Estado.modo_teste){
                if(Coisas.pedra == 0 && Coisas.madeira == 0){
                    atualiza_texto_combate("Você dá um soco no lobo. Lobo parece furioso. Lobo ataca." + Combate.vida_criatura);
                }
                else if (Coisas.madeira > 0){
                    atualiza_texto_combate("Você acerca Lobo com um galho. Lobo parece furioso. Lobo ataca." + Combate.vida_criatura);
                }
                else if (Coisas.pedra > 0){
                    atualiza_texto_combate("Você acerca Lobo com uma pedra. Lobo parece furioso. Lobo ataca." + Combate.vida_criatura);
                }
            }
            else{
                if(Coisas.pedra == 0 && Coisas.madeira == 0){
                    atualiza_texto_combate("Você dá um soco no lobo. Lobo parece furioso. Lobo ataca.");
                }
                else if (Coisas.madeira > 0){
                    atualiza_texto_combate("Você acerca Lobo com um galho. Lobo parece furioso. Lobo ataca.");
                }
                else if (Coisas.pedra > 0){
                    atualiza_texto_combate("Você acerca Lobo com uma pedra. Lobo parece furioso. Lobo ataca.");
                }

            }
            
            

            rodar_ataque_lobo();
            atualizar();
        }  
        else if(jogada == "jogou_carne"){
            atualiza_texto_combate("Você tenta jogar comida para o lobo, mas ele te ataca mesmo assim.");

            rodar_ataque_lobo();
            atualizar();

        }             
    }

}


//após apertar os botões passamos para a função rodar_turno_lobo() as informações que ele precisa processar

function apertou_botao_jogar_carne(){
    
    if(Combate.agressivo == false){
        
        rodar_turno_lobo(true, "jogou_carne");
    }

    else if(Combate.pode_ser_acalmado){
        number = Math.random();
        if(number > 0.3){
            alert("Lobo come a carne. Ele parece ligeiramente mais calmo.");
            Combate.agressivo = false;
            

            Coisas.carne -= 1;
            if (Coisas.carne <= 0 ){
                document.getElementById("jogar_carne_button").style.display = "none";
            }

            rodar_turno_lobo(false, "jogou_carne");
        }   
        else{
            alert("Lobo não se interessa pela carne que você joga.");

            Coisas.carne -= 1;
            if (Coisas.carne <= 0 ){
                document.getElementById("jogar_carne_button").style.display = "none";
            }

            rodar_turno_lobo(false, "jogou_carne");
        }     
    }

    
}

function apertou_botao_atacar_lobo(){

    Combate.pode_ser_acalmado = false;
    Combate.agressivo = true;
    
    var number = Math.random();

    var dano_recebido = Math.floor((Estado.dano_atual - Combate.defesa_criatura) + number*3);
    
    if (dano_recebido < 0){dano_recebido = 0;}

    Combate.vida_criatura -= dano_recebido;
    
    if(Combate.vida_criatura > 0){
        setTimeout(() => {rodar_turno_lobo(false,"atacou");}, 500);
    }
    else{
        setTimeout(() => {rodar_turno_lobo(true,"atacou");}, 500);
    }
    
}

function apertou_botao_fugir_lobo(){

    conseguiu_fugir = false;

    number = Math.random();

    if(number*100 < Combate.chance_de_escapar){conseguiu_fugir = true;}

    if(Estado.modo_teste){conseguiu_fugir = true;}

    if(conseguiu_fugir){
        setTimeout(() => {rodar_turno_lobo(true,"fugiu");}, 500);
    }
    else{
        setTimeout(() => {rodar_turno_lobo(false,"fugiu")}, 500);
    }
    
}



///////////////////////////////
//PARTE DO URSO////////////////

function dropar_itens_urso(){
    Coisas.carne += 3;
    Coisas.total += 3;
    alert("Você conseguiu carne!");
    

    var random_number = Math.random();
    if(random_number > 0.1){
        Coisas.couro+=2;
        Coisas.total+=2;
        alert("Você conseguiu couro!");
    }
    random_number = Math.random();
    if(random_number > 0.1){
        Coisas.carna+=2;
        Coisas.total+=2;
    }     
    atualizar();
}

function rodar_ataque_urso(){

    document.getElementById("tela1").style.animation = 'none';
    document.getElementById("tela1").offsetHeight;
    document.getElementById("tela1").style.animation = null;


    number = Math.random();

    total = Urso.dano_mordida + Math.floor(5*number);

    Estado.vida -= total;
}

function rodar_turno_urso(fim_combate, jogada){

    if(fim_combate){
        if (jogada == "fugiu"){
            alert("Você fugiu");
            desativa_ataque_monstro();
        }
        if (jogada == "atacou"){
            alert("Você matou Urso");
            desativa_ataque_monstro();

            dropar_itens_urso();
        }
    }
    else{
        if(jogada == "fugiu"){
            atualiza_texto_combate("Você tenta fugir mas não consegue. Urso ataca.");

            rodar_ataque_urso();
            atualizar();
        }
        else if(jogada == "atacou") {
            
            if(Estado.modo_teste){
                if(Coisas.pedra == 0 && Coisas.madeira == 0){
                    atualiza_texto_combate("Você dá um soco no urso. Atacar desarmado o urso não parece uma boa ideia." + Combate.vida_criatura);
                }
                else if (Coisas.madeira > 0){
                    atualiza_texto_combate("Você acerca Urso com um galho. Urso parece furioso. Urso ataca." + Combate.vida_criatura);
                }
                else if (Coisas.pedra > 0){
                    atualiza_texto_combate("Você acerca Urso com uma pedra. Urso parece furioso. Urso ataca." + Combate.vida_criatura);
                }
            }
            else{
                if(Coisas.pedra == 0 && Coisas.madeira == 0){
                    atualiza_texto_combate("Você dá um soco no urso. Atacar desarmado o urso não parece uma boa ideia.");
                }
                else if (Coisas.madeira > 0){
                    atualiza_texto_combate("Você acerca Urso com um galho. Urso parece furioso. Urso ataca.");
                }
                else if (Coisas.pedra > 0){
                    atualiza_texto_combate("Você acerca Urso com uma pedra. Urso parece furioso. Urso ataca.");
                }
            }
            

            rodar_ataque_urso();
            atualizar();
        }               
    }


}



function apertou_botao_atacar_urso(){

    var number = Math.random();

    var dano_recebido = Math.floor((Estado.dano_atual - Combate.defesa_criatura) + number*3);
    
    if (dano_recebido < 0){dano_recebido = 0;}

    Combate.vida_criatura -= dano_recebido;
    
    if(Combate.vida_criatura > 0){
        setTimeout(() => {rodar_turno_urso(false,"atacou");}, 800);
    }
    else{
        setTimeout(() => {rodar_turno_urso(true,"atacou");}, 800);
    }
}


function apertou_botao_fugir_urso(){

    conseguiu_fugir = false;

    number = Math.random();

    if(number*100 < Combate.chance_de_escapar){conseguiu_fugir = true;}

    if(Estado.modo_teste){conseguiu_fugir = true;}

    if(conseguiu_fugir){
        setTimeout(() => {rodar_turno_urso(true,"fugiu");}, 500);
    }
    else{
        setTimeout(() => {rodar_turno_urso(false,"fugiu")}, 500);
    }

}

////////////////////////////////////////
////////////////////////////////////////
function iniciar_lobo(){
    Combate.vida_criatura = Lobo.vida;
    Combate.chance_de_escapar = Lobo.chance_de_escapar;
    Combate.defesa_criatura = Lobo.defesa;
    Combate.agressivo = true;
    Combate.pode_ser_acalmado = true;

    
}
function iniciar_urso(){
    Combate.vida_criatura = Urso.vida;
    Combate.chance_de_escapar = Urso.chance_de_escapar;
    Combate.defesa_criatura = Urso.defesa;
    Combate.agressivo = true;
    Combate.pode_ser_acalmado = false;
}
/////////////////////////////////////////
/////////////////////////////////////////

function carregar_combate(){

    document.getElementById("tela_combate_lobo").style.display = "none";
    document.getElementById("tela_combate_urso").style.display = "none";


    if(Estado.em_combate_lobo){
        document.getElementById("tela_combate_lobo").style.display = "block";
        atualiza_texto_combate("Um lobo selvagem se aproxima!");

        if(Coisas.carne > 0 ){
            document.getElementById("jogar_carne_button").style.display = "block";
        }
        else{
            document.getElementById("jogar_carne_button").style.display = "none";
        }

        iniciar_lobo();
    }
    else if(Estado.em_combate_urso){
        document.getElementById("tela_combate_urso").style.display = "block";
        atualiza_texto_combate("Um urso selvagem se aproxima!");
        iniciar_urso();
    }
 
}



function ativa_ataque_monstro(monstro){
    document.getElementById("tela_grande_action").style.display = "none";
    document.getElementById("tela_grande_texto").style.display = "none";
    document.getElementById("tela_grande_combate").style.display = "block";    

    Estado.em_combate = true;

    if(monstro == "lobo"){
        Estado.em_combate_lobo = true;
    }
    if(monstro == "urso"){
        Estado.em_combate_urso = true;
        
    }


    carregar_combate();
}

function desativa_ataque_monstro(){


    Estado.em_combate = false;
    Estado.em_combate_lobo = false;
    Estado.em_combate_urso = false;

    if(Estado.tela_atual == 1){
        document.getElementById("tela_grande_texto").style.display = "block";
    }
    if(Estado.tela_atual == 2){
        document.getElementById("tela_grande_action").style.display = "block";

    }

    document.getElementById("tela_grande_combate").style.display = "none";
}

function rodar_interrupcoes(){
    
    if(Estado.cena_atual <=8){

        var random_number1 = Math.random();
        var random_number2 = Math.random();
        var random_number3 = Math.random();

        if (Estado.fogueira_ativa){
            Trecho1.probabilidade_lobo = Math.floor(Trecho1.probabilidade_lobo/4);
            Trecho1.probabilidade_urso = Math.floor(Trecho1.probabilidade_urso/4);
        }
        else{
            
            Trecho1.probabilidade_lobo = Trecho1.probabilidade_lobo_inicial;
            Trecho1.probabilidade_urso = Trecho1.probabilidade_urso_inicial;
            
        }

        if ( (random_number1 * 100) < Trecho1.probabilidade_lobo ){
            
            ativa_ataque_monstro("lobo");
        }
        else if( (random_number2 * 100) < Trecho1.probabilidade_urso){
            ativa_ataque_monstro("urso");
        }
       
    }   

}


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////



function carregar(){
    
    document.getElementById("tela1").style.animation = 'none';

    vida =  document.getElementById("vida");
    vida.innerHTML = "Vida: " + Estado.vida;

    fome = document.getElementById("fome");
    fome.innerHTML = "Fome: " + Estado.fome;

    sede = document.getElementById("sede");
    sede.innerHTML = "Sede: " + Estado.sede ;
    tempo = document.getElementById("tempo");
    tempo.innerHTML = calcula_tempo();

    
    cena1();

}


function atualizar(){

    

  if(Estado.modo_teste){ Estado.vida = 100;}

    //////////////////////////////////////
    //////////////////////////////////////


    //mantém fome e sede e vida dentro de um limite
    if (Estado.fome> 100){Estado.fome = 100;}
    if (Estado.sede > 100){Estado.sede = 100;}
    if (Estado.vida > 100){Estado.vida = 100;}

    vida =  document.getElementById("vida");
    vida.innerHTML = "Vida: " + Estado.vida;

    fome = document.getElementById("fome");
    fome.innerHTML = "Fome: " + Estado.fome;

    sede = document.getElementById("sede");
    sede.innerHTML = "Sede: " + Estado.sede ;
;

    tempo = document.getElementById("tempo");
    tempo.innerHTML = calcula_tempo();
    
    if( Estado.vida <= 0 ){
       Estado.morto = true;
    }
    if(Estado.morto == true){
       document.getElementById("tela1").style.display = "none";
       document.getElementById("tela_morte").style.display = "block";
    }

    if(Coisas.total > 0 ){
        document.getElementById("coisas").style.display = "block";
    }


    //EXIBE FOGUEIRA, SE TIVER ATIVA. 
    if(Estado.fogueira_duracao <= 0 ){Estado.fogueira_ativa = false;}
    if(Estado.fogueira_ativa){
        document.getElementById("fogueira").style.display = "block";
        document.getElementById("fogueira").innerHTML = 'Duração da fogueira: ' + Estado.fogueira_duracao;
    }
    else{
        document.getElementById("fogueira").style.display = "none";
    }




    //ATUALIZA BOTÕES
    create_action();

    //MOSTRANDO OS ITENS DO IVENTÁRIO NA TELA




    //EXIBE A QUANTIDADE DE MADEIRA
    if(Coisas.madeira > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_madeira = document.getElementById("texto_madeira");
        if(texto_madeira == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_madeira"> Madeira: ' + Coisas.madeira + '</div>';
        }
        else{
            document.getElementById("texto_madeira").innerHTML = 'Madeira: ' + Coisas.madeira;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_madeira = document.getElementById("texto_madeira");
        if (texto_madeira != null){
            texto_madeira.remove();
        }
    }

    //EXIBE A QUANTIDADE DE PEDRA

     if(Coisas.pedra > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_pedra = document.getElementById("texto_pedra");
        if(texto_pedra == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_pedra"> Pedra: ' + Coisas.pedra + '</div>';
        }
        else{
            document.getElementById("texto_pedra").innerHTML = 'Pedra: ' + Coisas.pedra;
        }
    }
     else{
        //apaga o texto quando a quantidade for zero
        let texto_pedra = document.getElementById("texto_pedra");
        if (texto_pedra != null){
            texto_pedra.remove();
        }
    }

    //EXIBE A QUANTIDADE DE CARNE 

     if(Coisas.carne > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_carne = document.getElementById("texto_carne");
        if(texto_carne == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_carne"> Carne: ' + Coisas.carne + '</div>';
        }
        else{
            document.getElementById("texto_carne").innerHTML = 'Carne: ' + Coisas.carne;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_carne = document.getElementById("texto_carne");
        if (texto_carne != null){
            texto_carne.remove();
        }
    }


    //EXIBE A QUANTIDADE DE FRUTA

    if(Coisas.fruta > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_fruta = document.getElementById("texto_fruta");
        if(texto_fruta == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_fruta"> Fruta: ' + Coisas.fruta + '</div>';
        }
        else{
            document.getElementById("texto_fruta").innerHTML = 'Fruta: ' + Coisas.fruta;
        }

    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_fruta = document.getElementById("texto_fruta");
        if (texto_fruta != null){
            texto_fruta.remove();
        }
    }


    //EXIBE A QUANTIDADE DE ERVA

     if(Coisas.erva > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_erva = document.getElementById("texto_erva");
        if(texto_erva == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_erva"> Erva: ' + Coisas.erva + '</div>';
        }
        else{
            document.getElementById("texto_erva").innerHTML = 'Erva: ' + Coisas.erva;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_erva = document.getElementById("texto_erva");
        if (texto_erva != null){
            texto_erva.remove();
        }
    }


    //EXIBE A QUANTIDADE DE COGUMELO

     if(Coisas.cogumelo > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_cogumelo = document.getElementById("texto_cogumelo");
        if(texto_cogumelo == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_cogumelo"> Cogumelo: ' + Coisas.cogumelo + '</div>';
        }
        else{
            document.getElementById("texto_cogumelo").innerHTML = 'Cogumelo: ' + Coisas.cogumelo;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_cogumelo = document.getElementById("texto_cogumelo");
        if (texto_cogumelo != null){
            texto_cogumelo.remove();
        }
    }


    //EXIBE A QUANTIDADE DE MIGALHA GIGANTE

    if(Coisas.migalha_gigante > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_migalha_gigante = document.getElementById("texto_migalha_gigante");
        if(texto_migalha_gigante == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_migalha_gigante"> Migalha gigante: ' + Coisas.migalha_gigante + '</div>';
        }
        else{
            document.getElementById("texto_migalha_gigante").innerHTML = 'Migalha gigante: ' + Coisas.migalha_gigante;
        }

    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_migalha_gigante = document.getElementById("texto_migalha_gigante");
        if (texto_migalha_gigante != null){
            texto_migalha_gigante.remove();
        }
    }

    //EXIBE A QUANTIDADE DE COURO

     if(Coisas.couro > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_couro = document.getElementById("texto_couro");
        if(texto_couro == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_couro"> Couro: ' + Coisas.couro + '</div>';
        }
        else{
            document.getElementById("texto_couro").innerHTML = 'Couro: ' + Coisas.couro;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_couro = document.getElementById("texto_couro");
        if (texto_couro != null){
            texto_couro.remove();
        }
    }

    //EXIBE  A QUANTIDADE DE OURO

     if(Coisas.ouro > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_ouro = document.getElementById("texto_ouro");
        if(texto_ouro == null){
            document.getElementById("coisas").innerHTML += '<div class = "coisa" id = "texto_ouro"> Ouro: ' + Coisas.ouro + '</div>';
        }
        else{
            document.getElementById("texto_ouro").innerHTML = 'Ouro: ' + Coisas.ouro;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_ouro = document.getElementById("texto_ouro");
        if (texto_ouro != null){
            texto_ouro.remove();
        }
    }



    //EXIBE  A QUANTIDADE DE CARVÃO

     if(Coisas.carvao > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_carvao = document.getElementById("texto_carvao");
        if(texto_carvao == null){
            document.getElementById("coisas").innerHTML += '<div style = "coisa" id = "texto_carvao"> Carvao: ' + Coisas.carvao + '</div>';
        }
        else{
            document.getElementById("texto_carvao").innerHTML = 'Carvao: ' + Coisas.carvao;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_carvao = document.getElementById("texto_carvao");
        if (texto_carvao != null){
            texto_carvao.remove();
        }
    }



    //EXIBE A QUANTIDADE DE FACA

     if(Coisas.faca > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_faca = document.getElementById("texto_faca");
        if(texto_faca == null){
            document.getElementById("coisas").innerHTML += '<div style = "coisa" id = "texto_faca"> Faca: ' + Coisas.faca + '</div>';
        }
        else{
            document.getElementById("texto_faca").innerHTML = 'Faca: ' + Coisas.faca;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_faca = document.getElementById("texto_faca");
        if (texto_faca != null){
            texto_faca.remove();
        }
    }

    //EXIBE A QUANTIDADE DE CAPACETE

     if(Coisas.capacete > 0 ){
        
        //para não aparecer "madeira: 1" várias vezes
        let texto_capacete = document.getElementById("texto_capacete");
        if(texto_capacete == null){
            document.getElementById("coisas").innerHTML += '<div style = "coisa" id = "texto_capacete"> Capacete: ' + Coisas.capacete + '</div>';
        }
        else{
            document.getElementById("texto_capacete").innerHTML = 'Capacete: ' + Coisas.capacete;
        }
    }
    else{
        //apaga o texto quando a quantidade for zero
        let texto_capacete = document.getElementById("texto_capacete");
        if (texto_capacete != null){
            texto_capacete.remove();
        }
    }


    if(Estado.final){
        document.getElementById("avancar").style.display = "none";
        document.getElementById("action").style.display = "none";
    }
}




///////////////////////////


function atualiza_fome(){
    Estado.fome -=Estado.taxa_aumento_fome;

    if(Estado.fome < 0){Estado.fome = 0;}
    if(Estado.fome == 0){Estado.morrendo_de_fome = true;}
    else{Estado.morrendo_de_fome = false;}

    if(Estado.morrendo_de_fome){Estado.vida -=40;}
    
}

function atualiza_sede(){
    Estado.sede -= Estado.taxa_aumento_sede;

   if(Estado.sede < 0){Estado.sede = 0;}
   if(Estado.sede == 0){Estado.morrendo_de_sede = true;}
   else{Estado.morrendo_de_sede = false;}

   if(Estado.morrendo_de_sede){Estado.vida-=40;}

    //você não fica com sede caso esteja em alguma cena relativa a um local com água
    if(Estado.cena_atual == 6 || Estado.cena_atual == 10 || Estado.cena_atual == 15 || (Estado.cena_atual == 14 && Estado.ignorou_prisioneiro == false) || (Estado.cena_atual >=15 && Estado.ignorou_prisioneiro)){
        Estado.sede = 100;
    }
    
}
function atualiza_fogueira(){
    Estado.fogueira_duracao-=1;
}
function atualiza_fome_e_sede(){
    atualiza_fome();
    atualiza_sede();
}
function atualiza_tempo(){
    Estado.tempo+=1;
}

function atualiza_tudo(){
    atualiza_fome_e_sede();

    if(Estado.fogueira_ativa){Estado.vida +=3;}

    if( (Coisas.pedra > 0 || Coisas.madeira > 0 ) && Estado.dano_atual < 10){
        Estado.dano_atual = 10;
    }
    else{
        if(Estado.desarmado){
            Estado.dano_atual = 3;
        }
    }

    atualiza_fogueira();
    atualiza_tempo();
    if(Estado.cena_atual > 3){
        rodar_interrupcoes();
    }
    
}

/////////////////////////////


function calcula_tempo(){

    let dias1 = Math.floor(Estado.tempo/24.0);
    let horas1 = Estado.tempo%24.0;

    let dias = dias1.toString();
    let horas = horas1.toString();

    let resultado = "Dia: " + dias + " "+ "Hora: " + horas;
    return resultado;
}



function avancar(){
    
    

   if(Estado.cena_atual == 15 && Estado.fogueira_duracao > 0){
        Estado.morador_do_buraco_nota_fogueira = true;
   }

   //Ao avançar nos afastamos da fogueira
    Estado.fogueira_ativa = false;
    Estado.fogueira_duracao = 0;

    atualiza_tudo();
    atualizar();

    if (Estado.cena_atual == 1){
        cena2();
    }
    else if(Estado.cena_atual == 2){
        cena3();
    }
    else if(Estado.cena_atual == 3){
        cena4();
    }
    else if(Estado.cena_atual == 4){
        cena5();
    }
    else if(Estado.cena_atual == 5){
        cena6();
    }
    else if(Estado.cena_atual == 6){
        cena7();
    }
    else if(Estado.cena_atual == 7){
        cena8();
    }
    else if(Estado.cena_atual == 8){
        cena9();
    }
    else if(Estado.cena_atual == 9){
        cena10();
    }
    else if(Estado.cena_atual == 10){
        cena11();
    }
    else if(Estado.cena_atual == 11){
        cena12();
    }
    else if(Estado.cena_atual == 12){
        cena13();
    }
    else if(Estado.cena_atual == 13){
        cena14();
    }
    else if(Estado.cena_atual == 14){
        cena15();
    }
    else if(Estado.cena_atual == 15){
        cena16();
    }
    else if(Estado.cena_atual == 16){
        cena17();
    }
    else if(Estado.cena_atual == 17){
        cena18();
    }
    else if(Estado.cena_atual == 18){
        cena18();
    }
    else if(Estado.cena_atual == 19){
        cena20();
    }
    else if(Estado.cena_atual == 20){
        cena21();
    }
    else if(Estado.cena_atual == 21){
        cena22();
    }
    else if(Estado.cena_atual == 22){
        cena23();
    }
    else if(Estado.cena_atual == 23){
        cena24();
    }
    else if(Estado.cena_atual == 24){
        cena25();
    }
    else if(Estado.cena_atual == 25){
        cena26();
    }
    else if(Estado.cena_atual == 26){
        cena27();
    }
    else if(Estado.cena_atual == 28){
        cena29();
    }
    else if(Estado.cena_atual == 29){
        cena30();
    }
    else if(Estado.cena_atual == 30){
        cena31();
    }
    else if(Estado.cena_atual == 31){
        cena32();
    }
    else if(Estado.cena_atual == 32){
        cena33();
    }
    else if(Estado.cena_atual == 33){
        cena34();
    }
    else if(Estado.cena_atual == 34){
        cena35();
    }

}

////////////////////////////////////////////////
//ESSA PARTE É SOBRE A TELA DE ACTIONS DO JOGO




function coletar_recursos(){
    
    if(Estado.cena_atual < 11 || Estado.cena_atual > 15  || (Estado.cena_atual >= 14 && Estado.ignorou_prisioneiro == false )){

        var random_number = Math.random();
        if(random_number > 0.1){
            Coisas.madeira+=1;
            Coisas.total+=1;
            alert("Você achou madeira!");
        }
        random_number = Math.random();
        if(random_number > 0.1){
            Coisas.pedra+=1;
            Coisas.total+=1;
            alert("Você achou pedra!");
        }
        random_number = Math.random();
        if(random_number > 0.6){
            alert("Você achou fruta! (comida :D )");
            Coisas.fruta+=1;
            Coisas.total+=1;
        }
        random_number = Math.random();
        if(random_number > 0.9){
            alert("Você achou cogumelo! (comida...? )");
            Coisas.cogumelo+=1;
            Coisas.total+=1;
        }
        random_number = Math.random();
        if(random_number > 0.9){
            alert("Você achou erva!");
            Coisas.erva+=1;
            Coisas.total+=1;
        }
        random_number = Math.random();
        if(random_number > 0.1){
            alert("Você achou carvão! ");
            Coisas.carvao+=1;
            Coisas.total+=1;
        }
        random_number = Math.random();
        if(random_number > 0.95){
            alert("Você achou OURO!!");
            Coisas.ouro+=1;
            Coisas.total+=1;
        }
    }
    else{//aqui é a parte do castelo do gigante
        if(Estado.cena_atual == 11 || Estado.cena_atual == 12){
            alert("Você não acha nada útil que consiga carregar. Tudo ao seu redor é muito gigante.");
        }
        else if(Estado.cena_atual == 15 && Estado.ignorou_prisioneiro == true){
            alert("Você não acha nada útil nesse buraco na parede. Roubar as coisas do morador diante de seu olhar intimidador e vigilante não parece uma boa ideia.");
        }
        else{
            if(Estado.ignorou_prisioneiro){
                random_number = Math.random();
                if(random_number > 0.5){
                    alert("Você achou pequena migalha gigante!");
                    Coisas.migalha_gigante+=1;                
                    Coisas.total+=1;
                }
                else{
                    alert("Você não acha nada útil que consiga carregar. Tudo ao seu redor é muito gigante.");
                }
            }
            else{
                alert("Você não acha nada útil que consiga carregar. Tudo ao seu redor é muito gigante.");
            }
            
        }        
    }

    

    //O carinha perdeu a faca dele por aqui
    if(Estado.cena_atual == 10){
        random_number = Math.random();
        if(random_number > 0.6 && Coisas.faca < 1){
            alert("Você achou uma faca!");
            Coisas.faca+=1;
            Coisas.total+=1;
        }
    }


    if(Estado.ignorou_prisioneiro){// executamos atualiza_tudo exceto se cena_atual for 15
        
        if(Estado.cena_atual == 15){
            Estado.sede = 100;
        }
        else{
            atualiza_tudo();
        }
        //coisas que acontecem se ignoramos o prisioneiro
    }
    else{
        //coisas que acontecem se não ignoramos o prisioneiro
        atualiza_tudo();
    }
    

    
    
    atualizar();

}




///////////////////////////////////////////
///////////////////////////////////////////

function apertou_comer_migalha_gigante(){
    if(Coisas.migalha_gigante > 0 ){
        Coisas.migalha_gigante-= 1;
        Estado.fome+=60;
        Estado.vida+=2;

        //atualiza fome e quantidade de migalha gigante
        atualizar();
    }
    
}

function apertou_comer_fruta(){
    if(Coisas.fruta > 0 ){
        Coisas.fruta-= 1;
        Estado.fome+=30;
        Estado.vida+=1;

        //atualiza fome e quantidade de fruta
        atualizar();
    }
    
}

function apertou_comer_cogumelo(){
    if(Coisas.cogumelo > 0 ){
        alert("Você sente uma intensa dor de barriga");
        Coisas.cogumelo -=1;
        Estado.vida -= 25;
    }
    atualizar();
}


function apertou_comer_carne(){
    if(Coisas.carne > 0 ){
        Coisas.carne -=1;
        Estado.fome +=40;
        Estado.vida+=4;
    }
    atualizar();
}


function apertou_fazer_fogueira(){
   if(Coisas.madeira >= 2 && Coisas.carvao >= 1){
        alert("você fez uma fogueira");
        Coisas.madeira -=2;
        Coisas.carvao -=1;
    }

    document.getElementById("fogueira").style.display = "block";


    Estado.fogueira_ativa = true;
    Estado.fogueira_duracao = 8;

    document.getElementById("fogueira").innerHTML = 'Duração da fogueira: '+ Estado.fogueira_duracao;

    //como demora 1 hora para fazer a fogueira, passa 1 hora. e sempre que passa tempo aumenta fome e sede.
    atualiza_fome_e_sede();
    atualiza_tempo();
    atualizar();

}

////////////////////////
////////////////////////

function apertou_botao_ignorar_prisioneiro(){
    Estado.ignorou_prisioneiro = true;
    delete_ignorar_prisioneiro_button();
}

function apertou_botao_forcar_abertura_da_porta_com_faca(){
    Estado.passou_pela_portinha = true;
    delete_forcar_abertura_da_porta_com_faca_button();
}



////////////////////////////////
//CRIANDO E DELETANDO BOTÕES

//botão comer migalha gigante
function create_comer_migalha_gigante_button(){
    document.getElementById("comer_migalha_gigante").style.display = "block";
}

function delete_comer_migalha_gigante_button(){
    document.getElementById("comer_migalha_gigante").style.display = "none";
}

//botão comer fruta
function create_comer_fruta_button(){
    document.getElementById("comer_fruta").style.display = "block";
}

function delete_comer_fruta_button(){
    document.getElementById("comer_fruta").style.display = "none";
}

//botão comer cogumelo

function create_comer_cogumelo_button(){
    document.getElementById("comer_cogumelo").style.display = "block";
}

function delete_comer_cogumelo_button(){
    document.getElementById("comer_cogumelo").style.display = "none";
}

//botão fazer fogueira

function create_fazer_fogueira_button(){
    if(Estado.cena_atual !=16 || Estado.ignorar_prisioneiro == false)
    document.getElementById("fazer_fogueira").style.display = "block";
}

function delete_fazer_fogueira_button(){
    document.getElementById("fazer_fogueira").style.display = "none";
}

//botão comer carne

function create_comer_carne_button(){
    document.getElementById("comer_carne").style.display = "block";
}

function delete_comer_carne_button(){
    document.getElementById("comer_carne").style.display = "none";
}

////////////////////////////////////
function create_ignorar_prisioneiro_button(){
    document.getElementById("ignorar_prisioneiro").style.display = "block";
}

function delete_ignorar_prisioneiro_button(){
    document.getElementById("ignorar_prisioneiro").style.display = "none";
}

function create_forcar_abertura_da_porta_com_faca_button(){
    document.getElementById("forcar_abertura_da_porta_com_faca").style.display = "block";
}

function delete_forcar_abertura_da_porta_com_faca_button(){
    document.getElementById("forcar_abertura_da_porta_com_faca").style.display = "none";
}



////////////////////////////////////

function create_action(){
    if (Coisas.fruta > 0 ){
        create_comer_fruta_button();
    }
    else{
        delete_comer_fruta_button();
    }

    if(Coisas.cogumelo > 0 ){
        create_comer_cogumelo_button();
    }
    else{
        delete_comer_cogumelo_button();
    }

    if(Coisas.madeira > 1 && Coisas.carvao > 0 ){
        create_fazer_fogueira_button();
    }
    else{
        delete_fazer_fogueira_button();
    }

    if(Coisas.carne > 0){
        create_comer_carne_button();
    }
    else{
        delete_comer_carne_button();
    }

    if(Coisas.migalha_gigante > 0){
        create_comer_migalha_gigante_button();
    }
    else{
        delete_comer_migalha_gigante_button();
    }

    ///////////////////
    ///////////////////
    //nessa cena você pode optar por ignorar o prisioneiro
    if(Estado.cena_atual == 12){
        create_ignorar_prisioneiro_button();
    }
    else{
        delete_ignorar_prisioneiro_button();
    }

    //nessa cena você pode forçar a pequena porta a abrir
    if(Estado.cena_atual == 14 && Estado.ignorou_prisioneiro){
        if(Coisas.faca > 0){
            create_forcar_abertura_da_porta_com_faca_button();
        }        
    }
    else{
        delete_forcar_abertura_da_porta_com_faca_button();
    }

}



///////////////////////////////////////////
///////////////////////////////////////////


function troca_tela(){

    atualizar();

    //tela 1 = tela do texto
    //tela 2 = tela de ações

    if(Estado.tela_atual == 1){
        document.getElementById("tela_grande_texto").style.display = "none";
        document.getElementById("tela_grande_action").style.display = "block";
        Estado.tela_atual = 2;
    }
    else{
        document.getElementById("tela_grande_action").style.display = "none";
        document.getElementById("tela_grande_texto").style.display = "block";
        Estado.tela_atual = 1;}
}


function apertou_botao_voltar_tela_principal(){
    troca_tela();
}

function acao(){
    
    Estado.ja_clicou_em_acao = true;
    troca_tela();
}












////////////////////////////////////////
//CENAS
////////////////////////////////////////

function cena1(){
    texto1();
}

function cena2(){
    Estado.cena_atual = 2;
    texto2();
}

function cena3(){
    Estado.cena_atual = 3;
    texto3();
}

function cena4(){

    document.getElementById("action").style.display = "block";

    Estado.cena_atual = 4;
    texto4();
}

function cena5(){
    Estado.cena_atual = 5;
    texto5();
}

function cena6(){

    //ESSA É A PARTE QUE TEM ÁGUA
    Estado.sede = 100;

    Estado.cena_atual = 6;
    texto6();
  
}

function cena7(){
    Estado.cena_atual = 7;
    texto7();
}

function cena8(){
    Estado.cena_atual = 8;
    texto8();
}

function cena9(){
    Estado.cena_atual = 9;
    texto9();
}

function cena10(){

    //AQUI TAMBÉM TEM ÁGUA
    Estado.sede = 100;    

    Estado.cena_atual = 10;
    texto10();
}

function cena11(){
    Estado.cena_atual = 11;
    texto11();
}



function cena12(){
    Estado.cena_atual = 12;
    texto12();
}

function cena13(){
    Estado.cena_atual = 13;
    texto13();
}

function cena14(){
    Estado.cena_atual = 14;
    texto14();
}

function cena15(){
    Estado.cena_atual = 15;
    texto15();
}

function cena16(){
    Estado.cena_atual = 16;
    texto16();
}

function cena17(){
    Estado.cena_atual = 17;
    texto17();
}

function cena18(){
    Estado.cena_atual = 18;
    texto18();
}

function cena19(){
    Estado.cena_atual = 19;
    texto19();
}

function cena20(){
    Estado.cena_atual = 20;
    texto20();
}

function cena21(){
    Estado.cena_atual = 21;
    texto21();
}

function cena22(){
    Estado.cena_atual = 22;
    texto22();
}

function cena23(){
    Estado.cena_atual = 23;
    texto23();
}

function cena24(){
    Estado.cena_atual = 24;
    texto24();
}

function cena25(){
    Estado.cena_atual = 25;
    texto25();
}

function cena26(){
    Estado.cena_atual = 26;
    texto26();
}

function cena27(){
    Estado.cena_atual = 27;
    texto27();
}

function cena28(){
    Estado.cena_atual = 28;
    texto28();
}

function cena29(){
    Estado.cena_atual = 29;
    texto29();
}

function cena30(){
    Estado.cena_atual = 30;
    texto30();
}

function cena31(){
    Estado.cena_atual = 31;
    texto31();
}

function cena32(){
    Estado.cena_atual = 32;
    texto32();
}

function cena33(){
    Estado.cena_atual = 33;
    texto33();
}

function cena34(){
    Estado.cena_atual = 34;
    texto34();
}

function cena35(){
    Estado.cena_atual = 35;
    texto35();
}

function cena36(){
    Estado.cena_atual = 36;
    texto36();
}

function cena37(){
    Estado.cena_atual = 37;
    texto37();
}

function cena38(){
    Estado.cena_atual = 38;
    texto38();
}

function cena39(){
    Estado.cena_atual = 39;
    texto39();
}

function cena40(){
    Estado.cena_atual = 40;
    texto40();
}

function cena41(){
    Estado.cena_atual = 41;
    texto41();
}

function cena42(){
    Estado.cena_atual = 42;
    texto42();
}

function cena43(){
    Estado.cena_atual = 43;
    texto43();
}

function cena44(){
    Estado.cena_atual = 44;
    texto44();
}

function cena45(){
    Estado.cena_atual = 45;
    texto45();
}

function cena46(){
    Estado.cena_atual = 46;
    texto46();
}

function cena47(){
    Estado.cena_atual = 47;
    texto47();
}

function cena48(){
    Estado.cena_atual = 48;
    texto48();
}

function cena49(){
    Estado.cena_atual = 49;
    texto49();
}

function cena50(){
    Estado.cena_atual = 50;
    texto50();
}

function cena51(){
    Estado.cena_atual = 51;
    texto51();
}

function cena52(){
    Estado.cena_atual = 52;
    texto52();
}

function cena53(){
    Estado.cena_atual = 53;
    texto53();
}

function cena54(){
    Estado.cena_atual = 54;
    texto54();
}

function cena55(){
    Estado.cena_atual = 55;
    texto55();
}

function cena56(){
    Estado.cena_atual = 56;
    texto56();
}

function cena57(){
    Estado.cena_atual = 57;
    texto57();
}

function cena58(){
    Estado.cena_atual = 58;
    texto58();
}

function cena59(){
    Estado.cena_atual = 59;
    texto59();
}



function cena60(){
    Estado.cena_atual = 60;
    texto60();
}

function cena61(){
    Estado.cena_atual = 61;
    texto61();
}

function cena62(){
    Estado.cena_atual = 62;
    texto62();
}

function cena63(){
    Estado.cena_atual = 63;
    texto63();
}

function cena64(){
    Estado.cena_atual = 64;
    texto64();
}

function cena65(){
    Estado.cena_atual = 65;
    texto65();
}

function cena66(){
    Estado.cena_atual = 66;
    texto66();
}

function cena67(){
    Estado.cena_atual = 67;
    texto67();
}


function cena68(){
    Estado.cena_atual = 68;
    texto68();
}

function cena69(){
    Estado.cena_atual = 69;
    texto69();
}

////////////////////////////////////////
//TEXTOS
////////////////////////////////////////

function texto1(){
    document.getElementById("texto").innerHTML = 'Você acordou em uma floresta densa e funesta. Você ouve sons de animais selvagens. Suas opções são escassas.';
}

function texto2(){
    Estado.texto_atual = 2;
    document.getElementById("texto").innerHTML = 'Os barulhos se intensificam. Você se pergunta se encontrará comida e água facilmente.';
}

function texto3(){
    Estado.texto_atual = 3;
    document.getElementById("texto").innerHTML = 'O tempo passa. A fome e a sede te atormentam. Algo prontamente toma forma, para expandir o seu horizonte de possibilidades.';
}

function texto4(){
    Estado.texto_atual = 4;
    document.getElementById("texto").innerHTML = 'É o botão de AÇÃO. Com ele você pode usar o seu tempo para criar meios de escapar da morte.';
}

function texto5(){
    Estado.texto_atual = 5;

    if (Estado.ja_clicou_em_acao){
        if(Coisas.total > 0 ){
            document.getElementById("texto").innerHTML = 'Após gastar algum tempo coletando recursos, você segue a sua jornada. A floresta permanece densa e intransponível. O único caminho viável é seguir em frente. ';
        }
        else{
            document.getElementById("texto").innerHTML = 'Você prossegue com a sua jornada. A floresta permanece densa e intransponível. A única passagem viável é o caminho em sua frente.';
        }
        
    }
    else{
        document.getElementById("texto").innerHTML = 'Após simplesmente ignorar o importantíssimo botão de AÇÃO, você segue em sua jornada. A floresta permanece densa e intransponível. A única passagem viável é o caminho em sua frente.';
    }
    
} 

function texto6(){
    Estado.texto_atual = 6;
    document.getElementById("texto").innerHTML = 'Você chega em um lago de água cristaliza. Enquanto permanecer por aqui, você não terá sede.';
}


function texto7(){
    Estado.texto_atual = 7;
    document.getElementById("texto").innerHTML = 'Você se afasta do lago. Chega de descanso!';
}


//////O CASTELO DO GIGANTE

function texto8(){
    Estado.texto_atual = 8;
    document.getElementById("texto").innerHTML = 'A medida que você avança pela trilha estreita, a luz do sol começa a encontrar passagem por entre os espaços das copas das árvores. O farfalhar das folhas parece um prenúncio de que algo interessante te espera adiante.';


}

function texto9(){
    Estado.texto_atual = 9;
    document.getElementById("texto").innerHTML = 'Quando a vegetação para de bloquear sua vista, você deslumbra, a algumas centenas de metros, uma casa realmente gigantesca.';
}

function texto10(){
    Estado.texto_atual = 10;
    document.getElementById("texto").innerHTML = 'Você chega na entrada da casa. Você parece uma pequena formiguinha diante da estrutura colossal em sua frente. Você vê um balde com água por perto. O balde, como é de se esperar, também é gigante. Você se esforça para escalá-lo e pegar um pouco de água. Enquanto permanecer por aqui, você não terá sede.';
}


function texto11(){
    Estado.texto_atual = 11;
    document.getElementById("texto").innerHTML = 'Movido pela curiosidade, você atravessa a fresta da porta gigante. Você se vê diante de uma cozinha gigante, com gavetas, fogão e geladeira gigantes, e uma mesa gigante no centro.';
}

function texto12(){
    Estado.texto_atual = 12;
    document.getElementById("texto").innerHTML = 'Explorando o local, você chega na estante de temperos. Há vários frascos com conteúdos exóticos, desde coisas comuns como pimentão (gigante), até aranhas e centopeias. Mas um frasco específico chama sua atenção. Dentro dele, reside um homem, de vestes pomposas e constituição robusta. Ele olha distraidamente para longe. Quando te vê, ele te encara com olhar assustado, batendo no vidro.';
}

function texto13(){
    Estado.texto_atual = 13;
    if(Estado.ignorou_prisioneiro){
        document.getElementById("texto").innerHTML = 'Você se afasta da estante de temperos gigante e avança para o próximo cômodo. Você chega em uma sala arrumada e aconchegante. Sua atenção é rapidamente tomada pelo gigante que dorme em uma poltrona perto da lareira. É melhor não incomodá-lo.';
    }
    else{
        document.getElementById("texto").innerHTML = 'Você escala a prateleira gigante com destreza, e alcança o frasco onde o homem está preso. O homem, afoito, gesticula para cima, para a tampa. Você logo compreende. Sem muita dificuldade, você abre o frasco. A tampa estava frouxa, e abri-la por fora não é muito difícil. <span style = "color: blue; font-size: x-large;"> <br> ???: Olá, amigo. Você parece tão perdido quanto eu! A sua cara é de alguém que acordou no meio do nada sem saber sobre nada do que está acontecendo, devo admitir. Ah, claro... Permita-me me apresentar. O meu nome é Erasto Dragomir, príncide do clã Osso de Pedra. Estou imensamente agradecido por resgatar-me. Como vim parar aqui? É uma longa história... No meu clã, para herdar o trono, é preciso realizar pelo menos uma das três grandes provas. Eu naturalmente... Desculpe, é melhor sairmos daqui logo meu caro amigo, antes que os moradores da casa apareçam.</span> <br> Vocês descem da prateleira. Você acompanha Erasto, furtivamente, em direção à porta dos fundos da casa. <br> <span style = "color:blue; font-size: x-large;">Erasto Dragomir: Por aqui, meu destemido amigo. A travessia por esta direção me parece desprovida de perigos alarmantes. </span> ';
    }
}

function texto14(){
    Estado.texto_atual = 14;
    if(Estado.ignorou_prisioneiro){
        
        document.getElementById("texto").innerHTML = 'Você passa para o próximo cômodo. É um grande depósito, com enormes caixas amontoadas. Observando as caixas atentamente, você nota que elas estão praticamente todas cheias de frascos vazios. Outra coisa chama a sua atenção nesse cômodo. Uma pequena porta em uma das paredes. Uma porta... Do seu tamanho! Infelizmente a porta parece trancada. Para além do que você avista no interior do cômodo, há na parede uma janela. Você consegue enxergar vagamente a vegetação lá fora através do vidro sujo e embaçado. Além disso, você pode ouvir sons de latidos estrondosos vindo do outro lado. Há uma porta gigante em sua frente, levando a parte de fora da casa. Você consegue passar pela fresta.';

    }
    else{
        document.getElementById("texto").innerHTML = 'Você e Erasto Dragomir chegam no próximo cômodo. <br> <span style =  "color: blue; font-size: x-large;" > Erasto Dragomir: Faça silêncio. Sei que o seu anseio por aventuras é imenso, mas o perigo pode ser maior! </span> <br> Vocês chegam em uma sala arrumada e aconchegante. Sua atenção é rapidamente tomada pelo gigante que dorme em uma poltrona perto da lareira. Erasto segue em frente e gesticula para que você o acompanhe. Vocês chegam em um depósito com enormes caixas amontoadas. Antes que você absorva tudo que está diante de você, Erasto puxa o seu braço. <br> <span style = "color:blue; font-size: x-large;" > Erasto Dragomir: Rápido. Por aqui. Antes que a fera sinta o nosso cheiro!</span> <br> Erasto empurra uma caixa em frente a parede para longe, revelando uma rachadura na parede por onde vocês conseguem passar. Ao atravessar a passagem vocês chegam em um ambiente cercado, com árvores gigantes, mas também árvores comuns, e uma piscina gigante. Enquanto ficar por aqui, você não terá sede. Vocês parecem estar no ponto em que o mundo gigante e o mundo não gigante se cruzam. De repente você se assusta com um estrondoso som de latidos. Do outro lado da cerca, um cachorro gigante persegue um guaxinim gigante. <br> <span style = "color: blue; font-size: x-large;"> Erasto Dragomir: Acalme os ânimos, caro amigo aventureiro descuidado. Vamos permanecer deste lado da cerca. Agora que estamos mais afastados da confusão, podemos conversar com calma. E caso esteja faminto, parece haver frutas acessíveis por aqui. </span> ';
    }
}

function texto15(){
    Estado.texto_atual = 15;
    if(Estado.ignorou_prisioneiro){
        if(Estado.passou_pela_portinha){
            document.getElementById("texto").innerHTML = 'Com algum esforço, você consegue forçar a portinha a abrir, pressionando a lâmina da faca no buraco da fechadura. Lá dentro há, ao que lhe parece, um pequeno refúgio aconchegante de alguma criatura do seu tamanho. Há uma mesa de madeira redonda, com imagens de formigas esculpidas, rodeada por quatro cadeiras. Em um canto há uma estante com livros. Nas paredes há velas espalhadas. E você nota uma armadura e uma espada largados em uma extremidade do cômodo. É uma bela casa cavada na parede da casa do gigante. Por fim, há um corredor que leva, possivelmente, a outros cômodos do lugar. Você sente um cheiro agradável de comida. Após alguns segundos, o cheiro ganha intensidade e um humano aparece carregando um prato de sopa. Ele te encara com assombro. <br> <span style = "color: orange; font-size: x-large;">???: Quem é você?? O que faz aqui, intruso? Com abriu a porta?? </span> <br> O homem, um jovem com a feição de alguém que já deu a volta ao mundo engatinhando de olhos vendados, suspira. Ele se senta na cadeira, depositando o prato na mesa; mas sem em nenhum momento tirar os olhos de você. <br> <span style = "color: orange; font-size: x-large"> ???: Não tente nenhuma gracinha. Eu estou preparado para a intromissão de convidados indesejados. Mas... Se você de fato só está aqui por acaso, e parece que é o caso, pelo seu olhar aturdido, sente-se. Fique a vontade. Eu sou um bom anfitrião, quando meus convidados não abusam da sorte. Tem água na minha cozinha, convenientemente, é onde um cano da casa do gigante está gotejando. Você não vai passar sede enquanto permanecer por aqui. Vou comer a minha refeição em silêncio. Se estiver faminto, sinto muito. Só tenho o bastante para mim no momento. Daqui a uma hora nos falamos. </span>';    
        
        }
        else{
           document.getElementById("texto").innerHTML = 'Você atravessa a fresta da porta e chega no quintal da casa gigante. Após caminhar alguns passos você é surpreendido por um cão gigante, que rapidamente nota a sua presença. Antes que você pudesse reagir, ele avança em sua direção e você é pisoteado. Você morre instantaneamente. <br> <br> <br> FIM.';
           Estado.final = true; 
           atualizar();
        }
    }  
    else{

        document.getElementById("texto").innerHTML = '<span style = "color: blue; font-size: x-large" > Erasto Dragomir: Eu estou deveras com fome. E as frutas daquela árvore ali me parecem bastante apetitosas. Então permita-me me ausentar por alguns momentos.</span> <br> Erasto Dragomir fica alguns minutos catando e comendo frutas das árvores de tamanho normal próximas, e então retorna.';
        document.getElementById("texto").innerHTML += '<br> <span style = "color: blue; font-size: x-large"> Erasto Dragomir: Antes de eu retornar ao meu clã e recompensá-lo devidamente por me resgatar, permita-me falar um pouco sobre mim. Eu nasci  no clã Osso de Pedra, filho de  Amélia Osso de Pedra e Drake Osso de Pedra. Nós antigamente éramos o clã das Terras Quentes. Mas um terrível acontecimento abalou a nossa vida pacata e pacífica. Há 2000 anos, povos vindos do clã do Norte invadiram as nossas terras! Nosso povo lutou bravamente, mas não resistiu. E acabamos expulsos para terras menos prósperas. Há 300 anos unimos as forças dos nossos melhores soldados para tentar reconquistar nossas terras, mas não obtivemos sucesso; e apenas provocamos a ira do povo do clã do Norte. Eles então passaram a, frequentemente, enviar espiões a assassinos para provocar o caos e desestabilizar o clã Osso de Pedra. Sabe por que nos chamamos clã Osso de Pedra, amigo? É porque após a invasão, há 3000 anos, a minha família, os Osso de Pedra, foram os únicos que sobreviveram, e então nós reconstruímos tudo o que foi destruído. AH... Eu devo estar te aborrecendo com essas histórias, não? Mas é importante que eu te conte essas coisas. Você acabou de resgatar o príncipe Erasto Dragomir Osso de Pedra, precisa conhecer um pouquinho da história do nosso povo, não? Eu sei que você deve estar se perguntando o que eu estava fazendo na casa do gigante. Bem, nós criamos, há 200 anos, as três grandes provas. Feitos que alguém deve cumprir para provar a sua coragem no nosso clã, e que todo herdeiro do trono precisar realizar: Prova 1: capturar o temido gigante que atormenta as vilas da região. Como você deve ter percebido, eu me empenhei nessa árdua missão, mas não obtive sucesso. Prova número 2: capturar algum dos 70 famosos assassinos do clã do Norte. Prova número 3: Expulsar o clã do Norte das nossas terras. Naturalmente, a prova 2 é a mais fácil, e a única que realmente pôde ser cumprida desde que as 3 grandes provas foram criadas. Eu me aventurei na tentativa de cumprir a tarefa 1; mas tinha esperanças de me deparar com um temido assassino que, pelo que ouvi, está nas proximidades daqui. Nós temos muito o que conversar, mas creio que poderemos fazê-lo mais a vontade quando chegarmos no... </span>';
   
        if(Estado.lobos_amigos < 1){
            document.getElementById("texto").innerHTML+= '<br>De repente uma sombra fugaz os atravessa, e Erasto Dragomir solta um grito agonizante, antes de cair sem vida, com uma mancha de sangue se formando sob seu peito. Antes que você tivesse tempo de processar o que aconteceu, você sente uma lâmina atravessar a sua garganta, e cai desfalecido. Em seu últimos instantes de vida, você vê uma figura encapuzada te lançar um olhar de ódio profundo e se afastar. <br><br><br> FIM';
            Estado.final = true;
            atualizar();
        }
        else{
            document.getElementById("texto").innerHTML += '<br>De repente uma sombra fugaz os atravessa, e você sente um arrepio mórdibo e agourento. Você percebe uma figura encapuzada prestes a atravessar uma agada no peito de Erasto, e sabe naquele instante que não é capaz de se mover rápido o bastante para evitar o golpe fatal, e que provalvemnte será o próximo alvo. Essa é a sua intuição precisa, nesses breves, tensos, momentos, em que o tempo parece desacelerar. Mas antes que o evento tome forma, uma figura veloz salta ágilmente e morde a figura encapuzada no pescoço, a derrudando. Os dois engajam em uma briga sangrenta, até que a figura encapuzada se afasta, ferida, atravessa a vegetação e pula a cerca gigante, abandonando o terreno do gigante e a tentativa de assassinato. A fera que afugentou o assassino se volta para você. Ela é familiar: É o lobo que você alimentou recentemente. Ele se senta pacientemente ao seu lado. <span style = "color:blue; font-size: x-large;">Erasto Dragomir: Parece que o seu amigo nos salvou, hein... Uau... Bem, acho que é uma boa hora para irmos para o clã. Estou ouvindo o cachorro gigante roncar daqui. Vamos passar por baixo da cerca e estaremos fora do mundo gigante, e há apenas uns 20 quilômetros do clã Osso de Pedra. Acho que vou ter que te recompensar duas vezes por salvar a minha vida! </span> <br> Você, Erasto Dragomir, e seu novo mascote seguem a estrada, sem mais imprevistos desagradáveis. Você passa o resto da sua vida vivendo uma vida de luxo no clã Osso de Pedra, onde Erasto Dragomir te presenteou com terras férteis e grandes quantias de ouro. <br><br><br>FIM';
            Estado.final = true;
            atualizar();
        }
    }  
}    

function texto16(){
    Estado.texto_atual = 16;
    if(Estado.ignorou_prisioneiro){
        if(Estado.passou_pela_portinha){
            if(Estado.morador_do_buraco_nota_fogueira){                
                document.getElementById("texto").innerHTML = '<span style = "color: orange; font-size: x-large;" > ???: O que você está fazendo??? </span> <br> O homem prontamente apaga a fogueira. <br> <span style = "color:orange; font-size: x-large" > ???: Quer botar fogo na minha casa? Cada maluco piromaníaco que me aparece...Bem... Acho que é hora de nos apresentarmos. O meu nome é Milo. Eu nasci e cresci no clã do Norte. Você imagina o que eu tenho passado, né... Não? Ora, ora... Acho que vou ter que te ensinar algumas coisas sobre a história do meu povo. Senta aí e escuta. Há 3000 anos, nossas terras foram acometidas por uma severa tempesdade de neve. Tivemos que fugir para o sul, onde nos estabelecemos perto do clã Osso de Pedra. Nossas relações com esse clã eram diplomáticas e pacíficas, até que eles decidiram expandir seu território e tomar as nossas terras. A guerra começou, e, juntando os esforços de todo o nosso povo, nós vencemos; mas saímos arruinados, e demoramos séculos para reconstruir tudo o que perdemos. Então, há 300 anos, o clã do Osso de Pedra decidiu retomar o seu plano de conquista; e de tempos em tempos lança uma invasão ao meu povo. Recentemente os espiões do meu clã descobriram algo curioso sobre o clã Osso de Pedra. Eles tem algo que chamam de "as três grandes provas". Qualquer um que cumprir qualquer uma dessas tarefas recebe um título de nobreza e se torna um guerreiro renomado no clã Osso de Pedra. E qualquer príncipe do clã tem o dever de cumprir uma das 3 tarefas, para poder se tornar rei. As primeiras duas tarefas são espantosas, mas previsíveis: Primeira prova: Capturar o rei do clã do Norte. Segunda prova: Capturar 50 homens do clã do Norte. Como você deve imaginar, nessa brincadeira deles vários dos membros do nosso clã viraram escravos! Mas a terceira prova é a mais curiosa: matar o gigante dessa casa! Eu honestamente duvido que eles consigam, mas não duvido nem um pouco que tentem. Meus colegas compartilham dessa opinião, e então eu fui encarregado de ficar aqui por perto, para garantir que, caso Erasto Dragomir, o príncipe do clã Osso de Pedra, aparecesse, ele não saísse vivo. Como você parece um esfomeado e eu não tenho nada no estoque, vamos lá fora, onde tem algumas árvores normais com frutas.</span> <br> Você e Milo deixam o esconderijo. Milo te indica uma passagem para uma zona cercada do quintal da casa, passando por uma rachadura na parede. Embora ainda seja uma parte da casa do gigante ';
                document.getElementById("texto").innerHTML += ' há algumas árvores e plantas de tamanho normal por perto. Há também uma piscina gigante. Enquanto permanecer por aqui, você não sentirá sede.';
            }
            else{
                document.getElementById("texto").innerHTML = '<span style = "color: orange; font-size: x-large" > ???: Bem... Acho que é hora de nos apresentarmos. O meu nome é Milo. Eu nasci e cresci no clã do Norte. Você imagina o que eu tenho passado, né... Não? Ora, ora... Acho que vou ter que te ensinar algumas coisas sobre a história do meu povo. Senta aí e escuta. Há 3000 anos, nossas terras foram acometidas por uma severa tempesdade de neve. Tivemos que fugir para o sul, onde nos estabelecemos perto do clã Osso de Pedra. Nossas relações com esse clã eram diplomáticas e pacíficas, até que eles decidiram expandir seu território e tomar as nossas terras. A guerra começou, e, juntando os esforços de todo o nosso povo, nós vencemos; mas saímos arruinados, e demoramos séculos para reconstruir tudo o que perdemos. Então, há 300 anos, o clã do Osso de Pedra decidiu retomar o seu plano de conquista; e de tempos em tempos lança uma invasão ao meu povo. Recentemente os espiões do meu clã descobriram algo curioso sobre o clã Osso de Pedra. Eles tem algo que chamam de "as três grandes provas". Qualquer um que cumprir qualquer uma dessas tarefas recebe um título de nobreza e se torna um guerreiro renomado no clã Osso de Pedra. E qualquer príncipe do clã tem o dever de cumprir uma das 3 tarefas, para poder se tornar rei. As primeiras duas tarefas são espantosas, mas previsíveis: Primeira prova: Capturar o rei do clã do Norte. Segunda prova: Capturar 50 homens do clã do Norte. Como você deve imaginar, nessa brincadeira deles vários dos membros do nosso clã viraram escravos! Mas a terceira prova é a mais curiosa: matar o gigante dessa casa! Eu honestamente duvido que eles consigam, mas não duvido nem um pouco que tentem. Meus colegas compartilham dessa opinião, e então eu fui encarregado de ficar aqui por perto, para garantir que, caso Erasto Dragomir, o príncipe do clã Osso de Pedra, aparecesse, ele não saísse vivo. Como você parece um esfomeado e eu não tenho nada no estoque, vamos lá fora, onde tem algumas árvores normais com frutas.</span> <br> Você e Milo deixam o esconderijo. Milo te indica uma passagem para uma zona cercada do quintal da casa, passando por uma rachadura na parede. Embora ainda seja uma parte da casa do gigante ';
                document.getElementById("texto").innerHTML += ' há algumas árvores e plantas de tamanho normal por perto.  Há também uma piscina gigante. Enquanto permanecer por aqui, você não sentirá sede.';
            }
        }        
    }    
}
    
function texto17(){
    Estado.texto_atual = 17;
    document.getElementById("texto").innerHTML = '<span style = "color: orange; font-size: x-large">Milo: Ei, deixe-me ver essa faca que está com você... Você... Encontrou ela por aqui, foi? Meu Deus! É... ha,ha,ha... Nossa... Não é possível que... Cara, quando eu tinha 7 anos eu tinha uma amiga que morava numa vila aqui perto. Eu tinha o hábito de me afastar de casa e me aventurar em terras desconhecidas, e então conheci ela, e logo viramos melhores amigos. Ela me contava dos boatos de um gigante que capturava as pessoas da vila e as colocava em potes, para fazer sabe-se lá o que. Eu disse que não acreditava, que ninguém tinha visto o gigante mesmo ele sendo... Bem, gigante. Então ela me deu essa faca e disse que se quisesse provar que tenho coragem eu iria até a casa do gigante, que ficava em tal direção, matava o gigante com a faca e salvava as pessoas presas nos potes. Eu, achando que era tudo uma grande mentira, fui na direção que ela falou. Quando eu vi que existia uma casa gigante de verdade, fiquei apavorado e saí correndo, e acabei perdendo a faca. Os próximos anos foram tranquilos; o gigante aparentemente havia deixado as pessoas em paz; eu e minha amiga nos encontrávamos direto, e falávamos sobre minha aventura. Quando tínhamos 16 anos recebi a notícia de que ela tinha sido morta por um urso, fiquei desolado. Agora você aparece com essa faca, a exata faca que ela me deu... A faca que ela me deu e eu perdi... Muito obrigado...</span><br> Milo te dá um forte abraço. <br><span style = "color:orange; font-size: x-large"> Milo: Esse é o último dia da minha patrulha pela casa do gigante. Eu já estava voltando para as minhas terras. Eu tenho muito ouro, e posso recompensá-lo por encontrar a minha faca. E se quiser trabalhar para o clã do norte, terá minha recomendação. Cara... Você não imagina a felicidade que eu tô de encontrar a faca... Eu estou partindo, então. Você deve ter assuntos para tratar aqui com o gigante, né? Não? Entrou na casa só por curiosidade mesmo? Eu entendo, entendo mesmo. Eu já fui muito maluco. Mas eu estou indo; já juntei muitos suprimentos. Você vem? Ótimo. Então vamos. </span>';
    document.getElementById("texto").innerHTML +='<br> Você e Milo partem em direção do clã do Norte, onde você recebe a sua recompensa em ouro, e inicia uma carreira própera, como soldado do clã do norte. <br><br><br>FIM';
    Estado.final = true;
    atualizar();
}





//Como você parece um esfomeado e eu não tenho nada no estoque, vamos lá fora, onde tem algumas árvores normais com frutas.






//FAZER
//incluir ataque com faca em luta com lobo/ urso caso o jogador tenha faca (se tiver ursos e lobos mais pra frente)






