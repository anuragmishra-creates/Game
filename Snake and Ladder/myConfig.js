export const snakeMap = [new Map(), new Map(), new Map(), new Map(), new Map()];
export const ladderMap = [new Map(), new Map(), new Map(), new Map(), new Map()];
export const snakeMapReversed = [new Map(), new Map(), new Map(), new Map(), new Map()];
export const ladderMapReversed = [new Map(), new Map(), new Map(), new Map(), new Map()];

/* Normal state of the board */
// Board 1:
snakeMap[0].set("8,10", { row: 10, col: 7 });
snakeMap[0].set("6,7", { row: 9, col: 8 });
snakeMap[0].set("5,5", { row: 9, col: 2 });
snakeMap[0].set("3,8", { row: 5, col: 10 });
snakeMap[0].set("2,2", { row: 6, col: 2 });
snakeMap[0].set("1,9", { row: 3, col: 6 });
snakeMap[0].set("1,3", { row: 5, col: 6 });

ladderMap[0].set("10,4", { row: 8, col: 5 });
ladderMap[0].set("8,1", { row: 7, col: 2 });
ladderMap[0].set("8,6", { row: 4, col: 7 });
ladderMap[0].set("6,3", { row: 3, col: 5 });
ladderMap[0].set("5,2", { row: 3, col: 1 });
ladderMap[0].set("3,10", { row: 2, col: 9 });

// Board 2:
snakeMap[1].set("8,8", { row: 10, col: 10 });
snakeMap[1].set("7,4", { row: 10, col: 3 });
snakeMap[1].set("6,8", { row: 9, col: 5 });
snakeMap[1].set("3,6", { row: 7, col: 9 });
snakeMap[1].set("1,7", { row: 3, col: 10 });
snakeMap[1].set("1,5", { row: 6, col: 2 });

ladderMap[1].set("10,4", { row: 5, col: 5 });
ladderMap[1].set("9,9", { row: 6, col: 10 });
ladderMap[1].set("9,7", { row: 5, col: 6 });
ladderMap[1].set("8,2", { row: 5, col: 3 });
ladderMap[1].set("6,1", { row: 3, col: 2 });
ladderMap[1].set("5,7", { row: 2, col: 8 });

// Board 3:
snakeMap[2].set("7,1", { row: 10, col: 3 });
snakeMap[2].set("1,2", { row: 6, col: 1 });
snakeMap[2].set("6,3", { row: 9, col: 3 });
snakeMap[2].set("1,6", { row: 3, col: 4 });
snakeMap[2].set("4,6", { row: 6, col: 5 });
snakeMap[2].set("5,7", { row: 7, col: 10 });
snakeMap[2].set("2,9", { row: 5, col: 8 });
snakeMap[2].set("8,7", { row: 10, col: 5 });

ladderMap[2].set("10,4", { row: 8, col: 5 });
ladderMap[2].set("9,8", { row: 6, col: 6 });
ladderMap[2].set("6,10", { row: 4, col: 9 });
ladderMap[2].set("4,2", { row: 2, col: 1 });
ladderMap[2].set("3,7", { row: 1, col: 9 });
ladderMap[2].set("6,2", { row: 4, col: 3 });

// Board 4:
snakeMap[3].set("9,5", { row: 10, col: 7 });
snakeMap[3].set("4,7", { row: 8, col: 10 });
snakeMap[3].set("1,8", { row: 4, col: 9 });
snakeMap[3].set("1,6", { row: 3, col: 6 });
snakeMap[3].set("1,2", { row: 3, col: 4 });
snakeMap[3].set("2,7", { row: 8, col: 4 });
snakeMap[3].set("4,3", { row: 9, col: 2 });
snakeMap[3].set("5,2", { row: 9, col: 4 });

ladderMap[3].set("3,2", { row: 1, col: 1 });
ladderMap[3].set("3,5", { row: 1, col: 4 });
ladderMap[3].set("4,8", { row: 2, col: 8 });
ladderMap[3].set("5,5", { row: 4, col: 4 });
ladderMap[3].set("8,5", { row: 5, col: 7 });
ladderMap[3].set("8,8", { row: 5, col: 10 });
ladderMap[3].set("9,3", { row: 7, col: 4 });
ladderMap[3].set("10,9", { row: 8, col: 7 });

// Board 5:
snakeMap[4].set("9,5", { row: 10, col: 6 });
snakeMap[4].set("6,7", { row: 8, col: 6 });
snakeMap[4].set("6,9", { row: 9, col: 10 });
snakeMap[4].set("5,5", { row: 5, col: 8 });
snakeMap[4].set("4,2", { row: 9, col: 2 });
snakeMap[4].set("4,4", { row: 5, col: 1 });
snakeMap[4].set("2,7", { row: 8, col: 4 });
snakeMap[4].set("1,3", { row: 3, col: 3 });
snakeMap[4].set("1,6", { row: 3, col: 6 });
snakeMap[4].set("1,8", { row: 3, col: 8 });

ladderMap[4].set("10,2", { row: 7, col: 3 });
ladderMap[4].set("10,4", { row: 9, col: 7 });
ladderMap[4].set("10,9", { row: 7, col: 10 });
ladderMap[4].set("8,1", { row: 6, col: 2 });
ladderMap[4].set("8,8", { row: 2, col: 4 });
ladderMap[4].set("7,4", { row: 6, col: 3 });
ladderMap[4].set("5,10", { row: 4, col: 7 });
ladderMap[4].set("3,2", { row: 1, col: 1 });
ladderMap[4].set("3,9", { row: 1, col: 10 });


