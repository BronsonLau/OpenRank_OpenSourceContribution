const languageCtx1 = document.getElementById('language-chart-1').getContext('2d');
    new Chart(languageCtx1, {
        type: 'doughnut',
        data: {
            labels: ['JavaScript', 'Python', 'TypeScript', 'Java', 'HTML', 'C#', 'Ruby', 'C++', 'Go', 'PHP'],
            datasets: [{
                data: [25162, 14312, 10926, 10554, 9766, 9548, 7291, 4952, 4833, 3185],
                backgroundColor: ['#007ACC', '#F1E05A', '#563D7C', '#B07219', '#E34C26', '#178600', '#701516', '#00589B', '#00ADD8', '#4F5D95'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'left',
                }
            },
            cutout: '70%'
        }
    });

    // 第二个饼图
    const languageCtx2 = document.getElementById('language-chart-2').getContext('2d');
    new Chart(languageCtx2, {
        type: 'doughnut',
        data: {
            labels: ['0-1', '2-5','6-10', '11-20','21-50','51-100','>=100'],
            datasets: [{
                data: [0, 987,1513, 512,276,49,12],
                backgroundColor: ['#007ACC', '#F1E05A', '#563D7C', '#B07219', '#E34C26', '#178600'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            },
            cutout: '70%'
        }
    });
async function fetchTableData() {
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/repo_id_counts-u1VMkSa6zdRnHSDbkDi9g7hWDKLvV0.csv');
    const data = await response.text();
    return data.split('\n').slice(1).map(row => {
        const [repo_id, count, repo_name] = row.split(',');
        return { repo_name, count };
    });
}

async function populateTable() {
    const tableBody = document.getElementById('tableBody');
    const data = await fetchTableData();

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.repo_name}</td>
            <td>${item.count}</td>
        `;
        tableBody.appendChild(row);
    });

    const rowsToAdd = tableBody.innerHTML;
    tableBody.innerHTML += rowsToAdd;

    startScrolling('tableBody');
}

function startScrolling(tableId) {
    const tableBody = document.getElementById(tableId);
    let scrollPosition = 0;
    const scrollSpeed = 1;

    function scroll() {
        scrollPosition += scrollSpeed;
        tableBody.style.transform = `translateY(-${scrollPosition}px)`;

        if (scrollPosition >= tableBody.clientHeight / 2) {
            scrollPosition = 0;
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}

document.addEventListener('DOMContentLoaded', async function() {
    updateChartTitle();
    updateSecondChartTitle();
    setupChartButtons();
    populateTable();
    fetchNextMonthForecast();
    fetchActivityData();

    document.getElementById('search-button').addEventListener('click', fetchData);
    document.getElementById('search-button2').addEventListener('click', fetchUserData);
});


// 保留原有的代码...

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Could not fetch the CSV:", error);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index];
            return obj;
        }, {});
    });
}

async function createCharts() {
    const createdDateCountsUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/created_date_counts-GzrzBXJqGTT8HViWyXUZe6d5tGrIjX.csv';
    const nextMonthForecastUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/predicted_february_count_lstm-VvD0YOqyfqR5kdHvlc2XbEFAQUscl4.csv';

    try {
        const [createdDateCounts, nextMonthForecast] = await Promise.all([
            fetchCSV(createdDateCountsUrl),
            fetchCSV(nextMonthForecastUrl)
        ]);

        if (createdDateCounts.length > 0) {
            createCreatedDateChart(createdDateCounts);
        }
        if (nextMonthForecast.length > 0) {
            createForecastChart(nextMonthForecast);
        }
    } catch (error) {
        console.error("Error creating charts:", error);
    }
}

function createCreatedDateChart(data) {
    const ctx = document.getElementById('createdDateChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => new Date(item.created_date).toLocaleDateString()),
            datasets: [{
                label: '提交数量',
                data: data.map(item => parseInt(item.count)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '按创建日期统计的提交数量'
                }
            }
        }
    });
}
function createForecastChart(data) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => new Date(item.created_date).toLocaleDateString()),
            datasets: [{
                label: '预测提交数量',
                data: data.map(item => parseFloat(item.predicted_count)),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 28000,  // 设置y轴的最小值
                    max: Math.max(...data.map(item => parseFloat(item.predicted_count))) , // 设置y轴的最大值
                    stepSize: 5,  // 控制y轴刻度间隔
                    title: {
                        display: true,
                        text: '预测提交数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '下月预测'
                }
            }
        }
    });
}


// 更新 DOMContentLoaded 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    updateChartTitle();
    updateSecondChartTitle();
    setupChartButtons();
    populateTable();
    fetchNextMonthForecast();
    fetchActivityData();
    createCharts();  // 添加这一行来创建新的图表

    document.getElementById('search-button').addEventListener('click', fetchData);
    document.getElementById('search-button2').addEventListener('click', fetchUserData);
});

// 保留原有的其他函数...

const carousel = document.querySelector('.carousel');
const totalSlides = document.querySelectorAll('.carousel .card').length;
let currentSlide = 0;

// 自动切换轮播图
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides; // 循环播放
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`; // 移动轮播图的位置
}

// 设置每 3 秒切换一次
setInterval(nextSlide, 3000);

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
        'code_change_lines_add': 'Code change_lines',
        'code_change_lines_remove': 'code_change_lines_remove',
        'code_change_lines_sum': '代码变更总行数',
        'change_requests': 'Change requests',
        'change_requests_accepted': 'Change requests accepted',
        'change_requests_reviews': 'Change requests',
        'change_request_response_time': 'Change request response time',
        'change_request_resolution_duration': 'Change request resolution_duration',
        'change_request_age': 'Change request age',
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
    return urlParams.has(param)? urlParams.get(param) : defaultValue;
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
            return { x: new Date(`${year}-${month < 10? '0' : ''}${month}-01`), y: value };
        });
}

