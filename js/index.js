const canvas=document.querySelector('canvas')
const scoreEl=document.querySelector('#scoreEl')

const c=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=window.innerHeight

class Boundary{
	static width=40
	static height=40
	constructor ({position,image}){
		this.position=position
		this.width=40
		this.height=40
    this.image=image
	}
	draw(){
		// c.fillStyle='blue'
		// c.fillRect( this.position.x,this.position.y,this.width,this.height)
    c.drawImage(this.image,this.position.x,this.position.y)
	}
}
class Player{
  constructor({position,velocity}){
    this.position=position
    this.velocity=velocity
    this.radius=15
    this.radians=.75
    this.openRate=0.12
    this.rotation=0
  }
  draw(){
    c.save()
    c.translate(this.position.x,this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x,-this.position.y)
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,this.radians,Math.PI*2-this.radians)
    c.lineTo(this.position.x,this.position.y)
    c.fillStyle='yellow'
    c.fill()
    c.closePath()
    c.restore()
  }
  update(){
    this.draw()
    this.position.x+=this.velocity.x
    this.position.y+=this.velocity.y
    if(this.radians<0 || this.radians>.75)
      this.openRate=-this.openRate
    this.radians+=this.openRate
  }
}

class Ghost{
  static speed=2
  constructor({position,velocity,color='red'}){
    this.position=position
    this.velocity=velocity
    this.radius=15
    this.color=color
    this.prevColisions=[]
    this.speed=2
    this.scared=false
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle=this.scared ? 'blue' : this.color
    c.fill()
    c.closePath()
  }
  update(){
    this.draw()
    this.position.x+=this.velocity.x
    this.position.y+=this.velocity.y
  }
}

class Pellet{
  constructor({position}){
    this.position=position
    this.radius=3
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle='white'
    c.fill()
    c.closePath()
  }
}

class PowerUp{
  constructor({position}){
    this.position=position
    this.radius=10
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle='white'
    c.fill()
    c.closePath()
  }
}

const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
  new Ghost({
    position:{x:Boundary.width*6+Boundary.width/2,y:Boundary.height*1.5},
    velocity:{x:Ghost.speed,y:0}
  }),
  new Ghost({
    position:{x:Boundary.width*8+Boundary.width/2,y:Boundary.height*1.5},
    velocity:{x:Ghost.speed,y:0},color:'pink'
  }),
]
const player=new Player({
position:{x:Boundary.width*1.5,y:Boundary.height*1.5},
velocity:{x:0,y:0}
})

const keys = {
  w:{pressed:false},
  a:{pressed:false},
  s:{pressed:false},
  d:{pressed:false}
}

const map=[
  ['1','-','-','-','-','-','-','-','-','-','2'],
  ['|','.','.','.','.','.','.','.','.','.','|'],
  ['|','.','b','.','[','7',']','.','b','.','|'],
  ['|','.','.','.','.','_','.','.','.','.','|'],
  ['|','.','[',']','.','.','.','[',']','.','|'],
  ['|','.','.','.','.','^','.','.','.','.','|'],
  ['|','.','b','.','[','+',']','.','b','.','|'],
  ['|','.','.','.','.','_','.','.','.','.','|'],
  ['|','.','[',']','.','.','.','[',']','.','|'],
  ['|','.','.','.','.','^','.','.','.','.','|'],
  ['|','.','b','.','[','5',']','.','b','.','|'],
  ['|','.','.','.','.','.','.','.','.','p','|'],
  ['4','-','-','-','-','-','-','-','-','-','3']
]
function createImage(src){
  const image=new Image()
  image.src=src
  return image
}

map.forEach((row,i)=>{
	row.forEach((symbol,j) =>{
		switch(symbol){
      case '-':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeHorizontal.png')})
        )
        break
       case '|':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeVertical.png')})
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner1.png')})
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner2.png')})
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner3.png')})
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner4.png')})
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/block.png')})
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capLeft.png')})
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capRight.png')})
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capBottom.png')})
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capTop.png')})
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCross.png')})
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorTop.png')})
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorRight.png')})
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorBottom.png')})
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorLeft.png')})
        )
        break
      case '.':
        pellets.push(
          new Pellet({position:{x:Boundary.width*j+Boundary.width/2,y:Boundary.height*i+Boundary.height/2}}))
        break
      case 'p':
        powerUps.push(
          new PowerUp({position:{x:Boundary.width*j+Boundary.width/2,y:Boundary.height*i+Boundary.height/2}}))
        break
    }
	})
})
lastKey=""
score=0

function circleCollidesWithRectangle ({player,boundary}){
  const padding=Boundary.width/2-player.radius-1
  return (
    player.position.y-player.radius+player.velocity.y-padding <= boundary.position.y + boundary.height &&
    player.position.x+player.radius+player.velocity.x +padding>=boundary.position.x &&
    player.position.y+player.radius+player.velocity.y+padding>=boundary.position.y &&
    player.position.x-player.radius+player.velocity.x-padding<=boundary.position.x+boundary.width)
}
let animationId
function animate(){
  c.clearRect(0,0,canvas.width,canvas.height)
  // c.fillStyle="black"
  // c.fillRect(0,0,canvas.width,canvas.height)
  //
  animationId = requestAnimationFrame(animate)

  if (keys.w.pressed && lastKey==='w'){
     for(let i=0;i<boundaries.length;i++){
       const boundary=boundaries[i]
       if (circleCollidesWithRectangle(
         {player: {...player,velocity:{x:0,y:-5}},
         boundary:boundary}
         )){
         player.velocity.y=0
         break
       } else {
         player.velocity.y=-5
       }
     }
  }
  else if (keys.a.pressed && lastKey==='a'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:-5,y:0}},
          boundary:boundary}
      )){
        player.velocity.x=0
        break
      } else {
        player.velocity.x=-5
      }
    }
  }
  else if (keys.s.pressed && lastKey==='s'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:0,y:5}},
          boundary:boundary}
      )){
        player.velocity.y=0
        break
      } else {
        player.velocity.y=5
      }
    }
  }
  else if (keys.d.pressed && lastKey==='d'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:5,y:0}},
          boundary:boundary}
      )){
        player.velocity.x=0
        break
      } else {
        player.velocity.x=5
      }
    }
  }
