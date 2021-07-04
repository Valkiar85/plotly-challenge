// Initialize a function
function init(){
    // Dropdown in HTML
    var menu_dropdown = d3.select("#selDataset")
    //JSON Data
    d3.json("samples.json").then(data => {
        console.log(data)

        var name_id = data.names;
        
        name_id.forEach(name => menu_dropdown.append('option').text(name).property('value', name))    
    plot_build(name_id[0]);
    demographic_build(name_id[0]);
    });
};



//Function that creates Graphic depending on the ID
function optionChanged(id){
    plot_build(id);
    demographic_build(id);
}

function plot_build(id) {
    //JSON Data
    d3.json("samples.json").then(function(data){
        console.log(data)
        //Samples
        var sample = data.samples;
        var filter_sample = sample.filter(d => d.id == id)[0];
        
        var x_value = filter_sample.sample_values.slice(0, 10).reverse();
        var y_value = filter_sample.otu_ids.slice(0,10).map(OTUID => 'OTU' + OTUID).reverse();
        var label = filter_sample.otu_labels.slice(0,10).reverse();
        // Bar Trace
        var bar_trace = {
            x: x_value,
            y: y_value,
            type: "bar",
            text: label,
            orientation: 'h'
        };

        var bar_data = [bar_trace];
        var bar_layout = {
            title: "Top 10 OTU for each Sample"
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        // Bubble Trace
        var bubble_trace = {
            x: filter_sample.otu_ids,
            y: filter_sample.sample_values,
            mode: 'markers',
            marker: {
                size: filter_sample.sample_values,
                color: filter_sample.otu_ids
            },
            text: label
        };

        var bubble_data = [bubble_trace];

        var bubble_layout = {
            title: "Bacteria in Sample and Frequency",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Frequency'}
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
};

init();



function demographic_build(UID) {
    var panel = d3.select("#sample-metadata");
    panel.html("")
    d3.json("samples.json").then(data => {
        var meta_data = data.metadata
        meta_data = meta_data.filter(patientRow => patientRow.id == UID)[0]
        Object.entries(meta_data).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
    
}
