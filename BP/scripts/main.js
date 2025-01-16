/**
* Just a quick message since you're looking here:
* 
* Even if this does not seem like a lot, this took MANY hours to complete 
* so please don't take the files and claim them as your own! Give credit!
* 
* Thank you,
* Retr089
*/

import { world, BlockPermutation, Block } from '@minecraft/server'

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent('retr_glass:clear_glass', {
        onPlace(placeEv) {
            for (const block of cardinalBlocks(placeEv.block)) {
                const { up, down, north, east, south, west } = cardinalBlocksEqual(block);
                updateGlass(block, up, down, north, east, south, west);
            }
        },
        onPlayerDestroy(destroyEv) {
            for (const block of cardinalBlocks(destroyEv.block, destroyEv.destroyedBlockPermutation.type.id)) {
                const { up, down, north, east, south, west } = cardinalBlocksEqual(block);
                updateGlass(block, up, down, north, east, south, west);
            }
        }
    })
})

/**
 * 
 * @param {Block} block
 * @param {number} texture_index
 */
function changePermutation(block, texture_index, sub_index = 0) {
    if (texture_index < 0 || texture_index > 15 || sub_index < 0 || sub_index > 15) throw new Error('Out of bounds!');
    block.setPermutation(BlockPermutation.resolve(block.typeId, { "retr_glass:texture_index": texture_index, "retr_glass:sub_index": sub_index }));
}

/**
 * 
 * @param {Block} block
 */
function cardinalBlocksEqual(block) {
    const up = block.above()?.typeId == block.typeId ? true : false;
    const down = block.below()?.typeId == block.typeId ? true : false;
    const north = block.north()?.typeId == block.typeId ? true : false;
    const east = block.east()?.typeId == block.typeId ? true : false;
    const south = block.south()?.typeId == block.typeId ? true : false;
    const west = block.west()?.typeId == block.typeId ? true : false;
    return { up: up, down: down, north: north, east: east, south: south, west: west };
}

/**
    * Cardinally grab blocks around an existing block
    * @param {Block} block
    * @returns {Block[]}
    */
function cardinalBlocks(block, id = '') {
    const { x, y, z } = block.location;
    const blocks = [];
    const range = [-1, 0, 1];
    for (const dx of range) {
        for (const dy of range) {
            for (const dz of range) {
                if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 1) continue;
                const fetchBlock = block.dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
                if (fetchBlock && fetchBlock.typeId == (id != '' ? id : block.typeId)) blocks.push(fetchBlock);
            }
        }
    }
    return blocks;
}

/**
 * 
 * @param {Block} block
 * @param {boolean} up
 * @param {boolean} down
 * @param {boolean} north
 * @param {boolean} east
 * @param {boolean} south
 * @param {boolean} west
 */
