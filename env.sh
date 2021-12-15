{
  echo REACT_APP_VERCEL_GIT_REPO_OWNER=compose-run
  echo REACT_APP_VERCEL_GIT_REPO_SLUG=community 
  echo REACT_APP_VERCEL_GIT_COMMIT_REF=$(git symbolic-ref --short HEAD)
  echo REACT_APP_VERCEL_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 1)
} > .env.development.local

{
  echo REACT_APP_VERCEL_PREVIOUS_1_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 2 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_2_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 3 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_3_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 4 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_4_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 5 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_5_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 6 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_6_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 7 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_7_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 8 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_8_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 9 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_9_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 10 | tail -n 1)
  echo REACT_APP_VERCEL_PREVIOUS_10_GIT_COMMIT_SHA=$(git log --pretty=format:'%H' -n 11 | tail -n 1)   
} > .env.local