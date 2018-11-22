// Mahdi Mohamed
// 11/19/18


//Makes the top naviagation circle

var curNode = "yo";
var parNode = "what";
var width = window.innerWidth-300,
    height = window.innerHeight-300,
    maxRadius = (Math.min(width, height) / 2) - 5;
var formatNumber = d3.format(',d');
var x = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);
var y = d3.scaleSqrt()
    .range([maxRadius*.1, maxRadius]);
var color = d3.scaleOrdinal(d3.schemeCategory50);
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

  function moveStackToFront(elD) {

        svgg.selectAll('.slice').filter(d => d === elD)
            .each(function(d) {
                this.parentNode.appendChild(this);
                if (d.parent) { moveStackToFront(d.parent); }

            })
    }
}


var svgg = d3.select('body').append('svg')
    .style('width', '75vw')
    .style('height', '75vh')
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
            if (curNode != "CIRCLE OF 'LIFE'"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                parNode = d.parent.data.name;
                console.log("the parent of this node is: " + parNode);
            }

            if (parNode == "CIRCLE OF 'LIFE'"){
                if (curNode == "CIRCLE OF 'LIFE'"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
 
                } 

            }
            if (parNode == "CIRCLE OF 'LIFE'"){
                if (curNode == "Age"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/AgeDeath.txt", "Categories of death by [Age] "); 
                } 
                if (curNode == "Male"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenDeath.txt", "Categories of death [Men] "); 
                } 
                if (curNode == "Female"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenDeath.txt", "Categories of death [Female] "); 
                } 

            }

            if (parNode == "Male") {

                if (curNode == "Black"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenBlack.txt", "Categories of death  [Black Men]"); 
                } 

                if (curNode == "Native" ) {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenNative.txt", "Categories of death  [Native American Men]");  
                }

                if (curNode == "Hispanic") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenHispanic.txt", "Categories of death  [Hispanic Men]");  
                }

                if (curNode == "White") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenWhite.txt", "Categories of death [White Men]");  
                }

                if (curNode == "Asian") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/MenAsian.txt", "Categories of death  [Asian/Pacific Islander Men]");  
                }

            }

            if (parNode == "Female") {

                if (curNode == "Black"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenBlack.txt", "Categories of death  [Black Women]"); 
                } 

                if (curNode == "Native" ) {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenNative.txt", "Categories of death [Native American Women]");  
                }

                if (curNode == "Hispanic") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenHispanic.txt", "Categories of death  [Hispanic Women]");  
                }

                if (curNode == "White") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenWhite.txt", "Categories of death  [White Women]");  
                }

                if (curNode == "Asian") {
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/WomenAsian.txt", "Categories of death [Asian/Pacific Islander Women]");  
                }

            }
            if (parNode == "Age") {

                if (curNode == "<1"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/<1.txt", "Categories of death  [<1 year]"); 
                } 
                if (curNode == "1-4"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/1-4.txt", "Categories of death  [1-4 years]"); 
                } 
                if (curNode == "5-14"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/5-14.txt", "Categories of death  [5-14 years]"); 
                } 
                if (curNode == "15-24"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/15-24.txt", "Categories of death  [15-24 years]"); 
                } 
                if (curNode == "25-34"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/25-34.txt", "Categories of death  [25-34 years]"); 
                } 
                if (curNode == "35-44"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/35-44.txt", "Categories of death  [35-44 years]"); 
                } 
                if (curNode == "45-54"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/45-54.txt", "Categories of death  [45-54 years]"); 
                } 
                if (curNode == "55-64"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/55-64.txt", "Categories of death [55-64 years]"); 
                } 
                if (curNode == "65-74"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/65-74.txt", "Categories of deathe [65-74 years]"); 
                } 
                if (curNode == "75-84"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/75-84.txt", "Categories of death  [75-84 years]"); 
                } 
                if (curNode == "85+"){
                d3.selectAll("#the_SVG_ID").remove();
                d3.selectAll("#daTitle").remove();
                makeBar("data/85+.txt", "Categories of death [85+ years]"); 
                } 
            }         
                  
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



// makes the interactve normalized stacked bar chart

function makeBar(dataFile,label){
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
    15: ["#1e77b3","#1E774B","#AEC6E8","#FF7F0D","#FEBB78","#2B9F2C","#98DE8A","#D52628","#9367BD","#C4B0D5","#BCBC21","#DBDB8D", "#17BECE", "#9EDAE5", "#C7C7C7"]
}};

var margin = {top: 20, right: 10, bottom: 30, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var title = d3.select("body").append("g")
.append("div")
.attr("id","daTitle")
    .append("text")        
        .style("font-size", "25px")       
        .text(label);

var tooltip = d3.selectAll("body")
     .append("div")
     .attr("align","center")
     .attr('class', 'tooltip'); 

var x = d3.scaleBand()
    .rangeRound([0, width * (15 / 18)], .05).padding(.2);

// var x = d3.scaleBand()
//     .rangeRound([0, width], .05).padding(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

// var y =d3.scaleLinear()
//     .range([height, 0]);

var legend_y = d3.scaleBand()
    .range([height / 2, 0], .01);

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
    .attr("id","the_SVG_ID")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataFile, function(error, data) {
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
        texxt = texxt.toFixed(3);
        return tooltip.style("visibility", "visible").text(' [ ' + texxt +' ]' +' [ ' + d.name +' ]' );
        
        
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
        .on("mouseover", function(d) {
        
        var descript = d.name;
        if (descript=="Infection"){descript =" Certain infectious and parasitic diseases"};
        if (descript=="Cancer"){descript =" Neoplasms"};       
        if (descript=="Blood"){descript =" Diseases of the blood and blood-forming organs and certain disorders involving the immune mechanism"}; 
        if (descript=="Metabolic"){descript ="  Endocrine, nutritional and metabolic diseases"}; 
        
        if (descript=="Nervous"){descript =" Diseases of the nervous system"};       
        if (descript=="Eye"){descript =" Diseases of the eye and adnexa"};
        if (descript=="Ear"){descript =" Diseases of the ear and mastoid process"}; 
        if (descript=="Circulatory"){descript =" Diseases of the circulatory system"}; 
        if (descript=="Respiratory"){descript =" Diseases of the respiratory system "}; 
        if (descript=="Digestive"){descript =" Diseases of the digestive system "};        
        if (descript=="Skin"){descript =" Diseases of the skin and subcutaneous tissue"}; 
        if (descript=="Musculoskeletal"){descript =" Diseases of the musculoskeletal system and connective tissue"}; 
            
        if (descript=="Perinatal"){descript =" Conditions from the perinatal period / Pregnancy, childbirth and the puerperium"};  
        if (descript=="Deformations"){descript =" Congenital malformations, deformations and chromosomal abnormalities"};   
        if (descript=="Abnormal"){descript =" Congenital malformations, deformations and chromosomal abnormalities"};      
        if (descript=="External"){descript =" External causes of morbidity and mortality"}; 
        if (descript=="Mental"){descript =" Mental and behavioural disorders"}; 
        if (descript=="Genital"){descript =" Diseases of the genitourinary system"};   


        return tooltip.style("visibility", "visible").text('[ ' + d.name + ': ' + descript +']' );
        
        
    })
         .on("mouseout", function() {
    return tooltip.style("visibility", "hidden");
  })
    
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



