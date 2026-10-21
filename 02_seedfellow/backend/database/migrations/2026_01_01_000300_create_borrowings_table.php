<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrowings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('packet_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->date('borrowed_on');
            $table->date('due_on');
            $table->date('returned_on')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'returned_on']);
            $table->index(['packet_id', 'returned_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};
