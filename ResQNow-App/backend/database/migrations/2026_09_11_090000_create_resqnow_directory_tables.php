<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fail before making changes if this module's tables already exist.
        // Existing users, reports, assignments, and other contact tables are untouched.
        foreach (['resqnow_directory_contacts', 'resqnow_directory_phones', 'resqnow_directory_information'] as $name) {
            if (Schema::hasTable($name)) {
                throw new RuntimeException("Table {$name} already exists. Review the existing directory module before installing this migration.");
            }
        }

        Schema::create('resqnow_directory_contacts', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('group', 32)->index();
            $table->string('category', 32);
            $table->string('name');
            $table->string('role')->nullable();
            $table->text('address')->nullable();
            $table->text('facebook_url')->nullable();
            $table->text('messenger_url')->nullable();
            $table->text('website_url')->nullable();
            $table->string('email')->nullable();
            $table->text('notes')->nullable();
            $table->text('source_url')->nullable();
            $table->string('source_label')->nullable();
            $table->date('source_checked_on')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('resqnow_directory_phones', function (Blueprint $table) {
            $table->id();
            $table->string('contact_id', 100);
            $table->string('phone_key', 40);
            $table->string('label', 64);
            $table->string('number', 32); // String: preserve zero prefixes and short codes.
            $table->string('display_number', 64);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->foreign('contact_id')->references('id')->on('resqnow_directory_contacts')->cascadeOnDelete();
            $table->unique(['contact_id', 'phone_key'], 'resqnow_directory_contact_phone_key');
            // No unique constraint on number: multiple offices may share a line.
        });

        Schema::create('resqnow_directory_information', function (Blueprint $table) {
            $table->string('key', 64)->primary();
            $table->json('value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resqnow_directory_phones');
        Schema::dropIfExists('resqnow_directory_contacts');
        Schema::dropIfExists('resqnow_directory_information');
    }
};
