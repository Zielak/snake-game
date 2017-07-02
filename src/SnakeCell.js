export default class SnakeCell {
  constructor(x, y){
    this.x = x
    this.y = y
  }

  move({x,y}){
    this.x += x
    this.y += y
    return this
  }

  wrap({w,h}){
    this.x = this.x > w-1 ? 0 : this.x < 0 ? w-1 : this.x
    this.y = this.y > h-1 ? 0 : this.y < 0 ? h-1 : this.y
    return this
  }

}
