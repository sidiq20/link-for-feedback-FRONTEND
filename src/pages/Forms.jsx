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
        <div className='py-4 sm:py-6 space-y-4 sm:space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white'>Forms</h1>
                    <p className='text-sm sm:text-base text-gray-400 mt-1'>Manage and track your forms</p>
                </div>
                <Link 
                    to='/forms/new'
                    className='w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 bg-whisper-accent-yellow hover:bg-opacity-90 rounded-lg text-black font-medium transition-colors'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Create Form 
                </Link>
            </div>

            {/* Search */}
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
                <input 
                    type='text'
                    placeholder='Search forms...'
                    className='w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-whisper-card border border-whisper-border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm sm:text-base'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className='space-y-4'>
                {filteredForms.length === 0 ? (
                    <div className='text-center py-8 sm:py-12 px-4'>
                        <FileText className='w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4' />
                        <h3 className='text-lg sm:text-xl font-medium text-white mb-2'>No forms found</h3>
                        <p className='text-sm sm:text-base text-gray-400 mb-6'>
                            {searchTerm ? 'Try adjusting your search terms' : 'Create your first form to get started'}
                        </p>
                        {!searchTerm && (
                            <Link
                                to='/forms/new'
                                className='inline-flex items-center px-4 py-2.5 sm:py-2 bg-whisper-accent-yellow hover:bg-opacity-90 text-black rounded-lg font-medium transition-colors text-sm sm:text-base'
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