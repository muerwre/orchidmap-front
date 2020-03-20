pipeline {
    agent any
    
    // parameters {
        // gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    // }

    environment {        
        WWW = "${env.BRANCH_NAME == "master" ? "/var/www/on-deploy/map/stable/frontend" : "/var/www/on-deploy/map/staging/frontend"}"
        ENV = "${env.BRANCH_NAME == "master" ? "/opt/deploys/env/map/stable/frontend" : "/opt/deploys/env/map/staging/frontend"}"
        
    }

    stages {
        stage('CHECK') {
            steps {
                echo "WWW: ${WWW}"
                echo "ENV: ${ENV}"
                sh 'pwd'
                sh 'ls'
                // sh 'npm install'
                // sh 'npm run build'
            }
        }    

        stage('Deploy: dev') {
            when {
                branch 'develop'
            }
            
            steps{
                echo "====== its a dev!!! ======"
            }
        }

        stage('Deploy: master') {
            when {
                branch 'master'
            }

            steps{
                echo "====== its a MASTER!!! ======"
            }
        }
    }
}