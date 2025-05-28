export const snakeMap = [new Map(), new Map(), new Map(), new Map()];
export const ladderMap = [new Map(), new Map(), new Map(), new Map()];

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
