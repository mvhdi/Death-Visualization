
var curNode = "yo";
var parNode = "what";



var width = window.innerWidth,
    height = window.innerHeight,
    maxRadius = (Math.min(width, height) / 2) - 5;

var formatNumber = d3.format(',d');

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

var y = d3.scaleSqrt()
    .range([maxRadius*.1, maxRadius]);


var color = d3.scaleOrdinal(d3.schemeCategory20);



var partition = d3.partition();

var arc = d3.arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

var middleArcLine = d => {
    var halfPi = Math.PI/2;
    var angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    var r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    var middleAngle = (angles[1] + angles[0]) / 2;
    var invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) { angles.reverse(); }

    var path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
    };

var textFits = d => {
    var CHAR_SPACE = 6;

    var deltaAngle = x(d.x1) - x(d.x0);
    var r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    var perimeter = r * deltaAngle;

    return d.data.name.length * CHAR_SPACE < perimeter;
    };
function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    var transition = svgg.transition()
        .duration(100)
        .tween('scale', () => {
            var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]);
            return t => { x.domain(xd(t)); y.domain(yd(t)); };
        });

    transition.selectAll('path.main-arc')
        .attrTween('d', d => () => arc(d));

    transition.selectAll('path.hidden-arc')
        .attrTween('d', d => () => middleArcLine(d));

    transition.selectAll('text')
        .attrTween('display', d => () => textFits(d) ? null : 'none');

    moveStackToFront(d);


    //

    function moveStackToFront(elD) {

        svgg.selectAll('.slice').filter(d => d === elD)
            .each(function(d) {
                this.parentNode.appendChild(this);
                if (d.parent) { moveStackToFront(d.parent); }

            })
    }
}


var svgg = d3.select('body').append('svg')
    .style('width', '95vw')
    .style('height', '95vh')
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on('click', () => focusOn()); // Reset zoom on canvas click

d3.json('death.json', (error, root) => {
    if (error) throw error;

    root = d3.hierarchy(root);

    root.sum(d => d.size);

    var slice = svgg.selectAll('g.slice')
        .data(partition(root).descendants());

    slice.exit().remove();

    var newSlice = slice.enter()
        .append('g').attr('class', 'slice')
        .on('click', d => {
            d3.event.stopPropagation();
            focusOn(d);

            curNode = d.data.name;

            console.log("the current node is:" +  curNode);
            if (curNode != "CIRCLE OF 'LIFE'")
                d3.selectAll("#the_SVG_ID").remove();
                parNode = d.parent.data.name;
                console.log("the parent of this node is: " + parNode);
            if (curNode == "Black")
                makeCircleBar("data.csv");

            
        });

    newSlice.append('title')
        .text(d => d.data.name + '\n' + formatNumber(d.value));

    newSlice.append('path')
        .attr('class', 'main-arc')
        .style('fill', d => color((d.children ? d : d.parent).data.name))
        .attr('d', arc);

    newSlice.append('path')
        .attr('class', 'hidden-arc')
        .attr('id', (_, i) => `hiddenArc${i}`)
        .attr('d', middleArcLine);

    var text = newSlice.append('text')
        .attr('display', d => textFits(d) ? null : 'none').style('fill', 'white');

    // Add white contour
    text.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
        .text(d => d.data.name)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 5)
        .style('stroke-linejoin', 'round');

    text.append('textPath')
        .attr('startOffset','50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
        .text(d => d.data.name);
});






