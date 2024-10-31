FROM jenkins/jenkins:lts

USER root

# 安裝 Docker 客戶端
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# 安裝指定的 Jenkins 插件
RUN jenkins-plugin-cli --plugins \
    workflow-aggregator \
    workflow-job \
    pipeline-stage-view \
    workflow-scm-step \
    workflow-durable-task-step \
    ws-cleanup 


# 複製初始化腳本
COPY init.groovy.d /usr/share/jenkins/ref/init.groovy.d/

# 切換回 Jenkins 用戶
USER jenkins
