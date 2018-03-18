import { observable } from 'mobx'

const model = observable.object({
  player: 1,
  board: [[[], [], [], []], [[], [], [], []], [[], [], [], []], [[], [], [], []]],
  hovered: null,
  setHoveredLabel(label) {
    this.hovered = label
  },
  putBall(i, j) {
    for (let n = 0; n < 4; n++) {
      if (this.board[n][i][j] === undefined) {
        this.board[n][i][j] = this.player
        this.board = this.board.slice(0)
        this.player = this.player === 1 ? 2 : 1
        return true
      }
    }

    return false
  },
  clickBall(i, j) {
    console.log(i, j)
    this.putBall(i, j)
  }
}, {}, { deep: false })

export default model
