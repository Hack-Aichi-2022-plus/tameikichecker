console.log("hello,world");

var dic = ["temperature", "humidity", "co2", "tvoc"];

var value = "";

// APIよびだしによるデータ受け取ってから各種処理

fetch(
    `https://script.google.com/macros/s/AKfycbwf-7i-_GUJB5GNAcjtXswIQQ6HpbzrHRKrPVyCpyXdTolTWJ5Pp4I5_uNY6hVtua4/exec`,
    {
        method: "GET"
    }
)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        // この時点でデータ受け取り完了

        // data[0]はコンフィグデータ
        console.log(data);

        // コンフィグデータを参照し、人数分繰り返す
        for (i = 0; i < data[0].length; i++) {
            value += "<div class=\"item\">";

            value += "<h3>" + data[0][i] + "</h3>";

            value += `
                    <!-- Y軸イメージコピー用 canvas -->
                    <canvas id = "yAxis_` + i + `_1" width = "0" ></canvas>

                    <div class="scrollableChartWrapper" style="width:400px">
                        <!-- スクロールされるcanvasを持つdiv -->
                        <div>
                            <!-- グラフ描画用キャンバス -->
                            <canvas id="chart_` + i + `_1" style="height:250px"></canvas>
                        </div>
                    </div>

                    <!-- Y軸イメージコピー用 canvas -->
                    <canvas id = "yAxis_` + i + `_2" width = "0" ></canvas>

                    <div class="scrollableChartWrapper" style="width:400px">
                        <!-- スクロールされるcanvasを持つdiv -->
                        <div>
                            <!-- グラフ描画用キャンバス -->
                            <canvas id="chart_` + i + `_2" style="height:250px"></canvas>
                        </div>
                    </div>
            `;

            value += "</div>";
        }

        // HTML側は生成完了
        var chart = document.querySelector("#chart");
        chart.innerHTML = value;

        console.log(data[1]["temperature_1"]);

        var timeLength = data.length - 1;

        var times = [...Array(timeLength)].map((_, i) => i);

        // 各従業員ずつ処理
        for (i = 0; i < data[0].length; i++) {

            // データの用意

            var chartdatas = new Array(4); // 温度 湿度 CO2 TVOC

            for (f = 0; f < 4; f++) {
                chartdatas[f] = new Array(timeLength);
                for (g = 0; g < timeLength; g++) {
                    chartdatas[f][g] = data[g + 1][String(dic[f] + "_" + (i + 1))];
                }
            }

            console.log(chartdatas);

            /*
                ここにグラフスクロール機能を実装
            */


            // グラフの描画

            var _chartdata1 = {
                labels: times,
                datasets: [{
                    label: "温度",
                    backgroundColor: 'rgb(255, 143, 143)',
                    borderColor: 'rgb(255, 143, 143)',
                    data: chartdatas[0],
                    lineTension: 0.3,
                    borderWidth: 1
                },
                {
                    label: '湿度',
                    backgroundColor: 'rgb(143, 227, 255)',
                    borderColor: 'rgb(143, 227, 255)',
                    data: chartdatas[1],
                    lineTension: 0.3,
                    borderWidth: 1
                }]
            };

            var _chartdata2 = {
                labels: times,
                datasets: [{
                    label: "CO2",
                    backgroundColor: 'rgb(255, 202, 128)',
                    borderColor: 'rgb(255, 202, 128)',
                    data: chartdatas[2],
                    lineTension: 0.3,
                    borderWidth: 1
                },
                {
                    label: 'TVOC',
                    backgroundColor: 'rgb(99, 255, 132)',
                    borderColor: 'rgb(99, 255, 132)',
                    data: chartdatas[3],
                    lineTension: 0.3,
                    borderWidth: 1
                }]
            };

            var config = {
                type: 'line',
                data: _chartdata1,
                options: {}
            };

            var chart = new Chart(
                document.getElementById("chart_" + i + "_1"),
                config
            );

            var config2 = {
                type: 'line',
                data: _chartdata2,
                options: {}
            };

            var chart2 = new Chart(
                document.getElementById("chart_" + i + "_2"),
                config2
            );

        }



    });

