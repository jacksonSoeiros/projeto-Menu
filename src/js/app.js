$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 7;

var INSTAGRAM_EMPRESA = 'https://www.instagram.com/soeiro.jackson/';
var FACEBOOK_EMPRESA = 'https://www.facebook.com/soeiro.jackson/';
var CELULAR_EMPRESA = '5591983645949';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
    cardapio.metodos.carregarSocialInstagram();
    cardapio.metodos.carregarSocialFacebook();
    cardapio.metodos.carregarSocialWhatsApp();
    cardapio.metodos.carregarBntLigar();
    cardapio.metodos.carregarBtnReserva();
    
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
      var categoria = $(".container-menu a.active")
        .attr("id")
        .split("menu-")[1];

      //obeter lista de itens
      let filtro = MENU[categoria];

      //obter o item
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        //verificar se já existe o item
        let existe = $.grep(MEU_CARRINHO, (l, x) => {
          return l.id == id;
        });

        //caso exista altera quantidade
        if (existe.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd =
            MEU_CARRINHO[objIndex].qntd + UnitsAtual;
        }
        //caso não exista, add ele
        else {
          item[0].qntd = UnitsAtual;
          MEU_CARRINHO.push(item[0]);
        }

        //a mensagem que será exibida
        cardapio.metodos.mensagens("Item adicionado ao carrinho", "green");

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
      total += e.qntd;
    });

    if (total > 0) {
      $(".btn-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    } else {
      $(".btn-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }

    $(".badge-total-carribho").html(total);
  },

  //abrir o carrinho
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $("#modalCarrinho").removeClass("hidden");
      cardapio.metodos.carregarCarrinho();
    } else {
      $("#modalCarrinho").addClass("hidden");
    }
  },

  //alterar os textos e exibe os bnt etapas
  carregarEtapas: (etapa) => {
    switch (etapa) {
      case 1:
        $("#lblTituloEtapa").text("Seu Carrinho:");
        $("#itens-carrinho").removeClass("hidden");
        $("#local-entrega").addClass("hidden");
        $("#resumo-carrinho").addClass("hidden");

        $(".etapa").removeClass("active");
        $(".etapa1").addClass("active");

        $("#btnEtapaPedido").removeClass("hidden");
        $("#btnEtapaEndereco").addClass("hidden");
        $("#btnEtapaResumo").addClass("hidden");
        $("#btnVoltar").addClass("hidden");

        break;

      case 2:
        $("#lblTituloEtapa").text("Endereço de Entrega:");
        $("#itens-carrinho").addClass("hidden");
        $("#local-entrega").removeClass("hidden");
        $("#resumo-carrinho").addClass("hidden");

        $(".etapa").removeClass("active");
        $(".etapa1").addClass("active");
        $(".etapa2").addClass("active");

        $("#btnEtapaPedido").addClass("hidden");
        $("#btnEtapaEndereco").removeClass("hidden");
        $("#btnEtapaResumo").addClass("hidden");
        $("#btnVoltar").removeClass("hidden");

        break;

      case 3:
        $("#lblTituloEtapa").text("Resumo do Pedido:");
        $("#itens-carrinho").addClass("hidden");
        $("#local-entrega").addClass("hidden");
        $("#resumo-carrinho").removeClass("hidden");

        $(".etapa").removeClass("active");
        $(".etapa1").addClass("active");
        $(".etapa2").addClass("active");
        $(".etapa3").addClass("active");

        $("#btnEtapaPedido").addClass("hidden");
        $("#btnEtapaEndereco").addClass("hidden");
        $("#btnEtapaResumo").removeClass("hidden");
        $("#btnVoltar").removeClass("hidden");

        break;

      default:
        break;
    }
  },

  //bnt de voltar etapas
  voltarEtapas: () => {
    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapas(etapa - 1);
  },

  //carregar lista de items do carrinho
  carregarCarrinho: () => {
    cardapio.metodos.carregarEtapas(1);

    if (MEU_CARRINHO.length > 0) {
      $("#itens-carrinho").html("");

      $.each(MEU_CARRINHO, (i, e) => {
        let temp = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img)
          .replace(/\${nome}/g, e.name)
          .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","))
          .replace(/\${id}/g, e.id)
          .replace(/\${qntd}/g, e.qntd);

        $("#itens-carrinho").append(temp);

        //validando o último item do carrinho
        if (i + 1 == MEU_CARRINHO.length) {
          cardapio.metodos.carregarValoresCarrinho();
        }
      });
    } else {
      $("#itens-carrinho").html(
        '<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu Carrinho está Vazio!</p>'
      );
      cardapio.metodos.carregarValoresCarrinho();
    }
  },

  //diminuir quantidade dos itens carrinho
  minusUnitCarrinho: (id) => {
    let UnitsAtual = parseInt($("#units-carrinho-" + id).text());

    if (UnitsAtual > 1) {
      $("#units-carrinho-" + id).text(UnitsAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, UnitsAtual - 1);
    } else {
      cardapio.metodos.removerItemCarrinho(id);
    }
  },

  //aumenta quantidade dos itens carrinho
  addUnitCarrinho: (id) => {
    let UnitsAtual = parseInt($("#units-carrinho-" + id).text());
    $("#units-carrinho-" + id).text(UnitsAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, UnitsAtual + 1);
  },

  //Bnt remover item carrinho
  removerItemCarrinho: (id) => {
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {
      return e.id != id;
    });

    cardapio.metodos.carregarCarrinho();
    cardapio.metodos.atualizarBadgeTotal();
  },

  //atualizar o carrinho
  atualizarCarrinho: (id, qntd) => {
    let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
    MEU_CARRINHO[objIndex].qntd = qntd;

    //atualizar o bnt badge carrinho
    cardapio.metodos.atualizarBadgeTotal();

    //atualiza os valores em reias total do carrinho
    cardapio.metodos.carregarValoresCarrinho();
  },

  //carrego os valore Subtotal , Entrega e Total
  carregarValoresCarrinho: () => {
    VALOR_CARRINHO = 0;

    $("#lblSubeTotal").text("R$ 0,00");
    $("#lblValorEntrega").text("+ R$ 0,00");
    $("#lblValorTotal").text("R$ 0,00");

    $.each(MEU_CARRINHO, (i, e) => {
      VALOR_CARRINHO += parseFloat(e.price * e.qntd);

      if (i + 1 == MEU_CARRINHO.length) {
        $("#lblSubeTotal").text(
          `R$ ${VALOR_CARRINHO.toFixed(2).replace(".", ",")}`
        );
        $("#lblValorEntrega").text(
          `+ R$ ${VALOR_ENTREGA.toFixed(2).replace(".", ",")}`
        );
        $("#lblValorTotal").text(
          `R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace(".", ",")}`
        );
      }
    });
  },

  //carregar a etapa endereços
  carregarEndereco: () => {
    if (MEU_CARRINHO.length <= 0) {
      cardapio.metodos.mensagens("Seu Carrinho está Vazio!");
      return;
    }
    cardapio.metodos.carregarEtapas(2);
  },

  //API ViaCep
  buscarCep: () => {
    //cria a variavel com o valor cep
    var cep = $("#txtCEP").val().trim().replace(/\D/g, "");

    //valida o cep informado
    if (cep != "") {
      //Expressao regular para validar o cep
      var validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        $.getJSON(
          "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
          function (dados) {
            console.log(dados);

            if (!("erro" in dados)) {
              //atualizar os campos co valores da API
              // $("#textCEP").val(dados.logradouro);
              $("#txtEndereco").val(dados.logradouro);
              $("#txtBairro").val(dados.bairro);
              $("#txtCidade").val(dados.localidade);
              $("#ddlUF").val(dados.uf);
              $("#txtNumero").focus();
            } else {
              cardapio.metodos.mensagens("CEP não encontrado!");
              cardapio.metodos.mensagens("Preencha manualmente");
              $("#txtEndereco").focus();
            }
          }
        );
      } else {
        cardapio.metodos.mensagens("Formato de CEP inválido!");
        $("#txtCEP").focus();
      }
    } else {
      cardapio.metodos.mensagens("Informe o CEP!");
      $("#txtCEP").focus();
    }
  },

  //validar antes de resumo pedidos
  resumoPedido: () => {

    // let nome = $("#txtNome").val().trim();
    let cep = $("#txtCEP").val().trim();
    let endereco = $("#txtEndereco").val().trim();
    let bairro = $("#txtBairro").val().trim();
    let cidade = $("#txtCidade").val().trim();
    let uf = $("#ddlUF").val().trim();
    let numero = $("#txtNumero").val().trim();
    let complemento = $("#txtComplemento").val().trim();
    

    // if (cnome.length <= 0) {
    //   cardapio.metodos.mensagens("Informe seu Nome!");
    //   $("#txtNome").focus();
    //   return;
    // }
    if (cep.length <= 0) {
      cardapio.metodos.mensagens("Informe o CEP!");
      $("#txtCEP").focus();
      return;
    }
    if (endereco.length <= 0) {
      cardapio.metodos.mensagens("Informe o Endereço!");
      $("#txtEndereco").focus();
      return;
    }
    if (bairro.length <= 0) {
      cardapio.metodos.mensagens("Informe o Bairro!");
      $("#txtBairro").focus();
      return;
    }
    if (cidade.length <= 0) {
      cardapio.metodos.mensagens("Informe o Cidade!");
      $("#txtCidade").focus();
      return;
    }
    if (uf == "-1") {
      cardapio.metodos.mensagens("Informe o UF!");
      $("#ddlUF").focus();
      return;
    }
    if (numero.length <= 0) {
      cardapio.metodos.mensagens("Informe o Número!");
      $("#txtNumero").focus();
      return;
    }
    if (complemento.length <= 0) {
      cardapio.metodos.mensagens("Informe o Complemento!");
      $("#txtComplemento").focus();
      return;
    }

    MEU_ENDERECO = {
      
      // nome: nome,
      cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      numero: numero,
      complemento: complemento
    };

    cardapio.metodos.carregarEtapas(3);
    cardapio.metodos.carregarResumo();

  },

  //carrega a etapa de resumo pedido
  carregarResumo: () => {

    $("#listaItensResumo").html('');

    $.each(MEU_CARRINHO, (i, e) => {

      let temp = cardapio.templates.itemResumo
          .replace(/\${img}/g, e.img)
          .replace(/\${nome}/g, e.name)
          .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","))
          .replace(/\${qntd}/g, e.qntd);

      $("#listaItensResumo").append(temp);

    });

    $("#resumo-endereco").html(`${MEU_ENDERECO.endereco}, Nº ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro} ( ${MEU_ENDERECO.complemento} )`);
    $("#cidade-endereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}`);

    cardapio.metodos.finalizarPedido();
  },

  //carrega o link do whatsApp
  finalizarPedido: () => {

    if (MEU_CARRINHO.length >0 && MEU_CARRINHO != null) {

      var texto = 'Olá, gostaria de fazer um pedido:';
      texto += `\n*Itens do Pedido:*\n\${itens}`;
      texto += '\n*Endereço de Entrega:*';
      texto += `\n${MEU_ENDERECO.endereco}, Nº ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}\n${MEU_ENDERECO.complemento}`;
      texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}`;
      texto += `\n\n*Total (Com Entrega!): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;

      var itens = '';

      $.each(MEU_CARRINHO, (i, e) => {

        itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.',',')} \n`;

        if ((i + 1) == MEU_CARRINHO.length) {

          texto = texto.replace(/\${itens}/g, itens);

          console.log(texto);
          //converte a url
          let encode = encodeURI(texto);
          let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

          $("#btnEtapaResumo").attr('href', URL);

        }

        // 


      });
    }
  },

  //carrega o link bnt Reserva
  carregarBtnReserva: () => {

    var texto = 'Olá, gostaria de fazer uma *reserva*!';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

    $("#btn-reserna").attr('href', URL);

  },

  //carrega o bnt com o link de ligção 
  carregarBntLigar: () => {

    $("#btn-ligar").attr('href', `tel:${CELULAR_EMPRESA}`);

  },

  //carrega o bnt com o link instagram
  carregarSocialInstagram: () => {

    let URL = `${INSTAGRAM_EMPRESA}`;

    $("#btn-instagram-1").attr('href', URL);
    $("#btn-instagram-2").attr('href', URL);

  },

  //carrega o bnt com o link facebook
  carregarSocialFacebook: () => {

    let URL = `${FACEBOOK_EMPRESA}`;

    $("#btn-facebook-1").attr('href', URL);
    $("#btn-facebook-2").attr('href', URL);
  },

  //carrega o bnt com o link whatsApp
  carregarSocialWhatsApp: () => {

    var texto = 'Olá, *Altere o Texto aqui!*';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

    $("#btn-whatsApp-1").attr('href', URL);
    $("#btn-whatsApp-2").attr('href', URL);
  },

  //abri o depoimento 
  abrirDepoimento: (depoimento) => {

    $("#depoimento-1").addClass('hidden');
    $("#depoimento-2").addClass('hidden');
    $("#depoimento-3").addClass('hidden');

    $("#btnDepoimento-1").removeClass('active');
    $("#btnDepoimento-2").removeClass('active');
    $("#btnDepoimento-3").removeClass('active');

    $("#depoimento-" + depoimento).removeClass('hidden');
    $("#btnDepoimento-" + depoimento).addClass('active');

  },

  //mensagem de itens adicionado ao carrinho
  mensagens: (texto, cor = "red", tempo = 3000) => {
    //criando ID aleatorio
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class=" animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass("fadeInDown");
      $("#msg-" + id).addClass("fadeOutUp");
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

cardapio.templates = {
  item: `
    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp delay-02s">
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

  itemCarrinho: `
            <div class="col-12 item-carrinho">
              <div class="img-produto">
                <img src="\${img}" alt="Item Carrinho"/>
              </div>
              <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
              </div>
              <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.minusUnitCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="units-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.addUnitCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
              </div>
            </div>
    `,

  itemResumo: `
          <div class="col-12 item-carrinho resumo">
              <div class="img-produto-resumo">
                <img src="\${img}" />
              </div>
              <div class="dados-produto">
                <p class="title-produto-resumo">
                  <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                  <b>R$ \${preco}</b>
                </p>
              </div>
          
              <p class="quantidade-produto-resumo">
                 x <b>\${qntd}</b>
              </p>
          </div>
    `,
};
