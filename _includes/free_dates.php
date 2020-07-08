{% raw %}

<?php require_once('../daten/edit.lib.php'); ?>

<table id="free-dates">
  <colgroup>
    <col class="date-col" />
    <col class="dash-col" />
    <col class="date-col" />
    <col class="text-col" />
  </colgroup>
  <tbody>
    <?php foreach (read_db() as $v) { ?>
    <tr class="<?= $v['occ'] ? "rowOcc" : "rowFree"; ?>">
      <td><?= htmlentities($v['from']); ?></td>
      <td>&ndash;</td>
      <td><?= htmlentities($v['to']); ?></td>
      <td><?= htmlentities($v['text']); ?></td>
    </tr>
    <?php } ?>
  </tbody>
</table>

{% endraw %}
