<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use App\Exports\ErrorsExport;
use App\Models\Import;

class UserImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240'
        ]);

        $file = $request->file('file');
        
        try {
            $import = new UsersImport();
            Excel::import($import, $file);
            
            $validRows = $import->getValidRows();
            $errors = $import->getErrors();
            $summary = $import->getSummary();
            
            // Save valid rows to database
            if (!empty($validRows)) {
                foreach ($validRows as $row) {
                    Import::create($row);
                }
            }
            
           
            return response()->json([
                'success' => true,
                'summary' => $summary,
                'errors' => $errors,
                'failed_rows' => $import->getErrors(),                
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}