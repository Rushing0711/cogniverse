import {defineConfig} from 'vitepress'
import {autoGenSidebar} from './auto-gen-sidebar.js'
import {MermaidMarkdown, MermaidPlugin} from "vitepress-plugin-mermaid";

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
                    {items: [{text: '前端（旧）', link: '/frontend/old'},]},
                    {
                        text: '前端基础', items: [
                            {text: 'HTML', link: '/frontend/new/HTML/00-引言'},
                            {text: 'CSS', link: '/frontend/new/CSS/00-引言'},
                            {text: 'JavaScript', link: '/frontend/new/JavaScript/00-引言'},
                        ]
                    },
                    {text: '前端框架', items: []}
                ]
            },
            {
                text: '<img src="/backend.png" style="height: 32px;margin-top: 25px;display: inline;" alt="后端">',
                items: [
                    {items: [{text: '后端（旧）', link: '/backend/old'},]},
                    {text: 'JVM与GC调优', link: '/backend/new/JVM与GC调优/00--第零篇 前言篇.md'},
                    {text: '数据结构与算法分析', link: '/backend/new/数据结构与算法分析/01-引言'},
                ]
            },
            {
                text: '<img src="/design.png" style="height: 32px;margin-top: 25px;display: inline;" alt="设计">',
                items: [
                    {text: '设计（旧）', link: '/design/old'},
                ]
            },
            {
                text: '数据库', items: [
                    {items: [{text: '数据库（旧）', link: '/database/old'},]}
                ]
            },
            {
                text: '大数据', items: [
                    {items: [{text: '大数据（旧）', link: '/bigdata/old'},]}
                ]
            },
            {text: 'AI大模型', link: '/ai'},
            {
                text: 'DevOps',
                items: [
                    {items: [{text: 'DevOps（旧）', link: '/devops/old'}]},
                    {text: 'Linux', link: '/devops/new/Linux/00-引言'},
                    {text: 'Nginx', link: '/devops/new/Nginx/00-引言'},
                    {
                        text: '云原生', items: [
                            {text: 'Docker', link: '/devops/new/Docker/00-引言'},
                            {text: 'Containerd', link: '/devops/new/Containerd/00-引言'},
                            {text: 'Kubernetes', link: '/devops/new/Kubernetes/00-引言'},
                            {text: 'Helm', link: '/devops/new/Helm/00-引言'},
                            {text: 'KubeSphere', link: '/devops/new/KubeSphere/00-引言'},
                        ]
                    },
                    {items: [{text: 'Git', link: '/devops/new/Git/00-引言'}]},
                ]
            },
            {
                text: '杂项', items: [
                    {text: '杂项', link: '/misc'},
                ]
            },
        ],

        sidebar: {
            '/guide': autoGenSidebar('/guide'),
            '/frontend/old': autoGenSidebar('/frontend/old'),
            '/backend/old': autoGenSidebar('/backend/old'),
            '/design/old': autoGenSidebar('/design/old'),
            '/database/old': autoGenSidebar('/database/old'),
            '/bigdata/old': autoGenSidebar('/bigdata/old'),
            '/ai': autoGenSidebar('/ai'),
            '/devops/old': autoGenSidebar('/devops/old'),
            '/misc': autoGenSidebar('/misc'),
            '/frontend/new/HTML/': autoGenSidebar('/frontend/new/HTML'),
            '/frontend/new/CSS/': autoGenSidebar('/frontend/new/CSS'),
            '/frontend/new/JavaScript/': autoGenSidebar('/frontend/new/JavaScript'),
            '/backend/new/JVM与GC调优': autoGenSidebar('/backend/new/JVM与GC调优'),
            '/backend/new/数据结构与算法分析': autoGenSidebar('/backend/new/数据结构与算法分析'),
            '/devops/new/Linux': autoGenSidebar('/devops/new/Linux'),
            '/devops/new/Nginx': autoGenSidebar('/devops/new/Nginx'),
            '/devops/new/Docker': autoGenSidebar('/devops/new/Docker'),
            '/devops/new/Containerd': autoGenSidebar('/devops/new/Containerd'),
            '/devops/new/Kubernetes': autoGenSidebar('/devops/new/Kubernetes'),
            '/devops/new/Helm': autoGenSidebar('/devops/new/Helm'),
            '/devops/new/KubeSphere': autoGenSidebar('/devops/new/KubeSphere'),
            '/devops/new/Git': autoGenSidebar('/devops/new/Git'),
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
            },
        config(md) {
            md.use(MermaidMarkdown)
        }
    },

    vite: {
        assetsInclude: ['**/*.image'], // 解决 [plugin vite:build-import-analysis] docs/frontend/Vue/Vue2And3/images/OptionsAPI2.image 报错
        plugins: [MermaidPlugin()],
        optimizeDeps: {
            include: ['mermaid'],
        },
        ssr: {
            noExternal: ['mermaid'],
        },
    },

    ignoreDeadLinks: [
        // /^https?:\/\/暂不可用的域名/, // 正则忽略外部链接
        // '/optional-ignored-path/',     // 忽略特定内部路径
        // '#暂时未实现的锚点'            // 忽略锚点
        /^http:\/\/localhost:/
    ],
})