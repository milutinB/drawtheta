class Vertex {

  static radius() {
    return 10;
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 7;
  }

  distance(otherVertex) {
    return Math.sqrt(
        Math.pow(this.x - otherVertex.x, 2) +
        Math.pow(this.y - otherVertex.y, 2)
      )
  }

  sum(otherVertex) {
    return new Vertex(this.x + otherVertex.x, this.y + otherVertex.y);
  }

  multiply(a) {
    return new Vertex(a * this.x, a * this.y);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  unit() {
    return this.multiply(1 / this.length());
  }

  dotProd(otherVertex) {
    return this.x * otherVertex.x + this.y * otherVertex.y;
  }

  draw(ctx, k) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Vertex.radius(), 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();

    for (var j = 0; j < k; j++) {
      let unit = new Vertex(Math.cos(2 * j * Math.PI / k),
      Math.sin( 2 * j * Math.PI / k));
      ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(unit.multiply(Vertex.radius() * 3).sum(this).x, unit.multiply(Vertex.radius() * 3).sum(this).y);
      ctx.stroke();
      ctx.setLineDash([]);
   }
  }

}

function getConesAroundIndex(points, index, k) {
    var apex = points[index];
    let cones = [];
    for (var j = 0; j < k; j++) {
    //console.log('computing cone ' + j + ' for vertex ' + index);
    cones.push([]);
    for (var l = 0; l < points.length; l++) {
      if (l != index) {
        //console.log('Checking if vertex ' + l + ' lies in cone ' + j + ' of vertex ' + index);
        let xUnit = new Vertex(1, 0);
        let other = points[l].sum(apex.multiply(-1)).unit();

        let theta = Math.acos(
          xUnit.dotProd(other) / other.length()
        );

        //console.log(theta);

        if (points[l].y < points[index].y) {
          theta = 2 * Math.PI - theta;
        }
        /*if (theta < 0) {
          theta += 2 * Math.PI;
        }*/

        //console.log('The angle between vertex ' + l + ' and vertex ' + index + ' is ' + theta / Math.PI + 'pi');
        if ( 2 * j * Math.PI / k <= theta
          && theta < 2 * (j + 1) * Math.PI / k ) {
          //console.log(index + " " + j + " " + l + " ");
          cones[j].push(l);

        }
      }
    }
  }
  //console.log("Cone of vertex " + index);
  //console.log(cones);
  return cones;
}

function projAontoB(a, b) {
  return Math.abs(a.dotProd(b.unit()));
}

function orthogonalProjectionOntoConeJ(points, index, apexIndex, j, k) {
  let point = points[index].sum(points[apexIndex].multiply(-1));
  //console.log(point);
  let unit = new Vertex(Math.cos((2 * j + 1) * Math.PI / k),
  Math.sin( (2 * j + 1) * Math.PI / k ));
  //console.log(unit);
  return projAontoB(point, unit);
}

function anotherProjectionTest() {
  const a =  new Vertex(1, 1);
  const b = new Vertex(1, 2);
  var points = [a, b];

  var proj = orthogonalProjectionOntoConeJ(points, 1, 0, 0, 3);
  //console.log(proj);
}

//anotherProjectionTest();

function computeThetaK(points, k) {
  edges = [];
  for (var i = 0; i < points.length; i++)
    edges.push([]);

  for (var i = 0; i < points.length; i++) {

    cones = getConesAroundIndex(points, i, k);
    for (var j = 0; j < cones.length; j++) {
      let cone = cones[j];
      let minIndex = -1;
      let minProj  = 1000000000;
      if (cone.length > 0) {
        for (var l = 0; l < cone.length; l++) {
          let currentProj = orthogonalProjectionOntoConeJ(points, cone[l], i, j, k);
          if (currentProj < minProj) {
            minProj = currentProj;
            //console.log("updated minProj: index: " + cone[l]);
            //console.log(minProj);
            minIndex = cone[l];
          }
        }
      }

      if (minIndex > -1) {
        //console.log(minProj);
        edges[i].push(minIndex);
      }
    }

}

  //console.log(edges);
  return edges;
}


function test() {
  var x =  new Vertex(1, 1);
  var y = new Vertex(2, 2);
  var z = new Vertex(0, 1);
  var points = [x, y, z];
}

function anotherTest() {
  var a = new Vertex(1, 1);
  var b = new Vertex(2, 2);
  var c = new Vertex(6, 6);
  var d =  new Vertex(7, 7);
  var points = [a, b, c, d];
  computeThetaK(points, 2);
}

function testProjection() {
  var a = new Vertex(1, 1);
  var b = new Vertex(2, 2);

  //console.log(projAontoB(a, new Vertex(0, 1)));
}

function testConeBisector() {
  let k = 4;
  let j = 0;
  //console.log(new Vertex(Math.cos((2 * j + 1) * Math.PI / k), Math.sin( (2 * j + 1)* Math.PI / k )));
  k = 4;
  j = 1;
  //console.log(new Vertex(Math.cos((2 * j + 1) * Math.PI / k), Math.sin( (2 * j + 1)* Math.PI / k )));
}

//testConeBisector();


//testProjection();
//anotherTest();

//test();
