import type { DialogProps } from '../Dialog';
import { Dialog } from '../Dialog';

export type ModalProps = DialogProps;

export function Modal(props: ModalProps) {
  return <Dialog {...props} />;
}
