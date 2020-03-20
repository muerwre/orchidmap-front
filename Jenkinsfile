def failed = false

pipeline {
    agent any
    
    // parameters {
        // gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    // }

    environment {        
        WWW = "${env.BRANCH_NAME == "master" ? env.ORCHID_STABLE_WWW : env.ORCHID_STAGING_WWW}"
        ENV = "${env.BRANCH_NAME == "master" ? env.ORCHID_STABLE_ENV : env.ORCHID_STAGING_ENV}"
    }

    stages {
        stage('CHECK') {
            steps {
                echo "WWW: ${WWW}"
                echo "ENV: ${ENV}"
                sh 'pwd'
                sh 'ls'

                script {
                    if("${WWW}" == "" || "${ENV}" == "" || ("${env.BRANCH_NAME}" != "master" && "${env.BRANCH_NAME}" != "develop")) {
                        println "INCORRECT VARIABLES"
                        currentBuild.result = 'FAILED'
                        failed = true
                        return
                    }
                }
            }
        }    

        stage('Copy ENV files') {
            steps {
                sh "cp -a ${ENV}/. ./"
            }
        }

        stage('LS') {
            steps {
                sh "ls -a ./"
                sh "ls -a ${ENV}"
                sh "ls -a ./src/config"
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Deploy: dev') {
            when {
                branch 'develop'
                expression {
                    !failed
                }
            }
            
            steps{
                sh "rm -rf ${WWW}"
                sh "mv ./dist ${WWW}"
            }
        }

        stage('Deploy: master') {
            when {
                branch 'master'
                expression {
                    !failed
                }
            }

            steps{
                echo "====== its a MASTER!!! ======"
            }
        }
    }
}