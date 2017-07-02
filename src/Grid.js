
let grid = []

export default class Grid {
  constructor({width, height, cellSize}){
    this.width = width
    this.height = height
    this.cellSize = cellSize

    this.clear()
  }

  clear(){
    grid = Array.from(
      Array(this.width), () => Array.from(
        Array.from( Array(this.height), () => null)
      )
    )
  }

  place(o){
    grid[o.x][o.y] = o
  }

  isEmpty({x, y}){
    return !grid[x][y]
  }

  getObjectAt({x, y}){
    try{
      return grid[x][y]
    }catch(e){
      return null
    }
  }

  countEmptyCells(){
    return this.getEmptyCells().length
  }

  getEmptyCells(){
    let result = []
    grid.forEach((arr, x) => {
      arr.forEach((cell, y) => {
        if(cell === null) result.push({x, y})
      })
    })
    return result
  }

  getSomeEmptyCell(){
    const arr = this.getEmptyCells()
    return arr[Math.floor(Math.random() * arr.length)]
  }

  countOccupiedCells(){
    return this.getOccupiedCells().length
  }

  getOccupiedCells(){
    let result = []
    grid.forEach((arr, x) => {
      arr.forEach((cell, y) => {
        if(cell !== null) result.push({x, y})
      })
    })
    return result
  }
}
