$(function() {
    wordcloud("wordcloud");
});

function wordcloud(targetId) {
    $target = $("#" + targetId);
    var width = $target.width();
    var colorLow = 'steelblue',
        colorMed = 'white',
        colorHigh = 'rgb(218, 87, 87)';

    var colorScale = d3.scale.linear()
        .domain([-1, 0, 1])
        .range([colorLow, colorMed, colorHigh]);
    
    var size = d3.scale.sqrt()
	    .domain([d3.min(wordcloud_data, function(d) {
	        return d.frequency;
	    }), d3.max(wordcloud_data, function(d) {
	        return d.frequency;
	    })])
	    .range([16, 80]);

    var fill = d3.scale.category20();
    
    d3.layout.cloud().size([width, 300])
        .words(wordcloud_data
        	.map(function(d, i) {
            return {
                id: i,
                text: d.text,
                size: size(d.frequency),
                score: d.sentiment,
                articles:d.articles
            };
        }))
        .padding(5)
        .rotate(function() {
            return 0;
        })
        .font("Impact")
        .fontSize(function(d) {
            return d.size;
        })
        .on("end", draw)
        .start();
    
	var index = 1;
	for(var ii in wordcloud_data[0].articles){
		$("#wordCloudTable tbody").append('<tr><td>'+index+'</td><td><a href="#">'+wordcloud_data[0].articles[ii].name+'</a></td></tr>');
		index++;
	}

    function draw(words) {
        d3.select("#wordcloud").append("svg")
            .attr("width", width)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(300,150)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) {
                return d.size + "px";
            })
            .style("cursor", "pointer")
            .style("font-family", "Impact")
            .style("fill", function(d, i) {
                return fill(i);
            })
            .attr("class", "keyword")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) {
                return d.text;
            })
            .on("mouseover", function(dd) {
                d3.selectAll("text.keyword")
                    .style("stroke", "black")
                    .filter(function(d) {
                        return d.id != dd.id;
                    })
                    .style("stroke", "initial");
            })
            .on("click", function(d) {
                $("#wordCloudTable tbody").empty();
            	var index = 1;
            	for(var ii in d.articles){
            		$("#wordCloudTable tbody").append('<tr><td>'+index+'</td><td><a href="#">'+d.articles[ii].name+'</a></td></tr>');
            		index++;
            	}
            });
    }
}