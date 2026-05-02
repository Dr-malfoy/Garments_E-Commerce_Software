<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CourierSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LogisticSettingController extends Controller
{
    public function index()
    {
        return CourierSetting::all();
    }

    public function show($name)
    {
        return CourierSetting::where('name', $name)->first() ?? response()->json(['message' => 'Not found'], 404);
    }

    public function update(Request $request, $name)
    {
        $setting = CourierSetting::updateOrCreate(
            ['name' => $name],
            $request->all()
        );

        if ($name === 'pathao') {
            $this->updateEnv([
                'PATHAO_CLIENT_ID' => $setting->client_id,
                'PATHAO_CLIENT_SECRET' => $setting->client_secret,
                'PATHAO_SECRET_TOKEN' => $setting->secret_key,
            ]);
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $setting
        ]);
    }

    public function generateSecret()
    {
        return response()->json([
            'secret_key' => Str::random(40)
        ]);
    }

    protected function updateEnv(array $data)
    {
        $envFile = base_path('.env');
        $content = file_get_contents($envFile);

        foreach ($data as $key => $value) {
            $pattern = "/^{$key}=.*/m";
            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, "{$key}=\"{$value}\"", $content);
            } else {
                $content .= "\n{$key}=\"{$value}\"";
            }
        }

        file_put_contents($envFile, $content);
    }
}
