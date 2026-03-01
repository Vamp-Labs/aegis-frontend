export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome to the Aegis Protocol. Your wallet is successfully connected and authenticated.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Active Positions</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Protected Vaults</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Circuit Breaker</h3>
                    <p className="text-3xl font-bold text-gray-600 mt-2">Normal</p>
                </div>
            </div>
        </div>
    );
}
