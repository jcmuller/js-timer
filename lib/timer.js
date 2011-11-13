var timeEnds = Date.parse("11/17/2011 13:00:00")
var textWhenEnds = "Time is Up!\nTime to present your hacks.";
var initialize;
window.onload = function () {
  var HEIGHT = 600,
      WIDTH  = 600;

  var r = Raphael("holder", HEIGHT, WIDTH),
      sec,
      min,
      hor,
      day,
      init = true,
      param = {stroke: "#fff", "stroke-width": 30},
      hash = document.location.hash,
      marksAttr = {fill: hash || "#444", stroke: "none"},
      html = [
        document.getElementById("d"),
        document.getElementById("h"),
        document.getElementById("m"),
        document.getElementById("s")
        ];
  // Custom Attribute
  r.customAttributes.arc = function (value, total, R, mostSignificant) {
    var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = WIDTH / 2 + R * Math.cos(a),
        y = HEIGHT / 2 - R * Math.sin(a),
        color = mostSignificant ? "red" : "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)"),
        path;

    var rx = R,
        ry = R,
        x_axis_rotation = 0,
        large_arc_flag = 0,
        sweep_flag = 1;

    if (total == value) {
      large_arc_flag = 1
      x = 300;
      y = HEIGHT / 2 - R;
    } else {
      large_arc_flag = +(alpha > 180);
    }
    path = [
      ["M", WIDTH / 2, HEIGHT / 2 - R],
      ["A", rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y]
    ];
    return {path: path, stroke: color};
  };

  initialize = function() {
    r.clear();
    var R = 160;
    drawMarks(R, 60);
    sec = r.path().attr(param).attr({arc: [0, 60, R, false]});
    R -= 40;
    drawMarks(R, 60);
    min = r.path().attr(param).attr({arc: [0, 60, R, false]});
    R -= 40;
    drawMarks(R, 12);
    hor = r.path().attr(param).attr({arc: [0, 12, R, false]});
    R -= 40;
    drawMarks(R, 7);
    day = r.path().attr(param).attr({arc: [0, 7, R, false]});
    R -= 40;
    drawMarks(R, 12);

    $('#setTime').html("11/17/2011 13:00");
  }

  function updateVal(value, total, R, hand, id, mostSignificant) {
    var color = mostSignificant ? "red" : "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
    html[id].innerHTML = (value < 10 ? "0" : "") + value;
    html[id].style.color = Raphael.getRGB(color).hex;

    if (init) {
      hand.animate({arc: [value, total, R, mostSignificant]}, 900, ">");
    }
    else if (total == value) {
      hand.animate({arc: [value, total, R, mostSignificant]}, 100);
    }
    else {
      hand.animate({arc: [value, total, R, mostSignificant]}, 750, "elastic");
    }
  }

  function drawText(text) {
    r.text(300, 300, textWhenEnds).attr({fill: "red", 'font-family': "Helvetica Neue", 'font-size': "36px"});
  }

  function drawMarks(R, total) {
    if (total == 31) { // month
      var d = new Date;
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
      d.setDate(-1);
      total = d.getDate();
    }
    var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
        out = r.set();
    for (var value = 0; value < total; value++) {
      var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
          x = WIDTH / 2 + R * Math.cos(a),
          y = HEIGHT / 2 - R * Math.sin(a);
      out.push(r.circle(x, y, 2).attr(marksAttr));
    }
    return out;
  }

  initialize();

  (function () {
    var d = new Date,
        c = d.getTime(),
        totalSecondsLeft = Math.floor((timeEnds - c) / 1000);

    if (totalSecondsLeft > 0)
    {
      var daysLeft    = Math.floor(totalSecondsLeft / 3600 / 24),
          hoursLeft   = Math.floor(totalSecondsLeft / 3600 - daysLeft * 24),
          minutesLeft = Math.floor(totalSecondsLeft / 60 - hoursLeft * 60 - daysLeft * 24 * 60),
          secondsLeft = Math.floor(totalSecondsLeft - daysLeft * 24 * 3600 - hoursLeft * 3600 - minutesLeft * 60);

      updateVal(secondsLeft, 60, 160, sec, 3, false);
      updateVal(minutesLeft, 60, 120, min, 2, false);
      updateVal(hoursLeft,   24, 80, hor, 1, false);
      updateVal(daysLeft,    7, 40, day, 0, false);
      setTimeout(arguments.callee, 1000);
      init = false;
    }
    else
    {
      updateVal(0, 60, 160, sec, 3, false);
      updateVal(0, 60, 120, min, 2, false);
      updateVal(0,   24, 80, hor, 1, false);
      updateVal(0,    7, 40, day, 0, false);

      drawText("Time is Up!\nTime to present your hacks.");
      setTimeout(arguments.callee, 1000);
    }
  })();
};

var pullDate = function(element) {
  var v = element.currentTarget.value;
  $('#setTime').html(v);
  timeEnds = Date.parse(v);
  initialize();
}

var pullText = function(element) {
  var v = element.currentTarget.value;
  textWhenEnds = v;
}

$(function () {
  $("a[rel]").overlay({
    load: false,
    onLoad: function () {
      $("#datepicker").datetimepicker({
        showOn: "both",
        buttonImage: "images/calendar.gif",
        buttonImageOnly: true
      });

      $("#datepicker").change(pullDate);
      $("#textWhenEnds").change(pullText);
    }
  });
});
