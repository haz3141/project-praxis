import type { ReactNode } from 'react';

export interface TodayTemplateProps {
  priorities: ReactNode;
  taskList: ReactNode;
  weekStrip: ReactNode;
  overlays?: ReactNode;
}

export function TodayTemplate({ priorities, taskList, weekStrip, overlays }: TodayTemplateProps) {
  return (
    <div className="ds-template-today">
      <section className="ds-template-priorities">{priorities}</section>
      <section className="ds-template-week">{weekStrip}</section>
      <section className="ds-template-tasks">{taskList}</section>
      {overlays ? <aside className="ds-template-overlays">{overlays}</aside> : null}
    </div>
  );
}
