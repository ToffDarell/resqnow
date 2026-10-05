<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class ContactDirectorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['resqnow_directory_contacts', 'resqnow_directory_phones', 'resqnow_directory_information'] as $table) {
            if (! Schema::hasTable($table)) {
                throw new RuntimeException('Run the ResQNow directory migration before this seeder.');
            }
        }

        $file = database_path('data/contact-directory.json');
        if (! is_file($file)) {
            throw new RuntimeException('Missing database/data/contact-directory.json.');
        }
        $data = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
        $required = ['contacts', 'meta', 'evacuationInformation', 'barangayServices', 'communicationProcedure'];
        foreach ($required as $key) {
            if (! isset($data[$key]) || ! is_array($data[$key])) {
                throw new RuntimeException("Invalid directory data: missing {$key}.");
            }
        }

        $created = 0;
        $skipped = 0;
        DB::transaction(function () use ($data, &$created, &$skipped) {
            $timestamp = now();
            foreach ($data['contacts'] as $contact) {
                // Existing records and their phone lists are preserved on re-run.
                // A seeder is initial data, not an automatic overwrite of admin edits.
                if (DB::table('resqnow_directory_contacts')->where('id', $contact['id'])->exists()) {
                    $skipped++;
                    continue;
                }

                DB::table('resqnow_directory_contacts')->insert([
                    'id' => $contact['id'],
                    'group' => $contact['group'],
                    'category' => $contact['category'],
                    'name' => $contact['name'],
                    'role' => $contact['role'] ?? null,
                    'address' => $contact['address'] ?? null,
                    'facebook_url' => $contact['facebookUrl'] ?? null,
                    'messenger_url' => $contact['messengerUrl'] ?? null,
                    'website_url' => $contact['websiteUrl'] ?? null,
                    'email' => $contact['email'] ?? null,
                    'notes' => $contact['notes'] ?? null,
                    'source_url' => $contact['sourceUrl'] ?? null,
                    'source_label' => $contact['sourceLabel'] ?? null,
                    'source_checked_on' => $contact['sourceCheckedOn'] ?? null,
                    'sort_order' => $contact['sortOrder'],
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);

                foreach ($contact['phoneNumbers'] as $position => $phone) {
                    DB::table('resqnow_directory_phones')->insert([
                        'contact_id' => $contact['id'],
                        'phone_key' => $phone['id'],
                        'label' => $phone['label'],
                        'number' => $phone['number'],
                        'display_number' => $phone['displayNumber'] ?? $phone['number'],
                        'sort_order' => $position,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ]);
                }
                $created++;
            }

            foreach (['meta', 'evacuationInformation', 'barangayServices', 'communicationProcedure'] as $key) {
                if (DB::table('resqnow_directory_information')->where('key', $key)->exists()) {
                    continue;
                }
                DB::table('resqnow_directory_information')->insert([
                    'key' => $key,
                    'value' => json_encode($data[$key], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);
            }
        });

        $this->command?->info("Contact directory: {$created} created; {$skipped} existing contacts preserved.");
    }
}
