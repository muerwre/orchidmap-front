pipeline {
    agent any
    
    parameters {
        gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    }

    stages {
        stage('Build') {
            steps {
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