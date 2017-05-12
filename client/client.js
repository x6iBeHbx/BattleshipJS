var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create:create});

const positionX = 100;
const positionY = 100;

function preload() {

     var img = game.load.image('area', 'assets/area.png');
    img.crossOrigin = "Anonymous";
     
}

function create() {
    var area = game.add.sprite(positionX, positionY, 'area');
    area.inputEnabled = true;

    area.events.onInputDown.add(mouseClicked, this);
}

function mouseClicked(sprite, pointer) {
    calculateClickCoordinate(pointer.x, pointer.y);
}

function calculateClickCoordinate(clickPosX, clickPosY){
    var x = Math.floor((clickPosX - positionX)/32);
    var y = Math.floor((clickPosY - positionY)/32);
    alert('x:' + x.toString() + ' y:' + y.toString());
}

