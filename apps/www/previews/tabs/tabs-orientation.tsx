import { Tabs, TabsList, TabsTab, TabsPanel } from '@/registry/ui/tabs';

export default function TabsOrientation() {
  return (
    <Tabs defaultValue="overview" orientation="vertical">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="analytics">Analytics</TabsTab>
        <TabsTab value="reports">Reports</TabsTab>
      </TabsList>
      <TabsPanel value="overview">
        <p className="text-sm text-secondary">Overview content</p>
      </TabsPanel>
      <TabsPanel value="analytics">
        <p className="text-sm text-secondary">Analytics content</p>
      </TabsPanel>
      <TabsPanel value="reports">
        <p className="text-sm text-secondary">Reports content</p>
      </TabsPanel>
    </Tabs>
  );
}
