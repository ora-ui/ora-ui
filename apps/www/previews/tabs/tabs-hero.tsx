import { Tabs, TabsList, TabsTab, TabsPanel } from '@/registry/ui/tabs';

export default function TabsHero() {
  return (
    <div className="w-72">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTab value="account">Account</TabsTab>
          <TabsTab value="security">Security</TabsTab>
          <TabsTab value="billing">Billing</TabsTab>
        </TabsList>
        <TabsPanel value="account">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Name</span>
              <span>Alex Morgan</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Email</span>
              <span>alex@example.com</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Role</span>
              <span>Admin</span>
            </div>
          </div>
        </TabsPanel>
        <TabsPanel value="security">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Password</span>
              <span>Updated 3 months ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Two-factor auth</span>
              <span>Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Active sessions</span>
              <span>2</span>
            </div>
          </div>
        </TabsPanel>
        <TabsPanel value="billing">
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Plan</span>
              <span>Pro</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Next billing</span>
              <span>Jun 1, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Amount</span>
              <span>$29/mo</span>
            </div>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  );
}
