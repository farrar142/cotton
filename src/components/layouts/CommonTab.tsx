import useValue from '#/hooks/useValue';
import { glassmorphism } from '#/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel, { TabPanelProps } from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import React from 'react';
import { MouseEventHandler, ReactNode, useMemo } from 'react';

type TabProp = {
  label: string;
  value: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};
const normalizeTabProps = (prop: TabProp | string) => {
  if (typeof prop === 'string') return { value: prop, label: prop };
  return prop;
};

export const CommonTab: React.FC<{
  panels: ReactNode[];
  labels: (string | TabProp | undefined)[];
  top?: number;
  defaultTabIndex?: number;
  pannelProps?: Partial<TabPanelProps>;
  sharedTopSlot?: ReactNode;
}> = ({
  panels,
  labels,
  sharedTopSlot,
  top = 0,
  defaultTabIndex = 0,
  pannelProps = {},
}) => {
  const normalized = useMemo(
    () => labels.filter((r) => r !== undefined).map(normalizeTabProps),
    [labels]
  );
  const tabValue = useValue(normalized[defaultTabIndex].value);
  const keypanels = (() => {
    const keypanels: { label: TabProp; children: ReactNode }[] = [];
    for (let i = 0; i < normalized.length; i++) {
      keypanels.push({ label: normalized[i], children: panels[i] });
    }
    return keypanels;
  })();
  return (
    <TabContext value={tabValue.get}>
      <TabList
        sx={(theme) => ({
          display: 'flex',
          position: 'sticky',
          top,
          zIndex: 5,
          width: '100%',
          ...glassmorphism(theme),
        })}
        onChange={(e, value) => {
          tabValue.set(value);
        }}
      >
        {normalized.map(({ label, value, onClick }, index) => (
          <Tab
            value={value}
            label={label}
            key={`${index}:${label}`}
            sx={(theme) => ({
              flex: 1,
              minWidth: `${100 / normalized.length}%`,
              ':hover': { bgcolor: theme.palette.action.hover },
            })}
            onClick={onClick}
          />
        ))}
      </TabList>
      {keypanels.map(({ label, children }, index) => (
        <TabPanel
          {...pannelProps}
          value={label.value}
          key={`${index}:${label.value}`}
        >
          <React.Fragment key='additionalProps'>{sharedTopSlot}</React.Fragment>
          {children}
        </TabPanel>
      ))}
    </TabContext>
  );
};
