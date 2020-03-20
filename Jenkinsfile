pipeline {
    agent any
    
    parameters {
        gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm build'
            }
        }    

        stage('If dev') {
            when {
                branch 'develop'
            }
            
            steps{
                echo "====== its a dev!!! ======"
            }
        }

        stage('If master') {
            when {
                branch 'master'
            }

            steps{
                echo "====== its a MASTER!!! ======"
            }
        }
    }
}