/* Reversed state of the board */
// Board 1:
snakeMapReversed[0].set("10,7", { row: 8, col: 10 });
snakeMapReversed[0].set("9,8", { row: 6, col: 7 });
snakeMapReversed[0].set("9,2", { row: 5, col: 5 });
snakeMapReversed[0].set("5,10", { row: 3, col: 8 });
snakeMapReversed[0].set("6,2", { row: 2, col: 2 });
snakeMapReversed[0].set("3,6", { row: 1, col: 9 });
snakeMapReversed[0].set("5,6", { row: 1, col: 3 });

ladderMapReversed[0].set("8,5", { row: 10, col: 4 });
ladderMapReversed[0].set("7,2", { row: 8, col: 1 });
ladderMapReversed[0].set("4,7", { row: 8, col: 6 });
ladderMapReversed[0].set("3,5", { row: 6, col: 3 });
ladderMapReversed[0].set("3,1", { row: 5, col: 2 });
ladderMapReversed[0].set("2,9", { row: 3, col: 10 });

// Board 2:
snakeMapReversed[1].set("10,10", { row: 8, col: 8 });
snakeMapReversed[1].set("10,3", { row: 7, col: 4 });
snakeMapReversed[1].set("9,5", { row: 6, col: 8 });
snakeMapReversed[1].set("7,9", { row: 3, col: 6 });
snakeMapReversed[1].set("3,10", { row: 1, col: 7 });
snakeMapReversed[1].set("6,2", { row: 1, col: 5 });

ladderMapReversed[1].set("5,5", { row: 10, col: 4 });
ladderMapReversed[1].set("6,10", { row: 9, col: 9 });
ladderMapReversed[1].set("5,6", { row: 9, col: 7 });
ladderMapReversed[1].set("5,3", { row: 8, col: 2 });
ladderMapReversed[1].set("3,2", { row: 6, col: 1 });
ladderMapReversed[1].set("2,8", { row: 5, col: 7 });

// Board 3:
snakeMapReversed[2].set("10,3", { row: 7, col: 1 });
snakeMapReversed[2].set("6,1", { row: 1, col: 2 });
snakeMapReversed[2].set("9,3", { row: 6, col: 3 });
snakeMapReversed[2].set("3,4", { row: 1, col: 6 });
snakeMapReversed[2].set("6,5", { row: 4, col: 6 });
snakeMapReversed[2].set("7,10", { row: 5, col: 7 });
snakeMapReversed[2].set("5,8", { row: 2, col: 9 });
snakeMapReversed[2].set("10,5", { row: 8, col: 7 });

ladderMapReversed[2].set("8,5", { row: 10, col: 4 });
ladderMapReversed[2].set("6,6", { row: 9, col: 8 });
ladderMapReversed[2].set("4,9", { row: 6, col: 10 });
ladderMapReversed[2].set("2,1", { row: 4, col: 2 });
ladderMapReversed[2].set("1,9", { row: 3, col: 7 });
ladderMapReversed[2].set("4,3", { row: 6, col: 2 });

// Board 4:
snakeMapReversed[3].set("10,7", { row: 9, col: 5 });
snakeMapReversed[3].set("8,10", { row: 4, col: 7 });
snakeMapReversed[3].set("4,9", { row: 1, col: 8 });
snakeMapReversed[3].set("3,6", { row: 1, col: 6 });
snakeMapReversed[3].set("3,4", { row: 1, col: 2 });
snakeMapReversed[3].set("8,4", { row: 2, col: 7 });
snakeMapReversed[3].set("9,2", { row: 4, col: 3 });
snakeMapReversed[3].set("9,4", { row: 5, col: 2 });

ladderMapReversed[3].set("1,1", { row: 3, col: 2 });
ladderMapReversed[3].set("1,4", { row: 3, col: 5 });
ladderMapReversed[3].set("2,8", { row: 4, col: 8 });
ladderMapReversed[3].set("4,4", { row: 5, col: 5 });
ladderMapReversed[3].set("5,7", { row: 8, col: 5 });
ladderMapReversed[3].set("5,10", { row: 8, col: 8 });
ladderMapReversed[3].set("7,4", { row: 9, col: 3 });
ladderMapReversed[3].set("8,7", { row: 10, col: 9 });

// Board 5:
snakeMapReversed[4].set("10,6", { row: 9, col: 5 });
snakeMapReversed[4].set("8,6", { row: 6, col: 7 });
snakeMapReversed[4].set("9,10", { row: 6, col: 9 });
snakeMapReversed[4].set("5,8", { row: 5, col: 5 });
snakeMapReversed[4].set("9,2", { row: 4, col: 2 });
snakeMapReversed[4].set("5,1", { row: 4, col: 4 });
snakeMapReversed[4].set("8,4", { row: 2, col: 7 });
snakeMapReversed[4].set("3,3", { row: 1, col: 3 });
snakeMapReversed[4].set("3,6", { row: 1, col: 6 });
snakeMapReversed[4].set("3,8", { row: 1, col: 8 });

ladderMapReversed[4].set("7,3", { row: 10, col: 2 });
ladderMapReversed[4].set("9,7", { row: 10, col: 4 });
ladderMapReversed[4].set("7,10", { row: 10, col: 9 });
ladderMapReversed[4].set("6,2", { row: 8, col: 1 });
ladderMapReversed[4].set("2,4", { row: 8, col: 8 });
ladderMapReversed[4].set("6,3", { row: 7, col: 4 });
ladderMapReversed[4].set("4,7", { row: 5, col: 10 });
ladderMapReversed[4].set("1,1", { row: 3, col: 2 });
ladderMapReversed[4].set("1,10", { row: 3, col: 9 });
