<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('harvest_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('borrowing_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('body');
            // PostgreSQL has no unsigned integers. The form requests keep both counts at zero or above.
            $table->smallInteger('seeds_sown');
            $table->smallInteger('seeds_germinated');
            $table->string('photo_path')->nullable();
            $table->string('photo_version', 16)->nullable();
            $table->timestamps();
        });

        DB::statement('alter table harvest_notes add constraint harvest_notes_photo_version_check check ((photo_path is null) = (photo_version is null))');
    }

    public function down(): void
    {
        Schema::dropIfExists('harvest_notes');
    }
};
