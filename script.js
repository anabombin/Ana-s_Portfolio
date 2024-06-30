var myChart = echarts.init(document.getElementById('main'));

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// var colorPalette = [
//     '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
//     '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
//     '#c4ccd3', '#f05b72', '#ef5b9c', '#f47920', '#905a3d',
//     '#fab27b', '#2a5caa', '#444693', '#726930', '#b2d235'
// ];

// function getColor(index) {
//     return colorPalette[index % colorPalette.length];
// }

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
    // var categoryColors = {};
    // Array.from(uniqueCategories).forEach(function (category, index) {
    //     categoryColors[category] = getColor(index);
    // });

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

//     // Find the first project of each year
//     var firstProjectOfYear = {};
//     graph.projects.forEach(function (project) {
//         var year = new Date(project.date).getFullYear();
//         if (!firstProjectOfYear[year]) {
//             firstProjectOfYear[year] = project;
//         }
//     });

//    // Create additional labels for the first project of each year
//    var additionalLabels = Object.keys(firstProjectOfYear).map(function (year) {
//     var project = firstProjectOfYear[year];
//     return {
//         type: 'text',
//         left: '50%',  // Initial position, this will be updated by ECharts layout
//         top: '50%',   // Initial position, this will be updated by ECharts layout
//         style: {
//             text: year,
//             textAlign: 'center',
//             font: 'bold 14px sans-serif',
//             fill: 'white',
//             backgroundColor: 'black',
//             padding: [3, 5] // Adding padding for better appearance
//         },
//         // Set up position relative to project index
//         position: ['50%', '50%']
//     };
// });

// Set symbol sizes based on date ranking
var maxSymbolSize = 40;
var minSymbolSize = 5;
var symbolSizeRange = maxSymbolSize - minSymbolSize;

var symbolSizes = graph.projects.map((project, index) => {
    var normalizedIndex = index / (graph.projects.length - 1); // Normalized index between 0 and 1
    return maxSymbolSize - normalizedIndex * symbolSizeRange;
});

    console.log(legendData);

    option = {
        title: {
            text: 'Projects',
            subtext: 'Sorted by Date Descending',
            top: 'bottom',
            left: 'left'
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
                name: 'Projects',
                type: 'graph',
                // Adjust the overall size of the graph
                radius: '10%', // Adjust the radius to control the size
                layout: 'circular', 
                circular: {
                    rotateLabel: true,
                },
                data: graph.projects.map(function (project, index) {
                    return {
                        name: project.name,
                        category: project.category,
                        value: project.date,
                        symbolSize: symbolSizes[index],
                        itemStyle: {
                            color: categoryColors[project.category]
                        },
                        label: {
                            // show: true,
                            position: 'right',
                            formatter: '{b}', // '{b}' to display the name
                            textStyle: {
                                fontSize: 12
                            },
                            borderRadius: 0
                        }
                    };
                }),
                links: links,
                roam: 'scale',
                categories: graph.categories,
                lineStyle: {
                    curveness: 0.3
                }
            }
        ]
    };

    
    option && myChart.setOption(option);

    var selectedProjectIndex = null;

    myChart.on('click', function (params) {
        if (params.seriesType === 'graph') {
            // alert('You clicked on ' + params.name);
            // Perform other actions for a specific project click
            // move .main div to the side
            moveCanvasLeft();
            toggleLegendAndLabels(false);
            toggleFeature(true);

             // Store the index of the selected project
             selectedProjectIndex = params.dataIndex;
             console.log('Selected project index:', selectedProjectIndex);

             // Create a new project row based on the template
             populateProjectContent(selectedProjectIndex, graph.projects);
        } else {
            console.log('Canvas clicked');
            // Perform actions for canvas click (if needed)
        }
    });

    // Click event handler for the document body
    $(document.body).on('click', function (event) {
        var $target = $(event.target);
        if (!$target.closest('#main').length) {
            moveCanvasCenter();
            toggleLegendAndLabels(true);
            toggleFeature(false);
        }
    });

    // Function to move canvas to the left
    function moveCanvasLeft() {
        $('.container').addClass('canvas-left');
    }

    // Function to move canvas to the center
    function moveCanvasCenter() {
        $('.container').removeClass('canvas-left');
    }

    // Function to toggle legend and labels visibility
    function toggleLegendAndLabels(show) {
        var option = myChart.getOption();
        var option = myChart.getOption();
        
        // Toggle legend visibility
        option.legend[0].show = show;
        // Toggle tooltip visibility
        option.tooltip[0].show = show;
    
        myChart.setOption(option);
    }

    function toggleFeature(show) {
        console.log("toggleFeature called with show:", show);
        if (show) {
            $('#feature').hide(); // Hide feature content
            $('.project-content').show(); // Show project content
            $('.project-content').css('left', '25vw');
        } else {
            $('#feature').show(); // Show feature content
            $('.project-content').hide();
            $('.project-content').css('left', '100vw'); // Hide project content
        }
    }


    // // Function to create a new project row based on the selected project
    // function createProjectRow(index, projects) {
    //     var project = projects[index];
    //     console.log(project)
    //     // Clone the template and show it
    //     var $newRow = $('#projectTemplate').clone().removeAttr('id').show();

    //     // Populate the cloned row with project data
    //     $newRow.find('.rot-title').text(project.name);
    //     $newRow.find('.project-image').attr('src', project.cover_image);
    //     $newRow.find('.project-title').text(project.name);
    //     $newRow.find('.project-date').text(project.date);
    //     $newRow.find('.project-subtitle').text(project.subtitle);
    //     console.log(project.date)

    //     // Append the new row to the container (assuming you have a container with ID "projects-container")
    //     $('#project-content').empty().append($newRow);
    // }

    // Function to populate project content based on the selected project
    function populateProjectContent(index, projects) {
        var project = projects[index];
        var imagePath = 'images/' + project.id + '/' + project.cover_image;

        // Populate the project content with project data
        $('#cover_title').text(project.name);
        $('.project-cover').attr('src', imagePath);
        $('.project-date').text(project.date);
        $('.project-link').attr('href', project.project_link);
        $('.project-subtitle').text(project.subtitle);

        // Populate attributes list
        var $attributesList = $('#skills-content .bullet-list');
        $attributesList.empty(); // Clear any existing list items
        project.attributes.forEach(function(attribute) {
            var $li = $('<li>').text(attribute);
            $attributesList.append($li);
        });

        // Populate tools list
        var $toolsList = $('#tools-content .bullet-list');
        $toolsList.empty(); // Clear any existing list items
        project.tools.forEach(function(tool) {
            var $li = $('<li>').text(tool);
            $toolsList.append($li);
        });
    }
});
