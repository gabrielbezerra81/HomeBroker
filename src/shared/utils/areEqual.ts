import isEqual from "lodash/isEqual";

export default function areEqual(prevProps: any, nextProps: any) {
  return isEqual(prevProps, nextProps);
}
