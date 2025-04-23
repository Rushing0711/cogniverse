import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "认知宇宙-Cogniverse",
    description: "cogniverse『typora+vitepress』构建的知识库系统。涉及前端、后端、设计、运维、大数据、机器学习、大模型、AI等多个领域的知识库。",
    themeConfig: {
        siteTitle: "唯有真心热爱，可低岁月漫长！",
        logo: '/lotus.png',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '首页', link: '/'},
            {
                text: '<img src="/frontend.png" style="height: 32px;margin-top: 25px;display: inline;" alt="前端">',
                items: [
                    {text: '前端', link: '/frontend'},
                ]
            },
            {
                text: '<img src="/backend.png" style="height: 32px;margin-top: 25px;display: inline;" alt="后端">',
                items: [
                    {text: '后端', link: '/backend'},
                    {
                        text: 'Java', items: [
                            {text: 'Java核心', link: '/backend/Java/JavaCore'},
                            {text: 'Java虚拟机', link: '/backend/Java/JVM'},
                        ]
                    },
                ]
            },
            {
                text: '<img src="/design.png" style="height: 32px;margin-top: 25px;display: inline;" alt="设计">',
                items: [
                    {text: '设计', link: '/design'}
                ]
            },
            {text: '大数据', link: '/bigdata'},
            {text: 'AI大模型', link: '/ai'},
            {
                text: 'DevOps',
                items: [
                    {text: 'DevOps', link: '/devops'},
                ]
            },
            {text: '杂项', link: '/misc'},
        ],

        sidebar: {
            '/readme': {
                text: '首页',
                items: [
                    {items: [{text: '首页', link: '/'}]},
                    {text: '笔记构建指南', link: '/readme/cogniverse『typora+vitepress』'},
                    {text: '自动生成侧边栏', link: '/readme/auto-side-bar'}
                ]
            },
            '/frontend': {
                text: '前端',
                items: [
                    {items: [{text: '前端', link: '/frontend'}]},
                    {text: 'frontend-html-css-learning', link: '/frontend/html-css/frontend-html-css-learning'},
                    {text: 'HTTP', link: '/frontend/HTTP/HTTPLearning'},
                    {
                        text: 'JavaScript',
                        items: [
                            {text: 'ES6InAction', link: '/frontend/JavaScript/ES6InAction'},
                            {text: 'frontend-js-learning', link: '/frontend/JavaScript/Js/frontend-js-learning'},
                            {text: 'JavaScriptInAction', link: '/frontend/JavaScript/JavaScriptInAction'}
                        ]
                    },
                    {text: 'Node', link: '/frontend/Node/NodeInAction'},
                    {text: 'React', link: '/frontend/React/ReactInAction'},
                    {text: 'TypeScript', link: '/frontend/TypeScript/TypeScriptInAction'},
                    {text: 'VitePress', link: '/frontend/VitePress/VitePress+GitHub Pages'},
                    {
                        text: 'Vue', items: [
                            {text: 'Vue', link: '/frontend/Vue/VueInAction'},
                            {text: 'frontend-vue-learning', link: '/frontend/Vue/Vue2And3/frontend-vue-learning'},
                        ]
                    },
                    {
                        items: [
                            {text: 'WebStorm', link: '/frontend/WebStorm/WebStormInAction'},
                        ]
                    }
                ]
            },
            '/backend': {
                text: '后端',
                items:
                    [
                        {items: [{text: '后端', link: '/backend'}]},
                        {text: 'Concurrency', link: '/backend/Concurrency/ConcurrencyInAction'},
                        {text: 'Distributed', link: '/backend/Distributed/DistributedInAction'},
                        {
                            text: 'ElasticStack',
                            items: [
                                {text: '快速了解', link: '/backend/ElasticStack/README'},
                                {text: 'Beats', link: '/backend/ElasticStack/Beats/BeatsInAction'},
                                {
                                    text: 'ElasticsearchInAction',
                                    link: '/backend/ElasticStack/Elasticsearch/ElasticsearchInAction'
                                },
                                {
                                    text: 'ElasticsearchLearning',
                                    link: '/backend/ElasticStack/Elasticsearch/ElasticsearchLearning'
                                },
                                {text: 'KibanaInAction', link: '/backend/ElasticStack/Kibana/KibanaInAction'},
                                {text: 'Logstash', link: '/backend/ElasticStack/Logstash/LogstashInAction'},
                            ]
                        },
                        {
                            text: 'Java',
                            items: [
                                {text: 'JavaInAction', link: '/backend/Java/JavaInAction'},
                                {text: 'SpringBootInAction', link: '/backend/Java/SpringBootInAction'},
                                {
                                    text: 'backend-jvm-learning-basic',
                                    link: '/backend/Java/Jvm/backend-jvm-learning-basic'
                                },
                            ]
                        },
                        {text: 'SpringBoot3', link: '/backend/Spring/backend-springboot3-learning'},
                        {text: 'Shiro', link: '/backend/Shiro/backend-shiro-learning'},
                        {text: 'Kafka', link: '/backend/Kafka/KafkaInAction'},
                        {text: 'Maven', link: '/backend/Maven/MavenInAction'},
                        {text: 'MongoDB', link: '/backend/MongoDB/MongoDBInAction'},
                        {
                            text: 'MySQL',
                            items: [
                                {text: 'MySQLInActioin', link: '/backend/MySQL/MySQLInAction'},
                                {text: 'UnderstandingMySQL', link: '/backend/MySQL/UnderstantingMySQL'},
                            ]
                        },
                        {text: 'Oracle', link: '/backend/Oracle/OracleInAction'},
                        {text: 'PCOInInAction', link: '/backend/Principles of Computer Organization/PCOInAction'},
                        {text: 'Python', link: '/backend/Python/PythonInAction'},
                        {
                            text: 'RabbitMQ',
                            items: [
                                {text: 'RabbitMQCommonCMD', link: '/backend/RabbitMQ/RabbitMQCommonCMD'},
                                {text: 'RabbitMQInAction', link: '/backend/RabbitMQ/RabbitMQInAction'},
                                {text: 'RabbitMQLearning', link: '/backend/RabbitMQ/RabbitMQLearning'},
                                {text: 'UnderstandingRabbitMQ', link: '/backend/RabbitMQ/UnderstandingRabbitMQ'},
                            ]
                        },
                        {
                            text: 'Redis',
                            items: [
                                {text: 'RedisCommonCMD', link: '/backend/Redis/RedisCommonCMD'},
                                {text: 'RedisInAction', link: '/backend/Redis/RedisInAction'},
                                {text: 'RedisLearning', link: '/backend/Redis/RedisLearning'},
                                {text: 'UnderstandingRedis', link: '/backend/Redis/UnderstandingRedis'},
                            ]
                        },
                        {text: 'SkyWalking', link: '/backend/SkyWalking/SkyWalkingInAction'},
                        {text: 'SystemMonitor', link: '/backend/SystemMonitor/README'},
                        {
                            text: 'SystemMonitor',
                            items: [
                                {text: 'SystemMonitor', link: '/backend/SystemMonitor/README'},
                                {
                                    text: 'PrometheusInAction',
                                    link: '/backend/SystemMonitor/Prometheus/PrometheusInAction'
                                },
                            ]
                        },
                        {text: 'ZooKeeperInAction', link: '/backend/ZooKeeper/ZooKeeperInAction'},
                        {text: '剑指Java', link: '/backend/剑指Java/剑指Java'},
                    ]
            },
            '/design': {
                text: '设计',
                items: [
                    {items: [{text: '设计', link: '/design'}]},
                    {
                        items: [
                            {text: 'Photoshop入门第一章', link: '/design/Photoshop/01-第一章'},
                        ]
                    }
                ]
            },
            '/bigdata': {
                text: '大数据',
                items: [
                    {items: [{text: '大数据', link: '/bigdata'}]},
                    {text: 'BigDataInAction', link: '/bigdata/BigData/BigDataInAction'},
                    {text: 'Flink', link: '/bigdata/Flink/FlinkInAction'},
                    {text: 'Flume', link: '/bigdata/Flume/FlumeInAction'},
                    {text: 'Hadoop', link: '/bigdata/Hadoop/HadoopInAction'},
                    {text: 'HBase', link: '/bigdata/HBase/HBaseInAction'},
                    {text: 'Hive', link: '/bigdata/Hive/HiveInAction'},
                    {text: 'Scala', link: '/bigdata/Scala/ScalaInAction'},
                    {text: 'Spark', link: '/bigdata/Spark/SparkInAction'},
                ]
            },
            '/devops': {
                text: 'devops',
                items: [
                    {items: [{text: 'devops', link: '/devops'}]},
                    {
                        text: 'DevOps', items: [
                            {text: 'DevOpsInAction', link: '/devops/DevOps/DevOpsInAction'},
                            {text: 'DockerCommonCMD', link: '/devops/DevOps/Docker/DockerCommonCMD'},
                            {text: 'DockerInAction', link: '/devops/DevOps/Docker/DockerInAction'},
                            {text: 'DockerLearning', link: '/devops/DevOps/Docker/DockerLearning'},
                            {text: 'UnderstandingDocker', link: '/devops/DevOps/Docker/UnderstandingDocker'},
                            {text: 'Kubernetes', link: '/devops/DevOps/Kubernetes/KubernetesInAction'},
                        ]
                    },
                    {text: 'GitInAction', link: '/devops/Git/GitInAction'},
                    {
                        text: 'Linux', items: [
                            {
                                text: 'Ali Cloud',
                                link: '/devops/Linux/Ali Cloud/Ali Cloud ESC Installation Instructions'
                            },
                            {text: 'LinuxCommonCMD', link: '/devops/Linux/LinuxCommonCMD'},
                            {text: 'LinuxInAction', link: '/devops/Linux/LinuxInAction'},
                            {text: 'LinuxLearning', link: '/devops/Linux/LinuxLearning'},
                            {text: 'UnderstandingLinux', link: '/devops/Linux/UnderstandingLinux'},
                        ]
                    },
                ]
            },
        },

        socialLinks:
            [
                {icon: 'github', link: 'https://github.com/Rushing0711/cogniverse'},
                // 可以通过将 SVG 作为字符串传递来添加自定义图标：
                {
                    icon: {
                        svg: '<svg t="1745108753370" class="icon" viewBox="0 0 1129 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="862" width="200" height="200"><path d="M234.909 9.656a80.468 80.468 0 0 1 68.398 0 167.374 167.374 0 0 1 41.843 30.578l160.937 140.82h115.07l160.936-140.82a168.983 168.983 0 0 1 41.843-30.578A80.468 80.468 0 0 1 930.96 76.445a80.468 80.468 0 0 1-17.703 53.914 449.818 449.818 0 0 1-35.406 32.187 232.553 232.553 0 0 1-22.531 18.508h100.585a170.593 170.593 0 0 1 118.289 53.109 171.397 171.397 0 0 1 53.914 118.288v462.693a325.897 325.897 0 0 1-4.024 70.007 178.64 178.64 0 0 1-80.468 112.656 173.007 173.007 0 0 1-92.539 25.75h-738.7a341.186 341.186 0 0 1-72.421-4.024A177.835 177.835 0 0 1 28.91 939.065a172.202 172.202 0 0 1-27.36-92.539V388.662a360.498 360.498 0 0 1 0-66.789A177.03 177.03 0 0 1 162.487 178.64h105.414c-16.899-12.07-31.383-26.555-46.672-39.43a80.468 80.468 0 0 1-25.75-65.984 80.468 80.468 0 0 1 39.43-63.57M216.4 321.873a80.468 80.468 0 0 0-63.57 57.937 108.632 108.632 0 0 0 0 30.578v380.615a80.468 80.468 0 0 0 55.523 80.469 106.218 106.218 0 0 0 34.601 5.632h654.208a80.468 80.468 0 0 0 76.444-47.476 112.656 112.656 0 0 0 8.047-53.109v-354.06a135.187 135.187 0 0 0 0-38.625 80.468 80.468 0 0 0-52.304-54.719 129.554 129.554 0 0 0-49.89-7.242H254.22a268.764 268.764 0 0 0-37.82 0z m0 0" fill="#20B0E3" p-id="863"></path><path d="M348.369 447.404a80.468 80.468 0 0 1 55.523 18.507 80.468 80.468 0 0 1 28.164 59.547v80.468a80.468 80.468 0 0 1-16.094 51.5 80.468 80.468 0 0 1-131.968-9.656 104.609 104.609 0 0 1-10.46-54.719v-80.468a80.468 80.468 0 0 1 70.007-67.593z m416.02 0a80.468 80.468 0 0 1 86.102 75.64v80.468a94.148 94.148 0 0 1-12.07 53.11 80.468 80.468 0 0 1-132.773 0 95.757 95.757 0 0 1-12.875-57.133V519.02a80.468 80.468 0 0 1 70.007-70.812z m0 0" fill="#20B0E3" p-id="864"></path></svg>'
                    },
                    link: 'https://space.bilibili.com/302417610?spm_id_from=333.337.0.0',
                }
            ],

        // outline 中要显示的标题级别
        outline:
            {
                level: [1, 6],
                label:
                    "页面导航",
            }
        ,

        footer: {
            message: '黑洞不吞噬原创，星辰必标注出处',
            copyright:
                'Copyright © 2025 版权所有 | 浙ICP备2023025841号 | 星舰通讯：contact@cogniverse.cn'
        }
        ,

        docFooter: {
            prev: '上一页',
            next:
                '下一页'
        }
        ,

        lastUpdated: {
            text: '最后更新于',
            formatOptions:
                {
                    dateStyle: 'full',
                    timeStyle:
                        'medium'
                }
        },

        search: {
            provider: 'local',
            options: {
                locales: {
                    zh: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换'
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    markdown: {
        lineNumbers: true,
        container:
            {
                tipLabel: '提示',
                warningLabel:
                    '警告',
                dangerLabel:
                    '危险',
                infoLabel:
                    '信息',
                detailsLabel:
                    '详细信息'
            }
    }
})
