<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->uuid('client_request_id')->nullable();

            $table
                ->char(
                    'request_fingerprint',
                    64
                )
                ->nullable();

            $table->unique(
                [
                    'user_id',
                    'client_request_id',
                ],
                'reports_resident_request_unique'
            );

            $table
                ->unsignedInteger('version')
                ->default(1);

            /*
             * Existing files remain readable through
             * the protected endpoint until migrated.
             */
            $table
                ->string(
                    'photo_disk',
                    16
                )
                ->default('public');

            $table
                ->string(
                    'location_source',
                    16
                )
                ->nullable();

            $table
                ->decimal(
                    'location_accuracy',
                    10,
                    2
                )
                ->nullable();

            $table
                ->timestamp(
                    'location_captured_at'
                )
                ->nullable();
        });


        Schema::table(
            'report_assignments',
            function (Blueprint $table) {
                $table
                    ->timestamp(
                        'acknowledged_at'
                    )
                    ->nullable();
            }
        );


        Schema::table(
            'report_status_logs',
            function (Blueprint $table) {
                $table
                    ->char(
                        'request_fingerprint',
                        64
                    )
                    ->nullable();
            }
        );


        Schema::create(
            'resqnow_attention_requests',
            function (Blueprint $table) {
                $table->id();

                $table
                    ->foreignId('report_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table
                    ->foreignId('event_id')
                    ->unique()
                    ->constrained(
                        'report_status_logs'
                    )
                    ->cascadeOnDelete();

                $table
                    ->string(
                        'kind',
                        32
                    );

                $table
                    ->foreignId('requested_by')
                    ->constrained('users');

                $table
                    ->foreignId('acknowledged_by')
                    ->nullable()
                    ->constrained('users');

                $table
                    ->timestamp(
                        'acknowledged_at'
                    )
                    ->nullable();

                $table
                    ->text('response')
                    ->nullable();

                $table->timestamps();
            }
        );


        Schema::create(
            'resqnow_notifications',
            function (Blueprint $table) {
                $table->id();

                $table
                    ->foreignId('user_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table
                    ->string(
                        'kind',
                        32
                    );

                $table->string('title');

                $table->text('message');

                $table
                    ->string(
                        'report_code',
                        30
                    )
                    ->nullable();

                $table
                    ->unsignedBigInteger(
                        'announcement_id'
                    )
                    ->nullable();

                $table
                    ->timestamp('read_at')
                    ->nullable();

                $table->timestamps();

                $table->index([
                    'user_id',
                    'read_at',
                ]);
            }
        );


        Schema::create(
            'resqnow_preferences',
            function (Blueprint $table) {
                $table
                    ->foreignId('user_id')
                    ->primary()
                    ->constrained()
                    ->cascadeOnDelete();

                $table
                    ->boolean(
                        'announcement_notifications'
                    )
                    ->default(true);

                $table->timestamps();
            }
        );


        Schema::create(
            'resqnow_announcements',
            function (Blueprint $table) {
                $table->id();

                $table
                    ->string(
                        'title',
                        160
                    );

                $table->text('body');

                $table
                    ->foreignId('published_by')
                    ->constrained('users');

                $table->timestamp(
                    'published_at'
                );

                $table->timestamps();
            }
        );


        Schema::create(
            'resqnow_account_reviews',
            function (Blueprint $table) {
                $table->id();

                $table
                    ->foreignId('user_id')
                    ->constrained();

                $table
                    ->foreignId('reviewed_by')
                    ->constrained('users');

                $table
                    ->string(
                        'decision',
                        24
                    );

                $table
                    ->text('reason')
                    ->nullable();

                $table->timestamps();
            }
        );
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'resqnow_account_reviews'
        );

        Schema::dropIfExists(
            'resqnow_announcements'
        );

        Schema::dropIfExists(
            'resqnow_preferences'
        );

        Schema::dropIfExists(
            'resqnow_notifications'
        );

        Schema::dropIfExists(
            'resqnow_attention_requests'
        );


        Schema::table(
            'report_status_logs',
            fn (Blueprint $table) =>
                $table->dropColumn(
                    'request_fingerprint'
                )
        );


        Schema::table(
            'report_assignments',
            fn (Blueprint $table) =>
                $table->dropColumn(
                    'acknowledged_at'
                )
        );


        Schema::table(
            'reports',
            function (Blueprint $table) {
                $table->dropUnique(
                    'reports_resident_request_unique'
                );

                $table->dropColumn([
                    'client_request_id',
                    'request_fingerprint',
                    'version',
                    'photo_disk',
                    'location_source',
                    'location_accuracy',
                    'location_captured_at',
                ]);
            }
        );
    }
};
