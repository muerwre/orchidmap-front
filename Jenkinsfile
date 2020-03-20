pipeline {
    agent any
    
    parameters {
        gitParameter branchFilter: '.*/(.*)', defaultValue: 'hoogabooga', name: 'BRANCH', type: 'PT_BRANCH'
    }

    stages {
        stage('Show the branch 1') {
            GIT_BRANCH_LOCAL = sh (
                script: "echo $Branch | sed -e 's|origin/||g'",
                returnStdout: true
            ).trim()

            steps {
                echo "Git branch: ${GIT_BRANCH_LOCAL}"
                sh '/bin/true'
                echo "BRANCH IS: ${env.BRANCH}"
            }
        }
    }
}