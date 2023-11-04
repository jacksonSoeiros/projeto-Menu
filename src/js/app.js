$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  // obter a lista do cardapio //
  obterItensCardapio: (categorias = "burgers", viewPlus = false) => {
    var filtro = MENU[categorias];
    console.log(filtro);

    if (!viewPlus) {
      $("#itens-cardapio").html("");
      $("#btn-verMais").removeClass('hidden');
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","));

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

    var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //[menu-][Burges]
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btn-verMais").addClass('hidden');

  },

};

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
        <div class="card card-item">
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
                <span class="btn-menos"> <i class="fas fa-minus"></i></span>
                <span class="add-numero-itens">0</span>
                <span class="btn-mais"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
          </div>
        </div>
    </div>
    `,
};
