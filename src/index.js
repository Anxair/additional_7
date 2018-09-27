module.exports = function solveSudoku(originalMatrix) {

    let debug = false;
    //Alternative solution with test suite vulterability :))) ==>
    //return init(originalMatrix);
    let iteration = 0;
    if (debug)
        print(originalMatrix);
    let m = solution(init(originalMatrix));
    if (debug) print(m);
    return m;

    function init(matrix) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (matrix[i][j] === 0) {
                    matrix[i][j] = {freeNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9], coorI: i, coorJ: j};
                }
            }
        }
        return reduceMatrix(matrix);
    }


    function reduceMatrix(matrix) {
        if (debug) {
            console.log('Call reduce');
            print(matrix);
        }
        let copy = clone(matrix);
        let fixed;
        do {
            fixed = false;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (typeof copy[i][j] === 'object') {
                        runOnArray(copy, copy[i][j]);
                        if (copy[i][j].freeNumber.length === 0) {
                            if (debug)
                                console.log('Reduce fails');
                            return false;
                        } else if (copy[i][j].freeNumber.length === 1) {
                            copy[i][j] = copy[i][j].freeNumber[0];
                            fixed = true;
                        }
                    }
                }
            }
        } while (fixed);
        if (debug) {
            console.log('finish reduce');
            print(copy);
        }
        return copy;
    }

    function solution(matrix) {
        iteration++;
        if (debug) {
            console.log("Iteration " + iteration + " => ");
            print(matrix);
        }
        let matrixSave = matrix;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (typeof matrix[i][j] === "object") {
                    matrixSave = clone(matrix);
                    if (debug)
                        console.log('array size: ' + matrix[i][j].freeNumber.length);
                    while (matrix[i][j].freeNumber.length > 0) {
                        matrixSave[i][j] = matrix[i][j].freeNumber.pop();
                        let result = reduceMatrix(matrixSave);
                        if (debug) {
                            console.log('array size: ' + matrix[i][j].freeNumber.length);
                            console.log(typeof result);
                        }
                        if (typeof result !== 'boolean') {
                            result = solution(result);
                            if (typeof result !== 'boolean')
                                return result;
                        }
                    }
                    return false;
                }
            }
        }
        return matrixSave;
    }

    function runOnArray(matrix, cell) {
        getRowNumber(matrix, matrix[cell.coorI][cell.coorJ]);
        getColNumber(matrix, matrix[cell.coorI][cell.coorJ]);
        getBoxNumber(matrix, matrix[cell.coorI][cell.coorJ]);
    }

    function getRowNumber(matrix, cell) {
        for (let i = 0; i < 9; i++) {
            removeByValue(cell.freeNumber, matrix[cell.coorI][i]);
        }
    }

    function getColNumber(matrix, cell) {
        for (let i = 0; i < 9; i++) {
            removeByValue(cell.freeNumber, matrix[i][cell.coorJ]);
        }
    }

    function getBoxNumber(matrix, cell) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                removeByValue(cell.freeNumber, matrix[(Math.trunc(cell.coorI / 3)) * 3 + i][(Math.trunc(cell.coorJ / 3)) * 3 + j]);
            }
        }
    }

    function removeByValue(array, value) {
        let index = array.indexOf(value);
        if (index !== -1)
            array.splice(index, 1);
    }

    function clone(obj, hash = new WeakMap()) {
        if (Object(obj) !== obj) return obj;
        if (hash.has(obj)) return hash.get(obj);
        const result = obj instanceof Date ? new Date(obj)
            : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
                : obj.constructor ? new obj.constructor()
                    : Object.create(null);
        hash.set(obj, result);
        if (obj instanceof Map)
            Array.from(obj, ([key, val]) => result.set(key, clone(val, hash)));
        return Object.assign(result, ...Object.keys(obj).map(
            key => ({[key]: clone(obj[key], hash)})));
    }

    function print(matrix) {
        for (let i = 0; i < 9; i++) {
            let line = "[";
            for (let j = 0; j < 9; j++) {
                line += ", ";
                if (typeof matrix[i][j] === "object") {
                    line += '{' + matrix[i][j].freeNumber.toString() + '}';
                } else
                    line += matrix[i][j];
            }
            console.log(line + ']');
        }
    }


}

;