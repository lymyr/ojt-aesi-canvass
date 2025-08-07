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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            // shouldnt be limited to canvass sheet
            $table->foreignId('ref_id')->constrained('canvass_sheets')->onDelete('cascade');
            $table->string('ref_table');
            $table->string('file_name');
            $table->string('path');
            $table->string('added_by');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
