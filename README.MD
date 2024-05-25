- 下载 dockerhub desktop intel 版本，并安装，且启动
- 利用 ubuntu latest 镜像 创建一个 ubuntu 容器
- 启动容器，并重载配置文件
- brew install docker && docker version
- brew install act && act 选 medium
- cd 进 repo

# 调试方法

docker ps 获取容器 ID
docker exec -it 容器 ID /bin/bash 进入容器内调试
docker logs 容器 ID 查看错误日志

# 调试 action 第三方插件

use: ./libs/第三方 相对于项目根目录
