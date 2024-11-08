# 使用官方的 Node 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装 PM2
RUN npm install pm2 -g

# 安装依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露端口 3000
EXPOSE 3000

# 启动应用
CMD ["sh", "-c", "pm2-runtime start ./ecosystem.config.js"]