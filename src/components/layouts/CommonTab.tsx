import useValue from '#/hooks/useValue';
import { glassmorphism } from '#/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel, { TabPanelProps } from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
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
  labels: (string | TabProp)[];
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
  const normalized = useMemo(() => labels.map(normalizeTabProps), [labels]);
  const tabValue = useValue(normalized[defaultTabIndex].value);
  const keypanels = (() => {
    const keypanels: { label: TabProp; children: ReactNode }[] = [];
    for (let i = 0; i < labels.length; i++) {
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
        {normalized.map(({ label, value, onClick }) => (
          <Tab
            value={value}
            label={label}
            key={label}
            sx={(theme) => ({
              flex: 1,
              minWidth: `${100 / normalized.length}%`,
              ':hover': { bgcolor: theme.palette.action.hover },
            })}
            onClick={onClick}
          />
        ))}
      </TabList>
      {keypanels.map(({ label, children }) => (
        <TabPanel {...pannelProps} value={label.value} key={label.value}>
          {sharedTopSlot}
          {children}
        </TabPanel>
      ))}
    </TabContext>
  );
};
