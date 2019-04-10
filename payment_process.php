<?php
header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");
$paramList = $_POST;
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
    $.ajax({
        type: "POST",
        data: <?php echo json_encode($paramList);?>,
        url: "http://103.249.98.101:3000/users/paytmVerifyPayment",
        success: function(data){
            console.log(data);
           // do what you need to 

            }
        });
</script>
