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

var ships;

var ship4;
var ship3_1;
var ship3_1;
var ship3_1;


function loadBattleField(){
    var img = game.load.image('area', 'assets/area.png');
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
    ship4 = game.add.sprite(128 + 32*10 + 20, 128, 'ship4');
    
    ship3_1 = game.add.sprite(128 + 32*10 + 20, 128 + 32 + 20, 'ship3');
    ship3_2 = game.add.sprite(128 + 32*10 + 32 * 3 + 40, 128 + 32 + 20, 'ship3');
    
    ship2_1 = game.add.sprite(128 + 32*10 + 20, 128 + 32*2 + 40, 'ship2');
    ship2_2 = game.add.sprite(128 + 32*10 + 32 * 2 + 40, 128 + 32*2 + 40, 'ship2');
    ship2_3 = game.add.sprite(128 + 32*10 + 32 * 4 + 60, 128 + 32*2 + 40, 'ship2');

    ships = [ship4, ship3_1, ship3_2, ship2_1, ship2_2, ship2_3];

    addLestenerToShips();
}

function addLestenerToShips(){

    for(var i = 0; i < ships.length; i++){
        ships[i].inputEnabled = true;
        ships[i].events.onInputDown.add(onShipMouseDown, this);
        ships[i].events.onInputUp.add(onShipMouseUp, this);
        ships[i].isRotate = false;
    }
}



function onShipMouseDown(sprite, pointer) {
    if(game.input.activePointer.leftButton.isDown){
        sprite.input.enableDrag();
    }else if(game.input.activePointer.rightButton.isDown){
        sprite.input.disableDrag();
        if(sprite.isRotate == true){
            sprite.anchor.setTo(0.5, 0);
            sprite.angle -= 90;
            sprite.isRotate = false;
            sprite.x = sprite.x - 32; //use const
            sprite.anchor.setTo(0);
        }else{
            sprite.anchor.setTo(0, 0.5);
            sprite.angle += 90;
            sprite.isRotate = true;
            sprite.x = sprite.x + 32;// use const
            sprite.anchor.setTo(0);
        }
    }
}


function onShipMouseUp(sprite, pointer) {

    var x = Math.floor((sprite.x - prepareFieldPosX)/32);
    var y = Math.floor((sprite.y - prepareFieldPosY)/32);

    var spriteX;
    var spriteY;
    var spriteWidth;
    var spriteHeight;
    if(sprite.isRotate == true){
        spriteWidth = sprite.height;
        spriteHeight = sprite.width;
        spriteX = sprite.x - 32; // use const
        spriteY = sprite.y;
    }else {
        spriteWidth = sprite.width;
        spriteHeight = sprite.height;
        spriteX = sprite.x;
        spriteY = sprite.y;
    }
    
    
    if(spriteX >= 128 && spriteY >= 128 && (spriteX + spriteWidth) < (128 + 320 + 14) && (spriteY + spriteHeight) < (128 + 320 + 14)){
        sprite.input.enableSnap(32, 32, false, true);

        var x = Math.floor((spriteX - prepareFieldPosX)/32);
        var y = Math.floor((spriteY - prepareFieldPosY)/32);   

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
        playerBattleMatrix[x][y + i] = 1;
    }
}

function putShipByX(count, x, y){
    for(i=0; i < count; i++){
        playerBattleMatrix[x + i][y] = 1;
    }
}

function mouseClicked(sprite, pointer) {
    calculateClickCoordinate(pointer.x, pointer.y);
}

function calculateClickCoordinate(clickPosX, clickPosY){
    var x = Math.floor((clickPosX - prepareFieldPosX)/32);
    var y = Math.floor((clickPosY - prepareFieldPosY)/32);

    //here need send click coordinate to server
    
    //area.addChild(game.make.sprite(x*32, y*32, 'miss'));
    alert('x:' + x.toString() + ' y:' + y.toString());
}



