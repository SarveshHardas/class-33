const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground,rope,fruit,bunny;

function preload()
{
  bgImg=loadImage("background.png");
  wMelon=loadImage("melon.png");
  rabbitImg=loadImage("Rabbit-01.png");
  blinkAni = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eatAni = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sadAni = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blinkAni.playing = true;
  eatAni.playing = true;
  sadAni.playing = true;

  sadAni.looping = false;
  eatAni.looping = false;

  bgSnd = loadSound("sound1.mp3");
  airSnd = loadSound("air.wav");
  ropeCutSnd = loadSound("rope_cut.mp3");
  sadSnd = loadSound("sad.wav");
  eatingSnd = loadSound("eating_sound.mp3");


}

function setup() 
{
  var isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile )
  {
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80,displayHeight);
  }
  else
  {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth+80,windowHeight);
  }
  
  engine = Engine.create();
  world = engine.world;
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER)
  ground = new Ground(250,canH,500,20)
  rope = new Rope(9,{x:60,y:30})
  rope1 = new Rope(7,{x:370,y:40})
  rope2 = new Rope(4,{x:400,y:225})

  fruit=Bodies.circle(300,300,15,{density:0.001})
  World.add(world,fruit)

  fruit_con = new Link(rope,fruit);
  fruit1_con = new Link(rope1,fruit);
  fruit2_con = new Link(rope2,fruit);

  blinkAni.frameDelay = 20;
  sadAni.frameDelay = 20;
  eatAni.frameDelay = 20;

  bunny = createSprite(420,canH-80,100,100)
  bunny.addAnimation("blinking",blinkAni);
  bunny.addAnimation("eating",eatAni);
  bunny.addAnimation("crying",sadAni);
  bunny.changeAnimation("blinking");
  bunny.scale=0.25;

  button =createImg("cut_btn.png") 
  button.position(50,30)
  button.size(50,50)

  button1 =createImg("cut_btn.png") 
  button1.position(330,35)
  button1.size(50,50)

  button2 =createImg("cut_btn.png") 
  button2.position(360,200)
  button2.size(50,50)

  button.mouseClicked(drop);
  button1.mouseClicked(drop1);
  button2.mouseClicked(drop2);

  bgSnd.play();
  bgSnd.loop()
  bgSnd.setVolume(0.5);

  balloon=createImg("balloon.png")
  balloon.position(10,120);
  balloon.size(100,100);
  balloon.mouseClicked(airBlow)

  mute = createImg("mute.png");
  mute.position(450,20);
  mute.size(50,50);
  mute.mouseClicked(muteBtn)

}


function draw() 
{
  background(51);
  image(bgImg,0,0,displayWidth+80,displayHeight);
  
   
  Engine.update(engine);
  ground.display();
  rope.show();
  rope1.show();
  rope2.show();
  //ellipse(fruit.position.x,fruit.position.y,15,15) 
 if(fruit!=null)
 {
    image(wMelon,fruit.position.x,fruit.position.y,60,60)
 } 
  if(collide(fruit,bunny)===true)
  {
    bunny.changeAnimation("eating")
    eatingSnd.play();
  }
  if(collide(fruit,bunny)===true)
  {
    bunny.changeAnimation("crying")
    sadSnd.play();
    bgSnd.stop();
    fruit=null
  }
  drawSprites();
}
function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con=null;
  ropeCutSnd.play();
} 
function drop1()
{
  rope1.break();
  fruit1_con.detach();
  fruit1_con=null;
  ropeCutSnd.play();
} 
function drop2()
{
  rope2.break();
  fruit2_con.detach();
  fruit2_con=null;
  ropeCutSnd.play();
} 


function collide(body,sprite)
{
  if(body!=null)
  {
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    if(d <= 80)
    {
      World.remove(world,fruit);
      fruit=null;

      return true
    }else{
      return false
    }
  }
}

function airBlow()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  airSnd.play();
}

function keyPressed()
{
  if(keyCode===LEFT_ARROW)
  {
    airBlow();
  }
}

function muteBtn()
{
  if(bgSnd.isPlaying())
  {
    bgSnd.stop();
  }
  else{
    bgSnd.play()
  }
}