const btnConfirmar = document.querySelector(".confirmar");
const btnCancelar = document.querySelector(".cancelar");
const btnPedir = document.querySelector(".fazer-pedido");

const pratos = [
    {
        nome: "Estrombelete de Frango",
        imagem: "img/frango_yin_yang.png",
        descricao: "Um pouco de batata, um pouco de salada",
        preco: 14.9,
        tipo: "prato",
    },
    {
        nome: "Asa de Boi",
        imagem: "img/frango_yin_yang.png",
        descricao: "Com molho shoyu",
        preco: 14.9,
        tipo: "prato",
    },
    {
        nome: "Carne de Monstro",
        imagem: "img/frango_yin_yang.png",
        descricao: "Com batata assada e farofa",
        preco: 14.9,
        tipo: "prato",
    },
];

const bebidas = [
    {
        nome: "Coquinha gelada",
        imagem: "img/coquinha_gelada.png",
        descricao: "Lata 350ml",
        preco: 4.9,
        tipo: "bebida",
    },
    {
        nome: "Caldo de Cana",
        imagem: "img/coquinha_gelada.png",
        descricao: "Copo 600ml",
        preco: 4.9,
        tipo: "bebida",
    },
    {
        nome: "Corote Gelado",
        imagem: "img/coquinha_gelada.png",
        descricao: "Garrafa 400ml",
        preco: 4.9,
        tipo: "bebida",
    },
];

const sobremesas = [
    {
        nome: "Pudim",
        imagem: "img/pudim.png",
        descricao: "Gosto de doce de leite",
        preco: 7.9,
        tipo: "sobremesa",
    },
    {
        nome: "Flam",
        imagem: "img/pudim.png",
        descricao: "Gosto de chocolate",
        preco: 7.9,
        tipo: "sobremesa",
    },
    {
        nome: "Brigadeiro",
        imagem: "img/pudim.png",
        descricao: "3 unidades",
        preco: 7.9,
        tipo: "sobremesa",
    },
];

class Produto {
    constructor({ nome, descricao, imagem, preco, tipo }) {
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.preco = preco;
        this.tipo = tipo;
    }

    createElement() {
        const view = document.createElement("div");
        view.classList.add("opcao");
        view.addEventListener("click", () => {
            this.selectProduct(view);
        });
        view.innerHTML = `
            <img src="${this.imagem}" />
            <div class="titulo">${this.nome}</div>
            <div class="descricao">${this.descricao}</div>
            <div class="fundo">
                <div class="preco">R$ ${this.preco.toFixed(2)}</div>
                <div class="check">
                    <ion-icon name="checkmark-circle"></ion-icon>
                </div>
            </div>
    `;
        return view;
    }

    selectProduct(element) {
        const selecionado = document.querySelector(
            `.${this.tipo} .selecionado`
        );
        if (selecionado !== null) {
            selecionado.classList.remove("selecionado");
        }
        element.classList.add("selecionado");
        pedido.checkOrder(this);
    }
}

class Order {
    constructor(prato, bebida, sobremesa) {
        this.prato = prato;
        this.bebida = bebida;
        this.sobremesa = sobremesa;
    }

    checkOrder(produto) {
        this[produto.tipo] = produto;

        if (this.bebida && this.prato && this.sobremesa) {
            btnPedir.classList.add("ativo");
            btnPedir.disabled = false;
            btnPedir.innerHTML = "Fazer pedido";
        }
    }

    confirmar() {
        const modal = document.querySelector(".overlay");
        modal.classList.remove("escondido");

        new Precos().display(this.prato);
        new Precos().display(this.bebida);
        new Precos().display(this.sobremesa);

        const total =
            this.prato.preco + this.bebida.preco + this.sobremesa.preco;

        new Precos().display({ nome: "none", preco: total, tipo: "total" });
    }

    cancelar() {
        const modal = document.querySelector(".overlay");
        modal.classList.add("escondido");
    }

    enviarZap() {
        const total =
            this.prato.preco + this.bebida.preco + this.sobremesa.preco;
        const telefoneRestaurante = 553299999999;
        const encodedText = encodeURIComponent(
            `Olá, gostaria de fazer o pedido:
                - Prato: ${this.prato.nome}
                - Bebida: ${this.bebida.nome}
                - Sobremesa: ${this.sobremesa.nome}
            Total: R$ ${total.toFixed(2)}`
        );

        const urlWhatsapp = `https://wa.me/${telefoneRestaurante}?text=${encodedText}`;
        window.open(urlWhatsapp);
    }
}

class Precos {
    display({ nome, preco, tipo }) {
        if (tipo === "total") {
            return (document.querySelector(
                ".confirmar-pedido .total .preco"
            ).innerHTML = preco.toFixed(2));
        }

        document.querySelector(`.confirmar-pedido .${tipo} .nome`).innerHTML =
            nome;
        document.querySelector(`.confirmar-pedido .${tipo} .preco`).innerHTML =
            preco.toFixed(2);
    }
}

class Lista {
    constructor(tipo) {
        this.tipo = tipo;
    }

    render(produtos) {
        const listaDeProdutos = document.querySelector(`.opcoes.${this.tipo}`);
        produtos.forEach((produto) => {
            const instanciaDeProduto = new Produto(produto);
            listaDeProdutos.appendChild(instanciaDeProduto.createElement());
        });
    }
}

const listaDePratos = new Lista("prato");
const listaDeBebidas = new Lista("bebida");
const listaDeSobremesas = new Lista("sobremesa");

listaDePratos.render(pratos);
listaDeBebidas.render(bebidas);
listaDeSobremesas.render(sobremesas);

const pedido = new Order();

btnConfirmar.addEventListener("click", () => {
    pedido.enviarZap();
});

btnCancelar.addEventListener("click", () => {
    pedido.cancelar();
});

btnPedir.addEventListener("click", () => {
    pedido.confirmar();
});
