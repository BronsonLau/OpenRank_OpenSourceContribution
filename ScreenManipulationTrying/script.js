// 基于准备好的dom，初始化echarts实例
var chart1 = echarts.init(document.getElementById('chart1'));
var chart2 = echarts.init(document.getElementById('chart2'));
var piechart = echarts.init(document.getElementById('piechart'));
var threediv1 = echarts.init(document.getElementById('3D1'));

// 指定图表的配置项和数据
var option1 = {
    title: {
        text: '示例图表1'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
};

var option2 = {
    title: {
        text: '示例图表2'
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        name: '访问量',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210]
    }]
};

var option3 = {
    title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
                {value: 1048, name: '搜索引擎'},
                {value: 735, name: '直接访问'},
                {value: 580, name: '邮件营销'},
                {value: 484, name: '联盟广告'},
                {value: 300, name: '视频广告'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

var option4 = {
    title: {
        text: '3D折线图示例'
    },
    tooltip: {},
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        viewControl: {
            // 3D控制器配置
            autoRotate: true // 自动旋转
        },
        light: {
            // 环境光配置
            main: {
                intensity: 1.2,
                shadow: true,
                alpha: 60,
                beta: 30
            },
            ambient: {
                intensity: 0.3
            }
        }
    },
    series: [{
        type: 'line3D',
        data: [
            // 三维数据点，例如：[x, y, z]
            [0, 0, 0], [1, 1, 1], [2, 2, 4], [3, 3, 9], [4, 4, 16]
            // ... 你可以添加更多的数据点
        ],
        shading: 'lambert', // 着色模型
        label: {
            show: true,
            formatter: '{b}' // 显示数据点的z值
        },
        itemStyle: {
            color: 'blue' // 线条颜色
        },
        lineStyle: {
            width: 2 // 线条宽度
        }
    }]
};
 



// 使用刚指定的配置项和数据显示图表。
chart1.setOption(option1);
chart2.setOption(option2);
piechart.setOption(option3);
threediv1.setOption(option4);