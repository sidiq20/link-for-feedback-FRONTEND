import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormsAPI } from '../services/api';
import FormCard from '../components/forms/FormCard';
import ShareModal from '../components/forms/ShareModal';
import {
     Plus, Search, FileText
    } from 'lucide-react';

const Forms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            setError('');
            const response = await FormsAPI.list();
            setForms(response.data || []);
        } catch (error) {
            console.error('Falied to fetch forms:', error);
            setError('Failed to load forms.');
            setForms([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (formId) => {
        if (window.confirm('Delete this form?')) {
            try {
                await FormsAPI.delete(formId);
                fetchForms();
            } catch (error) {
                setError('Failed to delete form.');
            }
        }
    };

    const handleShare = (form) => {
        setSelectedForm(form);
        setShowShareModal(true);
    };

    const filteredForms = forms.filter(form => 
        form.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className='animate-pulse space-y-4'>
                    {[1,2,3].map(i => <div key={i} className='h-20 bg-slate-800 rounded-xl'></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-bold text-white'>Forms</h1>
                    <p className='text-gray-400'>Manage abd track your forms</p>
                </div>
                <Link 
                    to='/forms/new'
                    className='mt-4 sm:mt-0 flex items-center px-4 py-2 bg-whisper-accent-yellow rounded-lg text-black font-medium'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Create Form 
                </Link>
            </div>

            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-3.5 text-gray-400 w-5 h-5' />
                <input 
                    type='text'
                    placeholder='Search forms...'
                    className='w-full pl-10 pr-4 py-3 bg-whisper-card border border-whisper-border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className='space-y-4'>
                {filteredForms.length === 0 ? (
                    <div className='text-center py-12'>
                        <FileText className='w-16 h-16 text-gray-600 mx-auto mb-4' />
                        <h3 className='text-xl font-medium text-white mb-2'>No forms found</h3>
                        <p className='text-gray-400 mb-6'>
                            {searchTerm ? 'Try adjusting your search terms' : 'Create your first form to get started'}
                        </p>
                        {!searchTerm && (
                            <Link
                                to='/forms/new'
                                className='inline-flex items-center px-4 py-2 bg-whisper-accent-yellow hover:bg-opacity-90 text-black rounded-lg font-medium transition-colors'
                            >
                                <Plus className='w-4 h-4 mr-2' />
                                Create Your First Form
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredForms.map(form => (
                        <FormCard
                            key={form._id}
                            form={form}
                            onDelete={handleDelete}
                            onShare={handleShare}
                        />
                    ))
                )}
            </div>

            {/* Share Modal */}
            <ShareModal
                form={selectedForm}
                isOpen={showShareModal}
                onClose={() => {
                    setShowShareModal(false);
                    setSelectedForm(null);
                }}
            />
        </div>
    );
};

export default Forms;