document.addEventListener( 'DOMContentLoaded', function () {
    const gridElements = [];
    let gridTable;
    const makeTable = () => {
        const makeCell = () => {
            const td = document.createElement('td');
            gridElements.push(td);
            return td;
        };
        const makeRow = () => {
            const tr = document.createElement('tr');
            tr.append(makeCell(), makeCell(), makeCell());
            return tr;
        };
        const tbody = document.createElement('tbody');
        tbody.append(makeRow(), makeRow(), makeRow());
        const table = document.createElement('table');
        table.setAttribute('id', 'game-grid');
        table.append(tbody);
        return table;
};
    const currPlayerWrapper = document.getElementById('current-player-wrapper');
    const currentPlayerDisplay = document.getElementById('current-player');
    let currentPlayerName = currentPlayerDisplay.textContent;
    const resultDisplay = document.getElementById('game-result');

    const setCurrentPlayer = (playerName) => {
        currentPlayerDisplay.textContent = playerName;
        currentPlayerName = playerName;
    }

    let gameOver = false;
    const endGame = (message, isVictory) => {
        gameOver = true;
        currPlayerWrapper.classList.add('hidden');
        gridTable.classList.add('game-end');
        resultDisplay.textContent = message;
        if (isVictory) {
            resultDisplay.classList.add('win');
        }
    };
    const checkWinner = (squares, [id1, id2, id3]) => {
        if (squares[id1] === null
            || squares[id1] !== squares[id2]
            || squares[id1] !== squares[id3]
        ) {
            return false;
        }
        gridElements[id1].classList.add('winning-combo');
        gridElements[id2].classList.add('winning-combo');
        gridElements[id3].classList.add('winning-combo');
        endGame('Player ' + squares[id1] + ' wins!', true);
    };
    const gameStatus = () => {
        const makeLine = (start, inc) => [start, start + inc, start + inc * 2];
        const allLines = [
            makeLine(0, 1), makeLine(3, 1), makeLine(6, 1), 
            makeLine(0, 3), makeLine(1, 3), makeLine(2, 3), 
            makeLine(0, 4), makeLine(2, 2) 
        ];
        const squareValues = gridElements.map(getPlayer);
        for (let lineIdx = 0; lineIdx < allLines.length; lineIdx++) {
            if (checkWinner(squareValues, allLines[lineIdx])) {
                return;
            }
        }

        if (squareValues.every(p => p !== null)) {
            endGame('Draw!', false);
        }
    }

    const getPlayer = (elem) => elem.getAttribute('player');
    const onSquareClick = (elem) => {
        if (gameOver || getPlayer(elem) !== null) {
            return;
        }
        elem.setAttribute('player', currentPlayerName);
        elem.textContent = currentPlayerName;
        gameStatus();
        setCurrentPlayer(currentPlayerName === 'X' ? 'O' : 'X');
    };

    const resetGame = () => {
        gridElements.forEach(e => {
            e.removeAttribute('player');
            e.textContent = '';
            e.classList.remove('winning-combo');
        });
        resultDisplay.classList.remove('win');
        resultDisplay.textContent = "";
        currPlayerWrapper.classList.remove('hidden');
        gridTable.classList.remove('game-end');
        setCurrentPlayer('X');
        gameOver = false;
    }

    const setup = () => {
        gridTable = makeTable();
        resultDisplay.after(gridTable);
        gridElements.forEach(
            elem => {
                elem.addEventListener('click', () => onSquareClick(elem));
            }
        );
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', resetGame);
    };
    setup();
} );