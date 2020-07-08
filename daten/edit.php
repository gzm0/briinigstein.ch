<?php

header("Content-Type: text/html; charset=UTF-8");

require_once('edit.lib.php');

$msg = "";
$data = array();

if (has_post()) {
   $data = read_post();
   store_db($data);
   $msg = "Gespeichert";
} else {
   $data = read_db();
}

function print_msgline() {
   global $msg;
?>
<div class="msgline">
  <input type="submit" value="Speichern" />
  <span class="saved_msg"><?php echo $msg; ?></span>
</div>
<?php
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Daten Bearbeiten</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="edit.style.css" />
    <script type="text/javascript" src="jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="date.edit.js"></script>
    <script type="text/javascript">
      $(function() {
        var date_data = <?php echo json_encode($data); ?>;
        populateDateData(date_data);
        setTimeout(function() {
          $(".msgline .saved_msg").fadeOut(100);
        }, 1000);
      });
    </script>
  </head>

  <body>
    <h1>Daten Bearbeiten</h1>
    <form id="date_edit" method="POST" action="">
      <?php print_msgline(); ?>
      <table>
        <thead>
          <tr>
            <th>Von</th>
            <th>Bis</th>
            <th>Text</th>
            <th>Besetzt?</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <?php print_msgline(); ?>
    </form>
  </body>

</html>
