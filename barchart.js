
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
    11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
    15: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","black","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2","pink", "gray", "brown", "cyan"]
}};

var margin = {top: 20, right: 10, bottom: 30, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .rangeRound([0, width * (15 / 18)], .05).padding(.2);

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

var tooltip = d3.selectAll("body")
     .append("div")
     .attr('class', 'tooltip'); 

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
    // data.sort(function(a, b) { return b.genes[0].y1 - a.genes[0].y1; });

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

	.on("mouseover", function(d) {
	    
	    console.log(d.y1 - d.y0);
	    var texxt = d.y1 - d.y0;
	    return tooltip.style("visibility", "visible").text('[ category:' + d.name + ' Value: ' + texxt +']' );
	    
	    
	})
	 .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })
	.on("click", function(d) {
	    var gene_index = categories_shift.indexOf(d.name);
	    console.log(d.y1 - d.y0);
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
		// console.log(gene_index);
	    var gene_index = categories_shift.indexOf(d.name);
	    // console.log(gene_index);
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
	console.log(categories_shift);
	for (var i=0; i<gene_index; i++){
	    rotate(categories_shift);
	    console.log(categories_shift);
	}
	data.forEach(function(d) {
		    var y0 = 0;
	    d.genes = categories_shift.map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
	    d.genes.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
	})
	// data.sort(function(a, b) { return b.genes[0].y1 - a.genes[0].y1; });
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


   console.log(data[0].genes)
	
});
};

makeBar();