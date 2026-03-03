import type { DrawerProps } from '../Drawer';
import { Drawer } from '../Drawer';

export type DrawerPanelProps = DrawerProps;

export function DrawerPanel(props: DrawerPanelProps) {
  return <Drawer {...props} />;
}
