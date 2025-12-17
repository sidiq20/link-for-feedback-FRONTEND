import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            
            <div className="bg-card-dark rounded-xl border border-card-dark p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="h-32 w-32 rounded-full bg-student-primary/20 flex items-center justify-center text-student-primary text-4xl font-bold border-4 border-card-dark shadow-xl">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Full Name</label>
                            <div className="flex items-center gap-3 mt-1 text-white text-lg">
                                <User className="text-student-primary" size={20} />
                                {user?.name}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-text-secondary">Email Address</label>
                            <div className="flex items-center gap-3 mt-1 text-white text-lg">
                                <Mail className="text-student-primary" size={20} />
                                {user?.email}
                            </div>
                        </div>

                         <div>
                            <label className="text-sm font-medium text-text-secondary">Role</label>
                            <div className="flex items-center gap-3 mt-1 text-white text-lg">
                                <Shield className="text-student-primary" size={20} />
                                <span className="capitalize">{user?.role || 'Student'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
