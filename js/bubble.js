$(function() {
    draw();
    $(window).resize(function() {
        draw(true);
    });
});

function draw(redraw) {
    bubbleChart("bubble", redraw);
}

function bubbleChart(targetId, redraw, json) {
    $target = $("#" + targetId);
    if (redraw) {
        $target.empty();
    }

    var height = 100;
    var width = $target.width() - 50 * 2;
    var margin = 40;
    var data = [];
    var date = [];
    
    bubble_bar_data.sort(function(a,b){
	  return new Date(a.x) - new Date(b.x);
	});
    
    for (var i in bubble_bar_data) {
    	bubble_bar_data[i].id = i;
    	bubble_bar_data[i].x = new Date(bubble_bar_data[i].x);
    }
    
    data = bubble_bar_data;
    
    barChart("divide_bar", redraw,bubble_bar_data[0].bar);

    var svg = d3.select("#" + targetId)
        .append('svg')
        .attr('class', 'chart')
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin);


    var x = d3.time.scale()
        .domain(d3.extent(data, function(d) {
            date.push(d.x);
            return d.x;
        })).range([0, width]);

    var color = d3.scale.ordinal()
        .domain(["1", "0"])
        .range(["rgb(218, 87, 87)", "rgb(39, 126, 189)"]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom')
        .tickFormat(d3.time.format("%m-%d")).tickValues(date);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin + "," + parseInt(margin + height) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "0.5em")
        .attr("dy", "1.5em")
        .attr("transform", function(d) {
            return "rotate(-25)";
        });

    var r = 40;
    var gutter = width / 6;
    var pie = d3.layout.pie().value(function(d) {
        return d;
    });

    var radius = d3.scale.sqrt()
        .domain([d3.min(data, function(d) {
            return d.size;
        }), d3.max(data, function(d) {
            return d.size;
        })])
        .range([20, r]);

    var pies = svg.selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("width", width + r * 2)
        .attr("height", (r + margin) * 2)
        .append("g")
        .attr("class", "pies")
        .attr("transform", function(d, i) {
            return "translate(" + ((i * gutter) + r) + "," + (r + margin) + ")";
        })
        .on('click', function(d, i) {
            fadeAndActive(d.id , d.bar);
        })
        .on('mouseover', function(d) {
            var rectW = 100,
                rectH = 40,
                rectX = x(d.x),
                rectY = 20;
            svg.append("text")
                .classed("over", true)
                .attr("width", rectW)
                .attr("x", rectX + 5)
                .attr("y", rectY - 5)
                .style("font-size", 12)
                .style("stroke", "steelblue")
                .text("正面新聞:" + d.sentiment[0]);
            svg.append("text")
                .classed("over", true)
                .attr("width", rectW)
                .attr("x", rectX + 5)
                .attr("y", rectY + 10)
                .style("font-size", 12)
                .style("stroke", "rgb(218, 87, 87)")
                .text("負面新聞:" + d.sentiment[1]);
        })
        .on('mouseleave', function(d) {
            svg.selectAll("text.over").remove();
        });


    var k = 0;
    pies.selectAll("g.pies").data(function(d) {
        return pie(d.sentiment);
    }).enter().append('path')
        .attr("d", function(d, i) {
            var arc = d3.svg.arc()
                .innerRadius(radius(data[k].size) / 3)
                .outerRadius(radius(data[k].size));
            if (i % 2 == 1) k++;
            return arc(d);
        })
        .style("fill", function(d, i) {
            return color(i);
        });


    function fadeAndActive(id,data) {
        svg.selectAll("g.pies")
            .style("opacity", 1)
            .filter(function(d) {
                return d.id != id;
            })
            .transition().style("opacity", 0.5);
        barChart("divide_bar", true,data);
    }
}


function barChart(targetId, redraw, data) {
    if (redraw) {
        $("#" + targetId).empty();
    }

    var labelArea = 100,
    	chart,
        bar_height = 40,
        height = bar_height * (data.length / 2),
        label_margin = 40,
        chartWidth = $("#" + targetId).width(),
        width = (chartWidth - label_margin * 2 - labelArea) / 2,
    	rightOffset = width + labelArea;

    $("#" + targetId).height(height);

    chart = d3.select("#" + targetId)
        .append('svg')
        .attr('class', 'chart')
        .attr('width', chartWidth)
        .attr('height', height);

    var xFrom = d3.scale.linear()
        .domain([0, d3.max(data,function(d){
        	return d.number;
        })])
        .range([0, width]);

    var y = d3.scale.ordinal()
        .domain([1,2,3,4,5])
        .rangeBands([10, height - data.length / 2 * 5]);

    var yPosByIndex = function(d, index) {
        return y.range()[index] + index * 5;
    };
    var yPosScoreByIndex = function(d, index) {
        return y.range()[index] + y.rangeBand() / 2 + index * 5;
    };

    chart.selectAll("text.name")
        .data(data.filter(function(d) {
        	if(d.sentiment == 1)
        		return d;
         }))
        .enter().append("text")
        .attr("x", label_margin)
        .attr("y", yPosScoreByIndex)
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function(d){
        	return d.word;
        });

    chart.selectAll("rect.left")
        .data(data.filter(function(d) {
        	if(d.sentiment == 1)
        		return d;
         }))
        .enter().append("rect")
        .attr("x", function(d) {
            return width - xFrom(d.number) + labelArea;
        })
        .attr("y", yPosByIndex)
        .attr("class", "left")
        .transition()
        .attr("width", function(d){
        	return xFrom(d.number);
        })
        .attr("height", y.rangeBand());

    chart.selectAll("text.leftscore")
        .data(data.filter(function(d) {
        	if(d.sentiment == 1)
        		return d;
         }))
        .enter().append("text")
        .attr("x", function(d) {
            return width - xFrom(d.number) + labelArea;
        })
        .attr("y", yPosScoreByIndex)
        .attr("dx", "20")
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .text(function(d){
        	return d.number;
        });

    chart.selectAll("rect.right")
        .data(data.filter(function(d) {
        	if(d.sentiment === 0)
        		return d;
         }))
        .enter().append("rect")
        .attr("x", rightOffset)
        .attr("y", yPosByIndex)
        .attr("class", "right")
        .transition()
        .attr("width", function(d){
        	return xFrom(d.number);
         })
        .attr("height", y.rangeBand());

    chart.selectAll("text.right.score")
        .data(data.filter(function(d) {
        	if(d.sentiment === 0)
        		return d;
         }))
        .enter().append("text")
        .attr("x", function(d) {
            return xFrom(d.number) + rightOffset - 10;
        })
        .attr("y", yPosScoreByIndex)
        .attr("dx", -5)
        .attr("dy", ".36em")
        .attr("text-anchor", "end")
        .attr('class', 'score')
        .text(function(d){
        	return d.number;
        });

    chart.selectAll("text.right.name")
        .data(data.filter(function(d) {
        	if(d.sentiment === 0)
        		return d;
         }))
        .enter().append("text")
        .attr("x", width * 2 + labelArea + label_margin)
        .attr("y", yPosScoreByIndex)
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .attr('class', 'name')
        .text(function(d){
        	return d.word;
        });
}