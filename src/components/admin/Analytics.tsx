import { useGames } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { BarChart3, TrendingUp, TrendingDown, Download, Users, Briefcase, Award, Crown, ArrowUp, ArrowDown } from 'lucide-react';

const Analytics = () => {
  const { apps, totalRevenue } = useGames();
  const { allUsers, teams, user } = useAuth();
  const { transactions } = usePayment();

  // --- Permission Logic ---
  const isCEO = user?.role === 'ceo' || user?.role === 'owner';
  const isMD = user?.role === 'md';
  const isManager = user?.role === 'manager';
  const isTL = user?.role === 'tl';
  const isStaff = user?.role === 'staff';

  // --- Data Calculation ---

  // 1. Corporate Performance Analytics (CEO/MD/Manager)
  const topDownloaded = [...apps].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0)).slice(0, 5);
  const lowestDownloaded = [...apps].filter(a => (a.downloadCount || 0) > 0).sort((a, b) => (a.downloadCount || 0) - (b.downloadCount || 0)).slice(0, 5);
  const mostInstalled = [...apps].sort((a, b) => (b.installCount || 0) - (a.installCount || 0))[0];

  // 2. CEO Dashboard Stats
  const totalUploads = apps.length;
  const totalDownloads = apps.reduce((acc, app) => acc + (app.downloadCount || 0), 0);
  const totalPremiumPurchases = transactions.filter(t => t.status === 'verified').length;
  
  const highestDownloadGame = topDownloaded[0];
  const lowestDownloadGame = lowestDownloaded[0];

  // 3. Employee Performance
  const employeeStats = allUsers
    .filter(u => ['staff', 'tl', 'manager'].includes(u.role))
    .map(emp => {
      const empApps = apps.filter(a => a.uploadedBy === emp.id);
      const totalUploads = empApps.length;
      const totalDownloads = empApps.reduce((acc, a) => acc + (a.downloadCount || 0), 0);
      const teamName = teams.find(t => t.staffIds.includes(emp.id) || t.tlId === emp.id || t.managerId === emp.id)?.name || 'Unassigned';
      
      return {
        id: emp.id,
        name: emp.username,
        role: emp.role,
        team: teamName,
        totalUploads,
        totalDownloads
      };
    })
    .sort((a, b) => b.totalDownloads - a.totalDownloads); // Rank by impact (downloads)

  const topEmployee = employeeStats[0];

  // 4. Team Performance
  const teamStats = teams.map(team => {
      const members = [team.tlId, ...team.staffIds].filter(Boolean) as string[];
      const teamApps = apps.filter(a => a.uploadedBy && members.includes(a.uploadedBy));
      const totalDownloads = teamApps.reduce((acc, a) => acc + (a.downloadCount || 0), 0);
      return {
          id: team.id,
          name: team.name,
          totalDownloads
      };
  }).sort((a, b) => b.totalDownloads - a.totalDownloads);

  const topTeam = teamStats[0];

  // 5. Manager Performance
  const managerStats = allUsers
    .filter(u => u.role === 'manager')
    .map(mgr => {
      const managedTeams = teams.filter(t => t.managerId === mgr.id);
      const staffIds = managedTeams.flatMap(t => [t.tlId, ...t.staffIds]).filter(Boolean) as string[];
      const teamApps = apps.filter(a => a.uploadedBy && staffIds.includes(a.uploadedBy));
      const totalUploads = teamApps.length;
      const totalDownloads = teamApps.reduce((acc, a) => acc + (a.downloadCount || 0), 0);
      
      const bestTeam = managedTeams.map(t => {
           const tMembers = [t.tlId, ...t.staffIds].filter(Boolean) as string[];
           const tDownloads = apps.filter(a => a.uploadedBy && tMembers.includes(a.uploadedBy))
                                  .reduce((acc, a) => acc + (a.downloadCount || 0), 0);
           return { name: t.name, downloads: tDownloads };
      }).sort((a, b) => b.downloads - a.downloads)[0];

      return {
        id: mgr.id,
        name: mgr.username,
        teamsCount: managedTeams.length,
        totalUploads,
        totalDownloads,
        bestTeamName: bestTeam?.name || 'N/A'
      };
    })
    .sort((a, b) => b.totalDownloads - a.totalDownloads);

  // --- Filtering based on Role ---
  
  // Staff: Only see own stats
  if (isStaff) {
      const myStats = employeeStats.find(e => e.id === user?.id);
      return (
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">My Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-500">Total Uploads</div>
                      <div className="text-2xl font-bold">{myStats?.totalUploads || 0}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-500">Total Downloads Generated</div>
                      <div className="text-2xl font-bold text-blue-600">{(myStats?.totalDownloads || 0).toLocaleString()}</div>
                  </div>
              </div>
          </div>
      );
  }

  // TL: See Team Stats
  if (isTL) {
      const myTeam = teams.find(t => t.tlId === user?.id);
      const teamMembers = employeeStats.filter(e => myTeam?.staffIds.includes(e.id) || e.id === user?.id);
      
      return (
          <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold mb-4">Team Performance: {myTeam?.name || 'Unassigned'}</h2>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                  <th className="px-4 py-2">Member</th>
                                  <th className="px-4 py-2">Role</th>
                                  <th className="px-4 py-2 text-right">Uploads</th>
                                  <th className="px-4 py-2 text-right">Downloads</th>
                              </tr>
                          </thead>
                          <tbody>
                              {teamMembers.map(m => (
                                  <tr key={m.id} className="border-b border-gray-100 dark:border-gray-700">
                                      <td className="px-4 py-2 font-medium">{m.name}</td>
                                      <td className="px-4 py-2 capitalize text-gray-500">{m.role}</td>
                                      <td className="px-4 py-2 text-right">{m.totalUploads}</td>
                                      <td className="px-4 py-2 text-right">{m.totalDownloads.toLocaleString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  }

  // Manager/MD/CEO View
  return (
    <div className="space-y-8">
      {/* CEO Corporate Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1: Totals */}
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Briefcase size={48} /></div>
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Games Uploaded</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalUploads}</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Download size={48} /></div>
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Downloads</div>
          <div className="text-2xl font-bold text-blue-600">{(totalDownloads / 1000000).toFixed(2)}M</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-10"><Crown size={48} /></div>
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Premium Purchases</div>
          <div className="text-2xl font-bold text-green-600">{totalPremiumPurchases}</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-10"><Award size={48} /></div>
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-purple-600">₹{totalRevenue.toLocaleString()}</div>
        </div>

        {/* Row 2: High/Low & Top Performers */}
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><ArrowUp size={12} className="text-green-500"/> Highest Download</div>
          <div className="font-bold text-gray-900 dark:text-white truncate" title={highestDownloadGame?.title}>{highestDownloadGame?.title || 'N/A'}</div>
          <div className="text-xs text-green-600">{(highestDownloadGame?.downloadCount || 0).toLocaleString()} DLs</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><ArrowDown size={12} className="text-red-500"/> Lowest Download</div>
          <div className="font-bold text-gray-900 dark:text-white truncate" title={lowestDownloadGame?.title}>{lowestDownloadGame?.title || 'N/A'}</div>
          <div className="text-xs text-red-600">{(lowestDownloadGame?.downloadCount || 0).toLocaleString()} DLs</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Top Performing Team</div>
          <div className="font-bold text-gray-900 dark:text-white truncate">{topTeam?.name || 'N/A'}</div>
          <div className="text-xs text-blue-600">{(topTeam?.totalDownloads || 0).toLocaleString()} DLs</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-gray-500 text-xs uppercase font-bold mb-1">Top Employee</div>
          <div className="font-bold text-gray-900 dark:text-white truncate">{topEmployee?.name || 'N/A'}</div>
          <div className="text-xs text-blue-600">{(topEmployee?.totalDownloads || 0).toLocaleString()} DLs</div>
        </div>
      </div>

      {/* Corporate Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Games */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" /> Top 5 Highest Downloaded
          </h3>
          <div className="space-y-3">
            {topDownloaded.map((app, i) => (
              <div key={app.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 w-4">{i + 1}.</span>
                  <span className="truncate max-w-[120px]">{app.title}</span>
                </div>
                <span className="font-mono text-xs bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded">
                  {((app.downloadCount || 0) / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lowest 5 Games */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingDown size={20} className="text-red-500" /> Lowest 5 Downloaded
          </h3>
          <div className="space-y-3">
            {lowestDownloaded.map((app, i) => (
              <div key={app.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 w-4">{i + 1}.</span>
                  <span className="truncate max-w-[120px]">{app.title}</span>
                </div>
                <span className="font-mono text-xs bg-red-50 dark:bg-red-900/20 text-red-600 px-2 py-0.5 rounded">
                  {(app.downloadCount || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Installed */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Download size={20} className="text-blue-500" /> Most Installed Game
          </h3>
          {mostInstalled ? (
            <>
              {mostInstalled.icon && mostInstalled.icon !== '' ? (
                <img src={mostInstalled.icon} className="w-20 h-20 rounded-xl shadow-lg mb-3" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3" />
              )}
              <h4 className="font-bold text-lg">{mostInstalled.title}</h4>
              <p className="text-sm text-gray-500">{mostInstalled.category}</p>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-2 rounded-lg font-bold text-xl">
                {mostInstalled.installCount || 0} Installs
              </div>
            </>
          ) : (
            <p className="text-gray-500">No install data yet</p>
          )}
        </div>
      </div>

      {/* Employee Ranking */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users size={20} className="text-yellow-500" /> Employee Performance Ranking
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 font-bold text-gray-500">Rank</th>
                <th className="px-6 py-3 font-bold text-gray-500">Employee</th>
                <th className="px-6 py-3 font-bold text-gray-500">Role</th>
                <th className="px-6 py-3 font-bold text-gray-500">Team</th>
                <th className="px-6 py-3 font-bold text-gray-500 text-right">Uploads</th>
                <th className="px-6 py-3 font-bold text-gray-500 text-right">Total Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {employeeStats.map((emp, i) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="px-6 py-3 font-bold text-gray-400">#{i + 1}</td>
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{emp.name}</td>
                  <td className="px-6 py-3 capitalize text-gray-500">{emp.role}</td>
                  <td className="px-6 py-3 text-gray-500">{emp.team}</td>
                  <td className="px-6 py-3 text-right font-mono">{emp.totalUploads}</td>
                  <td className="px-6 py-3 text-right font-mono text-blue-600 font-bold">
                    {(emp.totalDownloads / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manager Performance */}
      {(isCEO || isMD) && (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Briefcase size={20} className="text-purple-500" /> Manager Performance
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-500">Manager</th>
                  <th className="px-6 py-3 font-bold text-gray-500">Teams Managed</th>
                  <th className="px-6 py-3 font-bold text-gray-500">Best Team</th>
                  <th className="px-6 py-3 font-bold text-gray-500 text-right">Total Team Uploads</th>
                  <th className="px-6 py-3 font-bold text-gray-500 text-right">Total Team Downloads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {managerStats.map((mgr) => (
                  <tr key={mgr.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{mgr.name}</td>
                    <td className="px-6 py-3 text-gray-500">{mgr.teamsCount}</td>
                    <td className="px-6 py-3 text-gray-500">{mgr.bestTeamName}</td>
                    <td className="px-6 py-3 text-right font-mono">{mgr.totalUploads}</td>
                    <td className="px-6 py-3 text-right font-mono text-purple-600 font-bold">
                      {(mgr.totalDownloads / 1000000).toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
