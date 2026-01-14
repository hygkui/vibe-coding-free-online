# MCP 开发

## MCP 概述

MCP（Model Context Protocol，模型上下文协议）是一种让 AI 模型与外部工具和数据源交互的标准化协议。它允许 AI 在执行任务时调用外部工具、访问外部数据，实现更强大的能力。

## MCP 的核心概念

### 为什么需要 MCP

传统 AI 对话的局限性：AI 只能基于训练数据回答，无法获取最新信息。AI 无法执行实际操作，如查询数据库、操作文件。AI 的回复可能过时或不准确。

MCP 解决了这些问题：允许 AI 调用外部工具。允许 AI 访问实时数据。允许 AI 执行实际操作。

### MCP 的架构

MCP 采用客户端-服务器架构：**MCP 客户端**运行在 AI 应用中，负责发送请求。**MCP 服务器**运行在本地或云端，提供工具和数据。

### MCP 资源类型

**工具（Tools）**：可以被 AI 调用的函数或操作。

**资源（Resources）**：可以被 AI 读取的数据或文件。

**提示（Prompts）**：预定义的提示模板。

## MCP 开发入门

### 开发环境

Node.js 环境（推荐 18+）。一个 MCP 客户端（如 Claude Desktop）。代码编辑器（VS Code）。

### 基础项目结构

```
mcp-server/
├── package.json
├── src/
│   ├── index.ts          # 入口文件
│   ├── server.ts         # 服务器配置
│   └── tools/            # 工具定义
├── tsconfig.json
└── .env                  # 环境变量
```

### 安装依赖

```bash
npm init -y
npm install @modelcontextprotocol/sdk dotenv
npm install -D typescript @types/node
```

### 创建 MCP 服务器

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server('my-mcp-server', '1.0.0');

// 定义工具
const tools = {
  'calculate': {
    name: 'calculate',
    description: '执行数学计算',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: '要计算的数学表达式',
        },
      },
      required: ['expression'],
    },
  },
};

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: Object.values(tools) };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'calculate') {
    const result = eval(args.expression); // 注意：实际使用要更安全
    return {
      content: [{ type: 'text', text: String(result) }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 启动服务器
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
```

## MCP 工具开发

### 工具设计原则

每个工具应该做一件事，并且做好。工具的输入和输出应该清晰定义。工具应该处理错误情况。

### 文件操作工具

```typescript
import { readFile, writeFile, mkdir } from 'fs/promises';
import { exists } from 'fs';

const tools = {
  'read_file': {
    name: 'read_file',
    description: '读取文件内容',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: '文件路径',
        },
      },
      required: ['path'],
    },
  },
};

async function handleReadFile(args) {
  const { path } = args;
  const content = await readFile(path, 'utf-8');
  return {
    content: [{ type: 'text', text: content }],
  };
}
```

### API 调用工具

```typescript
import fetch from 'node-fetch';

const tools = {
  'http_get': {
    name: 'http_get',
    description: '发送 HTTP GET 请求',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '请求 URL',
        },
        headers: {
          type: 'object',
          description: '请求头',
        },
      },
      required: ['url'],
    },
  },
};

async function handleHttpGet(args) {
  const { url, headers = {} } = args;
  const response = await fetch(url, { headers });
  const data = await response.text();
  return {
    content: [{ type: 'text', text: data }],
  };
}
```

### 数据库工具

```typescript
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data.db');

const tools = {
  'query': {
    name: 'query',
    description: '执行 SQL 查询',
    inputSchema: {
      type: 'object',
      properties: {
        sql: {
          type: 'string',
          description: 'SQL 查询语句',
        },
      },
      required: ['sql'],
    },
  },
};

function handleQuery(args) {
  return new Promise((resolve, reject) => {
    db.all(args.sql, (err, rows) => {
      if (err) reject(err);
      else resolve({
        content: [{ type: 'text', text: JSON.stringify(rows) }],
      });
    });
  });
}
```

## MCP 资源开发

### 资源定义

资源是 AI 可以读取的数据或文件。

```typescript
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const resources = {
  'config': {
    uri: 'config://app',
    name: 'Application Config',
    description: '当前应用配置',
    mimeType: 'application/json',
  },
};

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources: Object.values(resources) };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === 'config://app') {
    const config = await loadConfig();
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(config),
      }],
    };
  }
  
  throw new Error(`Unknown resource: ${uri}`);
});
```

## MCP 最佳实践

### 错误处理

所有工具都应该有完善的错误处理：验证输入参数。捕获和处理运行时错误。返回有意义的错误信息。

```typescript
try {
  // 执行操作
} catch (error) {
  return {
    content: [{ type: 'text', text: `错误: ${error.message}` }],
    isError: true,
  };
}
```

### 安全考虑

**输入验证**：验证所有输入参数的类型和格式。

**权限控制**：限制工具可以访问的资源。

**敏感信息**：不要在工具中暴露敏感信息。

### 性能优化

**缓存**：对于频繁访问的资源，使用缓存。

**异步处理**：耗时的操作应该异步执行。

**限流**：防止工具被过度调用。

## MCP 客户端使用

### Claude Desktop 配置

在 Claude Desktop 的配置文件中添加 MCP 服务器：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

### 在对话中使用

在 AI 对话中，可以直接调用 MCP 工具：

```
请帮我读取 config.json 文件的内容，然后计算一下平均值。
```

## MCP 开发实例：天气服务器

### 功能设计

获取指定城市的天气信息。缓存天气数据减少 API 调用。支持多语言输出。

### 完整实现

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server('weather-server', '1.0.0');

const cache = new Map();

// 工具定义
const tools = {
  'get_weather': {
    name: 'get_weather',
    description: '获取指定城市的天气信息',
    inputSchema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '城市名称（中文或英文）',
        },
        lang: {
          type: 'string',
          description: '输出语言（zh/en）',
          enum: ['zh', 'en'],
        },
      },
      required: ['city'],
    },
  },
};

// 处理工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: Object.values(tools) };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_weather') {
    const { city, lang = 'zh' } = args;
    const cacheKey = `${city}_${lang}`;
    
    // 检查缓存
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.time < 3600000) { // 1小时有效
        return { content: [{ type: 'text', text: cached.data }] };
      }
    }
    
    // 调用天气 API（这里用模拟数据）
    const weatherData = await fetchWeatherData(city, lang);
    
    // 更新缓存
    cache.set(cacheKey, { data: weatherData, time: Date.now() });
    
    return { content: [{ type: 'text', text: weatherData }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 模拟天气 API
async function fetchWeatherData(city, lang) {
  // 实际项目中这里调用真实的天气 API
  const data = { temperature: '22°C', condition: '多云' };
  return lang === 'zh' 
    ? `${city}当前天气：${data.temperature}，${data.condition}`
    : `${city} Current weather: ${data.temperature}, ${data.condition}`;
}

// 启动
const transport = new StdioServerTransport();
server.connect(transport);
```

## 扩展学习

### 相关资源

MCP 官方文档。Model Context Protocol SDK。开源 MCP 服务器示例。

### 进阶主题

认证和授权机制。复杂的多服务器协调。性能监控和日志。
