<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ContactDirectoryController extends Controller
{
    public function __invoke(): JsonResponse
    {
        foreach (['resqnow_directory_contacts', 'resqnow_directory_phones', 'resqnow_directory_information'] as $table) {
            if (! Schema::hasTable($table)) {
                return response()->json(['message' => 'The contact directory is not installed yet.'], 503);
            }
        }

        $information = [];
        foreach (DB::table('resqnow_directory_information')->get() as $row) {
            $information[$row->key] = json_decode($row->value, true, 512, JSON_THROW_ON_ERROR);
        }
        foreach (['meta', 'evacuationInformation', 'barangayServices', 'communicationProcedure'] as $key) {
            if (! isset($information[$key])) {
                return response()->json(['message' => 'The contact directory has not been seeded yet.'], 503);
            }
        }

        $phones = DB::table('resqnow_directory_phones')->orderBy('sort_order')->orderBy('id')->get()->groupBy('contact_id');
        $contacts = DB::table('resqnow_directory_contacts')->orderBy('sort_order')->orderBy('id')->get()->map(function ($contact) use ($phones) {
            $numbers = $phones->get($contact->id, collect())->map(fn ($phone) => [
                'id' => $phone->phone_key,
                'label' => $phone->label,
                'number' => $phone->number,
                'displayNumber' => $phone->display_number,
            ])->values()->all();

            return [
                'id' => $contact->id,
                'group' => $contact->group,
                'category' => $contact->category,
                'name' => $contact->name,
                'role' => $contact->role,
                'address' => $contact->address,
                'phoneNumbers' => $numbers,
                'facebookUrl' => $contact->facebook_url,
                'messengerUrl' => $contact->messenger_url,
                'websiteUrl' => $contact->website_url,
                'email' => $contact->email,
                'notes' => $contact->notes,
                'sourceUrl' => $contact->source_url,
                'sourceLabel' => $contact->source_label,
                'sourceCheckedOn' => $contact->source_checked_on,
                'sortOrder' => $contact->sort_order,
            ];
        })->values()->all();

        return response()->json(['data' => [
            'contacts' => $contacts,
            'meta' => $information['meta'],
            'evacuationInformation' => $information['evacuationInformation'],
            'barangayServices' => $information['barangayServices'],
            'communicationProcedure' => $information['communicationProcedure'],
        ]])->header('Cache-Control', 'private, no-store');
    }
}
