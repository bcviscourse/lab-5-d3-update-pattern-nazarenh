

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
// SVG drawing area

let margin = {top: 40, right: 10, bottom: 60, left: 60};

let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
let x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);



// Initialize axes Here
var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y)
.ticks(10)




// Initialize SVG axes groups here
padding = 50;
var xg = svg.append("g")
	.call(xAxis)
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + (height) + ")")

var yg= svg.append("g")
	.call(yAxis)
	.attr("class", "y-axis")
	.attr("transform", "translate(0," + (0) + ")")

svg.append("text")
	.attr("transform", "translate("+ (-50) +"," + (height/2)   +")rotate(270)")
	.attr("class", "axis-title")



// Initialize data
let data = null;// global variable

// Load CSV file
d3.csv("data/coffee-house-chains.csv", (d)=>{
	return {
		...d,
		revenue : +d.revenue,
		stores : +d.stores
	}
}).then((allSales)=>{
	data = allSales;
	updateVisualization();

});



// Add Event Listener (ranking type)
  // option 1: D3
  d3.select("#ranking-type").on("change", updateVisualization);


// Add Event listener (reverse sort order)
d3.select("#change-sorting").on("click", function() {
	  updateVisualization();
});


var rev=0;
// Render visualization
function updateVisualization() {
	console.log('updateVisualization', data);
	// Get the selected ranking option
	  // option 1: D3
	  console.log(rev);
	let selectedValue = d3.select("#ranking-type").property("value");

	// Sort data
	if (rev==1){
		data.reverse();
	}
	else{
		if (selectedValue=="stores"){data.sort((a, b)=>b.stores - a.stores);}
		else {data.sort((a, b)=>b.revenue - a.revenue);}
	}
	

	function makeCategories(data) {
		ar=[];
		data.forEach(function(d){
			ar.push(d.company);
		})
		return ar;
	}

	cats= makeCategories(data);

	// Update scale domains
	x.domain(cats);
	if (selectedValue == "stores"){
		y.domain([0, d3.max(data, function(d){return d.stores;} ) ])}
	else if (selectedValue== "revenue"){
		y.domain([0,d3.max(data, function(d){return d.revenue;})] )}

	// Data join
	let bars = svg.selectAll(".bar")
	.remove()
	.exit()
	.data(data)

	d3.select("body").transition().duration(3000).style("background-color", "#2F1F0B");
	d3.select("g").transition().duration(3000).style("color","#D9C3A9");
	d3.selectAll("text")
		.text(toTitleCase(selectedValue))

	// Enter
	bars.enter()
        .append("rect")
		.attr("class", "bar")
		
		.merge(bars)
		.transition()
		.duration(1000)
		.ease(d3.easeElasticOut)

        .attr("x", function(d){ return x(d.company); })
		.attr("y", function(d){ 
			if (selectedValue=="stores") return y(d.stores); 
			else if (selectedValue=="revenue") return y(d.revenue);})
		.attr("width", x.bandwidth())
        .attr("height", function(d){ 
			if (selectedValue=="stores") return height - y(d.stores); 
			else if (selectedValue=="revenue") return height- y(d.revenue);})
		.style("opacity", 0.5)

		.transition()
		.duration(1000)
		.style("opacity", 1)
	


	//Update x-axis
	svg.select("x-axis")
	.transition()
	.duration(1000)
	.call(xAxis);

	//Update y-axis
	svg.select("y-axis")
	.transition()
	.duration(1000)
	.call(yAxis);

	

	// Draw Axes
	xg.call(xAxis)
	yg.call(yAxis)

	// bars.exit()    
	// .transition()    
	// .duration(500)    
	// .attr("x", -xScale.bandwidth())  // <-- Exit stage left    
	// .remove();

	if (rev==0) rev= 1;
	else rev= 0;

}