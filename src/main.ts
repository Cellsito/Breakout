import { Actor, CollisionType, Color, Engine, vec, Font, Label, FontUnit, Sound, Loader, } from "excalibur"

// 1 - criar instância de Engine
const game = new Engine({
	width: 800,
	height: 600,
})

// 2 - criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 100,
	height: 20,
	color: Color.Chartreuse,
	name: "BarraJogador"
})

barra.body.collisionType = CollisionType.Fixed

// insere o Actor barra
game.add(barra)

// 3 - movimento da barra com o Mouse
game.input.pointers.primary.on("move", (event) => {
	// pos x barra = pos x mouse 
	barra.pos.x = event.worldPos.x
})

// 4 - criar bolinha
const bolinha = new Actor({
	x: Math.trunc(Math.random() * game.drawWidth),
	y: 300,
	radius: 10,
	color: Color.Magenta
})

bolinha.body.collisionType = CollisionType.Passive

let coresBolinha = [Color.Azure, Color.Green, Color.Magenta, Color.Yellow, Color.Orange, Color.Red, Color.Transparent, Color.Blue]

let numeroCores = coresBolinha.length

// 5 - criar movimentaçao da bolinha
const velocidadeBolinha = vec(700, 700)

// ativa a velocidade x= 100 e y= 100 da bolinha,depois de um segund0 (1000 ms)
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = 1 * velocidadeBolinha.x *2
	}

	// se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -1 * velocidadeBolinha.x *2
	}

	// se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = 1 * velocidadeBolinha.y *2
	}

	// se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	 bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// insere bolinha
game.add(bolinha)

// 7 - criar os blocos destrutiveis
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 4

const corBloco = [Color.Red, Color.Orange, Color.Yellow, Color.Cyan]


const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 30

const listaBlocos: Actor[] = []

// rederização dos bloquinhos

// renderiza 3 linhas
for (let j = 0; j < linhas; j++) {

	// renderiza 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}



}

listaBlocos.forEach(bloco => {
	// define o tipo de colisor do bloco
	bloco.body.collisionType = CollisionType.Active

	// adiciona do bloco
	game.add(bloco)
})

let pontos = 0

const textoPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(725, 500,)
})

game.add(textoPontos)

// const textoPontos = new Text ({
// 	text: "Hello World",
// 	font: new Font({size: 25})
// })

// const objetoTexto = new Actor ({
// 	x: game.drawWidth - 80, 
// 	y: game.drawHeight - 15
// })

// objetoTexto.graphics.use(textoPontos)

// game.add(objetoTexto)


let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	// verificar se a bolinha colidiu com algum bloco destrutivel
	// console.log("Colidiu com", event.other.name);

	// se colidido por um bloco da lista de blocos
	if (listaBlocos.includes(event.other)) {
		// destruir bloco colidido
		event.other.kill()

		bateu.play()

		// adiciona um ponto
		pontos++

		bolinha.color = coresBolinha [Math.trunc( Math.random() * numeroCores)]

		// atualiza valor do placar
		textoPontos.text = pontos.toString()
	}
	if (pontos >= 20) {
		alert("VOCÊ VENCEUU!!!")
		window.location.reload()
	}

	// rebater a bolinha = inverter as direçôes 
	// mtv = "minimum translation vector"
	let interseccao = event.contact.mtv.normalize()

	if (!colidindo) {
		colidindo = true

		//interceccao.x e interceccao,y
		// o maior representa o contato 
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}

})

barra.on("collisionend", () => {
	subiu.play()
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	morrido.play()
	.then(() => {
		alert("E Morreu!!!")
		window.location.reload()

	})

})

const morrido = new Sound('./src/sounds/wav (HD)/MORTO.wav')
const subiu = new Sound('./src/sounds/mp3/OBA.mp3')
const bateu = new Sound('./src/sounds/mp3/BOOM.mp3')

const carrega = new Loader([bateu,subiu, morrido])

// inicia o game
await game.start(carrega)