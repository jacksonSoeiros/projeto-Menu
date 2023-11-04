$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },

};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

cardapio.metodos = {
  // obter a lista do cardapio //
  obterItensCardapio: (categorias = "burgers", viewPlus = false) => {
    var filtro = MENU[categorias];
    console.log(filtro);

    if (!viewPlus) {
      $("#itens-cardapio").html("");
      $("#btn-verMais").removeClass("hidden");
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id);

      //btn ver mais foi chamado
      if (viewPlus && i >= 8 && i < 12) {
        $("#itens-cardapio").append(temp);
      }
      //pagina inicial
      if (!viewPlus && i < 8) {
        $("#itens-cardapio").append(temp);
      }
    });

    //remover o btn ativo
    $(".container-menu a").removeClass("active");

    //add o menu para aativa
    $("#menu-" + categorias).addClass("active");
  },

  //chamar o btn verMais
  viewPlus: () => {
    var ativo = $(".container-menu a.active").attr("id").split("menu-")[1]; //[menu-][Burges]
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btn-verMais").addClass("hidden");
  },

  //remover um item
  minusUnit: (id) => {
    let UnitsAtual = parseInt($("#units-" + id).text());

    if (UnitsAtual > 0) {
      $("#units-" + id).text(UnitsAtual - 1);
    }
  },

  //adicionar mais um item
  addUnit: (id) => {
    let UnitsAtual = parseInt($("#units-" + id).text());

    $("#units-" + id).text(UnitsAtual + 1);
  },

  //adicionar ao carrinho os itens
  addCarrinho: (id) => {

    let UnitsAtual = parseInt($("#units-" + id).text());

    if (UnitsAtual > 0) {
      //obter a categoria ativa
      var categoria = $(".container-menu a.active").attr("id").split("menu-")[1];

      //obeter lista de itens
      let filtro = MENU[categoria];

      //obter o item
      let item = $.grep(filtro, (e,i) => {return e.id == id});


      if (item.length > 0) {

        //verificar se já existe o item
        let existe = $.grep(MEU_CARRINHO, (l,x) => {return l.id == id});

        //caso exista altera quantidade
        if(existe.length >0) {
          let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + UnitsAtual;
        }
        //caso não exista, add ele
        else{
          item[0].qntd = UnitsAtual;
          MEU_CARRINHO.push(item[0]);
        }


        //a mensagem que será exibida
        cardapio.metodos.mensagens('Item adicionado ao carrinho', 'green');


        //zerar a quandidade dos itens
        $("#units-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();

      }

    }

  },

  //atualizar valores do carrinho
  atualizarBadgeTotal: () => {


      var total = 0;

      $.each(MEU_CARRINHO, (i, e) => {
        total += e.qntd
      })

      if (total > 0) {
        $(".btn-carrinho").removeClass('hidden');
        $(".container-total-carrinho").removeClass('hidden');
      }
      else {
        $(".btn-carrinho").addClass('hidden');
        $(".container-total-carrinho").addClass('hidden');
      }

      $(".badge-total-carribho").html(total);
  },


  //abrir o carrinho
  abrirCarrinho: (abrir) => {

    if (abrir ) {
      $("#modalCarrinho").removeClass('hidden');
    }
    else{
      $("#modalCarrinho").addClass('hidden')
    }

  },

  //mensagem de itens adicionado ao carrinho
  mensagens: (texto, cor = 'red', tempo = 3000) => {
    

    //criando ID aleatorio
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class=" animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-"+ id).removeClass('fadeInDown');
      $("#msg-"+ id).addClass('fadeOutUp');
      setTimeout(() => {
        $("#msg-"+ id).remove();
      },800);
    }, tempo);
  },


};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
        <div class="card card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}"/>
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${nome}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$\${preco}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.minusUnit('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="units-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.addUnit('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.addCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
          </div>
        </div>
    </div>
    `,
};
