export default function instanceOfType<T>(
  object: any,
  attr: string,
): object is T {
  return attr in object;
}