// detect colision between ghost and player
  for(let i=ghosts.length-1;0<=i;i--) {
    const ghost = ghosts[i]
    if (Math.hypot(
      ghost.position.x - player.position.x,
      ghost.position.y - player.position.y) < ghost.radius + player.radius) {
      if (ghost.scared) {
          ghosts.splice(i,1)
      }
      else  {
        cancelAnimationFrame(animationId)
        alert('you lose!!!!!!!!')
      }
    }
  }
  // win condition
  if (pellets.length===0){
    alert('you win the game............')
    cancelAnimationFrame(animationId)
  }
    // powerup show
  for(let i=powerUps.length-1;0<=i;i--){
    const powerUp=powerUps[i]
    powerUp.draw()
    if(Math.hypot(
      powerUp.position.x-player.position.x,
      powerUp.position.y-player.position.y) < powerUp.radius + player.radius){
      powerUps.splice(i,1)
      // make ghost scared
      ghosts.forEach(g=>{
        g.scared=true
        setTimeout(()=>{
          ghost.scared=false
        },10000)
      })
    }
  }

// score  add  4 pallet colide
  for(let i=pellets.length-1;0<=i;i--){
    const pellet=pellets[i]
    pellet.draw()
    if(Math.hypot(
      pellet.position.x-player.position.x,
      pellet.position.y-player.position.y) < pellet.radius + player.radius){
      pellets.splice(i,1)
      score+=10
      scoreEl.innerHTML=score
    }
  }

  boundaries.forEach(boundary => {
    boundary.draw()
    if (circleCollidesWithRectangle({player:player,boundary:boundary})) {
      player.velocity.x=0
      player.velocity.y=0
    }
  })

  player.update()
  ghosts.forEach((ghost)=>{
    ghost.update()

    const collisions=[]
    boundaries.forEach((boundary)=>{
      if (!collisions.includes("right") && circleCollidesWithRectangle(
        {player: {...ghost,velocity:{x:ghost.speed,y:0}},
          boundary:boundary}
      )) {
        collisions.push('right')
      }
      if (!collisions.includes("left") && circleCollidesWithRectangle(
        {player: {...ghost,velocity:{x:-ghost.speed,y:0}},
          boundary:boundary}
      )) {
        collisions.push('left')
      }
      if (!collisions.includes("down") && circleCollidesWithRectangle(
        {player: {...ghost,velocity:{x:0,y:ghost.speed}},
          boundary:boundary}
      )) {
        collisions.push('down')
      }
      if (!collisions.includes("up") && circleCollidesWithRectangle(
        {player: {...ghost,velocity:{x:0,y:-ghost.speed}},
          boundary:boundary}
      )) {
        collisions.push('up')
      }
    }) // for boundary
    if (collisions.length>ghost.prevColisions.length)
      ghost.prevColisions=collisions
    if (JSON.stringify(collisions)!==JSON.stringify(ghost.prevColisions)) {
      // console.log(collisions)
      // console.log(ghost.prevColisions)

      if (ghost.velocity.x>0) ghost.prevColisions.push('right')
      else if (ghost.velocity.x<0) ghost.prevColisions.push('left')
      else if (ghost.velocity.y<0) ghost.prevColisions.push('up')
      else if (ghost.velocity.y>0) ghost.prevColisions.push('down')

      // compare prevcolision with collision  and  har chi ke  kam az prev besheh rah azad ast
      const pathWays=ghost.prevColisions.filter((collision)=>{
        return !collisions.includes(collision)
      })
      const direction=pathWays[Math.floor(Math.random()*pathWays.length)]
      // console.log({pathWays})
      // console.log({direction})
      switch (direction){
        case 'down':
          ghost.velocity.x=0
          ghost.velocity.y=ghost.speed
          break
        case 'up':
          ghost.velocity.x=0
          ghost.velocity.y=-ghost.speed
          break
        case 'left':
          ghost.velocity.x=-ghost.speed
          ghost.velocity.y=0
          break
        case 'right':
          ghost.velocity.x=ghost.speed
          ghost.velocity.y=0
          break
      }
      ghost.prevColisions=[]
    }
  }) // for ghost
  if(player.velocity.x>0) player.rotation=0
  else if(player.velocity.x<0) player.rotation=Math.PI
  else if(player.velocity.y<0) player.rotation=Math.PI*1.5
  else if(player.velocity.y>0) player.rotation=Math.PI/2
} // end of animation

animate()

window.addEventListener('keydown',({key})=>{
  switch (key) {
    case'w':
      lastKey="w"
      keys.w.pressed=true
      break
    case 'a':
      lastKey="a"
      keys.a.pressed=true
      break
    case's':
      lastKey="s"
      keys.s.pressed=true
      break
    case 'd':
      lastKey="d"
      keys.d.pressed=true
      break
  }
})

window.addEventListener('keyup',({key})=>{
  switch (key) {
     case'w':
      keys.w.pressed=false
      break
    case 'a':
      keys.a.pressed=false
      break
    case's':
      keys.s.pressed=false
      break
    case 'd':
      keys.d.pressed=false
      break
  }
})
