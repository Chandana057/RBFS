import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HardDrive, FileText, Database, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fileService } from "../services/fileService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0, recentActivity: [] });
  const [chartData, setChartData] = useState({ types: [], uploads: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const files = await fileService.getFiles(user.role, user.id);
        const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);
        
        // Mock recent activity based on files
        const recent = files.slice(0, 5).map(f => ({
          id: `act-${f.id}`,
          action: "Uploaded",
          item: f.name,
          time: new Date(f.uploadDate).toLocaleDateString(),
        }));

        // Calculate chart data
        const typeCount = {};
        files.forEach(f => {
          const type = f.type.split('/')[1] || "other";
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        const typeData = Object.keys(typeCount).map(k => ({ name: k, value: typeCount[k] }));

        setChartData({
          types: typeData,
          uploads: [
            { name: 'Mon', value: Math.floor(Math.random() * 10) },
            { name: 'Tue', value: Math.floor(Math.random() * 10) },
            { name: 'Wed', value: Math.floor(Math.random() * 10) },
            { name: 'Thu', value: Math.floor(Math.random() * 10) },
            { name: 'Fri', value: files.length },
          ]
        });

        setStats({
          totalFiles: files.length,
          totalSize: (totalSize / (1024 * 1024)).toFixed(2), // MB
          recentActivity: recent
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user.role, user.id]);

  const COLORS = ['#a3a6ff', '#ac8aff', '#9bffce', '#ff6e84'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-manrope font-bold text-on-surface">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-surface-container/20 h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-on-surface mb-2">Welcome back, {user.name}</h1>
        <p className="text-on-surface-variant">Here's what's happening in your vault.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Files" 
          value={stats.totalFiles} 
          icon={<FileText className="w-5 h-5 text-primary" />} 
          trend="+12% this week"
        />
        <StatCard 
          title="Storage Used" 
          value={`${stats.totalSize} MB`} 
          icon={<HardDrive className="w-5 h-5 text-secondary" />} 
          trend="4.5 GB remaining"
        />
        <StatCard 
          title="Active Shares" 
          value={Math.floor(stats.totalFiles * 0.8)} 
          icon={<Database className="w-5 h-5 text-tertiary" />} 
          trend="Secure links active"
        />
        <StatCard 
          title="Security Score" 
          value="98/100" 
          icon={<Activity className="w-5 h-5 text-error" />} 
          trend="Optimal state"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Frequency</CardTitle>
            <CardDescription>File uploads over the last 5 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.uploads}>
                <XAxis dataKey="name" stroke="#a9abb3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1c2028', border: 'none', borderRadius: '8px', color: '#ecedf6' }} />
                <Line type="monotone" dataKey="value" stroke="#a3a6ff" strokeWidth={3} dot={{ r: 4, fill: '#a3a6ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Storage by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData.types} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.types.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1c2028', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(163,166,255,0.8)]" />
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {act.action} <span className="text-primary">{act.item}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Role Info */}
        <Card>
          <CardHeader>
            <CardTitle>Access Level</CardTitle>
            <CardDescription>Your current permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 border ghost-border mb-6">
                <ShieldIcon role={user.role} />
              </div>
              <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="mb-2 uppercase tracking-widest px-4 py-1">
                {user.role}
              </Badge>
              <p className="text-sm text-on-surface-variant max-w-[200px] mt-4">
                {user.role === 'admin' ? "You have full access to all files and user management." : "You can manage your own files and view shared team assets."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }) => (
  <motion.div whileHover={{ y: -4 }}>
    <Card className="h-full border-t border-l border-white/5 bg-gradient-to-br from-surface-container-high/60 to-surface-container-lowest overflow-hidden relative group">
      <CardContent className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-on-surface-variant">{title}</p>
          <div className="p-2 bg-surface-container rounded-lg border ghost-border">{icon}</div>
        </div>
        <h3 className="text-3xl font-manrope font-bold text-on-surface mb-2">{value}</h3>
        <p className="text-xs text-on-surface-variant">{trend}</p>
      </CardContent>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  </motion.div>
);

const ShieldIcon = ({ role }) => {
  if (role === 'admin') return <Activity className="w-8 h-8 text-primary glow-primary-hover" />;
  return <FileText className="w-8 h-8 text-on-surface-variant" />;
};
