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
        Schema::create('varieties', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->string('species');
            $table->string('kind')->index();
            $table->text('story');
            $table->jsonb('sowing_months');
            $table->string('photo_path')->nullable();
            // A fingerprint of the photograph's bytes. The frontend puts it in the photo's URL,
            // so a new picture is a new URL and every cache holding the old one is simply bypassed.
            $table->string('photo_version', 16)->nullable();
            // Who took the photograph and under which licence: {author, licence, source_url, modified}.
            $table->jsonb('photo_credit')->nullable();
            $table->timestamp('retired_at')->nullable()->index();
            $table->timestamps();
        });

        // A path without a version would be a photo no URL can cache, and a credit without a
        // photo credits nothing. The database refuses both, whatever code writes the row.
        DB::statement('alter table varieties add constraint varieties_photo_version_check check ((photo_path is null) = (photo_version is null))');
        DB::statement('alter table varieties add constraint varieties_photo_credit_check check (photo_credit is null or photo_path is not null)');
    }

    public function down(): void
    {
        Schema::dropIfExists('varieties');
    }
};
