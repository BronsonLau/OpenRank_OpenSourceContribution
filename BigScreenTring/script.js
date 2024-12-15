let openRankChart;
let yearData = [];
let monthData = [];
let quarterData = [];

// 获取 URL 参数
function getUrlParam(param, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(param) ? urlParams.get(param) : defaultValue;
}

// 转换年份、月份、季度数据为时间序列
function parseYearData(data) {
    return Object.entries(data)
        .filter(([key]) => key.length === 4) // 过滤年份数据
        .map(([year, value]) => ({ x: new Date(`${year}-01-01`), y: value }));
}

function parseMonthData(data) {
    return Object.entries(data)
        .filter(([key]) => key.length === 7 && key.includes('-')) // 过滤年月数据
        .map(([month, value]) => ({ x: new Date(`${month}-01`), y: value }));
}

function parseQuarterData(data) {
    return Object.entries(data)
        .filter(([key]) => key.length === 6 && key.includes('Q')) // 过滤季度数据
        .map(([quarter, value]) => {
            const year = quarter.slice(0, 4);
            const quarterNum = quarter.slice(5);
            const month = (quarterNum - 1) * 3 + 1; // 获取季度的第一月
            return { x: new Date(`${year}-${month < 10 ? '0' : ''}${month}-01`), y: value };
        });
}

async function fetchData() {
    const repo = document.getElementById('repoInput').value.trim();

    if (!repo) {
        alert('请输入仓库名。');
        return;
    }

    try {
        const response = await fetch(`https://oss.x-lab.info/open_digger/github/${repo}/openrank.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // 分别解析年份、月份和季度的数据
        yearData = parseYearData(data);
        monthData = parseMonthData(data);
        quarterData = parseQuarterData(data);

        // 更新仓库名称
        document.getElementById('repo-name').textContent = repo;

        // 初始加载图表
        updateChart();
    } catch (error) {
        alert('获取数据时出错，请输入正确存储库名称！');
        console.error('Error:', error);
    }
}

function updateChart() {
    const chartSelector = document.getElementById('chartSelector').value;

    // 销毁旧的图表
    if (openRankChart) {
        openRankChart.destroy();
    }

    let chartData = [];
    let chartLabel = '';

    // 根据选择的图表类型更新数据
    if (chartSelector === 'year') {
        chartData = yearData;
        chartLabel = 'OpenRank - Year';
    } else if (chartSelector === 'month') {
        chartData = monthData;
        chartLabel = 'OpenRank - Month';
    } else if (chartSelector === 'quarter') {
        chartData = quarterData;
        chartLabel = 'OpenRank - Quarter';
    }

    // 创建新图表
    const ctx = document.getElementById('openRankChart').getContext('2d');
    openRankChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: chartLabel,
                data: chartData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'nearest', // 最接近的点
                    intersect: false, // 鼠标是否必须直接穿越数据点
                    callbacks: {
                        // 自定义 tooltip 内容
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw.y;
                            return `${tooltipItem.label}: ${value.toFixed(2)}`; // 保留两位小数
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: chartSelector === 'year' ? 'year' : chartSelector === 'month' ? 'month' : 'quarter',
                        tooltipFormat: 'll',
                    },
                    title: {
                        display: true,
                        text: chartSelector === 'year' ? 'Year' : chartSelector === 'month' ? 'Month' : 'Quarter'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'OpenRank'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// 初始图表生成
fetchData();
