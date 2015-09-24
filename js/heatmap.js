$(function() {
    heatmap();
});

function heatmap() {
    var articles = ["柯文哲與郭守正見面？　三創證實：雙方氣氛融洽達成共識", "柯文哲本身就是財團財大氣粗的心態", "名柯文哲陷入政治民粹將解決不了問題", "北捷包庇遠東？　柯P：相信部屬", "4月名人見報率！柯P再奪冠　李蒨蓉、楊又穎也上榜", "宋楚瑜、柯文哲看威廉光屁屁　「我們配在一起不錯吧！」", "松菸權利金爭議　柯文哲：不想再扮演司法警察的角色", "柯文哲：相信周禮良　周六拜會林佳龍釐清中捷案"];
    var names = [];
    var dates = ["03-27", "03-28", "03-29", "03-30", "03-31", "04-01", "04-02"];
    var data = [];

    for(var q in heatmap_fake_data){
    	heatmap_fake_data[q].id = q;
    	if($.inArray(heatmap_fake_data[q].articles[0].src,names)==-1)
			names.push(heatmap_fake_data[q].articles[0].src);
    }
    
    data = heatmap_fake_data;
    
    //height of each row in the heatmap
    //width of each column in the heatmap
    var gridSize = 70,
        h = gridSize,
        w = gridSize,
        rectPadding = 60;

    var colorLow = 'steelblue',
        colorMed = 'white',
        colorHigh = 'rgb(218, 87, 87)';

    var colorScale = d3.scale.linear()
        .domain([-1, 0, 1])
        .range([colorLow, colorMed, colorHigh]);

    var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 640 - margin.left - margin.right,
        height = 50 +( 70 * names.length )- margin.top - margin.bottom;

    var svg = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var titles = svg.selectAll("text.title")
        .data(names)
        .enter().append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", function(d, i) {
            return i * h + h / 2 + 30;
        })
        .style("stroke-opacity", 0.5)
        .style("font", "14px sans-serif")
        .text(String);

    var datess = svg.selectAll("text.date")
        .data(dates)
        .enter().append("text")
        .attr("class", "date")
        .attr("x", function(d, i) {
            return i * w + 100;
        })
        .attr("y", 0)
        .style("font", "14px sans-serif")
        .style("font-style", "italic")
        .text(String);

    var heatMap = svg.selectAll("rect")
        .data(data)
        .enter().append("svg:rect")
        .attr("x", function(d, i) {
            return d.col * w + 100 ;
        })
        .attr("y", function(d, i) {
            return d.row * h + 20;
        })
        .attr("width", function(d) {
            return w;
        })
        .attr("height", function(d) {
            return h;
        })
        .style("fill", function(d) {
            return colorScale(d.score);
        })
        .style("cursor", "pointer")
        .style("stroke", '#ddd')
        .on('click', function(dd) {
        	$("#heatTable table tbody").empty();
        	var index = 1;
        	for(var ii in dd.articles){
        		$("#heatTable table tbody").append('<tr><td>'+index+'</td><td><a href="#">'+dd.articles[ii].name+'</a></td></tr>');
        		index++;
        	}
            svg.selectAll("rect")
                .style("stroke", "black")
                .filter(function(d) {
                    return d.id != dd.id;
                })
                .style("stroke", "#ddd");
        });

    var count = svg.selectAll("text.count")
        .data(data)
        .enter().append("text")
        .attr("class", "count")
        .attr("x", function(d, i) {
            return d.col * w + 125;
        })
        .attr("y", function(d, i) {
            return d.row * h + 60;
        })
        .style("font", "12px sans-serif")
        .text(function(d) {
            return d.count;
        });
    
    var index = 1;
	for(var ii in data[0].articles){
		$("#heatTable tbody").append('<tr><td>'+index+'</td><td><a href="#">'+data[0].articles[ii].name+'</a></td></tr>');
		index++;
	}

}