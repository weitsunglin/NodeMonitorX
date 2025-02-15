import jenkins.model.*
import hudson.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition

def jenkins = Jenkins.getInstance()

def jobName = 'Backup'
def jobDescription = 'Pipeline to backup SQL Server and Jenkins Home'

def pipelineScript = '''
pipeline {
    agent any
    environment {
        SQL_SERVER_CONTAINER_NAME = 'docker-sqlserver-1'
        SQL_BACKUP_FILE = 'sql_backup.bak'
        JENKINS_BACKUP_FILE = 'jenkins_backup.tar.gz'
        LOCAL_BACKUP_PATH = '/shared_data'
        SQLCMD = '/opt/mssql-tools/bin/sqlcmd'
        SA_PASSWORD = 'YourStrong@Passw0rd'
    }
    stages {
        stage('Backup SQL Server') {
            steps {
                script {
                    // 執行 SQL Server 備份
                    sh """
                    docker exec ${SQL_SERVER_CONTAINER_NAME} ${SQLCMD} -S localhost -U sa -P '${SA_PASSWORD}' -Q "BACKUP DATABASE [MyDatabase] TO DISK = N'/var/opt/mssql/backup/${SQL_BACKUP_FILE}' WITH NOFORMAT, NOINIT, NAME = 'MyDatabase-full', SKIP, NOREWIND, NOUNLOAD, STATS = 10"
                    """
                                        
                    // 將備份文件複製到本地掛載目錄
                    sh """
                    docker cp ${SQL_SERVER_CONTAINER_NAME}:/var/opt/mssql/backup/${SQL_BACKUP_FILE} ${LOCAL_BACKUP_PATH}/
                    """
                }
            }
        }
        stage('Backup Jenkins Home') {
            steps {
                script {
                    // 壓縮 Jenkins Home 目錄，忽略 tar 命令的退出狀態
                    sh """
                    tar -czf ${LOCAL_BACKUP_PATH}/${JENKINS_BACKUP_FILE} -C /var/jenkins_home . || true
                    """
                }
            }
        }
    }
    post {
        always {
            // 列出 /shared_data 目錄的內容
            sh 'ls -la /shared_data'

        }
    }
}
'''

def job = jenkins.createProject(WorkflowJob, jobName)
job.setDescription(jobDescription)
job.setDefinition(new CpsFlowDefinition(pipelineScript, true))

println("Pipeline job '${jobName}' created successfully.")

jenkins.save()