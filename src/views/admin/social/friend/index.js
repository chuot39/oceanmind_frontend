import React from 'react';

const Dashboard = () => {
    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Friend Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Profile</h2>
                        <p className="text-gray-700">View and edit your profile information.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Settings</h2>
                        <p className="text-gray-700">Manage your account settings.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
                        <p className="text-gray-700">Check your recent notifications.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;