function makeCircleBar(theData) {
var width = window.innerWidth;
var height = window.innerHeight;
var innerRadius = 180;
var outerRadius = Math.min(width, height) / 2 - 6;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id","the_SVG_ID")
    .attr("innerRadius", 180)
    .attr("outerRadius", Math.min(width, height) / 2 - 6)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



var xx = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

var yy = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

var z = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv(theData, function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });
  xx.domain(data.map(function(d) { return d.State; }));
  z.domain(data.columns.slice(1));

  svg.append("g")
    .selectAll("g")
    .data(d3.stack()
        .keys(data.columns.slice(1))
        .offset(d3.stackOffsetExpand)
        (data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
      .attr("d", d3.arc()
          .innerRadius(function(d) { return yy(d[0]); })
          .outerRadius(function(d) { return yy(d[1]); })
          .startAngle(function(d) { return xx(d.data.State); })
          .endAngle(function(d) { return xx(d.data.State) + xx.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius));

  var label = svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "rotate(" + ((xx(d.State) + xx.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

  label.append("line")
      .attr("x2", -5)
      .attr("stroke", "#000");

  label.append("text")
      .attr("transform", function(d) { return (xx(d.State) + xx.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
      .text(function(d) { return d.State; }).attr("stroke", "white");

  var yAxis = svg.append("g")
      .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data(yy.ticks(5).slice(1))
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("r", yy);

  yTick.append("text")
      .attr("y", function(d) { return -yy(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5)
      .attr("stroke-linejoin", "round")
      .text(yy.tickFormat(5, "%"));

  yTick.append("text")
      .attr("y", function(d) { return -yy(d); })
      .attr("dy", "0.35em")

      .text(yy.tickFormat(5, "%"));

  var legend = svg.append("g")
    .selectAll("g")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("stroke", "white")
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
  .attr("stroke", "white")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(function(d) { return d; });
});

}


function makeBar(){
var colorbrewer = {Spectral: {
    2: ["#fc8d59","#99d594"],
    3: ["#fc8d59","#ffffbf","#99d594"],
    4: ["#d7191c","#fdae61","#abdda4","#2b83ba"],
    5: ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],
    6: ["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],
    7: ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],
    8: ["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],
    9: ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],
    10: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
    11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
}};

var margin = {top: 20, right: 10, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .rangeRound([0, width * (15 / 18)], .05).padding(.1);

// var x = d3.scaleBand()
//     .rangeRound([0, width], .05).padding(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

// var y =d3.scaleLinear()
//     .range([height, 0]);

var legend_y = d3.scaleBand()
    .range([height / 2, 0], .05);

var color = d3.scaleOrdinal()

var xAxis = d3.axisBottom()
    .scale(x)
    
    .tickSize(0,0,0)
    .tickPadding(6);

var yAxis = d3.axisLeft()
    .scale(y)
    
    .tickFormat(d3.format(".0%"))
    .tickSize(0,0,0)
    .tickPadding(0);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("genes10.txt", function(error, data) {
    var categories = d3.keys(data[0]).filter(function(key) { return key !== "Sample"; });
    var categories_shift = categories;
    console.log(categories);
    color.domain(categories);
    color.range(colorbrewer.Spectral[categories.length]);

    data.forEach(function(d) {
    var y0 = 0;
    d.genes = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.genes.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
    });
    data.sort(function(a, b) { return b.genes[0].y1 - a.genes[0].y1; });

    x.domain(data.map(function(d) { return d.Sample; }));

    legend_y.domain(data[0].genes.map(function(d) { return d.name; }));

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    var rotate = function(arr){
    var temp = arr.shift();
    arr.push(temp);
    }
    
    var sample = svg.selectAll(".sample")
    .data(data)
    .enter().append("g")
    .attr("class", "sample")
    .attr("transform", function(d) { return "translate(" + x(d.Sample) + ",0)"; });

    sample.selectAll("rect")
    .data(function(d) { return d.genes; })
    .enter().append("rect")
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name);})
    .on("click", function(d) {
        var gene_index = categories_shift.indexOf(d.name);
        moveStuff(gene_index);
    });

    var legend = svg.append("g")
    .attr("class", "legend")

    .attr("x", width - 3 * x.bandwidth())
    .attr("y", 0)
    .attr("height", height)
    .attr("width", 3 * x.bandwidth());

    
    legend.selectAll("rect")
        .data(data[0].genes)
        .enter().append("rect")
        .attr("width", x.bandwidth()/2)
        .attr("height", 15)
        .attr("y", function(d,i) { return legend_y(d.name); })
        .attr("x", width - 2.75* x.bandwidth() )
        .style("fill", function(d) { return color(d.name); })
    .on("click", function(d) {
        var gene_index = categories_shift.indexOf(d.name);
        moveStuff(gene_index);
    });

    legend.selectAll("text")
    .data(data[0].genes)
        .enter().append("text")
        
    .attr("y", function(d,i) { return legend_y(d.name) + legend_y.bandwidth()/2; })
    .attr("x", width - 2*x.bandwidth() )

    .text(function(d) { return d.name; })
    .on("click", function(d) {
        var gene_index = categories_shift.indexOf(d.name);
        moveStuff(gene_index);
    });

    var moveStuff = function(gene_index){
    categories_shift = categories;
    for (var i=0; i<gene_index; i++){
        rotate(categories_shift);
    }
    data.forEach(function(d) {
            var y0 = 0;
        d.genes = categories_shift.map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.genes.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
    })
    data.sort(function(a, b) { return b.genes[0].y1 - a.genes[0].y1; });
    x.domain(data.map(function(d) { return d.Sample; }));
    legend_y.domain(data[0].genes.map(function(d) { return d.name; }));
    svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);
    sample = svg.selectAll(".sample")
        .data(data)
        .attr("transform", function(d) { return "translate(" + x(d.Sample) + ",0)"; });

    sample.selectAll("rect")
        .data(function(d) { return d.genes; })
        .transition()
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name);});

    legend.selectAll("rect")
        .data(data[0].genes)
        .transition()
        .delay(function(d, i) { return i * 50; })
            .style("fill", function(d) { return color(d.name); });

    legend.selectAll("text")
        .data(data[0].genes)

        .transition()
        .delay(function(d, i) { return i * 50; })
        .text(function(d) { return d.name; });


    last_sample = data[data.length - 1];
    };
    


    console.log(data);
    console.log(data[data.length - 1].genes);
    var last_sample = data[data.length - 1];
    console.log( x(last_sample.Sample));
    svg.selectAll("text")
    .data(last_sample.genes)
    .enter()
    .append("text")
    .text(function(d) {
        return d.name;
    })
    .attr("x", function(d) {
        return x(last_sample.Sample) + x.bandwidth() + 15;
    })
    .attr("y", function(d) {
        return (y(d.y0) + y(d.y1)) / 2;
    })
    .attr("font-size", "11px")
    .attr("fill", "black");


//    console.log(data[0].genes)
    
});
};

makeBar();

