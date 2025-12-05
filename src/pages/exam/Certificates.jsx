import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Download,
  Calendar,
  FileText
} from 'lucide-react';

const Certificates = () => {
  // Placeholder - certificates would be fetched from API
  const certificates = [];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Certificates</h1>
        <p className="text-gray-400">
          Download your earned certificates
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No certificates yet</h3>
          <p className="text-gray-400 mb-6">
            Complete exams with passing scores to earn certificates
          </p>
          <Link
            to="/exam/my-exams"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            Go to My Exams
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{cert.title}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(cert.issued_at).toLocaleDateString()}
              </div>
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