function updateGlass(block, up, down, north, east, south, west) {
    if (!up && !down && !north && !east && !south && !west) {
        changePermutation(block, 0); //No Neighbors
    } else if (!up && !down && !north && east && !south && !west) {
        changePermutation(block, 1); //East
    } else if (!up && !down && !north && !east && south && !west) {
        changePermutation(block, 2); //South
    } else if (!up && !down && !north && !east && !south && west) {
        changePermutation(block, 3); //West
    } else if (!up && !down && north && !east && !south && !west) {
        changePermutation(block, 4); //North

    } else if (!up && !down && north && east && !south && !west) {
        changePermutation(block, 5); //North-East
    } else if (!up && !down && !north && east && south && !west) {
        changePermutation(block, 6); //East-South
    } else if (!up && !down && !north && !east && south && west) {
        changePermutation(block, 7); //South-West
    } else if (!up && !down && north && !east && !south && west) {
        changePermutation(block, 8); //West-North

    } else if (!up && !down && north && east && south && !west) {
        changePermutation(block, 9); //North-East-South
    } else if (!up && !down && !north && east && south && west) {
        changePermutation(block, 10); //East-South-West
    } else if (!up && !down && north && !east && south && west) {
        changePermutation(block, 11); //South-West-North
    } else if (!up && !down && north && east && !south && west) {
        changePermutation(block, 12); //West-North-East

    } else if (!up && !down && north && east && south && west) {
        changePermutation(block, 13); //Cardinal

    } else if (!up && down && north && east && south && west) {
        changePermutation(block, 14); //Excluding Up
    } else if (up && !down && north && east && south && west) {
        changePermutation(block, 15); //Excluding down

    } else if (up && down && north && east && south && west) {
        changePermutation(block, 0, 1); //All

    } else if (up && !down && !north && !east && !south && !west) {
        changePermutation(block, 1, 1); //Up
    } else if (!up && down && !north && !east && !south && !west) {
        changePermutation(block, 2, 1); //Down

    } else if (up && down && !north && !east && !south && !west) {
        changePermutation(block, 3, 1); //Up-Down
    } else if (!up && !down && north && !east && south && !west) {
        changePermutation(block, 4, 1); //North-South
    } else if (!up && !down && !north && east && !south && west) {
        changePermutation(block, 5, 1); //East-West

    } else if (!up && down && north && !east && !south && !west) {
        changePermutation(block, 6, 1); //North-Down
    } else if (up && !down && north && !east && !south && !west) {
        changePermutation(block, 7, 1); //North-Up
    } else if (!up && down && !north && !east && south && !west) {
        changePermutation(block, 8, 1); //South-Down
    } else if (up && !down && !north && !east && south && !west) {
        changePermutation(block, 9, 1); //South-Up

    } else if (!up && down && !north && east && !south && !west) {
        changePermutation(block, 10, 1); //East-Down
    } else if (up && !down && !north && east && !south && !west) {
        changePermutation(block, 11, 1); //East-Up
    } else if (!up && down && !north && !east && !south && west) {
        changePermutation(block, 12, 1); //West-Down
    } else if (up && !down && !north && !east && !south && west) {
        changePermutation(block, 13, 1); //West-Up

    } else if (up && down && !north && east && !south && west) {
        changePermutation(block, 14, 1); //Up-Down-East-West
    } else if (up && down && north && !east && south && !west) {
        changePermutation(block, 15, 1); //Up-Down-North-South

    } else if (up && down && !north && east && !south && !west) {
        changePermutation(block, 0, 2); //Up-Down-East
    } else if (up && down && !north && !east && !south && west) {
        changePermutation(block, 1, 2); //Up-Down-West
    } else if (up && down && north && !east && !south && !west) {
        changePermutation(block, 2, 2); //Up-Down-North
    } else if (up && down && !north && !east && south && !west) {
        changePermutation(block, 3, 2); //Up-Down-South

    } else if (!up && down && north && !east && south && !west) {
        changePermutation(block, 4, 2); //North-Down-South
    } else if (up && !down && north && !east && south && !west) {
        changePermutation(block, 5, 2); //North-Up-South
    } else if (up && !down && !north && east && !south && west) {
        changePermutation(block, 6, 2); //East-Up-West
    } else if (!up && down && !north && east && !south && west) {
        changePermutation(block, 7, 2); //East-Down-West

    } else if (!up && down && north && east && !south && west) {
        changePermutation(block, 8, 2); //North-Down-East-West
    } else if (!up && down && !north && east && south && west) {
        changePermutation(block, 9, 2); //South-Down-East-West
    } else if (up && !down && !north && east && south && west) {
        changePermutation(block, 10, 2);//South-Up-East-West
    } else if (up && !down && north && east && !south && west) {
        changePermutation(block, 11, 2);//North-Up-East-West

    } else if (!up && down && north && east && !south && !west) {
        changePermutation(block, 12, 2);//North-East-Down
    } else if (!up && down && north && !east && !south && west) {
        changePermutation(block, 13, 2);//North-West-Down
    } else if (up && !down && north && !east && !south && west) {
        changePermutation(block, 14, 2);//North-West-Up
    } else if (up && !down && north && east && !south && !west) {
        changePermutation(block, 15, 2);//North-East-Up

    } else if (!up && down && !north && !east && south && west) {
        changePermutation(block, 0, 3);//South-Down-West
    } else if (!up && down && !north && east && south && !west) {
        changePermutation(block, 1, 3);//South-Down-East
    } else if (up && !down && !north && east && south && !west) {
        changePermutation(block, 2, 3);//South-Up-East
    } else if (up && !down && !north && !east && south && west) {
        changePermutation(block, 3, 3);//South-Up-West

    } else if (!up && down && north && east && south && !west) {
        changePermutation(block, 4, 3)//North-East-South-Down
    } else if (up && !down && north && east && south && !west) {
        changePermutation(block, 5, 3)//North-East-South-Up
    } else if (up && !down && north && !east && south && west) {
        changePermutation(block, 6, 3)//North-West-South-Up
    } else if (!up && down && north && !east && south && west) {
        changePermutation(block, 7, 3)//North-West-South-Down

    } else if (up && down && !north && east && south && !west) {
        changePermutation(block, 8, 3)//East-South-Up-Down
    } else if (up && down && !north && !east && south && west) {
        changePermutation(block, 9, 3)//South-West-Up-Down
    } else if (up && down && north && !east && !south && west) {
        changePermutation(block, 10, 3)//West-North-Up-Down
    } else if (up && down && north && east && !south && !west) {
        changePermutation(block, 11, 3)//North-East-Up-Down

    } else if (up && down && !north && east && south && west) {
        changePermutation(block, 12, 3)//East-South-West-Up-Down
    } else if (up && down && north && !east && south && west) {
        changePermutation(block, 13, 3)//South-West-North-Up-Down
    } else if (up && down && north && east && !south && west) {
        changePermutation(block, 14, 3)//West-North-East-Up-Down
    } else if (up && down && north && east && south && !west) {
        changePermutation(block, 15, 3)//North-East-South-Up-Down
    }
}