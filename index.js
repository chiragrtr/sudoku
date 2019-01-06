const BOX_LENGTH = 3;
const LENGTH = 9;
const EMPTY_SQUARE = 0;

/* Input goes here. 0s donate empty squares which the algorithm will fill. */
const sudokuBoard = [
    [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
    [ 0, 0, 7, 3, 0, 0, 9, 0, 0 ],
    [ 0, 0, 8, 9, 0, 0, 0, 0, 0 ],
    [ 0, 7, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 8 ],
    [ 8, 0, 0, 0, 5, 0, 6, 0, 4 ],
    [ 0, 1, 0, 2, 0, 0, 0, 9, 0 ],
    [ 2, 0, 0, 0, 0, 4, 0, 0, 0 ],
    [ 0, 6, 9, 0, 0, 0, 0, 7, 0 ]
];

/* Construct a map which stores all the valid/allowed values at every index of sudoku. */
const ALLOWED_VALUES_MAP = sudokuBoard.map((row, rowIndex) => {
    return row.map((square, colIndex) => {
        if(square === EMPTY_SQUARE){
            return [1,2,3,4,5,6,7,8,9].filter(num => {
                sudokuBoard[rowIndex][colIndex] = num;
                const isNumberAllowed = isValid(sudokuBoard);
                sudokuBoard[rowIndex][colIndex] = EMPTY_SQUARE;
                return isNumberAllowed;
            });
        }
        return 0;
    });
});

/* SOLVE the sudoku recursively by providing it the initial allowed values map. */
const solution = solve(sudokuBoard, ALLOWED_VALUES_MAP);
console.log(solution ? solution : "The given sudoku has no solution");

function solve(board, allowedValuesMap){
    if(isCompleted(board)){
        return board;
    }
    if(isValid(board)){
        const [minRowIndex, minColIndex] = getIndicesOfMinAllowedValues(allowedValuesMap);
        if(minRowIndex === undefined || minColIndex === undefined){
            return false;
        }
        const allowedValues = allowedValuesMap[minRowIndex][minColIndex];

        /* Need a new map for the recursion so that we don't come back to already traversed index */
        const newAllowedValuesMap = JSON.parse(JSON.stringify(allowedValuesMap));
        newAllowedValuesMap[minRowIndex][minColIndex] = 0;

        let allowedValuesIndex = 0;
        while(!solution && allowedValuesIndex < allowedValues.length){
            board[minRowIndex][minColIndex] = allowedValues[allowedValuesIndex];
            var solution = solve(board, newAllowedValuesMap);
            allowedValuesIndex++;
        }
        if(!solution){
            board[minRowIndex][minColIndex] = EMPTY_SQUARE;
        }
        return solution;
    }
    return false;
}

function getIndicesOfMinAllowedValues(allowedValuesMap){
    var minimum = 10;
    let minRowIndex, minColIndex;
    allowedValuesMap.forEach((row, rowIndex) => {
        row.forEach((allowedNums, colIndex) => {
            if(allowedNums){
                const allowedNumsLength = allowedNums.length;
                if(allowedNumsLength < minimum){
                    minimum = allowedNumsLength;
                    minRowIndex = rowIndex;
                    minColIndex = colIndex;
                }
            }
        });
    });
    return [minRowIndex, minColIndex];
}

function isValid(board){
    return satisfyRowCondition(board) && satisfyColCondition(board) && satisfyBoxCondition(board);
}

function isCompleted(board){
    return satisfyRowCondition(board, true) && satisfyColCondition(board, true) && satisfyBoxCondition(board, true);
}

function satisfyRowCondition(board, shouldBeComplete){
    for(let row = 0; row < LENGTH; row++) {
        let currentRow = [];
        let rowSum = 0;
        for (let col = 0; col < LENGTH; col++) {
            let currentNum = board[row][col];
            if(currentNum === EMPTY_SQUARE){
                if(shouldBeComplete) return false;
            } else if(currentRow.includes(currentNum)){
                return false;
            } else {
                currentRow.push(currentNum);
                rowSum += currentNum;
            }
        }
        if(shouldBeComplete ? rowSum !== 45 : rowSum > 45){
            return false;
        }
    }
    return true;
}

function satisfyColCondition(board, shouldBeComplete){
    for(let col = 0; col < LENGTH; col++) {
        let currentCol = [];
        let colSum = 0;
        for (let row = 0; row < LENGTH; row++) {
            let currentNum = board[row][col];
            if(currentNum === EMPTY_SQUARE){
                if(shouldBeComplete) return false;
            } else if(currentCol.includes(currentNum)){
                return false;
            } else {
                currentCol.push(currentNum);
                colSum += currentNum;
            }
        }
        if(shouldBeComplete ? colSum !== 45 : colSum > 45){
            return false;
        }
    }
    return true;
}

function satisfyBoxCondition(board, shouldBeComplete){
    for(let row = 0; row < LENGTH; row = row + 3){
        for(let col = 0; col < LENGTH; col = col + 3){
            let currentBox = [];
            let boxSum = 0;
            for(let i = 0; i < BOX_LENGTH; i++){
                for(let j = 0; j < BOX_LENGTH; j++){
                    let currentNum = board[row + i][col + j];
                    if(currentNum === EMPTY_SQUARE){
                        if(shouldBeComplete) return false;
                    }
                    else if(currentBox.includes(currentNum)){
                        return false;
                    } else{
                        currentBox.push(currentNum);
                        boxSum += currentNum;
                    }
                }
            }
            if(shouldBeComplete ? boxSum !== 45 : boxSum > 45){
                return false;
            }
        }
    }
    return true;
}