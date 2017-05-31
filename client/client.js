document.oncontextmenu = function (){return false};

// var socket = io('http://localhost:3030');
//   socket.on('connect', function(){});
//   socket.on('event', function(data){});
//   socket.on('disconnect', function(){});

var socket = io();
// ------------------ MAIN-------------------------------------
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create:create});

function preload() {
    // function use in this locate in "client.js"
    loadBattleField();
    loadFightAnim();
    loadShipsImage();
}

function create() {
    addPrepareFieldToStage();
    createShips();
}
// ------------------------------------------------------------

var playerBattleMatrix = [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];

var prepareField;
var readyForBattleBtn;

var ships;

var ship4_1;
var ship3_1;
var ship3_2;
var ship2_1;
var ship2_2;
var ship2_3;
var ship1_1;
var ship1_2;
var ship1_3;
var ship1_4;

var shipsOnPosition = 0;

function loadBattleField(){
    game.load.image('area', 'assets/area.png');
    game.load.image('readyForBattleBtn', 'assets/ReadyForBattleBtn.png');
}

function loadFightAnim(){
    var miss = game.load.image('miss', 'assets/miss.png');
    var hit = game.load.image('hit', 'assets/hit.png');
}

function loadShipsImage(){
    game.load.image('ship4', 'assets/ship4.png');
    game.load.image('ship3', 'assets/ship3.png');
    game.load.image('ship2', 'assets/ship2.png');
    game.load.image('ship1', 'assets/ship1.png');
}

function addPrepareFieldToStage(){
    prepareField = game.add.sprite(prepareFieldPosX, prepareFieldPosY, 'area');
    prepareField.inputEnabled = true;
}

function createShips(){
    addShipToArea();
    prepareField.events.onInputDown.add(mouseClicked, this);
}

function addShipToArea(){

    ship4_1 = game.add.sprite(prepareFieldPosX + blockLength*blockCount + 20, prepareFieldPosY, 'ship4');

    ship3_1 = game.add.sprite(prepareFieldPosX + blockLength*blockCount + 20, prepareFieldPosY + blockLength + 20, 'ship3');
    ship3_2 = game.add.sprite(ship3_1.position.x + ship3XLength + 20, prepareFieldPosY + blockLength + 20, 'ship3');
    
    ship2_1 = game.add.sprite(prepareFieldPosX + blockLength*blockCount + 20, prepareFieldPosY + 32*2 + 40, 'ship2');
    ship2_2 = game.add.sprite(ship2_1.position.x + ship2XLength + 20, prepareFieldPosY + blockLength*2 + 40, 'ship2');
    ship2_3 = game.add.sprite(ship2_2.position.x + ship2XLength + 20, prepareFieldPosY + blockLength*2 + 40, 'ship2');

    ship1_1 = game.add.sprite(prepareFieldPosX + blockLength*blockCount + 20, prepareFieldPosY + 32*3 + 60, 'ship1');
    ship1_2 = game.add.sprite(ship1_1.position.x + blockLength + 20, prepareFieldPosY + blockLength*3 + 60, 'ship1');
    ship1_3 = game.add.sprite(ship1_2.position.x + blockLength + 20, prepareFieldPosY + blockLength*3 + 60, 'ship1');
    ship1_4 = game.add.sprite(ship1_3.position.x + blockLength + 20, prepareFieldPosY + blockLength*3 + 60, 'ship1');

    readyForBattleBtn = game.add.sprite(prepareFieldPosX + blockLength*blockCount + 20, ship1_1.position.y + blockLength + 20, 'readyForBattleBtn');
    
    ships = [ship4_1, ship3_1, ship3_2, ship2_1, ship2_2, ship2_3, ship1_1, ship1_2, ship1_3, ship1_4];

    addListenerToShips();
    readyForBattleBtn.inputEnabled = true;
    readyForBattleBtn.events.onInputDown.add(readyForBattleBtnClicked, this);
}

function addListenerToShips(){

    for(var i = 0; i < ships.length; i++){
        ships[i].inputEnabled = true;
        ships[i].events.onInputDown.add(onShipMouseDown, this);
        ships[i].events.onInputUp.add(onShipMouseUp, this);
        ships[i].isRotate = false;
        ships[i].onBattleField = false;
        ships[i].positionInMatrix = [];
    }
}

function onShipMouseDown(sprite, pointer) {
    if(sprite.onBattleField){
        clearShipFromBattleFieldMatrix(sprite);
    }
    
    if(game.input.activePointer.leftButton.isDown){
        sprite.input.enableDrag();
    }else if(game.input.activePointer.rightButton.isDown){
        sprite.input.disableDrag();
        rightMouseBtnDown(sprite, pointer);
    }
}

function onShipMouseUp(sprite, pointer) {

    if(game.input.activePointer.leftButton.isUp){
        leftMouseBtnUp(sprite, pointer);
    }else if(game.input.activePointer.rightButton.isUp){ // перенести в маус ап тогда можно будет применить логику проверки на свободное поле на матрице
    }
}

