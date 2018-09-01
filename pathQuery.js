

function getGraph(points, edges) {

  var adjacencyList = [];
  for (var j = 0; j < edges.length; j++)
    adjacencyList.push([]);

  for (var j = 0; j < edges.length; j++) {
    var list = edges[j];
    for (var k = 0; k < list.length; k++) {
      var vertex = list[k];
      if (!adjacencyList[j].includes(vertex))
        adjacencyList[j].push(vertex);
      if (!adjacencyList[vertex].includes(j))
        adjacencyList[vertex].push(j);
    }
  }

  return adjacencyList;

  /*adjacencyList = [];
  edgeSet = new Set([]);
  for (var j = 0; j < points.length; j++) {
    adjacencyList.push([]);
    for (var k = 0; k < edges[j].length; k++) {
      if (!edgeSet.has( orderedPair(j, edges[j][k]) )) {
        edgeSet.add(orderedPair(j, edges[j][k]));
        adjacencyList[j].push(edges[j][k]);
    }
  }
  }
  return {
    adjacencyList: adjacencyList,
    edgeSet: edgeSet
  }*/
}

function nextVertexInQueue(queue, dist) {

  let minPriority = dist[queue[0]];
  let minIndex = 0;

  for (var i = 0; i < queue.length; i++) {
    if (dist[queue[i]] < minPriority) {
      minPriority = dist[queue[i]];
      minIndex = i;
    }
  }
  return minIndex;
}

function naiveDijkstra(graph, points, source) {
  var dist = [];
  var prev = [];
  var queue = [];
  const reallyBigNumber = 100000000;
  for (var i = 0; i < graph.length; i++) {
    dist.push(reallyBigNumber);
    prev.push('undefined');
    queue.push(i);
  }

  dist[source] = 0;

  while (queue.length > 0) {
    let index = nextVertexInQueue(queue, dist);
    let u = queue[index];
    queue.splice(index, 1);

    let neighbors = graph[u];
    //console.log(neighbors);
    for (var i = 0; i < neighbors.length; i++) {
      let v = neighbors[i];
      let alt = dist[u] + points[u].sum(points[v].multiply(-1)).length();
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }
  return dist;
}





function testDijkstra() {
  var a =  new Vertex(1, 1);
  var b = new Vertex(3, 3);
  var c = new Vertex(5, 1);
  var d = new Vertex(1, 0.5);
  var points = [a, b, c, d];
  var edges = [[1], [2], [3], []];
  //var graph = getGraph(points, edges);
  //var graph = graph(points, edges);
  //console.log(naiveDijkstra(graph, points, 0));
  console.log(computeSpanningRatio(points, edges));
}

function computeAllShortestPaths(points, edges) {

  var graph = getGraph(points, edges);
  var distanceLists = [];

  for (var i = 0; i < points.length; i++)
    distanceLists.push(naiveDijkstra(graph, points, i));

  return distanceLists;

}

function computeAllRatios(points, edges) {
  var distanceLists = computeAllShortestPaths(points, edges);
  var returnList = [];
  for (var i = 0; i < points.length; i++) {
    var list = distanceLists[i];
    for (var j = 0; j < list.length; j++) {
      if (j != i) {
        var euclid = points[j].sum(points[i].multiply(-1)).length();
        list[j] = list[j] / euclid;
      }
    }
    returnList.push(list);
  }
  return returnList;
}


function computeSpanningRatio(points, edges) {
  var ratioLists = computeAllRatios(points, edges);
  var maxRatio = 0 ;
  for (var i = 0; i < ratioLists.length; i++) {
    var ratioList = ratioLists[i];
    for (var j = 0; j < ratioList.length; j++) {
      var ratio = ratioList[j];
      if (ratio > maxRatio) {
        maxRatio = ratio;
      }
    }
  }
  return maxRatio;
}

/*
function testPriorityQueue() {
 var queue = new NaivePriorityQueue();
 queue.add({value: 'bob', priority: 1});
 queue.add({value: 'alice', priority: 2});
 console.log(queue.top());
 console.log(queue.top());
}*/

//testPriorityQueue();


/*function test () {
  var a =  new Vertex(1, 1);
  var b = new Vertex(2, 2);
  var c = new Vertex(0, 2);
  var points = [a, b, c];
  var edges = [[1, 2], [0], [0]];
  var graphObject = graph(points, edges);
  console.log(graphObject);
}*/

//test();
