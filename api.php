class Api
{
const apiUrl         = "http://103.249.98.101:82/";
const targetEndPoint = self::apiUrl. "paytmVerifyPayment/";

const key       = "someKey819f053bb08b795343e0b2ebc75fb66f";
const secret    ="someSecretef8725578667351c9048162810c65d17";

private $autho="";



public function PostMyData($data){      
  $createOrder = $this->callApi("POST", self::targetEndPoint, $data, true);
  return $createOrder;
 }

private function callApi($method, $url, $data=null, $authoRequire = false){
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)               
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
                break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    if($authoRequire){
        $this->autho = self::key.":".self::secret;
        // Optional Authentication:
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, $this->autho);
    }

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);


    return $result;

 }
}