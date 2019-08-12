let obj = []

let svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", 450)
    .attr("height", 450)
    /*.call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
    }))*/

function skillFirstPush(skill) {
    let localComparer = []
    Object.values(obj).forEach(x => {
        pushToComparerArray(Object.keys(x)[0], skill, localComparer)
    })
    if (localComparer.includes(false)) {
        return false
    }
    else{
        return true
    }
}

function pushToComparerArray(key, skill, localComparer) {
    if (key == skill) {
        localComparer.push(false)
    }
    else{
        localComparer.push(true)
    }
}

let skillToPush = {}
d3.json("data.json", function(data) {
    data.map(ninjaInfo => {
        ninjaInfo.skills.map(skillInfo => {
            if (obj.length == 0 || skillFirstPush(skillInfo.skill)) {
                skillToPush = {
                    [skillInfo.skill]: 1
                }
                obj.push(skillToPush)
            } else {                
                obj.forEach(item => {
                    if (skillInfo.skill == Object.keys(item)[0]) {
                        item[skillInfo.skill] += 1
                    }
                })
            }
        })
    })

    let node = svg
        .append("g")
        .attr("class", "outer-container")
        .selectAll(".outer-container")
        .data(obj)
        .enter();

    let group = node.append("g")
        .attr("class", "group-container");

    group
        .append("circle")
        .attr("r", 30)
        .attr("cx", 450 / 2)
        .attr("cy", 450 / 2)
        .style("fill", "#69b3a2")
        .style("fill-opacity", 0.3);

    group
        .append("text")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return Object.keys(d)[0]
        })
        .style("user-select", "none")
        .style("pointer-events", "none")
        .style("font-family", "Helvetica")

    let simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(10))
        .force("center", d3.forceCenter().x(450 / 2).y(450 / 2)) 
        .force("collision", d3.forceCollide().radius(function (d) {
            return Object.values(d)[0] * 15 + 10
        }
        ).iterations(1)) 

    simulation
        .nodes(obj)
        .on("tick", function(d) {
            group
                .selectAll("circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", function (d) {
                    return Object.values(d)[0]*15
                })

            group
                .selectAll("text")
                .attr("x", function(d) { return d.x ; })
                .attr("y", function(d) { return d.y + 5; })
        });

    let searchCriteria = []
    d3.selectAll("circle").on("click", function(e) {
        if (this.style.fill == "red") {
            d3.select(this).style("fill", "#69b3a2")
            searchCriteria = searchCriteria.filter(criteria => criteria != Object.keys(e)[0])
        } else {
            d3.select(this).style("fill", "red")
            searchCriteria.push(Object.keys(e)[0])
        }
        console.log(searchCriteria);
        
    })
})
