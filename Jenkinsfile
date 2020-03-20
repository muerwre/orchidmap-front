pipeline {
    agent any
    
    parameters {
        gitParameter branchFilter: '(.*)', defaultValue: 'master', name: 'BRANCH', type: 'PT_BRANCH'
    }

    stages {
        stage('Show the branch 1') {
            steps {
                sh '/bin/true'
                echo "${params.BRANCH}"
            }
        }
    }
}