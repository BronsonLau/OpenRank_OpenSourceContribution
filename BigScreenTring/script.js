// Contributor Activity Bar Chart
const ctx1 = document.getElementById('contributorActivityChart').getContext('2d');
const contributorActivityChart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'],  // 用户名
        datasets: [{
            label: '贡献数',
            data: [50, 30, 45, 60, 25, 80, 40, 35],  // 对应的贡献数
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Forks Change Bar Chart
const ctx2 = document.getElementById('forksChangeChart').getContext('2d');
const forksChangeChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4'],  // 时间区间
        datasets: [{
            label: 'Fork数变化',
            data: [150, 200, 180, 220],  // 对应的Fork数变化数据
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});



let openRankChart;
let yearData = [];
let monthData = [];
let quarterData = [];

let userChart;
let userYearData = [];
let userMonthData = [];
let userQuarterData = [];

// 获取数据类型的显示名称
function getDataTypeLabel(dataType) {
    const labels = {
        'openrank': 'OpenRank',
        'activity': 'Activity',
        'attention': 'Attention',
        'stars': 'Stars',
        'technical_fork': 'Technical fork',
        'participants': 'Participants',
        'new_contributors': 'New contributors',
        'inactive_contributors': 'Inactive contributors',
        'bus_factor': 'Bus factor',
        'issues_new': 'Issues new',
        'issues_closed': 'Issues closed',
        'issue_comments': 'Issue comments',
        'issue_response_time': 'Issue response time',
        'issue_resolution_duration': 'Issue resolution duration',
        'issue_age': 'Issue age',
        'code_change_lines_add': 'Code change lines',
        'code_change_lines_remove': 'code_change_lines_remove',
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

function updateSecondChartTitle() {
    const dataType = document.getElementById('dataTypeSelector2').value;
    const label = getDataTypeLabel(dataType);
    document.getElementById('chartTitle2').textContent = `GitHub User ${label} Chart`;
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

    // if (!repo) {
    //     alert('请输入仓库名。');
    //     return;
    // }

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

async function fetchUserData() {
    const username = document.getElementById('userInput').value.trim();
    const dataType = document.getElementById('dataTypeSelector2').value;

    // if (!username) {
    //     alert('请输入用户名。');
    //     return;
    // }

    try {
        const response = await fetch(`https://oss.x-lab.info/open_digger/github/${username}/${dataType}.json`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Parse data for different time periods
        userYearData = parseYearData(data);
        userMonthData = parseMonthData(data);
        userQuarterData = parseQuarterData(data);

        // Update chart title
        updateSecondChartTitle();

        // Initialize with year data
        updateSecondChart('year');
    } catch (error) {
        alert('获取数据时出错，请检查用户名或数据类型！');
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

function updateSecondChart(chartType = 'year') {
    // Destroy existing chart
    if (userChart) {
        userChart.destroy();
    }

    let chartData = [];
    const dataType = document.getElementById('dataTypeSelector2').value;
    const chartLabel = getDataTypeLabel(dataType);

    // Select data based on chart type
    if (chartType === 'year') {
        chartData = userYearData;
    } else if (chartType === 'month') {
        chartData = userMonthData;
    } else if (chartType === 'quarter') {
        chartData = userQuarterData;
    }

    // Create new chart
    const ctx = document.getElementById('userChart').getContext('2d');
    userChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: chartLabel,
                data: chartData,
                borderColor: 'rgb(255, 99, 132)', // Different color from first chart
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
    updateSecondChartTitle();
    // fetchData();
    // fetchUserData();
});

