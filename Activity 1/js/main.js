
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

let svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500)

svg.append("text")
	.attr("transform", "translate("+ (0) +"," + (80)   +")")


function updateVisualization(orders) {
	console.log(orders);
	var l = orders.length;

	var text = svg.selectAll("text")

	text.merge(text)
		.text ("Number of orders: " + l);

	text.exit().remove();

	var circle = svg.selectAll("circle")
	.data(orders);

	// Enter (initialize the newly added elements)
	circle.enter().append("circle")
		.attr("class", "circle")
		.attr("fill", "#707086")

		// Enter and Update (set the dynamic properties of the elements)
		.merge(circle)
		.attr("r", 25)
		.attr("cx", function(d, index) { return (index * 60) + 200 })
		.attr("cy", 80)
		.attr("fill", function(d,index){
			if (d.product == "coffee") {return "red";}
			else {return "purple";}
		})

	circle.exit().remove();


}