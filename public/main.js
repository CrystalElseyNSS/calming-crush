document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const instructions = document.getElementById('instructions')
    const scoreBoard = document.getElementById('score-board')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0

    const colors = [
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1148991/original/brown.png)',
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1149011/original/pink.jpeg)',
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1149021/original/yellow.png)',
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1149051/original/mauve.jpeg)',
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1149001/original/green.png)',
      'url(https://eventfinity-production-assets.s3.amazonaws.com/materials/1149031/original/blue.png)'
    ]

    function createBoard() {
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div')
        square.classList.add('color');
        square.setAttribute('draggable', true)
        square.setAttribute('id', i)
        let randomColor = Math.floor(Math.random() * colors.length)
        square.style.backgroundImage = colors[randomColor]
        grid.appendChild(square)
        squares.push(square)
      }
    }
    createBoard()

    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('drageleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))

    function dragStart() {
      colorBeingDragged = this.style.backgroundImage
      squareIdBeingDragged = parseInt(this.id)
    }

    function dragOver(e) {
      e.preventDefault()
    }

    function dragEnter(e) {
      e.preventDefault()
    }

    function dragLeave() {
      this.style.backgroundImage = ''
    }

    const urlParams = window.location.pathname.split("-")
    const boothToTrim = urlParams[0]
    const booth = boothToTrim.substring(1)

    const endGame = () => {
        grid.innerHTML = 'Thank you for playing!'
        grid.style.backgroundColor = "transparent"
        grid.style.height = "unset"
        instructions.style.display = "none"
        scoreBoard.style.height = "100%"
    }  
      
    let count = 0
    function dragDrop() {
        if ( count < 19) {
            colorBeingReplaced = this.style.backgroundImage
            squareIdBeingReplaced = parseInt(this.id)
            this.style.backgroundImage = colorBeingDragged
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
            count += 1
        } else {
            endGame()
        }
    }

    function dragEnd() {
      let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width]
      let validMove = validMoves.includes(squareIdBeingReplaced)

      if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null
      } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
      } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    }

    function moveIntoSquareBelow() {
      for (i = 0; i < 55; i++) {
        if (squares[i + width].style.backgroundImage === '') {
          squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
          squares[i].style.backgroundImage = ''
          const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
          const isFirstRow = firstRow.includes(i)
          if (isFirstRow && (squares[i].style.backgroundImage === '')) {
            let randomColor = Math.floor(Math.random() * colors.length)
            squares[i].style.backgroundImage = colors[randomColor]
          }
        }
      }
    }

    function checkRowForFour() {
      for (i = 0; i < 60; i++) {
        let rowOfFour = [i, i + 1, i + 2, i + 3]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
        if (notValid.includes(i)) continue

        if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 30
          scoreDisplay.innerHTML = score
          rowOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
          })
        }
      }
    }
    checkRowForFour()

    function checkColumnForFour() {
      for (i = 0; i < 39; i++) {
        let columnOfFour = [i, i + width, i + width * 2, i + width * 3]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 30
          scoreDisplay.innerHTML = score
          columnOfFour.forEach(index => {
            squares[index].style.backgroundImage = ''
          })
        }
      }
    }
    checkColumnForFour()

    function checkRowForThree() {
      for (i = 0; i < 61; i++) {
        let rowOfThree = [i, i + 1, i + 2]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
        if (notValid.includes(i)) continue

        if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 20
          scoreDisplay.innerHTML = score
          rowOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
          })
        }
      }
    }
    checkRowForThree()

    function checkColumnForThree() {
      for (i = 0; i < 47; i++) {
        let columnOfThree = [i, i + width, i + width * 2]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 20
          scoreDisplay.innerHTML = score
          columnOfThree.forEach(index => {
            squares[index].style.backgroundImage = ''
          })
        }
      }
    }
    checkColumnForThree()

    window.setInterval(function () {
      checkRowForFour()
      checkColumnForFour()
      checkRowForThree()
      checkColumnForThree()
      moveIntoSquareBelow()
    }, 100);
  })      