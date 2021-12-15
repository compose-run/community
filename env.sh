{
  echo REACT_APP_VERCEL_GIT_REPO_OWNER=compose-run
  echo REACT_APP_VERCEL_GIT_REPO_SLUG=community 
  echo REACT_APP_VERCEL_GIT_COMMIT_REF=$(git symbolic-ref --short HEAD)
  echo REACT_APP_VERCEL_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 1)
} > .env.development.local