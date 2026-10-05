<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;

class RequestFingerprint
{
    /**
     * Create a deterministic fingerprint for
     * one responder field-update request.
     *
     * clientRequestId itself is excluded because
     * the ID identifies the retry while this hash
     * identifies the request content.
     */
    public static function make(
        array $data
    ): string {
        unset(
            $data['clientRequestId']
        );

        return hash(
            'sha256',
            json_encode(
                self::normalize($data),
                JSON_THROW_ON_ERROR
            )
        );
    }

    /**
     * Normalize request values before hashing.
     */
    private static function normalize(
        mixed $value
    ): mixed {
        if (
            $value instanceof UploadedFile
        ) {
            return [
                'sha256' =>
                    hash_file(
                        'sha256',
                        $value->getRealPath()
                    ),

                'size' =>
                    $value->getSize(),
            ];
        }

        if (!is_array($value)) {
            return $value;
        }

        if (!array_is_list($value)) {
            ksort($value);
        }

        return array_map(
            self::normalize(...),
            $value
        );
    }
}
