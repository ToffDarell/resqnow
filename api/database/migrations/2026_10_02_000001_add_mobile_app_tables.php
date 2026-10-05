<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tables and columns needed by the ResQNow mobile app (resident + responder).
 *
 * Everything is guarded so it is safe to run on a database that already holds
 * the web-admin schema (the shared TiDB database).
 */
return new class extends Migration
{
    public function up(): void
    {
        // ---- Resident / responder profiles ----
        if (! Schema::hasTable('resident_profiles')) {
            Schema::create('resident_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
                $table->string('contact_number', 20);
                $table->string('purok', 100);
                $table->text('address');
                $table->unsignedInteger('household_count')->default(1);
                $table->boolean('has_senior_citizen')->default(false);
                $table->boolean('has_child')->default(false);
                $table->boolean('has_pwd')->default(false);
                $table->boolean('has_pregnant_person')->default(false);
                $table->decimal('home_latitude', 10, 7)->nullable();
                $table->decimal('home_longitude', 10, 7)->nullable();
                $table->timestamps();
                $table->index('purok');
            });
        }

        if (! Schema::hasTable('responder_profiles')) {
            Schema::create('responder_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
                $table->boolean('is_on_duty')->default(false)->index();
                $table->string('responder_role', 80)->nullable();
                $table->string('current_asset', 120)->nullable();
                $table->string('team_name', 120)->nullable();
                $table->timestamp('last_duty_changed_at')->nullable();
                $table->timestamps();
            });
        }

        // ---- Reports: extra columns used by the mobile app ----
        $columns = [
            'report_code' => fn (Blueprint $t) => $t->string('report_code', 30)->nullable()->unique(),
            'concern_code' => fn (Blueprint $t) => $t->string('concern_code', 80)->nullable(),
            'concern_type' => fn (Blueprint $t) => $t->string('concern_type', 150)->nullable(),
            'subcategory' => fn (Blueprint $t) => $t->string('subcategory', 150)->nullable(),
            'reporting_for' => fn (Blueprint $t) => $t->string('reporting_for', 30)->default('Myself'),
            'subject_name' => fn (Blueprint $t) => $t->string('subject_name', 150)->nullable(),
            'subject_contact' => fn (Blueprint $t) => $t->string('subject_contact', 30)->nullable(),
            'relationship_note' => fn (Blueprint $t) => $t->string('relationship_note', 150)->nullable(),
            'purok' => fn (Blueprint $t) => $t->string('purok', 100)->nullable(),
            'landmark' => fn (Blueprint $t) => $t->string('landmark', 255)->nullable(),
            'required_assistance' => fn (Blueprint $t) => $t->text('required_assistance')->nullable(),
            'affected_individuals' => fn (Blueprint $t) => $t->json('affected_individuals')->nullable(),
            'photo_path' => fn (Blueprint $t) => $t->string('photo_path')->nullable(),
            'photo_disk' => fn (Blueprint $t) => $t->string('photo_disk', 16)->default('public'),
            'barangay_remarks' => fn (Blueprint $t) => $t->text('barangay_remarks')->nullable(),
            'invalid_reason' => fn (Blueprint $t) => $t->text('invalid_reason')->nullable(),
            'resolved_remarks' => fn (Blueprint $t) => $t->text('resolved_remarks')->nullable(),
            'client_request_id' => fn (Blueprint $t) => $t->uuid('client_request_id')->nullable(),
            'request_fingerprint' => fn (Blueprint $t) => $t->char('request_fingerprint', 64)->nullable(),
            'version' => fn (Blueprint $t) => $t->unsignedInteger('version')->default(1),
            'location_source' => fn (Blueprint $t) => $t->string('location_source', 16)->nullable(),
            'location_accuracy' => fn (Blueprint $t) => $t->decimal('location_accuracy', 10, 2)->nullable(),
            'location_captured_at' => fn (Blueprint $t) => $t->timestamp('location_captured_at')->nullable(),
        ];

        foreach ($columns as $name => $define) {
            if (! Schema::hasColumn('reports', $name)) {
                Schema::table('reports', function (Blueprint $table) use ($define) {
                    $define($table);
                });
            }
        }

        // The web-admin "category" label is derived from the mobile concern type.
        Schema::table('reports', function (Blueprint $table) {
            $table->string('category')->nullable()->change();
        });

        if (! $this->hasIndex('reports', 'reports_resident_request_unique')) {
            Schema::table('reports', function (Blueprint $table) {
                $table->unique(['user_id', 'client_request_id'], 'reports_resident_request_unique');
            });
        }

        // ---- Report history / assignments ----
        if (! Schema::hasTable('report_status_logs')) {
            Schema::create('report_status_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('report_id')->constrained('reports')->cascadeOnDelete();
                $table->string('status', 80)->index();
                $table->text('remarks')->nullable();
                $table->foreignId('changed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('activity', 120)->nullable();
                $table->json('checklist')->nullable();
                $table->string('photo_path')->nullable();
                $table->uuid('client_request_id')->nullable()->unique();
                $table->char('request_fingerprint', 64)->nullable();
                $table->timestamps();
                $table->index(['report_id', 'created_at']);
            });
        }

        if (! Schema::hasTable('report_assignments')) {
            Schema::create('report_assignments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('report_id')->constrained('reports')->cascadeOnDelete();
                $table->foreignId('assigned_user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('assigned_by_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->text('notes')->nullable();
                $table->timestamp('assigned_at')->useCurrent();
                $table->timestamp('unassigned_at')->nullable();
                $table->timestamp('acknowledged_at')->nullable();
                $table->timestamps();
                $table->index(['report_id', 'assigned_at'], 'report_assignment_time_idx');
                $table->index(['report_id', 'assigned_user_id', 'unassigned_at'], 'report_assignment_user_idx');
            });
        }

        if (! Schema::hasTable('resqnow_attention_requests')) {
            Schema::create('resqnow_attention_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('report_id')->constrained()->cascadeOnDelete();
                $table->foreignId('event_id')->unique()->constrained('report_status_logs')->cascadeOnDelete();
                $table->string('kind', 32);
                $table->foreignId('requested_by')->constrained('users');
                $table->foreignId('acknowledged_by')->nullable()->constrained('users');
                $table->timestamp('acknowledged_at')->nullable();
                $table->text('response')->nullable();
                $table->timestamps();
            });
        }

        // ---- Resident in-app notifications / preferences ----
        if (! Schema::hasTable('resqnow_notifications')) {
            Schema::create('resqnow_notifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('kind', 32);
                $table->string('title');
                $table->text('message');
                $table->string('report_code', 30)->nullable();
                $table->unsignedBigInteger('announcement_id')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'read_at']);
            });
        }

        if (! Schema::hasTable('resqnow_preferences')) {
            Schema::create('resqnow_preferences', function (Blueprint $table) {
                $table->foreignId('user_id')->primary()->constrained()->cascadeOnDelete();
                $table->boolean('announcement_notifications')->default(true);
                $table->timestamps();
            });
        }

        // ---- Evacuation centers ----
        if (! Schema::hasTable('resqnow_evacuation_centers')) {
            Schema::create('resqnow_evacuation_centers', function (Blueprint $table) {
                $table->id();
                $table->string('name', 160);
                $table->string('address', 255);
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->string('status', 16)->default('standby');
                $table->unsignedInteger('capacity')->nullable();
                $table->unsignedInteger('current_occupancy')->nullable();
                $table->string('contact_number', 32)->nullable();
                $table->text('notes')->nullable();
                $table->boolean('is_active')->default(true);
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();
                $table->index(['is_active', 'status']);
                $table->index(['latitude', 'longitude']);
            });
        }

        // ---- Contact directory ----
        if (! Schema::hasTable('resqnow_directory_contacts')) {
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
        }

        if (! Schema::hasTable('resqnow_directory_phones')) {
            Schema::create('resqnow_directory_phones', function (Blueprint $table) {
                $table->id();
                $table->string('contact_id', 100);
                $table->string('phone_key', 40);
                $table->string('label', 64);
                $table->string('number', 32);
                $table->string('display_number', 64);
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();
                $table->foreign('contact_id')->references('id')->on('resqnow_directory_contacts')->cascadeOnDelete();
                $table->unique(['contact_id', 'phone_key'], 'resqnow_directory_contact_phone_key');
            });
        }

        if (! Schema::hasTable('resqnow_directory_information')) {
            Schema::create('resqnow_directory_information', function (Blueprint $table) {
                $table->string('key', 64)->primary();
                $table->json('value');
                $table->timestamps();
            });
        }

        // ---- Bridge: web-admin personnel <-> responder app account ----
        if (! Schema::hasColumn('personnels', 'user_id')) {
            Schema::table('personnels', function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        // Intentionally a no-op: these tables may hold production data.
    }

    private function hasIndex(string $table, string $index): bool
    {
        foreach (Schema::getIndexes($table) as $existing) {
            if ($existing['name'] === $index) {
                return true;
            }
        }

        return false;
    }
};
