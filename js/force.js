$(function() {
    var width = $("#force").width(),
        height = 800;

    var force = d3.layout.force()
        .size([width, height])
        .charge(-4000)
        .linkDistance(function(d) {
            return (200 + (d.distance * 150));
        })
        .on("tick", tick);

    var svg = d3.select("#force").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    var i = 0,
        radius = 60;

    svg = svg.append('defs');

    var def = svg.selectAll("defs")
        .data(personGraph_data.nodes, function(d) {
            d.id = ++i;
            d3.select("#force svg defs")
                .append("pattern")
                .attr("id", "image" + d.id)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", 1)
                .append("image")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", radius * 2)
                .attr("height", radius * 2)
                .attr("xlink:href", d.img);
            return d.id;
        });


    force
        .nodes(personGraph_data.nodes)
        .links(personGraph_data.links)
        .start();

    link = link.data(personGraph_data.links)
        .enter().append("line")
        .style("stroke-width", function(d) {
            return 3;
        })
        .attr("class", "link");



    node = node.data(personGraph_data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", radius)
        .style("stroke", "#ddd")
        .style("stroke-width", "5px")
        .style("fill", function(d) {
            return "url(#image" + d.id + ")";
        });

    function tick() {
        link.attr("x1", function(d) {
            return d.source.x;
        })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("cx", function(d) {
            return d.x;
        })
            .attr("cy", function(d) {
                return d.y;
            });
    }

    // function dblclick(d) {
    //     d3.select(this).classed("fixed", d.fixed = false);
    // }

    // function dragstart(d) {
    //     d3.select(this).classed("fixed", d.fixed = true);
    // }
});