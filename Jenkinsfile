pipeline {
    agent any
    
    // parameters {
        // gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    // }

    environment {
        ENV_NAME = "${env.BRANCH_NAME == "develop" ? "staging" : "production"}"
    }

    stages {
        stage('Build') {
            steps {
                echo "${ENV_NAME}"
                // sh 'pwd'
                // sh 'ls'
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