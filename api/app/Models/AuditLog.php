<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'action',
        'category',
        'target',
        'field',
        'old_value',
        'new_value',
        'remarks',
        'user_name',
        'user_role',
        'status',
    ];
}