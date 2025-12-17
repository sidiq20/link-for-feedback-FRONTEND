import React from 'react';
import { Settings as SettingsIcon, Bell, Moon, Lock } from 'lucide-react';

const Settings = () => {
    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <SettingsIcon /> Settings
            </h1>
            
            <div className="space-y-6">
                <div className="bg-card-dark rounded-xl border border-card-dark p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Bell size={20} /> Notifications
                    </h3>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Email Notifications</span>
                            <div className="w-12 h-6 bg-student-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Exam Reminders</span>
                            <div className="w-12 h-6 bg-student-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card-dark rounded-xl border border-card-dark p-6">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={20} /> Security
                    </h3>
                    <button className="px-4 py-2 bg-[#111a22] text-white rounded-lg hover:bg-[#1a2632] transition-colors">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
