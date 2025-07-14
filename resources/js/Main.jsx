import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function Main() { 
    const [errors, setErrors] = useState({});
    const [summary, setSummary] = useState(null);

    const onDrop = useCallback(async (files) => {
        const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const res = await axios.post('/api/import-users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSummary(res.data);
            setErrors(res.data.failed_rows);
        } catch (e) {
            alert('Upload failed');
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xlsx,.xls' });

    return (
        <div>
            <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: 20 }}>
                <input {...getInputProps()} />
                <p>Drop Excel file here or click to select</p>
            </div>

            {summary && (
                <div>
                    <h3>Import Summary</h3>
                    <p>Total Rows: {summary.summary.total_rows}</p>
                    <p>Failed Rows: {Object.keys(summary.failed_rows ? summary.failed_rows : {}).length}</p>
                   
                </div>
            )}

            {Array.isArray(errors) && errors.length > 0 && (
                <table border="1" cellPadding="5">
                    <thead>
                        <tr>
                            <th>Row</th>
                            <th>Errors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {errors.map((err, idx) => (
                            <tr key={idx}>
                                <td>{err.row}</td>
                                <td>{err.errors.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Main;
