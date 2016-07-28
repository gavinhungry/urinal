$(function() {
  'use strict';

  $('#uri').focus();
  var template = _.template($('#result').html());

  var saveUri = function(uri) {
    return $.ajax({
      method: 'POST',
      url: '/uri',
      contentType: 'application/json',
      data: JSON.stringify({
        uri: uri
      })
    });
  };

  $('#uri').on('keypress', function(e) {
    var $this = $(this);

    var uri = $this.val();

    if (!uri || e.keyCode !== 13) {
      return;
    }

    $this.attr('disabled', true);

    saveUri(uri).then(template).then(function(html) {
      $('#output').html(html);
    });
  });
});
