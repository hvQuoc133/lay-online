export function AnimatedNumber({ value }: { value: number }) {
  // A simple way to display number with commas
  return <span>{new Intl.NumberFormat('en-US').format(value)}</span>;
}
