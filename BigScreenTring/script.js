let openRankChart;
let yearData = [];
let monthData = [];
let quarterData = [];

// 获取数据类型的显示名称
function getDataTypeLabel(dataType) {
    const labels = {
        'openrank': 'OpenRank',
        'activity': 'Activity',
        'attention': 'Attention',
        'active_dates_and_times': 'Active dates and times',
        'stars': 'Stars',
        'technical_fork': 'Technical fork',
        'participants': 'Participants',
        'new_contributors': 'New contributors',
        'new_contributors_detail': '新贡献者详情',
        'inactive_contributors': 'Inactive contributors',
        'bus_factor': 'Bus factor',
        'bus_factor_detail': '巴士因子详情',
        'issues_new': 'Issues new',
        'issues_closed': 'Issues closed',
        'issue_comments': 'Issue comments',
        'issue_response_time': 'Issue response time',
        'issue_resolution_duration': 'Issue resolution duration',
        'issue_age': 'Issue age',
        'code_change_lines_add': 'Code change lines',
        'code_change_lines_remove': '代码删除行数',
        'code_change_lines_sum': '代码变更总行数',
        'change_requests': 'Change requests',
        'change_requests_accepted': 'Change requests accepted',
        'change_requests_reviews': 'Change requests',
        'change_request_response_time': 'Change request response time',
        'change_request_resolution_duration': 'Change request resolution duration',
        'change_request_age': 'Change request age	',
        'activity_details': 'Activity Details',
        'developer_network': 'Developer network',
        'repo_network': 'Repo network'
    };
    return labels[dataType] || dataType;
}

function updateChartTitle() {
    const dataType = document.getElementById('dataTypeSelector').value;
    const label = getDataTypeLabel(dataType);
    document.getElementById('chartTitle').textContent = `GitHub ${label} Chart`;
}

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
    const dataType = document.getElementById('dataTypeSelector').value;

    if (!repo) {
        alert('请输入仓库名。');
        return;
    }

    try {
        const response = await fetch(`https://oss.x-lab.info/open_digger/github/${repo}/${dataType}.json`);
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

        // 更新图表标题
        updateChartTitle();

        // 初始加载图表
        setupChartButtons();
        updateChart('year'); // Default to year chart
    } catch (error) {
        alert('获取数据时出错，请检查仓库名称或数据类型！');
        console.error('Error:', error);
    }
}

function updateChart(chartType = 'year') {
    // 销毁旧的图表
    if (openRankChart) {
        openRankChart.destroy();
    }

    let chartData = [];
    const dataType = document.getElementById('dataTypeSelector').value;
    const chartLabel = getDataTypeLabel(dataType);

    // 根据选择的图表类型更新数据
    if (chartType === 'year') {
        chartData = yearData;
    } else if (chartType === 'month') {
        chartData = monthData;
    } else if (chartType === 'quarter') {
        chartData = quarterData;
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
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw.y;
                            return `${tooltipItem.label}: ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: chartType === 'year' ? 'year' : chartType === 'month' ? 'month' : 'quarter',
                        tooltipFormat: 'll',
                    },
                    title: {
                        display: true,
                        text: chartType === 'year' ? 'Year' : chartType === 'month' ? 'Month' : 'Quarter'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: chartLabel
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function setupChartButtons() {
    const buttons = document.querySelectorAll('.chart-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateChart(this.dataset.chart);
        });
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    updateChartTitle();
    fetchData();
});

