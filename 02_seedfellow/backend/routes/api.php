<?php

declare(strict_types=1);

use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\HarvestNoteController;
use App\Http\Controllers\HarvestNotePhotoController;
use App\Http\Controllers\PacketController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\VarietyController;
use App\Http\Controllers\VarietyPhotoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Registering writes a row, so it draws on an allowance of its own, counted by address:
// until the request succeeds there is no member to count it by.
Route::post('register', [RegistrationController::class, 'store'])
    ->withoutMiddleware('throttle:api')
    ->middleware('throttle:register')
    ->name('register');

Route::post('login', [SessionController::class, 'store'])->name('login');
Route::post('logout', [SessionController::class, 'destroy'])->name('logout');

// The catalogue is public: anyone can read what the library holds.
Route::get('varieties', [VarietyController::class, 'index'])->name('varieties.index');
Route::get('varieties/{variety}', [VarietyController::class, 'show'])->name('varieties.show')->whereNumber('variety');

// Photographs are fetched a dozen to a page, often by an image optimiser rather than a
// browser, so they draw on their own allowance instead of the `api` one. They also skip
// the session: a year-long public answer must never carry somebody's cookie.
Route::withoutMiddleware([EnsureFrontendRequestsAreStateful::class, 'throttle:api'])
    ->middleware('throttle:photos')
    ->group(function (): void {
        Route::get('varieties/{variety}/photo', [VarietyPhotoController::class, 'show'])->name('varieties.photo.show')->whereNumber('variety');
        Route::get('harvest-notes/{harvestNote}/photo', [HarvestNotePhotoController::class, 'show'])->name('harvest-notes.photo.show')->whereNumber('harvestNote');
    });

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('user', fn (Request $request) => $request->user())->name('user');

    Route::get('borrowings', [BorrowingController::class, 'index'])->name('borrowings.index');
    Route::post('borrowings', [BorrowingController::class, 'store'])->name('borrowings.store');
    Route::patch('borrowings/{borrowing}', [BorrowingController::class, 'update'])->name('borrowings.update')->whereNumber('borrowing');

    Route::post('borrowings/{borrowing}/harvest-note', [HarvestNoteController::class, 'store'])->name('harvest-notes.store')->whereNumber('borrowing');
    Route::patch('harvest-notes/{harvestNote}', [HarvestNoteController::class, 'update'])->name('harvest-notes.update')->whereNumber('harvestNote');
    Route::delete('harvest-notes/{harvestNote}', [HarvestNoteController::class, 'destroy'])->name('harvest-notes.destroy')->whereNumber('harvestNote');
    Route::post('harvest-notes/{harvestNote}/photo', [HarvestNotePhotoController::class, 'store'])->name('harvest-notes.photo.store')->whereNumber('harvestNote');

    // Librarians only, enforced by policy.
    Route::post('varieties', [VarietyController::class, 'store'])->name('varieties.store');
    Route::patch('varieties/{variety}', [VarietyController::class, 'update'])->name('varieties.update')->whereNumber('variety');
    Route::post('varieties/{variety}/photo', [VarietyPhotoController::class, 'store'])->name('varieties.photo.store')->whereNumber('variety');
    Route::post('varieties/{variety}/packets', [PacketController::class, 'store'])->name('packets.store')->whereNumber('variety');
});
