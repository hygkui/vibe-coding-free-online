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
            { text: '教程', link: '/guide/' },
        ],
        sidebar: {
            '/': [
                {
                    text: '教程大纲',
                    children: [
                        '/',
                    ],
                },
            ],
        },
    }),
})
