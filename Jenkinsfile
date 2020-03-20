pipeline {
    agent any
    
    parameters {
        gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    }

    stages {
        stage('Show the branch 1') {
            steps {
                sh '/bin/true'
                echo "BRANCH IS: ${params.BRANCH}"
            }
        }
    }

    node('master') {
        build job: 'build', parameters: [string(name: 'Branch', value: "${env.BRANCH_NAME}")], propagate: true, wait: true
        build job: 'release', parameters: [string(name: 'Branch', value: "${env.BRANCH_NAME}")], propagate: true, wait: true
    }
}