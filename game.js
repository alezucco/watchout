var svgProperties = {height: 800, width: 800}

var enemyNumber = 8;
var score = 1;

var svg = d3.select('body').append('svg')
  .attr('width',svgProperties.width)
  .attr('height', svgProperties.height)


var update = function(data) {
  //DATA JOIN
  var enemies = svg.selectAll('.enemy').data(data);
  var tweenWithCollisionDetection = function(data){
    var enemy = d3.select(this);
    var startPos = {x: parseFloat(enemy.attr('cx')), y: parseFloat(enemy.attr('cy'))};
    console.log(enemy.data());
    var endPos = {x: function(d){return enemy.data()[0][0]}, y: function(d){return enemy.data()[0][1]} };
    return function(t){
      checkCollision(enemy,onCollision);
      var enemyNextPos = {x: startPos.x + (endPos.x() - startPos.x)*t, y: startPos.y + (endPos.y() - startPos.y)*t}
      enemy.attr('cx', enemyNextPos.x)
      .attr('cy',enemyNextPos.y)
    }
  }

  //UPDATE
  //ENTER
  enemies.enter()
   .append('circle')
    .attr('class','enemy')
    .attr('r', 5)
    .attr('fill', 'red')
    .attr('cx', function(d) {return d[0]})
    .attr('cy',function(d) {return d[1]});
  //UPDATE AND ENTER
  enemies.transition()
    .duration(1000)
    .tween('custom',tweenWithCollisionDetection)
    // .attr('cx', function(d) {return d[0]})
    // .attr('cy',function(d) {return d[1]});
  //EXIT
  enemies.exit().remove();
}
// var findMouse = function() {
//   var coordinates = [0,0];
//   coordinates = d3.mouse(this);
//   console.log(coordinates)
//   return coordinates;
// }

//Make a moveable player
var player = {location: [0,0]};

player.update = function(){
  var playerNode = svg.selectAll('.player').data([player.location]);
  playerNode.enter()
  .append('circle')
    .attr('class','player')
    .attr('cx',function(d){return d[0]})
    .attr('cy',function(d){return d[1]})
    //If you change the radius also change it in the collision detection #hardcodedvariablesarethebest
    .attr('r',10)
    .attr('fill','blue')
  playerNode.transition()
    .duration(1)
    .attr('cx', function(d) {return d[0]})
    .attr('cy',function(d) {return d[1]});
}

var checkCollision = function(enemy, collidedCallback) {
  var radiusSum = parseFloat(enemy.attr('r')) + 10;
  var xDiff = parseFloat(enemy.attr('cx')) - player.location[0];
  var yDiff = parseFloat(enemy.attr('cy')) - player.location[1];
  var separation = Math.sqrt(xDiff*xDiff+yDiff*yDiff);
  if (separation < radiusSum) {
    collidedCallback(player,enemy);
  }
}
var onCollision = function(){
  score = 0;
}

var changeEnemyLocation = function(n){
  var output = [];
  for (var i = 0; i < n; i++) {
  var xy = [];
  xy.push(Math.floor(Math.random()*svgProperties['width']));
  xy.push(Math.floor(Math.random()*svgProperties['height']));
  output.push(xy);
  }
  return output;
}


svg.on("mousemove", function(){
  player.location = d3.mouse(this);
  player.update();
  // d3.selectAll('circle').
  //   is close to the xy of any enemy
  //   reset score
});




update(changeEnemyLocation(enemyNumber));
setInterval(function(){update(changeEnemyLocation(enemyNumber))},1000);
setInterval(function(){
  score++;
  d3.select('h1').data([score]).text('Score: '+ score);


},100)













