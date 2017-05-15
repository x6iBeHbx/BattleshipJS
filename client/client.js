var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create:create});

const positionX = 100;
const positionY = 100;

var area;

function preload() {

    var img = game.load.image('area', 'assets/area.png');
    var miss = game.load.image('miss', 'assets/miss.png'); 
}

function create() {
    area = game.add.sprite(positionX, positionY, 'area');
    area.inputEnabled = true;

    area.events.onInputDown.add(mouseClicked, this);
}

function mouseClicked(sprite, pointer) {
    calculateClickCoordinate(pointer.x, pointer.y);
}

function calculateClickCoordinate(clickPosX, clickPosY){
    var x = Math.floor((clickPosX - positionX)/32);
    var y = Math.floor((clickPosY - positionY)/32);

    area.addChild(game.make.sprite(x*32, y*32, 'miss'));
    //area.add.sprite((x*32), (y*32), "miss");
    alert('x:' + x.toString() + ' y:' + y.toString());
}

