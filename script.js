// var myChart = echarts.init(document.getElementById('main'));

// function getRandomColor() {
//     return '#' + Math.floor(Math.random() * 16777215).toString(16);
// }

// myChart.showLoading();
// $.getJSON('projects.json', function (graph) {
//     myChart.hideLoading();

//     // Sort projects by date descending
//     graph.projects.sort((a, b) => new Date(b.date) - new Date(a.date));

//     // // Create a map to store the first project of each year
//     // var firstProjectsOfYear = {};
//     // graph.projects.forEach(function (project) {
//     //     var year = new Date(project.date).getFullYear();
//     //     if (!(year in firstProjectsOfYear)) {
//     //         firstProjectsOfYear[year] = project;
//     //     }
//     // });

//     // // Prepare additional labels for each year
//     // var additionalLabels = [];
//     // Object.keys(firstProjectsOfYear).forEach(function (year) {
//     //     var project = firstProjectsOfYear[year];
//     //     additionalLabels.push({
//     //         type: 'text',
//     //         left: '10%', // Adjust as needed
//     //         top: 50 + 50 * Object.keys(firstProjectsOfYear).indexOf(year), // Adjust vertical spacing
//     //         style: {
//     //             text: year.toString(),
//     //             font: 'bold 14px Arial',
//     //             textAlign: 'left',
//     //             fill: '#333'
//     //         }
//     //     });
//     // });

//     const categories = ["Strategic Design", "Graphic Design", "Digital Technology", "Photography", "Fine Art"];

//     // Create a set for unique attributes and a map for their colors
//     var uniqueAttributes = new Set();
//     graph.projects.forEach(function (project) {
//         project.attributes.forEach(function (attribute) {
//             uniqueAttributes.add(attribute);
//         });
//     });

//     // // Convert set to array and generate colors
//     // uniqueAttributes = Array.from(uniqueAttributes);

//     // Convert set to array of objects with 'name' key
//     var legendData = Array.from(uniqueAttributes).map(attribute => ({ name: attribute }));
//     // var legendData = Array.from(uniqueAttributes);

//     var attributeColors = {};
//     uniqueAttributes.forEach(function (attribute) {
//         attributeColors[attribute] = getRandomColor();
//     });

//     // Create links based on shared attributes
//     var links = [];
//     for (var i = 0; i < graph.projects.length; i++) {
//         for (var j = i + 1; j < graph.projects.length; j++) {
//             var sharedAttributes = graph.projects[i].attributes.filter(attribute =>
//                 graph.projects[j].attributes.includes(attribute));
//             if (sharedAttributes.length > 0) {
//                 links.push({
//                     source: graph.projects[i].name,
//                     target: graph.projects[j].name,
//                     value: sharedAttributes.length, // weight of the link
//                     lineStyle: {
//                         color: attributeColors[sharedAttributes[0]] // use the color of the first shared attribute
//                     }
//                 });
//             }
//         }
//     }


var myChart = echarts.init(document.getElementById('main'));

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

myChart.showLoading();
$.getJSON('projects.json', function (graph) {
    myChart.hideLoading();

    // Sort projects by date descending
    graph.projects.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a set for unique categories and a map for their colors
    var uniqueCategories = new Set();
    graph.projects.forEach(function (project) {
        uniqueCategories.add(project.category);
    });

    // Convert set to array of objects with 'name' key
    var legendData = Array.from(uniqueCategories).map(category => ({ name: category }));

    var categoryColors = {};
    uniqueCategories.forEach(function (category) {
        categoryColors[category] = getRandomColor();
    });

    // Create links based on shared attributes
    var links = [];
    for (var i = 0; i < graph.projects.length; i++) {
        for (var j = i + 1; j < graph.projects.length; j++) {
            var sharedAttributes = graph.projects[i].attributes.filter(attribute =>
                graph.projects[j].attributes.includes(attribute));
            if (sharedAttributes.length > 0) {
                links.push({
                    source: graph.projects[i].name,
                    target: graph.projects[j].name,
                    value: sharedAttributes.length, // weight of the link
                    lineStyle: {
                        color: categoryColors[graph.projects[i].category] // use the color of the first shared attribute
                    }
                });
            }
        }
    }

    console.log(legendData);

    option = {
        title: {
            text: 'Projects',
            subtext: 'Sorted by Date Descending',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: {
            z: 4,
            orient: "vertical",
            left: 'right',
            top: '5%',
            textStyle: {
                color: 'black',
                fontSize: 12
            },
            data: graph.categories.map(function (category) {
                return {
                    name: category.name,
                    icon: 'circle',
                    itemStyle: {
                        color: categoryColors[category.name]
                    }
                };
            })
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: 'Projects, hi',
                type: 'graph',
                // Adjust the overall size of the graph
                radius: '80%', // Adjust the radius to control the size
                layout: 'circular', 
                circular: {
                    rotateLabel: true,
                },
                data: graph.projects.map(function (project, index) {
                    return {
                        name: project.name,
                        category: project.category,
                        value: project.date,
                        symbolSize: 8,
                        itemStyle: {
                            color: categoryColors[project.category]
                        },
                        label: {
                            // show: true,
                            position: 'right',
                            formatter: '{b}', // '{b}' to display the name
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    };
                }),
                links: links,
                roam: 'scale',
                categories: graph.categories,
                lineStyle: {
                    curveness: 0.3
                },
                // itemStyle: {
                //     borderColor: 'black',
                //     color: 'white',
                //     // stroke: attributeColors[project.attributes[0]] // Change symbol color here
                // },
                // Additional graphic elements (labels)
                // graphic: additionalLabels
                graphic: {
                    show: true,
                    type: 'group',
                    z: 10,
                    children: [
                        {
                            type: 'rect',
                            id: 'rect1',
                            text: '2024',
                            x: 50,
                            y: 50,
                            fontSize: 30,
                            color: 'black'
                            // ...
                        },
                        {
                            type: 'rect',
                            id: 'rect2',
                            text: '2023',
                            x: 100,
                            y: 200
                            // ...
                        },
                        {
                            type: 'rect',
                            id: 'rect3',
                            text: '2022',
                            x: 100,
                            y: 200
                            // ...
                        }
                    ]
                }
            }
        ]
    };

    
    option && myChart.setOption(option);
});

// option && myChart.setOption(option);


        // legend: [
        //     {
        //         data: graph.projects.map(function (project) {
        //             return uniqueAttributes;
        //         })
        //     }
        // ],
        // legend: {
        //     zlevel: 2,
        //     orient: 'vertical', // Orientation of the legend
        //     // top: 'center', // Positioning on the chart
        //     // right: 20, // Adjust as needed
        //     left: '5%',   // Move legend 10% from the left
        //     top: '5%',
        //     data: uniqueAttributes.map(function (attribute) {
        //         return {
        //             name: attribute,
        //             icon: 'circle' // Customize the legend icon if needed
        //         };
        //     })
        // },
        // legend: {
        //         z: 4,
        //         backgroundColor: "red",
        //         left: 'center', 
        //         top: '20%,',
        //         textStyle: {
        //             color: 'black',
        //             fontSize: 12
        //           },
        //         // data: Array.from(uniqueAttributes)
        //         // data: categories
        //         data: graph.categories.map(function (a) {
        //             return a.name;
        //             })
        //           };
        //     },
