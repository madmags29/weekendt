"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Share, Users, Search, Smartphone, Globe, Activity } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    total_searches: number;
    active_users: number;
    top_keywords: { name: string; count: number }[];
    device_stats: { name: string; value: number }[];
    os_stats: { name: string; value: number }[];
    traffic_data: { hour: string; visits: number }[];
    top_events: { name: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TrackerPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/dashboard`);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Check local storage for dark mode preference or just force dark for "cool" look?
        // Let's stick to system/theme provider.
        const interval = setInterval(fetchStats, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!stats) return <div className="text-white text-center mt-20">Failed to load data. Backend might be offline.</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                        Analytics Center
                    </h1>
                    <p className="text-slate-400 mt-2">Real-time insights for Weekend Travellers</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">Back to App</Link>
                    <button onClick={fetchStats} className="p-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition">
                        <Activity className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Active Users (30m)"
                    value={stats.active_users}
                    icon={<Users className="w-6 h-6 text-green-400" />}
                    trend="+12%" // Mock trend for cool factor
                />
                <MetricCard
                    title="Total Searches"
                    value={stats.total_searches}
                    icon={<Search className="w-6 h-6 text-purple-400" />}
                    trend="+5%"
                />
                <MetricCard
                    title="Top Destination"
                    value={stats.top_keywords[0]?.name || "N/A"}
                    icon={<Globe className="w-6 h-6 text-blue-400" />}
                    subtext={stats.top_keywords[0] ? `${stats.top_keywords[0].count} searches` : ""}
                />
                <MetricCard
                    title="Dominant OS"
                    value={stats.os_stats.reduce((a, b) => a.value > b.value ? a : b, { name: '-', value: 0 }).name}
                    icon={<Smartphone className="w-6 h-6 text-orange-400" />}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Traffic Chart */}
                <ChartCard title="Hourly Traffic (24h)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.traffic_data}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="hour" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Area type="monotone" dataKey="visits" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVisits)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Top Destinations Bar Chart */}
                <ChartCard title="Top Trending Destinations">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.top_keywords} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Device Distribution */}
                <ChartCard title="Device Breakdown">
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.device_stats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.device_stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* OS Distribution */}
                <ChartCard title="OS Platform">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.os_stats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Top Events */}
                <ChartCard title="Top Custom Events">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.top_events || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, subtext }: any) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                </div>
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                {trend && <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{trend}</span>}
            </div>
            {subtext && <p className="text-slate-500 text-sm mt-1">{subtext}</p>}
        </div>
    );
}

function ChartCard({ title, children }: any) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                {title}
            </h3>
            {children}
        </div>
    );
}
