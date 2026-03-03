import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
}

function nextEnabledIndex(tabs: TabItem[], start: number, direction: 1 | -1): number {
  const count = tabs.length;
  let index = start;

  for (let i = 0; i < count; i += 1) {
    index = (index + direction + count) % count;
    if (!tabs[index].disabled) {
      return index;
    }
  }

  return start;
}

export function Tabs({ tabs, defaultTabId, onTabChange }: TabsProps) {
  const fallbackTab = useMemo(() => tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id, [tabs]);
  const [activeId, setActiveId] = useState(defaultTabId ?? fallbackTab);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (tabs.length === 0 || !activeId) {
    return null;
  }

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const setActive = (index: number, focus = false) => {
    const target = tabs[index];
    if (!target || target.disabled) {
      return;
    }

    setActiveId(target.id);
    onTabChange?.(target.id);
    if (focus) {
      tabRefs.current[index]?.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const next = nextEnabledIndex(tabs, index, 1);
        setActive(next, true);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const previous = nextEnabledIndex(tabs, index, -1);
        setActive(previous, true);
        break;
      }
      case 'Home': {
        event.preventDefault();
        const first = tabs.findIndex((tab) => !tab.disabled);
        if (first >= 0) {
          setActive(first, true);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        const reversed = [...tabs].reverse();
        const offset = reversed.findIndex((tab) => !tab.disabled);
        if (offset >= 0) {
          const last = tabs.length - 1 - offset;
          setActive(last, true);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="ds-tabs">
      <div className="ds-tabs-list" role="tablist" aria-orientation="horizontal">
        {tabs.map((tab, index) => {
          const isSelected = tab.id === activeTab.id;
          const tabId = `ds-tab-${tab.id}`;
          const panelId = `ds-tab-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              className="ds-tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`ds-tab-panel-${activeTab.id}`}
        className="ds-tab-panel"
        role="tabpanel"
        aria-labelledby={`ds-tab-${activeTab.id}`}
      >
        {activeTab.content}
      </div>
    </div>
  );
}
