class CoronavirusGraph {
    constructor(defaultCountry) {
        this.defaultCountry = defaultCountry;

        this.client = new ApiClient(new ApiConfig())
    }

    renderCountrySelect(selectId) {
        let countries = this.client.getCountries();

        let $select = $('#' + selectId);

        let selected = this.defaultCountry;
        $.each(countries, function (key, value) {
            let html = '<option value="' + value + '"' + (value === selected ? "selected='selected'" : "") + '>' + value + '</option>';
            $select.append(html);
        });
    }

    process(country = this.defaultCountry) {
        let history = this.client.getHistory(country);

        let days = [];
        let active = [];
        let recovered = [];
        let total = [];

        $.each(history, function (key, value) {
            let lastDay = days[days.length - 1];
            if (days.length === 0 || lastDay !== value.day) {
                days.push(value.day);
                active.push(value.cases.active);
                recovered.push(value.cases.recovered)
                total.push(value.cases.total)
            }
        });

        days = days.reverse();

        this.drawGraph('active', days, active.reverse(), 'Active cases', 'rgb(255, 99, 132)');
        this.drawGraph('recovered', days, recovered.reverse(), 'Recovered cases', 'rgb(99, 255, 132)');
        this.drawGraph('total', days, total.reverse(), 'Total cases', 'rgb(255, 0, 0)');
    }

    drawGraph(graphId, labels, data, label, color) {
        let $graph = $('#' + graphId);

        let graphData = {
            labels: labels,
            datasets: [{
                label: label,
                backgroundColor: color,
                borderColor: color,
                data: data
            }]
        }

        if (!$graph.data('graph')) {
            let chart = new Chart($graph.get(0).getContext('2d'), {
                type: 'line',
                data: graphData
            });

            $graph.data('graph', chart);
        } else {
            $graph.data('graph').data = graphData;
            $graph.data('graph').update();
        }
    }
}

let coronavirus = new CoronavirusGraph('Czechia');
coronavirus.renderCountrySelect('country');
coronavirus.process();

$('#country').change(function () {
    let country = $(this).val();
    coronavirus.process(country);
});