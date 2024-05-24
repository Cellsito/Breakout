import { Actor, CollisionType, Color, Engine, vec } from "excalibur"

// 1 - criar instância de Engine
const game = new Engine ({
  width: 800,
  height: 600,
})

// 2 - criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse
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
const bolinha = new Actor ({
	x: 100,
	y: 300,
	radius: 10, 
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// 5 - criar movimentaçao da bolinha
const velocidadeBolinha = vec(100, 100)

// ativa a velocidade x= 100 e y= 100 da bolinha,depois de um segund0 (1000 ms)
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = 2 *velocidadeBolinha.x
	}

	// se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -2 * velocidadeBolinha.x
	}

	// se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = 2 * velocidadeBolinha.y
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
const linhas = 3

const corBloco = [Color.Violet, Color.Orange, Color.Yellow]


const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 30

const listaBlocos: Actor[] = []



// inicia o game
game.start()