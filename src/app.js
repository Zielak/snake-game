import Grid from './Grid'
import SnakeCell from './SnakeCell'
import Fruit from './Fruit'
import * as utils from './Utils'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const textElem = document.getElementById('text')
const scoreElem = document.getElementById('score')

export const KEY_LEFT = 65
export const KEY_RIGHT = 68
export const KEY_UP = 87
export const KEY_DOWN = 83
export const KEY_ENTER = 13

const grid = new Grid({
  width: 24,
  height: 24,
  cellSize: 20,
})

let playing = false
let updater = null

const game = {
  _speedUp: 6,
  maxSpeedUp: 10,

  score: 0,

  direction: KEY_UP,
  keyDirection: KEY_UP,

  postRenderActions: []
}
Object.defineProperties(game, {
  gameSpeed: {
    get: () => 1000/game._speedUp
  },
  speedUp: {
    get: () => game._speedUp,
    set: v => {
      game._speedUp = Math.min(v, game.maxSpeedUp)
      resetInterval()
    }
  }
})

let snake = []
let fruits = []

function start(){
  if(!playing){
    game.score = 0
    game._speedUp = 6
    game.direction = game.keyDirection = KEY_UP

    playing = true
    snake = [
      new SnakeCell(Math.round(grid.width/2), Math.round(grid.height/2)),
      new SnakeCell(Math.round(grid.width/2), Math.round(grid.height/2)+1),
      new SnakeCell(Math.round(grid.width/2), Math.round(grid.height/2)+1),
      new SnakeCell(Math.round(grid.width/2), Math.round(grid.height/2)+1),
      new SnakeCell(Math.round(grid.width/2), Math.round(grid.height/2)+1),
    ]
    fruits = []
    spawnNewFruit()
    spawnNewFruit()
    resetInterval()
  }
}

function render(){
  if(!playing) return
  move()
  draw()
  populateGrid()

  game.postRenderActions.forEach(el => el())
  game.postRenderActions = []
}

function draw(){
  ctx.clearRect(0,0,grid.width * grid.cellSize, grid.height * grid.cellSize)

  ctx.fillStyle = 'white'
  snake.forEach((cell, idx) => {
    if(idx === 0) return
    ctx.fillRect(
      cell.x * grid.cellSize + 1,
      cell.y * grid.cellSize + 1,
      grid.cellSize - 2,
      grid.cellSize - 2
    )
  })
  ctx.fillStyle = '#ff6600'
  ctx.strokeStyle = '#ff6600'
  ctx.lineWidth = 2
  ctx.fillRect(
    snake[0].x * grid.cellSize + 4,
    snake[0].y * grid.cellSize + 4,
    grid.cellSize - 8,
    grid.cellSize - 8
  )
  ctx.strokeRect(
    snake[0].x * grid.cellSize,
    snake[0].y * grid.cellSize,
    grid.cellSize,
    grid.cellSize
  )

  ctx.fillStyle = 'red'
  fruits.forEach(cell => {
    ctx.beginPath()
    ctx.arc(
      cell.x * grid.cellSize + grid.cellSize/2,
      cell.y * grid.cellSize + grid.cellSize/2,
      grid.cellSize/2,
      0, Math.PI * 2
    )
    ctx.fill()
    ctx.closePath()
  })

  scoreElem.innerText = game.score

}

function move(){
  let newSnake = snake.slice(0)

  // Apply desired direction from last key
  game.direction = game.keyDirection

  newSnake = snake.map((elem, idx, oldArr) => {
    if(idx === 0){
      let newElem = new SnakeCell(elem.x, elem.y)
      newElem
        .move( dir2pos(game.direction) )
        .wrap( {w: grid.width, h: grid.height} )
      return newElem
    }else{
      return new SnakeCell(oldArr[idx-1].x, oldArr[idx-1].y)
    }
  })

  snake = newSnake

  // Check collisions
  populateGrid()
  
  let overObject = grid.getObjectAt(snake[0])
  if(overObject instanceof SnakeCell){
    if(snake[0] !== overObject){
      game.postRenderActions.push(gameOver)
    }
  }else if(overObject instanceof Fruit){
    fruits = fruits.filter(el => el !== overObject)
    game.postRenderActions.push(scoreUp)
  }
  
}

function populateGrid(){
  grid.clear()
  snake.forEach(el => grid.place(el))
  fruits.forEach(el => grid.place(el))
}

function spawnNewFruit(){
  const el = new Fruit(grid.getSomeEmptyCell())
  fruits.push(el)
  grid.place(el)
  console.log('new gruit at', el)
}

function spawnNewTail(){
  const last = snake[snake.length-1]
  snake.push(new SnakeCell(last.x, last.y))
}

function scoreUp(){
  game.score += 10
  if(grid.countEmptyCells <= 0) gameOver()
  spawnNewFruit()
  spawnNewTail()
  spawnNewTail()
  spawnNewTail()

  game.speedUp += 0.33
}

function gameOver(){
  clearInterval(updater)
  textElem.innerText = 'GAME OVER, press enter to restart'
  playing = false
}


function resetInterval() {
  if(playing){
    clearInterval(updater)
    updater = setInterval(() => {
      render()
    }, game.gameSpeed);
  }
}

document.addEventListener('keydown', e => {
  const key = e.which
  if(playing){
    if(key === KEY_UP && game.direction !== KEY_DOWN){
      game.keyDirection = KEY_UP;
    }

    if(key === KEY_DOWN && game.direction !== KEY_UP){
      game.keyDirection = KEY_DOWN;
    }

    if(key === KEY_LEFT && game.direction !== KEY_RIGHT){
      game.keyDirection = KEY_LEFT;
    }

    if(key === KEY_RIGHT && game.direction !== KEY_LEFT){
      game.keyDirection = KEY_RIGHT;
    }

    if(key === KEY_ENTER){
      gameOver()
    }
  }else{
    switch(e.which){
      case KEY_ENTER:
        start()
        break
    }
  }
})

function dir2pos(dir){
  let x = 0, y = 0
  switch(dir){
    case KEY_UP:
      y = -1
      break
    case KEY_DOWN:
      y = 1
      break;
    case KEY_LEFT:
      x = -1
      break
    case KEY_RIGHT:
      x = 1
      break
  }

  return {x, y}
}
