<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserImportController;

Route::post('/import-users', [UserImportController::class, 'import']);
