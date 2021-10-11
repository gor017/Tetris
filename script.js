class Game {

    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    }
    

    constructor (){
        this.reset()
    }

    get level() {
        return Math.floor(this.lines * 0.1)
    }

    nextPiece = this.createPiece()

    moveLeft() {
        this.activePiece.x -= 1

        if(this.hasCollision()) {
            this.activePiece.x += 1
        }
    }
    moveRight() {
        this.activePiece.x += 1

        if(this.hasCollision()) {
            this.activePiece.x -= 1
        }
    }
    moveDown() {
        if (this.topOut) return
        this.activePiece.y += 1

        if(this.hasCollision()) {
            this.activePiece.y -= 1
            this.lockPiece()
            const clearedLines = this.clearLines()
            this.updateScore(clearedLines)
            this.updatePieces()
        }
        if (this.hasCollision()) {
            this.topOut = true
        }
    }

    getState() {
        const playfield = this.createPlayfield()
        const { y: pieceY, x: pieceX, pieces } = this.activePiece

        for(let y = 0; y < this.playfield.length; y++) {
            playfield[y] = []

            for(let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x]
            }
        }

        for (let y = 0; y < pieces.length; y++) {
            for(let x = 0; x < pieces[y].length; x++) {
                if(pieces[y][x]) {
                    playfield[pieceY + y][pieceX + x] = pieces[y][x]
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        }
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false
        this.playfield = this.createPlayfield()
        this.activePiece = this.createPiece()
        this.nextPiece = this.createPiece()
    }

    createPlayfield() {
        const playfield = []
        for(let y = 0; y < 20; y++) {
            playfield[y] = []
            for(let x = 0; x < 10; x++) {
                playfield[y][x] = 0
            }
        }
        return playfield
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7)
        const type = 'IJLOSTZ'[index]
        const piece = {}

        switch(type) {
            case 'I':
                piece.pieces = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
                break
            case 'J':
                piece.pieces = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]
                ]
                break
            case 'L':
                piece.pieces = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ]
                break
            case 'O':
                piece.pieces = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ]
                break
            case 'S':
                piece.pieces = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ]
                break
            case 'T':
                piece.pieces = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ]
                break
            case 'Z':
                piece.pieces = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ]
                break
            default:
                throw new Error('Undefined type of piece.')
        }

        piece.x = Math.floor((10 - piece.pieces[0].length) / 2)
        piece.y = -1

        return piece
    }

    hasCollision(){
        const { y: pieceY, x: pieceX, pieces } = this.activePiece

        for(let y = 0; y < pieces.length; y++) {
            for(let x = 0; x < pieces[y].length; x++) {
                if(
                    pieces[y][x] && 
                    ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
                    this.playfield[pieceY + y][pieceX + x])                    
                    ) {
                    return true
                }
            }
        }
        return false
    }
    
    lockPiece() {
        const { y: pieceY, x: pieceX, pieces } = this.activePiece

        for(let y = 0; y < pieces.length; y++) {
            for(let x = 0; x < pieces[y].length; x++) {
                if(pieces[y][x]) {
                    this.playfield[pieceY + y][pieceX + x] = pieces[y][x]
                }
            }
        }
    }


    rotatePiece() {
        const pieces = this.activePiece.pieces
        const length = pieces.length
        const temp  = []
        for(let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0)
        }

        for(let y = 0; y < length; y++) {
            for(let x = 0; x < length; x++) {
                temp[x][y] = pieces[length - 1 - y][x]
            }
        }
        this.activePiece.pieces = temp

        if(this.hasCollision()) {
            this.activePiece.pieces = pieces
        }
    }
    
    clearLines() {
        const rows = 20
        const columns = 10
        let lines = []

        for(let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0

            for(let x = 0; x < columns; x++) {
                if(this.playfield[y][x]) {
                    numberOfBlocks += 1
                }
            }

            if(numberOfBlocks === 0) {
                break
            } else if (numberOfBlocks < columns) {
                continue
            } else if (numberOfBlocks === columns) {
                lines.unshift(y)
            }
        }

        for (let index of lines) {
            this.playfield.splice(index, 1)
            this.playfield.unshift(new Array(columns).fill(0))
        }
        return lines.length
    }

    updateScore(clearedLines) {
        if(clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1)
            this.lines += clearedLines
            console.log(this.score, this.lines)
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece
        this.nextPiece = this.createPiece()
    }
}

