pipeline {
    agent any
    
    // parameters {
        // gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    // }

    environment {        
        WWW = "${env.BRANCH_NAME == "master" ? env.ORCHID_STABLE_WWW : env.ORCHID_STAGING_WWW}"
        ENV = "${env.BRANCH_NAME == "master" ? env.ORCHID_STABLE_ENV : env.ORCHID_STANGING_ENV}"
    }

    stages {
        stage('CHECK') {
            steps {
                echo "WWW: ${WWW}"
                echo "ENV: ${ENV}"
                sh 'pwd'
                sh 'ls'
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