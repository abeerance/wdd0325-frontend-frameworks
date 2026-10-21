<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('variety_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('in_stock');
            $table->timestamps();

            $table->index(['variety_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packets');
    }
};
