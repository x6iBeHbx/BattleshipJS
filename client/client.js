var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create:create});

const positionX = 128;
const positionY = 128;

const ship4count = 1;
const ship3count = 2;
const ship2count = 3;
const ship1count = 4;

const ship4Length = 4;
const ship3Length = 3;
const ship2Length = 2;
const ship1Length = 1;

var areaMatrix = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];

var area;

var ships;
var tempShip4;
var tempShip3;

function preload() {

    var img = game.load.image('area', 'assets/area.png');
    var miss = game.load.image('miss', 'assets/miss.png');
    
    game.load.image('ship4', 'assets/ship4.png');
    game.load.image('ship3', 'assets/ship3.png');
}

function create() {
    area = game.add.sprite(positionX, positionY, 'area');
    area.inputEnabled = true;

    tempShip4 = game.add.sprite(500, 500, 'ship4');
    tempShip4.inputEnabled = true;
    tempShip4.events.onInputDown.add(tempShip4MouseDown, this);
    tempShip4.events.onInputUp.add(tempShip4MouseUp, this);
    tempShip4.isRotate = false;
    //tempShip4.input.enableSnap(32, 32, false, true);
    tempShip4.angle += 90;
    tempShip4.isRotate = true;

    tempShip3 = game.add.sprite(560, 560, 'ship3');
    tempShip3.inputEnabled = true;
    tempShip3.events.onInputDown.add(tempShip4MouseDown, this);
    tempShip3.events.onInputUp.add(tempShip4MouseUp, this);
    tempShip3.isRotate = false;
    //tempShip4.input.enableSnap(32, 32, false, true);

    area.events.onInputDown.add(mouseClicked, this);
}

function tempShip4MouseDown(sprite, pointer) {
    if(game.input.activePointer.leftButton.isDown){
        sprite.input.enableDrag();
    }else if(game.input.activePointer.rightButton.isDown){
        if(sprite.isRotate == true){
            sprite.angle -= 90;
            sprite.isRotate = false;
            sprite.x = sprite.x - 32;
        }else{
            sprite.angle += 90;
            sprite.isRotate = true;
            sprite.x = sprite.x + 32;
        }
    }
}


function tempShip4MouseUp(sprite, pointer) {
   
    var x = Math.floor((sprite.x - positionX)/32);
    var y = Math.floor((sprite.y - positionY)/32);

    var spriteX;
    var spriteY;
    var spriteWidth;
    var spriteHeight;
    if(sprite.isRotate == true){
        spriteWidth = sprite.height;
        spriteHeight = sprite.width;
        spriteX = sprite.x - spriteWidth;
        spriteY = sprite.y;
    }else {
        spriteWidth = sprite.width;
        spriteHeight = sprite.height;
        spriteX = sprite.x;
        spriteY = sprite.y;
    }
    
    
    if(spriteX >= 128 && spriteY >= 128 && (spriteX + spriteWidth) < (128 + 320 + 14) && (spriteY + spriteHeight) < (128 + 320 + 14)){
        sprite.input.enableSnap(32, 32, false, true);

        var x = Math.floor((spriteX - positionX)/32);
        var y = Math.floor((spriteY - positionY)/32);   

        addShipToAreaMatrix(sprite, x, y); 
        alert('x:' + x.toString() + ' y:' + y.toString());  
    }else {
        sprite.x = 500;
        sprite.y = 500;
    }
}

function addShipToAreaMatrix(sprite, x, y){
    switch(sprite.key){
        case "ship4":
            chooseByRotate(ship4Length, sprite, x, y);
            break;
        case "ship3":
            chooseByRotate(ship3Length, sprite, x, y);
            break;
        case "ship2":
            chooseByRotate(ship2Length, sprite, x, y);
            break;
        case "ship1":
            chooseByRotate(ship1Length, sprite, x, y);
            break;
    }
}

function chooseByRotate(count, sprite, x, y){
    if(sprite.isRotate){
        putShipByY(count, x, y);
    }else{
        putShipByX(count, x, y);
    }
}

function putShipByY(count, x, y){
    for(i=0; i < count; i++){
        areaMatrix[x][y + i] = 1;
    }
}

function putShipByX(count, x, y){
    for(i=0; i < count; i++){
        areaMatrix[x + i][y] = 1;
    }
}

function mouseClicked(sprite, pointer) {
    calculateClickCoordinate(pointer.x, pointer.y);
}

function calculateClickCoordinate(clickPosX, clickPosY){
    var x = Math.floor((clickPosX - positionX)/32);
    var y = Math.floor((clickPosY - positionY)/32);

    //here need send click coordinate to server
    
    //area.addChild(game.make.sprite(x*32, y*32, 'miss'));
    alert('x:' + x.toString() + ' y:' + y.toString());
}



