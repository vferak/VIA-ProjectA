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
                let day = new Date(Date.parse(value.day));
                days.push(day.toLocaleDateString("cs"));

                active.push(value.cases.active);
                recovered.push(value.cases.recovered)
                total.push(value.cases.total)
            }
        });

        days = days.reverse();
        active = active.reverse();
        recovered = recovered.reverse();
        total = total.reverse();

        this.drawGraph('active', days, active, 'Active cases', 'rgb(255, 99, 132)');
        this.drawGraph('recovered', days, recovered, 'Recovered cases', 'rgb(99, 255, 132)');
        this.drawGraph('total', days, total, 'Total cases', 'rgb(255, 0, 0)');

        $('.statbox-active h4').html(active[active.length - 1].toLocaleString());
        $('.statbox-recovered h4').html(recovered[recovered.length - 1].toLocaleString());
        $('.statbox-total h4').html(total[total.length - 1].toLocaleString());
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