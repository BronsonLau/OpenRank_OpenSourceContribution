// Language Distribution Chart
const languageCtx = document.getElementById('language-chart').getContext('2d');
new Chart(languageCtx, {
    type: 'doughnut',
    data: {
        labels: ['H', 'JavaScript', 'CSS'],
        datasets: [{
            data: [89.37, 9.51, 1.07],
            backgroundColor: ['#007ACC', '#F1E05A', '#563D7C'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        },
        cutout: '70%'
    }
});

// Activity Timeline Chart
const activityCtx = document.getElementById('activity-chart').getContext('2d');
new Chart(activityCtx, {
    type: 'line',
    data: {
        labels: Array.from({length: 24}, (_, i) => `2022-${String(i + 1).padStart(2, '0')}`),
        datasets: [{
            label: '活动数',
            data: Array.from({length: 24}, () => Math.floor(Math.random() * 5000) + 1000),
            borderColor: '#4cc9f0',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Yearly Activity Chart
const yearlyActivityCtx = document.getElementById('yearly-activity-chart').getContext('2d');
new Chart(yearlyActivityCtx, {
    type: 'radar',
    data: {
        labels: ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
        datasets: [{
            label: '年度活跃度',
            data: [80, 90, 85, 70, 75, 80, 85, 75, 70],
            backgroundColor: 'rgba(76, 201, 240, 0.2)',
            borderColor: '#4cc9f0',
            pointBackgroundColor: '#4cc9f0',
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: '#9ca3af'
                },
                ticks: {
                    color: '#9ca3af',
                    backdropColor: 'transparent'
                }
            }
        }
    }
});








// Contributor Table
const contributorData = [
    {id: 44, date: '2023-02', name: 'LukasDc'},
    {id: 45, date: '2023-02', name: 'OriginRing'},
    {id: 46, date: '2023-02', name: 'Lioness100'},
    {id: 47, date: '2023-02', name: 'Wadefeng1'},
    {id: 48, date: '2023-02', name: 'susu-hu'},
];

const tableBody = document.querySelector('#contributor-table tbody');
contributorData.forEach(contributor => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = contributor.id;
    row.insertCell().textContent = contributor.date;
    row.insertCell().textContent = contributor.name;
});



// Search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    // Here you would typically make an API call to fetch data for the new repository
    console.log(`Searching for: ${searchTerm}`);
    // Then update all the charts and data with the new information
});


