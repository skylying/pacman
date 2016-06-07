/*jslint browser: true, undef: true, eqeqeq: true, nomen: true, white: true */
/*global window: false, document: false */

/*
 * fix looped audio
 * add fruits + levels
 * fix what happens when a ghost is eaten (should go back to base)
 * do proper ghost mechanics (blinky/wimpy etc)
 */

Pacman.Map = function (size) {

    var height    = null,
        width     = null,
        blockSize = size,
        pillMin   = 8,
        pillMax   = 16,
        pillStep  = 0.4,
        pillSize  = pillMin,
        map       = null;

    function withinBounds(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width;
    }

    function isWall(pos) {
        return withinBounds(pos.y, pos.x) && map[pos.y][pos.x] === Pacman.WALL;
    }

    function isFloorSpace(pos) {
        if (!withinBounds(pos.y, pos.x)) {
            return false;
        }
        var piece = map[pos.y][pos.x];
        return piece === Pacman.EMPTY || 
            piece === Pacman.BISCUIT ||
            piece === Pacman.PILL ||
            piece === Pacman.TBALL;
    }

    function drawWall(ctx) {

        var i, j, p, line;

        ctx.strokeStyle = "#777";
        ctx.lineWidth   = 5;
        ctx.lineCap     = "round";

        for (i = 0; i < Pacman.WALLS.length; i += 1) {
            line = Pacman.WALLS[i];
            ctx.beginPath();

            for (j = 0; j < line.length; j += 1) {

                p = line[j];

                if (p.move) {
                    ctx.moveTo(p.move[0] * blockSize, p.move[1] * blockSize);
                } else if (p.line) {
                    ctx.lineTo(p.line[0] * blockSize, p.line[1] * blockSize);
                } else if (p.curve) {
                    ctx.quadraticCurveTo(p.curve[0] * blockSize,
                                         p.curve[1] * blockSize,
                                         p.curve[2] * blockSize,
                                         p.curve[3] * blockSize);
                }
            }
            ctx.stroke();
        }
    }

    function reset() {
        map    = Pacman.MAP.clone();
        height = map.length;
        width  = map[0].length;
    };

    function block(pos) {
        return map[pos.y][pos.x];
    };

    function setBlock(pos, type) {
        map[pos.y][pos.x] = type;
    };

    function drawPills(ctx) {
        var img = document.getElementById('tball');

        pillSize += pillStep;
        if ((pillSize > pillMax) || (pillSize < pillMin)) {
            pillStep = -pillStep;
        }

        for (i = 0; i < height; i += 1) {
		    for (j = 0; j < width; j += 1) {
                var piece = map[i][j];

                if (piece === Pacman.PILL) {
                    ctx.beginPath();

                    ctx.fillStyle = "#FFF";
                    ctx.fillRect((j * blockSize), (i * blockSize), 
                            blockSize, blockSize);

                    ctx.fillStyle = "#222";
                    ctx.arc((j * blockSize) + blockSize / 2,
                            (i * blockSize) + blockSize / 2,
                            Math.abs((pillSize - pillMin) / 2), 
                            0, 
                            Math.PI * 2, false); 
                    ctx.fill();
                    ctx.closePath();
                }

                if (piece === Pacman.TBALL) {
                    ctx.beginPath();
                    ctx.fillStyle = "#FFF";
		            ctx.fillRect((j * blockSize), (i * blockSize),
                                 blockSize, blockSize);
                    ctx.closePath();

                    ctx.drawImage(
                        img,
                        j * blockSize + (pillMax - pillSize) / 2,
                        i * blockSize + (pillMax - pillSize) / 2,
                        pillSize, pillSize);
                }
		    }
	    }
    };

    function draw(ctx) {

        var i, j, size = blockSize;

        ctx.fillStyle = "#FFF";
	    ctx.fillRect(0, 0, width * size, height * size);

        drawWall(ctx);

        for (i = 0; i < height; i += 1) {
		    for (j = 0; j < width; j += 1) {
			    drawBlock(i, j, ctx);
		    }
	    }
    };

    function drawBlock(y, x, ctx) {

        var layout = map[y][x];

        if (layout === Pacman.PILL || layout === Pacman.TBALL) {
            return;
        }

        ctx.beginPath();
        
        if (layout === Pacman.EMPTY ||
            layout === Pacman.BLOCK ||
            layout === Pacman.BISCUIT) {

            ctx.fillStyle = "#FFF";
		    ctx.fillRect((x * blockSize), (y * blockSize),
                         blockSize, blockSize);

            if (layout === Pacman.BISCUIT) {
                ctx.fillStyle = "#000";
		        ctx.fillRect((x * blockSize) + (blockSize / 2.5),
                             (y * blockSize) + (blockSize / 2.5),
                             blockSize / 6, blockSize / 6);
	        }
        }
        ctx.closePath();
    };

    reset();

    return {
        "draw"         : draw,
        "drawBlock"    : drawBlock,
        "drawPills"    : drawPills,
        "block"        : block,
        "setBlock"     : setBlock,
        "reset"        : reset,
        "isWallSpace"  : isWall,
        "isFloorSpace" : isFloorSpace,
        "height"       : height,
        "width"        : width,
        "blockSize"    : blockSize
    };
};
