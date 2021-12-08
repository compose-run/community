REACT_APP_VERCEL_GIT_REPO_OWNER=@compose-run
REACT_APP_VERCEL_GIT_REPO_ID=community
REACT_APP_VERCEL_GIT_COMMIT_REF=$(git symbolic-ref --short HEAD)
REACT_APP_VERCEL_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 1)