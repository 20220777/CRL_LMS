let isBarrierUp = false;
let lineChart;

function initializeLineChart() {
    const ctxLine = document.getElementById('myLineChart').getContext('2d');
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [], // 시간 라벨
            datasets: [{
                label: 'Water Level',
                data: [],
                fill: false,
                borderColor: 'rgba(169, 169, 169, 1)', // 회색 테두리
                backgroundColor: 'rgba(211, 211, 211, 0.6)', // 회색 배경
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            const labels = { 0: 'Level 0', 20: 'Level 1', 40: 'Level 2', 60: 'Level 3', 80: 'Level 4', 100: 'Level 5' };
                            return labels[value] || '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Water Level'
                    }
                }
            }
        }
    });
}

function fetchData() {
    fetch('http://localhost:3000/')
        .then(response => response.text())
        .then(data => {
            console.log("수신된 데이터:", data);
            const level = convertToLevel(data);
            updateWaterTank(data);
            updateLineChart(data);
            controlBarrier(data);
            updateArduinoData(level);
        })
        .catch(error => console.error("데이터 가져오기 오류:", error));
}

function convertToLevel(data) {
    const levels = { X: "Level 0", A: "Level 1", B: "Level 2", C: "Level 3", D: "Level 4", E: "Level 5" };
    return levels[data] || "Unknown";
}

function updateArduinoData(level) {
    const arduinoDataContainer = document.getElementById('arduinoDataContainer');
    arduinoDataContainer.textContent = `현재 수위 레벨: ${level}`;
}

function updateWaterTank(data) {
    const waterLevel = document.getElementById('waterLevel');
    let currentHeight = 0;

    if (data === 'A') currentHeight = 20;
    else if (data === 'B') currentHeight = 40;
    else if (data === 'C') currentHeight = 60;
    else if (data === 'D') currentHeight = 80;
    else if (data === 'E') currentHeight = 100;
    else if (data === 'X') currentHeight = 0;

    waterLevel.style.height = currentHeight + "%";
}

function updateLineChart(data) {
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    let currentHeight = 0;

    if (data === 'A') currentHeight = 20;
    else if (data === 'B') currentHeight = 40;
    else if (data === 'C') currentHeight = 60;
    else if (data === 'D') currentHeight = 80;
    else if (data === 'E') currentHeight = 100;
    else if (data === 'X') currentHeight = 0;

    lineChart.data.labels.push(timeLabel);
    lineChart.data.datasets[0].data.push(currentHeight);

    lineChart.update();
}

function controlBarrier(data) {
    const barrierArm = document.getElementById('barrierArm');

    if ((data === 'A' || data === 'X') && !isBarrierUp) {
        barrierArm.style.transform = 'rotate(-90deg)';
        isBarrierUp = true;
    }

    if (['B', 'C', 'D', 'E'].includes(data) && isBarrierUp) {
        barrierArm.style.transform = 'rotate(0deg)';
        isBarrierUp = false;
    }
}

setInterval(fetchData, 1800);

window.onload = initializeLineChart;
