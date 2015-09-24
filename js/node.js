function nodeChart(targetId, redraw) {
    $target = $("#" + targetId);
    if (redraw) {
        $target.empty();
    }

    var treeData = [{
        "name": "柯文哲",
        "parent": "null",
        "img": "http://www.chinanews.com/tw/2014/12-01/U600P4T8D6830693F107DT20141201102023.jpg",
        "children": [{
            "name": "馬英九",
            "parent": "Top Level",
            "img": "http://farm4.static.flickr.com/3492/3464131894_00370eb765.jpg",
            "children": [{
                "name": "陳維廷",
                "parent": "Level 2: A",
                "img": "http://s.sharpdaily.tw//images/sharpdaily/640pix/20121207/DN08/DN08_001.jpg"
            }, {
                "name": "羅淑蕾",
                "parent": "Level 2: A",
                "img": "http://twimg.edgesuite.net/images/ReNews/20110930/420_64c2bd18079d383a5f58402958132a41.jpg"
            }]
        }, {
            "name": "王金平",
            "parent": "Top Level",
            "img": "http://img.chinatimes.com/newsphoto/2013-09-26/656/b03a00_p_01_04.jpg",
            "children": [{
                "name": "李登輝",
                "parent": "Level 2: A",
                "img": "http://g.udn.com.tw/community/img/PSN_ARTICLE/ating1003/f_1512636_1.jpg"
            }, {
                "name": "賴清德",
                "parent": "Level 2: A",
                "img": "http://img.ltn.com.tw/2015/new/jan/9/images/bigPic/400_400/348.jpg"
            }]
        }]
    }];

    // ************** Generate the tree diagram  *****************

    var margin = {
            top: 40,
            right: 120,
            bottom: 20,
            left: 120
        },
        width = $target.width(),
        height = 450;
    margin.left = width / 2;

    var tree = d3.layout.tree()
        .size([height, width])
        .nodeSize([130, 150]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.x, d.y + 30];
        });

    var svg = d3.select("#node").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#node svg").append("defs");

    root = treeData[0];

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Declare the nodes…
    var i = 0;
    var radius = 60;
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
            d.id = ++i;
            d3.select("#node defs")
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

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + (d.y + radius) + ")";
        });

    nodeEnter.append("circle")
        .attr("r", radius)
        .style("fill", function(d) {
            return "url(#image" + d.id + ")";
        })
        .style("stroke", function(d, index) {
            if (d.parent === "null")
                return "rgb(218, 87, 87)";
            else
                return "#ddd";
        })
        .style("stroke-width", "5px")
        .style("cursor", "pointer")
        .style("-webkit-transition", "0.3s ease-in-out")
        .on('click', function(d, i) {
            var tmp = d;
            svg.selectAll("circle")
                .style("stroke", "#ddd")
                .filter(function(d) {
                    return d.id == tmp.id;
                })
                .style("stroke", "rgb(218, 87, 87)");

            $("a[href='#trend']").click();

            bubbleChart("bubble", true);
        })
        .on('mouseover', function(d) {
            var tmp = d;
            svg.selectAll("circle")
                .filter(function(d) {
                    return d.id == tmp.id;
                })
                .style("transform", "scale(1.1)");
        })
        .on('mouseleave', function(d) {
            var tmp = d;
            svg.selectAll("circle")
                .filter(function(d) {
                    return d.id == tmp.id;
                })
                .style("transform", "scale(1)");
        });

    nodeEnter.append("text")
        .attr("y", function(d) {
            return d.children || d._children ? -(radius + 15) : radius + 15;
        })
        .attr("dy", "0.55em")
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.name;
        })
        .style("font-size", 18)
        .style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);

}