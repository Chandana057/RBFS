import React from "react";
import { Activity, Clock } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

export const ActivityPage = () => {
  const activities = [
    { id: 1, action: "Uploaded", item: "Q3_Financial_Report.pdf", time: "2 minutes ago", type: "create" },
    { id: 2, action: "Modified permissions for", item: "Project_Pitch.key", time: "1 hour ago", type: "update" },
    { id: 3, action: "Shared", item: "Logo_Assets.zip", time: "Yesterday", type: "share" },
    { id: 4, action: "Deleted", item: "Old_Notes.txt", time: "Feb 12", type: "delete" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-manrope font-bold text-on-surface">Activity Log</h1>
          <p className="text-on-surface-variant">Track all actions performed within your vault.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y ghost-border">
            {activities.map(act => (
              <div key={act.id} className="p-6 flex items-start gap-4 hover:bg-surface-variant/20 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full ${act.type === 'delete' ? 'bg-error' : act.type === 'update' ? 'bg-secondary' : 'bg-primary'}`} />
                <div className="flex-1">
                  <p className="text-on-surface font-medium">
                    {act.action} <span className="text-primary">{act.item}</span>
                  </p>
                  <p className="text-sm text-on-surface-variant flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" /> {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
