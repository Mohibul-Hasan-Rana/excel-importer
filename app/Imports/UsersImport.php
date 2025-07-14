<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToCollection, WithHeadingRow
{
    private $validRows = [];
    private $errors = [];
    private $totalRows = 0;
    private $validCount = 0;
    private $errorCount = 0;
    
    public function collection(Collection $rows)
    {
        $this->totalRows = $rows->count();
        
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +2 because index starts at 0 and we have header row
            
            // Validate each row
            $validator = Validator::make($row->toArray(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|max:10',
                'gender' => 'required|string'
            ]);
            
            if ($validator->fails()) {
                $this->errorCount++;
                $this->errors[] = [
                    'row' => $rowNumber,
                    'data' => $row->toArray(),
                    'errors' => $validator->errors()->toArray()
                ];
            } else {
                $this->validCount++;
                $this->validRows[] = [
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'phone' => $row['phone'],
                    'gender' => $row['gender'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }
    }
    
    public function getValidRows()
    {
        return $this->validRows;
    }
    
    public function getErrors()
    {
        // Convert error objects to readable strings
        return array_map(function ($error) {
            $flatErrors = [];
            foreach ($error['errors'] as $field => $messages) {
                foreach ($messages as $msg) {
                    $flatErrors[] = $field . ': ' . $msg;
                }
            }
            return [
                'row' => $error['row'],
                'data' => $error['data'],
                'errors' => $flatErrors
            ];
        }, $this->errors);
    }
    
    public function getSummary()
    {
        return [
            'total_rows' => $this->totalRows,
            'valid_rows' => $this->validCount,
            'error_rows' => $this->errorCount,
            'success_rate' => $this->totalRows > 0 ? round(($this->validCount / $this->totalRows) * 100, 2) : 0
        ];
    }
}
