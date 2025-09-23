import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Edit, 
  BarChart3,
  Share2,
  Eye,
  Users
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const FormCard = ({ form, onDelete, onShare }) => {

  return (
    <div className="bg-whisper-card border border-whisper-border rounded-xl overflow-hidden hover:bg-opacity-80 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        {/* Clickable main area - goes to results */}
        <Link 
          to={`/forms/${form._id}/results`}
          className="flex-1 p-6 hover:bg-slate-800/20 transition-colors"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {form.title}
              </h3>
              <p className="text-sm text-gray-400">
                {form.questions?.length || 0} questions
              </p>
            </div>
          </div>
          
          {form.description && (
            <p className="text-gray-400 mb-4 line-clamp-2">{form.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(form.created_at)}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {form.response_count || 0} responses
            </div>
          </div>
        </Link>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 p-3">
          <Link
            to={`/forms/${form._id}/view`}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Preview form"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(form);
            }}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Share form"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <Link
            to={`/forms/${form._id}/edit`}
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Edit form"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="w-4 h-4" />
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(form._id);
            }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete form"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;