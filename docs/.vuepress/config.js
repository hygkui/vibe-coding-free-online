import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
    base: '/vibe-coding-free-online/',
    lang: 'zh-CN',
    title: 'Vibe Coding 教程',
    description: '我的 Vibe Coding 零基础教程',
    bundler: viteBundler(),
    theme: defaultTheme({
        navbar: [
            { text: '首页', link: '/' },
            { text: '教程', link: '/guide/01-基础必读/01-vibe-coding-简介' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '01 基础必读',
                    children: [
                        '/guide/01-基础必读/01-vibe-coding-简介',
                        '/guide/01-基础必读/02-快速上手教程',
                    ],
                },
                {
                    text: '02 编程工具',
                    children: [
                        '/guide/02-编程工具/01-AI模型选择',
                        '/guide/02-编程工具/02-零代码平台',
                        '/guide/02-编程工具/03-智能体平台',
                        '/guide/02-编程工具/04-代码编辑器',
                        '/guide/02-编程工具/05-命令行工具',
                        '/guide/02-编程工具/06-IDE插件',
                        '/guide/02-编程工具/07-工具实战',
                    ],
                },
                {
                    text: '03 项目实战',
                    children: [
                        '/guide/03-项目实战/01-开发流程',
                        '/guide/03-项目实战/02-个人工具',
                        '/guide/03-项目实战/03-AI应用',
                        '/guide/03-项目实战/04-全栈应用',
                        '/guide/03-项目实战/05-小程序',
                        '/guide/03-项目实战/06-项目部署',
                        '/guide/03-项目实战/07-12个原创项目',
                    ],
                },
                {
                    text: '04 经验技巧',
                    children: [
                        '/guide/04-经验技巧/01-五大心法',
                        '/guide/04-经验技巧/02-对话工程',
                        '/guide/04-经验技巧/03-上下文管理',
                        '/guide/04-经验技巧/04-幻觉处理',
                        '/guide/04-经验技巧/05-效率提升',
                        '/guide/04-经验技巧/06-代码质量',
                        '/guide/04-经验技巧/07-性能优化',
                        '/guide/04-经验技巧/08-安全防护',
                    ],
                },
                {
                    text: '05 编程学习',
                    children: [
                        '/guide/05-编程学习/01-学习路线',
                        '/guide/05-编程学习/02-知识百科',
                        '/guide/05-编程学习/03-资源大全',
                        '/guide/05-编程学习/04-AI技术',
                        '/guide/05-编程学习/05-MCP开发',
                        '/guide/05-编程学习/06-面试刷题',
                        '/guide/05-编程学习/07-简历模板',
                    ],
                },
                {
                    text: '06 产品变现',
                    children: [
                        '/guide/06-产品变现/01-需求分析',
                        '/guide/06-产品变现/02-技术选型',
                        '/guide/06-产品变现/03-架构设计',
                        '/guide/06-产品变现/04-盈利模式',
                        '/guide/06-产品变现/05-SEO优化',
                        '/guide/06-产品变现/06-自媒体运营',
                        '/guide/06-产品变现/07-数据分析',
                    ],
                },
                {
                    text: '07 资源宝库',
                    children: [
                        '/guide/07-资源宝库/01-资源大全',
                        '/guide/07-资源宝库/02-概念大全',
                        '/guide/07-资源宝库/03-常见问题解决',
                    ],
                },
            ],
        },
    }),
})
