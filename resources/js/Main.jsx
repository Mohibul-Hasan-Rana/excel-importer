import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Main = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
      setErrors([]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setErrors([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/import-users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      
      if (data.success) {
        setResult(data.summary);
        setErrors(data.errors || []);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="max-w-9xl mx-auto p-8 bg-white rounded-lg shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Excel Import with Validation
      </h1>

      {/* File Upload Section with Dropzone */}
      <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div {...getRootProps()} className={`mb-4 p-6 border-2 border-dashed rounded-lg ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`} style={{ cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop the file here...' : 'Drag & drop Excel file here, or click to select'}
            </label>
          </div>
          {file && (
            <p className="text-sm text-gray-600 mb-4">
              Selected: {file.name}
            </p>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Processing...' : 'Upload & Process'}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {result && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Total Rows</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{result.total_rows}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Valid Rows</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{result.valid_rows}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">Error Rows</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{result.error_rows}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-800">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-600">{result.success_rate}%</p>
          </div>
        </div>
      )}

      
      {/* Error Details Table */}
      {errors.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Validation Errors ({errors.length} rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Row
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Errors
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {errors.map((error, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {error.row}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <div className="space-y-1">
                        {Object.entries(error.data).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value || 'N/A'}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-red-600">
                      <div className="space-y-1">
                        {Object.entries(error.errors).map(([field, messages]) => (
                          <div key={field}>
                            <span className="font-medium">{Object.keys(error.errors).indexOf(field) + 1}:</span>{' '}
                            {Array.isArray(messages) ? messages.join(', ') : messages}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions (only show if no result) */}
      {!result && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Excel Format Requirements:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>name:</strong> Required, max 255 characters</li>
            <li>• <strong>email:</strong> Required</li>
            <li>• <strong>phone:</strong> Required</li>
            <li>• <strong>gender:</strong> Required</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Main;