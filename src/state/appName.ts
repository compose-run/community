import { getCloudState } from "@compose-run/client";

export const appName = `@${process.env.REACT_APP_VERCEL_GIT_REPO_OWNER}/${process.env.REACT_APP_VERCEL_GIT_REPO_SLUG}/${process.env.REACT_APP_VERCEL_GIT_COMMIT_REF}/${process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA}`;

const possiblePreviousNames = [
  // first try the same commit, off main
  `@${process.env.REACT_APP_VERCEL_GIT_REPO_OWNER}/${process.env.REACT_APP_VERCEL_GIT_REPO_SLUG}/main/${process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA}`,
  // then try one each of the last 10 commits on this branch
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (i) =>
      `@${process.env.REACT_APP_VERCEL_GIT_REPO_OWNER}/${
        process.env.REACT_APP_VERCEL_GIT_REPO_SLUG
      }/${process.env.REACT_APP_VERCEL_GIT_COMMIT_REF}/${
        process.env[`REACT_APP_VERCEL_PREVIOUS_${i}_GIT_COMMIT_SHA`]
      }`
  ),
  // then try the the last 10 commits on main
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (i) =>
      `@${process.env.REACT_APP_VERCEL_GIT_REPO_OWNER}/${
        process.env.REACT_APP_VERCEL_GIT_REPO_SLUG
      }/main/${process.env[`REACT_APP_VERCEL_PREVIOUS_${i}_GIT_COMMIT_SHA`]}`
  ),
];

export const getPreviousState = async <State>(
  name: string,
  initial: State
): Promise<State> => {
  const currentState = await getCloudState<State>(`${appName}/${name}`);
  if (currentState) {
    return initial;
  } // initialState is ignored if the state exists already

  for (const previousName of possiblePreviousNames) {
    const previousState = await getCloudState<State>(`${previousName}/${name}`);
    if (previousState) {
      return previousState;
    }
  }

  return initial;
};
