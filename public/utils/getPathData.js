export const getPathData = () => {
  const { pathname } = window.location;
  const [, path, pathData] = pathname.split("/");
  return [path, pathData];
};