async function fetchData() {
    const repo = document.getElementById('repoInput').value.trim();
    const dataType = document.getElementById('dataTypeSelector').value;

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

        // 初始加载图表（使用默认的 'year' 图表类型加载）
        updateChart('year');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchUserData() {
    const username = document.getElementById('userInput').value.trim();
    const dataType = document.getElementById('dataTypeSelector2').value;

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

        // 初始加载图表（使用默认的 'year' 图表类型加载）
        updateSecondChart('year');
    } catch (error) {
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
                        label: function (tooltipItem) {
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
                        unit: chartType === 'year'? 'year' : chartType === 'month'? 'month' : 'quarter',
                        tooltipFormat: 'll',
                    },
                    title: {
                        display: true,
                        text: chartType === 'year'? 'Year' : chartType === 'month'? 'Month' : 'Quarter'
                    }
                },
                y: {
                    title: {
                        display: true,
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

    // 根据选择的图表类型更新数据
    if (chartType === 'year') {
        chartData = userYearData;
    } else if (chartType === 'month') {
        chartData = userMonthData;
    } else if (chartType === 'quarter') {
        chartData = userQuarterData;
    }

    // 创建新图表
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
                        label: function (tooltipItem) {
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
                        unit: chartType === 'year'? 'year' : chartType === 'month'? 'month' : 'quarter',
                        tooltipFormat: 'll',
                    },
                    title: {
                        display: true,
                        text: chartType === 'year'? 'Year' : chartType === 'month'? 'Month' : 'Quarter'
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
    const chartSelectors = document.querySelectorAll('.chart-selector');
    chartSelectors.forEach(function (chartSelector) {
        const buttons = chartSelector.querySelectorAll('.chart-button');
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const chartGroup = chartSelector.dataset.chartGroup;
                if (chartGroup === 'first') {
                    updateChart(this.dataset.chart);
                } else if (chartGroup === 'second') {
                    updateSecondChart(this.dataset.chart);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    updateChartTitle();
    updateSecondChartTitle();
    setupChartButtons();
    fetchData();
    fetchUserData();
});

// Initial setup
// document.addEventListener('DOMContentLoaded', function() {
//     updateChartTitle();
//     updateSecondChartTitle();
//     // fetchData();
//     // fetchUserData();
// });

async function fetchNextMonthForecast() {
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/next_month_forecast-kXuYZqM0oe4ID1FERs7YJeosfZbN19.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const latestForecast = rows[rows.length - 1].split(',')[1];
    document.getElementById('next-month-forecast').textContent = Math.round(parseFloat(latestForecast));
}

async function fetchActivityData() {
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/created_date_counts-8gg7cypbexRIJNwqAe8NlkAYAcNFDF.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const tableBody = document.getElementById('activityTableBody');
    
    rows.forEach(row => {
        const [date, count] = row.split(',');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td>${count}</td>
        `;
        tableBody.appendChild(tr);
    });

    startScrolling('activityTableBody');
}

async function fetchContributorActivityData() {
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/created_date_counts-8gg7cypbexRIJNwqAe8NlkAYAcNFDF.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    return rows.map(row => {
        const [date, count] = row.split(',');
        return { date, count: parseInt(count) };
    });
}

function createContributorActivityChart(data) {
    const ctx = document.getElementById('contributorActivityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: '贡献者活动数',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '活动数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            }
        }
    });
}

async function fetchForksChangeData() {
    // For this example, we'll use the same data as the contributor activity
    // In a real scenario, you'd fetch the actual forks change data
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/created_date_counts-8gg7cypbexRIJNwqAe8NlkAYAcNFDF.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    return rows.map(row => {
        const [date, count] = row.split(',');
        return { date, count: parseInt(count) };
    });
}

function createForksChangeChart(data) {
    const ctx = document.getElementById('forksChangeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: 'Fork数变化',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Fork数量'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期'
                    }
                }
            }
        }
    });
}

