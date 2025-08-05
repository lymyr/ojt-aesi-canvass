<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('log_data', function (Blueprint $table) {
            $table->id();
            $table->string('ref_table'); // e.g. 'canvass_sheets', 'vendors', etc.
            $table->unsignedBigInteger('ref_id'); // ID of the record that was changed
            $table->string('created_by'); // denormalized for simplicity
            $table->json('before')->nullable(); // before change (nullable for new entries)
            $table->json('after')->nullable();  // after change (nullable for deletes)
            $table->timestamps(); // created_at = timestamp
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_data');
    }
};