class View {

    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red'
    }

    constructor(element, width, height, rows, columns, playfield) {
        this.element = element
        this.width = width
        this.height = height

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext('2d')

        this.playfieldBorderWidth = 4
        this.playfieldX = this.playfieldBorderWidth
        this.playfieldY = this.playfieldBorderWidth
        this.playfieldWidth = this.width * 2 / 3
        this.playfieldHeight = this.height
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2

        this.blockWidth = this.playfieldInnerWidth / columns
        this.blockHeight = this.playfieldInnerHeight / rows

        this.panelX = this.playfieldWidth + 10
        this.panelY = 0
        this.panelWidth = this.width / 3
        this.panelHeight = this.height

        this.element.appendChild(this.canvas)
    }
    renderMainScreen(state) {
        this.clearScreen()
        this.renderPlayfield(state)
        this.renderPanel(state)
    }

    
    renderStartScreen() {
        this.context.fillStyle =  'white'
        this.context.font = '18px'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2)
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0,0,0,0.75)'
        this.context.fillRect(0, 0, this.width, this.height)

        this.context.fillStyle =  'white'
        this.context.font = '18px'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2)
    }

    renderEndScreen( { score } ) {
        this.clearScreen()

        this.context.fillStyle =  'white'
        this.context.font = '18px'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48)
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2)
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48)
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height)
    }


    renderPlayfield({ playfield }) {
        for(let y = 0; y < playfield.length; y++) {
            const line = playfield[y]

            for(let x = 0; x < line.length; x++) {
                const block = line[x]

                if(block) {
                    this.renderBlock(
                        this.playfieldX + (x * this.blockWidth), 
                        this.playfieldY + (y * this.blockHeight), 
                        this.blockWidth, 
                        this.blockHeight, 
                        View.colors[block])
                }
            }
        }
        this.context.strokeStyle = 'white'
        this.context.lineWidth = this.playfieldBorderWidth
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight)


    }

    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start'
        this.context.textBaseline = 'top'
        this.context.fillStyle = 'white'
        this.context.font = '14px'

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 10)
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 34)
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 58)
        this.context.fillText('Next:', this.panelX, this.panelY + 96)

        for(let y =  0; y < nextPiece.pieces.length; y++) {
            for(let x = 0; x < nextPiece.pieces[y].length; x++) {
                const block = nextPiece.pieces[y][x]

                if(block) {
                    this.renderBlock (
                        this.panelX + (x * this.blockWidth * 0.5),
                        this.panelY + 100 + (y * this.blockHeight * 0.5),
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5,
                        View.colors[block]
                    )
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color
        this.context.strokeStyle = 'black'
        this.context.lineWidth = 2

        this.context.fillRect(x, y, width, height)
        this.context.strokeRect(x, y, width, height)
    } 
}

class Controller {
    constructor(game, view) {
        this.game = game
        this.view = view
        this.intervalID  = null
        this.isPlaying = false

        

        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        document.addEventListener('keyup', this.handleKeyUp.bind(this)) 
            
            this.view.renderStartScreen()
    }
    

    update() {
        this.game.moveDown()
        this.updateView()
    }

    play() {
        this.isPlaying = true
        this.startTimer()
        this.updateView()
    }

    pause() {
        this.isPlaying = false
        this.stopTimer()
        this.updateView()
    }

    reset() {
        this.game.reset()
        this.play()
    }

    updateView(){
        const state = this.game.getState()
        if(state.isGameOver) {
            this.view.renderEndScreen(state)
        } else if(!this.isPlaying) {
            this.view.renderPauseScreen()
        } else {
            this.view.renderMainScreen(state)
        }
        
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100

        if(!this.intervalID) {
            this.intervalID = setInterval(() => {
                this.update()
            }, speed > 0 ? speed : 100)
        }
    }

    stopTimer() {
        if(this.intervalID)  {
            clearInterval(this.intervalID)
            this.intervalID =  null
        }
    }

    handleKeyDown(event) {
        
        console.log('handle key')
        const state = this.game.getState()

        
        switch (event.keyCode) {
            case 13:
               if(state.isGameOver) {
                   this.reset()
               } else if (this.isPlaying) {
                this.pause()
               } else {
                   this.play()
               }
               break;
            case 37:
                this.game.moveLeft()
                this.updateView()
                break;
            case 38:
                this.game.rotatePiece()
                this.updateView()
                break;
            case 39:
                this.game.moveRight()
                this.updateView()
                break;
            case 40:
                this.stopTimer()
                this.game.moveDown()
                this.updateView()
                break;
        }
    }

    handleKeyUp (event) {
        switch (event.keyCode) {
            case 40:
                this.startTimer()
                break;
        }
    }
}


const root = document.querySelector('#root')
const game = new Game();
const view = new View(root, 480, 640, 20, 10)
const controller = new Controller(game, view)

window.game = game
window.view = view
window.controller = controller

