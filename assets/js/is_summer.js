function is_summer() {
  var now = new Date();

  function atDate(month, day) {
    var copy = new Date(now.getTime());
    copy.setMonth(month - 1, day)
    return copy
  }
  
  return atDate(3, 15) <= now && now < atDate(10, 15);
}
