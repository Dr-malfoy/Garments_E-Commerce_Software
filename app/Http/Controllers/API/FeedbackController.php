<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        return Feedback::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json(['message' => 'Feedback submitted successfully', 'feedback' => $feedback]);
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();
        return response()->json(['message' => 'Feedback removed']);
    }
}
