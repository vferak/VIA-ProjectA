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
        let data = []

        $.each(history, function (key, value) {
            let lastDay = days[days.length - 1];
            if (days.length === 0 || lastDay !== value.day) {
                days.push(value.day);
                data.push(value.cases.active)
            }
        });

        days = days.reverse();
        data = data.reverse()

        this.drawGraph('myChart', days, data);
    }

    drawGraph(graphId, labels, data) {
        let graph = $('#' + graphId).get(0).getContext('2d');

        let graphData = {
            labels: labels,
            datasets: [{
                label: 'COVID-19 Cases',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data
            }]
        }

        if (!this.chart) {
            this.chart = new Chart(graph, {
                type: 'line',
                data: graphData
            });
        } else {
            this.chart.data = graphData;
            this.chart.update();
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