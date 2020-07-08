<?php

function get_db() {

    static $mysqli = null;

    if ($mysqli === null) {
        $mysqli = new mysqli(/* redacted */);

        if ($mysqli->connect_errno)
            die("Failed to connect to MySQL: " . $mysqli->connect_error);
    }

    return $mysqli;
}

function has_post() {
    return isset($_POST,$_POST['dateFrom'],$_POST['dateTo'],$_POST['text']);
}

function read_post() {

    $data = array();

    // Read the data
    $cnt = count($_POST['dateFrom']);

    for ($i = 0 ; $i < $cnt; $i++) {

        if (($_POST['dateFrom'][$i] == '' || $_POST['dateFrom'][$i] == '?') &&
            ($_POST['dateTo'][$i]   == ''   || $_POST['dateTo'][$i] == '?')
            ) continue;

        $data[] = array('from' => $_POST['dateFrom'][$i],
                        'to'   => $_POST['dateTo'][$i],
                        'text' => $_POST['text'][$i],
                        'occ'  => isset($_POST['occ'][$i])
                        );
    }

    return $data;

}

function read_db() {

    $mysqli = get_db();

    $q ="SELECT ".
        "  period_from AS `from`, ".
        "  period_to   AS `to`, ".
        "  period_text AS `text`, ".
        "  period_occ  AS `occ` ".
        "FROM period ".
        "  INNER JOIN ( ".
        "    SELECT MAX(changeset_id) AS v ".
        "    FROM changeset ".
        "    GROUP BY NULL ".
        "  ) AS cid ".
        "  ON (period.changeset_id = cid.v) ".
        "ORDER BY period_order ASC";

    $res = $mysqli->query($q);

    $data = array();

    while ($row = $res->fetch_assoc())
        $data[] = $row;

    return $data;

}

function store_db($data) {

    $mysqli = get_db();

    $chid = create_changeset();

    $q ="INSERT INTO period (".
        "  changeset_id,".
        "  period_order,".
        "  period_from,".
        "  period_to,".
        "  period_text,".
        "  period_occ".
        ") VALUES (?,?,?,?,?,?)";

    $stmt = $mysqli->prepare($q);

    foreach ($data as $k => $v) {
        $stmt->bind_param("iisssi", $chid, $k, $v['from'], $v['to'], $v['text'], $v['occ']);
        $stmt->execute();
    }

    $stmt->close();

}

function create_changeset() {

    $mysqli = get_db();

    $q ="INSERT INTO changeset (".
        "  changeset_created, ".
        "  changeset_username, ".
        "  changeset_remotehost ".
        ") VALUES (NOW(), ?, ?)";

    $stmt = $mysqli->prepare($q);

    $stmt->bind_param("ss", $_SERVER['PHP_AUTH_USER'], $_SERVER['REMOTE_ADDR']);
    $stmt->execute();

    $id = $mysqli->insert_id;

    $stmt->close();

    return $id;

}

?>