function leftMouseBtnUp(sprite, pointer){
    var x = Math.round((sprite.x - prepareFieldPosX)/blockLength);
    var y = Math.round((sprite.y - prepareFieldPosY)/blockLength);

    var spriteX;
    var spriteY;
    var spriteWidth;
    var spriteHeight;
    if(sprite.isRotate == true){
        spriteWidth = sprite.height;
        spriteHeight = sprite.width;
        spriteX = sprite.x - blockLength; // use const
        spriteY = sprite.y;
    }else {
        spriteWidth = sprite.width;
        spriteHeight = sprite.height;
        spriteX = sprite.x;
        spriteY = sprite.y;
    }
    
    
    if(spriteX >= 128 && spriteY >= 128 && 
        (spriteX + spriteWidth) < (128 + 320 + blockLength/2) && 
        (spriteY + spriteHeight) < (128 + 320 + blockLength/2) &&
        isPositionFreeForShip(getShipLengthByKey(sprite), sprite, x, y)){

        if(!sprite.onBattleField){
            shipsOnPosition++;
        }
        
        sprite.input.enableSnap(blockLength, blockLength, false, true);
        sprite.onBattleField = true;
        addShipToBattleFieldMatrix(sprite, x, y); 
    }else {
        if(sprite.onBattleField){
            shipsOnPosition--;
        }
        
        sprite.onBattleField = false;
        sprite.x = 500;
        sprite.y = 500;
    }
}

function rightMouseBtnDown(sprite, pointer){
    if(sprite.isRotate == true){
        sprite.anchor.setTo(0.5, 0);
        sprite.angle -= 90;
        sprite.isRotate = false;
        sprite.x = sprite.x - blockLength; //use const
        sprite.anchor.setTo(0);
    }else {
        sprite.anchor.setTo(0, 0.5);
        sprite.angle += 90;
        sprite.isRotate = true;
        sprite.x = sprite.x + blockLength;// use const
        sprite.anchor.setTo(0);
    }
}

function readyForBattleBtnClicked(sprite, pointer){
    //нужно подключить логику когда если корабль на поле и я на негокликаю то при маус даун происходит -1 к количеству кораблей на поле
    if(shipsOnPosition >= ships.length){
        var readyForBattleProtocol = {
            player: "Andrey",
            level: 2,
            shipsInfo: [
                {   
                    key:"ship4",
                    shipLength: 4,
                    x: 0,
                    y: 0,
                    isRotate: false 
                }
            ]
        };

        socket.emit('clientEvent', readyForBattleProtocol);
        alert("Карсава ждем противника!");
    }else {
        alert("Нужно поставить на поле все корабли!!!");
    }
}

function addShipToBattleFieldMatrix(sprite, x, y){
    
    imposeByRotate(getShipLengthByKey(sprite), sprite, x, y);
}

function clearShipFromBattleFieldMatrix(sprite, x, y){
    switch(sprite.key){
        case "ship4":
            clearShipFromMatrix(sprite);
            break;
        case "ship3":
            clearShipFromMatrix(sprite);
            break;
        case "ship2":
            clearShipFromMatrix(sprite);
            break;
        case "ship1":
            clearShipFromMatrix(sprite);
            break;
    }
}

function getShipLengthByKey(sprite){
    var result;
    switch(sprite.key){
        case "ship4":
            result = ship4Length;
            break;
        case "ship3":
            result = ship3Length;
            break;
        case "ship2":
            result = ship2Length;
            break;
        case "ship1":
            result = ship1Length;
            break;
    }
    return result;
}
//---------------------------------------------------------------------
function imposeByRotate(count, sprite, x, y){
    if(sprite.isRotate){
        imposeShipByY(count, sprite, x - 1, y);
    }else{
        imposeShipByX(count, sprite, x, y);
    }
}

function imposeShipByY(count, sprite, x, y){
    for(i=0; i < count; i++){
        sprite.positionInMatrix.push([x,y + i]);
        playerBattleMatrix[x][y + i] = 1;
    }
}

function imposeShipByX(count, sprite, x, y){
    for(i=0; i < count; i++){
        sprite.positionInMatrix.push([x + i,y]);
        playerBattleMatrix[x + i][y] = 1;
    }
}

function clearShipFromMatrix(sprite){
    for(var i = 0; i < sprite.positionInMatrix.length; i++){
        playerBattleMatrix[sprite.positionInMatrix[i][0]][sprite.positionInMatrix[i][1]] = 0;
    }
}
//---------------------------------------------------------------------

function isPositionFreeForShip(count, sprite, x, y){
    
    for(i=0; i < count; i++){
        if(sprite.isRotate){
            if(playerBattleMatrix[x][y + i] == 1){
                return false;
            }
        }else {
            if(playerBattleMatrix[x + i][y] == 1){
                return false;
            }
        }
    }
    return true;
}

function mouseClicked(sprite, pointer) {
    calculateClickCoordinate(pointer.x, pointer.y);
}

function calculateClickCoordinate(clickPosX, clickPosY){
    var x = Math.floor((clickPosX - prepareFieldPosX)/32);
    var y = Math.floor((clickPosY - prepareFieldPosY)/32);

    //here need send click coordinate to server
    
    //area.addChild(game.make.sprite(x*32, y*32, 'miss'));
    // alert('x:' + x.toString() + ' y:' + y.toString());
}



