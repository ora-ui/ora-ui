import { Tabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';

export default function TabsTransition() {
  return (
    <Tabs defaultValue="overview">
      <TabsList transition>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="analytics">Analytics</TabsTab>
        <TabsTab value="reports">Reports</TabsTab>
      </TabsList>
      <TabsPanel value="overview">
        <p className="mt-4 text-sm text-secondary">Overview content</p>
      </TabsPanel>
      <TabsPanel value="analytics">
        <p className="mt-4 text-sm text-secondary">Analytics content</p>
      </TabsPanel>
      <TabsPanel value="reports">
        <p className="mt-4 text-sm text-secondary">Reports content</p>
      </TabsPanel>
    </Tabs>
  );
}
