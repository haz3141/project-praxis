import { AtomicInput } from '../atoms/Input';
import type { AtomicInputProps } from '../atoms/Input';

export type SearchFieldProps = Omit<AtomicInputProps, 'type'>;

export function SearchField(props: SearchFieldProps) {
  return <AtomicInput type="search" label="Search" placeholder="Search..." {...props} />;
}
